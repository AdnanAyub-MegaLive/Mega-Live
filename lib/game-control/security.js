import "server-only";
import { cookies } from "next/headers";
import { randomBytes, createHash, timingSafeEqual } from "node:crypto";
import { database } from "./db";
export class HttpError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.status = status;
  }
}
const digest = (x) => createHash("sha256").update(x).digest("hex");
export function sameOrigin(request) {
  const origin = process.env.APP_ORIGIN;
  if (!origin || request.headers.get("origin") !== new URL(origin).origin)
    throw new HttpError("Request origin is not allowed.", 403);
  if (!request.headers.get("content-type")?.startsWith("application/json"))
    throw new HttpError("JSON is required.", 415);
}
export async function jsonBody(request) {
  const raw = await request.text();
  if (raw.length > 12000) throw new HttpError("Request is too large.", 413);
  try {
    const value = JSON.parse(raw);
    if (!value || typeof value !== "object" || Array.isArray(value))
      throw Error();
    return value;
  } catch {
    throw new HttpError("Invalid request body.");
  }
}
export async function rateLimit(key, max = 30, seconds = 60) {
  const { db } = await database();
  const bucket = Math.floor(Date.now() / 1000 / seconds);
  const doc = await db
    .collection("rateLimits")
    .findOneAndUpdate(
      { _id: `${key}:${bucket}` },
      {
        $inc: { count: 1 },
        $setOnInsert: { expiresAt: new Date((bucket + 2) * seconds * 1000) },
      },
      { upsert: true, returnDocument: "after" },
    );
  if (doc.count > max)
    throw new HttpError("Too many requests. Please try again later.", 429);
}
export async function createSession(data) {
  const { db } = await database();
  const token = randomBytes(32).toString("hex");
  const duration = data.role === "admin" ? 8 * 3600 : 2 * 3600;
  await db
    .collection("sessions")
    .insertOne({
      _id: digest(token),
      ...data,
      expiresAt: new Date(Date.now() + duration * 1000),
    });
  (await cookies()).set(
    data.role === "admin" ? "mega_admin" : "mega_player",
    token,
    {
      httpOnly: true,
      secure: process.env.APP_ORIGIN?.startsWith("https://"),
      sameSite: "lax",
      path: "/",
      maxAge: duration,
    },
  );
}
export async function requireSession(role) {
  const token = (await cookies()).get(
    role === "admin" ? "mega_admin" : "mega_player",
  )?.value;
  if (!token) throw new HttpError("Please sign in.", 401);
  const { db } = await database();
  const session = await db
    .collection("sessions")
    .findOne({ _id: digest(token), role, expiresAt: { $gt: new Date() } });
  if (!session)
    throw new HttpError("Your session expired. Please sign in again.", 401);
  return session;
}
export async function signOut(role) {
  const jar = await cookies(),
    name = role === "admin" ? "mega_admin" : "mega_player",
    token = jar.get(name)?.value;
  if (token) {
    const { db } = await database();
    await db.collection("sessions").deleteOne({ _id: digest(token) });
  }
  jar.delete(name);
}
export async function adminLogin(password) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || expected.length < 16)
    throw new HttpError(
      "Set an admin password with at least 16 characters on the server.",
      503,
    );
  await rateLimit("admin-login-global", 10, 300);
  if (
    typeof password !== "string" ||
    !timingSafeEqual(
      Buffer.from(digest(password)),
      Buffer.from(digest(expected)),
    )
  )
    throw new HttpError("Incorrect password.", 401);
  await createSession({ role: "admin", uid: "admin" });
}
export async function verifiedLaunch(token) {
  if (typeof token !== "string" || token.length < 8 || token.length > 4096)
    throw new HttpError("A verified Mega launch token is required.", 401);
  const url = process.env.MEGA_LAUNCH_VERIFIER_URL,
    secret = process.env.MEGA_LAUNCH_VERIFIER_SECRET;
  if (!url || !secret)
    throw new HttpError(
      "Mega launch verification has not been connected. Ask the administrator to complete setup.",
      503,
    );
  if (new URL(url).protocol !== "https:")
    throw new HttpError("Launch verifier must use HTTPS.", 503);
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${secret}`,
    },
    body: JSON.stringify({ token }),
    signal: AbortSignal.timeout(10000),
    redirect: "error",
    cache: "no-store",
  });
  if (!response.ok)
    throw new HttpError("Mega launch could not be verified.", 401);
  const identity = await response.json();
  // Adapter contract, NOT a claimed Mega endpoint. Implement using Mega's actual launch specification.
  if (
    typeof identity.uid !== "string" ||
    !/^\d{1,20}$/.test(identity.uid) ||
    typeof identity.roomId !== "string" ||
    !identity.roomId ||
    identity.roomId.length > 100 ||
    typeof identity.nonce !== "string" ||
    identity.nonce.length < 16 ||
    identity.nonce.length > 200 ||
    !Number.isFinite(identity.expiresAt) ||
    identity.expiresAt * 1000 <= Date.now() ||
    identity.expiresAt * 1000 > Date.now() + 5 * 60 * 1000
  )
    throw new HttpError("Invalid or expired launch identity.", 401);
  const { db } = await database();
  try {
    await db
      .collection("launchNonces")
      .insertOne({
        _id: digest(identity.nonce),
        expiresAt: new Date(identity.expiresAt * 1000),
      });
  } catch (error) {
    if (error.code === 11000)
      throw new HttpError(
        "Launch token already used. Reopen the game from Mega.",
        401,
      );
    throw error;
  }
  await createSession({
    role: "player",
    uid: identity.uid,
    roomId: identity.roomId,
  });
  return identity;
}
export function failure(error) {
  console.error("Portal request failed:", error.message);
  return Response.json(
    {
      error:
        error instanceof HttpError
          ? error.message
          : "The service is unavailable. Please try again later.",
    },
    { status: error.status || 503, headers: { "Cache-Control": "no-store" } },
  );
}

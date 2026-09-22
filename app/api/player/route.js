import { database } from "@/lib/game-control/db";
import {
  sameOrigin,
  jsonBody,
  requireSession,
  verifiedLaunch,
  rateLimit,
  failure,
  HttpError,
} from "@/lib/game-control/security";
import { getMegaUser } from "@/lib/game-control/mega";
import { placeRound, publicRound } from "@/lib/game-control/rounds";
export const runtime = "nodejs";
export async function POST(request) {
  try {
    sameOrigin(request);
    const body = await jsonBody(request);
    const launchUser = body.action === "launch" ? await verifiedLaunch(body.token, body.roomId) : null;
    const identity = await requireSession("player");
    await rateLimit(`player:${identity.uid}`, 60, 60);
    const { db } = await database();
    if (body.action === "launch" || body.action === "profile") {
      const user = launchUser || await getMegaUser(identity.megaToken);
      if (String(user?.userId) !== identity.uid)
        throw new HttpError("Mega returned an unexpected player.", 502);
      await db
        .collection("sessions")
        .updateOne(
          { _id: identity._id },
          { $set: { nickname: user.nickname } },
        );
      const games = await db
        .collection("games")
        .find(
          { engine: { $in: ["flip", "roulette"] }, status: "active" },
          { projection: { _id: 0, roundCounter: 0 } },
        )
        .toArray();
      return Response.json(
        {
          user,
          roomId: identity.roomId,
          games,
          live: process.env.LIVE_BETTING_ENABLED === "true",
        },
        { headers: { "Cache-Control": "no-store" } },
      );
    }
    if (body.action === "bet")
      return Response.json({ round: await placeRound(identity, body) });
    if (body.action === "round") {
      if (typeof body.id !== "string") throw new HttpError("Invalid round ID.");
      const round = await db
        .collection("rounds")
        .findOne({ id: body.id, uid: identity.uid });
      if (!round) throw new HttpError("Round not found.", 404);
      return Response.json({ round: publicRound(round) });
    }
    throw new HttpError("Unknown action.");
  } catch (error) {
    return failure(error);
  }
}

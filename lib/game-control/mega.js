import "server-only";
import { createHash } from "node:crypto";
export class ProviderUncertainError extends Error {
  constructor(message, response) {
    super(message);
    this.providerResponse = response;
  }
}
export async function megaRequest(endpoint, uid, extra = {}) {
  const key = process.env.MEGACHAT_PRIVATE_KEY;
  if (!key) throw new Error("Mega API key is not configured.");
  const timestamp = String(Math.floor(Date.now() / 1000));
  const sign = createHash("md5")
    .update(key + String(uid) + timestamp)
    .digest("hex");
  const form = new FormData();
  Object.entries({ uid: String(uid), timestamp, sign, ...extra }).forEach(
    ([k, v]) => form.set(k, String(v)),
  );
  let response, result;
  try {
    response = await fetch(`https://napi.megachat.live/api/game/${endpoint}`, {
      method: "POST",
      body: form,
      redirect: "error",
      signal: AbortSignal.timeout(15000),
      cache: "no-store",
    });
    result = await response.json();
  } catch {
    throw new ProviderUncertainError(
      "No confirmed response from Mega. Do not retry a coin transfer.",
    );
  }
  if (!response.ok || result?.code !== 200)
    throw new ProviderUncertainError("Mega did not confirm success.", {
      code: result?.code,
      msg:
        typeof result?.msg === "string"
          ? result.msg.slice(0, 300)
          : "Unknown response",
    });
  return result;
}
export async function getMegaUser(uid) {
  return (await megaRequest("open_get_userinfo", uid)).data;
}
export async function transferCoins(uid, amount, type) {
  if (!Number.isSafeInteger(amount) || amount <= 0 || ![1, 2].includes(type))
    throw new Error("Invalid coin transfer.");
  return megaRequest("open_submitFlow", uid, { type, betAmount: amount });
}

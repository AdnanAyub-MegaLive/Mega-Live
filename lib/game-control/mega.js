import "server-only";

export class ProviderUncertainError extends Error {
  constructor(message, response) {
    super(message);
    this.providerResponse = response;
  }
}
export async function megaRequest(endpoint, token, extra = {}) {
  if (!["open_get_userinfo", "open_submitFlow"].includes(endpoint)) throw new Error("Unsupported Mega endpoint.");
  if (typeof token !== "string" || token.length < 8 || token.length > 4096 || /\s/.test(token)) throw new Error("Invalid Mega token. Reopen the game from Mega.");
  const form = new FormData();
  Object.entries(extra).forEach(([k,v]) => form.set(k,String(v)));
  let response, result;
  try {
    response = await fetch(`https://napi.megachat.live/api/game/${endpoint}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
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
      msg: "Provider rejected the request",
    });
  return result;
}
export async function getMegaUser(token) {
  return (await megaRequest("open_get_userinfo", token)).data;
}
export async function transferCoins(token, amount, type) {
  if (!Number.isSafeInteger(amount) || amount <= 0 || ![1, 2].includes(type))
    throw new Error("Invalid coin transfer.");
  return megaRequest("open_submitFlow", token, { type, betAmount: amount });
}

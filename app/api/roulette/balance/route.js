import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { STARTING_BALANCE } from "../../../../roulette/gameLogic";
import { BALANCE_COOKIE, decodeBalance, encodeBalance } from "../../../../roulette/balanceToken";

export const runtime = "nodejs";

// Returns the player's current server-tracked balance, creating a fresh
// signed session on first visit. This is what the client calls on load
// instead of assuming a hardcoded starting number.
export async function GET() {
  const cookieStore = await cookies();
  const existing = cookieStore.get(BALANCE_COOKIE)?.value;
  const balance = existing ? decodeBalance(existing) : STARTING_BALANCE;

  const response = NextResponse.json({ balance });
  if (!existing) {
    response.cookies.set(BALANCE_COOKIE, encodeBalance(STARTING_BALANCE), {
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
  }
  return response;
}

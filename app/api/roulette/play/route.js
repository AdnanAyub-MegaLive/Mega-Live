import { randomInt } from "crypto";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { STARTING_BALANCE, sanitizeBets, settleRound } from "../../../../roulette/gameLogic";
import { BALANCE_COOKIE, decodeBalance, encodeBalance } from "../../../../roulette/balanceToken";

export const runtime = "nodejs";

// The one endpoint that actually decides a round. The client sends only its
// intent (which markets it bet on, how much) -- it never sends a result, a
// win flag, or a new balance, and nothing it sends is trusted as the
// player's current balance either (that comes from the signed cookie, not
// the request body). The server:
//   1. Re-derives the real current balance from the signed cookie.
//   2. Validates the bets and rejects anything the balance can't cover.
//   3. Rolls the winning number itself with a CSPRNG (crypto.randomInt),
//      not Math.random() -- this can no longer be predicted or replayed
//      from the browser.
//   4. Computes the payout from the shared rules and re-signs the new
//      balance into the response cookie.
export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const cookieStore = await cookies();
  const existing = cookieStore.get(BALANCE_COOKIE)?.value;
  const currentBalance = existing ? decodeBalance(existing) : STARTING_BALANCE;

  const sanitized = sanitizeBets(body?.bets);
  const wagered = Object.values(sanitized).reduce((sum, amount) => sum + amount, 0);

  if (wagered <= 0) {
    return NextResponse.json({ error: "no_valid_bets" }, { status: 400 });
  }
  if (wagered > currentBalance) {
    return NextResponse.json(
      { error: "insufficient_balance", balance: currentBalance },
      { status: 400 },
    );
  }

  const winningNumber = randomInt(0, 37);
  const { payout, net } = settleRound(sanitized, winningNumber);
  const newBalance = currentBalance - wagered + payout;

  const response = NextResponse.json({
    result: winningNumber,
    wagered,
    payout,
    net,
    balance: newBalance,
  });
  response.cookies.set(BALANCE_COOKIE, encodeBalance(newBalance), {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return response;
}

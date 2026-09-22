import "server-only";
import { randomInt } from "node:crypto";
import { database, transact } from "./db";
import { resolveRoulette, strictBets } from "./roulette/engine.mjs";
import { resolveRound } from "./rules.mjs";
import { transferCoins } from "./mega";
import { HttpError } from "./security";
export function publicRound(r) {
  if (!r) return null;
  const { id, gameId, gameName, bet, status, createdAt } = r;
  return {
    id,
    gameId,
    gameName,
    bet,
    status,
    createdAt,
    ...(status === "settled"
      ? {
          outcome: r.outcome,
          payout: r.payout,
          result: r.result,
          choice: r.choice,
          winProbability: r.winProbability,
          payoutMultiplier: r.payoutMultiplier,
          bets: r.bets,
          pocketWeights: r.pocketWeights,
        }
      : {}),
  };
}
export async function placeRound(identity, input) {
  if (process.env.LIVE_BETTING_ENABLED !== "true")
    throw new HttpError(
      "Live betting is not enabled. Complete the launch and wallet integration first.",
      503,
    );
  if (!identity.megaToken)
    throw new HttpError("Mega wallet is not configured.", 503);
  const { id, gameId, bet, choice, revision } = input;
  if (
    typeof id !== "string" ||
    !/^[a-f0-9-]{36}$/.test(id) ||
    typeof gameId !== "string" ||
    gameId.length > 50
  )
    throw new HttpError("Invalid round request.");
  const { db } = await database();
  const prior = await db.collection("rounds").findOne({ id });
  if (prior) {
    if (
      prior.uid !== identity.uid ||
      prior.gameId !== gameId ||
      prior.bet !== bet ||
      (input.bets
        ? JSON.stringify(prior.bets) !== JSON.stringify(strictBets(input.bets))
        : prior.choice !== choice)
    )
      throw new HttpError("Round ID has already been used.", 409);
    return publicRound(prior);
  }
  let round;
  try {
    round = await transact(async (db, session) => {
      const game = await db
        .collection("games")
        .findOne({ id: gameId }, { session });
      if (!game || !["flip", "roulette"].includes(game.engine))
        throw new HttpError("This game engine is not connected.", 409);
      if (revision !== game.revision)
        throw new HttpError(
          "Game rules changed. Reload the game and review the new rules.",
          409,
        );
      let resolved;
      try {
        resolved =
          game.engine === "roulette"
            ? resolveRoulette(
                game,
                input.bets,
                randomInt(game.pocketWeights.reduce((s, w) => s + w, 0)),
              )
            : resolveRound(game, bet, choice, randomInt(10000));
        if (resolved.bet !== bet)
          throw new Error("Bet total does not match the selected markets.");
      } catch (e) {
        throw new HttpError(e.message);
      }
      // Touch the game to serialize acceptance against concurrent configuration edits.
      await db
        .collection("games")
        .updateOne(
          { id: gameId, revision },
          { $inc: { roundCounter: 1 } },
          { session },
        );
      const record = {
        id,
        uid: identity.uid,
        nickname: identity.nickname || identity.uid,
        roomId: identity.roomId,
        gameId,
        gameName: game.name,
        ...resolved,
        status: "debit_pending",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await db
        .collection("walletLocks")
        .insertOne(
          { _id: identity.uid, roundId: id, createdAt: new Date() },
          { session },
        );
      await db.collection("rounds").insertOne(record, { session });
      return record;
    });
  } catch (error) {
    if (error.code === 11000)
      throw new HttpError(
        "A round is already processing or awaiting wallet review. Do not submit another bet.",
        409,
      );
    throw error;
  }
  // External calls deliberately sit OUTSIDE retriable MongoDB transaction callbacks.
  // Every stage is persisted first. Never automatically replay an incomplete transfer.
  try {
    const debit = await transferCoins(identity.megaToken, bet, 1);
    await db.collection("rounds").updateOne(
      { id },
      {
        $set: {
          debitResponse: debit,
          status: round.payout > 0 ? "credit_pending" : "debit_confirmed",
          updatedAt: new Date().toISOString(),
        },
      },
    );
    if (round.payout > 0) {
      const credit = await transferCoins(identity.megaToken, round.payout, 2);
      await db.collection("rounds").updateOne(
        { id },
        {
          $set: {
            creditResponse: credit,
            status: "credit_confirmed",
            updatedAt: new Date().toISOString(),
          },
        },
      );
    }
    await transact(async (db, session) => {
      await db
        .collection("rounds")
        .updateOne(
          { id },
          { $set: { status: "settled", updatedAt: new Date().toISOString() } },
          { session },
        );
      await db
        .collection("walletLocks")
        .deleteOne({ _id: identity.uid, roundId: id }, { session });
    });
    return publicRound({ ...round, status: "settled" });
  } catch (error) {
    // Keep the player lock until an operator reconciles against provider evidence.
    await db
      .collection("rounds")
      .updateOne(
        { id },
        {
          $set: {
            status: "needs_review",
            reviewReason: error.message,
            providerError: error.providerResponse || null,
            updatedAt: new Date().toISOString(),
          },
        },
      )
      .catch(() => {});
    return publicRound({ ...round, status: "needs_review" });
  }
}

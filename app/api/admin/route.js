import { randomUUID } from "node:crypto";
import { database, transact } from "@/lib/game-control/db";
import {
  sameOrigin,
  jsonBody,
  adminLogin,
  requireSession,
  signOut,
  failure,
  HttpError,
} from "@/lib/game-control/security";
import { validateGame } from "@/lib/game-control/rules.mjs";
export const runtime = "nodejs";
const defaults = [
  {
    id: "lucky-flip",
    name: "Lucky Flip",
    engine: "flip",
    status: "paused",
    winProbability: 45,
    payoutMultiplier: 2,
    minBet: 10,
    maxBet: 1000,
    category: "Instant",
    color: "purple",
    revision: 1,
  },
  {
    id: "roulette",
    name: "Roulette",
    engine: "roulette",
    status: "paused",
    winProbability: null,
    payoutMultiplier: null,
    minBet: 10,
    maxBet: 1000,
    category: "Table game",
    color: "orange",
    pocketWeights: Array(37).fill(1),
    revision: 1,
  },
];
export async function POST(request) {
  try {
    sameOrigin(request);
    const body = await jsonBody(request);
    if (body.action === "login") {
      await adminLogin(body.password);
      return Response.json({ ok: true });
    }
    await requireSession("admin");
    if (body.action === "logout") {
      await signOut("admin");
      return Response.json({ ok: true });
    }
    const { db } = await database();
    if (body.action === "snapshot") {
      for (const game of defaults)
        await db
          .collection("games")
          .updateOne({ id: game.id }, { $setOnInsert: game }, { upsert: true });
      const [games, rounds, audit, totalRounds] = await Promise.all([
        db
          .collection("games")
          .find({}, { projection: { _id: 0, roundCounter: 0 } })
          .toArray(),
        db
          .collection("rounds")
          .find({}, { projection: { _id: 0 } })
          .sort({ createdAt: -1, id: -1 })
          .limit(1000)
          .toArray(),
        db
          .collection("audit")
          .find({}, { projection: { _id: 0 } })
          .sort({ createdAt: -1, id: -1 })
          .limit(100)
          .toArray(),
        db.collection("rounds").countDocuments(),
      ]);
      return Response.json(
        {
          games,
          rounds,
          audit,
          totalRounds,
          integration: {
            database: true,
            wallet: true,
            launch: true,
            live: process.env.LIVE_BETTING_ENABLED === "true",
          },
        },
        { headers: { "Cache-Control": "no-store" } },
      );
    }
    if (body.action === "olderRounds") {
      if (
        typeof body.beforeId !== "string" || typeof body.before !== "string" ||
        !Number.isFinite(Date.parse(body.before))
      )
        throw new HttpError("Invalid log cursor.");
      const rounds = await db
        .collection("rounds")
        .find({$or:[{createdAt:{$lt:body.before}},{createdAt:body.before,id:{$lt:body.beforeId}}]}, {projection:{_id:0}})
        .sort({ createdAt: -1, id: -1 })
        .limit(1000)
        .toArray();
      return Response.json({ rounds });
    }
    if (body.action === "saveGame") {
      let game;
      try {
        game = validateGame(body.game);
      } catch (e) {
        throw new HttpError(e.message);
      }
      const result = await transact(async (db, session) => {
        const before = await db
          .collection("games")
          .findOne({ id: game.id }, { session });
        if (before && body.game.revision !== before.revision)
          throw new HttpError(
            "Settings changed in another session. Reload before saving.",
            409,
          );
        if (!before && body.game.revision)
          throw new HttpError("Game not found.", 404);
        const after = { ...game, revision: (before?.revision || 0) + 1 };
        await db
          .collection("games")
          .updateOne(
            { id: game.id },
            { $set: after },
            { upsert: true, session },
          );
        const audit = {
          id: randomUUID(),
          gameId: game.id,
          gameName: game.name,
          actor: "Administrator",
          action: before ? "Settings updated" : "Game created",
          before: before
            ? { ...before, _id: undefined, roundCounter: undefined }
            : null,
          after,
          createdAt: new Date().toISOString(),
        };
        await db.collection("audit").insertOne(audit, { session });
        return { game: after, audit };
      });
      return Response.json(result);
    }
    throw new HttpError("Unknown action.");
  } catch (error) {
    return failure(error);
  }
}

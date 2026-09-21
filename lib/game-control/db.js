import "server-only";
import { MongoClient } from "mongodb";
let connection;
export async function database() {
  if (!process.env.MONGODB_URI) throw new Error("MongoDB is not configured.");
  if (!connection) {
    const client = new MongoClient(process.env.MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 7000,
    });
    connection = client
      .connect()
      .then(async (client) => {
        const db = client.db(process.env.MONGODB_DB || "mega_games");
        await Promise.all([
          db.collection("games").createIndex({ id: 1 }, { unique: true }),
          db.collection("rounds").createIndex({ id: 1 }, { unique: true }),
          db.collection("rounds").createIndex({ createdAt: -1 }),
          db.collection("rounds").createIndex({ uid: 1, createdAt: -1 }),
          db
            .collection("sessions")
            .createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
          db
            .collection("launchNonces")
            .createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
          db
            .collection("rateLimits")
            .createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
          db.collection("audit").createIndex({ createdAt: -1 }),
        ]);
        return { client, db };
      })
      .catch((error) => {
        connection = undefined;
        throw error;
      });
  }
  return connection;
}
export async function transact(fn) {
  const { client, db } = await database();
  const session = client.startSession();
  try {
    return await session.withTransaction(() => fn(db, session));
  } finally {
    await session.endSession();
  }
}

import { createHmac, randomBytes } from "crypto";
import { STARTING_BALANCE } from "./gameLogic";

// No database is wired up yet, so the balance is carried in a signed,
// httpOnly cookie instead of trusting anything the client sends back. The
// server is the only party that can produce a valid signature, so even
// though the *value* lives in the browser, it cannot be edited there --
// any tampering invalidates the signature and the server falls back to a
// fresh starting balance rather than trusting the altered value.
//
// This makes gameplay tamper-proof today without a database, but it is
// still NOT the same as being tied to the user's real MegaLive coin wallet
// -- that requires the backend endpoints described in
// GAME_BACKEND_INTEGRATION_SPEC.md (in the Mega_source_code repo) once
// there is real backend access to build them against.
//
// IMPORTANT for production: set ROULETTE_SECRET in the deployment's
// environment to a long random value. The fallback below only exists so
// this works out of the box before that env var is configured; anyone who
// can read this source knows the fallback secret, so it must not be relied
// on once real value is at stake.
const SECRET =
  process.env.ROULETTE_SECRET ||
  "dev-only-fallback-secret-set-ROULETTE_SECRET-env-var-before-real-money";

export const BALANCE_COOKIE = "rb_session";

function sign(payload) {
  return createHmac("sha256", SECRET).update(payload).digest("hex");
}

export function encodeBalance(balance) {
  const nonce = randomBytes(8).toString("hex");
  const payload = `${balance}.${nonce}`;
  return `${payload}.${sign(payload)}`;
}

export function decodeBalance(token) {
  if (!token || typeof token !== "string") return STARTING_BALANCE;
  const parts = token.split(".");
  if (parts.length !== 3) return STARTING_BALANCE;
  const [balanceStr, nonce, signature] = parts;
  const payload = `${balanceStr}.${nonce}`;
  if (sign(payload) !== signature) return STARTING_BALANCE;
  const balance = Number(balanceStr);
  return Number.isFinite(balance) ? balance : STARTING_BALANCE;
}

# Mega Live Game Control

Next.js 16 / React 19 management portal and in-room game interface. The implementation is also integrated into the existing Mega-Live checkout at `/Users/apple/Downloads/Mega-Work/Mega-Live`.

## What works

- Dashboard showing settled bets, gross payouts, net game revenue and recent rounds.
- Game catalog, pause/activate controls, configurable bet limits and launch links.
- Lucky Flip probability and gross payout configuration.
- Roulette reuses the existing Mega-Live `gameLogic.js` rules and wheel artwork: European 37-pocket wheel; zero 36×, dozens 3×, red/black/odd/even 2×.
- Roulette pocket weights control probability independently of the player's wager. The UI discloses resulting market and pocket odds. Equal weights reproduce the original uniform wheel.
- Player choice and wager validation, server CSPRNG results, integer-coin payouts.
- Search/filter/paginated round logs, round details and CSV export.
- Versioned settings and before/after audit records. A round keeps its exact accepted configuration.
- Backend MongoDB collections and server-only Mega wallet integration, disabled until configured.
- Admin login with a server-held password, opaque HTTP-only sessions and rate limiting.
- Practice mode: in-memory synthetic records and practice coins, reset on reload. It never calls Mega.

## Run in the existing Mega-Live application

Install dependencies with `npm install`. Copy `.env.example` to `.env.local` and set the values on your server, never in browser code.

For the demo:

```sh
npm run dev:demo
```

Routes in the existing application:

- `/admin`: game management portal
- `/roulette`: Roulette player
- `/play?game=lucky-flip`: Lucky Flip player
- `/play?game=roulette`: Roulette player through the catalog

The original marketing pages and original `roulette/` source remain. The previous `/api/roulette/balance` and `/api/roulette/play` cookie-wallet routes now return HTTP 410. They must not remain a second live betting path.

## Configure the server

The production origin is `https://megachat.live`. Set the values from `.env.example` in your hosting provider's environment settings, or copy it to `.env.production.local` for a self-hosted Next.js server. Environment files containing secrets are excluded from Git. Blank values must be supplied before real mode can function; the example does not contain working credentials. For local real-mode development, use `.env.local` with `APP_ORIGIN=http://localhost:3000`. Rebuild after changing `NEXT_PUBLIC_DEMO_MODE`.

Production routes: `/admin` for management, `/roulette` for Roulette, and `/play?game=lucky-flip` for Lucky Flip. Keep `LIVE_BETTING_ENABLED=false` until launch verification and wallet reconciliation are ready.

- `NEXT_PUBLIC_DEMO_MODE=false`: compile real mode (changing it requires rebuilding).
- `MONGODB_URI`: Atlas connection string or MongoDB replica set URI. Transactions require a replica set; standalone MongoDB is insufficient.
- `MONGODB_DB=mega_games`
- `ADMIN_PASSWORD`: at least 16 characters. Set through your deployment secret manager.
- `APP_ORIGIN`: exact externally visible HTTPS origin. Used for same-origin POST checks and secure cookies.
- `MEGACHAT_PRIVATE_KEY`: the provider secret, server-only. Never use `NEXT_PUBLIC_` for it.
- `LIVE_BETTING_ENABLED=false`: leave off until launch verification and reconciliation have been tested against a provider test user.

Build with `npm run build` and start with `npm start` in the Mega-Live project. In this standalone review package, `npm run build` exports a static DEMO, while `npm run build:server` builds the actual Node backend. Never use the static review build as a live wallet backend.

## Bearer-token launch authentication

Mega opens /roulette?token=<ss_token>&roomId=<roomId>. The browser immediately removes the token from the URL and posts it to /api/player. The backend calls open_get_userinfo with Authorization: Bearer <ss_token> and trusts only the user ID returned in a successful provider JSON response. JWT claims are not used to establish identity.

The provider token is stored only in the MongoDB player session (two-hour expiry); the browser receives an opaque HTTP-only session cookie. Restrict database access to trusted backend operators. Tokens are not included in logs, round records or frontend responses. Every profile refresh and transfer uses the provider token, so provider rejection fails closed. Reopen the game when a token or session expires. The provider has not documented single-use launch semantics, so reusable tokens are supported.

roomId is validated for format but remains app-supplied attribution, not authenticated room membership. Do not use it to authorize access to private room data. Shared room rounds are not implemented.

For controlled testing only, open_get_gamelists obtains ss_token using the server-only private key and UID/timestamp/sign. Normal app launches supply the token directly; no public token-minting endpoint is exposed here. The legacy MEGA_LAUNCH_VERIFIER_URL and MEGA_LAUNCH_VERIFIER_SECRET are no longer used.

## Wallet transaction flow

1. Validate session, game revision, wager, choice and game status.
2. Within a MongoDB transaction, snapshot game rules/result, write `debit_pending`, and acquire a unique per-player wallet lock. Touching the game document serializes acceptance with settings updates.
3. Outside MongoDB retry callbacks, send exactly one debit to `open_submitFlow` (`type=1`).
4. Persist debit confirmation. If gross payout is positive, persist `credit_pending` then send one credit (`type=2`). Roulette can have a positive gross payout even when player net is a loss or break-even.
5. Mark settled and release the player lock atomically.

If the provider returns an error, a timeout occurs, or a database write fails after an external call, the round stays pending/needs_review and the player remains locked. Do not blindly retry, automatically refund, delete the lock, or recreate the round. Reconcile with the provider's transaction evidence first. These supplied APIs have no transaction ID/idempotency field or transaction-status/history endpoint, so automatic exactly-once settlement and automatic recovery cannot be guaranteed. A production operator reconciliation workflow/provider status API is still required. A balance snapshot alone is not enough to prove what happened.

Player requests use an operation UUID. Duplicate accepted IDs return the existing round and never make another transfer. Pending outcomes are not disclosed to the player. API HTTP 200 is not enough: application `code` must equal 200.

## Probability and outcome semantics

Flip win probability is applied to every player equally and shown before betting. Gross payout includes stake; whole-coin payouts round down.

Roulette probabilities derive from pocket weights, independent of wager placement. Do not interpret a pocket weight as an overall player win rate. Multiple markets can pay on one number. Logs label positive net as win, negative net as loss, and zero net as break-even. Existing rounds retain their original weights when admin changes settings.

Each player round is independent. This implementation does not synchronize one shared roulette spin across every player in a room; room IDs are logged for attribution. Shared timed rounds would require a separate room-round scheduler and pooled betting window.

Adding a configuration for an existing engine is supported. A genuinely new game requires implementing and validating its server engine and player UI, then registering it in the game catalog.

## MongoDB collections

`games`, `rounds`, `audit`, `walletLocks`, `sessions`, `launchNonces`, `rateLimits`.

Session, nonce and rate-limit collections use TTL indexes. Rounds and audit history have no automatic deletion. Admin initially loads the newest 1,000 rounds and can load older batches. Exports cover matching loaded rows. Dashboard totals are scoped to loaded settled records.

## Validation

`npm test` in this package or `npm run test:games` in Mega-Live runs deterministic rules and mocked wallet tests. No test submits a real coin transaction.

Local MongoDB connection and a transaction read were verified. End-to-end app launch, Vercel connectivity and live settlement still require deployment validation. No real coin transfer was performed while building this portal.

"use client";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { initialDemo } from "@/lib/game-control/demo";
import { resolveRoulette } from "@/lib/game-control/roulette/engine.mjs";
import { validateGame, resolveRound } from "@/lib/game-control/rules.mjs";
const Context = createContext(null);
export const isDemo = process.env.NEXT_PUBLIC_DEMO_MODE === "true";
export async function api(surface, body) {
  const response = await fetch(`/api/${surface}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error("The server could not complete this request.");
  }
  if (!response.ok) {
    const error = new Error(data.error || "Request failed.");
    error.status = response.status;
    throw error;
  }
  return data;
}
export function Store({ children }) {
  const [mounted,setMounted]=useState(false);
  useEffect(()=>setMounted(true),[]);
  const [data, setData] = useState(() =>
    isDemo ? initialDemo() : { games: [], rounds: [], audit: [] },
  );
  const [authenticated, setAuthenticated] = useState(isDemo),
    [loading, setLoading] = useState(!isDemo),
    [error, setError] = useState("");
  const stateRef = useRef(data);
  stateRef.current = data;
  async function refresh() {
    if (isDemo) return;
    setLoading(true);
    try {
      const value = await api("admin", { action: "snapshot" });
      setData(value);
      setAuthenticated(true);
      setError("");
    } catch (e) {
      if (e.status === 401) setAuthenticated(false);
      else setError(e.message);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    if (!isDemo && !(location.pathname.startsWith("/play") || location.pathname.startsWith("/roulette"))) refresh();
  }, []);
  async function login(password) {
    await api("admin", { action: "login", password });
    await refresh();
  }
  async function saveGame(input) {
    const game = validateGame(input);
    if (!isDemo) {
      const result = await api("admin", {
        action: "saveGame",
        game: { ...game, revision: input.revision },
      });
      setData((prev) => ({
        ...prev,
        games: prev.games.some((g) => g.id === game.id)
          ? prev.games.map((g) => (g.id === game.id ? result.game : g))
          : [...prev.games, result.game],
        audit: [result.audit, ...prev.audit],
      }));
      return result.game;
    }
    const before = stateRef.current.games.find((g) => g.id === game.id);
    if (before && input.revision !== before.revision)
      throw new Error("Settings changed. Reopen this game.");
    const after = { ...game, revision: (before?.revision || 0) + 1 };
    const audit = {
      id: crypto.randomUUID(),
      gameId: game.id,
      gameName: game.name,
      actor: "Demo administrator",
      action: before ? "Settings updated" : "Game created",
      before,
      after,
      createdAt: new Date().toISOString(),
    };
    setData((prev) => ({
      ...prev,
      games: before
        ? prev.games.map((g) => (g.id === game.id ? after : g))
        : [...prev.games, after],
      audit: [audit, ...prev.audit],
    }));
    return after;
  }
  function demoBet(gameId, bet, choice, bets) {
    if (!isDemo) throw new Error("Demo is disabled.");
    const game = stateRef.current.games.find((g) => g.id === gameId);
    if (!game) throw new Error("Game not found.");
    if (bet > stateRef.current.balance)
      throw new Error("Not enough demo coins.");
    let random;
    do {
      random = crypto.getRandomValues(new Uint32Array(1))[0];
    } while (random >= 4294960000);
    const result =
      game.engine === "roulette"
        ? resolveRoulette(
            game,
            bets,
            randomDraw(game.pocketWeights.reduce((s, w) => s + w, 0)),
          )
        : resolveRound(game, bet, choice, random % 10000);
    const round = {
      id: crypto.randomUUID(),
      uid: "demo-player",
      nickname: "Demo Player",
      roomId: "demo-room",
      gameId,
      gameName: game.name,
      ...result,
      status: "settled",
      createdAt: new Date().toISOString(),
      demo: true,
    };
    const next = {
      ...stateRef.current,
      balance: stateRef.current.balance - bet + round.payout,
      rounds: [round, ...stateRef.current.rounds],
    };
    stateRef.current = next;
    setData(next);
    return round;
  }
  async function loadOlder() {
    const rows = data.rounds;
    if (!rows.length) return;
    const result = await api("admin", {
      action: "olderRounds",
      before: rows[rows.length - 1].createdAt,
      beforeId: rows[rows.length-1].id,
    });
    setData((prev) => ({
      ...prev,
      rounds: [...prev.rounds, ...result.rounds],
    }));
  }
  if(!mounted)return <div className="boot-screen" role="status">Loading Mega Game Control…</div>;
  return (
    <Context.Provider
      value={{
        data,
        authenticated,
        loading,
        error,
        refresh,
        login,
        saveGame,
        demoBet,
        loadOlder,
      }}
    >
      {children}
    </Context.Provider>
  );
}
function randomDraw(max) {
  const bound = Math.floor(4294967296 / max) * max;
  let n;
  do {
    n = crypto.getRandomValues(new Uint32Array(1))[0];
  } while (n >= bound);
  return n % max;
}
export function useStore() {
  return useContext(Context);
}

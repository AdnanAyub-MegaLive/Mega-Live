export const initialGames = [
  {
    id: "lucky-flip",
    name: "Lucky Flip",
    engine: "flip",
    category: "Instant",
    status: "active",
    winProbability: 45,
    payoutMultiplier: 2,
    minBet: 10,
    maxBet: 1000,
    revision: 1,
    color: "purple",
  },
  {
    id: "lucky-flip-high",
    name: "Lucky Flip High",
    engine: "flip",
    category: "Instant",
    status: "paused",
    winProbability: 25,
    payoutMultiplier: 3.6,
    minBet: 50,
    maxBet: 5000,
    revision: 1,
    color: "orange",
  },
];
export function initialDemo() {
  const names = ["Alex Chen", "Maya", "Rohan", "Sofia", "Leo Park", "Aisha"];
  const rows = Array.from({ length: 48 }, (_, i) => {
    const won = i % 7 < 3;
    const bet = [100, 250, 500, 1000, 50, 200][i % 6];
    return {
      id: `DEMO-${1048 - i}`,
      uid: `demo-${101 + (i % 6)}`,
      nickname: names[i % 6],
      roomId: `room-${201 + (i % 4)}`,
      gameId: "lucky-flip",
      gameName: "Lucky Flip",
      bet,
      payout: won ? bet * 2 : 0,
      outcome: won ? "win" : "loss",
      status: "settled",
      createdAt: new Date(Date.now() - i * 35 * 60000).toISOString(),
      winProbability: 45,
      payoutMultiplier: 2,
      revision: 1,
      choice: "heads",
      result: won ? "heads" : "tails",
      demo: true,
    };
  });
  return { games: initialGames, rounds: rows, audit: [], balance: 10000 };
}
export const formatCoins = (n) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(n || 0);
initialGames.push({
  id: "roulette",
  name: "Roulette",
  engine: "roulette",
  category: "Table game",
  status: "active",
  winProbability: null,
  payoutMultiplier: null,
  pocketWeights: Array(37).fill(1),
  minBet: 5,
  maxBet: 1000,
  revision: 1,
  color: "orange",
});

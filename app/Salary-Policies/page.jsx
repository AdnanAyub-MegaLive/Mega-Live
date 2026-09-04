import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Host Salary Policies | Mega Chat Live",
  description: "Host salary tiers and payout rates for Mega Chat Live."
};

const salaryPolicies = [
  [1,  "450,000",     "$5.00",     "1.00%",  "$0.08",  "__"],
  [2,  "900,000",     "$10.00",     "1.00%",  "$0.15",  "__"],
  [3,  "1,350,000",   "$15.00",     "3.00%",  "$0.45",  "__"],
  [4,  "2,250,000",   "$25.00",    "3.00%",  "$0.75",  "__"],

  [5,  "5,400,000",   "$60.00",    "4.00%",  "$2.70",   "150K + VIP-1 (3 Days)"],
  [6,  "8,100,000",   "$90.00",    "4.00%",  "$4.05",   "150K + VIP-1 (5 Days)"],
  [7,  "10,350,000",  "$115.00",    "6.00%",  "$6.90",   "200K + VIP-1 (7 Days)"],

  [8,  "13,500,000",  "$150.00",    "6.00%",  "$9.00",   "250K + VIP-2 (3 Days)"],
  [9,  "20,250,000",  "$225.00",   "7.00%",  "$16.88",  "400K + VIP-2 (5 Days)"],
  [10, "24,750,000",  "$275.00",   "7.00%",  "$20.63",  "500K + VIP-3 (7 Days)"],

  [11, "47,250,000",  "$525.00",   "9.00%",  "$47.25",  "900K + VIP-3 (10 Days)"],
  [12, "60,750,000",  "$675.00",   "9.00%",  "$60.75",  "1.25M + VIP-3 (14 Days)"],

  [13, "74,250,000",  "$825.00",   "10.00%", "$86.63",  "1.5M + VIP-4 (7 Days)"],
  [14, "101,700,000", "$1,130.00",   "10.00%", "$118.65", "2M + VIP-4 (10 Days)"],
  [15, "115,200,000", "$1,280.00",   "12.00%", "$153.60", "2.25M + VIP-4 (14 Days)"],
  [16, "135,000,000", "$1,500.00",   "12.00%", "$180.00", "2.5M + VIP-4 (21 Days)"],

  [17, "160,200,000", "$1,780.00",   "13.00%", "$240.30", "3M + VIP-5 (10 Days)"],
  [18, "202,500,000", "$2,250.00", "13.00%", "$303.75", "4M + VIP-5 (15 Days)"],
  [19, "236,700,000", "$2,630.00", "15.00%", "$394.50", "4.5M + VIP-5 (21 Days)"],
  [20, "337,500,000", "$3,750.00", "15.00%", "$562.50", "6.5M + VIP-5 (30 Days)"]
];

export default function SalaryPoliciesPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_15%_0%,rgba(5,213,255,0.25),transparent_20%),radial-gradient(circle_at_90%_17%,rgba(215,151,34,0.2),transparent_24%),linear-gradient(145deg,#03153f_0%,#052c6f_48%,#087fd1_100%)] px-3 py-4 text-white min-[380px]:px-4 sm:px-8 sm:py-6 lg:py-10">
      <section className="mx-auto max-w-295">
        <nav className="mb-5 flex items-center justify-between gap-3 sm:mb-8">
          <Link href="/" className="flex min-w-0 items-center gap-2 font-black sm:gap-3">
            <Image src="/assets/megalive-logo.png" alt="Mega Chat Live" width={60} height={60} className="h-11 w-11 shrink-0 object-contain sm:h-13 sm:w-13" priority />
            <span className="truncate text-sm min-[380px]:text-base">Mega Chat Live</span>
          </Link>
          <Link className="shrink-0 rounded-full border border-white/30 bg-white/10 px-3 py-2 text-[10px] font-black uppercase transition hover:-translate-y-0.5 hover:border-[#6fdbff] hover:bg-white/15 min-[380px]:px-4 min-[380px]:text-xs sm:px-5 sm:py-2.5" href="/">Back home</Link>
        </nav>

        <header className="relative overflow-hidden rounded-3xl border border-[#6fdbff]/55 bg-[radial-gradient(circle_at_84%_12%,rgba(5,213,255,0.30),transparent_28%),radial-gradient(circle_at_12%_105%,rgba(215,151,34,0.28),transparent_35%),#020b27] px-4 py-9 text-center shadow-[0_24px_70px_rgba(2,11,34,0.35)] min-[380px]:px-5 sm:rounded-4xl sm:p-12">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-size-[72px_72px] opacity-30" />
          <div className="relative">
            <p className="mb-3 text-[10px] font-black uppercase tracking-[0.22em] text-[#67e8ff] sm:text-xs sm:tracking-[0.3em]">Mega Chat Live</p>
            <h1 className="text-[clamp(32px,9vw,72px)] font-black leading-[1.02] mb-16">Host <span className="text-[#ffd34f]">Salary</span> Policies</h1>
            {/* <p className="mx-auto mt-5 inline-flex rounded-full border border-[#ffd34f]/60 bg-[#ffd34f]/10 px-4 py-2 text-sm font-black text-[#ffd34f] shadow-[0_0_28px_rgba(215,151,34,0.12)] sm:text-base">
              1 USD = 200,000 Diamonds
            </p> */}
            <div className="mx-auto mt-3 flex max-w-190 flex-col items-center justify-center gap-2 text-xs font-bold text-white/75 sm:flex-row sm:text-sm">
              <span className="uppercase tracking-[0.14em] text-[#67e8ff]">Recharge rules</span>
              <span className="hidden text-white/30 sm:inline" aria-hidden="true">•</span>
              <span>Through Agents: <strong className="text-white">1 USD = 50,000 Coins</strong></span>
              <span className="hidden text-white/30 sm:inline" aria-hidden="true">•</span>
              <span>Through Google: <strong className="text-white">1 USD = 42,000 Coins</strong></span>
            </div>
            <p className="mx-auto mt-5 max-w-190 text-sm leading-6 text-white/75 sm:mt-6 sm:text-base sm:leading-7">
              Review the Host Salary and Agency tiers, diamond targets, and applicable payouts available through Mega Chat Live.
            </p>
          </div>
        </header>

        <div className="mt-7 overflow-hidden rounded-2xl border border-white/15 bg-[#04102d]/85 shadow-[0_24px_70px_rgba(2,11,34,0.3)] backdrop-blur-xl sm:mt-8 sm:rounded-3xl">
          <div className="border-b border-white/12 px-5 py-4 sm:px-6">
            <h2 className="text-lg font-black sm:text-xl">Host Salary Schedule</h2>
            <p className="mt-1 text-sm text-white/65">Host Salary and Agency payouts are shown for every diamond target tier.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-100 border-collapse text-left">
              <caption className="sr-only">Host salary and agency policy tiers, diamond targets, rates, and agency payouts</caption>
              <thead className="bg-[linear-gradient(90deg,#064ba8,#087fd1,#05bde9)] text-xs uppercase tracking-[0.12em] text-white sm:text-sm">
                <tr>
                  <th scope="col" className="px-2 py-4 font-semibold">Lv</th>
                  <th scope="col" className="px-2 py-4 font-semibold">Target in Coins</th>
                  <th scope="col" className="px-2 py-4 text-right font-semibold">Host Salary</th>
                  <th scope="col" className="px-2 py-4 font-semibold">Agency %</th>
                  <th scope="col" className="px-2 py-4 text-right font-semibold">Agency USD</th>
                  <th scope="col" className="px-2 py-4 text-right font-semibold">Reward</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 text-sm sm:text-base">
                {salaryPolicies.map(([level, target, hostSalary, agencyRate, agencyUsd, rewardsVips]) => (
                  <tr key={level} className="transition-colors hover:bg-white/8">
                    <td className="px-2 py-4 font-semibold text-white">{level}</td>
                    <td className="px-2 py-4 font-medium text-white/80">{target}</td>
                    <td className="px-2 py-4 text-right font-semibold text-[#67e8ff]">{hostSalary}</td>
                    <td className="px-2 py-4 font-semibold text-[#67e8ff]">{agencyRate}</td>
                    <td className="px-2 py-4 text-right font-black text-[#ffd34f]">{agencyUsd}</td>
                    <td className="px-2 py-4 text-right text-[#67e8ff]">{rewardsVips}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="border-t border-white/10 px-5 py-3 text-xs leading-5 text-white/55 sm:px-6">
            On smaller screens, swipe horizontally to view the complete table.
          </p>
        </div>

        <section className="mt-7 rounded-2xl border border-[#ffd34f]/45 bg-[radial-gradient(circle_at_92%_15%,rgba(215,151,34,0.24),transparent_28%),#04102d] p-5 shadow-[0_20px_55px_rgba(2,11,34,0.25)] sm:mt-8 sm:rounded-3xl sm:p-7" aria-labelledby="room-owner-reward">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#67e8ff] sm:text-xs">Room policy</p>
          <h2 id="room-owner-reward" className="mt-2 text-2xl font-black sm:text-3xl">Room Owner Reward</h2>
          <p className="mt-3 max-w-220 text-sm leading-6 text-white/80 sm:text-base sm:leading-7">
            Once a room reaches the Entry Level target of <strong className="text-[#ffd34f]">450,000 Diamonds</strong>, the room owner earns a reward equal to <strong className="text-[#ffd34f]">2% of the total gifting in that room</strong>.
          </p>
        </section>

        <section className="mt-5 rounded-2xl border border-[#67e8ff]/40 bg-[radial-gradient(circle_at_8%_8%,rgba(5,213,255,0.21),transparent_28%),#04102d] p-5 shadow-[0_20px_55px_rgba(2,11,34,0.25)] sm:mt-6 sm:rounded-3xl sm:p-7" aria-labelledby="game-rewards">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#67e8ff] sm:text-xs">Game policy</p>
          <h2 id="game-rewards" className="mt-2 text-2xl font-black sm:text-3xl">More Ways to Win</h2>
          <p className="mt-3 max-w-220 text-sm leading-6 text-white/80 sm:text-base sm:leading-7">
            Mega Live is built to offer game rewards unlike anything you have witnessed in the market. <strong className="text-[#67e8ff]">10% of the overall gifting target</strong> is allocated to be rewarded back to users through games.
          </p>
        </section>
      </section>
    </main>
  );
}

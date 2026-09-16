"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { BiSolidShare as BiSolidSshare } from "react-icons/bi";
import { FaUsers } from "react-icons/fa";
import { HiMiniSpeakerXMark, HiSpeakerWave } from "react-icons/hi2";
import { MdClose, MdOutlineQuestionMark } from "react-icons/md";
import {
  bets,
  chips,
  resultColor,
  isBetWinner,
  wheelOrder,
  STARTING_BALANCE,
} from "./gameLogic";

const BETTING_DURATION = 15;
const BETTING_LOCK_SECONDS = 3;
const SPIN_DURATION = 5;
const RESULT_DURATION = 5;

const toneClasses = {
  default: "from-[#079d75] to-[#006b52]",
  red: "from-[#07845f] to-[#005940]",
  dark: "from-[#066b59] to-[#00443d]",
  green: "from-[#11a977] to-[#007654]",
};

export default function Home() {
  const [chip, setChip] = useState(25);
  const [placedBets, setPlacedBets] = useState({});
  const [result, setResult] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [roundBets, setRoundBets] = useState({});
  const [wheelRotation, setWheelRotation] = useState(0);
  const [spinStart, setSpinStart] = useState(0);
  const [spinEnd, setSpinEnd] = useState(0);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [roundPhase, setRoundPhase] = useState("betting");
  const [secondsRemaining, setSecondsRemaining] =
    useState(BETTING_DURATION);
  const [pendingResult, setPendingResult] = useState(null);
  const [lastWinAmount, setLastWinAmount] = useState(null);
  const [apiError, setApiError] = useState(null);
  // The balance now lives server-side (see app/api/roulette/{balance,play}),
  // carried in a signed cookie the browser cannot forge or edit. This is
  // still a separate balance from the real MegaLive coin wallet -- that
  // link requires the backend endpoints in GAME_BACKEND_INTEGRATION_SPEC.md
  // -- but within this game itself, the result and payout are no longer
  // something the client computes or can be tricked into computing wrong;
  // /api/roulette/play is the only source of truth.
  const [balance, setBalance] = useState(STARTING_BALANCE);
  const [balanceLoaded, setBalanceLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/roulette/balance")
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled && Number.isFinite(data?.balance)) setBalance(data.balance);
      })
      .catch(() => {
        // Network/server unavailable -- keep the in-memory starting balance
        // so the UI still renders; the next successful /play call will
        // reconcile with the server's real tracked balance.
      })
      .finally(() => {
        if (!cancelled) setBalanceLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const totalBet = useMemo(
    () => Object.values(placedBets).reduce((sum, amount) => sum + amount, 0),
    [placedBets],
  );
  const availableBalance = balance - totalBet;
  const isSpinning = roundPhase === "spinning";
  const bettingLocked =
    roundPhase !== "betting" || secondsRemaining <= BETTING_LOCK_SECONDS;
  const resultTone = result === null ? "" : resultColor(result);
  const winningMarkets =
    result === null
      ? []
      : Object.keys(roundBets).filter((label) => isBetWinner(label, result));
  const hasRoundWin = winningMarkets.length > 0;

  function addBet(label) {
    if (bettingLocked || availableBalance < chip) return;
    setPlacedBets((current) => ({
      ...current,
      [label]: (current[label] ?? 0) + chip,
    }));
  }

  function rotationFor(winningNumber) {
    const pocketIndex = wheelOrder.indexOf(winningNumber);
    const degreesPerPocket = 360 / wheelOrder.length;
    const currentRotation = ((wheelRotation % 360) + 360) % 360;
    const targetRotation = (360 - pocketIndex * degreesPerPocket + 360) % 360;
    const spinDistance =
      ((targetRotation - currentRotation + 360) % 360) +
      (6 + Math.floor(Math.random() * 3)) * 360;
    return wheelRotation + spinDistance;
  }

  // Asks the server to actually decide the round. The client only ever
  // sends the bets it wants to place -- the winning number, the payout, and
  // the new balance all come back from /api/roulette/play, which is the
  // only place that logic runs now (see app/api/roulette/play/route.js).
  // If there are no bets this round, nothing is wagered and there's nothing
  // for the server to adjudicate, so the wheel still spins for show using a
  // display-only number with zero balance impact.
  async function startSpin() {
    setRoundBets(placedBets);
    setRoundPhase("spinning");
    setSecondsRemaining(SPIN_DURATION);
    setResult(null);
    setApiError(null);

    const hasBets = totalBet > 0;
    if (!hasBets) {
      const displayNumber = Math.floor(Math.random() * 37);
      setSpinStart(wheelRotation);
      setSpinEnd(rotationFor(displayNumber));
      setPendingResult(displayNumber);
      return;
    }

    try {
      const res = await fetch("/api/roulette/play", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bets: placedBets }),
      });
      const data = await res.json();
      if (!res.ok) {
        setApiError(data?.error ?? "request_failed");
        if (Number.isFinite(data?.balance)) setBalance(data.balance);
        // Server refused the round (e.g. bet exceeds real balance) -- don't
        // fabricate a spin/result locally, just return straight to betting
        // so the player can adjust their bet against the real balance.
        startNextRound();
        return;
      }
      setBalance(data.balance);
      setLastWinAmount(data.payout > 0 ? data.net : null);
      setSpinStart(wheelRotation);
      setSpinEnd(rotationFor(data.result));
      setPendingResult(data.result);
    } catch {
      setApiError("network_error");
      startNextRound();
    }
  }

  function showResult() {
    if (pendingResult === null) return;
    setWheelRotation(spinEnd);
    setResult(pendingResult);
    setRoundPhase("result");
    setSecondsRemaining(RESULT_DURATION);
  }

  function startNextRound() {
    setPlacedBets({});
    setRoundBets({});
    setResult(null);
    setPendingResult(null);
    setLastWinAmount(null);
    setRoundPhase("betting");
    setSecondsRemaining(BETTING_DURATION);
  }

  useEffect(() => {
    if (secondsRemaining <= 0) return;
    const countdown = window.setTimeout(() => {
      setSecondsRemaining((current) => current - 1);
    }, 1000);
    return () => window.clearTimeout(countdown);
  }, [roundPhase, secondsRemaining]);

  useEffect(() => {
    if (secondsRemaining !== 0) return;
    if (roundPhase === "betting") startSpin();
    if (roundPhase === "spinning") showResult();
    if (roundPhase === "result") startNextRound();
  }, [roundPhase, secondsRemaining]);

  return (
    <>
      <style jsx global>{`
        @keyframes roulette-wheel-spin {
          from { transform: rotate(var(--wheel-from)); }
          to { transform: rotate(var(--wheel-to)); }
        }
        .roulette-wheel-spinning {
          animation: roulette-wheel-spin 5s cubic-bezier(.13,.65,.24,1) both;
        }
      `}</style>
      <main className="h-[100dvh] overflow-hidden bg-[#080a1c] bg-[url('/roulette/assets/casino/vip-casino-backdrop.webp')] bg-cover bg-center p-0 text-[#f7f1e7] sm:p-4">
      <section className="relative mx-auto flex h-full max-w-[1440px] flex-col overflow-hidden rounded-none border-0 bg-transparent shadow-none sm:rounded-[28px] sm:border sm:border-[#d5a64055] sm:bg-[#10132bee] sm:shadow-[0_30px_90px_#000a]">
        <header className="absolute inset-x-0 top-0 z-30 flex h-14 shrink-0 items-center justify-between border-b border-transparent bg-transparent px-5 sm:relative sm:h-16 sm:border-white/10 sm:bg-[#10132bee] sm:px-[clamp(22px,4vw,62px)]">
          <a
            className="flex items-center gap-2.5 text-[18px] font-extrabold tracking-[.16em] text-[#f6d064]"
            href="#top"
            aria-label="Mega Roulette home"
          >
            <span className="grid h-[31px] w-[31px] place-items-center bg-[#f6d064] font-serif font-extrabold text-[#1d1420] [clip-path:polygon(50%_0,100%_30%,84%_100%,16%_100%,0_30%)]">
              M
            </span>
            MEGA
          </a>
          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-2 font-mono text-[11px] tracking-[.08em] text-[#a4a9ae] sm:flex">
              <i className="h-2 w-2 rounded-full bg-[#4be19b] shadow-[0_0_12px_#4be19b]" />{" "}
              LIVE TABLE
            </span>
            <button
              className="grid h-[34px] w-[34px] place-items-center rounded-full border border-white/15 bg-transparent text-[#e8dfd1]"
              type="button"
              aria-label={isMuted ? "Turn sound on" : "Mute sound"}
              onClick={() => setIsMuted((current) => !current)}
            >
              {isMuted ? (
                <HiMiniSpeakerXMark size={18} />
              ) : (
                <HiSpeakerWave size={18} />
              )}
            </button>
            <button
              className="grid h-[34px] w-[34px] place-items-center rounded-full border border-white/15 bg-transparent text-[#e8dfd1]"
              type="button"
              aria-label="How to play"
              onClick={() => setShowHowToPlay(true)}
            >
              <MdOutlineQuestionMark size={19} />
            </button>
          </div>
        </header>

        <div
          id="top"
          className="h-[25dvh] shrink-0 bg-transparent px-5 py-3 sm:h-auto sm:bg-[linear-gradient(105deg,#1d1f45,#121a39_55%,#1a1538)] sm:px-[clamp(22px,4vw,62px)] sm:py-5 md:flex md:flex-row md:items-end md:justify-between md:gap-4"
        >
          <div className="hidden sm:block">
            <p className="mb-1 font-mono text-[9px] tracking-[.14em] text-[#d8ad50] sm:text-[10px]">
              VIP LOUNGE · TABLE 017
            </p>
            <h1 className="font-display text-[clamp(27px,4vw,48px)] leading-none tracking-[-.045em]">
              Roulette Royale
            </h1>
            <p className="mt-2 hidden max-w-[515px] text-xs leading-5 text-[#aaa6ab] md:block">
              Place your chips, watch the wheel, and let the next winning number
              find you.
            </p>
          </div>
          <div className="hidden min-w-[184px] border-l-2 border-[#dfba5c] bg-white/[.03] px-4 py-3 md:block">
            <span className="block text-[11px] text-[#aaa6ab]">
              Available balance
            </span>
            <strong className="mt-1 block font-mono text-[21px] text-[#fff3d7]">
              {availableBalance.toLocaleString()}{" "}
              <small className="text-[.53em] tracking-[.08em] text-[#d7ad57]">
                MEGA
              </small>
            </strong>
            {roundPhase === "result" && lastWinAmount !== null && (
              <span className="mt-1 block font-mono text-[11px] text-[#67e5c4]">
                +{lastWinAmount.toLocaleString()} MEGA won
              </span>
            )}
            {apiError && (
              <span className="mt-1 block font-mono text-[11px] text-[#ff9d91]">
                {apiError === "insufficient_balance"
                  ? "Bet exceeded your balance"
                  : "Connection issue, round skipped"}
              </span>
            )}
          </div>
        </div>

        <section className="grid min-h-0 flex-1 grid-cols-1 items-center gap-2 overflow-hidden bg-transparent px-5 py-1 sm:bg-[radial-gradient(ellipse_at_50%_45%,#353466,#1a2043_50%,#0d1028_100%)] sm:px-[clamp(22px,4vw,62px)] md:grid-cols-[minmax(390px,1.25fr)_minmax(285px,.75fr)] md:gap-[clamp(30px,6vw,100px)] md:py-3">
          <div className="relative text-center">
            <span className="absolute left-[14%] top-1 hidden font-mono text-[10px] tracking-[.12em] text-[#b3a99a] md:left-0 md:block">
              TABLE 017
            </span>
            <div className="relative mx-auto grid aspect-square w-[min(71vw,31dvh)] max-w-[468px] place-items-center rounded-full bg-transparent shadow-[0_16px_30px_#0009] md:w-[min(33vw,43dvh)] md:shadow-[0_24px_45px_#0009]">
              <div
                className="absolute -top-1 z-10 h-[38px] w-[22px] bg-[#f7d56a] [clip-path:polygon(50%_100%,0_0,100%_0)] [filter:drop-shadow(0_3px_3px_#000)]"
                aria-hidden="true"
              />
              <div
                className={`relative aspect-square w-[90%] overflow-hidden rounded-full ${isSpinning ? "roulette-wheel-spinning" : ""}`}
                style={
                  isSpinning
                    ? ({
                        "--wheel-from": `${spinStart}deg`,
                        "--wheel-to": `${spinEnd}deg`,
                      })
                    : { transform: `rotate(${wheelRotation}deg)` }
                }
              >
                <Image
                  src="/roulette/assets/roulette/roulette-wheel.png"
                  alt="Gold and mahogany roulette wheel"
                  fill
                  priority
                  sizes="(max-width: 680px) 78vw, 430px"
                  className="object-contain"
                />
              </div>
              <div className="pointer-events-none absolute z-[3] flex h-[78px] w-[78px] flex-col justify-center rounded-full border border-[#efc55c99] bg-[#191114dd] shadow-[inset_0_0_26px_#ca943e37,0_0_20px_#0008] sm:h-[98px] sm:w-[98px] md:h-[118px] md:w-[118px]">
                {isSpinning ? (
                  <>
                    <b className="font-mono text-[13px] tracking-[.03em] text-[#ffe49a] sm:text-[18px]">
                      SPINNING
                    </b>
                    <span className="mt-0.5 text-[7px] uppercase tracking-[.1em] text-[#c7b9a5] sm:mt-1 sm:text-[9px]">
                      Good luck
                    </span>
                  </>
                ) : result !== null ? (
                  <>
                    <b className="font-mono text-[16px] tracking-[.03em] text-[#ffe49a] sm:text-[18px]">
                      {result}
                    </b>
                    <span className="mt-0.5 text-[7px] uppercase tracking-[.1em] text-[#c7b9a5] sm:mt-1 sm:text-[9px]">
                      {resultTone} winning number
                    </span>
                  </>
                ) : (
                  <>
                    <b className="font-mono text-[13px] tracking-[.03em] text-[#ffe49a] sm:text-[18px]">
                      READY
                    </b>
                    <span className="mt-0.5 text-[7px] uppercase tracking-[.1em] text-[#c7b9a5] sm:mt-1 sm:text-[9px]">
                      Place a bet
                    </span>
                  </>
                )}
              </div>
            </div>
            <div className="mt-2 flex items-center justify-center gap-2 text-[9px] tracking-[.05em] text-[#bdb5a8] sm:text-[11px]">
              <p>
                Last number{" "}
                <strong className="ml-1 inline-grid h-5 w-5 place-items-center rounded-full bg-[#b3212d] font-mono text-[10px] text-[#fff7dd] sm:h-6 sm:w-6 sm:text-xs">
                  {result ?? 17}
                </strong>
              </p>
              <span className="h-3 w-px bg-white/15" />
              <span className="inline-flex items-center gap-1">
                <FaUsers size={10} className="text-[#d8ad50] sm:h-3 sm:w-3" />{" "}
                1,248
              </span>
            </div>
          </div>

          <div className="hidden gap-3 md:grid md:grid-cols-1">
            <div className="rounded-[14px] border border-white/[.07] bg-[#0c1111a6] p-5 sm:col-span-2 md:col-span-1">
              <div className="flex justify-between gap-3 font-mono text-[10px] tracking-[.07em] text-[#bdb7af]">
                <span>ROUND STATUS</span>
                <b
                  className={`font-medium ${result !== null ? (hasRoundWin ? "text-[#67e5c4]" : "text-[#ff9d91]") : "text-[#e7c464]"}`}
                >
                  {isSpinning
                    ? "SPIN IN PROGRESS"
                    : result !== null
                      ? hasRoundWin
                        ? "BET WON"
                        : "BET MISSED"
                      : bettingLocked
                        ? "BETS LOCKED"
                        : "BETTING OPEN"}
                </b>
              </div>
              <div className="my-3 h-1 overflow-hidden rounded-lg bg-white/[.07]">
                <span
                  className={`block h-full rounded-lg bg-[linear-gradient(90deg,#cf9c3e,#ffe17a)] ${isSpinning ? "bet-progress w-full" : "w-2/3"}`}
                />
              </div>
              <p className="m-0 text-xs leading-5 text-[#8f9692]">
                {isSpinning
                  ? `Wheel active: ${secondsRemaining}s until the result.`
                  : result !== null
                    ? `Result: ${result} ${resultTone}. Next betting round begins in ${secondsRemaining}s.`
                    : bettingLocked
                      ? `Bets are locked. The wheel spins in ${secondsRemaining}s.`
                      : `${secondsRemaining}s left to place your bets.`}
              </p>
            </div>
            <div className="rounded-[14px] border border-white/[.07] bg-[#0c1111a6] p-5">
              <span className="mb-3 block font-mono text-[10px] tracking-[.14em] text-[#d8ad50]">
                SELECT CHIP
              </span>
              <div className="flex flex-wrap gap-2.5">
                {chips.map((value) => (
                  <button
                    key={value}
                    onClick={() => setChip(value)}
                    className={`grid h-[46px] w-[46px] place-items-center rounded-full border-[3px] border-dashed border-[#f0dfc3] font-mono text-xs font-bold text-[#281a1a] shadow-[0_3px_0_#0007] transition hover:-translate-y-0.5 hover:shadow-[0_0_0_3px_#f5d26277,0_6px_0_#0007] ${chip === value ? "-translate-y-0.5 shadow-[0_0_0_3px_#f5d26277,0_6px_0_#0007]" : ""} ${value === 5 ? "bg-[#eee4d6]" : value === 10 ? "bg-[#e05859]" : value === 25 ? "bg-[#4c8ad6]" : value === 50 ? "bg-[#4ba970]" : "bg-[#373945] text-white"}`}
                    type="button"
                    aria-pressed={chip === value}
                    disabled={bettingLocked}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-[1fr_auto] items-center rounded-[14px] border border-white/[.07] bg-[#0c1111a6] p-5">
              <span className="text-[11px] text-[#aaa6ab]">Your total bet</span>
              <strong className="mt-1 font-mono text-[21px] text-[#fff3d7]">
                {totalBet.toLocaleString()}{" "}
                <small className="text-[.53em] tracking-[.08em] text-[#d7ad57]">
                  MEGA
                </small>
              </strong>
              <button
                type="button"
                onClick={() => setPlacedBets({})}
                disabled={!totalBet || bettingLocked}
                className="col-start-2 row-span-2 row-start-1 bg-transparent text-[11px] text-[#d4b56a] underline disabled:cursor-not-allowed disabled:opacity-35"
              >
                Clear table
              </button>
            </div>
          </div>
        </section>

        <section className="flex h-[34dvh] min-h-[220px] max-h-[300px] shrink-0 flex-col border-y border-[#77e9ba55] bg-[#00624ce8] px-3 py-3 shadow-[inset_0_12px_30px_#003e35] sm:h-[300px] sm:border-t sm:border-b-0 sm:bg-[linear-gradient(180deg,#0b8060,#005342)] sm:px-[clamp(22px,4vw,62px)] sm:py-4 md:h-[285px]">
          <div className="mb-2 flex shrink-0 items-center justify-between gap-3 sm:mb-3">
            <div>
              <p className="mb-0.5 font-mono text-[8px] tracking-[.14em] text-[#d8ad50] sm:text-[10px]">
                BETTING BOARD
              </p>
              <h2 className="font-display text-xl tracking-[-.04em] sm:text-[26px]">
                {roundPhase === "betting"
                  ? bettingLocked
                    ? `Bets locked · ${secondsRemaining}s`
                    : `Place bets · ${secondsRemaining}s`
                  : roundPhase === "spinning"
                    ? `Wheel spinning · ${secondsRemaining}s`
                    : `Result showing · ${secondsRemaining}s`}
              </h2>
            </div>
            <div className="flex w-auto gap-2">
              <button
                className="grid h-10 w-10 place-items-center rounded-lg border border-[#f3c86955] bg-[#201319] text-[#f3d46f] transition hover:bg-[#30202a] sm:h-[46px] sm:w-[46px]"
                type="button"
                aria-label="Share table"
              >
                <BiSolidSshare size={17} />
              </button>
              <button
                className="flex h-10 items-center justify-between gap-3 rounded-lg bg-[linear-gradient(135deg,#f3d46f,#c58d30)] py-1.5 pr-1.5 pl-3 text-[10px] font-extrabold tracking-[.08em] text-[#201507] shadow-[0_8px_22px_#0007] disabled:cursor-wait disabled:saturate-50 sm:h-[46px] sm:gap-5 sm:pl-4 sm:text-xs"
                type="button"
                disabled
              >
                <span>
                  {isSpinning
                    ? "SPINNING"
                    : roundPhase === "result"
                      ? "RESULT"
                      : bettingLocked
                        ? "LOCKED"
                        : "BETTING"}
                </span>
                <em className="grid h-7 w-7 place-items-center rounded-[5px] bg-[#4e2617] text-base not-italic text-[#f7e5a4] sm:h-8 sm:w-8">
                  ➜
                </em>
              </button>
            </div>
          </div>
          <div className="grid min-h-0 flex-1 grid-cols-4 auto-rows-fr gap-1.5 sm:gap-2 md:gap-3">
            {bets.map((bet) => {
              const amount = placedBets[bet.label] ?? 0;
              const tone = toneClasses[bet.tone ?? "default"];
              const payoutColor = "text-[#a7ffd5]";
              return (
                <button
                  key={bet.label}
                  className={`relative min-h-0 overflow-hidden rounded-md border-2 bg-gradient-to-br p-2 text-left text-white transition hover:-translate-y-0.5 hover:border-[#f8d66f] sm:rounded-[9px] sm:p-3 md:p-4 ${tone} ${amount ? "border-[#f8d66f]" : "border-[#83edc099]"}`}
                  onClick={() => addBet(bet.label)}
                  type="button"
                  disabled={bettingLocked}
                >
                  <span className="hidden text-[10px] tracking-[.03em] text-[#c8f5d9] sm:block">
                    {amount ? `${amount} MEGA placed` : bet.detail}
                  </span>
                  <strong className="block text-sm tracking-[-.04em] sm:mt-1 sm:text-xl md:mt-3 md:text-[clamp(19px,2vw,25px)]">
                    {bet.label}
                  </strong>
                  <b
                    className={`absolute right-2 bottom-1.5 text-base sm:right-3 sm:bottom-2 sm:text-xl md:right-4 md:bottom-3 md:text-[22px] ${payoutColor}`}
                  >
                    {bet.payout}
                  </b>
                  {amount > 0 && (
                    <i className="absolute top-1.5 right-1.5 grid h-6 min-w-6 place-items-center rounded-full border border-dashed border-[#f9edd3] bg-[#f2cd67] px-1 font-mono text-[8px] font-bold not-italic text-[#19231d] sm:top-2 sm:right-2 sm:h-8 sm:min-w-8 sm:text-[10px]">
                      {amount}
                    </i>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        <footer className="hidden shrink-0 flex-wrap justify-center gap-2.5 border-t border-white/[.05] bg-[#0b0b0e] px-6 py-2 font-mono text-[10px] text-[#77777c] md:flex">
          <span>18+ Play responsibly</span>
          <span>•</span>
          <span>Provably fair game rounds</span>
          <span>•</span>
          <span>Connection secure</span>
        </footer>
      </section>
      {showHowToPlay && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-[#040716b3] px-4 py-5 backdrop-blur-[2px]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="how-to-play-title"
        >
          <section className="w-full max-w-[620px] overflow-hidden rounded-xl border-2 border-[#e4be56] bg-[#f7f0d8] text-[#72512f] shadow-[0_25px_80px_#000c]">
            <header className="relative flex h-14 items-center justify-center border-b-2 border-[#9ceec5] bg-[linear-gradient(90deg,#078865,#25bc83,#078865)] px-14 text-center shadow-[inset_0_-8px_18px_#00614655]">
              <h2
                id="how-to-play-title"
                className="font-display text-[28px] leading-none tracking-[-.035em] text-[#fff5b4] drop-shadow-[0_2px_1px_#00523c]"
              >
                How to play
              </h2>
              <button
                type="button"
                onClick={() => setShowHowToPlay(false)}
                className="absolute right-3 grid h-9 w-9 place-items-center rounded-md text-4xl text-white transition hover:bg-white/15"
                aria-label="Close how to play"
              >
                <MdClose />
              </button>
            </header>
            <div className="max-h-[calc(100dvh-130px)] overflow-y-auto p-5 text-[14px] leading-[1.3] sm:p-7 sm:text-base">
              <h3 className="mb-1 font-semibold text-[#93643a]">
                Basic instructions
              </h3>
              <ol className="list-decimal space-y-1 pl-5 marker:font-semibold">
                <li>
                  Select a chip value, then tap a betting area to place your
                  bet.
                </li>
                <li>
                  Tap <b>Spin</b>. The wheel rotates and the gold marker stops
                  on the winning pocket.
                </li>
                <li>
                  If the result matches your selected market, your reward is
                  your bet amount multiplied by the displayed odds.
                </li>
              </ol>
              <h3 className="mt-5 mb-1 font-semibold text-[#93643a]">
                Odds explained
              </h3>
              <p className="mb-2">
                There are 8 betting areas. A green zero does not count as Red,
                Black, Odd, or Even.
              </p>
              <div className="grid grid-cols-[1fr_auto] gap-x-8 gap-y-1 rounded-lg border border-[#d6bf91] bg-[#fff9e9] px-4 py-3 font-mono text-[13px] text-[#75522f] sm:mx-auto sm:max-w-[360px] sm:text-sm">
                {bets.map((bet) => (
                  <div key={bet.label} className="contents">
                    <span>{bet.label}</span>
                    <b className="font-medium">{bet.payout}</b>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs leading-5 text-[#957352]">
                Play responsibly. This demo uses virtual MEGA credits.
              </p>
            </div>
          </section>
        </div>
      )}
      </main>
    </>
  );
}

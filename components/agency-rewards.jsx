"use client";

import Image from "next/image";
import { MdGroups } from "react-icons/md";
import { FaRegClock } from "react-icons/fa";

const requirements = [
  { icon: MdGroups, label: "Invite", value: "25", note: "Host" },
  { icon: FaRegClock, label: "And work minimum", value: "10M", note: "Within first 15 days" },
];

const rewards = [
  {
    image: "/assets/1783682477416.png",
    imageWidth: 843,
    imageHeight: 531,
    value: "500K",
    label: "Coins",
    tone: "text-[#ffd755]",
  },
  {
    image: "/assets/1783683598242.png",
    imageWidth: 688,
    imageHeight: 642,
    value: "$5",
    label: "USD",
    tone: "text-[#71e14e]",
  },
];

export default function AgencyRewards() {
  return (
    <section
      id="agency-rewards"
      className="relative overflow-hidden bg-[radial-gradient(circle_at_18%_20%,rgba(5,213,255,0.22),transparent_26%),radial-gradient(circle_at_84%_72%,rgba(215,151,34,0.12),transparent_24%),linear-gradient(180deg,#064ba8_0%,#052c6f_52%,#064ba8_100%)] px-4 py-16 text-white sm:px-8 sm:py-20"
      aria-labelledby="agency-rewards-title"
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-size-[72px_72px] opacity-35" />

      <div className="relative mx-auto w-full max-w-295 overflow-hidden rounded-[30px] border-2 border-[#6fdbff]/60 bg-[linear-gradient(180deg,rgba(2,8,25,0.96)_0%,rgba(3,20,56,0.96)_45%,rgba(1,7,25,0.96)_100%)] px-3 pb-6 pt-5 shadow-[0_25px_75px_rgba(3,21,63,0.5),inset_0_0_60px_rgba(5,189,233,0.1)] backdrop-blur-xl sm:px-8 sm:pb-9 lg:px-10">
        <div className="pointer-events-none absolute inset-2 rounded-[21px] border border-[#d99a25]/45" />
        <div className="pointer-events-none absolute left-7 top-8 text-2xl text-[#ffd755] sm:text-4xl">✦</div>
        <div className="pointer-events-none absolute right-8 top-12 text-2xl text-[#33caff] sm:text-4xl">◆</div>
        <div className="pointer-events-none absolute right-[12%] top-32 rotate-12 text-3xl sm:text-5xl">🎁</div>

        <header className="relative z-10 text-center">
          <div className="relative mx-auto w-fit">
            <Image
              className="mx-auto h-40 w-64 object-contain drop-shadow-[0_14px_22px_rgba(0,157,255,0.45)] sm:h-56 sm:w-90 lg:h-64 lg:w-104"
              src="/assets/secondary-logo.png"
              alt="Mega Live dolphin mascot holding a reward coin"
              width={1248}
              height={832}
            />
          </div>

          <div className="relative mx-auto -mt-4 max-w-240 px-3 sm:-mt-8 sm:px-10">
            <span className="absolute left-0 top-1/2 h-12 w-full -translate-y-1/2 skew-x-[-8deg] border-2 border-[#f1b63e] bg-[#031337] shadow-[0_0_18px_rgba(241,182,62,0.3)] sm:h-16" />
            <span className="absolute -left-3 top-1/2 h-9 w-16 -translate-y-1/2 border-y-2 border-l-2 border-[#f1b63e] bg-[#062255] sm:-left-8 sm:w-24" />
            <span className="absolute -right-3 top-1/2 h-9 w-16 -translate-y-1/2 border-y-2 border-r-2 border-[#f1b63e] bg-[#062255] sm:-right-8 sm:w-24" />
            <h2
              id="agency-rewards-title"
              className="relative z-10 py-3 text-[clamp(23px,4vw,52px)] font-black uppercase tracking-tight text-white [text-shadow:0_3px_0_#15264d,0_0_10px_rgba(255,255,255,0.35)] sm:py-4"
            >
              ★ New Agency Reward ★
            </h2>
          </div>
        </header>

        <div className="relative z-10 mt-9 grid gap-7 lg:grid-cols-2 lg:items-stretch xl:gap-9">
        <div className="flex flex-col rounded-[24px] border-2 border-[#39bfff]/70 bg-[#020c28]/90 p-3 shadow-[inset_0_0_30px_rgba(0,102,255,0.14)] sm:p-6 lg:min-h-110 lg:p-7">
          <p className="mb-7 text-center text-sm font-black uppercase tracking-[0.2em] text-[#6fdbff]">Agency requirements</p>
          <div className="grid flex-1 items-stretch gap-4 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
            {requirements.map((item, index) => {
              const Icon = item.icon;

              return (
              <div className="contents" key={item.value}>
                {index === 1 && (
                  <span className="grid place-items-center text-4xl font-black text-[#ffd229] [text-shadow:0_0_12px_rgba(255,210,41,0.7)]">+</span>
                )}
                <article className="relative flex min-h-68 w-full min-w-0 flex-col items-center justify-center rounded-[18px] border border-[#89a8ff]/70 bg-[linear-gradient(180deg,#071b4b,#020a22)] px-4 pb-7 pt-16 text-center sm:min-h-76 sm:px-5 sm:pt-18">
                  <span className="absolute left-1/2 top-0 grid h-18 w-18 -translate-x-1/2 -translate-y-1/3 place-items-center rounded-full border-2 border-[#efb735] bg-[radial-gradient(circle,#173a76,#06163f_72%)] text-[40px] text-[#ffd438] shadow-[0_0_15px_rgba(239,183,53,0.35)]">
                    <Icon aria-hidden="true" />
                  </span>
                  <p className="text-sm font-black uppercase sm:text-lg">{item.label}</p>
                  <strong className="mt-2 block max-w-full text-[clamp(36px,4vw,58px)] font-black uppercase leading-none text-[#ffd438] [text-shadow:0_3px_0_#8a5100]">{item.value}</strong>
                  {item.note && <p className="mt-2 text-xs font-black uppercase text-white/85 sm:text-base">{item.note}</p>}
                </article>
              </div>
              );
            })}
          </div>
        </div>

        <div className="relative flex flex-col lg:min-h-110">
        <div className="relative z-20 mx-auto -mb-4 w-[86%] skew-x-[-6deg] border-2 border-[#ffd85b] bg-[linear-gradient(180deg,#ffe05c,#c77b08)] px-3 py-2 text-center shadow-[0_5px_15px_rgba(0,0,0,0.45)] sm:py-3">
          <p className="skew-x-[6deg] whitespace-nowrap text-[clamp(15px,2vw,27px)] font-black uppercase text-[#04102b]">Will get extra reward</p>
        </div>

        <div className="relative z-10 flex flex-1 items-center rounded-[24px] border-2 border-[#d89c32]/75 bg-[#020b27]/95 px-3 pb-5 pt-10 sm:px-6 sm:pb-7 sm:pt-12 lg:px-7">
          <div className="grid w-full items-center gap-3 sm:grid-cols-[1fr_auto_1fr]">
            {rewards.map((item, index) => (
              <div className="contents" key={item.label}>
                {index === 1 && <span className="grid place-items-center text-5xl font-black text-[#42caff] [text-shadow:0_0_14px_#087fd1]">+</span>}
                <article className="text-center">
                  <div className="flex h-40 items-end justify-center sm:h-52 lg:h-58">
                    <Image
                      className="h-full w-full object-contain drop-shadow-[0_14px_14px_rgba(0,0,0,0.5)]"
                      src={item.image}
                      alt={`${item.label} reward`}
                      width={item.imageWidth}
                      height={item.imageHeight}
                    />
                  </div>
                  <strong className={`block text-[clamp(52px,6vw,82px)] font-black leading-[0.9] [text-shadow:0_4px_0_rgba(0,0,0,0.45)] ${item.tone}`}>{item.value}</strong>
                  <p className="mt-2 text-xl font-black uppercase tracking-[0.12em] sm:text-2xl">{item.label}</p>
                </article>
              </div>
            ))}
          </div>
        </div>
        </div>
        </div>

        <aside className="relative z-10 mt-7 rounded-[20px] border-2 border-[#ca62ff]/75 bg-[linear-gradient(90deg,#301073,#090d31,#301073)] px-5 pb-5 pt-10 text-center shadow-[0_0_24px_rgba(202,98,255,0.2)] sm:px-8 sm:pb-7 sm:pt-12">
          <div className="absolute -top-4 left-5 flex items-center gap-3 rounded-r-full border-2 border-[#ca62ff] bg-[#421399] py-1 pl-2 pr-7 text-lg font-black uppercase sm:text-2xl">
            <span className="grid h-11 w-11 place-items-center rounded-full border border-[#ffd755] bg-[#25105d]">🔔</span> Note
          </div>
          <p className="text-[clamp(18px,3.3vw,30px)] font-black uppercase leading-snug">
            <span className="text-[#ffd438]">This reward is only in</span><br />
            first month after joining Mega Live
          </p>
        </aside>

        <p className="relative z-10 mt-7 text-center text-xs font-black uppercase tracking-[0.2em] text-[#e0ad49] sm:text-base">★ ★ ★ &nbsp; Mega Live — Grow together, earn together! &nbsp; ★ ★ ★</p>
      </div>
    </section>
  );
}

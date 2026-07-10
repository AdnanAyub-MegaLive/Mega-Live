"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Modal from "../components/download-modal";

const icons = {
  gift: "\uD83C\uDF81",
  camera: "\uD83D\uDCF9",
  friend: "\uD83E\uDDD1",
  party: "\uD83E\uDD73",
  chat: "\uD83D\uDCAC",
  heartGift: "\uD83D\uDC9D",
  mic: "\uD83C\uDFA4",
  sparkle: "\u2728",
  heartEyes: "\uD83D\uDE0D",
  hearts: "\uD83D\uDC96",
  bolt: "\u26A1",
};

const features = [
  {
    eyebrow: "Live rooms",
    title: "Voice Chat Party",
    copy: "Jump into glowing voice rooms, meet new friends, and make every conversation feel like a celebration.",
    image: "/assets/voice-party.png",
    align: "right",
  },
  {
    eyebrow: "Gift magic",
    title: "Send Gifts",
    copy: "Send love with show-stopping gifts, animated reactions, and bright moments that make friends smile.",
    image: "/assets/send-gifts.png",
    align: "left",
  },
  {
    eyebrow: "Discovery",
    title: "Discover Chat Rooms",
    copy: "Millions of rooms are waiting for you, from casual hangouts to high-energy party stages.",
    image: "/assets/chat-rooms.png",
    align: "right",
  },
  {
    eyebrow: "VIP moments",
    title: "Noble Privilege",
    copy: "Unlock rides, medals, frames, room cards, and VIP effects built for unforgettable entrances.",
    image: "/assets/noble-privilege.png",
    align: "left",
  },
];

const benefits = [
  [icons.gift, "Various Live", "Find one to fit you or go live."],
  [icons.camera, "Voice Live Streaming", "Listen or chat anywhere."],
  [icons.friend, "Find New Friends", "Follow and chat if interested."],
  [icons.party, "Fun Party", "From strangers to friends."],
];

const stats = [
  ["24/7", "live rooms"],
  ["10M+", "possible friends"],
  ["4.9", "party energy"],
  ["100+", "gift effects"],
];

export default function Home() {
  const root = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.set(".hero-phone", { transformPerspective: 900 });
      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from(".nav-shell", { y: -26, opacity: 0, duration: 0.8 })
        .from(".hero-kicker", { y: 18, opacity: 0, duration: 0.6 }, "-=0.35")
        .from(
          ".hero-title span",
          { yPercent: 115, duration: 0.9, stagger: 0.09 },
          "-=0.25",
        )
        .from(".hero-copy", { y: 20, opacity: 0, duration: 0.7 }, "-=0.45")
        .from(
          ".store-button",
          { y: 18, opacity: 0, scale: 0.92, stagger: 0.08, duration: 0.55 },
          "-=0.35",
        )
        .from(
          ".hero-phone",
          { x: 80, y: 30, opacity: 0, rotateY: -28, rotateZ: 5, duration: 1.1 },
          "-=0.85",
        )
        .from(
          ".hero-orbit",
          { scale: 0, opacity: 0, stagger: 0.1, duration: 0.7 },
          "-=0.65",
        );

      gsap.to(".gradient-field", {
        backgroundPosition: "120% 45%",
        duration: 9,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      gsap.to(".hero-phone", {
        y: -18,
        rotateZ: -1.5,
        duration: 3.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      gsap.to(".hero-orbit", {
        y: "random(-22, 22)",
        x: "random(-18, 18)",
        rotate: "random(-18, 18)",
        duration: "random(2.2, 4.2)",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.12,
      });
      gsap.utils.toArray(".feature").forEach((section) => {
        const image = section.querySelector(".feature-art");
        const text = section.querySelector(".feature-text");
        const accents = section.querySelectorAll(".feature-pop");
        gsap.from(text, {
          y: 60,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: section, start: "top 72%" },
        });
        gsap.from(image, {
          y: 90,
          scale: 0.86,
          opacity: 0,
          rotate: section.dataset.align === "left" ? -7 : 7,
          duration: 1,
          ease: "back.out(1.45)",
          scrollTrigger: { trigger: section, start: "top 70%" },
        });
        gsap.to(image, {
          y: -45,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });
        gsap.from(accents, {
          scale: 0,
          opacity: 0,
          rotate: 40,
          stagger: 0.12,
          duration: 0.55,
          ease: "back.out(2)",
          scrollTrigger: { trigger: section, start: "top 62%" },
        });
      });

      gsap.from(".benefit-card", {
        y: 30,
        opacity: 0,
        stagger: 0.12,
        duration: 0.75,
        ease: "power2.out",
        scrollTrigger: { trigger: ".benefits", start: "top 78%" },
      });
      gsap.from(".about-title, .about-copy, .about-map", {
        y: 42,
        opacity: 0,
        stagger: 0.16,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: { trigger: ".about", start: "top 68%" },
      });
      gsap.to(".sparkle", {
        scale: 1.35,
        opacity: 0.25,
        duration: 1.4,
        stagger: 0.22,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <main
      ref={root}
      className="min-h-screen overflow-x-hidden bg-[#120a60] text-white"
    >
      <section
        id="home"
        className="gradient-field relative min-h-220 overflow-hidden bg-[radial-gradient(circle_at_21%_30%,rgba(255,255,255,0.26),transparent_10%),radial-gradient(circle_at_71%_20%,rgba(255,61,185,0.35),transparent_20%),linear-gradient(130deg,#268cff_0%,#6846ff_42%,#9626ff_70%,#f34fc7_100%)] bg-size-[180%_180%] px-[clamp(22px,5vw,82px)] pb-30 pt-7 after:absolute after:bottom-[-18vw] after:right-[-18vw] after:h-[52vw] after:w-[52vw] after:rounded-full after:bg-white/15 after:blur-xl max-[900px]:min-h-0 max-[900px]:pb-24 max-[560px]:px-4.5 max-[560px]:pb-20 max-[560px]:pt-5"
      >
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-size-[96px_96px] opacity-25 mask-[linear-gradient(to_bottom,#000_0%,transparent_82%)]" />
        <nav
          className="nav-shell relative z-10 mx-auto flex max-w-295 items-center justify-between gap-6 max-[900px]:items-start"
          aria-label="Main navigation"
        >
          <a className="flex items-center gap-3 font-black" href="#home">
            <span className="grid h-12 w-14 shrink-0 place-items-center backdrop-blur-xl">
              <Image
                className="h-full w-full object-contain"
                src="/assets/megalive-logo.png"
                alt="Mega Chat Live logo"
                width={250}
                height={250}
                priority
              />
            </span>
            <span className="max-[560px]:max-w-28 max-[560px]:leading-tight">
              Mega Chat Live
            </span>
          </a>
          <div className="flex items-center gap-[clamp(18px,4vw,56px)] text-xs font-black uppercase max-[900px]:hidden">
            <a href="#home">Home</a>
            <a href="#overview">Overview</a>
            <a href="#about">About us</a>
          </div>
          <button
            className="inline-flex min-h-10.5 min-w-32 items-center justify-center rounded-full border border-white/50 bg-[#120a60]/30 px-6 text-xs font-black uppercase shadow-[0_12px_35px_rgba(45,18,142,0.24)] backdrop-blur-xl max-[560px]:min-w-25.5 max-[560px]:px-3.5"
            onClick={() => setIsOpen(true)}
          >
            Download
          </button>
           <Modal
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            title="Welcome"
          >
            <p className="text-gray-600">
              This is a reusable modal built with Next.js and Tailwind CSS.
            </p>
          </Modal>
        </nav>
        <div className="relative z-10 mx-auto mt-28 grid max-w-295 grid-cols-[minmax(0,1fr)_minmax(320px,0.8fr)] items-center gap-[clamp(36px,6vw,96px)] max-[900px]:mt-17.5 max-[900px]:grid-cols-1">
          <div className="max-w-170">
            <p className="hero-kicker mb-5 text-[13px] font-extrabold uppercase text-white/85">
              Voice rooms, gifts, friends, and pure live energy
            </p>
            <h1 className="hero-title m-0 text-[clamp(52px,8vw,104px)] font-black leading-[0.94] max-[560px]:text-[52px]">
              <span className="block overflow-hidden">Make friends</span>
              <span className="block overflow-hidden">through your</span>
              <span className="block overflow-hidden">voice</span>
            </h1>
            <p className="hero-copy mb-11 mt-7 max-w-147.5 text-[clamp(16px,2vw,20px)] leading-[1.7] text-white/85">
              Mega Chat Live brings real-time voice rooms, playful gifts, and
              warm communities into one electric social stage.
            </p>
            <div id="download" className="flex flex-wrap gap-4">
              {["Apple Store", "Google Play", "Huawei", "Android"].map(
                (store) => (
                  <a
                    className="store-button inline-flex min-h-10.5 min-w-36.25 items-center justify-center rounded-xl border border-white/50 bg-[#120a60]/30 px-5 font-black shadow-[0_12px_35px_rgba(45,18,142,0.24)] backdrop-blur-xl transition hover:-translate-y-1 hover:scale-[1.03] hover:bg-white/20 max-[560px]:min-w-[calc(50%-8px)]"
                    href="#"
                    key={store}
                  >
                    {store}
                  </a>
                ),
              )}
            </div>
          </div>
          <div
            className="relative grid min-h-140 place-items-center max-[900px]:min-h-115 max-[560px]:min-h-97.5"
            aria-hidden="true"
          >
            <div className="absolute h-102.5 w-102.5 rounded-full border-2 border-white/25 shadow-[inset_0_0_80px_rgba(255,255,255,0.12)] blur-[2px]" />
            <div className="absolute h-71.25 w-71.25 rounded-full bg-[radial-gradient(circle,rgba(22,243,255,0.26),transparent_65%)] blur-[2px]" />
            <Image
              className="hero-phone relative z-10 w-[min(100%,430px)] drop-shadow-[0_44px_46px_rgba(24,12,104,0.34)]"
              src="/assets/chat-rooms.png"
              alt=""
              width={540}
              height={650}
              priority
            />
            {[
              [icons.chat, "left-6 top-[52px]"],
              [icons.heartGift, "right-6 top-[118px]"],
              [icons.mic, "bottom-[120px] left-1"],
              [icons.sparkle, "bottom-[58px] right-14"],
            ].map(([icon, position]) => (
              <span
                className={`hero-orbit absolute z-20 grid h-16 w-16 place-items-center rounded-[20px] border border-white/45 bg-white/15 text-3xl shadow-[0_18px_42px_rgba(20,10,90,0.18)] backdrop-blur-xl max-[560px]:h-13 max-[560px]:w-13 max-[560px]:text-2xl ${position}`}
                key={icon}
              >
                {icon}
              </span>
            ))}
          </div>
        </div>
        <div className="pointer-events-none absolute bottom-9 left-1/2 -translate-x-1/2 whitespace-nowrap text-[clamp(72px,16vw,230px)] font-black leading-[0.8] text-white/10">
          Mega Live
        </div>
      </section>
      <section
        id="overview"
        className="benefits relative z-20 mx-auto -mt-18 grid max-w-260 grid-cols-4 gap-4.5 px-6 pb-16 max-[900px]:mt-7 max-[900px]:grid-cols-2 max-[560px]:grid-cols-1 max-[560px]:px-4.5"
      >
        {benefits.map(([icon, title, copy]) => (
          <article
            className="benefit-card flex min-h-24 items-center gap-3.5 rounded-lg border border-white/20 bg-white/15 p-5 shadow-[0_22px_70px_rgba(42,140,255,0.20)] backdrop-blur-2xl"
            key={title}
          >
            <span className="shrink-0 text-[34px] drop-shadow-[0_10px_12px_rgba(255,61,185,0.42)]">
              {icon}
            </span>
            <div>
              <h2 className="mb-1 text-[15px] font-black">{title}</h2>
              <p className="text-[13px] leading-[1.4] text-white/70">{copy}</p>
            </div>
          </article>
        ))}
      </section>
      <section
        className="overflow-hidden border-y border-white/10 bg-[linear-gradient(90deg,#2417a5,#7a2dff,#f34fc7,#268cff)] py-5.5"
        aria-label="Mega Chat Live highlights"
      >
        <div className="mx-auto grid max-w-295 grid-cols-2 gap-4.5 px-4.5 md:grid-cols-4">
          {stats.map(([value, label]) => (
            <div
              className="flex items-baseline gap-2.5 rounded-lg border border-white/20 bg-[#120a60]/35 px-6 py-5 shadow-[0_18px_45px_rgba(0,0,0,0.18)] backdrop-blur-xl"
              key={value}
            >
              <strong className="text-[34px]">{value}</strong>
              <span className="font-extrabold uppercase text-white/75">
                {label}
              </span>
            </div>
          ))}
        </div>
      </section>
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_15%_8%,rgba(42,140,255,0.32),transparent_25%),radial-gradient(circle_at_84%_34%,rgba(255,61,185,0.34),transparent_25%),linear-gradient(180deg,#120a60_0%,#20107f_45%,#5520d6_100%)] px-[clamp(22px,5vw,84px)] py-20 max-[560px]:px-4.5 max-[560px]:py-14">
        {features.map((feature, index) => (
          <article
            className="feature mx-auto grid min-h-190 max-w-280 grid-cols-[minmax(300px,0.95fr)_minmax(300px,1fr)] items-center gap-[clamp(36px,7vw,120px)] max-[900px]:min-h-0 max-[900px]:grid-cols-1 max-[900px]:gap-4.5 max-[900px]:py-13.5"
            data-align={feature.align}
            key={feature.title}
          >
            <div
              className={`relative grid min-h-140 place-items-center max-[900px]:min-h-0 ${feature.align === "left" ? "order-2 max-[900px]:order-0" : ""}`}
            >
              <div className="absolute h-[72%] w-[72%] rounded-full bg-[radial-gradient(circle,rgba(22,243,255,0.24),transparent_68%)] blur-2xl" />
              <span className="feature-pop absolute left-4.5 top-18 z-20 grid h-18 w-18 place-items-center rounded-[22px] border border-white/25 bg-white/20 text-[38px] shadow-[0_20px_45px_rgba(34,30,82,0.25)] backdrop-blur-xl max-[560px]:h-14 max-[560px]:w-14 max-[560px]:text-3xl">
                {index % 2 === 0 ? icons.heartEyes : icons.gift}
              </span>
              <span className="feature-pop absolute bottom-21.5 right-5 z-20 grid h-18 w-18 place-items-center rounded-[22px] border border-white/25 bg-white/20 text-[38px] shadow-[0_20px_45px_rgba(34,30,82,0.25)] backdrop-blur-xl max-[560px]:h-14 max-[560px]:w-14 max-[560px]:text-3xl">
                {index % 2 === 0 ? icons.hearts : icons.bolt}
              </span>
              <Image
                className="feature-art relative z-10 w-[min(100%,470px)] drop-shadow-[0_36px_42px_rgba(12,8,52,0.38)]"
                src={feature.image}
                alt={feature.title}
                width={620}
                height={760}
              />
            </div>
            <div
              className={`feature-text relative max-w-132.5 rounded-lg border border-white/15 bg-white/10 p-8 shadow-[0_30px_80px_rgba(0,0,0,0.16)] backdrop-blur-2xl ${feature.align === "left" ? "order-1 max-[900px]:order-0" : ""}`}
            >
              <p className="mb-3.5 text-[13px] font-black uppercase text-[#16f3ff]">
                {feature.eyebrow}
              </p>
              <h2 className="relative z-10 text-[clamp(40px,5vw,68px)] font-black leading-none max-[560px]:text-[42px]">
                {feature.title}
              </h2>
              <span className="mb-6 -mt-3.5 block h-4.25 w-47.5 rounded-full bg-[linear-gradient(90deg,#16f3ff,#ff3db9,rgba(255,61,185,0))]" />
              <p className="text-lg leading-[1.75] text-white/80">
                {feature.copy}
              </p>
            </div>
          </article>
        ))}
      </section>
      <section
        id="about"
        className="about relative overflow-hidden bg-[radial-gradient(circle_at_18%_20%,rgba(22,243,255,0.30),transparent_24%),radial-gradient(circle_at_82%_18%,rgba(255,61,185,0.34),transparent_26%),linear-gradient(180deg,#5520d6_0%,#7a2dff_45%,#268cff_100%)] px-[clamp(22px,5vw,84px)] pb-24 pt-45 text-center max-[560px]:pt-32.5"
      >
        <span className="sparkle absolute left-[12%] top-30 h-42.5 w-42.5 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.65),transparent_64%)]" />
        <span className="sparkle absolute bottom-27.5 right-[10%] h-55 w-55 rounded-full bg-[radial-gradient(circle,rgba(22,243,255,0.58),transparent_64%)]" />
        <div className="absolute left-1/2 -top-32.5 h-77.5 w-[140vw] -translate-x-1/2 -rotate-2 rounded-b-[50%] bg-[#5520d6]" />
        <h2 className="about-title relative z-10 mb-9 text-[clamp(40px,6vw,68px)] font-black">
          About Us
        </h2>
        <p className="about-copy relative z-10 mx-auto mb-14.5 max-w-240 rounded-lg border border-white/15 bg-[#120a60]/20 p-7 text-[17px] leading-loose text-white/85 shadow-[0_24px_70px_rgba(0,0,0,0.16)] backdrop-blur-xl">
          Mega Chat Live is a group voice chat app built for real human
          community, fun entertainment, and friendly online moments. Meet people
          through voice, build relationships, and discover social talent from
          around the world.
        </p>
        <Image
          className="about-map relative z-10 w-[min(100%,900px)] rounded-[34px] border border-white/25 shadow-[0_34px_85px_rgba(8,8,54,0.34)]"
          src="/assets/hong-kong-map.png"
          alt="Hong Kong office and map"
          width={900}
          height={433}
        />
      </section>
      <footer className="grid justify-items-center gap-4.5 bg-[linear-gradient(135deg,#268cff,#6846ff,#f34fc7)] px-6 py-15 pb-19 text-center text-sm">
        <strong className="text-base">Joytune Social Media Co., Limited</strong>
        <span>hallalive777@gmail.com</span>
        <span>
          RM 1307,13/F, KENBO COMMERCIAL BUILDING 335-339, QUEEN'S ROAD Hong
          Kong
        </span>
      </footer>
    </main>
  );
}

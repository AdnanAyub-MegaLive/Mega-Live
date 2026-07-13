"use client";

import { useEffect } from "react";

export default function Modal({ isOpen, onClose, title, children }) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    if (isOpen) document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "auto";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-[#020b22]/80 p-5 backdrop-blur-md"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="relative w-full max-w-lg overflow-hidden rounded-4xl border border-[#85eaff]/35 bg-[radial-gradient(circle_at_15%_10%,rgba(5,213,255,0.28),transparent_32%),radial-gradient(circle_at_90%_90%,rgba(215,151,34,0.22),transparent_38%),linear-gradient(145deg,rgba(3,21,63,0.98),rgba(6,75,168,0.98)_48%,rgba(8,127,209,0.97))] p-8 text-center text-white shadow-[0_30px_90px_rgba(2,11,34,0.72)] sm:p-10"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="download-modal-title"
      >
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.09)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.09)_1px,transparent_1px)] bg-size-[48px_48px] opacity-40" />
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 z-10 grid h-10 w-10 place-items-center rounded-full border border-white/25 bg-white/10 text-xl transition hover:rotate-90 hover:bg-white/20"
          aria-label="Close modal"
        >
          &times;
        </button>

        <div className="relative">
          <div className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-3xl border border-white/30 bg-white/15 shadow-[0_12px_35px_rgba(22,243,255,0.18)] backdrop-blur-xl">
            <span className="text-4xl" aria-hidden="true">🚀</span>
          </div>
          <p className="mb-3 text-xs font-black uppercase tracking-[0.28em] text-[#bffbff]">
            Get ready
          </p>
          <h2 id="download-modal-title" className="text-3xl font-black sm:text-4xl">
            {title}
          </h2>
          <div className="mt-4 text-base leading-7 text-white/80">{children}</div>

          <button
            type="button"
            onClick={onClose}
            className="mt-8 min-h-12 rounded-full border border-[#f8d47c] bg-[#d79722] px-8 text-sm font-black uppercase tracking-wider text-[#03153f] shadow-[0_12px_30px_rgba(2,11,34,0.35)] transition hover:-translate-y-0.5 hover:bg-[#f0b94b] hover:shadow-[0_16px_36px_rgba(2,11,34,0.45)]"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

/* ---------- scroll reveal ---------- */
function Reveal({ children, delay = 0, from = "up", className = "" }: { children: ReactNode; delay?: number; from?: "up" | "left" | "right" | "scale"; className?: string }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setOn(true); io.disconnect(); } }, { threshold: 0.12 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const hidden = { up: "translate-y-10", left: "-translate-x-10", right: "translate-x-10", scale: "scale-90" }[from];
  return (
    <div ref={ref} style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-[900ms] ease-[cubic-bezier(.16,1,.3,1)] ${on ? "translate-x-0 translate-y-0 scale-100 opacity-100 blur-0" : `opacity-0 blur-[5px] ${hidden}`} ${className}`}>
      {children}
    </div>
  );
}

/* ---------- icons ---------- */
const ico = (d: string, fill = false) => ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill={fill ? "currentColor" : "none"} stroke={fill ? "none" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>
);
const Phone = ico("M8 2h8a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2ZM11 18h2");
const Play = ico("M5 3l14 9-14 9V3Z", true);
const Bag = ico("M6 7h12l1 13H5L6 7ZM9 7a3 3 0 0 1 6 0");
const Heart = ico("M12 21s-8-5-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 6-8 11-8 11Z");

/* ---------- phone mockup ---------- */
function PhoneMock() {
  const [ok, setOk] = useState(true);
  return (
    <div className="aa-float relative mx-auto w-[260px] rounded-[40px] border-[8px] border-[#24133F] bg-[#24133F] shadow-[0_40px_80px_-25px_rgba(0,0,0,.6)] sm:w-[300px]">
      <div className="absolute left-1/2 top-0 z-10 h-5 w-24 -translate-x-1/2 rounded-b-2xl bg-[#24133F]" />
      <div className="relative overflow-hidden rounded-[32px] bg-[#F2F8F9]">
        <div className="flex items-center justify-between px-4 pb-2 pt-6">
          <span className="text-[13px] font-extrabold text-[#5B21B6]">Koombo</span>
          <span className="flex gap-1"><i className="h-1.5 w-1.5 rounded-full bg-[#5B21B6]" /><i className="h-1.5 w-1.5 rounded-full bg-[#5B21B6]/40" /></span>
        </div>
        
        {/* Main Product Card in Phone */}
        <div className="mx-3 overflow-hidden rounded-2xl bg-white shadow-sm">
          <div className="relative h-44 bg-gradient-to-br from-[#EFE6D8] to-[#D6C3AC]">
            {ok && <img src="/second.webp" alt="" onError={() => setOk(false)} className="absolute inset-0 h-full w-full object-cover" />}
            <span className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-[#E8403E] px-2 py-0.5 text-[9px] font-extrabold text-white">
              <span className="aa-blink h-1.5 w-1.5 rounded-full bg-white" />LIVE
            </span>
            <span className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-white/90 text-[#E8403E]">
              <Heart className="h-3.5 w-3.5" />
            </span>
          </div>
          <div className="flex items-center justify-between p-3">
            <div>
              <p className="text-[12px] font-bold text-[#24133F]">Street Sneakers</p>
              <p className="text-[10px] text-slate-500">Kofi Kicks</p>
              <p className="text-[14px] font-black text-[#5B21B6]">GH₵125</p>
            </div>
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-[#5B21B6] text-white">
              <Bag className="h-4 w-4" />
            </span>
          </div>
        </div>

        {/* Bottom Nav */}
        <div className="mx-3 mb-3 mt-4 flex justify-around rounded-2xl bg-[#24133F] py-3">
          {[Phone, Heart, Bag].map((I, i) => (
            <I key={i} className={`h-5 w-5 ${i === 0 ? "text-purple-200" : "text-white/50"}`} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AppDownloadSection({ appStoreUrl = "#", playStoreUrl = "#" }: { appStoreUrl?: string; playStoreUrl?: string }) {
  return (
    <section className="relative w-full overflow-hidden py-16 sm:py-20 lg:py-24" style={{ fontFamily: "'DM Sans','Inter',system-ui,sans-serif" }}>
      <style>{`
        @keyframes aa-float{0%,100%{transform:translateY(0) rotate(-2deg)}50%{transform:translateY(-14px) rotate(-2deg)}}
        @keyframes aa-blink{50%{opacity:.25}}
        @keyframes aa-shine{0%{transform:translateX(-130%)}60%,100%{transform:translateX(230%)}}
        .aa-float{animation:aa-float 6s ease-in-out infinite}
        .aa-blink{animation:aa-blink 1.2s infinite}
        .aa-btn{position:relative;overflow:hidden}
        .aa-btn::after{content:"";position:absolute;inset:0;width:35%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.35),transparent);animation:aa-shine 3.2s ease-in-out infinite}
        @media(prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}
      `}</style>

      {/* Background */}
      <div className="absolute inset-0">
        <img src="/six.jpeg" alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#24133F]/95 via-[#5B21B6]/90 to-[#7C3AED]/85" />
        <div className="absolute -left-24 top-0 h-80 w-80 rounded-full bg-purple-300/20 blur-3xl" />
        <div className="absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
      </div>

      {/* Main Content */}
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-[1fr_1fr] lg:gap-16">
        
        {/* Left: Text & CTAs */}
        <div className="text-center lg:text-left">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-extrabold uppercase tracking-[.18em] text-purple-100 backdrop-blur">
              <Phone className="h-4 w-4" /> Get the Koombo app
            </span>
          </Reveal>
          
          <Reveal delay={120}>
            <h2 className="mt-6 text-[36px] font-black leading-[1.05] tracking-[-0.04em] text-white sm:text-5xl lg:text-[60px]">
              Shop, follow and sell — <span className="bg-gradient-to-r from-purple-200 to-white bg-clip-text text-transparent">all in one app.</span>
            </h2>
          </Reveal>
          
          <Reveal delay={240}>
            <p className="mx-auto mt-5 max-w-md text-[16px] leading-relaxed text-white/80 sm:text-lg lg:mx-0">
              Ghana's social marketplace in your pocket. Watch vendors go live, follow your favourites, and buy straight from the video.
            </p>
          </Reveal>

          {/* Store Buttons */}
          <Reveal delay={340} className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <a href={appStoreUrl} className="aa-btn group inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-white px-6 py-3.5 text-[#24133F] shadow-xl transition duration-300 hover:-translate-y-1 sm:w-auto">
              <Phone className="h-7 w-7" />
              <span className="text-left leading-tight">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">Download on the</span>
                <span className="block text-[17px] font-extrabold">App Store</span>
              </span>
            </a>
            <a href={playStoreUrl} className="aa-btn group inline-flex w-full items-center justify-center gap-3 rounded-2xl border border-white/30 bg-white/10 px-6 py-3.5 text-white backdrop-blur transition duration-300 hover:-translate-y-1 hover:bg-white/20 sm:w-auto">
              <Play className="h-6 w-6" />
              <span className="text-left leading-tight">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-white/70">Get it on</span>
                <span className="block text-[17px] font-extrabold">Google Play</span>
              </span>
            </a>
          </Reveal>
        </div>

        {/* Right: Phone Mockup */}
        <Reveal from="scale" delay={200} className="relative mx-auto w-full max-w-[340px]">
          <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-300/30 blur-3xl" />
          <PhoneMock />
        </Reveal>
      </div>
    </section>
  );
}
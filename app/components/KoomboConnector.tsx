'use client';

import React, { useEffect, useRef, useState } from 'react';

const ACCENT = '#5B21B6';
const PILL = '#EDE9FE';
const LOGO_FILTER =
  'brightness(0) saturate(100%) invert(15%) sepia(78%) saturate(3574%) hue-rotate(256deg) brightness(83%) contrast(102%)';

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

type RevealFrom = 'up' | 'left' | 'right' | 'scale';

function Reveal({ children, delay = 0, from = 'up', className = '' }: { children: React.ReactNode; delay?: number; from?: RevealFrom; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const hidden =
    from === 'left' ? '-translate-x-10 opacity-0' : from === 'right' ? 'translate-x-10 opacity-0' : from === 'scale' ? 'scale-90 opacity-0' : 'translate-y-10 opacity-0';

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-[cubic-bezier(.16,1,.3,1)] motion-reduce:!transform-none motion-reduce:!opacity-100 ${shown ? 'translate-x-0 translate-y-0 scale-100 opacity-100' : hidden} ${className}`}
    >
      {children}
    </div>
  );
}

function Arrow({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const s = { stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

const IconShare = () => (
  <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
    <circle cx="18" cy="5" r="3" {...s} />
    <circle cx="6" cy="12" r="3" {...s} />
    <circle cx="18" cy="19" r="3" {...s} />
    <path d="m8.6 10.7 6.8-4.4M8.6 13.3l6.8 4.4" {...s} />
  </svg>
);
const IconCoin = () => (
  <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
    <circle cx="12" cy="12" r="9" {...s} />
    <path d="M12 7v10M9.5 9.5c0-1 1-2 2.5-2s2.5 1 2.5 2-1 2-2.5 2-2.5 1-2.5 2 1 2 2.5 2 2.5-1 2.5-2" {...s} />
  </svg>
);
const IconBolt = () => (
  <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
    <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" {...s} />
  </svg>
);
const IconLink = () => (
  <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
    <path d="M10 14a4 4 0 0 0 5.66 0l3-3a4 4 0 0 0-5.66-5.66l-1 1M14 10a4 4 0 0 0-5.66 0l-3 3a4 4 0 0 0 5.66 5.66l1-1" {...s} />
  </svg>
);

const POINTS = [
  { 
    icon: <IconLink />, 
    title: 'Get your unique link', 
    body: 'Sign up in seconds and get a personalized link to start sharing.' 
  },
  { 
    icon: <IconShare />, 
    title: 'Share with your people', 
    body: 'Post products you love on WhatsApp, Instagram, or anywhere your community hangs out.' 
  },
  { 
    icon: <IconCoin />, 
    title: 'Get paid weekly', 
    body: 'Earn a commission on every successful sale. Money hits your account every week, no questions asked.' 
  },
];

/* ------------------------------------------------------------------ */
/* Foldable phone held by two hands (unfolds with scroll)              */
/* ------------------------------------------------------------------ */

const PANEL = 'M 190 168 Q 190 154 205 157 L 450 205 L 450 425 L 205 447 Q 190 449 190 435 Z';
const SCREEN = 'M 203 177 Q 203 169 212 171 L 450 216 L 450 414 L 212 436 Q 203 437 203 429 Z';
const HALF_SHIFT = 260;

function Hand() {
  return (
    <g>
      <path d="M -40 570 C -30 470 5 400 70 372 C 120 350 178 374 208 424 C 226 454 236 506 240 570 Z" fill="url(#skin)" />
      <path d="M 66 398 C 58 332 92 250 148 190 C 166 170 196 168 206 186 C 214 203 202 226 190 256 C 172 302 162 352 152 398 Z" fill="url(#skin)" />
      <path d="M 178 177 C 191 166 207 176 205 193 C 203 205 192 209 184 201 Z" fill="#A06C50" opacity="0.85" />
      <path d="M 96 332 Q 124 324 152 336" stroke="#2A170C" strokeOpacity="0.35" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M 82 372 Q 118 362 150 374" stroke="#2A170C" strokeOpacity="0.25" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M 52 486 Q 118 436 206 480" stroke="#2A170C" strokeOpacity="0.28" strokeWidth="3.5" strokeLinecap="round" fill="none" />
      <path d="M 100 270 C 118 232 140 206 160 190" stroke="#B07A5C" strokeOpacity="0.5" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M 24 440 C 40 410 62 392 86 384" stroke="#B07A5C" strokeOpacity="0.35" strokeWidth="3" strokeLinecap="round" fill="none" />
    </g>
  );
}

function Arcs() {
  return (
    <g clipPath="url(#screenClip)">
      <rect x="190" y="150" width="270" height="310" fill="url(#screenBg)" />
      {[300, 240, 180, 120].map((r, i) => (
        <circle key={r} cx="330" cy="420" r={r} fill="#fff" fillOpacity={0.05 + i * 0.015} className="kb-arc" style={{ animationDelay: `${i * 0.4}s` }} />
      ))}
    </g>
  );
}

function PhoneLogo({ cx, y }: { cx: number; y: number }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <text x={cx} y={y + 26} fontSize="24" fontWeight="800" letterSpacing="-0.5">
        koombo
      </text>
    );
  }
  return (
    <image
      href="/logo.png"
      x={cx - 62}
      y={y}
      width="124"
      height="38"
      preserveAspectRatio="xMidYMid meet"
      onError={() => setFailed(true)}
      style={{ filter: 'brightness(0) invert(1)' }}
    />
  );
}

const foldStyle = { transform: 'translate(450px, 0px) scaleX(var(--s, 1)) translate(-450px, 0px)' } as React.CSSProperties;

function FoldablePhone() {
  return (
    <svg viewBox="0 130 900 410" className="h-auto w-full overflow-visible" role="img" aria-label="A foldable phone held by two hands, showing Koombo Share and Earn">
      <defs>
        <linearGradient id="skin" gradientUnits="userSpaceOnUse" x1="20" y1="200" x2="240" y2="570">
          <stop offset="0%" stopColor="#7B4E36" />
          <stop offset="55%" stopColor="#5A3825" />
          <stop offset="100%" stopColor="#3E2415" />
        </linearGradient>
        <linearGradient id="screenBg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#5B21B6" />
        </linearGradient>
        <linearGradient id="bezel" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3F3F46" />
          <stop offset="100%" stopColor="#18181B" />
        </linearGradient>
        <clipPath id="screenClip"><path d={SCREEN} /></clipPath>
        <clipPath id="screenClipR"><path d={SCREEN} transform="translate(900 0) scale(-1 1)" /></clipPath>
        <radialGradient id="glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#DDD6FE" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#DDD6FE" stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse cx="450" cy="300" rx="430" ry="230" fill="url(#glow)" />

      {/* Left half */}
      <g style={foldStyle}>
        <path d={PANEL} fill="url(#bezel)" stroke="#52525B" strokeWidth="2" strokeLinejoin="round" />
        <Arcs />
        <g transform="rotate(3 328 322)" fill="#fff" textAnchor="middle" style={{ fontFamily: 'inherit' }}>
          <PhoneLogo cx={328} y={240} />
          <text x="328" y="322" fontSize="34" fontWeight="800" letterSpacing="1">SHARE</text>
          <text x="328" y="354" fontSize="14" fontWeight="500" opacity="0.9">Send your link to friends</text>
          <text x="328" y="374" fontSize="14" fontWeight="500" opacity="0.9">and followers</text>
        </g>
      </g>

      {/* Right half */}
      <g style={foldStyle}>
        <g transform="translate(900 0) scale(-1 1)">
          <path d={PANEL} fill="url(#bezel)" stroke="#52525B" strokeWidth="2" strokeLinejoin="round" />
        </g>
        <g clipPath="url(#screenClipR)">
          <g transform="translate(900 0) scale(-1 1)"><Arcs /></g>
        </g>
        <g transform="rotate(-3 572 320)" fill="#fff" textAnchor="middle" style={{ fontFamily: 'inherit' }}>
          <PhoneLogo cx={572} y={238} />
          <text x="572" y="320" fontSize="34" fontWeight="800" letterSpacing="1">EARN</text>
          <text x="572" y="352" fontSize="14" fontWeight="500" opacity="0.9">Get commission on</text>
          <text x="572" y="372" fontSize="14" fontWeight="500" opacity="0.9">every sale</text>
        </g>
      </g>

      {/* Hinge */}
      <path d="M 450 205 L 450 425" stroke="#000" strokeOpacity="0.35" strokeWidth="3" />
      <path d="M 448 216 L 448 414" stroke="#fff" strokeOpacity="0.18" strokeWidth="2" />

      {/* Hands follow the folding halves */}
      <g style={{ transform: `translateX(calc((1 - var(--s, 1)) * ${HALF_SHIFT}px))` }}>
        <Hand />
      </g>
      <g style={{ transform: `translateX(calc((1 - var(--s, 1)) * -${HALF_SHIFT}px))` }}>
        <g transform="translate(900 0) scale(-1 1)"><Hand /></g>
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

const clamp = (n: number, a = 0, b = 1) => Math.min(b, Math.max(a, n));

export default function KoomboConnector({
  onBack,
  onRegisterClick,
}: {
  onBack?: () => void;
  onRegisterClick?: () => void;
}) {
  const rootRef = useRef<HTMLElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      stepsRef.current?.style.setProperty('--line', '1');
      return;
    }

    let raf = 0;
    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      const doc = document.documentElement;
      const max = Math.max(1, doc.scrollHeight - vh);

      root.style.setProperty('--pg', String(clamp(window.scrollY / max)));
      root.style.setProperty('--py', String(window.scrollY));

      if (phoneRef.current) {
        const r = phoneRef.current.getBoundingClientRect();
        const d = Math.abs(r.top + r.height / 2 - vh * 0.6) / (vh * 0.9);
        const t = clamp((d - 0.12) / 0.6);
        const smooth = t * t * (3 - 2 * t);
        phoneRef.current.style.setProperty('--s', String(1 - 0.42 * smooth));
      }

      if (stepsRef.current) {
        const r = stepsRef.current.getBoundingClientRect();
        stepsRef.current.style.setProperty('--line', String(clamp((vh * 0.85 - r.top) / (vh * 0.45))));
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const handleRegister = () => {
    if (onRegisterClick) {
      onRegisterClick();
      return;
    }
    window.location.href = '/connector';
  };

  return (
    <section
      ref={rootRef}
      id="connector"
      className="relative w-full overflow-x-hidden bg-white text-[#27272A] antialiased max-md:h-[100svh] max-md:overflow-hidden md:min-h-screen"
      style={
        {
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          textRendering: 'optimizeLegibility',
          WebkitFontSmoothing: 'antialiased',
          WebkitTapHighlightColor: 'transparent',
          '--pg': 0,
          '--py': 0,
        } as React.CSSProperties
      }
    >
      <style>{`
        @keyframes kb-up{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:none}}
        @keyframes kb-bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        @keyframes kb-arc{0%,100%{transform:scale(1)}50%{transform:scale(1.04)}}
        @keyframes kb-chip{0%,100%{translate:0 0}50%{translate:0 -6px}}
        @keyframes kb-frame{from{clip-path:inset(0 100% 100% 0);opacity:0}to{clip-path:inset(0 0 0 0);opacity:1}}
        @keyframes kb-pop{from{transform:scale(0)}to{transform:scale(1)}}
        @keyframes kb-tag{from{opacity:0;transform:translate(-50%,-6px)}to{opacity:1;transform:translate(-50%,0)}}

        .kb-a{animation:kb-up .8s cubic-bezier(.16,1,.3,1) both}
        .kb-bob{animation:kb-bob 6s ease-in-out infinite}
        .kb-arc{transform-box:fill-box;transform-origin:center;animation:kb-arc 6s ease-in-out infinite}
        .kb-chip{animation:kb-chip 4.5s ease-in-out infinite}
        .kb-chip-2{animation:kb-chip 5.5s ease-in-out .8s infinite}

        .t-eyebrow{font-size:14px;font-weight:600;letter-spacing:.08em;text-transform:uppercase}
        .t-h1{font-size:clamp(2.5rem,6vw,5rem);font-weight:800;line-height:1.05;letter-spacing:-0.03em}
        .t-h2{font-size:clamp(1.75rem,3vw,2.5rem);font-weight:700;line-height:1.15;letter-spacing:-0.02em}
        .t-lead{font-size:clamp(1.0625rem,1.5vw,1.25rem);font-weight:400;line-height:1.65}
        .t-title{font-size:1.125rem;font-weight:600;line-height:1.3;letter-spacing:-0.01em}
        .t-body{font-size:0.95rem;font-weight:400;line-height:1.6}
        .t-btn{font-size:1rem;font-weight:600}

        .kb-word-frame{animation:kb-frame .9s cubic-bezier(.65,0,.35,1) .9s both}
        .kb-word-handle{animation:kb-pop .3s cubic-bezier(.3,1.6,.5,1) both}
        .kb-word-tag{animation:kb-tag .4s ease-out 1.9s both}

        @media(prefers-reduced-motion:reduce){
          *,*::before,*::after{animation:none!important;transition-duration:.01ms!important}
        }
      `}</style>

      {onBack && (
        <button
          type="button"
          onClick={onBack}
          aria-label="Go back"
          className="absolute left-4 top-4 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-md transition active:scale-90 sm:left-8 sm:top-6"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
      )}

      <div className="pointer-events-none fixed inset-x-0 top-0 z-50 hidden h-1 md:block" aria-hidden="true">
        <div className="h-full origin-left bg-[#6D28D9]" style={{ transform: 'scaleX(var(--pg, 0))' }} />
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 hidden h-[1400px] md:block"
        style={{
          backgroundImage: 'radial-gradient(rgba(91,33,182,.12) 1.2px, transparent 1.2px)',
          backgroundSize: '28px 28px',
          transform: 'translateY(calc(var(--py, 0) * 0.12px))',
          maskImage: 'radial-gradient(ellipse 70% 60% at 50% 35%, #000 25%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 35%, #000 25%, transparent 80%)',
        }}
      />

      <div className="relative mx-auto hidden max-w-[1280px] flex-col items-center px-6 pb-24 pt-16 text-center md:flex lg:px-8">
        {/* ---------------- Hero ---------------- */}
        <div className="relative flex w-full flex-col items-center">
          <p className="kb-a t-eyebrow mt-2 inline-flex w-fit rounded-full px-5 py-2" style={{ backgroundColor: PILL, color: ACCENT, animationDelay: '.1s' }}>
            Introducing Koombo Connectors
          </p>

          <h1 className="kb-a t-h1 mt-6 text-[#18181B]" style={{ animationDelay: '.15s' }}>
            <span className="block">Share your link.</span>
            <span className="block text-[#5B21B6]">Earn on every sale.</span>
          </h1>

          <span aria-hidden="true" className="kb-word-tag relative mt-4 inline-flex whitespace-nowrap rounded-md bg-[#7C3AED] px-2.5 py-1 text-[20px] font-semibold normal-case tracking-normal text-white shadow-sm">
            Every single sale
          </span>

          <p className="kb-a t-lead mt-8 max-w-[600px] text-[#52525B]" style={{ animationDelay: '.25s' }}>
            Turn your network into income. Get your unique link, share products with friends and followers, and earn a commission on every purchase. No inventory, no upfront costs.
          </p>

          <div className="kb-a mt-8" style={{ animationDelay: '.32s' }}>
            <button
              type="button"
              onClick={handleRegister}
              className="t-btn group inline-flex h-14 items-center justify-center gap-2 rounded-full bg-[#5B21B6] px-8 text-white shadow-[0_14px_30px_-10px_rgba(91,33,182,0.5)] transition hover:-translate-y-0.5 hover:bg-[#4C1D95] active:scale-[.97]"
            >
              Become a Connector
              <Arrow className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          {/* Foldable phone */}
          <div className="kb-a relative mt-16 w-full max-w-[860px]" style={{ animationDelay: '.4s' }}>
            <div ref={phoneRef} className="kb-bob" style={{ '--s': 1 } as React.CSSProperties}>
              <FoldablePhone />
            </div>

            {/* Realistic Notification Toast 2 */}
            <div className="kb-chip-2 absolute right-[8%] top-[20%] z-10 hidden sm:block" style={{ transform: 'translateY(calc(var(--py, 0) * 0.06px))' }}>
              <div className="flex items-center gap-3 rounded-2xl border border-white/60 bg-white/80 px-4 py-3 text-left shadow-[0_20px_40px_-12px_rgba(0,0,0,0.15)] backdrop-blur-md">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
                  <IconCoin />
                </span>
                <div>
                  <p className="text-[13px] font-semibold leading-tight text-[#18181B]">Commission earned</p>
                  <p className="text-[12px] font-bold text-green-600">+ GH₵ 45.00</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ---------------- How it works ---------------- */}
        <div className="mt-32 w-full">
          <Reveal>
            <p className="t-eyebrow" style={{ color: ACCENT }}>How it actually works</p>
            <h2 className="t-h2 mt-3">Get started in minutes</h2>
          </Reveal>

          <div ref={stepsRef} className="relative mt-16" style={{ '--line': 0 } as React.CSSProperties}>
            <div aria-hidden="true" className="absolute left-[16.6%] right-[16.6%] top-7 h-0 border-t-2 border-dashed border-[#E5E7EB]" />
            <div aria-hidden="true" className="absolute left-[16.6%] right-[16.6%] top-7 h-[3px] origin-left rounded-full bg-[#6D28D9]" style={{ transform: 'scaleX(var(--line, 0))' }} />

            <ul className="relative grid gap-8 sm:grid-cols-3">
              {POINTS.map((p, i) => (
                <li key={p.title} className="flex flex-col items-center">
                  <Reveal from="scale" delay={i * 120}>
                    <span className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full bg-[#6D28D9] text-[18px] font-bold text-white shadow-[0_10px_24px_-8px_rgba(91,33,182,0.6)] ring-8 ring-white">
                      {i + 1}
                    </span>
                  </Reveal>
                  <Reveal from={i === 0 ? 'left' : i === 2 ? 'right' : 'up'} delay={i * 120 + 100} className="mt-8 w-full">
                    <div tabIndex={0} className="group relative h-full cursor-pointer overflow-hidden rounded-2xl border border-[#F3F4F6] bg-white p-6 text-left outline-none transition-all duration-300 hover:-translate-y-1 hover:border-[#DDD6FE] hover:shadow-[0_20px_40px_-16px_rgba(91,33,182,0.15)] focus-visible:-translate-y-1 focus-visible:border-[#DDD6FE] focus-visible:shadow-[0_20px_40px_-16px_rgba(91,33,182,0.15)]">
                      <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-[#6D28D9] transition-transform duration-500 group-hover:scale-x-100 group-focus-visible:scale-x-100" />
                      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F5F3FF] text-[#5B21B6] transition-all duration-300 group-hover:rotate-3 group-hover:scale-105 group-hover:bg-[#6D28D9] group-hover:text-white group-focus-visible:bg-[#6D28D9] group-focus-visible:text-white">
                        {p.icon}
                      </span>
                      <h3 className="t-title mt-5 transition-colors duration-300 group-hover:text-[#5B21B6]">{p.title}</h3>
                      <p className="t-body mt-2 text-[#6B7280] transition-colors duration-300 group-hover:text-[#374151]">{p.body}</p>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ---------------- Closing CTA ---------------- */}
        <Reveal from="scale" className="mt-32 w-full">
          <div className="relative overflow-hidden rounded-[32px] bg-[#18181B] px-8 py-20 text-center text-white sm:px-14">
            <svg aria-hidden="true" viewBox="0 0 400 400" className="pointer-events-none absolute -right-20 -top-24 h-[420px] w-[420px]" style={{ transform: 'translateY(calc(var(--py, 0) * -0.05px))' }}>
              {[190, 140, 90, 40].map((r) => (
                <circle key={r} cx="200" cy="200" r={r} fill="none" stroke="#8B5CF6" strokeOpacity="0.2" strokeWidth="2" />
              ))}
            </svg>
            <svg aria-hidden="true" viewBox="0 0 400 400" className="pointer-events-none absolute -bottom-32 -left-24 h-[360px] w-[360px]" style={{ transform: 'translateY(calc(var(--py, 0) * 0.04px))' }}>
              {[190, 140, 90, 40].map((r) => (
                <circle key={r} cx="200" cy="200" r={r} fill="none" stroke="#8B5CF6" strokeOpacity="0.15" strokeWidth="2" />
              ))}
            </svg>

            <p className="t-eyebrow relative text-[#C4B5FD]">Ready when you are</p>
            
            {/* UPDATED: Changed from t-h2 to t-h1 to match the hero headline sizing */}
            <h2 className="t-h1 relative mx-auto mt-4 max-w-[600px]">Start earning on every sale today</h2>
            
            <p className="t-lead relative mx-auto mt-4 max-w-[480px] text-white/60">No stock, no upfront costs. Just your unique link and your people.</p>
            <button
              type="button"
              onClick={handleRegister}
              className="t-btn group relative mt-10 inline-flex h-14 items-center justify-center gap-2 rounded-full bg-white px-8 text-[#18181B] transition hover:-translate-y-0.5 hover:bg-[#F5F3FF] active:scale-[.97]"
            >
              Become a Connector
              <Arrow className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
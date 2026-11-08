'use client';

import React, { useEffect, useRef, useState } from 'react';

const ACCENT = '#5B21B6';
const PILL = '#EDE9FE';

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

type RevealFrom = 'up' | 'left' | 'right' | 'scale';

function Reveal({
  children,
  delay = 0,
  from = 'up',
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  from?: RevealFrom;
  className?: string;
}) {
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
    from === 'left'
      ? '-translate-x-5 opacity-0 sm:-translate-x-10'
      : from === 'right'
      ? 'translate-x-5 opacity-0 sm:translate-x-10'
      : from === 'scale'
      ? 'scale-90 opacity-0'
      : 'translate-y-8 opacity-0 sm:translate-y-10';

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-[cubic-bezier(.16,1,.3,1)] motion-reduce:!transform-none motion-reduce:!opacity-100 ${
        shown ? 'translate-x-0 translate-y-0 scale-100 opacity-100' : hidden
      } ${className}`}
    >
      {children}
    </div>
  );
}

function Arrow({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const s = {
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const;

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
    <path
      d="M12 7v10M9.5 9.5c0-1 1-2 2.5-2s2.5 1 2.5 2-1 2-2.5 2-2.5 1-2.5 2 1 2 2.5 2 2.5-1 2.5-2"
      {...s}
    />
  </svg>
);

const IconLink = () => (
  <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
    <path
      d="M10 14a4 4 0 0 0 5.66 0l3-3a4 4 0 0 0-5.66-5.66l-1 1M14 10a4 4 0 0 0-5.66 0l-3 3a4 4 0 0 0 5.66 5.66l1-1"
      {...s}
    />
  </svg>
);

const IconCheck = () => (
  <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
    <path d="m5 12.5 4.5 4.5L19 7.5" {...s} strokeWidth={2.6} />
  </svg>
);

const POINTS = [
  {
    icon: <IconLink />,
    title: 'Get your unique link',
    body: 'Sign up in seconds and get a personalized link to start sharing.',
  },
  {
    icon: <IconShare />,
    title: 'Share with your people',
    body: 'Post products you love on WhatsApp, Instagram, or anywhere your community hangs out.',
  },
  {
    icon: <IconCoin />,
    title: 'Get paid weekly',
    body: 'Earn a commission on every successful sale. Money hits your account every week, no questions asked.',
  },
];

/* ------------------------------------------------------------------ */
/* Phone mockup                                                        */
/* ------------------------------------------------------------------ */

const BARS = [38, 52, 44, 70, 58, 86, 100];
const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

const SALES = [
  { item: 'Air runner sneakers', amount: '+ GH₵ 45.00' },
  { item: 'Ankara tote bag', amount: '+ GH₵ 30.00' },
  { item: 'Shea body butter', amount: '+ GH₵ 18.50' },
];

function PhoneBody() {
  return (
    <div
      aria-hidden="true"
      className="relative h-[560px] w-[286px] rounded-[44px] bg-[#18181B] p-[7px] shadow-[0_34px_50px_-20px_rgba(24,24,27,0.55),inset_0_0_0_1.5px_#3F3F46]"
    >
      <span className="absolute -left-[3px] top-[104px] h-[30px] w-[3px] rounded-l bg-[#27272A]" />
      <span className="absolute -left-[3px] top-[150px] h-[54px] w-[3px] rounded-l bg-[#27272A]" />
      <span className="absolute -left-[3px] top-[214px] h-[54px] w-[3px] rounded-l bg-[#27272A]" />
      <span className="absolute -right-[3px] top-[160px] h-[84px] w-[3px] rounded-r bg-[#27272A]" />

      <div className="relative h-full w-full overflow-hidden rounded-[37px] bg-[#FAFAFA] px-4 pt-[12px] text-[#18181B]">
        <span className="absolute left-1/2 top-[10px] z-10 h-[22px] w-[78px] -translate-x-1/2 rounded-full bg-[#18181B]" />

        <div className="flex h-[22px] items-center justify-between px-2 text-[11px] font-semibold">
          <span>9:41</span>

          <span className="flex items-center gap-1">
            <svg width="16" height="10" viewBox="0 0 16 10" fill="currentColor">
              <rect x="0" y="6" width="3" height="4" rx="0.8" />
              <rect x="4.3" y="4" width="3" height="6" rx="0.8" />
              <rect x="8.6" y="2" width="3" height="8" rx="0.8" />
              <rect x="12.9" y="0" width="3" height="10" rx="0.8" />
            </svg>

            <svg width="22" height="10" viewBox="0 0 22 10" fill="none">
              <rect x="0.5" y="0.5" width="18" height="9" rx="2.5" stroke="currentColor" opacity="0.5" />
              <rect x="2" y="2" width="13" height="6" rx="1.5" fill="currentColor" />
              <rect x="19.5" y="3.2" width="1.8" height="3.6" rx="0.9" fill="currentColor" opacity="0.5" />
            </svg>
          </span>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-[18px] font-extrabold tracking-[-0.03em] text-[#5B21B6]">
            koombo
          </span>

          <span className="rounded-full bg-[#EDE9FE] px-2.5 py-1 text-[10px] font-bold text-[#5B21B6]">
            Connector
          </span>
        </div>

        <div className="mt-4 rounded-[20px] bg-[#5B21B6] p-4 text-white">
          <p className="text-[11px] font-semibold text-white/70">This week</p>

          <p className="mt-1 text-[30px] font-extrabold leading-none tracking-[-0.03em]">
            GH₵ 245.00
          </p>

          <div className="mt-4 flex h-[56px] items-end gap-1.5">
            {BARS.map((h, i) => (
              <span
                key={i}
                className={`kb-bar flex-1 rounded-[3px] ${
                  i === BARS.length - 1 ? 'bg-white' : 'bg-white/35'
                }`}
                style={{
                  height: `${h}%`,
                  animationDelay: `${0.5 + i * 0.08}s`,
                }}
              />
            ))}
          </div>

          <div className="mt-1.5 flex text-[9px] font-semibold text-white/60">
            {DAYS.map((d, i) => (
              <span key={i} className="flex-1 text-center">
                {d}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-3 rounded-2xl border border-[#E4E4E7] bg-white p-3">
          <p className="text-[9.5px] font-bold uppercase tracking-[0.1em] text-[#71717A]">
            Your link
          </p>

          <div className="mt-1.5 flex items-center gap-2">
            <svg viewBox="0 0 24 24" fill="none" className="h-[14px] w-[14px] shrink-0 text-[#5B21B6]">
              <path
                d="M10 14a4 4 0 0 0 5.66 0l3-3a4 4 0 0 0-5.66-5.66l-1 1M14 10a4 4 0 0 0-5.66 0l-3 3a4 4 0 0 0 5.66 5.66l1-1"
                {...s}
              />
            </svg>

            <span className="min-w-0 flex-1 truncate text-[12px] font-semibold">
              koombo.app/c/your-name
            </span>

            <span className="shrink-0 rounded-full bg-[#5B21B6] px-3 py-1 text-[11px] font-bold text-white">
              Copy
            </span>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <span className="mr-1 text-[11px] font-semibold text-[#52525B]">
            Share to
          </span>

          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#25D366] text-[12px] font-bold text-white">W</span>
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E1306C] text-[12px] font-bold text-white">I</span>
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#229ED9] text-[12px] font-bold text-white">T</span>
        </div>

        <p className="mt-5 text-[9.5px] font-bold uppercase tracking-[0.1em] text-[#71717A]">
          Recent sales
        </p>

        <ul className="mt-2 space-y-2">
          {SALES.map((x) => (
            <li
              key={x.item}
              className="flex items-center justify-between rounded-xl bg-white px-3 py-2.5 ring-1 ring-[#E4E4E7]"
            >
              <span className="truncate text-[12px] font-semibold">
                {x.item}
              </span>

              <span className="shrink-0 pl-2 text-[12px] font-bold text-[#16A34A]">
                {x.amount}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Hero visual                                                         */
/* ------------------------------------------------------------------ */

function HeroVisual({
  phoneRef,
}: {
  phoneRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <div
      role="img"
      aria-label="The Koombo connector app showing a personal share link, weekly earnings and recent sales"
      className="relative mx-auto h-[340px] w-full max-w-[440px] rounded-[28px] border border-[#DDD6FE] bg-[#EDE9FE] sm:h-[420px] sm:max-w-[640px] sm:overflow-hidden sm:rounded-[36px] md:h-[470px] md:max-w-[860px]"
    >
      <div
        className="absolute left-[7%] top-[26%] hidden max-w-[210px] text-left md:block"
        aria-hidden="true"
      >
        <p className="text-[58px] font-extrabold leading-none tracking-[-0.04em] text-[#18181B]">
          Share
        </p>

        <p className="mt-3 text-[15px] leading-6 text-[#52525B]">
          Send your link to friends and followers.
        </p>
      </div>

      <div
        className="absolute right-[7%] top-[26%] hidden max-w-[210px] text-right md:block"
        aria-hidden="true"
      >
        <p className="text-[58px] font-extrabold leading-none tracking-[-0.04em] text-[#5B21B6]">
          Earn
        </p>

        <p className="mt-3 text-[15px] leading-6 text-[#52525B]">
          Get commission on every sale.
        </p>
      </div>

      <div className="kb-bob absolute inset-x-0 top-[-80px] z-20 mx-auto w-fit sm:top-[40px] md:top-[44px]">
        <div
          ref={phoneRef}
          className="kb-tilt relative h-[403px] w-[206px] drop-shadow-[0_18px_24px_rgba(24,24,27,0.3)] sm:h-[560px] sm:w-[286px] sm:drop-shadow-none"
          style={{
            ['--t' as string]: 0,
            transformOrigin: '50% 100%',
          }}
        >
          <div className="absolute left-0 top-0 origin-top-left scale-[0.72] sm:scale-100">
            <PhoneBody />
          </div>
        </div>
      </div>

      <div
        className="kb-chip absolute left-[4%] top-[14%] z-10 hidden sm:block md:bottom-[15%] md:top-auto"
        aria-hidden="true"
      >
        <div className="flex items-center gap-3 rounded-2xl bg-white px-3.5 py-3 text-left shadow-[0_14px_30px_-12px_rgba(24,24,27,0.3)] ring-1 ring-[#E4E4E7]">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#EDE9FE] text-[#5B21B6]">
            <IconCheck />
          </span>

          <div>
            <p className="text-[13px] font-semibold leading-tight text-[#18181B]">
              Link copied
            </p>

            <p className="text-[12px] font-medium text-[#71717A]">
              Ready to share
            </p>
          </div>
        </div>
      </div>

      <div
        className="kb-chip-2 absolute right-[4%] top-[40%] z-10 hidden sm:block md:bottom-[15%] md:top-auto"
        aria-hidden="true"
      >
        <div className="flex items-center gap-3 rounded-2xl bg-white px-3.5 py-3 text-left shadow-[0_14px_30px_-12px_rgba(24,24,27,0.3)] ring-1 ring-[#E4E4E7]">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
            <IconCoin />
          </span>

          <div>
            <p className="text-[13px] font-semibold leading-tight text-[#18181B]">
              Commission earned
            </p>

            <p className="text-[12px] font-bold text-green-600">
              + GH₵ 45.00
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

const clamp = (n: number, a = 0, b = 1) =>
  Math.min(b, Math.max(a, n));

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

        const d =
          Math.abs(r.top + r.height / 2 - vh * 0.6) / (vh * 0.9);

        const t = 1 - clamp((d - 0.1) / 0.6);
        const smooth = t * t * (3 - 2 * t);

        phoneRef.current.style.setProperty('--t', String(smooth));
      }

      if (stepsRef.current) {
        const r = stepsRef.current.getBoundingClientRect();

        stepsRef.current.style.setProperty(
          '--line',
          String(clamp((vh * 0.85 - r.top) / (vh * 0.45)))
        );
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
      className="relative w-full overflow-x-hidden bg-white text-[#27272A] antialiased md:min-h-screen"
      style={
        {
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          textRendering: 'optimizeLegibility',
          WebkitFontSmoothing: 'antialiased',
          WebkitTapHighlightColor: 'transparent',
          '--pg': 0,
          '--py': 0,
        } as React.CSSProperties
      }
    >
      <style>{`
        @keyframes kb-up {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: none; }
        }

        @keyframes kb-bob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }

        @keyframes kb-chip {
          0%, 100% { translate: 0 0; }
          50% { translate: 0 -6px; }
        }

        @keyframes kb-bar {
          from { transform: scaleY(.08); }
          to { transform: scaleY(1); }
        }

        @keyframes kb-tag {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .kb-a {
          animation: kb-up .8s cubic-bezier(.16,1,.3,1) both;
        }

        .kb-bob {
          animation: kb-bob 6s ease-in-out infinite;
        }

        .kb-chip {
          animation: kb-chip 4.5s ease-in-out infinite;
        }

        .kb-chip-2 {
          animation: kb-chip 5.5s ease-in-out .8s infinite;
        }

        .kb-bar {
          transform-origin: bottom;
          animation: kb-bar .9s cubic-bezier(.16,1,.3,1) both;
        }

        @media(min-width:640px) {
          .kb-tilt {
            transform: rotate(calc(-5deg + var(--t, 0) * 5deg));
          }
        }

        /* -------------------------------------------------
           HERO HEADING - FORCE RESPONSIVE FONT SIZES
        ------------------------------------------------- */

        #koombo-connector-heading {
          display: block !important;
          width: 100% !important;
          max-width: 1000px !important;
          margin-left: auto !important;
          margin-right: auto !important;

          font-family: 'DM Sans', 'Inter', sans-serif !important;
          font-size: 76px !important;
          font-weight: 800 !important;
          line-height: 1.04 !important;
          letter-spacing: -0.055em !important;

          text-align: center !important;
          text-wrap: balance !important;
          color: #18181B !important;
        }

        #koombo-connector-heading span {
          display: block !important;
          font-size: inherit !important;
          font-weight: 800 !important;
          line-height: inherit !important;
        }

        /* Mobile */
        @media (max-width: 639px) {
          #koombo-connector-heading {
            font-size: 38px !important;
            line-height: 1.12 !important;
            letter-spacing: -0.045em !important;
            max-width: 100% !important;
          }
        }

        /* Tablet */
        @media (min-width: 640px) and (max-width: 1023px) {
          #koombo-connector-heading {
            font-size: 58px !important;
            line-height: 1.08 !important;
            letter-spacing: -0.05em !important;
          }
        }

        /* Desktop */
        @media (min-width: 1024px) {
          #koombo-connector-heading {
            font-size: 76px !important;
            line-height: 1.04 !important;
            letter-spacing: -0.055em !important;
          }
        }

        .t-eyebrow {
          font-size: 14px;
          font-weight: 600;
          letter-spacing: .08em;
          text-transform: uppercase;
        }

        .t-title {
          font-size: 1.0625rem;
          font-weight: 600;
          line-height: 1.3;
          letter-spacing: -0.01em;
        }

        .t-body {
          font-size: 0.92rem;
          font-weight: 400;
          line-height: 1.6;
        }

        .t-btn {
          font-size: 1rem;
          font-weight: 600;
        }

        .t-balance {
          text-wrap: balance;
        }

        @media(min-width:640px) {
          .t-title {
            font-size: 1.125rem;
          }

          .t-body {
            font-size: 0.95rem;
          }
        }

        .kb-word-tag {
          animation: kb-tag .4s ease-out 1.9s both;
        }

        @media(prefers-reduced-motion:reduce) {
          *, *::before, *::after {
            animation: none !important;
            transition-duration: .01ms !important;
          }
        }
      `}</style>

      {onBack && (
        <button
          type="button"
          onClick={onBack}
          aria-label="Go back"
          className="absolute left-3 top-[max(0.75rem,env(safe-area-inset-top))] z-50 flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-md transition active:scale-90 sm:left-8 sm:top-6"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
      )}

      <div
        className="pointer-events-none fixed inset-x-0 top-0 z-50 hidden h-1 md:block"
        aria-hidden="true"
      >
        <div
          className="h-full origin-left bg-[#6D28D9]"
          style={{ transform: 'scaleX(var(--pg, 0))' }}
        />
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 hidden h-[1400px] md:block"
        style={{
          backgroundImage:
            'radial-gradient(rgba(91,33,182,.12) 1.2px, transparent 1.2px)',
          backgroundSize: '28px 28px',
          transform: 'translateY(calc(var(--py, 0) * 0.12px))',
          maskImage:
            'radial-gradient(ellipse 70% 60% at 50% 35%, #000 25%, transparent 80%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 70% 60% at 50% 35%, #000 25%, transparent 80%)',
        }}
      />

      <div
        className={`relative mx-auto flex w-full max-w-[1280px] flex-col items-center px-4 pb-14 text-center sm:px-6 sm:pb-20 sm:pt-16 md:pb-24 md:pt-16 lg:px-8 ${
          onBack ? 'pt-[4.75rem]' : 'pt-10'
        }`}
      >
        {/* HERO */}

        <div className="relative flex w-full min-w-0 flex-col items-center">
          <p
            className="kb-a t-eyebrow mt-1 inline-flex max-w-full items-center justify-center rounded-full px-3 py-1.5 text-[10px] tracking-[0.06em] min-[380px]:px-4 min-[380px]:text-[11px] sm:mt-2 sm:px-5 sm:py-2 sm:text-[14px] sm:tracking-[0.08em]"
            style={{
              backgroundColor: PILL,
              color: ACCENT,
              animationDelay: '.1s',
            }}
          >
            Introducing Koombo Connectors
          </p>

          {/* HERO HEADING */}

          <h1
            id="koombo-connector-heading"
            className="kb-a mt-5 w-full max-w-[1000px] px-1 text-center text-[#18181B] sm:mt-6 sm:px-0"
            style={{ animationDelay: '.15s' }}
          >
            <span className="block">Share your link.</span>

            <span className="block text-[#5B21B6]">
              Earn on every sale.
            </span>
          </h1>

          <span
            aria-hidden="true"
            className="kb-word-tag relative mt-3 inline-flex whitespace-nowrap rounded-md bg-[#7C3AED] px-2.5 py-1 text-[14px] font-semibold normal-case tracking-normal text-white shadow-sm sm:mt-4 sm:text-[20px]"
          >
            Every single sale
          </span>

          <p
            className="kb-a mt-5 max-w-[600px] px-1 text-[0.92rem] leading-[1.65] text-[#52525B] sm:mt-8 sm:px-0 sm:text-[1.0625rem] sm:leading-8"
            style={{ animationDelay: '.25s' }}
          >
            Turn your network into income. Get your unique link, share products
            with friends and followers, and earn a commission on every purchase.
            No inventory, no upfront costs.
          </p>

          <div
            className="kb-a mt-6 w-full sm:mt-8 sm:w-auto"
            style={{ animationDelay: '.32s' }}
          >
            <button
              type="button"
              onClick={handleRegister}
              className="t-btn group inline-flex h-12 w-full max-w-[320px] items-center justify-center gap-2 rounded-full bg-[#5B21B6] px-6 text-white shadow-[0_14px_30px_-10px_rgba(91,33,182,0.5)] transition hover:-translate-y-0.5 hover:bg-[#4C1D95] active:scale-[.97] sm:h-14 sm:w-auto sm:max-w-none sm:px-8"
            >
              Become a Connector

              <Arrow className="h-4 w-4 transition-transform group-hover:translate-x-1 sm:h-5 sm:w-5" />
            </button>
          </div>

          {/* PHONE MOCKUP */}

          <div
            className="kb-a relative mt-24 w-full sm:mt-12 md:mt-16"
            style={{ animationDelay: '.4s' }}
          >
            <HeroVisual phoneRef={phoneRef} />
          </div>
        </div>

        {/* HOW IT WORKS */}

        <div className="mt-12 w-full min-w-0 sm:mt-24 md:mt-32">
          <Reveal>
            <p
              className="t-eyebrow text-[12px] sm:text-[14px]"
              style={{ color: ACCENT }}
            >
              How it actually works
            </p>

            <h2 className="t-balance mt-2 text-[1.65rem] font-bold leading-tight tracking-[-0.03em] text-[#18181B] sm:mt-3 sm:text-[clamp(1.75rem,3vw,2.5rem)]">
              Get started in minutes
            </h2>
          </Reveal>

          <div
            ref={stepsRef}
            className="relative mt-7 sm:mt-16"
            style={{ '--line': 0 } as React.CSSProperties}
          >
            <div
              aria-hidden="true"
              className="absolute left-[16.6%] right-[16.6%] top-7 hidden h-0 border-t-2 border-dashed border-[#E5E7EB] sm:block"
            />

            <div
              aria-hidden="true"
              className="absolute left-[16.6%] right-[16.6%] top-7 hidden h-[3px] origin-left rounded-full bg-[#6D28D9] sm:block"
              style={{ transform: 'scaleX(var(--line, 0))' }}
            />

            <div
              aria-hidden="true"
              className="absolute bottom-6 left-[19px] top-6 w-[2px] rounded-full bg-[#E5E7EB] sm:hidden"
            />

            <div
              aria-hidden="true"
              className="absolute bottom-6 left-[19px] top-6 w-[2px] origin-top rounded-full bg-[#6D28D9] sm:hidden"
              style={{ transform: 'scaleY(var(--line, 0))' }}
            />

            <ul className="relative grid gap-4 sm:grid-cols-3 sm:gap-8">
              {POINTS.map((p, i) => (
                <li
                  key={p.title}
                  className="flex items-start gap-3 sm:flex-col sm:items-center sm:gap-0"
                >
                  <Reveal from="scale" delay={i * 120} className="shrink-0">
                    <span className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full bg-[#6D28D9] text-[15px] font-bold text-white shadow-[0_10px_24px_-8px_rgba(91,33,182,0.6)] ring-4 ring-white sm:h-14 sm:w-14 sm:text-[18px] sm:ring-8">
                      {i + 1}
                    </span>
                  </Reveal>

                  <Reveal
                    from={i === 0 ? 'left' : i === 2 ? 'right' : 'up'}
                    delay={i * 120 + 100}
                    className="min-w-0 flex-1 sm:mt-8 sm:w-full sm:flex-none"
                  >
                    <div
                      tabIndex={0}
                      className="group relative h-full cursor-pointer overflow-hidden rounded-2xl border border-[#F3F4F6] bg-white p-4 text-left outline-none transition-all duration-300 hover:-translate-y-1 hover:border-[#DDD6FE] hover:shadow-[0_20px_40px_-16px_rgba(91,33,182,0.15)] focus-visible:-translate-y-1 focus-visible:border-[#DDD6FE] focus-visible:shadow-[0_20px_40px_-16px_rgba(91,33,182,0.15)] sm:p-6"
                    >
                      <span
                        aria-hidden="true"
                        className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-[#6D28D9] transition-transform duration-500 group-hover:scale-x-100 group-focus-visible:scale-x-100"
                      />

                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F5F3FF] text-[#5B21B6] transition-all duration-300 group-hover:rotate-3 group-hover:scale-105 group-hover:bg-[#6D28D9] group-hover:text-white group-focus-visible:bg-[#6D28D9] group-focus-visible:text-white sm:h-12 sm:w-12">
                        {p.icon}
                      </span>

                      <h3 className="t-title mt-3 transition-colors duration-300 group-hover:text-[#5B21B6] sm:mt-5">
                        {p.title}
                      </h3>

                      <p className="t-body mt-1.5 break-words text-[#6B7280] transition-colors duration-300 group-hover:text-[#374151] sm:mt-2">
                        {p.body}
                      </p>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* CLOSING CTA */}

        <Reveal
          from="scale"
          className="mt-12 w-full min-w-0 sm:mt-24 md:mt-32"
        >
          <div className="relative overflow-hidden rounded-[24px] bg-[#18181B] px-5 py-10 text-center text-white sm:rounded-[32px] sm:px-8 sm:py-20 lg:px-14">
            <svg
              aria-hidden="true"
              viewBox="0 0 400 400"
              className="pointer-events-none absolute -right-24 -top-28 h-[300px] w-[300px] sm:-right-20 sm:-top-24 sm:h-[420px] sm:w-[420px]"
              style={{
                transform: 'translateY(calc(var(--py, 0) * -0.05px))',
              }}
            >
              {[190, 140, 90, 40].map((r) => (
                <circle
                  key={r}
                  cx="200"
                  cy="200"
                  r={r}
                  fill="none"
                  stroke="#8B5CF6"
                  strokeOpacity="0.2"
                  strokeWidth="2"
                />
              ))}
            </svg>

            <svg
              aria-hidden="true"
              viewBox="0 0 400 400"
              className="pointer-events-none absolute -bottom-24 -left-24 h-[260px] w-[260px] sm:-bottom-32 sm:h-[360px] sm:w-[360px]"
              style={{
                transform: 'translateY(calc(var(--py, 0) * 0.04px))',
              }}
            >
              {[190, 140, 90, 40].map((r) => (
                <circle
                  key={r}
                  cx="200"
                  cy="200"
                  r={r}
                  fill="none"
                  stroke="#8B5CF6"
                  strokeOpacity="0.15"
                  strokeWidth="2"
                />
              ))}
            </svg>

            <p className="t-eyebrow relative text-[12px] text-[#C4B5FD] sm:text-[14px]">
              Ready when you are
            </p>

            <h2 className="t-balance relative mx-auto mt-3 max-w-[600px] text-[clamp(1.75rem,7.2vw,4rem)] font-extrabold leading-[1.1] tracking-[-0.03em] text-white sm:mt-4 sm:leading-[1.08] sm:tracking-[-0.04em]">
              Start earning on every sale today
            </h2>

            <p className="relative mx-auto mt-3 max-w-[480px] text-[0.92rem] leading-[1.65] text-white/60 sm:mt-4 sm:text-[1.125rem] sm:leading-7">
              No stock, no upfront costs. Just your unique link and your people.
            </p>

            <button
              type="button"
              onClick={handleRegister}
              className="t-btn group relative mt-7 inline-flex h-12 w-full max-w-[320px] items-center justify-center gap-2 rounded-full bg-white px-6 text-[#18181B] transition hover:-translate-y-0.5 hover:bg-[#F5F3FF] active:scale-[.97] sm:mt-10 sm:h-14 sm:w-auto sm:max-w-none sm:px-8"
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
'use client';

import { useId, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import SiteHeader from '../components/SiteHeader';
import KoomboFooter from '../components/Footer';
import RiderSceen from '../components/RiderSceen';

/* -------------------------------------------------------------------------- */
/* ICONS                                                                      */
/* -------------------------------------------------------------------------- */

function GoogleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

function SparklesIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
    </svg>
  );
}

function TelegramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
    </svg>
  );
}

function ArrowUpRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
    </svg>
  );
}

function EyeIcon({ off }: { off?: boolean }) {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
      {off && <path d="M3 3l18 18" />}
    </svg>
  );
}

function BoltIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8Z" />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* SHARED LOGIN FORM (used by the desktop panel and the mobile sheet)         */
/* -------------------------------------------------------------------------- */

function LoginForm({ mobile = false }: { mobile?: boolean }) {
  const uid = useId();
  const emailId = `${uid}-email`;
  const passId = `${uid}-password`;
  const [showPass, setShowPass] = useState(false);

  const field =
    'w-full rounded-xl border border-[#dcdcdc] bg-[#f7f7f7] px-4 text-base outline-none transition-colors focus:border-[#6B21A8] focus:bg-white focus:ring-2 focus:ring-[#6B21A8]/20';

  return (
    <>
      <button
        type="button"
        className={`flex w-full items-center justify-center gap-3 rounded-xl border border-[#dcdcdc] bg-white text-base font-semibold text-[#333] shadow-sm transition hover:bg-gray-50 active:scale-[0.98] ${
          mobile ? 'h-12 animate-fade-up delay-200' : 'mt-8 py-3.5 animate-fade-up delay-300'
        }`}
      >
        <GoogleIcon />
        Login with Google
      </button>

      <div className={`relative ${mobile ? 'my-5 animate-fade-up delay-300' : 'my-8 animate-fade-up delay-300'}`}>
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#e0e0e0]" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-3 text-[#888]">or</span>
        </div>
      </div>

      <form className={`space-y-4 sm:space-y-5 ${mobile ? 'animate-fade-up delay-400' : 'animate-fade-up delay-400'}`} onSubmit={(e) => e.preventDefault()}>
        <div>
          <label htmlFor={emailId} className="mb-1.5 block text-sm font-semibold text-[#1a1a1a]">
            Email address
          </label>
          <input
            type="email"
            id={emailId}
            autoComplete="email"
            placeholder="Enter your email"
            className={`${field} ${mobile ? 'h-12' : 'py-3.5'}`}
          />
        </div>

        <div>
          <label htmlFor={passId} className="mb-1.5 block text-sm font-semibold text-[#1a1a1a]">
            Password
          </label>
          <div className="relative">
            <input
              type={showPass ? 'text' : 'password'}
              id={passId}
              autoComplete="current-password"
              placeholder="Enter your password"
              className={`${field} pr-12 ${mobile ? 'h-12' : 'py-3.5'}`}
            />
            <button
              type="button"
              onClick={() => setShowPass((v) => !v)}
              aria-label={showPass ? 'Hide password' : 'Show password'}
              aria-pressed={showPass}
              className="absolute right-1.5 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-lg text-[#6b6b6b] transition hover:text-[#6B21A8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B21A8]"
            >
              <EyeIcon off={showPass} />
            </button>
          </div>
        </div>

        <button
          type="submit"
          className={`btn-sheen relative w-full overflow-hidden rounded-xl bg-[#6B21A8] text-base font-bold text-white shadow-[0_12px_26px_-10px_rgba(107,33,168,0.7)] transition-all hover:bg-[#581c87] active:scale-[0.98] ${
            mobile ? 'h-12' : 'py-3.5'
          }`}
        >
          Login with email
        </button>
      </form>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* PAGE                                                                       */
/* -------------------------------------------------------------------------- */

export default function SellerGateway() {
  return (
    <div className="min-h-screen bg-white font-sans text-[#1a1a1a]">
      {/* LUFGA FONT & ANIMATIONS INJECTION */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lufga:wght@400;500;600;700;800;900&display=swap');

        .font-lufga {
          font-family: 'Lufga', ui-sans-serif, system-ui, sans-serif;
        }

        /* Entrance Animations */
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-up { animation: fade-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) both; }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
        .delay-500 { animation-delay: 0.5s; }
        .delay-600 { animation-delay: 0.6s; }
        .delay-700 { animation-delay: 0.7s; }

        /* Continuous Floating Animations */
        @keyframes float-slow {
          0%, 100% { transform: translate(-50%, -50%) translateY(0px); }
          50% { transform: translate(-50%, -50%) translateY(-15px); }
        }
        @keyframes float-fast {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float-center { animation: float-slow 7s ease-in-out infinite; }
        .animate-float-card { animation: float-fast 5s ease-in-out infinite; }

        /* ---------- Mobile-only motion ---------- */
        @keyframes sheet-up {
          from { opacity: 0; transform: translateY(60px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes word-rise {
          from { opacity: 0; transform: translateY(110%); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes chip-pop {
          0%   { opacity: 0; transform: translateY(14px) scale(0.85); }
          70%  { opacity: 1; transform: translateY(-3px) scale(1.04); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes ken-burns {
          from { transform: scale(1.02); }
          to   { transform: scale(1.14); }
        }
        @keyframes sheen {
          0%   { transform: translateX(-130%) skewX(-18deg); }
          60%, 100% { transform: translateX(260%) skewX(-18deg); }
        }
        @keyframes live-dot {
          0%   { box-shadow: 0 0 0 0 rgba(34,197,94,.65); }
          70%  { box-shadow: 0 0 0 8px rgba(34,197,94,0); }
          100% { box-shadow: 0 0 0 0 rgba(34,197,94,0); }
        }
        @keyframes handle-nudge {
          0%, 100% { transform: scaleX(1); }
          50% { transform: scaleX(1.35); }
        }

        .animate-sheet-up { animation: sheet-up .9s cubic-bezier(0.16, 1, 0.3, 1) .15s both; }
        .animate-ken { animation: ken-burns 14s ease-out both alternate infinite; }
        .animate-chip { animation: chip-pop .7s cubic-bezier(0.16, 1, 0.3, 1) both; }
        .animate-live { animation: live-dot 1.8s ease-out infinite; }
        .animate-handle { animation: handle-nudge 2.6s ease-in-out 1.2s infinite; }
        .word-mask { display: block; overflow: hidden; }
        .word-mask > span { display: block; animation: word-rise .8s cubic-bezier(0.16, 1, 0.3, 1) both; }

        .btn-sheen::after {
          content: '';
          position: absolute;
          inset: 0;
          width: 40%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,.35), transparent);
          animation: sheen 3.6s ease-in-out 1.4s infinite;
          pointer-events: none;
        }

        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation: none !important;
            transition-duration: .01ms !important;
          }
        }
      `}</style>

      <SiteHeader />

      {/* MAIN: stacked mobile design, split-screen desktop design */}
      <main className="lg:flex lg:min-h-[calc(100vh-80px)] lg:flex-row lg:pt-[130px]">

        {/* ============================ MOBILE (below lg) ============================ */}
        <div className="lg:hidden">
          {/* Image hero */}
          <section className="relative isolate overflow-hidden bg-[#2E1065] px-5 pb-14 pt-[104px] text-white sm:px-8 sm:pt-[120px]">
            <img
              src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=1400&auto=format&fit=crop"
              alt=""
              className="animate-ken absolute inset-0 -z-10 h-full w-full object-cover"
            />
            <div
              aria-hidden
              className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(20,8,50,0.55)_0%,rgba(20,8,50,0.45)_40%,rgba(20,8,50,0.85)_100%)]"
            />

            <p className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-3 py-1.5 text-xs font-semibold backdrop-blur-md">
              <span className="animate-live h-2 w-2 rounded-full bg-[#22C55E]" />
              Koombo Seller Portal
            </p>

            <h2 className="font-lufga mt-4 text-[2.15rem] font-black leading-[1.05] tracking-[-0.03em] min-[400px]:text-[2.4rem] sm:text-5xl">
              <span className="word-mask"><span style={{ animationDelay: '.15s' }}>List smarter.</span></span>
              <span className="word-mask"><span style={{ animationDelay: '.3s' }}>Sell faster.</span></span>
            </h2>

            <p className="animate-fade-up delay-400 mt-3 max-w-[22rem] text-[15px] leading-6 text-white/85 sm:max-w-md sm:text-base">
              Create listings with Shuri AI and get order alerts straight to Telegram.
            </p>

            {/* Animated feature chips */}
            <div className="mt-6 flex flex-wrap gap-2.5">
              <div className="animate-chip delay-500">
                <div className="animate-float-card flex items-center gap-2.5 rounded-2xl bg-white px-3 py-2.5 text-left shadow-[0_14px_30px_-10px_rgba(0,0,0,0.5)]">
                  <span className="grid h-8 w-8 place-items-center rounded-xl bg-[#6B21A8] text-white">
                    <SparklesIcon className="h-4 w-4" />
                  </span>
                  <span className="leading-tight">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-[#6B21A8]">Shuri AI</span>
                    <span className="block text-[13px] font-extrabold text-[#1a1a1a]">Instant listings</span>
                  </span>
                </div>
              </div>

              <div className="animate-chip delay-700">
                <div className="animate-float-card flex items-center gap-2.5 rounded-2xl bg-white px-3 py-2.5 text-left shadow-[0_14px_30px_-10px_rgba(0,0,0,0.5)]" style={{ animationDelay: '1s' }}>
                  <span className="grid h-8 w-8 place-items-center rounded-xl bg-[#0088cc] text-white">
                    <TelegramIcon className="h-4 w-4" />
                  </span>
                  <span className="leading-tight">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-[#0088cc]">Instant</span>
                    <span className="block text-[13px] font-extrabold text-[#1a1a1a]">Telegram alerts</span>
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Form sheet overlapping the hero */}
          <section className="animate-sheet-up relative -mt-7 rounded-t-[28px] bg-white px-5 pb-10 pt-3 shadow-[0_-18px_40px_-20px_rgba(20,8,50,0.45)] sm:px-8">
            <div className="mx-auto w-full max-w-md">
              <span aria-hidden className="animate-handle mx-auto mb-5 block h-1.5 w-10 rounded-full bg-[#E4DFF0]" />

              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#F5F3FF]">
                  <Image src="/logo.png" alt="Koombo" width={48} height={48} className="h-7 w-7 object-contain" />
                </span>
                <div>
                  <h1 className="animate-fade-up delay-100 text-2xl font-bold leading-tight tracking-tight">Welcome back</h1>
                  <p className="animate-fade-up delay-200 text-sm text-[#5e5e5e]">Log in to your Seller Portal</p>
                </div>
              </div>

              <div className="mt-6">
                <LoginForm mobile />
              </div>

              {/* New to Koombo */}
              <div className="animate-fade-up delay-500 mt-7 flex items-center justify-between gap-3 rounded-2xl bg-[#F5F3FF] p-4">
                <div className="min-w-0">
                  <h3 className="flex items-center gap-1.5 text-[15px] font-bold">
                    <BoltIcon className="h-4 w-4 shrink-0 text-[#6B21A8]" />
                    New to Koombo?
                  </h3>
                  <p className="mt-0.5 text-sm text-[#5e5e5e]">Partner with us today!</p>
                </div>
                <Link
                  href="/lister/setup"
                  className="inline-flex h-11 shrink-0 items-center rounded-xl bg-[#1a1a1a] px-5 text-sm font-bold text-white transition active:scale-[0.97] hover:bg-[#333]"
                >
                  Get started
                </Link>
              </div>

              <p className="animate-fade-up delay-600 mt-6 text-center text-xs leading-relaxed text-[#888]">
                By logging in, you agree to Koombo&apos;s Seller{' '}
                <Link href="/terms" className="font-semibold text-[#1a1a1a] underline hover:text-[#6B21A8]">
                  Security Terms
                </Link>.
              </p>
            </div>
          </section>
        </div>

        {/* ===================== DESKTOP LEFT PANEL: LOGIN FORM ===================== */}
        <div className="hidden w-1/2 flex-col justify-center px-24 py-12 lg:flex xl:px-32">
          <div className="mx-auto w-full max-w-md">
            <h1 className="animate-fade-up delay-100 text-4xl font-bold tracking-tight text-[#1a1a1a]">Welcome back</h1>
            <p className="animate-fade-up delay-200 mt-3 text-base text-[#5e5e5e]">Log in to your Koombo Seller Portal</p>

            <LoginForm />

            <div className="animate-fade-up delay-500 mt-10 flex items-center justify-between border-t border-[#e0e0e0] pt-8">
              <div>
                <h3 className="text-base font-bold text-[#1a1a1a]">New to Koombo?</h3>
                <p className="mt-1 text-sm text-[#5e5e5e]">Partner with us today!</p>
              </div>
              <Link
                href="/lister/setup"
                className="rounded-lg border border-[#dcdcdc] bg-white px-6 py-2.5 text-sm font-bold text-[#1a1a1a] transition hover:border-[#bbb] hover:bg-gray-50"
              >
                Get started
              </Link>
            </div>

            <p className="animate-fade-up delay-500 mt-8 text-xs leading-relaxed text-[#888]">
              By logging in, you agree to Koombo&apos;s Seller{' '}
              <Link href="/terms" className="font-semibold text-[#1a1a1a] underline hover:text-[#6B21A8]">
                Security Terms
              </Link>.
            </p>
          </div>
        </div>

        {/* ================= DESKTOP RIGHT PANEL: IMAGE + FLOATING UI ================= */}
        <div className="relative hidden w-1/2 overflow-hidden lg:flex lg:flex-col lg:items-center lg:justify-center">
          <img
            src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=2070&auto=format&fit=crop"
            alt="Business manager on phone"
            className="animate-fade-up absolute inset-0 h-full w-full object-cover"
          />

          <div className="relative z-10 flex max-w-xl flex-col items-center px-8 text-center">
            <h2 className="font-lufga animate-fade-up delay-100 text-4xl font-black uppercase leading-[1.1] tracking-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] sm:text-5xl xl:text-6xl">
              List Smarter.<br />Sell Faster.
            </h2>

            <div className="animate-fade-up delay-200 mx-auto mt-6 max-w-lg rounded-2xl border border-white/10 bg-black/40 px-6 py-4 backdrop-blur-md">
              <p className="text-base font-medium leading-relaxed text-white sm:text-lg">
                Use <span className="font-bold text-[#b794f6]">Shuri AI</span> to create perfect product listings in seconds. Get instant order notifications directly on Telegram—no extra apps needed.
              </p>
            </div>

            <div className="animate-fade-up delay-300 relative mt-16 flex h-[320px] w-full items-center justify-center">
              <div className="animate-float-center absolute left-1/2 top-1/2 z-0">
                <div className="relative flex h-28 w-28 items-center justify-center rounded-3xl border border-white/20 bg-white/10 shadow-[0_0_60px_-10px_rgba(107,33,168,0.5)] backdrop-blur-xl">
                  <Image src="/logo.png" alt="Koombo" width={96} height={96} className="h-14 w-14 object-contain opacity-95" />
                  <div className="absolute inset-0 animate-ping rounded-3xl border border-[#6B21A8]/40 opacity-30" />
                </div>
              </div>

              <div className="animate-float-card absolute right-0 top-0 z-10" style={{ animationDelay: '0.5s' }}>
                <div className="group flex cursor-default items-center gap-3 rounded-2xl border border-white/40 bg-white/90 px-5 py-4 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] backdrop-blur-md transition-transform duration-300 hover:scale-105">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#6B21A8] text-white shadow-lg shadow-[#6B21A8]/30">
                    <SparklesIcon className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#6B21A8]">Shuri AI</p>
                    <p className="text-sm font-extrabold text-[#1a1a1a]">Real-time Listing</p>
                  </div>
                  <ArrowUpRightIcon className="h-4 w-4 text-[#888] transition-colors group-hover:text-[#6B21A8]" />
                </div>
              </div>

              <div className="animate-float-card absolute bottom-0 left-0 z-10" style={{ animationDelay: '1.2s' }}>
                <div className="group flex cursor-default items-center gap-3 rounded-2xl border border-white/40 bg-white/90 px-5 py-4 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] backdrop-blur-md transition-transform duration-300 hover:scale-105">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0088cc] text-white shadow-lg shadow-[#0088cc]/30">
                    <TelegramIcon className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#0088cc]">Instant</p>
                    <p className="text-sm font-extrabold text-[#1a1a1a]">Telegram Alerts</p>
                  </div>
                  <ArrowUpRightIcon className="h-4 w-4 text-[#888] transition-colors group-hover:text-[#0088cc]" />
                </div>
              </div>

              <svg className="pointer-events-none absolute inset-0 z-0 h-full w-full opacity-30" preserveAspectRatio="none" aria-hidden="true">
                <line x1="50%" y1="50%" x2="85%" y2="20%" stroke="white" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="50%" y1="50%" x2="15%" y2="80%" stroke="white" strokeWidth="1" strokeDasharray="4 4" />
              </svg>
            </div>

            <div className="animate-fade-up delay-400 mt-8 flex items-center justify-center gap-2 rounded-full border border-white/10 bg-black/40 px-5 py-2.5 backdrop-blur-md">
              <span className="inline-block h-2 w-2 rounded-full bg-[#0088cc] shadow-[0_0_8px_rgba(0,136,204,0.6)]" />
              <span className="text-sm font-medium text-white">Powered by Shuri AI • Telegram Integration</span>
            </div>
          </div>
        </div>
      </main>

      {/* RIDER SCENE: delivery rider, trees and road strip at the bottom of the page */}
      <RiderSceen />

      <KoomboFooter />
    </div>
  );
}
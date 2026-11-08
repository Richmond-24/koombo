'use client';

import React, { useState } from 'react';
import KoomboFooter from '../components/Footer';
import SiteHeader from '../components/SiteHeader';
import {
  ArrowUpRight,
  Check,
  Clock,
  Copy,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  TimerReset,
} from 'lucide-react';

const EMAIL = 'hello@koombo.app';
const PHONE_DISPLAY = '+233 53 119 0274';
const PHONE_HREF = 'tel:+233531190274';
const WHATSAPP_HREF =
  'https://wa.me/233531190274?text=' + encodeURIComponent('Hi Koombo, I need help with ');

const highlights = [
  { title: 'Fast response', description: 'We usually reply within a few hours, any day of the week.', icon: TimerReset },
  { title: 'Real people', description: 'Talk to a team that knows buying, selling and growing on Koombo.', icon: ShieldCheck },
  { title: 'Any enquiry', description: 'Partnerships, listings or product support, all welcome.', icon: MessageCircle },
];

/* Figma-style multiplayer cursor with a name tag */
const Cursor = ({ name, color = '#6D28D9', className = '' }: { name: string; color?: string; className?: string }) => (
  <div aria-hidden className={`pointer-events-none absolute z-20 ${className}`}>
    <svg width="22" height="22" viewBox="0 0 24 24" fill={color} stroke="#fff" strokeWidth="1.5">
      <path d="M4 3l16 7-7 2.5L10.5 20 4 3z" />
    </svg>
    <span
      className="-mt-1 ml-4 inline-block rounded-full px-2.5 py-1 text-[11px] font-bold text-white shadow-md"
      style={{ background: color }}
    >
      {name}
    </span>
  </div>
);

/* Figma-style selection box with corner handles, shown when a card is hovered */
const Handles = ({ label }: { label: string }) => (
  <span
    aria-hidden
    className="pointer-events-none absolute -inset-1 hidden rounded-[2.1rem] opacity-0 ring-1 ring-[#8B5CF6] transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100 lg:block"
  >
    {['-left-1 -top-1', '-right-1 -top-1', '-bottom-1 -left-1', '-bottom-1 -right-1'].map((pos) => (
      <span key={pos} className={`absolute h-2 w-2 border border-[#8B5CF6] bg-white ${pos}`} />
    ))}
    <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-[#8B5CF6] px-2 py-0.5 text-[10px] font-bold text-white">
      {label}
    </span>
  </span>
);

export default function ContactPage() {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable: the mailto link still works */
    }
  };

  /* Nested "frame" look: outer shell + inner panel */
  const shell =
    'group relative rounded-[2rem] border border-[#E4DFF2] bg-white p-1.5 shadow-[0_16px_40px_-26px_rgba(76,29,149,0.35)] transition-shadow hover:shadow-[0_20px_44px_-24px_rgba(76,29,149,0.45)]';
  const panel =
    'relative flex h-full flex-col justify-between overflow-hidden rounded-[1.6rem] bg-gradient-to-br from-[#F7F5FC] to-[#EDE9FE]/60 p-5 sm:p-7';
  const chip =
    'flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#E4DFF2] bg-gradient-to-b from-white to-[#EDE9FE] text-[#5B21B6] shadow-[0_1px_2px_rgba(76,29,149,0.12)]';
  const focus =
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6D28D9]';

  return (
    <main className="min-h-screen overflow-hidden bg-[#F8F8F6] text-[#1D1B20]">
      <style>{`
        @keyframes koombo-rise { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
        @keyframes koombo-ping { 75%, 100% { transform: scale(2.4); opacity: 0; } }
        @keyframes koombo-dot { 0%, 80%, 100% { transform: translateY(0); opacity: .5; } 40% { transform: translateY(-3px); opacity: 1; } }
        @keyframes koombo-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
        .koombo-rise { animation: koombo-rise .7s cubic-bezier(.16,1,.3,1) both; }
        .koombo-ping { animation: koombo-ping 1.8s cubic-bezier(0,0,.2,1) infinite; }
        .koombo-dot { animation: koombo-dot 1.2s ease-in-out infinite; }
        .koombo-float { animation: koombo-float 6s ease-in-out infinite; }
        .koombo-canvas {
          background-image: radial-gradient(#D9D2EC 1.2px, transparent 1.2px);
          background-size: 22px 22px;
          -webkit-mask-image: radial-gradient(ellipse at 70% 30%, black 15%, transparent 72%);
          mask-image: radial-gradient(ellipse at 70% 30%, black 15%, transparent 72%);
        }
        @media (prefers-reduced-motion: reduce) {
          .koombo-rise, .koombo-ping, .koombo-dot, .koombo-float { animation: none !important; }
          * { transition: none !important; }
        }
      `}</style>

      <SiteHeader />

      <section className="relative">
        <div aria-hidden className="koombo-canvas pointer-events-none absolute inset-0" />
        <div className="pointer-events-none absolute -right-40 top-0 h-[28rem] w-[28rem] rounded-full bg-[#DDD6FE]/50 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-5 pb-16 pt-24 sm:px-8 sm:pt-28 lg:pb-24 lg:pt-36">
          {/* Intro */}
          <div className="koombo-rise flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="kb-hero-title text-[#2E1065]">
                <span className="relative inline-block">
                  Let’s talk.
                  <Cursor name="You" color="#10B981" className="-bottom-5 right-0 hidden sm:block lg:-right-6" />
                </span>
              </h1>
              <p className="kb-body-copy mt-6 max-w-md text-[#5F5B66]">
                Want to sell, partner with us or get help? Reach out directly and the right person will pick it up.
              </p>
            </div>

            <div className="inline-flex w-fit items-center gap-3 rounded-full border border-white/70 bg-white/80 py-2.5 pl-4 pr-5 shadow-[0_8px_24px_-12px_rgba(76,29,149,0.3)] backdrop-blur">
              <span className="relative flex h-2.5 w-2.5">
                <span className="koombo-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500/70" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
              </span>
              <span className="text-sm leading-tight">
                <span className="block font-bold">Open 24/7</span>
                <span className="block text-[#5F5B66]">Always here to help</span>
              </span>
            </div>
          </div>

          {/* Bento grid */}
          <div className="koombo-rise mt-14 grid gap-4 lg:grid-cols-12" style={{ animationDelay: '.12s' }}>
            {/* WhatsApp: the one loud card */}
            <a
              href={WHATSAPP_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className={`group relative rounded-[2rem] bg-[#0B5B2D] p-1.5 shadow-[0_24px_60px_-26px_rgba(11,91,45,0.7)] lg:col-span-7 lg:row-span-2 ${focus}`}
            >
              <Handles label="WhatsApp" />
              <div className="relative flex h-full min-h-[22rem] flex-col justify-between overflow-hidden rounded-[1.6rem] border border-white/10 bg-gradient-to-br from-[#22B95F] via-[#1AA755] to-[#128246] p-5 text-white sm:p-8">
                {/* grid texture + glow */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 opacity-[0.12]"
                  style={{
                    backgroundImage:
                      'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
                    backgroundSize: '28px 28px',
                    WebkitMaskImage: 'radial-gradient(ellipse at top right, black 10%, transparent 70%)',
                    maskImage: 'radial-gradient(ellipse at top right, black 10%, transparent 70%)',
                  }}
                />
                <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full bg-white/20 blur-3xl" />

                <div className="relative flex items-start justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/15 text-white backdrop-blur">
                    <MessageCircle size={22} />
                  </span>
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white transition group-hover:bg-white group-hover:text-[#128246]">
                    <ArrowUpRight size={18} />
                  </span>
                </div>

                {/* Chat preview */}
                <div className="relative my-8 space-y-2.5" aria-hidden="true">
                  <div className="ml-auto w-fit max-w-[80%] rounded-2xl rounded-br-md bg-white px-4 py-2.5 text-sm font-medium text-[#1D1B20] shadow-lg">
                    Hi, I’d like to list an item on Koombo.
                  </div>
                  <div className="w-fit max-w-[80%] rounded-2xl rounded-bl-md bg-[#0B5B2D]/85 px-4 py-2.5 text-sm text-white">
                    Happy to help. What are you selling?
                  </div>
                  <div className="flex w-fit items-center gap-1 rounded-2xl rounded-bl-md bg-[#0B5B2D]/60 px-4 py-3">
                    {[0, 0.15, 0.3].map((d) => (
                      <span
                        key={d}
                        className="koombo-dot h-1.5 w-1.5 rounded-full bg-white"
                        style={{ animationDelay: `${d}s` }}
                      />
                    ))}
                  </div>
                </div>
                <Cursor name="Ama" color="#6D28D9" className="right-8 top-28 hidden sm:block" />

                <div className="relative flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <h2 className="text-3xl font-extrabold tracking-[-0.04em]">Chat on WhatsApp</h2>
                    <p className="mt-1.5 text-white/80">The quickest way to reach us.</p>
                  </div>
                  <span className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-[#0B5B2D] shadow-lg">
                    Start a chat
                  </span>
                </div>
              </div>
            </a>

            {/* Call */}
            <a href={PHONE_HREF} className={`${shell} ${focus} lg:col-span-5`}>
              <Handles label="Call" />
              <div className={panel}>
                <div className="flex items-start justify-between">
                  <span className={chip}>
                    <Phone size={20} />
                  </span>
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-black/30 ring-1 ring-[#E4DFF2] transition group-hover:bg-[#4C1D95] group-hover:text-white">
                    <ArrowUpRight size={18} />
                  </span>
                </div>
                <div className="mt-10">
                  <p className="text-sm text-[#5F5B66]">Call us</p>
                  <p className="mt-1 text-2xl font-extrabold tracking-[-0.03em] text-[#24133F]">{PHONE_DISPLAY}</p>
                </div>
              </div>
            </a>

            {/* Email with copy */}
            <div className={`${shell} lg:col-span-5`}>
              <Handles label="Email" />
              <div className={panel}>
                <div className="flex items-start justify-between">
                  <span className={chip}>
                    <Mail size={20} />
                  </span>
                  <button
                    type="button"
                    onClick={copyEmail}
                    className={`inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-2 text-sm font-semibold ring-1 ring-[#E4DFF2] transition hover:bg-[#EDE9FE] ${focus}`}
                  >
                    {copied ? <Check size={15} className="text-emerald-600" /> : <Copy size={15} />}
                    <span aria-live="polite">{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <a href={`mailto:${EMAIL}`} className={`mt-10 block rounded-md ${focus}`}>
                  <p className="text-sm text-[#5F5B66]">Email</p>
                  <p className="mt-1 truncate text-xl font-extrabold tracking-[-0.03em] text-[#24133F] hover:underline sm:text-2xl">
                    {EMAIL}
                  </p>
                </a>
              </div>
            </div>
          </div>

          {/* Secondary row */}
          <div className="koombo-rise mt-4 grid gap-4 sm:grid-cols-2" style={{ animationDelay: '.2s' }}>
            {[
              { icon: MapPin, label: 'Location', value: 'Accra, Ghana' },
              { icon: Clock, label: 'Hours', value: '24 hours, 7 days a week' },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className={shell}>
                <Handles label={label} />
                <div className="flex items-center gap-4 rounded-[1.6rem] bg-gradient-to-br from-[#F7F5FC] to-[#EDE9FE]/60 p-4 sm:p-5">
                  <span className={chip}>
                    <Icon size={20} />
                  </span>
                  <div>
                    <p className="text-sm text-[#5F5B66]">{label}</p>
                    <p className="text-lg font-bold text-[#24133F]">{value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Reassurance */}
          <div className="mt-14 grid gap-3 sm:grid-cols-3 sm:gap-4">
            {highlights.map(({ title, description, icon: Icon }, i) => (
              <div
                key={title}
                className={`flex gap-4 rounded-[1.5rem] border border-[#E4DFF2] bg-white p-4 sm:p-6 ${
                  i === 1 ? 'koombo-float' : ''
                }`}
              >
                <span className={chip}>
                  <Icon size={20} />
                </span>
                <div>
                  <p className="font-bold text-[#24133F]">{title}</p>
                  <p className="mt-1 text-sm leading-6 text-[#5F5B66]">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <KoomboFooter />
    </main>
  );
}
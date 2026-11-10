'use client';

import React, { useEffect, useRef, useState } from 'react';

const ACCENT = '#5B21B6';
const TINT = '#F3EFFF';
const INK = '#17102B';

const WEB_APP_URL = 'https://your-koombo-app-url.com';

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function Reveal({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
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
      { threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-[cubic-bezier(.16,1,.3,1)] motion-reduce:translate-y-0! motion-reduce:opacity-100! ${
        shown ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      } ${className}`}
    >
      {children}
    </div>
  );
}

type IconProps = { className?: string };

function Arrow({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PlayIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.4-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z" />
    </svg>
  );
}

function LinkIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M10 14a4 4 0 0 0 5.66 0l3-3a4 4 0 0 0-5.66-5.66l-1 1M14 10a4 4 0 0 0-5.66 0l-3 3a4 4 0 0 0 5.66 5.66l1-1"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIcon({ className = 'h-4 w-4' }: IconProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className={className}>
      <path d="m5 12.5 4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CrossIcon({ className = 'h-4 w-4' }: IconProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function SparkIcon({ className = 'h-4 w-4' }: IconProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2.5 14.2 9l6.5 2.2-6.5 2.2L12 20l-2.2-6.6L3.3 11.2 9.8 9 12 2.5Z" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Live feed comparison                                                */
/* ------------------------------------------------------------------ */

const STATIC_POINTS = [
  'Photos can be edited, or taken from another store',
  'You cannot check the size or condition',
  'You wait for a reply to a simple question',
];

const LIVE_POINTS = [
  'See the real item, moving, in the seller’s hands',
  'Ask a question and get the answer on screen',
  'Buy from sellers you have watched, not guessed',
];

function PointList({ items, kind }: { items: string[]; kind: 'bad' | 'good' }) {
  return (
    <ul className="mt-4 space-y-3">
      {items.map((t) => (
        <li key={t} className="flex items-start gap-3 text-[15px] leading-6 sm:text-base">
          <span
            className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full ${
              kind === 'good' ? 'bg-white text-[#0B7285]' : 'bg-black/10 text-[#17102B]/55'
            }`}
          >
            {kind === 'good' ? <CheckIcon className="h-3.5 w-3.5" /> : <CrossIcon className="h-3.5 w-3.5" />}
          </span>
          <span className="min-w-0">{t}</span>
        </li>
      ))}
    </ul>
  );
}

function LiveCard() {
  return (
    <div className="relative aspect-[4/5] overflow-hidden rounded-[18px] bg-[#095C6B] sm:aspect-[4/3] sm:rounded-[22px]">
      <img
        src="/free.jpg"
        alt="A seller showing a product on a live video feed on Koombo"
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-linear-to-t from-[#17102B]/85 via-[#17102B]/10 to-[#17102B]/30" />

      {/* top row */}
      <div className="absolute inset-x-3 top-3 flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-extrabold text-[#17102B]">
          <span className="relative flex h-2.5 w-2.5">
            <span className="kb-ring absolute inset-0 rounded-full bg-red-500" />
            <span className="relative h-2.5 w-2.5 rounded-full bg-red-500" />
          </span>
          Live
        </span>
        <span className="rounded-full bg-black/45 px-3 py-1.5 text-xs font-bold text-white backdrop-blur">
          1.2k watching
        </span>
      </div>

      {/* play */}
      <span className="absolute left-1/2 top-[36%] flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center">
        <span className="kb-ring absolute inset-0 rounded-full bg-white" />
        <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-white text-[#0B7285] shadow-lg">
          <PlayIcon className="ml-0.5 h-6 w-6" />
        </span>
      </span>

      {/* chat + seller */}
      <div className="absolute inset-x-3 bottom-3 flex flex-col gap-2 sm:inset-x-4 sm:bottom-4">
        <p className="max-w-[80%] self-start rounded-2xl rounded-bl-md bg-white/20 px-3.5 py-2 text-[13px] font-medium leading-5 text-white backdrop-blur sm:text-sm">
          Is size 43 in stock?
        </p>
        <p className="max-w-[85%] self-end rounded-2xl rounded-br-md bg-white px-3.5 py-2 text-[13px] font-semibold leading-5 text-[#17102B] sm:text-sm">
          Yes. Showing you the sole now.
        </p>

        <div className="mt-1 flex items-center gap-3 rounded-2xl bg-white/95 p-2.5 text-[#17102B]">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#0B7285] text-sm font-extrabold text-white">
            A
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-extrabold leading-tight">Ama’s Kicks</span>
            <span className="block truncate text-xs font-medium text-[#17102B]/60">Verified seller</span>
          </span>
          <span className="shrink-0 rounded-full bg-[#0B7285] px-4 py-2 text-sm font-extrabold text-white">Buy</span>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* AI listing demo                                                     */
/* ------------------------------------------------------------------ */

const LISTING_FIELDS = [
  { label: 'Title', value: 'Nike Air Max 90, size 43', at: 1 },
  { label: 'Category', value: 'Fashion & Style', at: 1 },
  { label: 'Suggested price', value: 'GH₵ 850', at: 2 },
  {
    label: 'Description',
    value: 'Barely worn, original box included. Clean sole, no tears. Pickup or delivery available.',
    at: 2,
  },
];

const STAGE_LABELS = ['Watching your video', 'Shuri is writing', 'Adding the price', 'Published'];
const ACTIVE_STEP = [0, 1, 1, 2];

const SELLER_STEPS = [
  { title: 'Record a short video', text: 'Show the product the way you would to a customer.' },
  { title: 'Shuri writes the listing', text: 'Title, category, description and a price suggestion, ready in seconds.' },
  { title: 'Review and publish', text: 'Change anything you like, then go live on the feed.' },
];

function ListingDemo({ stage }: { stage: number }) {
  return (
    <div className="overflow-hidden rounded-3xl bg-white text-[#17102B] shadow-[0_20px_50px_-20px_rgba(0,0,0,0.5)]">
      {/* header */}
      <div className="flex items-center gap-3 border-b border-[#5B21B6]/15 px-4 py-3.5 sm:px-5">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#5B21B6] text-white">
          <SparkIcon className="h-[18px] w-[18px]" />
        </span>
        <div className="min-w-0">
          <p className="text-[15px] font-extrabold leading-tight">New listing</p>
          <p className="truncate text-xs text-[#17102B]/60">with Shuri, your assistant</p>
        </div>
        <span
          aria-live="polite"
          className={`ml-auto shrink-0 rounded-full px-3 py-1.5 text-xs font-extrabold transition-colors duration-300 ${
            stage === 3 ? 'bg-[#5B21B6] text-white' : 'bg-[#E4DAFB] text-[#5B21B6]'
          }`}
        >
          {STAGE_LABELS[stage]}
        </span>
      </div>

      {/* video row */}
      <div className="flex items-center gap-3 px-4 pt-4 sm:px-5">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-[#4C1D95]">
          <img src="/j.jpg" alt="" loading="lazy" className="h-full w-full object-cover" />
          <span className="absolute inset-0 grid place-items-center bg-black/25 text-white">
            <PlayIcon className="h-5 w-5" />
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold">Your product video</p>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#5B21B6]/12">
            <div
              className="h-full rounded-full bg-[#5B21B6] transition-all duration-700"
              style={{ width: `${[25, 55, 85, 100][stage]}%` }}
            />
          </div>
        </div>
      </div>

      {/* fields */}
      <dl className="space-y-3.5 px-4 py-5 sm:px-5">
        {LISTING_FIELDS.map((f) => {
          const visible = stage >= f.at;
          return (
            <div key={f.label}>
              <dt className="text-xs font-bold text-[#17102B]/55">{f.label}</dt>
              <dd className="mt-1 min-h-6 text-[15px] font-semibold leading-6">
                {visible ? (
                  <span className="kb-in block">{f.value}</span>
                ) : (
                  <span className="block h-4 w-3/4 animate-pulse rounded bg-[#5B21B6]/10" />
                )}
              </dd>
            </div>
          );
        })}
      </dl>

      {/* action */}
      <div className="border-t border-[#5B21B6]/15 p-3 sm:p-4">
        <div
          className={`flex h-12 items-center justify-center gap-2 rounded-full text-[15px] font-extrabold transition-colors duration-300 ${
            stage === 3 ? 'bg-[#5B21B6] text-white' : 'bg-[#5B21B6]/10 text-[#5B21B6]/60'
          }`}
        >
          {stage === 3 ? (
            <>
              <CheckIcon className="h-4 w-4" /> Published to the feed
            </>
          ) : (
            'Review and publish'
          )}
        </div>
      </div>
    </div>
  );
}

function SellerSection() {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setStage(3);
      return;
    }
    const id = setInterval(() => setStage((s) => (s + 1) % 4), 1900);
    return () => clearInterval(id);
  }, []);

  const active = ACTIVE_STEP[stage];

  return (
    <Reveal className="mt-12 sm:mt-16 lg:mt-24">
      <div className="overflow-hidden rounded-4xl bg-[#5B21B6] text-white sm:rounded-[40px]">
        <div className="grid gap-8 px-5 py-8 sm:px-10 sm:py-12 lg:grid-cols-[1fr_.9fr] lg:grid-rows-[auto_1fr] lg:gap-x-16 lg:gap-y-0 lg:px-16 lg:py-16">
          {/* A: heading */}
          <div className="min-w-0 lg:col-start-1 lg:row-start-1">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/30 px-3.5 py-1.5 text-xs font-bold sm:text-sm">
              <SparkIcon className="h-3.5 w-3.5" />
              For sellers
            </span>
            <h3 className="kb-balance mt-4 text-[1.9rem] font-black leading-[1.08] tracking-[-0.03em] sm:text-[44px]">
              List in seconds, not minutes.
            </h3>
            <p className="mt-3 max-w-lg text-base leading-relaxed text-white/80 sm:mt-4 sm:text-lg">
              Shuri, our AI assistant, turns a short video into a finished listing while you are still holding the
              product. No long forms, no typing out every detail.
            </p>
          </div>

          {/* B: demo */}
          <div className="min-w-0 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-center">
            <div className="mx-auto w-full sm:max-w-md lg:mr-0">
              <ListingDemo stage={stage} />
            </div>
          </div>

          {/* C: steps + time comparison */}
          <div className="min-w-0 lg:col-start-1 lg:row-start-2 lg:mt-10">
            <ol className="space-y-4">
              {SELLER_STEPS.map((s, i) => {
                const on = i === active;
                return (
                  <li
                    key={s.title}
                    className={`flex items-start gap-3.5 transition-opacity duration-300 ${on ? 'opacity-100' : 'opacity-60'}`}
                  >
                    <span
                      className={`mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm font-extrabold transition-colors duration-300 ${
                        on ? 'bg-white text-[#5B21B6]' : 'bg-white/15 text-white'
                      }`}
                    >
                      {i + 1}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-base font-extrabold leading-7 sm:text-lg">{s.title}</span>
                      <span className="block text-[15px] leading-6 text-white/75">{s.text}</span>
                    </span>
                  </li>
                );
              })}
            </ol>

            {/* time comparison */}
            <div className="mt-7 space-y-3 rounded-2xl bg-white/10 p-4">
              <div>
                <div className="flex items-center justify-between text-sm font-bold">
                  <span className="text-white/75">Typing a listing by hand</span>
                  <span>Minutes</span>
                </div>
                <div className="mt-2 h-2.5 rounded-full bg-white/20" />
              </div>
              <div>
                <div className="flex items-center justify-between text-sm font-bold">
                  <span>Listing with Shuri</span>
                  <span>Seconds</span>
                </div>
                <div className="mt-2 h-2.5 rounded-full bg-white/20">
                  <div className="h-full w-[14%] rounded-full bg-white" />
                </div>
              </div>
            </div>

            <a
              href="/lister"
              className="group/btn mt-7 inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-white px-7 text-base font-extrabold text-[#5B21B6] transition-colors hover:bg-white/90 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/40 sm:w-auto"
            >
              Start selling
              <Arrow className="h-5 w-5 transition-transform group-hover/btn:translate-x-1" />
            </a>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

/* ------------------------------------------------------------------ */
/* Roles                                                               */
/* ------------------------------------------------------------------ */

const ROLES = [
  {
    tag: 'Buyers',
    title: 'Watch it before you buy it.',
    text: 'Scroll a feed of real product videos, ask the seller questions, and shop with confidence.',
    cta: 'Start shopping',
    href: WEB_APP_URL,
  },
  {
    tag: 'Sellers',
    title: 'Go live, list in seconds.',
    text: 'Show products in motion, let Shuri write the listing, and answer buyers directly.',
    cta: 'Start selling',
    href: '/lister',
  },
  {
    tag: 'Connectors',
    title: 'Share products, earn with your link.',
    text: 'Bring sellers to Koombo and advertise their products. Earn whenever your link leads to a sale.',
    cta: 'Become a connector',
    href: '/rider',
    featured: true,
  },
];

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function KoomboStart() {
  return (
    <section
      id="koombo-start"
      className="relative w-full overflow-hidden bg-white py-12 text-[#17102B] antialiased sm:py-20 lg:py-24"
      style={{
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        textRendering: 'optimizeLegibility',
        WebkitTapHighlightColor: 'transparent',
        color: INK,
      }}
    >
      <style>{`
        @keyframes kb-ring{0%{transform:scale(1);opacity:.5}100%{transform:scale(1.9);opacity:0}}
        @keyframes kb-float{0%,100%{translate:0 0}50%{translate:0 -4px}}
        @keyframes kb-in{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
        .kb-ring{animation:kb-ring 2s ease-out infinite}
        .kb-float{animation:kb-float 4s ease-in-out infinite}
        .kb-in{animation:kb-in .5s cubic-bezier(.16,1,.3,1) both}
        .kb-balance{text-wrap:balance}
        @media (prefers-reduced-motion: reduce){
          *,*::before,*::after{animation:none!important;transition-duration:.01ms!important}
        }
      `}</style>

      <div className="mx-auto w-full max-w-6xl px-4 sm:px-8">
        {/* ---------- HEADING ---------- */}
        <Reveal className="mx-auto max-w-3xl text-center">
          <span className="inline-flex max-w-full items-center gap-2 rounded-full bg-[#E4DAFB] px-4 py-2 text-sm font-extrabold text-[#5B21B6] sm:px-5 sm:py-2.5 sm:text-base">
            <SparkIcon className="h-3.5 w-3.5" />
            Agentic social commerce
          </span>
          <h2
            className="kb-balance mt-4 break-words font-black sm:mt-5"
            style={{ fontSize: 'clamp(30px, 8.4vw, 62px)', lineHeight: 1.05, letterSpacing: '-0.04em' }}
          >
            Shop from a live feed of real products, not photos that lie.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-[#17102B]/65 sm:mt-5 sm:text-lg">
            Buyers watch real product videos and talk to the seller before they pay. Sellers list in seconds with
            Shuri, an AI assistant that does the typing for them.
          </p>

          <div className="mt-7 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <a
              href={WEB_APP_URL}
              className="group/btn inline-flex h-14 items-center justify-center gap-2 rounded-full bg-[#5B21B6] px-8 text-base font-extrabold text-white transition-colors hover:bg-[#4C1D95] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#5B21B6]/30"
            >
              Start shopping
              <Arrow className="h-5 w-5 transition-transform group-hover/btn:translate-x-1" />
            </a>
            <a
              href="/lister"
              className="inline-flex h-14 items-center justify-center rounded-full border-2 border-[#5B21B6]/25 px-8 text-base font-extrabold text-[#5B21B6] transition-colors hover:bg-[#F3EFFF] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#5B21B6]/30"
            >
              Start selling
            </a>
          </div>
        </Reveal>

        {/* ---------- BUYERS: static vs live feed ---------- */}
        <div className="mt-10 grid gap-4 sm:mt-14 sm:gap-5 md:grid-cols-2 lg:mt-16">
          {/* Static */}
          <Reveal className="min-w-0">
            <article className="h-full rounded-3xl bg-[#F4F4F6] p-4 sm:rounded-[32px] sm:p-6">
              <div className="relative grid aspect-[4/5] grid-cols-2 grid-rows-2 gap-1.5 overflow-hidden rounded-[18px] sm:aspect-[4/3] sm:gap-2 sm:rounded-[22px]">
                {[0, 1, 2, 3].map((i) => (
                  <img key={i} src="/j.jpg" alt="" loading="lazy" className="h-full w-full object-cover grayscale" />
                ))}
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-6 rounded-xl bg-white px-4 py-2 text-sm font-extrabold text-[#17102B]/70 shadow-lg">
                  Is this the real item?
                </span>
              </div>
              <span className="mt-5 inline-flex rounded-full bg-black/5 px-4 py-2 text-sm font-extrabold text-[#17102B]/60 sm:text-base">
                Other online stores
              </span>
              <h3 className="mt-3 text-[22px] font-black leading-[1.12] tracking-[-0.03em] text-[#17102B]/75 sm:text-[26px]">
                Still photos you have to trust.
              </h3>
              <PointList items={STATIC_POINTS} kind="bad" />
            </article>
          </Reveal>

          {/* Live */}
          <Reveal delay={120} className="min-w-0">
            <article className="h-full rounded-3xl bg-[#0B7285] p-4 text-white shadow-[0_24px_50px_-25px_rgba(11,114,133,0.7)] sm:rounded-[32px] sm:p-6">
              <LiveCard />
              <span className="mt-5 inline-flex rounded-full bg-white/15 px-4 py-2 text-sm font-extrabold sm:text-base">
                On Koombo
              </span>
              <h3 className="mt-3 text-[22px] font-black leading-[1.12] tracking-[-0.03em] sm:text-[26px]">
                A live feed of real products.
              </h3>
              <PointList items={LIVE_POINTS} kind="good" />
            </article>
          </Reveal>
        </div>

        {/* ---------- SELLERS: AI listing ---------- */}
        <SellerSection />

        {/* ---------- ROLES ---------- */}
        <Reveal className="mt-14 text-center sm:mt-20 lg:mt-24">
          <h3 className="kb-balance text-2xl font-black leading-[1.15] tracking-[-0.03em] sm:text-4xl">
            One platform for sellers, buyers and connectors
          </h3>
        </Reveal>

        <div className="mt-6 grid gap-4 sm:mt-8 sm:gap-5 md:grid-cols-3">
          {ROLES.map((r, i) => (
            <Reveal key={r.tag} delay={i * 100} className="h-full min-w-0">
              <article
                className={`flex h-full min-w-0 flex-col rounded-3xl p-5 transition duration-500 sm:rounded-[28px] sm:p-7 md:hover:-translate-y-1 ${
                  r.featured ? 'bg-[#5B21B6] text-white' : ''
                }`}
                style={r.featured ? undefined : { backgroundColor: TINT }}
              >
                <span
                  className={`w-fit max-w-full rounded-full px-4 py-2 text-sm font-extrabold sm:text-base ${
                    r.featured ? 'bg-white/15 text-white' : 'bg-white text-[#5B21B6]'
                  }`}
                >
                  {r.tag}
                </span>

                <h4 className="mt-4 break-words text-xl font-black leading-[1.15] tracking-[-0.03em] sm:mt-5 sm:text-2xl">
                  {r.title}
                </h4>
                <p
                  className={`mt-2 break-words text-[15px] leading-relaxed sm:mt-3 sm:text-base ${
                    r.featured ? 'text-white/80' : 'text-[#17102B]/65'
                  }`}
                >
                  {r.text}
                </p>

                {r.featured && (
                  <div className="kb-float mt-5 flex min-w-0 flex-wrap items-center justify-between gap-x-3 gap-y-2 rounded-2xl bg-white px-4 py-3 text-[#17102B] shadow-lg">
                    <span className="flex min-w-0 flex-1 items-center gap-2 text-sm font-bold">
                      <LinkIcon className="h-4 w-4 shrink-0 text-[#5B21B6]" />
                      <span className="truncate">koombo.app/c/your-name</span>
                    </span>
                    <span className="shrink-0 rounded-full bg-[#E4DAFB] px-3 py-1 text-xs font-extrabold text-[#5B21B6]">
                      Earns
                    </span>
                  </div>
                )}

                <a
                  href={r.href}
                  className={`group/btn mt-5 inline-flex min-h-11 w-fit max-w-full items-center gap-2 text-base font-extrabold sm:mt-6 sm:text-lg md:mt-auto md:pt-6 ${
                    r.featured ? 'text-white' : 'text-[#5B21B6]'
                  }`}
                >
                  <span className="min-w-0">{r.cta}</span>
                  <Arrow className="h-5 w-5 shrink-0 transition-transform group-hover/btn:translate-x-1" />
                </a>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
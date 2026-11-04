'use client';

import React, { useEffect, useRef, useState } from 'react';
import SiteHeader from '../../components/SiteHeader';
import KoomboFooter from '../../components/Footer';

/* ---------- Program settings: edit these to match your real terms ---------- */
const COMMISSION_RATE = 3; // % earned on each sale made through a referral link
const CURRENCY = 'GH₵';
const SIGNUP_HREF = '/lister/connectors/signup';
const LOGIN_HREF = '/lister/connectors/signin';

/* ---------- Real local assets from /public ---------- */
const IMG = {
  hero: '/connect.jpg',
  share: '/shop.jpg',
  vendor: '/shop.jpg',
  avatar: '/koombo.jpeg',
};

const STEPS = [
  { title: 'Create your account', body: 'Sign up free in a minute. Your vendor invite link and product links are ready right away.' },
  { title: 'Share your links', body: 'Invite vendors to sell on Koombo, or share products you love anywhere your audience is.' },
  { title: 'Earn on every sale', body: 'Whenever a sale happens through your link, you earn a commission on it.' },
];

const PATHS = [
  {
    key: 'vendors',
    label: 'Bring vendors',
    tagline: 'Earn from every vendor sale',
    blurb: 'Invite shop owners, traders and entrepreneurs to sell on Koombo, and earn from every sale they make.',
    cta: 'Start bringing vendors',
    image: IMG.vendor,
    alt: 'A shop owner at her counter',
  },
  {
    key: 'products',
    label: 'Share products',
    tagline: 'Earn when people buy',
    blurb: 'Share a product you like with your referral link anywhere. You earn whenever someone buys through it.',
    cta: 'Start sharing products',
    image: IMG.share,
    alt: 'A creator filming a product video on her phone',
  },
];

const FAQ = [
  ['How do I earn?', 'You earn a commission on sales made through your links. That includes sales by vendors you bring to Koombo and purchases by people who buy through your product link.'],
  ['Do I need to be a seller myself?', 'No. Anyone can join, whether you have an audience, a community or a network of vendors.'],
  ['How do I get paid?', 'There is no fixed monthly payment. Your earnings show in your dashboard as sales complete, and you set up your payout details there.'],
];

const money = (n: number) =>
  `${CURRENCY}${n.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;

const Check = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

/* -------------------------------------------------------------------------- */
/* SCROLL ANIMATION HELPERS                                                   */
/* -------------------------------------------------------------------------- */

type RevealTag = 'div' | 'li' | 'section' | 'article';

/**
 * Fades + slides an element into place the first time it enters the viewport.
 * Use `delay` to stagger siblings. Respects prefers-reduced-motion.
 */
function Reveal({
  children,
  delay = 0,
  x = 0,
  y = 36,
  scale = 1,
  className = '',
  as = 'div',
}: {
  children: React.ReactNode;
  delay?: number;
  x?: number;
  y?: number;
  scale?: number;
  className?: string;
  as?: RevealTag;
}) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
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
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  const Tag = as as React.ElementType;

  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown
          ? 'translate3d(0,0,0) scale(1)'
          : `translate3d(${x}px, ${y}px, 0) scale(${scale})`,
        transition: `opacity 0.9s cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 0.9s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
        willChange: shown ? 'auto' : 'opacity, transform',
      }}
    >
      {children}
    </Tag>
  );
}

/* Counts up to a number the first time it scrolls into view */
function CountUp({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [v, setV] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setV(to);
      return;
    }
    let raf = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const t0 = performance.now();
        const tick = (t: number) => {
          const p = Math.min((t - t0) / 1300, 1);
          setV(Math.round((1 - Math.pow(1 - p, 3)) * to * 10) / 10);
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [to]);

  return <span ref={ref}>{v}</span>;
}

/* -------------------------------------------------------------------------- */
/* PAGE                                                                       */
/* -------------------------------------------------------------------------- */

export default function ConnectorsPage() {
  const [openFaq, setOpenFaq] = useState(0);

  const rootRef = useRef<HTMLDivElement>(null);
  const howRef = useRef<HTMLElement>(null);

  const focus =
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D28D9] focus-visible:ring-offset-2';

  /* Scroll-linked values, written straight to CSS variables so scrolling
     never re-renders React:
       --progress  page scroll progress (0 to 1)
       --scroll    scroll distance in px (capped) for parallax
       --hiw       "How it works" line progress (0 to 1)               */
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduce = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    let raf = 0;

    const update = () => {
      raf = 0;

      const y = window.scrollY;
      const max =
        document.documentElement.scrollHeight - window.innerHeight;

      root.style.setProperty(
        '--progress',
        String(max > 0 ? Math.min(y / max, 1) : 0)
      );

      if (reduce) {
        root.style.setProperty('--hiw', '1');
        return;
      }

      root.style.setProperty('--scroll', String(Math.min(y, 900)));

      const section = howRef.current;
      if (section) {
        const rect = section.getBoundingClientRect();
        const p =
          (window.innerHeight * 0.75 - rect.top) / (rect.height * 0.55);
        root.style.setProperty(
          '--hiw',
          String(Math.max(0, Math.min(1, p)))
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
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className="koombo min-h-screen overflow-x-clip bg-[#F8F8F6] text-[#20201F]"
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        .koombo { font-family: 'DM Sans', 'Inter', system-ui, sans-serif; }
        .koombo .canvas-dots {
          background-image: radial-gradient(#D9D2EC 1.2px, transparent 1.2px);
          background-size: 22px 22px;
          mask-image: radial-gradient(ellipse at 70% 40%, black 20%, transparent 75%);
          -webkit-mask-image: radial-gradient(ellipse at 70% 40%, black 20%, transparent 75%);
        }

        @keyframes k-rise {
          from { transform: translate3d(0, 110%, 0); }
          to   { transform: translate3d(0, 0, 0); }
        }
        @keyframes k-fade {
          from { opacity: 0; transform: translate3d(0, 18px, 0); }
          to   { opacity: 1; transform: translate3d(0, 0, 0); }
        }
        @keyframes k-pop {
          from { opacity: 0; transform: translate3d(0, 24px, 0) scale(0.92); }
          to   { opacity: 1; transform: translate3d(0, 0, 0) scale(1); }
        }
        @keyframes k-img {
          from { opacity: 0; transform: scale(1.14); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes k-wipe {
          from { clip-path: inset(0 0 100% 0 round 2.5rem); }
          to   { clip-path: inset(0 0 0 0 round 2.5rem); }
        }

        .koombo .k-rise { animation: k-rise 1s cubic-bezier(0.22, 1, 0.36, 1) both; }
        .koombo .k-fade { animation: k-fade 0.7s cubic-bezier(0.22, 1, 0.36, 1) both; }
        .koombo .k-pop  { animation: k-pop 0.9s cubic-bezier(0.22, 1, 0.36, 1) both; }
        .koombo .k-img  { animation: k-img 1.6s cubic-bezier(0.22, 1, 0.36, 1) both; }
        .koombo .k-wipe { animation: k-wipe 1.2s cubic-bezier(0.22, 1, 0.36, 1) both; }

        @media (prefers-reduced-motion: reduce) {
          .koombo * { transition: none !important; animation: none !important; }
        }
      `}</style>

      {/* PAGE SCROLL PROGRESS */}

      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px]"
      >
        <div
          className="h-full origin-left bg-gradient-to-r from-[#8B5CF6] to-[#4C1D95]"
          style={{ transform: 'scaleX(var(--progress, 0))' }}
        />
      </div>

      <SiteHeader />

      {/* ================= HERO ================= */}
      <section className="relative">
        <div aria-hidden className="canvas-dots pointer-events-none absolute inset-0" />
        <div
          className="pointer-events-none absolute -right-40 top-0 h-[30rem] w-[30rem] rounded-full bg-[#DDD6FE]/50 blur-3xl"
          style={{ transform: 'translate3d(0, calc(var(--scroll, 0) * 0.2px), 0)' }}
        />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 pb-20 pt-20 sm:gap-16 sm:px-8 sm:pt-24 lg:grid-cols-[1.05fr_.95fr] lg:px-12 lg:pb-28 lg:pt-28">
          <div
            className="relative z-10"
            style={{ transform: 'translate3d(0, calc(var(--scroll, 0) * 0.1px), 0)' }}
          >
            {/* UPDATED HEADLINE SIZING HERE */}
            <h1 className="max-w-3xl text-[clamp(3.5rem,9vw,8rem)] font-black leading-[0.92] tracking-[-0.05em] sm:text-[clamp(4rem,10vw,8.5rem)]">
              {['Bring vendors.', 'Share products.', 'Earn on every sale.'].map((line, i) => (
                <span key={line} className="-mb-[0.08em] block overflow-hidden pb-[0.08em]">
                  <span className="k-rise block" style={{ animationDelay: `${i * 120}ms` }}>
                    {line}
                  </span>
                </span>
              ))}
            </h1>

            <p
              className="k-fade mt-7 max-w-lg text-base leading-8 text-[#686760] sm:text-lg sm:leading-9"
              style={{ animationDelay: '450ms' }}
            >
              Create a free account and get your referral links. No application, no waiting.
            </p>

            <div
              className="k-fade mt-9 flex flex-wrap items-center gap-4"
              style={{ animationDelay: '580ms' }}
            >
              <a
                href={SIGNUP_HREF}
                className={`inline-flex items-center gap-2 rounded-full bg-[#4C1D95] px-6 py-3.5 font-bold text-white shadow-lg shadow-[#4C1D95]/15 transition hover:bg-[#5B21B6] ${focus}`}
              >
                Create free account
              </a>
              <a href="#how" className={`rounded-full px-4 py-3 font-bold text-[#49463F] transition hover:text-[#5B21B6] ${focus}`}>
                See how it works
              </a>
            </div>
          </div>

          {/* HERO VISUAL: photo with floating UI */}
          <div
            className="relative mx-auto w-full max-w-xl lg:ml-auto"
            style={{ transform: 'translate3d(0, calc(var(--scroll, 0) * -0.04px), 0)' }}
          >
            <div
              className="k-wipe relative overflow-hidden rounded-[2.5rem] bg-[#24133F] p-3 shadow-[0_30px_100px_rgba(36,19,63,0.18)] sm:p-4"
              style={{ animationDelay: '150ms' }}
            >
              <div className="relative overflow-hidden rounded-[2rem] bg-[#3B1B73]">
                <img
                  src={IMG.hero}
                  alt="A connector smiling while checking her referral earnings"
                  className="k-img h-[300px] w-full object-cover sm:h-[520px]"
                  style={{ animationDelay: '150ms' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#170D29]/70 via-transparent to-transparent" />
              </div>
            </div>

            {/* Floating: referral link (outer = parallax, inner = entrance) */}
            <div
              className="absolute -left-3 top-10 w-56 sm:-left-12 sm:w-60"
              style={{ transform: 'translate3d(0, calc(var(--scroll, 0) * -0.1px), 0)' }}
            >
              <div
                className="k-pop rounded-2xl border border-white/60 bg-white/90 p-3.5 shadow-xl backdrop-blur"
                style={{ animationDelay: '800ms' }}
              >
                <p className="text-[11px] font-bold text-[#77736D]">Your referral link</p>
                <div className="mt-1.5 flex items-center justify-between rounded-xl bg-[#24133F] px-3.5 py-2.5 text-white">
                  <span className="text-sm font-black tracking-[0.08em]">koombo.com/ama</span>
                  <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-bold">Copy</span>
                </div>
              </div>
            </div>

            {/* Floating: new sale (outer = parallax, inner = entrance) */}
            <div
              className="absolute -bottom-7 right-4 w-64 sm:-right-8"
              style={{ transform: 'translate3d(0, calc(var(--scroll, 0) * 0.06px), 0)' }}
            >
              <div
                className="k-pop flex items-center gap-3 rounded-2xl border border-white/60 bg-white/90 p-3.5 shadow-xl backdrop-blur"
                style={{ animationDelay: '1000ms' }}
              >
                <img src={IMG.avatar} alt="" className="h-11 w-11 shrink-0 rounded-full object-cover" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-extrabold text-[#24133F]">Sale through your link</p>
                  <p className="flex items-center gap-1.5 text-xs font-semibold text-[#047857]">
                    <span className="h-2 w-2 rounded-full bg-[#10B981]" />
                    You earned {money(25.5)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= COMMISSION BANNER ================= */}
      <section className="px-5 pb-16 sm:px-8 sm:pb-24 lg:px-12">
        <Reveal y={60} scale={0.96}>
          <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[1.75rem] bg-[#1B0E33] px-5 py-8 text-white shadow-[0_24px_60px_-24px_rgba(76,29,149,0.7)] sm:rounded-[2.25rem] sm:px-12 sm:py-12">
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#6D28D9]/40 blur-3xl" />

            <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between sm:gap-10">
              <div className="flex items-center gap-4 sm:gap-6">
                <span className="bg-gradient-to-b from-white to-[#C4B5FD] bg-clip-text text-7xl font-black leading-none tracking-[-0.06em] text-transparent sm:text-8xl">
                  <CountUp to={COMMISSION_RATE} />%
                </span>
                <p className="text-lg font-extrabold leading-snug tracking-[-0.02em] sm:max-w-xs sm:text-2xl">
                  commission on all sales made using your link
                </p>
              </div>

              <a
                href={SIGNUP_HREF}
                className={`inline-flex w-full items-center justify-center rounded-full bg-white px-6 py-3.5 font-bold text-[#24133F] transition hover:bg-[#EDE9FE] sm:w-auto ${focus}`}
              >
                Start earning
              </a>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section
        id="how"
        ref={howRef}
        className="scroll-mt-20 border-y border-[#EAE8E3] bg-white py-16 sm:py-20"
      >
        <div className="mx-auto max-w-5xl px-5 sm:px-8 lg:px-12">
          <Reveal>
            <h2 className="text-center text-3xl font-black leading-tight tracking-[-0.04em] sm:text-4xl lg:text-5xl">
              From sign-up to your first sale
            </h2>
          </Reveal>

          <ol className="relative mt-14 grid gap-10 sm:grid-cols-3 sm:gap-6">
            {/* connecting line that draws itself as you scroll */}
            <div
              aria-hidden
              className="absolute left-[16.6%] right-[16.6%] top-4 hidden sm:block"
            >
              <div className="border-t-2 border-dashed border-[#E4DDF5]" />
              <div
                className="absolute inset-x-0 top-0 h-[2px] origin-left bg-gradient-to-r from-[#8B5CF6] to-[#4C1D95]"
                style={{ transform: 'scaleX(var(--hiw, 0))' }}
              />
            </div>

            {STEPS.map((s, i) => (
              <Reveal as="li" key={s.title} delay={i * 140} y={48} className="relative text-center">
                <span className="relative z-10 mx-auto grid h-8 w-8 place-items-center rounded-full bg-[#4C1D95] text-sm font-black text-white ring-8 ring-white">
                  {i + 1}
                </span>
                <div className="mt-6 rounded-[1.5rem] border border-[#E4DFF2] bg-[#F7F5FC] p-6">
                  <h3 className="text-xl font-extrabold text-[#24133F]">{s.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-[#77736D]">{s.body}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ================= TWO WAYS TO EARN ================= */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <Reveal>
            <h2 className="max-w-2xl text-3xl font-black leading-tight tracking-[-0.04em] sm:text-4xl lg:text-5xl">
              One account. Two ways to earn.
            </h2>
          </Reveal>

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {PATHS.map((t, i) => {
              const dark = i === 0;
              return (
                <Reveal as="article" key={t.key} x={i === 0 ? -40 : 40} y={0} delay={i * 150}>
                  <div
                    className={`relative h-full overflow-hidden rounded-[1.75rem] p-1.5 ${
                      dark
                        ? 'bg-[#24133F] shadow-[0_24px_60px_-24px_rgba(36,19,63,0.6)]'
                        : 'border border-[#E4DFF2] bg-white shadow-[0_16px_40px_-24px_rgba(76,29,149,0.35)]'
                    }`}
                  >
                    <div
                      className={`relative h-full overflow-hidden rounded-[1.4rem] p-4 sm:p-7 ${
                        dark
                          ? 'border border-white/10 bg-gradient-to-br from-[#3B1B73] via-[#2B1650] to-[#1B0E33] text-white'
                          : 'bg-gradient-to-br from-[#F7F5FC] to-[#EDE9FE]/70'
                      }`}
                    >
                      <div className="group relative overflow-hidden rounded-2xl bg-[#3B1B73]">
                        <img
                          src={t.image}
                          alt={t.alt}
                          className="h-40 w-full object-cover transition-transform duration-700 group-hover:scale-105 sm:h-60"
                        />
                        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-[#4C1D95] backdrop-blur">
                          {t.tagline}
                        </span>
                      </div>

                      <h3 className={`mt-5 text-2xl font-black tracking-[-0.03em] sm:text-3xl ${dark ? '' : 'text-[#24133F]'}`}>
                        {t.label}
                      </h3>
                      <p className={`mt-2 max-w-md text-sm leading-7 sm:text-base sm:leading-8 ${dark ? 'text-white/70' : 'text-[#686760]'}`}>
                        {t.blurb}
                      </p>
                      <a
                        href={`${SIGNUP_HREF}?type=${t.key}`}
                        className={`mt-5 inline-flex items-center rounded-full px-6 py-3 font-bold transition ${focus} ${
                          dark ? 'bg-white text-[#24133F] hover:bg-[#EDE9FE]' : 'bg-[#4C1D95] text-white hover:bg-[#5B21B6]'
                        }`}
                      >
                        {t.cta}
                      </a>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= NEW: WITHDRAWAL INFO SECTION ================= */}
      <section className="py-16 sm:py-20 bg-[#F3F0FA]">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <Reveal>
            <div className="relative overflow-hidden rounded-[2.5rem] bg-white border border-[#E4DFF2] p-8 sm:p-12 lg:p-16 shadow-sm">
              <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#6D28D9]/5 blur-3xl" />
              
              <div className="relative flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
                {/* Left Content */}
                <div className="flex-1 text-center lg:text-left">
                  <span className="inline-block rounded-full bg-[#EDE9FE] px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#6D28D9] mb-4">
                    Easy Payouts
                  </span>
                  <h2 className="text-3xl font-black leading-tight tracking-[-0.04em] sm:text-4xl lg:text-5xl text-[#24133F]">
                    Get paid instantly to <br className="hidden lg:block"/>
                    <span className="text-[#6D28D9]">Mobile Money.</span>
                  </h2>
                  <p className="mt-5 text-base leading-8 text-[#686760] sm:text-lg max-w-xl mx-auto lg:mx-0">
                    Once your earnings hit just <span className="font-bold text-[#24133F]">GH₵ 100</span>, you can withdraw directly to your MTN MoMo or Telecel Cash wallet. No bank accounts needed, no long waits.
                  </p>
                  
                  <div className="mt-8 flex flex-wrap justify-center lg:justify-start gap-4">
                    <div className="flex items-center gap-3 rounded-xl bg-[#F8F8F6] border border-[#EAE8E3] px-5 py-3">
                      <div className="h-8 w-8 rounded-full bg-[#FFCC00] flex items-center justify-center text-[#000] font-black text-xs">MTN</div>
                      <span className="font-bold text-[#24133F]">MTN MoMo</span>
                    </div>
                    <div className="flex items-center gap-3 rounded-xl bg-[#F8F8F6] border border-[#EAE8E3] px-5 py-3">
                      <div className="h-8 w-8 rounded-full bg-[#E60000] flex items-center justify-center text-white font-black text-xs">TEL</div>
                      <span className="font-bold text-[#24133F]">Telecel Cash</span>
                    </div>
                  </div>
                </div>

                {/* Right Visual / Illustration Placeholder */}
                <div className="flex-1 w-full max-w-md lg:max-w-none">
                   <div className="relative aspect-[4/3] rounded-2xl bg-gradient-to-br from-[#24133F] to-[#4C1D95] p-6 flex flex-col justify-between text-white shadow-xl">
                      <div className="flex justify-between items-start">
                         <div>
                            <p className="text-xs font-bold uppercase tracking-widest opacity-60">Available Balance</p>
                            <p className="text-4xl font-black mt-1">GH₵ 125.50</p>
                         </div>
                         <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                         </div>
                      </div>
                      
                      <div className="space-y-3">
                         <div className="h-12 rounded-xl bg-white/10 flex items-center px-4 gap-3">
                            <div className="h-6 w-6 rounded-full bg-[#FFCC00]" />
                            <div className="flex-1 h-2 bg-white/20 rounded-full" />
                         </div>
                         <button className="w-full py-3.5 rounded-xl bg-white text-[#24133F] font-bold text-sm shadow-lg">
                            Withdraw Now
                         </button>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ================= FAQ ================= */}
      <section className="border-t border-[#EAE8E3] bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <Reveal>
            <h2 className="text-3xl font-black tracking-[-0.04em] sm:text-4xl">Questions</h2>
          </Reveal>

          <Reveal delay={100} className="mt-8">
            <div className="divide-y divide-[#E7E5E0] border-y border-[#E7E5E0]">
              {FAQ.map(([q, a], i) => {
                const open = openFaq === i;
                return (
                  <div key={q}>
                    <button
                      type="button"
                      onClick={() => setOpenFaq(open ? -1 : i)}
                      aria-expanded={open}
                      className={`flex w-full items-center justify-between gap-6 py-5 text-left text-lg font-bold text-[#24133F] ${focus}`}
                    >
                      {q}
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-transform ${
                          open ? 'rotate-45 bg-[#EDE9FE] text-[#4C1D95]' : 'bg-white ring-1 ring-[#E4DFF2]'
                        }`}
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" d="M12 5v14M5 12h14" />
                        </svg>
                      </span>
                    </button>
                    {open && <p className="k-fade pb-6 pr-12 leading-7 text-[#686760]">{a}</p>}
                  </div>
                );
              })}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ================= CLOSING CTA ================= */}
      <section id="join" className="scroll-mt-20 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <Reveal y={60} scale={0.96}>
            <div className="relative overflow-hidden rounded-[2.5rem] bg-[#24133F] px-7 py-12 text-white sm:px-14 sm:py-16">
              <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#6D28D9]/40 blur-3xl" />

              <div className="relative flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
                <div>
                  <h2 className="max-w-xl text-3xl font-black leading-tight tracking-[-0.04em] sm:text-5xl">
                    Create an account. Start earning.
                  </h2>
                  <p className="mt-4 text-white/70">
                    Already have an account?{' '}
                    <a href={LOGIN_HREF} className={`font-bold text-white underline underline-offset-4 ${focus}`}>
                      Log in
                    </a>
                  </p>
                </div>

                <a
                  href={SIGNUP_HREF}
                  className={`inline-flex items-center justify-center rounded-full bg-white px-7 py-4 font-bold text-[#24133F] transition hover:bg-[#EDE9FE] ${focus}`}
                >
                  Create free account
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <KoomboFooter />
    </div>
  );
}
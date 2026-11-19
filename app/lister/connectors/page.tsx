'use client';

import React, { useEffect, useRef, useState } from 'react';
import SiteHeader from '../../components/SiteHeader';
import KoomboFooter from '../../components/Footer';

/* ---------- PROGRAM SETTINGS ---------- */
const COMMISSION_RATE = 3;
const CURRENCY = 'GH₵';
const SIGNUP_HREF = '/lister/connectors/signup';
const LOGIN_HREF = '/lister/connectors/signin';

/* ---------- LOCAL ASSETS ---------- */
const IMG = {
  hero: '/connect.jpg',
  share: '/shop.jpg',
  vendor: '/shop.jpg',
  avatar: '/koombo.jpeg',
};

const STEPS = [
  {
    title: 'Create your account',
    body: 'Sign up free in a minute. Your vendor invite link and product links are ready right away.',
  },
  {
    title: 'Share your links',
    body: 'Invite vendors to sell on Koombo, or share products you love anywhere your audience is.',
  },
  {
    title: 'Earn on every sale',
    body: 'Whenever a sale happens through your link, you earn a commission on it.',
  },
];

const PATHS = [
  {
    key: 'vendors',
    label: 'Bring vendors',
    tagline: 'Earn from every vendor sale',
    blurb:
      'Invite shop owners, traders and entrepreneurs to sell on Koombo, and earn from every sale they make.',
    cta: 'Start bringing vendors',
    image: IMG.vendor,
    alt: 'A shop owner at her counter',
  },
  {
    key: 'products',
    label: 'Share products',
    tagline: 'Earn when people buy',
    blurb:
      'Share a product you like with your referral link anywhere. You earn whenever someone buys through it.',
    cta: 'Start sharing products',
    image: IMG.share,
    alt: 'A creator filming a product video on her phone',
  },
];

const FAQ = [
  [
    'How do I earn?',
    'You earn a commission on sales made through your links. That includes sales by vendors you bring to Koombo and purchases by people who buy through your product link.',
  ],
  [
    'Do I need to be a seller myself?',
    'No. Anyone can join, whether you have an audience, a community or a network of vendors.',
  ],
  [
    'How do I get paid?',
    'There is no fixed monthly payment. Your earnings show in your dashboard as sales complete, and you set up your payout details there.',
  ],
];

const money = (n: number) =>
  `${CURRENCY}${n.toLocaleString(undefined, {
    maximumFractionDigits: 2,
  })}`;

/* -------------------------------------------------------------------------- */
/* SCROLL ANIMATION                                                           */
/* -------------------------------------------------------------------------- */

type RevealTag = 'div' | 'li' | 'section' | 'article';

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

/* -------------------------------------------------------------------------- */
/* COUNT UP                                                                   */
/* -------------------------------------------------------------------------- */

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
/* MAIN PAGE                                                                  */
/* -------------------------------------------------------------------------- */

export default function ConnectorsPage() {
  const [openFaq, setOpenFaq] = useState(0);

  const rootRef = useRef<HTMLDivElement>(null);
  const howRef = useRef<HTMLElement>(null);

  const focus =
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6] focus-visible:ring-offset-2';

  /* SCROLL PROGRESS AND PARALLAX */
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
      id="koombo-connectors-page"
      ref={rootRef}
      className="koombo min-h-screen overflow-x-clip bg-white text-[#20201F]"
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap');

        #koombo-connectors-page {
          font-family: 'Lufga', 'Inter', system-ui, sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          text-rendering: optimizeLegibility;
        }

        #koombo-connectors-page .heading-font {
          font-family: 'Lufga', 'Inter', system-ui, sans-serif !important;
          font-weight: 900 !important;
          letter-spacing: -0.045em !important;
        }

        #koombo-connectors-page .hero-title {
          display: block !important;
          width: 100% !important;
          max-width: 100% !important;
          margin: 0 0 10px !important;
          padding: 0 !important;
          font-family: 'Lufga', 'Inter', system-ui, sans-serif !important;
          font-size: clamp(2.8rem, 4.8vw, 4.5rem) !important;
          font-weight: 900 !important;
          line-height: 0.98 !important;
          letter-spacing: -0.055em !important;
          color: #20201F !important;
          text-align: left !important;
          overflow: visible !important;
        }

        #koombo-connectors-page .hero-title-line {
          display: block !important;
          width: 100% !important;
          margin: 0 !important;
          padding: 0 !important;
          overflow: visible !important;
          white-space: normal !important;
          font-size: inherit !important;
          line-height: inherit !important;
        }

        #koombo-connectors-page .hero-title-line-inner {
          display: block !important;
          width: 100% !important;
          margin: 0 !important;
          padding: 0 !important;
          font-family: inherit !important;
          font-size: inherit !important;
          font-weight: 900 !important;
          letter-spacing: inherit !important;
          line-height: inherit !important;
        }

        @media (max-width: 639px) {
          #koombo-connectors-page .hero-title {
            font-size: clamp(2.35rem, 8vw, 3.2rem) !important;
            line-height: 1.00 !important;
            letter-spacing: -0.05em !important;
            margin-bottom: 8px !important;
          }
        }

        @media (max-width: 380px) {
          #koombo-connectors-page .hero-title {
            font-size: 2.15rem !important;
            line-height: 1.02 !important;
            letter-spacing: -0.045em !important;
          }
        }

        @media (min-width: 640px) and (max-width: 1023px) {
          #koombo-connectors-page .hero-title {
            font-size: clamp(3rem, 5.5vw, 3.9rem) !important;
            line-height: 0.99 !important;
          }
        }

        @media (min-width: 1024px) {
          #koombo-connectors-page .hero-title {
            font-size: clamp(3.5rem, 4.8vw, 4.5rem) !important;
            line-height: 0.98 !important;
          }
        }

        @keyframes k-rise {
          from { transform: translate3d(0, 110%, 0); }
          to { transform: translate3d(0, 0, 0); }
        }

        @keyframes k-fade {
          from { opacity: 0; transform: translate3d(0, 18px, 0); }
          to { opacity: 1; transform: translate3d(0, 0, 0); }
        }

        @keyframes k-pop {
          from { opacity: 0; transform: translate3d(0, 24px, 0) scale(0.92); }
          to { opacity: 1; transform: translate3d(0, 0, 0) scale(1); }
        }

        @keyframes k-img {
          from { opacity: 0; transform: scale(1.14); }
          to { opacity: 1; transform: scale(1); }
        }

        @keyframes k-wipe {
          from { clip-path: inset(0 0 100% 0 round 2.5rem); }
          to { clip-path: inset(0 0 0 0 round 2.5rem); }
        }

        #koombo-connectors-page .k-rise { animation: k-rise 1s cubic-bezier(0.22, 1, 0.36, 1) both; }
        #koombo-connectors-page .k-fade { animation: k-fade 0.7s cubic-bezier(0.22, 1, 0.36, 1) both; }
        #koombo-connectors-page .k-pop { animation: k-pop 0.9s cubic-bezier(0.22, 1, 0.36, 1) both; }
        #koombo-connectors-page .k-img { animation: k-img 1.6s cubic-bezier(0.22, 1, 0.36, 1) both; }
        #koombo-connectors-page .k-wipe { animation: k-wipe 1.2s cubic-bezier(0.22, 1, 0.36, 1) both; }

        @media (prefers-reduced-motion: reduce) {
          #koombo-connectors-page *,
          #koombo-connectors-page *::before,
          #koombo-connectors-page *::after {
            transition: none !important;
            animation: none !important;
          }
        }
      `}</style>

      {/* SCROLL PROGRESS */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px]"
      >
        <div
          className="h-full origin-left bg-[#4C1D95]"
          style={{ transform: 'scaleX(var(--progress, 0))' }}
        />
      </div>

      <SiteHeader />

      {/* HERO */}
      <section className="relative pt-[110px] sm:pt-[120px]">
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 pb-16 pt-12 sm:gap-16 sm:px-8 sm:pb-20 sm:pt-24 lg:grid-cols-[1.05fr_.95fr] lg:px-12 lg:pb-28 lg:pt-28">
          {/* HERO TEXT */}
          <div
            className="relative z-10 min-w-0"
            style={{
              transform:
                'translate3d(0, calc(var(--scroll, 0) * 0.1px), 0)',
            }}
          >
            <h1 className="hero-title heading-font">
              {[
                'Bring vendors.',
                'Share products.',
                'Earn on every sale.',
              ].map((line, i) => (
                <span key={line} className="hero-title-line">
                  <span
                    className="hero-title-line-inner k-rise"
                    style={{ animationDelay: `${i * 120}ms` }}
                  >
                    {line}
                  </span>
                </span>
              ))}
            </h1>

            <p
              className="k-fade mt-4 max-w-xl text-[17px] leading-8 text-[#686760] sm:mt-5 sm:text-xl sm:leading-9"
              style={{ animationDelay: '450ms' }}
            >
              Create a free account and get your referral links. No
              application, no waiting.
            </p>

            <div
              className="k-fade mt-7 flex flex-wrap items-center gap-3 sm:mt-8 sm:gap-4"
              style={{ animationDelay: '580ms' }}
            >
              <a
                href={SIGNUP_HREF}
                className={`inline-flex items-center gap-2 rounded-full bg-[#4C1D95] px-6 py-3.5 text-base font-bold text-white transition hover:bg-[#5B21B6] sm:px-7 sm:py-4 sm:text-lg ${focus}`}
              >
                Create free account
              </a>

              <a
                href="#how"
                className={`rounded-full px-4 py-3 text-base font-bold text-[#49463F] transition hover:text-[#5B21B6] sm:text-lg ${focus}`}
              >
                See how it works
              </a>
            </div>
          </div>

          {/* HERO IMAGE */}
          <div
            className="relative mx-auto w-full max-w-xl pb-8 lg:ml-auto lg:pb-0"
            style={{
              transform:
                'translate3d(0, calc(var(--scroll, 0) * -0.04px), 0)',
            }}
          >
            <div
              className="k-wipe relative overflow-hidden rounded-[2rem] bg-[#24133F] p-2.5 sm:rounded-[2.5rem] sm:p-4"
              style={{ animationDelay: '150ms' }}
            >
              <div className="relative overflow-hidden rounded-[1.5rem] bg-[#3B1B73] sm:rounded-[2rem]">
                <img
                  src={IMG.hero}
                  alt="A connector smiling while checking her referral earnings"
                  className="k-img h-[280px] w-full object-cover sm:h-[520px]"
                  style={{ animationDelay: '150ms' }}
                />
              </div>
            </div>

            {/* REFERRAL LINK CARD */}
            <div className="absolute left-2 top-6 w-48 sm:-left-12 sm:top-10 sm:w-60">
              <div
                className="k-pop rounded-2xl border border-[#EAE8E3] bg-white p-3 shadow-lg sm:p-3.5"
                style={{ animationDelay: '800ms' }}
              >
                <p className="text-xs font-bold text-[#77736D]">
                  Your referral link
                </p>

                <div className="mt-1.5 flex items-center justify-between gap-2 rounded-xl bg-[#24133F] px-3 py-2 text-white sm:px-3.5 sm:py-2.5">
                  <span className="truncate text-xs font-black tracking-[0.04em] sm:text-sm sm:tracking-[0.08em]">
                    koombo.com/ama
                  </span>

                  <span className="shrink-0 rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-bold">
                    Copy
                  </span>
                </div>
              </div>
            </div>

            {/* SALE NOTIFICATION */}
            <div className="absolute -bottom-0 right-2 w-[15rem] max-w-[calc(100%-1rem)] sm:-bottom-7 sm:-right-8 sm:w-64">
              <div
                className="k-pop flex items-center gap-3 rounded-2xl border border-[#EAE8E3] bg-white p-3 shadow-lg sm:p-3.5"
                style={{ animationDelay: '1000ms' }}
              >
                <img
                  src={IMG.avatar}
                  alt=""
                  className="h-10 w-10 shrink-0 rounded-full object-cover sm:h-11 sm:w-11"
                />

                <div className="min-w-0">
                  <p className="truncate text-sm font-extrabold text-[#24133F]">
                    Sale through your link
                  </p>

                  <p className="flex items-center gap-1.5 text-xs font-semibold text-[#047857]">
                    <span className="h-2 w-2 shrink-0 rounded-full bg-[#10B981]" />
                    <span className="truncate">You earned {money(25.5)}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COMMISSION BANNER */}
      <section className="px-5 pb-14 sm:px-8 sm:pb-24">
        <Reveal y={60} scale={0.96}>
          <div className="mx-auto max-w-5xl overflow-hidden rounded-[1.5rem] bg-[#1B0E33] px-5 py-7 text-white sm:rounded-[2.25rem] sm:px-12 sm:py-12">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between sm:gap-10">
              <div className="flex items-center gap-4 sm:gap-6">
                <span className="shrink-0 text-6xl font-black leading-none tracking-[-0.06em] text-white sm:text-8xl">
                  <CountUp to={COMMISSION_RATE} />%
                </span>

                <p className="text-lg font-extrabold leading-snug tracking-[-0.02em] sm:max-w-xs sm:text-2xl lg:text-3xl">
                  commission on all sales made using your link
                </p>
              </div>

              <a
                href={SIGNUP_HREF}
                className={`inline-flex w-full items-center justify-center rounded-full bg-white px-7 py-3.5 text-base font-bold text-[#24133F] transition hover:bg-[#EDE9FE] sm:w-auto sm:py-4 sm:text-lg ${focus}`}
              >
                Start earning
              </a>
            </div>
          </div>
        </Reveal>
      </section>

      {/* HOW IT WORKS */}
      <section
        id="how"
        ref={howRef}
        className="scroll-mt-20 border-y border-[#EAE8E3] bg-white py-16 sm:py-24"
      >
        <div className="mx-auto max-w-5xl px-5 sm:px-8 lg:px-12">
          <Reveal>
            <h2
              className="heading-font text-center"
              style={{
                fontSize: 'clamp(1.75rem, 4.5vw, 3.5rem)',
                lineHeight: 1.12,
              }}
            >
              From sign-up to your first sale
            </h2>
          </Reveal>

          <ol className="relative mt-10 grid gap-5 sm:mt-14 sm:grid-cols-3 sm:gap-6">
            <div
              aria-hidden
              className="absolute left-[16.6%] right-[16.6%] top-4 hidden sm:block"
            >
              <div className="border-t-2 border-dashed border-[#E4E2DC]" />

              <div
                className="absolute inset-x-0 top-0 h-[2px] origin-left bg-[#4C1D95]"
                style={{ transform: 'scaleX(var(--hiw, 0))' }}
              />
            </div>

            {STEPS.map((s, i) => (
              <Reveal
                as="li"
                key={s.title}
                delay={i * 140}
                y={48}
                className="relative text-center"
              >
                <span className="relative z-10 mx-auto grid h-9 w-9 place-items-center rounded-full bg-[#4C1D95] text-base font-black text-white ring-8 ring-white">
                  {i + 1}
                </span>

                <div className="mt-4 rounded-2xl border border-[#EAE8E3] bg-[#F8F8F6] p-5 sm:mt-6 sm:rounded-[1.5rem] sm:p-7">
                  <h3 className="text-lg font-extrabold text-[#24133F] sm:text-2xl">
                    {s.title}
                  </h3>

                  <p className="mt-2 text-[15px] leading-7 text-[#686760] sm:mt-3 sm:text-lg sm:leading-8">
                    {s.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* TWO WAYS TO EARN */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <Reveal>
            <h2
              className="heading-font max-w-2xl"
              style={{
                fontSize: 'clamp(1.75rem, 4.5vw, 3.5rem)',
                lineHeight: 1.12,
              }}
            >
              One account. Two ways to earn.
            </h2>
          </Reveal>

          <div className="mt-8 grid gap-5 sm:mt-10 md:grid-cols-2">
            {PATHS.map((t, i) => {
              const dark = i === 0;

              return (
                <Reveal
                  as="article"
                  key={t.key}
                  x={i === 0 ? -40 : 40}
                  y={0}
                  delay={i * 150}
                >
                  <div
                    className={`h-full overflow-hidden rounded-[1.5rem] p-3 sm:rounded-[1.75rem] sm:p-5 ${
                      dark
                        ? 'bg-[#24133F] text-white'
                        : 'border border-[#EAE8E3] bg-[#F8F8F6]'
                    }`}
                  >
                    <div className="group relative overflow-hidden rounded-2xl bg-[#3B1B73]">
                      <img
                        src={t.image}
                        alt={t.alt}
                        className="h-44 w-full object-cover transition-transform duration-700 group-hover:scale-105 sm:h-64"
                      />

                      <span className="absolute left-2.5 top-2.5 max-w-[calc(100%-1.25rem)] rounded-full bg-white px-3 py-1.5 text-xs font-bold text-[#4C1D95] sm:left-3 sm:top-3 sm:px-4 sm:py-2 sm:text-sm">
                        {t.tagline}
                      </span>
                    </div>

                    <div className="px-1.5 pb-2 pt-5 sm:px-2 sm:pt-6">
                      <h3
                        className={`text-2xl font-black tracking-[-0.03em] sm:text-3xl lg:text-4xl ${
                          dark ? '' : 'text-[#24133F]'
                        }`}
                      >
                        {t.label}
                      </h3>

                      <p
                        className={`mt-2.5 max-w-md text-[15px] leading-7 sm:mt-3 sm:text-lg sm:leading-8 ${
                          dark ? 'text-white/75' : 'text-[#686760]'
                        }`}
                      >
                        {t.blurb}
                      </p>

                      <a
                        href={`${SIGNUP_HREF}?type=${t.key}`}
                        className={`mt-5 inline-flex w-full items-center justify-center rounded-full px-6 py-3.5 text-base font-bold transition sm:mt-6 sm:w-auto sm:px-7 sm:py-4 sm:text-lg ${focus} ${
                          dark
                            ? 'bg-white text-[#24133F] hover:bg-[#EDE9FE]'
                            : 'bg-[#4C1D95] text-white hover:bg-[#5B21B6]'
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

      {/* WITHDRAWAL INFORMATION */}
      <section className="border-t border-[#EAE8E3] bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <Reveal>
            <div className="overflow-hidden rounded-[1.75rem] border border-[#EAE8E3] bg-[#F8F8F6] p-5 sm:rounded-[2.5rem] sm:p-12 lg:p-16">
              <div className="flex flex-col items-stretch gap-8 lg:flex-row lg:items-center lg:gap-16">
                <div className="text-left lg:flex-1">
                  <span className="mb-4 inline-block rounded-full bg-[#EDE9FE] px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#6D28D9] sm:mb-5 sm:px-5 sm:py-2 sm:text-sm">
                    Easy Payouts
                  </span>

                  <h2
                    className="heading-font text-[#24133F]"
                    style={{
                      fontSize: 'clamp(1.75rem, 4.5vw, 3.5rem)',
                      lineHeight: 1.12,
                    }}
                  >
                    Get paid instantly.
                  </h2>

                  <p className="mt-4 max-w-xl text-[15px] leading-7 text-[#686760] sm:mt-6 sm:text-lg sm:leading-8 lg:text-xl">
                    Once your earnings hit just{' '}
                    <span className="font-bold text-[#24133F]">
                      GH₵ 100
                    </span>
                    , you can withdraw directly to your MTN MoMo or Telecel
                    Cash wallet. No bank accounts needed, no long waits.
                  </p>

                  <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-8 sm:flex sm:flex-wrap sm:gap-4">
                    <div className="flex items-center gap-2.5 rounded-xl border border-[#EAE8E3] bg-white px-3 py-3 sm:gap-3 sm:px-5 sm:py-4">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FFCC00] text-[10px] font-black text-black sm:h-9 sm:w-9 sm:text-xs">
                        MTN
                      </div>

                      <span className="text-sm font-bold text-[#24133F] sm:text-lg">
                        MTN MoMo
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5 rounded-xl border border-[#EAE8E3] bg-white px-3 py-3 sm:gap-3 sm:px-5 sm:py-4">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#E60000] text-[10px] font-black text-white sm:h-9 sm:w-9 sm:text-xs">
                        TEL
                      </div>

                      <span className="text-sm font-bold text-[#24133F] sm:text-lg">
                        Telecel Cash
                      </span>
                    </div>
                  </div>
                </div>

                {/* BALANCE CARD */}
                <div className="w-full lg:flex-1">
                  <div className="flex w-full flex-col gap-6 rounded-2xl bg-[#24133F] p-5 text-white sm:aspect-[4/3] sm:justify-between sm:p-8">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-xs font-bold uppercase tracking-widest opacity-70 sm:text-sm">
                          Available Balance
                        </p>

                        <p className="mt-1.5 text-3xl font-black sm:mt-2 sm:text-5xl">
                          GH₵ 125.50
                        </p>
                      </div>

                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 sm:h-11 sm:w-11">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                        </svg>
                      </div>
                    </div>

                    <div className="space-y-3 sm:space-y-4">
                      <div className="flex h-12 items-center gap-3 rounded-xl bg-white/10 px-4 sm:h-14">
                        <div className="h-6 w-6 shrink-0 rounded-full bg-[#FFCC00] sm:h-7 sm:w-7" />
                        <div className="h-2 flex-1 rounded-full bg-white/20" />
                      </div>

                      <button className="w-full rounded-xl bg-white py-3.5 text-base font-bold text-[#24133F] transition hover:bg-[#EDE9FE] sm:py-4 sm:text-lg">
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

      {/* FAQ */}
      <section className="border-t border-[#EAE8E3] bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <Reveal>
            <h2
              className="heading-font"
              style={{
                fontSize: 'clamp(1.75rem, 4.5vw, 3.5rem)',
                lineHeight: 1.12,
              }}
            >
              Questions
            </h2>
          </Reveal>

          <Reveal delay={100} className="mt-6 sm:mt-8">
            <div className="divide-y divide-[#E7E5E0] border-y border-[#E7E5E0]">
              {FAQ.map(([q, a], i) => {
                const open = openFaq === i;

                return (
                  <div key={q}>
                    <button
                      type="button"
                      onClick={() => setOpenFaq(open ? -1 : i)}
                      aria-expanded={open}
                      className={`flex w-full items-center justify-between gap-4 py-5 text-left text-base font-bold text-[#24133F] sm:gap-6 sm:py-6 sm:text-xl ${focus}`}
                    >
                      {q}

                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-transform sm:h-9 sm:w-9 ${
                          open
                            ? 'rotate-45 bg-[#EDE9FE] text-[#4C1D95]'
                            : 'bg-white ring-1 ring-[#E4E2DC]'
                        }`}
                      >
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2.5}
                        >
                          <path
                            strokeLinecap="round"
                            d="M12 5v14M5 12h14"
                          />
                        </svg>
                      </span>
                    </button>

                    {open && (
                      <p className="k-fade pb-6 pr-6 text-[15px] leading-7 text-[#686760] sm:pb-7 sm:pr-12 sm:text-lg sm:leading-8">
                        {a}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </Reveal>
        </div>
      </section>

      {/* CLOSING CTA */}
      <section id="join" className="scroll-mt-20 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <Reveal y={60} scale={0.96}>
            <div className="overflow-hidden rounded-[1.75rem] bg-[#24133F] px-5 py-10 text-white sm:rounded-[2.5rem] sm:px-14 sm:py-16">
              <div className="flex flex-col items-start justify-between gap-7 lg:flex-row lg:items-center lg:gap-8">
                <div>
                  <h2
                    className="heading-font max-w-xl"
                    style={{
                      fontSize: 'clamp(1.75rem, 4.5vw, 3.5rem)',
                      lineHeight: 1.12,
                    }}
                  >
                    Create an account. Start earning.
                  </h2>

                  <p className="mt-4 text-[15px] text-white/75 sm:mt-5 sm:text-lg">
                    Already have an account?{' '}
                    <a
                      href={LOGIN_HREF}
                      className={`font-bold text-white underline underline-offset-4 ${focus}`}
                    >
                      Log in
                    </a>
                  </p>
                </div>

                <a
                  href={SIGNUP_HREF}
                  className={`inline-flex w-full items-center justify-center rounded-full bg-white px-8 py-3.5 text-base font-bold text-[#24133F] transition hover:bg-[#EDE9FE] sm:w-auto sm:py-4 sm:text-lg ${focus}`}
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
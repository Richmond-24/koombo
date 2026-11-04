'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import SiteHeader from '../components/SiteHeader';
import Footer from '../components/Footer';
import {
  ArrowRight,
  Eye,
  Handshake,
  Heart,
  MessageCircle,
  Play,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Store,
  Target,
  Users,
  Video,
} from 'lucide-react';

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

/* -------------------------------------------------------------------------- */
/* CONTENT                                                                    */
/* -------------------------------------------------------------------------- */

const steps = [
  {
    title: 'Discover',
    description: 'Explore products, videos and sellers you will love.',
  },
  {
    title: 'Connect',
    description: 'Chat directly with sellers and buy with confidence.',
  },
  {
    title: 'Buy & Sell',
    description: 'Shop for what you love or showcase your own products.',
  },
  {
    title: 'Earn & Grow',
    description: 'Grow your business and earn by sharing and connecting.',
  },
];

// Swap this for your own photo (for example '/loki.jpg' in /public).
const LOKI_SECTION_IMAGE =
  'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1000&q=80';

const fixes = [
  {
    icon: Video,
    title: 'Shopping made real',
    description:
      'See products in action through live and short videos, so you know what you are buying before you pay.',
  },
  {
    icon: Store,
    title: 'Listing made easy',
    description:
      'Put your products online in minutes and start reaching buyers, without the hassle.',
  },
  {
    icon: ShieldCheck,
    title: 'Fraud stopped early',
    description:
      'Loki, our custom AI, watches for fake listings and suspicious activity to keep buyers and sellers safe.',
  },
];

const audiences = [
  {
    id: 'shoppers',
    label: 'Buyers',
    icon: ShoppingBag,
    headline: 'Discover more. Shop better.',
    body: 'Find great products and connect directly with the people selling them.',
    cta: 'Start exploring',
    href: '/',
  },
  {
    id: 'businesses',
    label: 'Sellers',
    icon: Store,
    headline: 'Your products deserve to be discovered.',
    body: 'Reach new customers and turn conversations into sales.',
    cta: 'Start selling',
    href: '/lister/connectors',
  },
  {
    id: 'creators',
    label: 'Creators',
    icon: Video,
    headline: 'Turn your influence into opportunity.',
    body: 'Share authentic recommendations and earn from the products you promote.',
    cta: 'Explore opportunities',
    href: '/lister/connectors',
  },
  {
    id: 'connectors',
    label: 'Connectors',
    icon: Handshake,
    headline: 'Make connections. Create value. Earn.',
    body: 'Introduce businesses to buyers and earn through eligible referrals.',
    cta: 'Become a connector',
    href: '/lister/connectors',
  },
];

/* -------------------------------------------------------------------------- */
/* PHONE MOCKUPS                                                              */
/* -------------------------------------------------------------------------- */

function Phone({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-[250px] rounded-[1.6rem] border border-[#E4DFF2] bg-white p-2 shadow-[0_18px_40px_-18px_rgba(76,29,149,0.35)]">
      <div className="h-[230px] overflow-hidden rounded-[1.2rem] bg-[#F7F5FC] p-3">
        {children}
      </div>
    </div>
  );
}

function DiscoverScreen() {
  return (
    <div className="flex h-full flex-col gap-2.5">
      <div className="relative flex-1 overflow-hidden rounded-xl bg-[#EDE9FE]">
        <img
          src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80"
          alt="Sneakers available on Koombo"
          className="h-full w-full object-cover"
        />

        <div className="absolute inset-0 grid place-items-center bg-black/10">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-white/90 text-[#4C1D95] shadow-md">
            <Play size={16} fill="currentColor" />
          </span>
        </div>

        <span className="absolute bottom-2 left-2 rounded-full bg-black/40 px-2 py-0.5 text-[10px] font-semibold text-white">
          New drop
        </span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img
            src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80"
            alt="Kicks by Ama seller profile"
            className="h-6 w-6 rounded-full object-cover"
          />
          <span className="text-xs font-bold text-[#24133F]">
            Kicks by Ama
          </span>
        </div>

        <Heart size={14} className="text-[#6D28D9]" />
      </div>
    </div>
  );
}

function ConnectScreen() {
  return (
    <div className="flex h-full flex-col justify-end gap-2 text-[11px] leading-snug">
      <p className="max-w-[80%] self-start rounded-2xl rounded-bl-sm bg-white px-3 py-2 text-[#3C3542] shadow-sm">
        Is the size 43 still available?
      </p>

      <p className="max-w-[80%] self-end rounded-2xl rounded-br-sm bg-[#4C1D95] px-3 py-2 text-white">
        Yes! I can have it ready today.
      </p>

      <p className="max-w-[80%] self-start rounded-2xl rounded-bl-sm bg-white px-3 py-2 text-[#3C3542] shadow-sm">
        Perfect, ordering now!
      </p>
    </div>
  );
}

function BuyScreen() {
  return (
    <div className="flex h-full flex-col justify-between">
      <div className="flex items-center gap-3 rounded-xl bg-white p-2.5 shadow-sm">
        <img
          src="https://images.unsplash.com/photo-1543508282-6319a3e2621f?auto=format&fit=crop&w=400&q=80"
          alt="Air runner sneakers"
          className="h-12 w-12 shrink-0 rounded-lg object-cover"
        />

        <div className="min-w-0">
          <p className="truncate text-xs font-bold text-[#24133F]">
            Air runner sneakers
          </p>
          <p className="text-xs text-[#77736D]">Size 43</p>
          <p className="text-sm font-black text-[#4C1D95]">GH₵ 850</p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs text-[#686760]">
          <span>Total</span>
          <span className="font-bold text-[#24133F]">GH₵ 850</span>
        </div>

        <div className="rounded-full bg-[#4C1D95] py-2.5 text-center text-xs font-bold text-white">
          Place order
        </div>
      </div>
    </div>
  );
}

function EarnScreen() {
  return (
    <div className="flex h-full flex-col justify-between">
      <div className="rounded-xl bg-white p-3 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-[#EDE9FE] text-[#5B21B6]">
            <Handshake size={17} />
          </span>

          <div>
            <p className="text-xs font-bold text-[#24133F]">
              Successful connection
            </p>
            <p className="text-[10px] text-[#77736D]">
              You helped a business find a buyer.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-[#4C1D95] p-4 text-white">
        <p className="text-[10px] font-medium text-white/70">
          Earning opportunity
        </p>

        <p className="mt-1 text-2xl font-black">
          Earn together
        </p>

        <p className="mt-1 text-[10px] text-white/70">
          Discover more ways to participate in commerce.
        </p>
      </div>
    </div>
  );
}

const screens = [
  DiscoverScreen,
  ConnectScreen,
  BuyScreen,
  EarnScreen,
];

/* -------------------------------------------------------------------------- */
/* PAGE                                                                       */
/* -------------------------------------------------------------------------- */

export default function AboutPage() {
  const [active, setActive] = useState(audiences[0].id);

  const rootRef = useRef<HTMLElement>(null);
  const howRef = useRef<HTMLElement>(null);

  const current =
    audiences.find((a) => a.id === active) ?? audiences[0];

  const CurrentIcon = current.icon;

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
    <main
      ref={rootRef}
      className="min-h-screen overflow-x-clip bg-[#F8F8F6] text-[#20201F]"
      style={{
        fontFamily: "'DM Sans', 'Inter', system-ui, sans-serif",
      }}
    >
      <style>{`
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

        .k-rise { animation: k-rise 1s cubic-bezier(0.22, 1, 0.36, 1) both; }
        .k-fade { animation: k-fade 0.7s cubic-bezier(0.22, 1, 0.36, 1) both; }
        .k-pop  { animation: k-pop 0.9s cubic-bezier(0.22, 1, 0.36, 1) both; }
        .k-img  { animation: k-img 1.6s cubic-bezier(0.22, 1, 0.36, 1) both; }
        .k-wipe { animation: k-wipe 1.2s cubic-bezier(0.22, 1, 0.36, 1) both; }

        @media (prefers-reduced-motion: reduce) {
          .k-rise, .k-fade, .k-pop, .k-img, .k-wipe { animation: none !important; }
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
        <div
          className="pointer-events-none absolute -right-40 top-0 h-[30rem] w-[30rem] rounded-full bg-[#DDD6FE]/50 blur-3xl"
          style={{
            transform:
              'translate3d(0, calc(var(--scroll, 0) * 0.2px), 0)',
          }}
        />

        <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-5 pb-20 pt-20 sm:px-8 sm:pt-24 lg:grid-cols-[1.2fr_.8fr] lg:px-12 lg:pb-28 lg:pt-28">

          <div
            className="relative z-10"
            style={{
              transform:
                'translate3d(0, calc(var(--scroll, 0) * 0.1px), 0)',
            }}
          >
            {/* MASSIVE HEADER TEXT TO MATCH REFERENCE IMAGE */}
            <h1 className="text-[2.25rem] font-black leading-[1.05] tracking-[-0.04em] sm:text-[2.5rem] lg:text-[2.75rem]">
              <span className="-mb-[0.08em] block overflow-hidden pb-[0.08em]">
                <span className="k-rise block">Buy. Sell.</span>
              </span>
              <span className="-mb-[0.08em] block overflow-hidden pb-[0.08em]">
                <span
                  className="k-rise block"
                  style={{ animationDelay: '120ms' }}
                >
                  Connect. Earn.
                </span>
              </span>
            </h1>

            {/* INCREASED BODY TEXT SIZE */}
            <p
              className="k-fade mt-8 max-w-xl text-lg leading-8 text-[#686760] sm:text-xl sm:leading-9"
              style={{ animationDelay: '350ms' }}
            >
              One connected commerce ecosystem. Discover products,
              connect with sellers and turn meaningful connections
              into opportunities.
            </p>

            <div
              className="k-fade mt-10"
              style={{ animationDelay: '480ms' }}
            >
              <Link
                href="#how-it-works"
                className={`group inline-flex items-center gap-2 rounded-full bg-[#4C1D95] px-8 py-4 text-lg font-bold text-white shadow-lg shadow-[#4C1D95]/15 transition hover:bg-[#5B21B6] ${focus}`}
              >
                See how it works
                <ArrowRight
                  size={20}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            </div>
          </div>

          {/* HERO VISUAL */}

          <div
            className="relative mx-auto w-full max-w-md lg:ml-auto"
            style={{
              transform:
                'translate3d(0, calc(var(--scroll, 0) * -0.04px), 0)',
            }}
          >
            <div
              className="k-wipe relative overflow-hidden rounded-[2.5rem] bg-[#24133F] p-3 shadow-[0_30px_100px_rgba(36,19,63,0.18)] sm:p-4"
              style={{ animationDelay: '150ms' }}
            >
              <div className="relative overflow-hidden rounded-[2rem]">
                <img
                  src="/s.jpg"
                  alt="A shopper discovering products from a local business"
                  className="k-img h-[420px] w-full object-cover sm:h-[500px]"
                  style={{ animationDelay: '150ms' }}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#170D29]/70 via-transparent to-transparent" />
              </div>
            </div>

            {/* PRODUCT CARD (outer = parallax, inner = entrance) */}

            <div
              className="absolute -left-3 top-10 w-52 sm:-left-10 sm:w-56"
              style={{
                transform:
                  'translate3d(0, calc(var(--scroll, 0) * -0.1px), 0)',
              }}
            >
              <div
                className="k-pop rounded-2xl bg-white p-3 shadow-xl"
                style={{ animationDelay: '800ms' }}
              >
                <img
                  src="https://images.unsplash.com/photo-1543508282-6319a3e2621f?auto=format&fit=crop&w=800&q=80"
                  alt="Air runner sneakers"
                  className="h-24 w-full rounded-xl object-cover"
                />

                <p className="mt-3 text-sm font-extrabold">
                  Air runner sneakers
                </p>

                <div className="mt-1 flex items-center justify-between">
                  <span className="text-sm font-black text-[#4C1D95]">
                    GH₵ 850
                  </span>

                  <span className="flex items-center gap-1 text-xs text-[#77736D]">
                    <span className="h-2 w-2 rounded-full bg-[#10B981]" />
                    Verified seller
                  </span>
                </div>
              </div>
            </div>

            {/* CHAT BUBBLE (outer = parallax, inner = entrance) */}

            <div
              className="absolute -bottom-6 right-4 max-w-[270px] sm:-right-6"
              style={{
                transform:
                  'translate3d(0, calc(var(--scroll, 0) * 0.06px), 0)',
              }}
            >
              <div
                className="k-pop flex items-start gap-3 rounded-2xl bg-white p-4 shadow-xl"
                style={{ animationDelay: '1000ms' }}
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#EDE9FE] text-[#5B21B6]">
                  <MessageCircle size={20} />
                </span>

                <div>
                  <p className="text-sm font-extrabold">
                    Connect before you buy
                  </p>

                  <p className="mt-1 text-xs leading-5 text-[#77717D]">
                    &quot;Yes, it&apos;s in stock. I can send it today.&quot;
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= MISSION & VISION ================= */}

      <section
        id="our-story"
        className="scroll-mt-20 border-y border-[#EAE8E3] bg-white py-20 sm:py-28"
      >
        <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-2 lg:gap-8 lg:px-12">

          {/* MISSION */}

          <Reveal x={-40} y={0} as="article">
            <div className="relative h-full overflow-hidden rounded-[1.75rem] bg-[#24133F] p-1.5 shadow-[0_24px_60px_-24px_rgba(36,19,63,0.6)]">
              <div className="relative h-full overflow-hidden rounded-[1.4rem] border border-white/10 bg-gradient-to-br from-[#3B1B73] via-[#2B1650] to-[#1B0E33] p-8 text-white sm:p-10">
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#8B5CF6]/40 blur-3xl"
                />

                <div className="relative">
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 py-2 pl-2 pr-4 text-sm font-bold text-white backdrop-blur">
                    <span className="grid h-7 w-7 place-items-center rounded-full bg-white text-[#4C1D95]">
                      <Target size={16} />
                    </span>
                    Our mission
                  </span>

                  {/* INCREASED CARD TEXT SIZE */}
                  <p className="mt-8 text-3xl font-black leading-[1.15] tracking-[-0.02em] sm:text-4xl lg:text-5xl">
                    To make buying, selling and earning more accessible
                    by connecting people, businesses and opportunities.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

          {/* VISION */}

          <Reveal x={40} y={0} delay={150} as="article">
            <div className="relative h-full overflow-hidden rounded-[1.75rem] border border-[#E4DFF2] bg-white p-1.5 shadow-[0_16px_40px_-24px_rgba(76,29,149,0.35)]">
              <div className="relative h-full overflow-hidden rounded-[1.4rem] bg-gradient-to-br from-[#F7F5FC] to-[#EDE9FE]/70 p-8 sm:p-10">
                <div
                  aria-hidden
                  className="pointer-events-none absolute -bottom-14 -left-10 h-40 w-40 rounded-full bg-[#C4B5FD]/50 blur-3xl"
                />

                <div className="relative">
                  <span className="inline-flex items-center gap-2 rounded-full border border-[#DDD6FE] bg-white py-2 pl-2 pr-4 text-sm font-bold text-[#5B21B6]">
                    <span className="grid h-7 w-7 place-items-center rounded-full bg-[#4C1D95] text-white">
                      <Eye size={16} />
                    </span>
                    Our vision
                  </span>

                  {/* INCREASED CARD TEXT SIZE */}
                  <p className="mt-8 text-3xl font-black leading-[1.15] tracking-[-0.02em] text-[#24133F] sm:text-4xl lg:text-5xl">
                    A world where everyone can take part in commerce
                    and earn from the value they create.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ================= FIXING HOW THE WORLD SHOPS ================= */}

      <section className="relative isolate overflow-hidden bg-[#24133F] py-24 text-white sm:py-32">

        {/* FULL BACKGROUND IMAGE */}
        <img
          src={LOKI_SECTION_IMAGE}
          alt=""
          aria-hidden
          className="absolute inset-0 -z-20 h-full w-full object-cover"
        />

        {/* DARK OVERLAY KEEPS TEXT READABLE */}
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-gradient-to-br from-[#170D29]/92 via-[#24133F]/82 to-[#24133F]/65"
        />

        <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">

          {/* HEADING + LOKI CHECK CARD */}

          <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">

            <div className="max-w-4xl">
              <Reveal>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 py-2 pl-2 pr-4 text-sm font-bold text-white backdrop-blur">
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-white text-[#4C1D95]">
                    <Sparkles size={16} />
                  </span>
                  Powered by Loki, our custom AI
                </span>
              </Reveal>

              {/* INCREASED SECTION HEADER SIZE */}
              <Reveal delay={100}>
                <h2 className="mt-6 text-5xl font-black leading-[0.95] tracking-[-0.04em] sm:text-6xl lg:text-7xl xl:text-8xl">
                  We are fixing how the world shops.
                </h2>
              </Reveal>

              <Reveal delay={200}>
                <p className="mt-6 max-w-2xl text-xl leading-8 text-white/85 sm:text-2xl sm:leading-9">
                  Online shopping should feel real, simple and safe.
                  That is what we are building.
                </p>
              </Reveal>
            </div>

            <Reveal x={48} y={0} delay={300}>
              <div className="flex max-w-[320px] items-start gap-4 rounded-2xl bg-white p-5 text-[#20201F] shadow-2xl">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[#EDE9FE] text-[#5B21B6]">
                  <ShieldCheck size={24} />
                </span>

                <div>
                  <p className="text-base font-extrabold">Checked by Loki</p>
                  <p className="mt-1 text-sm leading-6 text-[#77717D]">
                    Listing verified. No fraud signals found.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>

          {/* THREE CARDS IN A ROW */}

          <ul className="mt-16 grid gap-6 md:grid-cols-3">
            {fixes.map(({ icon: Icon, title, description }, i) => (
              <Reveal as="li" key={title} delay={i * 130} y={44}>
                <div className="h-full rounded-[1.5rem] border border-white/15 bg-white/10 p-8 backdrop-blur-md transition-colors duration-300 hover:bg-white/15">
                  <span className="grid h-14 w-14 place-items-center rounded-2xl border border-white/20 bg-white/10 text-white">
                    <Icon size={26} />
                  </span>

                  <h3 className="mt-6 text-2xl font-extrabold tracking-[-0.01em]">
                    {title}
                  </h3>

                  <p className="mt-3 text-base leading-7 text-white/80">
                    {description}
                  </p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}

      <section
        id="how-it-works"
        ref={howRef}
        className="scroll-mt-20 py-20 sm:py-28"
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">

          <div className="mx-auto max-w-3xl text-center">
            <Reveal>
              {/* INCREASED SECTION HEADER SIZE */}
              <h2 className="text-5xl font-black tracking-[-0.04em] sm:text-6xl lg:text-7xl xl:text-8xl">
                How Koombo works
              </h2>
            </Reveal>
          </div>

          <ol className="relative mt-16 grid gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">

            {/* connecting line that draws itself as you scroll */}
            <div
              aria-hidden
              className="absolute left-[12%] right-[12%] top-4 hidden lg:block"
            >
              <div className="border-t-2 border-dashed border-[#E4DDF5]" />
              <div
                className="absolute inset-x-0 top-0 h-[2px] origin-left bg-gradient-to-r from-[#8B5CF6] to-[#4C1D95]"
                style={{ transform: 'scaleX(var(--hiw, 0))' }}
              />
            </div>

            {steps.map((step, i) => {
              const Screen = screens[i];

              return (
                <Reveal
                  as="li"
                  key={step.title}
                  delay={i * 140}
                  y={56}
                  className="relative text-center"
                >
                  <span className="relative z-10 mx-auto grid h-10 w-10 place-items-center rounded-full bg-[#4C1D95] text-base font-black text-white ring-8 ring-[#F8F8F6]">
                    {i + 1}
                  </span>

                  <div className="mt-8">
                    <Phone>
                      <Screen />
                    </Phone>
                  </div>

                  <h3 className="mt-8 text-2xl font-extrabold">
                    {step.title}
                  </h3>

                  <p className="mx-auto mt-3 max-w-[18rem] text-base leading-7 text-[#77736D]">
                    {step.description}
                  </p>
                </Reveal>
              );
            })}
          </ol>
        </div>
      </section>

      {/* ================= WHO KOOMBO IS FOR ================= */}

      <section className="border-y border-[#EAE8E3] bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">

          <Reveal>
            {/* INCREASED SECTION HEADER SIZE */}
            <h2 className="max-w-2xl text-5xl font-black leading-[0.95] tracking-[-0.04em] sm:text-6xl lg:text-7xl xl:text-8xl">
              One ecosystem. Different opportunities.
            </h2>
          </Reveal>

          {/* TABS */}

          <Reveal delay={100} className="mt-10 inline-block max-w-full">
            <div
              role="tablist"
              aria-label="Who Koombo is for"
              className="inline-flex max-w-full flex-wrap gap-2 rounded-full border border-[#E7E2F0] bg-[#F7F5FC] p-2"
            >
              {audiences.map(({ id, label, icon: Icon }) => {
                const selected = id === active;

                return (
                  <button
                    key={id}
                    role="tab"
                    type="button"
                    aria-selected={selected}
                    onClick={() => setActive(id)}
                    className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-base font-bold transition ${focus} ${
                      selected
                        ? 'bg-[#4C1D95] text-white shadow-md'
                        : 'text-[#49463F] hover:bg-white'
                    }`}
                  >
                    <Icon size={18} />
                    {label}
                  </button>
                );
              })}
            </div>
          </Reveal>

          {/* TAB CONTENT */}

          <Reveal delay={150} y={48} className="mt-8">
            <div
              role="tabpanel"
              key={current.id}
              className="grid items-center gap-10 rounded-[2rem] bg-[#F7F5FC] p-8 sm:p-12 lg:grid-cols-[1.2fr_.8fr] lg:gap-20"
            >
              <div className="k-fade">
                {/* INCREASED TAB HEADLINE SIZE */}
                <h3 className="text-4xl font-black leading-[1.05] tracking-[-0.03em] text-[#24133F] sm:text-5xl lg:text-6xl">
                  {current.headline}
                </h3>

                <p className="mt-6 max-w-lg text-xl leading-8 text-[#686760]">
                  {current.body}
                </p>

                <Link
                  href={current.href}
                  className={`group mt-8 inline-flex items-center gap-2 rounded-full bg-[#4C1D95] px-8 py-4 text-lg font-bold text-white transition hover:bg-[#5B21B6] ${focus}`}
                >
                  {current.cta}
                  <ArrowRight
                    size={20}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>
              </div>

              <div
                aria-hidden
                className="k-pop mx-auto hidden h-56 w-56 place-items-center rounded-[2.5rem] bg-gradient-to-br from-[#4C1D95] to-[#24133F] text-white shadow-[0_24px_60px_-24px_rgba(36,19,63,0.6)] lg:grid"
              >
                <CurrentIcon size={80} strokeWidth={1.5} />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ================= CLOSING CTA ================= */}

      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">

          <Reveal y={60} scale={0.96}>
            <div className="relative overflow-hidden rounded-[2.5rem] bg-[#24133F] px-8 py-16 text-white sm:px-16 sm:py-20">

              <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#6D28D9]/40 blur-3xl" />

              <div className="relative flex flex-col items-start justify-between gap-10 lg:flex-row lg:items-center">

                {/* INCREASED CTA HEADER SIZE */}
                <h2 className="max-w-2xl text-5xl font-black leading-[0.95] tracking-[-0.04em] sm:text-6xl lg:text-7xl xl:text-8xl">
                  One connection. More opportunities.
                </h2>

                <div className="flex flex-col gap-4 sm:flex-row">
                  <Link
                    href="/"
                    className={`group inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-lg font-bold text-[#24133F] transition hover:bg-[#EDE9FE] ${focus}`}
                  >
                    Start exploring
                    <ArrowRight
                      size={20}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </Link>

                  <Link
                    href="/lister/connectors"
                    className={`inline-flex items-center justify-center gap-2 rounded-full border border-white/30 px-8 py-4 text-lg font-bold text-white transition hover:bg-white/10 ${focus}`}
                  >
                    Join the community
                    <Users size={20} />
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </main>
  );
}
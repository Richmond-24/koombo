
'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Inter } from 'next/font/google';
import SiteHeader from '../components/SiteHeader';
import Footer from '../components/Footer';
import {
  ArrowLeft,
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

const body = Inter({
  subsets: ['latin'],
  display: 'swap',
});

/* -------------------------------------------------------------------------- */
/* ROYAL PURPLE DESIGN SYSTEM                                                 */
/*                                                                            */
/* Royal purple: #6D28D9                                                     */
/* Deep purple:  #2E1065                                                     */
/* Light purple: #EDE9FE                                                     */
/* Pale purple:  #F5F3FF                                                     */
/* Hover purple: #8B5CF6                                                     */
/* Body text:    #45415A                                                     */
/* -------------------------------------------------------------------------- */

const headingStyle = {
  lineHeight: 1.08,
  letterSpacing: '-0.035em',
  fontWeight: 900,
} as const;

const h = 'font-black';

/* -------------------------------------------------------------------------- */
/* SCROLL ANIMATION HELPERS                                                   */
/* -------------------------------------------------------------------------- */

type RevealTag = 'div' | 'li' | 'section' | 'article';

function Reveal({
  children,
  delay = 0,
  x = 0,
  y = 30,
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
        transition: `opacity 0.8s cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 0.8s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
        willChange: shown ? 'auto' : 'opacity, transform',
      }}
    >
      {children}
    </Tag>
  );
}

/* -------------------------------------------------------------------------- */
/* CONTENT                                                                     */
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

const LOKI_SECTION_IMAGE =
  'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1000&q=80';

const fixes = [
  {
    icon: Video,
    title: 'Shopping made real',
    description:
      'See products in action through live and short videos, so you know what you are buying before you pay.',
    card: 'bg-[#6D28D9] text-white',
    iconBox: 'bg-white text-[#2E1065]',
  },
  {
    icon: Store,
    title: 'Listing made easy',
    description:
      'Put your products online in minutes and start reaching buyers, without the hassle.',
    card: 'bg-white text-[#2E1065]',
    iconBox: 'bg-[#EDE9FE] text-[#6D28D9]',
  },
  {
    icon: ShieldCheck,
    title: 'Fraud stopped early',
    description:
      'Loki, our custom AI, watches for fake listings and suspicious activity to keep buyers and sellers safe.',
    card: 'bg-[#EDE9FE] text-[#2E1065]',
    iconBox: 'bg-[#2E1065] text-white',
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
/* PHONE MOCKUPS                                                               */
/* -------------------------------------------------------------------------- */

function Phone({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-[230px] rounded-[1.8rem] bg-[#2E1065] p-2">
      <div className="h-[220px] overflow-hidden rounded-[1.4rem] bg-[#F5F3FF] p-3">
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
          <span className="grid h-10 w-10 place-items-center rounded-full bg-[#6D28D9] text-white">
            <Play size={16} fill="currentColor" />
          </span>
        </div>

        <span className="absolute bottom-2 left-2 rounded-full bg-[#6D28D9] px-2 py-0.5 text-[10px] font-bold text-white">
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
          <span className="text-xs font-bold text-[#2E1065]">
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
    <div className="flex h-full flex-col justify-end gap-2 text-[11px] font-semibold leading-snug">
      <p className="max-w-[80%] self-start rounded-2xl rounded-bl-sm bg-white px-3 py-2 text-[#2E1065]">
        Is the size 43 still available?
      </p>

      <p className="max-w-[80%] self-end rounded-2xl rounded-br-sm bg-[#EDE9FE] px-3 py-2 text-[#2E1065]">
        Yes! I can have it ready today.
      </p>

      <p className="max-w-[80%] self-start rounded-2xl rounded-bl-sm bg-white px-3 py-2 text-[#2E1065]">
        Perfect, ordering now!
      </p>
    </div>
  );
}

function BuyScreen() {
  return (
    <div className="flex h-full flex-col justify-between">
      <div className="flex items-center gap-3 rounded-xl bg-white p-2.5">
        <img
          src="https://images.unsplash.com/photo-1543508282-6319a3e2621f?auto=format&fit=crop&w=400&q=80"
          alt="Air runner sneakers"
          className="h-12 w-12 shrink-0 rounded-lg object-cover"
        />

        <div className="min-w-0">
          <p className="truncate text-xs font-bold text-[#2E1065]">
            Air runner sneakers
          </p>
          <p className="text-xs text-[#45415A]">Size 43</p>
          <p className="text-sm font-black text-[#6D28D9]">GH₵ 850</p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs text-[#45415A]">
          <span>Total</span>
          <span className="font-bold text-[#2E1065]">GH₵ 850</span>
        </div>

        <div className="rounded-full bg-[#6D28D9] py-2.5 text-center text-xs font-bold text-white">
          Place order
        </div>
      </div>
    </div>
  );
}

function EarnScreen() {
  return (
    <div className="flex h-full flex-col justify-between">
      <div className="rounded-xl bg-white p-3">
        <div className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-[#EDE9FE] text-[#6D28D9]">
            <Handshake size={17} />
          </span>

          <div>
            <p className="text-xs font-bold text-[#2E1065]">
              Successful connection
            </p>
            <p className="text-[10px] text-[#45415A]">
              You helped a business find a buyer.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-[#2E1065] p-4">
        <p className="text-[10px] font-medium text-white/70">
          Earning opportunity
        </p>

        <p
          className={`${h} mt-1 text-2xl text-white`}
          style={headingStyle}
        >
          Earn together
        </p>

        <p className="mt-2 text-[10px] text-white/70">
          Discover more ways to participate in commerce.
        </p>
      </div>
    </div>
  );
}

const screens = [DiscoverScreen, ConnectScreen, BuyScreen, EarnScreen];

/* -------------------------------------------------------------------------- */
/* PAGE                                                                        */
/* -------------------------------------------------------------------------- */

export default function AboutPage() {
  const [activeIndex, setActiveIndex] = useState(0);

  const rootRef = useRef<HTMLElement>(null);
  const howRef = useRef<HTMLElement>(null);

  const current = audiences[activeIndex];
  const CurrentIcon = current.icon;

  const darkCard = activeIndex % 2 === 0;

  const prev = () =>
    setActiveIndex((i) => (i - 1 + audiences.length) % audiences.length);

  const next = () =>
    setActiveIndex((i) => (i + 1) % audiences.length);

  const focus =
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D28D9] focus-visible:ring-offset-2';

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
      const max = document.documentElement.scrollHeight - window.innerHeight;

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

  const primaryBtn = `group inline-flex items-center justify-center gap-2 rounded-full bg-[#6D28D9] px-6 py-3 text-sm font-bold text-white transition duration-200 hover:scale-[1.03] hover:bg-[#8B5CF6] sm:px-7 sm:py-3.5 sm:text-base ${focus}`;

  return (
    <main
      ref={rootRef}
      className={`${body.className} min-h-screen overflow-x-clip bg-white text-[#2E1065]`}
    >
      <style>{`
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
          from { clip-path: inset(0 0 100% 0 round 2rem); }
          to { clip-path: inset(0 0 0 0 round 2rem); }
        }

        .about-hero-word {
          animation: k-rise 1s cubic-bezier(0.22, 1, 0.36, 1) both;
          font-size: inherit !important;
          line-height: 0.92 !important;
        }

        .k-fade { animation: k-fade 0.7s cubic-bezier(0.22, 1, 0.36, 1) both; }
        .k-pop { animation: k-pop 0.9s cubic-bezier(0.22, 1, 0.36, 1) both; }
        .k-img { animation: k-img 1.6s cubic-bezier(0.22, 1, 0.36, 1) both; }
        .k-wipe { animation: k-wipe 1.2s cubic-bezier(0.22, 1, 0.36, 1) both; }

        @media (prefers-reduced-motion: reduce) {
          .about-hero-word, .k-fade, .k-pop, .k-img, .k-wipe {
            animation: none !important;
          }
        }
      `}</style>

      {/* PAGE SCROLL PROGRESS */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px]"
      >
        <div
          className="h-full origin-left bg-[#6D28D9]"
          style={{ transform: 'scaleX(var(--progress, 0))' }}
        />
      </div>

      <SiteHeader />

      {/* ================= HERO ================= */}
      <section className="relative pt-[100px] sm:pt-[110px]">
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 pb-16 pt-12 sm:gap-14 sm:px-8 sm:pb-20 sm:pt-16 lg:grid-cols-[1.2fr_.8fr] lg:px-12 lg:pb-24 lg:pt-20">
          <div
            className="relative z-10"
            style={{
              transform: 'translate3d(0, calc(var(--scroll, 0) * 0.1px), 0)',
            }}
          >
            <h1
              className="w-full text-left text-[#2E1065]"
              style={{
                fontFamily:
                  '"Lufga", "Inter", "Segoe UI", Roboto, Arial, sans-serif',
                fontSize: 'clamp(2.5rem, 7vw, 5rem)',
                fontWeight: 900,
                lineHeight: 0.94,
                letterSpacing: '-0.04em',
                textTransform: 'none',
                margin: 0,
              }}
            >
              {['Buy.', 'Sell.', 'Connect.', 'Earn.'].map((word, i) => (
                <span
                  key={word}
                  className="about-hero-word"
                  style={{
                    display: 'block',
                    fontSize: 'inherit',
                    lineHeight: 0.94,
                    animationDelay: `${i * 120}ms`,
                  }}
                >
                  {word}
                </span>
              ))}
            </h1>

            <p
              className="k-fade mt-5 max-w-xl text-sm font-medium leading-6 text-[#45415A] sm:mt-6 sm:text-base sm:leading-7"
              style={{ animationDelay: '450ms' }}
            >
              One connected commerce ecosystem. Discover products, connect with
              sellers and turn meaningful connections into opportunities.
            </p>

            <div className="k-fade mt-7" style={{ animationDelay: '580ms' }}>
              <Link href="#how-it-works" className={primaryBtn}>
                See how it works
                <ArrowRight
                  size={18}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            </div>
          </div>

          {/* HERO VISUAL */}
          <div
            className="relative mx-auto w-full max-w-md lg:ml-auto"
            style={{
              transform: 'translate3d(0, calc(var(--scroll, 0) * -0.04px), 0)',
            }}
          >
            <div
              className="k-wipe relative overflow-hidden rounded-[2rem] bg-[#2E1065] p-2.5 sm:p-3"
              style={{ animationDelay: '150ms' }}
            >
              <div className="relative overflow-hidden rounded-[1.6rem]">
                <img
                  src="/s.jpg"
                  alt="A shopper discovering products from a local business"
                  className="k-img h-[340px] w-full object-cover sm:h-[440px]"
                  style={{ animationDelay: '150ms' }}
                />
              </div>
            </div>

            {/* PRODUCT CARD */}
            <div
              className="absolute -left-2 top-8 w-44 sm:-left-8 sm:w-52"
              style={{
                transform:
                  'translate3d(0, calc(var(--scroll, 0) * -0.1px), 0)',
              }}
            >
              <div
                className="k-pop rounded-2xl bg-[#6D28D9] p-2.5 text-white sm:rounded-3xl sm:p-3"
                style={{ animationDelay: '800ms' }}
              >
                <img
                  src="https://images.unsplash.com/photo-1543508282-6319a3e2621f?auto=format&fit=crop&w=800&q=80"
                  alt="Air runner sneakers"
                  className="h-20 w-full rounded-xl object-cover sm:h-24"
                />

                <p className="mt-2 text-xs font-extrabold sm:mt-3 sm:text-sm">
                  Air runner sneakers
                </p>

                <div className="mt-1 flex items-center justify-between">
                  <span className="text-xs font-black sm:text-sm">
                    GH₵ 850
                  </span>

                  <span className="flex items-center gap-1 text-[10px] font-semibold sm:text-xs">
                    <span className="h-2 w-2 rounded-full bg-white" />
                    Verified seller
                  </span>
                </div>
              </div>
            </div>

            {/* CHAT BUBBLE */}
            <div
              className="absolute -bottom-5 right-2 max-w-[230px] sm:-right-5 sm:max-w-[250px]"
              style={{
                transform:
                  'translate3d(0, calc(var(--scroll, 0) * 0.06px), 0)',
              }}
            >
              <div
                className="k-pop flex items-start gap-2.5 rounded-2xl bg-[#2E1065] p-3 sm:gap-3 sm:rounded-3xl sm:p-4"
                style={{ animationDelay: '1000ms' }}
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#6D28D9] text-white sm:h-10 sm:w-10">
                  <MessageCircle size={18} />
                </span>

                <div>
                  <p className="text-xs font-extrabold text-white sm:text-sm">
                    Connect before you buy
                  </p>

                  <p className="mt-1 text-[11px] font-medium leading-4 text-white/80 sm:text-xs sm:leading-5">
                    &quot;Yes, it&apos;s in stock. I can send it today.&quot;
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= MISSION & VISION ================= */}
      <section id="our-story" className="scroll-mt-20 bg-white pb-16 sm:pb-24">
        <div className="mx-auto grid max-w-7xl gap-5 px-5 sm:px-8 lg:grid-cols-2 lg:px-12">
          <Reveal x={-40} y={0} as="article">
            <div className="flex h-full min-h-[19rem] flex-col justify-between rounded-[1.8rem] bg-[#2E1065] p-6 sm:min-h-[20rem] sm:p-8">
              <p className="text-2xl font-extrabold leading-[1.25] text-white sm:text-3xl">
                To make buying, selling and earning more accessible by
                connecting people, businesses and opportunities.
              </p>

              <span className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-[#6D28D9] px-4 py-2.5 text-sm font-bold text-white">
                <Target size={16} />
                Our mission
              </span>
            </div>
          </Reveal>

          <Reveal x={40} y={0} delay={150} as="article">
            <div className="flex h-full min-h-[19rem] flex-col justify-between rounded-[1.8rem] bg-[#EDE9FE] p-6 sm:min-h-[20rem] sm:p-8">
              <p className="text-2xl font-extrabold leading-[1.25] text-[#2E1065] sm:text-3xl">
                A world where everyone can take part in commerce and earn from
                the value they create.
              </p>

              <span className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-[#2E1065] px-4 py-2.5 text-sm font-bold text-white">
                <Eye size={16} />
                Our vision
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ================= FIXING HOW THE WORLD SHOPS ================= */}
      <section className="relative isolate overflow-hidden bg-[#2E1065] py-20 text-white sm:py-28">
        <img
          src={LOKI_SECTION_IMAGE}
          alt=""
          aria-hidden
          className="absolute inset-0 -z-20 h-full w-full object-cover"
        />

        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[#2E1065]/90"
        />

        <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-4xl">
              <Reveal>
                <span className="inline-flex items-center gap-2 rounded-full bg-[#6D28D9] px-4 py-2.5 text-sm font-bold text-white">
                  <Sparkles size={16} />
                  Powered by Loki, our custom AI
                </span>
              </Reveal>

              <Reveal delay={100}>
                <h2
                  className={`${h} mt-6 text-white`}
                  style={{
                    ...headingStyle,
                    fontSize: 'clamp(2rem, 4.5vw, 3.75rem)',
                  }}
                >
                  We are fixing how the world shops.
                </h2>
              </Reveal>

              <Reveal delay={200}>
                <p className="mt-5 max-w-2xl text-base font-medium leading-7 text-white/85 sm:text-lg sm:leading-8">
                  Online shopping should feel real, simple and safe. That is
                  what we are building.
                </p>
              </Reveal>
            </div>

            <Reveal x={48} y={0} delay={300}>
              <div className="flex max-w-[300px] items-start gap-3 rounded-2xl bg-white p-4 text-[#2E1065]">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#EDE9FE] text-[#6D28D9]">
                  <ShieldCheck size={21} />
                </span>

                <div>
                  <p className="text-sm font-extrabold">Checked by Loki</p>
                  <p className="mt-1 text-xs font-medium leading-5 text-[#45415A]">
                    Listing verified. No fraud signals found.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>

          <ul className="mt-12 grid gap-5 md:grid-cols-3 sm:mt-14">
            {fixes.map(
              ({ icon: Icon, title, description, card, iconBox }, i) => (
                <Reveal as="li" key={title} delay={i * 130} y={40}>
                  <div
                    className={`h-full rounded-[1.8rem] p-6 transition-transform duration-300 hover:-translate-y-1 sm:p-7 ${card}`}
                  >
                    <span
                      className={`grid h-12 w-12 place-items-center rounded-full ${iconBox}`}
                    >
                      <Icon size={23} />
                    </span>

                    <h3
                      className={`${h} mt-5 text-xl sm:text-2xl`}
                      style={headingStyle}
                    >
                      {title}
                    </h3>

                    <p className="mt-3 text-sm font-medium leading-6 opacity-85 sm:text-base sm:leading-7">
                      {description}
                    </p>
                  </div>
                </Reveal>
              )
            )}
          </ul>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section
        id="how-it-works"
        ref={howRef}
        className="scroll-mt-20 bg-white py-16 sm:py-24"
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <Reveal>
            <h2
              className={`${h} max-w-3xl text-[#2E1065]`}
              style={{
                ...headingStyle,
                fontSize: 'clamp(2rem, 4.5vw, 3.75rem)',
              }}
            >
              How Koombo works
            </h2>
          </Reveal>

          <ol className="relative mt-12 grid gap-10 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4 lg:gap-7">
            <div
              aria-hidden
              className="absolute left-[12%] right-[12%] top-5 hidden lg:block"
            >
              <div className="border-t-4 border-[#EDE9FE]" />
              <div
                className="absolute inset-x-0 top-0 h-1 origin-left bg-[#6D28D9]"
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
                  y={45}
                  className="relative text-center"
                >
                  <span className="relative z-10 mx-auto grid h-9 w-9 place-items-center rounded-full bg-[#6D28D9] text-sm font-black text-white ring-8 ring-white">
                    {i + 1}
                  </span>

                  <div className="mt-7">
                    <Phone>
                      <Screen />
                    </Phone>
                  </div>

                  <h3
                    className={`${h} mt-7 text-xl text-[#2E1065] sm:text-2xl`}
                    style={headingStyle}
                  >
                    {step.title}
                  </h3>

                  <p className="mx-auto mt-2.5 max-w-[18rem] text-sm font-medium leading-6 text-[#45415A] sm:text-base sm:leading-7">
                    {step.description}
                  </p>
                </Reveal>
              );
            })}
          </ol>
        </div>
      </section>

      {/* ================= WHO KOOMBO IS FOR ================= */}
      <section className="bg-[#F5F3FF] py-16 sm:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 sm:px-8 lg:grid-cols-[1fr_1fr] lg:gap-14 lg:px-12">
          <div>
            <Reveal>
              <h2
                className={`${h} text-[#2E1065]`}
                style={{
                  ...headingStyle,
                  fontSize: 'clamp(2rem, 4.5vw, 3.5rem)',
                }}
              >
                One ecosystem. Different opportunities.
              </h2>
            </Reveal>

            <Reveal delay={100} className="mt-8">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={prev}
                  aria-label="Previous audience"
                  className={`grid h-12 w-12 place-items-center rounded-full bg-[#6D28D9] text-white transition duration-200 hover:scale-105 hover:bg-[#8B5CF6] sm:h-14 sm:w-14 ${focus}`}
                >
                  <ArrowLeft size={22} />
                </button>

                <button
                  type="button"
                  onClick={next}
                  aria-label="Next audience"
                  className={`grid h-12 w-12 place-items-center rounded-full bg-[#6D28D9] text-white transition duration-200 hover:scale-105 hover:bg-[#8B5CF6] sm:h-14 sm:w-14 ${focus}`}
                >
                  <ArrowRight size={22} />
                </button>
              </div>
            </Reveal>

            <Reveal delay={150} className="mt-7 block max-w-full">
              <div
                role="tablist"
                aria-label="Who Koombo is for"
                className="flex max-w-full flex-wrap gap-2"
              >
                {audiences.map(({ id, label, icon: Icon }, i) => {
                  const selected = i === activeIndex;

                  return (
                    <button
                      key={id}
                      role="tab"
                      type="button"
                      aria-selected={selected}
                      onClick={() => setActiveIndex(i)}
                      className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-bold transition ${focus} ${
                        selected
                          ? 'bg-[#2E1065] text-white'
                          : 'bg-white text-[#2E1065] hover:bg-[#EDE9FE]'
                      }`}
                    >
                      <Icon size={16} />
                      {label}
                    </button>
                  );
                })}
              </div>
            </Reveal>
          </div>

          <Reveal delay={150} y={40}>
            <div
              role="tabpanel"
              key={current.id}
              className={`k-fade flex min-h-[24rem] flex-col justify-between rounded-[1.8rem] p-6 sm:min-h-[26rem] sm:p-8 ${
                darkCard
                  ? 'bg-[#2E1065] text-white'
                  : 'bg-[#EDE9FE] text-[#2E1065]'
              }`}
            >
              <div>
                <span
                  className={`grid h-14 w-14 place-items-center rounded-full ${
                    darkCard
                      ? 'bg-[#6D28D9] text-white'
                      : 'bg-[#2E1065] text-white'
                  }`}
                >
                  <CurrentIcon size={25} />
                </span>

                <h3
                  className={`${h} mt-6`}
                  style={{
                    ...headingStyle,
                    fontSize: 'clamp(1.75rem, 3vw, 2.75rem)',
                  }}
                >
                  {current.headline}
                </h3>

                <p className="mt-4 max-w-md text-base font-semibold leading-7 sm:text-lg sm:leading-8">
                  {current.body}
                </p>
              </div>

              <Link
                href={current.href}
                className={`group mt-8 inline-flex w-fit items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition duration-200 hover:scale-[1.03] sm:px-6 sm:py-3 sm:text-base ${focus} ${
                  darkCard
                    ? 'bg-[#6D28D9] text-white hover:bg-[#8B5CF6]'
                    : 'bg-[#2E1065] text-white'
                }`}
              >
                {current.cta}
                <ArrowRight
                  size={17}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ================= CLOSING CTA ================= */}
      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <Reveal y={50} scale={0.97}>
            <div className="rounded-[2rem] bg-[#2E1065] px-6 py-12 sm:px-12 sm:py-16 lg:px-14">
              <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
                <h2
                  className={`${h} max-w-3xl text-white`}
                  style={{
                    ...headingStyle,
                    fontSize: 'clamp(2rem, 5vw, 4rem)',
                  }}
                >
                  One connection. More opportunities.
                </h2>

                <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                  <Link href="/" className={primaryBtn}>
                    Start exploring
                    <ArrowRight
                      size={18}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </Link>

                  <Link
                    href="/lister/connectors"
                    className={`inline-flex items-center justify-center gap-2 rounded-full border-2 border-white px-6 py-3 text-sm font-bold text-white transition duration-200 hover:bg-white hover:text-[#2E1065] sm:px-7 sm:py-3.5 sm:text-base ${focus}`}
                  >
                    Join the community
                    <Users size={18} />
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
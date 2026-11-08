'use client';

import { useState, useEffect, useRef, ReactNode, TouchEvent as ReactTouchEvent } from 'react';
import Link from 'next/link';
import SiteHeader from './SiteHeader';

const SELLER_SIGNUP_ROUTE = '/lister';

/* =========================================================
   ICONS
========================================================= */

const Menu = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const X = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const Play = () => (
  <svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M8 5v14l11-7z" />
  </svg>
);

const ico = (d: string, def = 22) => ({ size = def }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={d} />
  </svg>
);

const Shield = ico('M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10ZM9 12l2 2 4-4');
const Tv = ico('M3 7h18v12H3zM8 3l4 4 4-4');
const Bag = ico('M6 7h12l1 13H5L6 7ZM9 7a3 3 0 0 1 6 0');
const Home = ico('M3 11l9-8 9 8M5 10v10h5v-6h4v6h5V10');
const Users = ico('M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8ZM22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8');
const Radio = ico('M4.9 19.1a10 10 0 0 1 0-14.2M7.8 16.2a6 6 0 0 1 0-8.4M16.2 7.8a6 6 0 0 1 0 8.4M19.1 4.9a10 10 0 0 1 0 14.2M12 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z');
const Store = ico('M4 9l1-5h14l1 5M4 9v11h16V9M4 9a3 3 0 0 0 5.3 2 3 3 0 0 0 5.4 0A3 3 0 0 0 20 9M10 20v-5h4v5');
const Arrow = ico('M5 12h14M13 6l6 6-6 6', 20);
const Zap = ico('M13 2L3 14h8l-1 8 10-12h-8l1-8Z');
const Wallet = ico('M3 7h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7ZM3 7V6a2 2 0 0 1 2-2h12M16 14h2');

/* =========================================================
   SCROLL REVEAL
========================================================= */

function Reveal({ children, delay = 0, y = 24, className = '' }: { children: ReactNode; delay?: number; y?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
      setShow(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShow(true);
          observer.disconnect();
        }
      },
      { threshold: 0.08 }
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={className} style={{ opacity: show ? 1 : 0, transform: show ? 'none' : `translateY(${y}px)`, transition: 'opacity .8s cubic-bezier(.16,1,.3,1), transform .8s cubic-bezier(.16,1,.3,1)', transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

/* =========================================================
   HERO CONTENT
========================================================= */

type Feature = { I: (props: { size?: number }) => ReactNode; t: string; d: string };

const CONTENT: Record<'sell' | 'shop', { title: ReactNode; sub: string; cta: string; CtaIcon: (props: { size?: number }) => ReactNode; feats: Feature[] }> = {
  sell: {
    title: <>Turn your hustle<br className="hidden sm:block" /> into income.</>,
    sub: 'Show the world what you sell. Connect with customers, grow your audience, and turn your passion into income.',
    cta: 'Start selling',
    CtaIcon: Store,
    feats: [{ I: Zap, t: 'Start fast', d: 'Set up your business' }, { I: Users, t: 'Reach buyers', d: 'Grow your audience' }, { I: Wallet, t: 'Get paid', d: 'MoMo and bank payouts' }],
  },
  shop: {
    title: <>Discover it.<br className="hidden sm:block" /> Love it. Shop it.</>,
    sub: 'Discover amazing products, connect with businesses, and shop directly from the people you love.',
    cta: 'Explore Koombo',
    CtaIcon: Bag,
    feats: [{ I: Shield, t: 'Shop safely', d: 'Buyer protection' }, { I: Tv, t: 'Discover', d: 'Videos and live shops' }, { I: Bag, t: 'Shop easily', d: 'Convenient checkout' }],
  },
};

/* =========================================================
   HERO IMAGE (Figma-style slideshow)
========================================================= */

type Mode = 'sell' | 'shop';

type Slide = {
  src: string;
  alt: string;
  title: string; // shown on the floating card
  meta: string;  // price (shop) or amount (sell)
  note: string;  // small line under the title
};

const SLIDES: Record<Mode, Slide[]> = {
  shop: [
    { src: '/d.jpeg', alt: 'A Koombo storefront featuring products on display', title: 'Seasonal Drop', meta: 'GH₵ 1,150', note: 'Fresh arrivals for the week' },
    { src: '/f.jpg', alt: 'Beauty and cosmetics products displayed together', title: 'Glow Kit', meta: 'GH₵ 260', note: 'Beauty essentials for daily use' },
    { src: '/o.jpeg', alt: 'Lifestyle and fashion products arranged in a bundle', title: 'Style Bundle', meta: 'GH₵ 2,400', note: 'Curated looks for everyday wear' },
    { src: '/only.jpg', alt: 'Creative product photography with a brand-focused aesthetic', title: 'Creator Picks', meta: 'GH₵ 420', note: 'Trending essentials this week' },
  ],
  sell: [
    { src: '/koombo.jpeg', alt: 'A business owner preparing packages for delivery', title: 'Order Dispatched', meta: 'GH₵ 320', note: 'Ready for pickup and delivery' },
    { src: '/june.jpg', alt: 'A vendor managing stock and sales', title: 'Payout Ready', meta: 'GH₵ 1,240', note: 'Transferred to your account' },
    { src: '/connect.jpg', alt: 'A seller connecting with buyers and promoting products', title: 'New Followers', meta: '+12', note: 'Your shop is gaining traction' },
    { src: '/s.jpg', alt: 'A local business opening its shop for customers', title: 'Live Shop Open', meta: '248', note: 'Visitors browsing right now' },
  ],
};

const INTERVAL = 5000;

const Heart = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8Z" />
  </svg>
);

const ShieldCheck = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10ZM9 12l2 2 4-4" />
  </svg>
);

const Bolt = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8Z" />
  </svg>
);

function HeroImage({ mode = 'shop' }: { mode?: Mode }) {
  const slides = SLIDES[mode] ?? SLIDES.shop;
  const [active, setActive] = useState(0);
  const [failed, setFailed] = useState<string[]>([]);
  const [paused, setPaused] = useState(false);
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const touchX = useRef<number | null>(null);
  const reduced = useRef(false);

  const visible = slides.filter((s) => !failed.includes(s.src));
  const count = visible.length;

  useEffect(() => {
    setActive(0);
    setFailed([]);
  }, [mode]);

  useEffect(() => {
    reduced.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  useEffect(() => {
    if (reduced.current || paused || count < 2) return;
    const id = window.setTimeout(() => setActive((a) => (a + 1) % count), INTERVAL);
    return () => window.clearTimeout(id);
  }, [active, paused, count, mode]);

  useEffect(() => {
    if (count > 0 && active >= count) setActive(0);
  }, [active, count]);

  const go = (dir: 1 | -1) => count > 0 && setActive((a) => (a + dir + count) % count);

  const onTouchStart = (e: ReactTouchEvent) => {
    touchX.current = e.touches[0].clientX;
    setPaused(true);
  };
  const onTouchEnd = (e: ReactTouchEvent) => {
    if (touchX.current !== null) {
      const dx = e.changedTouches[0].clientX - touchX.current;
      if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
    }
    touchX.current = null;
    setPaused(false);
  };

  const current = visible[active];

  return (
    <div className="relative mx-auto w-full">
      <style>{`
        @keyframes koomboProgress { from { transform: scaleX(0); } to { transform: scaleX(1); } }
        @keyframes koomboCardIn { from { opacity: 0; transform: translateY(12px) scale(.97); } to { opacity: 1; transform: none; } }
        @keyframes koomboKen { from { transform: scale(1); } to { transform: scale(1.06); } }
        .koombo-progress { transform-origin: left; animation: koomboProgress ${INTERVAL}ms linear forwards; }
        .koombo-progress.is-paused { animation-play-state: paused; }
        .koombo-card-in { animation: koomboCardIn .55s cubic-bezier(.16,1,.3,1) both; }
        .koombo-ken { animation: koomboKen 7s ease-out forwards; }
        @media (prefers-reduced-motion: reduce) {
          .koombo-progress, .koombo-card-in, .koombo-ken { animation: none !important; }
          .koombo-progress { transform: scaleX(1); }
        }
      `}</style>

      {/* STAGE: shorter on phones, cinematic on desktop */}
      <div
        className="relative aspect-[4/3.6] w-full overflow-hidden rounded-[22px] bg-[#2A1250] ring-1 ring-white/20 shadow-[0_30px_80px_-20px_rgba(20,8,50,0.6)] min-[480px]:aspect-[4/3.3] sm:aspect-[16/9] sm:rounded-[32px] lg:aspect-[16/8] lg:rounded-[36px]"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        role="group"
        aria-roledescription="carousel"
        aria-label={mode === 'shop' ? 'Featured products' : 'Seller highlights'}
      >
        {/* Images */}
        {count > 0 ? (
          visible.map((s, i) => (
            <div key={s.src} className={`absolute inset-0 transition-opacity duration-700 ${i === active ? 'z-10 opacity-100' : 'z-0 opacity-0'}`} aria-hidden={i !== active}>
              <img
                src={s.src}
                alt={i === active ? s.alt : ''}
                draggable={false}
                onError={() => setFailed((p) => (p.includes(s.src) ? p : [...p, s.src]))}
                className={`h-full w-full select-none object-cover ${i === active ? 'koombo-ken' : ''}`}
              />
            </div>
          ))
        ) : (
          <div className="flex h-full items-center justify-center px-6 text-center text-white/90">
            <p className="text-sm font-medium sm:text-base">Discover amazing businesses and products on Koombo.</p>
          </div>
        )}

        {/* Legibility gradient */}
        <div className="pointer-events-none absolute inset-0 z-20 bg-[linear-gradient(180deg,rgba(20,8,50,0.28)_0%,transparent_28%,transparent_52%,rgba(20,8,50,0.72)_100%)]" />

        {/* Top-left status chip */}
        <div className="absolute left-3 top-3 z-30 sm:left-6 sm:top-6">
          <div className="flex items-center gap-2 rounded-full border border-white/40 bg-white/80 py-1.5 pl-2 pr-3.5 text-[12px] font-semibold text-[#24133F] shadow-lg backdrop-blur-xl sm:text-sm">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#4C1D95] text-white">
              {mode === 'shop' ? <ShieldCheck /> : <Bolt />}
            </span>
            {mode === 'shop' ? 'Buyer protection' : 'Set up in minutes'}
          </div>
        </div>

        {/* Top-right counter */}
        {count > 1 && (
          <div className="absolute right-3 top-3 z-30 rounded-full border border-white/30 bg-black/25 px-3 py-1.5 text-xs font-semibold tabular-nums text-white backdrop-blur-xl sm:right-6 sm:top-6 sm:text-sm">
            {active + 1} / {count}
          </div>
        )}

        {/* Floating UI card */}
        {current && (
          <div
            key={`${mode}-${current.src}`}
            className="koombo-card-in absolute bottom-[60px] left-3 right-3 z-30 sm:bottom-6 sm:left-6 sm:right-auto sm:w-[340px]"
          >
            <div className="flex items-center gap-3 rounded-2xl border border-white/50 bg-white/85 p-2.5 shadow-[0_18px_40px_-12px_rgba(20,8,50,0.5)] backdrop-blur-2xl sm:gap-4 sm:rounded-[22px] sm:p-3.5">
              <img src={current.src} alt="" draggable={false} className="h-12 w-12 shrink-0 rounded-xl object-cover sm:h-16 sm:w-16" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-[#24133F] sm:text-base">{current.title}</p>
                <p className="truncate text-xs text-[#5B5670] sm:text-sm">{current.note}</p>
                <p className="mt-0.5 text-sm font-extrabold text-[#4C1D95] sm:text-base">{current.meta}</p>
              </div>
              {mode === 'shop' ? (
                <button
                  type="button"
                  onClick={() => setLiked((l) => ({ ...l, [current.src]: !l[current.src] }))}
                  aria-pressed={!!liked[current.src]}
                  aria-label={liked[current.src] ? 'Remove from saved' : 'Save product'}
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4C1D95] ${liked[current.src] ? 'border-[#4C1D95] bg-[#4C1D95] text-white' : 'border-[#E4DFF0] bg-white text-[#4C1D95] hover:bg-[#F3EEFB]'}`}
                >
                  <Heart />
                </button>
              ) : (
                <span className="flex h-10 shrink-0 items-center rounded-full bg-[#EDE5FA] px-3 text-xs font-bold text-[#4C1D95]">Live</span>
              )}
            </div>
          </div>
        )}

        {/* Thumbnail rail with progress */}
        {count > 1 && (
          <div className="absolute inset-x-3 bottom-3 z-30 flex justify-center sm:inset-x-auto sm:bottom-6 sm:right-6">
            <div className="flex items-center gap-2 rounded-2xl border border-white/30 bg-black/25 p-1.5 backdrop-blur-xl">
              {visible.map((s, i) => (
                <button
                  key={s.src}
                  type="button"
                  onClick={() => setActive(i)}
                  aria-label={`Show slide ${i + 1}: ${s.title}`}
                  aria-current={i === active}
                  className={`relative h-10 w-14 overflow-hidden rounded-xl transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:h-12 sm:w-16 ${i === active ? 'ring-2 ring-white' : 'opacity-70 hover:opacity-100'}`}
                >
                  <img src={s.src} alt="" draggable={false} className="h-full w-full object-cover" />
                  {i === active && (
                    <span className="absolute inset-x-0 bottom-0 h-1 bg-white/30">
                      <span key={`${mode}-${active}`} className={`koombo-progress block h-full w-full bg-white ${paused ? 'is-paused' : ''}`} />
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Desktop prev/next */}
        {count > 1 && (
          <>
            <button type="button" onClick={() => go(-1)} aria-label="Previous slide" className="absolute left-4 top-1/2 z-30 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-white/80 text-[#24133F] shadow-lg backdrop-blur-xl transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white lg:flex">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6" /></svg>
            </button>
            <button type="button" onClick={() => go(1)} aria-label="Next slide" className="absolute right-4 top-1/2 z-30 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-white/80 text-[#24133F] shadow-lg backdrop-blur-xl transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white lg:flex">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 18l6-6-6-6" /></svg>
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   MAIN KOOMBO HERO
========================================================= */

export default function KoomboHero({ onSignIn, onSignUp, onSearch, onExplore, onSubmitAddress }: { onSignIn?: () => void; onSignUp?: () => void; onSearch?: () => void; onExplore?: () => void; onSubmitAddress?: (address: string) => void }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeNav, setActiveNav] = useState('Home');
  const [mode, setMode] = useState<'sell' | 'shop'>('shop');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const navLinks = [
    { name: 'Home', href: '/', I: Home },
    { name: 'About', href: '/about', I: Users },
    { name: 'Connector', href: '/lister/connectors', I: Radio },
    { name: 'Contact Us', href: '/contact', I: Store },
  ];

  const content = CONTENT[mode];

  return (
    <section className="relative min-h-screen w-full overflow-x-clip bg-[#F7F7F5] text-[#101820]">
      <style>{`
        html { scroll-behavior: smooth; scroll-padding-top: 100px; }
        .koombo-nav-link { position: relative; display: inline-flex; align-items: center; gap: 8px; padding: 5px 0; color: #101820; transition: color .25s ease; }
        .koombo-nav-link::after { position: absolute; bottom: -3px; left: 0; width: 0; height: 2px; border-radius: 2px; background: #6D28D9; content: ''; transition: width .3s ease; }
        .koombo-nav-link:hover, .koombo-nav-link.active { color: #6D28D9; }
        .koombo-nav-link:hover::after, .koombo-nav-link.active::after { width: 100%; }
        .koombo-cta { transition: transform .25s ease, background-color .25s ease; }
        .koombo-cta:hover { transform: translateY(-2px); }
        .koombo-mobile-overlay { animation: koomboFade .2s ease both; }
        .koombo-mobile-panel { animation: koomboSlide .3s cubic-bezier(.16,1,.3,1) both; }
        @keyframes koomboFade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes koomboSlide { from { opacity: 0; transform: translateX(100%); } to { opacity: 1; transform: translateX(0); } }
        @media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } *, *::before, *::after { animation-duration: .01ms !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; } }
      `}</style>

      <SiteHeader />

      {/* MOBILE NAVIGATION */}
      {mobileMenuOpen && <div className="koombo-mobile-overlay fixed inset-0 z-[60] bg-black/45 backdrop-blur-sm lg:hidden" onClick={() => setMobileMenuOpen(false)} />}
      {mobileMenuOpen && (
        <aside className="koombo-mobile-panel fixed right-0 top-0 z-[70] h-[100dvh] w-[86%] max-w-sm overflow-y-auto border-l border-[#E5E7EB] bg-white text-[#101820] shadow-2xl lg:hidden">
          <div className="flex items-center justify-between border-b border-[#E5E7EB] px-5 py-4">
            <Link href="/" onClick={() => setMobileMenuOpen(false)} aria-label="Koombo home"><img src="/logo.png" alt="Koombo" className="h-14 w-auto" /></Link>
            <button type="button" onClick={() => setMobileMenuOpen(false)} className="rounded-xl p-2 transition-colors hover:bg-[#F0F5F8]" aria-label="Close menu"><X /></button>
          </div>
          <div className="px-5 py-7">
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link key={link.name} href={link.href} onClick={() => { setActiveNav(link.name); setMobileMenuOpen(false); }} className={`flex items-center gap-3 rounded-xl px-4 py-3.5 text-base font-medium transition-colors ${activeNav === link.name ? 'bg-[#EAF6FE] text-[#168BD0]' : 'text-[#101820] hover:bg-[#F5F7F8]'}`}>
                  <link.I size={21} /> {link.name}
                </Link>
              ))}
            </nav>
            <div className="mt-7 flex flex-col gap-3 border-t border-[#E5E7EB] pt-6">
              <Link href={SELLER_SIGNUP_ROUTE} onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 rounded-xl px-4 py-3 text-base font-semibold transition-colors hover:bg-[#F5F7F8]"><Store size={22} /> Become a Vendor</Link>
              <Link href="/watch-demo" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-center gap-2 rounded-xl bg-[#4C1D95] px-5 py-4 text-base font-bold text-white transition-colors hover:bg-[#5B21B6]"><Play /> Watch a Demo</Link>
            </div>
          </div>
        </aside>
      )}

      {/* HERO BODY */}
      <main id="home" className="px-2 pb-4 pt-[104px] sm:px-4 sm:pb-8 sm:pt-[118px] lg:pt-[122px]">
        <section className="mx-auto max-w-[1440px] overflow-hidden rounded-[20px] bg-[#4C1D95] px-2 pb-1 pt-5 sm:rounded-[28px] sm:px-8 sm:pb-7 sm:pt-10 lg:px-12 lg:pb-8 lg:pt-12">

          {/* Shop / Sell toggle */}
          <Reveal>
            <div className="mx-auto flex w-fit items-center rounded-full bg-[#3B1675] p-1">
              {(['shop', 'sell'] as const).map((item) => {
                const Icon = item === 'shop' ? Bag : Store;
                return (
                  <button key={item} type="button" onClick={() => setMode(item)} aria-pressed={mode === item} className={`inline-flex items-center gap-2 rounded-full px-5 py-1.5 text-sm font-semibold capitalize transition-all duration-200 sm:px-7 sm:py-2.5 sm:text-base ${mode === item ? 'bg-white text-[#24133F] shadow-sm' : 'text-white hover:bg-white/10'}`}>
                    <Icon size={18} /> {item}
                  </button>
                );
              })}
            </div>
          </Reveal>

          {/* Headline */}
          <Reveal delay={100} className="flex justify-center">
            <h1 className="kb-hero-title mt-4 w-full max-w-4xl px-2 text-center text-white sm:mt-7 sm:px-0">{content.title}</h1>
          </Reveal>

          {/* Description */}
          <Reveal delay={180}>
            <p className="kb-body-copy mx-auto mt-3 max-w-[620px] px-2 text-center text-[#D1D5DB] sm:mt-5 sm:px-0">{content.sub}</p>
          </Reveal>

          {/* CTA */}
          <Reveal delay={260}>
            <div className="mt-4 flex justify-center sm:mt-7">
              <a href={mode === 'sell' ? '/lister' : '#vendors'} onClick={() => { if (mode === 'shop') onExplore?.(); }} className="koombo-cta group inline-flex items-center justify-center gap-3 rounded-full bg-[#24133F] px-6 py-3 text-sm font-bold text-white hover:bg-[#3B1C66] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#24133F] sm:px-9 sm:py-4 sm:text-base">
                <content.CtaIcon size={21} /> {content.cta}
                <span className="transition-transform duration-200 group-hover:translate-x-1"><Arrow size={20} /></span>
              </a>
            </div>
          </Reveal>

          {/* Main image: full width on phones */}
          <Reveal delay={350} y={25}>
            <div className="mt-4 sm:mt-8 lg:mt-10">
              <HeroImage mode={mode} />
            </div>
          </Reveal>

          {/* Supporting text */}
          <Reveal delay={450}>
            <p className="px-2 py-3 text-center text-xs font-medium tracking-wide text-[#D1D5DB]/80 sm:py-0 sm:pt-6 sm:text-sm">
              {mode === 'shop' ? 'Discover businesses. Connect with people. Shop with confidence.' : 'Your business. Your audience. Your opportunity.'}
            </p>
          </Reveal>
        </section>
      </main>
    </section>
  );
}
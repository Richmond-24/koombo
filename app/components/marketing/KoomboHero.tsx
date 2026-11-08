'use client';

import {
  useState,
  useEffect,
  useRef,
  ReactNode,
} from 'react';
import Link from 'next/link';

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
const Heart = ico('M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8Z', 18);
const Check = ico('M20 6L9 17l-5-5', 18);

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
   HERO IMAGE SLIDESHOW
========================================================= */

const HERO_IMAGES: Record<'sell' | 'shop', { src: string; alt: string }[]> = {
  shop: [
    { src: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1600&q=85', alt: 'Shop a red Nike sneaker' },
    { src: 'https://images.unsplash.com/photo-1739065883242-92659253f7a6?auto=format&fit=crop&w=1600&q=85', alt: 'Browse packaged snacks at a local shop' },
    { src: 'https://images.unsplash.com/photo-1735117535747-aec41bf7d0e4?auto=format&fit=crop&w=1600&q=85', alt: 'See branded Adidas streetwear in Accra, Ghana' },
    { src: 'https://images.unsplash.com/photo-1747561502595-871265f5503b?auto=format&fit=crop&w=1600&q=85', alt: 'Shop a football jersey' },
  ],
  sell: [
    { src: 'https://images.unsplash.com/photo-1687422808311-a776f467a468?auto=format&fit=crop&w=1600&q=85', alt: 'African businesswoman working at her small shop in Tanzania' },
    { src: 'https://images.unsplash.com/photo-1761370571806-886404629697?auto=format&fit=crop&w=1600&q=85', alt: 'African shopkeeper standing in his local store in Abuja, Nigeria' },
    { src: 'https://images.unsplash.com/photo-1744807511668-d5baff5264f6?auto=format&fit=crop&w=1600&q=85', alt: 'African woman working at an outdoor storefront in Accra, Ghana' },
    { src: 'https://images.unsplash.com/photo-1687422809654-579d81c29d32?auto=format&fit=crop&w=1600&q=85', alt: 'African street vendor running a local produce stand in Tanzania' },
  ],
};

function HeroImage({ mode }: { mode: 'sell' | 'shop' }) {
  const images = HERO_IMAGES[mode];
  const [activeImage, setActiveImage] = useState(0);
  const [failedImages, setFailedImages] = useState<string[]>([]);

  useEffect(() => {
    setActiveImage(0);
    setFailedImages([]);
  }, [mode]);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const interval = window.setInterval(() => setActiveImage((current) => (current + 1) % images.length), 5000);
    return () => window.clearInterval(interval);
  }, [images.length, mode]);

  const visibleImages = images.filter((image) => !failedImages.includes(image.src));

  useEffect(() => {
    if (visibleImages.length === 0) return;
    if (activeImage >= visibleImages.length) setActiveImage(0);
  }, [activeImage, visibleImages.length]);

  return (
    <div className="relative mx-auto w-full max-w-[1200px]">
      <div className="koombo-photo-shell relative aspect-[16/9] overflow-hidden rounded-[22px] bg-[#D8EAF5] shadow-[0_30px_80px_rgba(64,33,120,0.22)] sm:aspect-[16/8] sm:rounded-[30px]">
        {visibleImages.length > 0 ? (
          visibleImages.map((image, index) => (
            <div
              key={image.src}
              className={`koombo-photo-card absolute inset-0 transition-all duration-1000 ${activeImage === index ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
            >
              <img
                src={image.src}
                alt={index === activeImage ? image.alt : ''}
                draggable={false}
                onError={() => setFailedImages((previous) => previous.includes(image.src) ? previous : [...previous, image.src])}
                className="h-full w-full select-none object-cover"
              />
            </div>
          ))
        ) : (
          <div className="flex h-full items-center justify-center bg-[#D8EAF5] px-6 text-center text-[#163A52]">
            <p className="text-sm font-medium sm:text-base">Discover amazing businesses and products on Koombo.</p>
          </div>
        )}

        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.42),transparent_28%),linear-gradient(180deg,rgba(23,17,48,0.04),rgba(23,17,48,0.18))]" />

        {visibleImages.length > 1 && (
          <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/30 bg-black/15 px-3 py-2 backdrop-blur-md">
            {visibleImages.map((image, index) => (
              <button key={image.src} type="button" onClick={() => setActiveImage(index)} aria-label={`Show image ${index + 1}`} aria-pressed={activeImage === index} className={`h-2 rounded-full transition-all duration-300 ${activeImage === index ? 'w-8 bg-white shadow-[0_0_0_4px_rgba(255,255,255,0.14)]' : 'w-2 bg-white/65 hover:bg-white'}`} />
            ))}
          </div>
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
    <section className="relative min-h-screen w-full overflow-x-clip bg-[#F7F7F5] text-[#101820]" style={{ fontFamily: "'DM Sans', 'Inter', system-ui, sans-serif" }}>
      <style>{`
        html { scroll-behavior: smooth; scroll-padding-top: 120px; }
        .koombo-nav-link { position: relative; display: inline-flex; align-items: center; gap: 8px; padding: 5px 0; color: #101820; transition: color .25s ease; }
        .koombo-nav-link::after { position: absolute; bottom: -3px; left: 0; width: 0; height: 2px; border-radius: 2px; background: #6D28D9; content: ''; transition: width .3s ease; }
        .koombo-nav-link:hover, .koombo-nav-link.active { color: #6D28D9; }
        .koombo-nav-link:hover::after, .koombo-nav-link.active::after { width: 100%; }
        .koombo-cta { transition: transform .25s ease, background-color .25s ease; }
        .koombo-cta:hover { transform: translateY(-2px); }
        .koombo-photo-shell { position: relative; transform: perspective(1400px) rotateX(0.6deg) rotateY(-0.8deg); }
        .koombo-photo-card { inset: 0; overflow: hidden; border-radius: inherit; animation: koomboFloat 9s ease-in-out infinite; }
        .koombo-photo-card img { display: block; width: 100%; height: 100%; object-fit: cover; transform: scale(1.02); }
        .koombo-mobile-overlay { animation: koomboFade .2s ease both; }
        .koombo-mobile-panel { animation: koomboSlide .3s cubic-bezier(.16,1,.3,1) both; }
        @keyframes koomboFade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes koomboSlide { from { opacity: 0; transform: translateX(100%); } to { opacity: 1; transform: translateX(0); } }
        @keyframes koomboFloat { 0%, 100% { transform: translateY(0) scale(1); } 50% { transform: translateY(-10px) scale(1.02); } }
        @media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } *, *::before, *::after { animation-duration: .01ms !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; } }
      `}</style>

      {/* HEADER */}
      <header className={`fixed inset-x-0 top-0 z-50 px-3 transition-all duration-300 sm:px-6 lg:px-10 ${scrolled ? 'pt-2' : 'pt-3 sm:pt-4'}`}>
        <div className={`mx-auto max-w-[1400px] rounded-2xl border border-[#E5E7EB] bg-white/90 backdrop-blur-md transition-shadow duration-300 ${scrolled ? 'shadow-[0_5px_25px_rgba(0,0,0,0.08)]' : 'shadow-sm'}`}>
          <div className="flex items-center justify-between gap-4 px-4 py-2.5 sm:px-6 lg:px-8 lg:py-3">
            <div className="flex min-w-0 items-center gap-6 xl:gap-12">
              <Link href="/" className="flex shrink-0 items-center" aria-label="Koombo home" onClick={() => setActiveNav('Home')}>
                <img src="/logo.png" alt="Koombo" className="h-9 w-auto object-contain sm:h-11 lg:h-12" style={{ filter: 'brightness(0) saturate(100%) invert(15%) sepia(78%) saturate(3574%) hue-rotate(256deg) brightness(83%) contrast(102%)' }} />
              </Link>
              <nav className="hidden items-center gap-6 lg:flex xl:gap-9">
                {navLinks.map((link) => (
                  <Link key={link.name} href={link.href} onClick={() => setActiveNav(link.name)} className={`koombo-nav-link text-sm font-medium xl:text-base ${activeNav === link.name ? 'active' : ''}`}>
                    <link.I size={18} /> {link.name}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="hidden shrink-0 items-center gap-5 lg:flex xl:gap-7">
              <Link href={SELLER_SIGNUP_ROUTE} className="inline-flex items-center gap-2 text-sm font-semibold text-[#101820] transition-colors hover:text-[#6D28D9] xl:text-base"><Store size={20} /> Become a Vendor</Link>
              <Link href="/watch-demo" className="koombo-cta inline-flex items-center gap-2 rounded-xl bg-[#4C1D95] px-4 py-3 text-sm font-bold text-white hover:bg-[#5B21B6] xl:px-5 xl:text-base">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-[#4C1D95]"><Play /></span> Watch a Demo
              </Link>
            </div>
            <button type="button" onClick={() => setMobileMenuOpen((open) => !open)} className="rounded-xl p-2 text-[#101820] transition-colors hover:bg-[#F0F5F8] lg:hidden" aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'} aria-expanded={mobileMenuOpen}>
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE NAVIGATION */}
      {mobileMenuOpen && <div className="koombo-mobile-overlay fixed inset-0 z-[60] bg-black/45 backdrop-blur-sm lg:hidden" onClick={() => setMobileMenuOpen(false)} />}
      {mobileMenuOpen && (
        <aside className="koombo-mobile-panel fixed right-0 top-0 z-[70] h-[100dvh] w-[86%] max-w-sm overflow-y-auto border-l border-[#E5E7EB] bg-white text-[#101820] shadow-2xl lg:hidden">
          <div className="flex items-center justify-between border-b border-[#E5E7EB] px-5 py-4">
            <Link href="/" onClick={() => setMobileMenuOpen(false)} aria-label="Koombo home"><img src="/logo.png" alt="Koombo" className="h-10 w-auto" /></Link>
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
      <main id="home" className="px-2.5 pb-8 pt-24 sm:px-4 sm:pb-10 sm:pt-28">
        <section className="mx-auto max-w-[1440px] overflow-hidden rounded-[20px] bg-[#4C1D95] px-4 pb-5 pt-9 sm:rounded-[28px] sm:px-8 sm:pb-8 sm:pt-12 lg:px-12 lg:pb-10 lg:pt-14">
          
          {/* Shop / Sell toggle */}
          <Reveal>
            <div className="mx-auto flex w-fit items-center rounded-full bg-[#3B1675] p-1">
              {(['shop', 'sell'] as const).map((item) => {
                const Icon = item === 'shop' ? Bag : Store;
                return (
                  <button key={item} type="button" onClick={() => setMode(item)} aria-pressed={mode === item} className={`inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold capitalize transition-all duration-200 sm:px-7 sm:py-2.5 sm:text-base ${mode === item ? 'bg-white text-[#24133F] shadow-sm' : 'text-white hover:bg-white/10'}`}>
                    <Icon size={18} /> {item}
                  </button>
                );
              })}
            </div>
          </Reveal>

          {/* Headline */}
          <Reveal delay={100} className="flex justify-center">
            <h1 className="mt-6 w-full max-w-4xl text-center text-[clamp(2.25rem,5.5vw,4.5rem)] font-extrabold leading-[1.04] tracking-[-0.055em] text-white sm:mt-7">{content.title}</h1>
          </Reveal>

          {/* Description */}
          <Reveal delay={180}>
            <p className="mx-auto mt-4 max-w-[620px] text-center text-sm leading-relaxed text-[#D1D5DB] sm:mt-5 sm:text-base lg:text-lg">{content.sub}</p>
          </Reveal>

          {/* CTA */}
          <Reveal delay={260}>
            <div className="mt-6 flex justify-center sm:mt-7">
            <a href={mode === 'sell' ? '/lister' : '#vendors'} onClick={() => { if (mode === 'shop') onExplore?.(); }} className="koombo-cta group inline-flex items-center justify-center gap-3 rounded-full bg-[#24133F] px-7 py-3.5 text-sm font-bold text-white hover:bg-[#3B1C66] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#24133F] sm:px-9 sm:py-4 sm:text-base">
                <content.CtaIcon size={21} /> {content.cta}
                <span className="transition-transform duration-200 group-hover:translate-x-1"><Arrow size={20} /></span>
              </a>
            </div>
          </Reveal>

          {/* Main landscape image */}
          <Reveal delay={350} y={25}>
            <div className="mx-auto mt-8 max-w-[1050px] sm:mt-10 lg:mt-12">
              <HeroImage mode={mode} />
            </div>
          </Reveal>

          {/* Supporting text */}
          <Reveal delay={450}>
            <p className="mt-5 text-center text-xs font-medium tracking-wide text-[#D1D5DB]/80 sm:mt-6 sm:text-sm">
              {mode === 'shop' ? 'Discover businesses. Connect with people. Shop with confidence.' : 'Your business. Your audience. Your opportunity.'}
            </p>
          </Reveal>
        </section>
      </main>
    </section>
  );
}

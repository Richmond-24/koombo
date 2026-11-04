'use client';

import React, { useEffect, useRef, useState } from 'react';

const ACCENT = '#5B21B6';
const TINT = '#F3EFFF';

const WEB_APP_URL = 'https://your-koombo-app-url.com';

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
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-[cubic-bezier(.16,1,.3,1)] motion-reduce:!translate-y-0 motion-reduce:!opacity-100 ${
        shown ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      } ${className}`}
    >
      {children}
    </div>
  );
}

function Arrow({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PlayIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.4-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z" />
    </svg>
  );
}

function LinkIcon({ className = 'h-5 w-5' }: { className?: string }) {
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

const ROLES = [
  {
    tag: 'Sellers',
    title: 'List with photos and videos.',
    text: 'Show your products in motion, go live when you want, and answer buyers directly.',
    cta: 'Start selling',
    href: '/lister',
  },
  {
    tag: 'Buyers',
    title: 'Watch it before you buy it.',
    text: 'See products on video, ask the seller questions, and shop with more confidence.',
    cta: 'Start shopping',
    href: WEB_APP_URL,
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

export default function KoomboStart() {
  return (
    <section
      id="koombo-start"
      className="relative w-full overflow-hidden bg-white py-16 text-[#17102B] antialiased sm:py-20 lg:py-24"
      style={{
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        textRendering: 'optimizeLegibility',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      <style>{`
        @keyframes kb-ring{0%{transform:scale(1);opacity:.5}100%{transform:scale(1.9);opacity:0}}
        @keyframes kb-progress{0%{width:6%}100%{width:92%}}
        @keyframes kb-float{0%,100%{translate:0 0}50%{translate:0 -8px}}
        .kb-ring{animation:kb-ring 2s ease-out infinite}
        .kb-progress{animation:kb-progress 6s linear infinite}
        .kb-float{animation:kb-float 4s ease-in-out infinite}
        @media (prefers-reduced-motion: reduce){
          *,*::before,*::after{animation:none!important;transition-duration:.01ms!important}
        }
      `}</style>

      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        {/* HEADING */}
        <Reveal className="mx-auto max-w-3xl text-center">
          <span className="inline-flex rounded-full bg-[#E4DAFB] px-5 py-2.5 text-[17px] font-extrabold tracking-[0.02em] text-[#5B21B6]">
            Social shopping
          </span>
          <h2
            className="mt-5 font-black"
            style={{ fontSize: 'clamp(34px, 5vw, 60px)', lineHeight: 1.04, letterSpacing: '-0.04em' }}
          >
            Shop with <span style={{ color: ACCENT, fontSize: 'inherit', fontWeight: 'inherit' }}>video</span>, not just static images.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-[17px] leading-relaxed text-[#17102B]/65">
            Sellers list products with photos and videos, and can go live too. Buyers see the real thing and talk to
            the seller before they buy.
          </p>
        </Reveal>

        {/* COMPARISON */}
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:mt-16">
          {/* Static */}
          <Reveal>
            <article className="h-full rounded-[32px] bg-[#F4F4F6] p-5 sm:p-6">
              <div className="grid aspect-[4/3] grid-cols-3 gap-2 overflow-hidden rounded-[22px]">
                {['/j.jpg', '/j.jpg', '/j.jpg'].map((src, i) => (
                  <img key={i} src={src} alt="" loading="lazy" className="h-full w-full object-cover grayscale" />
                ))}
              </div>
              <span className="mt-5 inline-flex rounded-full bg-black/5 px-4 py-2 text-[16px] font-extrabold text-[#17102B]/60">
                Other online stores
              </span>
              <h3 className="mt-3 text-[22px] font-black leading-[1.1] tracking-[-0.03em] text-[#17102B]/70 sm:text-[26px]">
                A few still pictures.
              </h3>
              <p className="mt-2 text-[16px] leading-relaxed text-[#17102B]/55">
                You scroll through static images and guess how the product really looks.
              </p>
            </article>
          </Reveal>

          {/* Koombo */}
          <Reveal delay={120}>
            <article className="h-full rounded-[32px] bg-[#5B21B6] p-5 text-white shadow-[0_30px_60px_-25px_rgba(91,33,182,0.7)] sm:p-6">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[22px] bg-[#4C1D95]">
                <img
                  src="/free.jpg"
                  alt="A product video playing on Koombo"
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-[#17102B]/25" />

                <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center">
                  <span className="kb-ring absolute inset-0 rounded-full bg-white" />
                  <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-white text-[#5B21B6] shadow-lg">
                    <PlayIcon className="ml-0.5 h-7 w-7" />
                  </span>
                </span>

                <span className="absolute left-3 top-3 rounded-full bg-white/90 px-4 py-2 text-[16px] font-extrabold text-[#5B21B6]">
                  Product video
                </span>

                <div className="absolute inset-x-4 bottom-4 h-1.5 overflow-hidden rounded-full bg-white/30">
                  <div className="kb-progress h-full rounded-full bg-white" />
                </div>
              </div>
              <span className="mt-5 inline-flex rounded-full bg-white/15 px-4 py-2 text-[16px] font-extrabold">
                On Koombo
              </span>
              <h3 className="mt-3 text-[22px] font-black leading-[1.1] tracking-[-0.03em] sm:text-[26px]">
                Real products on video.
              </h3>
              <p className="mt-2 text-[16px] leading-relaxed text-white/80">
                Watch the item up close, see its size and condition, then message the seller.
              </p>
            </article>
          </Reveal>
        </div>

        {/* ROLES */}
        <Reveal className="mt-16 text-center lg:mt-24">
          <h3 className="text-[26px] font-black tracking-[-0.03em] sm:text-[34px]">
            Built for{' '}
            <span style={{ color: ACCENT, fontSize: 'inherit', fontWeight: 'inherit' }}>sellers, buyers</span> and connectors
          </h3>
        </Reveal>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {ROLES.map((r, i) => (
            <Reveal key={r.tag} delay={i * 100} className="h-full">
              <article
                className={`group flex h-full flex-col rounded-[28px] p-6 transition duration-500 hover:-translate-y-1 sm:p-7 ${
                  r.featured ? 'bg-[#5B21B6] text-white' : ''
                }`}
                style={r.featured ? undefined : { backgroundColor: TINT }}
              >
                <span
                  className={`w-fit rounded-full px-4 py-2 text-[17px] font-extrabold ${
                    r.featured ? 'bg-white/15 text-white' : 'bg-white text-[#5B21B6]'
                  }`}
                >
                  {r.tag}
                </span>

                <h4 className="mt-5 text-[22px] font-black leading-[1.12] tracking-[-0.03em] sm:text-[24px]">
                  {r.title}
                </h4>
                <p className={`mt-3 text-[17px] leading-relaxed ${r.featured ? 'text-white/80' : 'text-[#17102B]/65'}`}>
                  {r.text}
                </p>

                {/* Connector link mock */}
                {r.featured && (
                  <div className="kb-float mt-5 flex items-center justify-between gap-3 rounded-2xl bg-white px-4 py-3 text-[#17102B] shadow-lg">
                    <span className="flex min-w-0 items-center gap-2 text-[16px] font-bold">
                      <LinkIcon className="h-5 w-5 shrink-0 text-[#5B21B6]" />
                      <span className="truncate">koombo.app/c/your-name</span>
                    </span>
                    <span className="shrink-0 rounded-full bg-[#E4DAFB] px-3 py-1 text-[15px] font-extrabold text-[#5B21B6]">
                      Earns
                    </span>
                  </div>
                )}

                <a
                  href={r.href}
                  className={`group/btn mt-6 inline-flex w-fit items-center gap-2 text-[18px] font-extrabold md:mt-auto md:pt-6 ${
                    r.featured ? 'text-white' : 'text-[#5B21B6]'
                  }`}
                >
                  {r.cta}
                  <Arrow className="h-5 w-5 transition-transform group-hover/btn:translate-x-1" />
                </a>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
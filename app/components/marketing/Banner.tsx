
'use client';

import React from 'react';

const FEATURES = [
  {
    number: '01',
    label: 'DISCOVER',
    title: 'See something you love. Shop it.',
    description:
      'Explore a world of products through engaging photos and videos. Find something you love, discover new sellers, and shop without the endless searching.',
    image:
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1000&q=85',
    imageAlt: 'Modern retail store with a curated collection of products',
    imagePosition: 'object-center',
    badge: 'Discover your next favourite',
    reverse: false,
  },
  {
    number: '02',
    label: 'CONNECT',
    title: 'Shopping feels better together.',
    description:
      'Have a question about a product? Start a conversation with the seller. Ask about prices, availability, sizes, and delivery before making your decision.',
    image:
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1000&q=85',
    imageAlt: 'Person using a smartphone to communicate',
    imagePosition: 'object-center',
    badge: 'Conversations that count',
    reverse: true,
  },
  {
    number: '03',
    label: 'SELL',
    title: 'Your products deserve to be seen.',
    description:
      'Put your products in front of potential customers. Showcase what you sell, help buyers discover your business, and turn product interest into real conversations.',
    image:
      'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=1000&q=85',
    imageAlt: 'Thoughtfully arranged products in a retail shop',
    imagePosition: 'object-center',
    badge: 'Make your business discoverable',
    reverse: false,
  },
];

function ArrowUpRight() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
    >
      <path
        d="M7 17 17 7M7 7h10v10"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ShoppingBagIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      className="h-6 w-6"
    >
      <path
        d="M5 8h14l1 13H4L5 8Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M9 9V6a3 3 0 0 1 6 0v3"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      className="h-5 w-5"
    >
      <path
        d="m9 6 10 6-10 6V6Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MessageIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      className="h-6 w-6"
    >
      <path
        d="M20 11.5a7.5 7.5 0 0 1-7.5 7.5H5l1.7-3.4A7.5 7.5 0 1 1 20 11.5Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M8 11h8M8 14h5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function StoreIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      className="h-6 w-6"
    >
      <path
        d="M4 10v10h16V10M3 10l2-6h14l2 6"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3 10a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0M9 20v-5h6v5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      className="h-5 w-5"
    >
      <path
        d="M12 2.5 14.8 9l6.7 3-6.7 2.8L12 21.5l-2.8-6.7L2.5 12l6.7-3L12 2.5Z"
        fill="currentColor"
        fillOpacity=".15"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FeatureCard({
  number,
  label,
  title,
  description,
  image,
  imageAlt,
  imagePosition,
  badge,
  reverse,
}: (typeof FEATURES)[number]) {
  return (
    <article
      className={`koombo-reveal group grid overflow-hidden rounded-[28px] border border-slate-200/80 bg-white transition-all duration-500 hover:-translate-y-1 hover:border-[#0D9488]/30 hover:shadow-[0_24px_70px_rgba(15,23,42,0.08)] md:grid-cols-2 ${
        reverse ? 'md:[direction:rtl]' : ''
      }`}
    >
      {/* Product photography */}
      <div className="relative min-h-[280px] overflow-hidden bg-[#E9F7F5] md:min-h-[420px] md:[direction:ltr]">
        <img
          src={image}
          alt={imageAlt}
          loading="lazy"
          className={`absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 ${imagePosition}`}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/45 via-transparent to-slate-950/5" />

        <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full border border-white/40 bg-white/90 px-3.5 py-2 text-xs font-semibold text-slate-800 shadow-sm backdrop-blur-md">
          <span className="h-2 w-2 rounded-full bg-[#0D9488]" />
          {badge}
        </div>

        <div className="absolute bottom-5 left-5 flex items-center gap-2 text-sm font-medium text-white">
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-white/20 backdrop-blur-md">
            {label === 'DISCOVER' ? (
              <PlayIcon />
            ) : label === 'CONNECT' ? (
              <MessageIcon />
            ) : (
              <StoreIcon />
            )}
          </span>

          <span>{label === 'DISCOVER' ? 'Explore products' : label === 'CONNECT' ? 'Talk to sellers' : 'Showcase your shop'}</span>
        </div>
      </div>

      {/* Text content */}
      <div
        className="flex flex-col justify-center p-7 md:p-10 lg:p-12"
        style={{ direction: 'ltr' }}
      >
        <div className="mb-6 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E6F6F3] text-sm font-bold text-[#0D9488]">
            {number}
          </span>

          <span className="text-xs font-bold tracking-[0.2em] text-[#0D9488]">
            {label}
          </span>
        </div>

        <h3 className="max-w-md text-3xl font-bold leading-[1.12] tracking-tight text-slate-950 md:text-4xl">
          {title}
        </h3>

        <p className="mt-5 max-w-lg text-base leading-8 text-slate-600">
          {description}
        </p>

        <div className="mt-8 flex items-center gap-2 text-sm font-semibold text-slate-800 transition-colors group-hover:text-[#0D9488]">
          <span>
            {label === 'DISCOVER'
              ? 'A new way to find products'
              : label === 'CONNECT'
                ? 'Make informed decisions'
                : 'Grow your product visibility'}
          </span>

          <ArrowUpRight />
        </div>
      </div>
    </article>
  );
}

export default function KoomboStart() {
  // Replace this with your deployed Koombo web app URL.
  const webAppUrl = 'https://your-koombo-app-url.com';

  return (
    <section
      id="koombo-start"
      className="koombo-section relative isolate w-full overflow-hidden bg-white py-20 text-slate-950 sm:py-24 lg:py-32"
    >
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

        .koombo-section {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI',
            sans-serif;
          -webkit-font-smoothing: antialiased;
        }

        .koombo-reveal {
          animation: koomboFadeUp 0.75s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        .koombo-reveal:nth-child(2) {
          animation-delay: 0.12s;
        }

        .koombo-reveal:nth-child(3) {
          animation-delay: 0.24s;
        }

        @keyframes koomboFadeUp {
          from {
            opacity: 0;
            transform: translateY(24px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .koombo-reveal {
            animation: none !important;
          }

          .koombo-section *,
          .koombo-section *::before,
          .koombo-section *::after {
            scroll-behavior: auto !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      {/* Decorative background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -left-48 -top-32 h-[440px] w-[440px] rounded-full bg-[#CCFBF1]/50 blur-[100px]" />
        <div className="absolute -right-48 top-[15%] h-[460px] w-[460px] rounded-full bg-[#E0F2FE]/50 blur-[110px]" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-[#F0FDFA] blur-[100px]" />
      </div>

      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        {/* Hero */}
        <header className="mx-auto mb-20 max-w-5xl text-center sm:mb-24 lg:mb-28">
          <div className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-[#BCE8E0] bg-white/80 px-4 py-2.5 shadow-sm backdrop-blur-md">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#E0F7F2] text-[#0D9488]">
              <SparkleIcon />
            </span>

            <span className="text-xs font-bold tracking-wide text-slate-700 sm:text-sm">
              Discover. Connect. Shop.
            </span>
          </div>

          <h1 className="text-5xl font-black leading-[1.04] tracking-[-0.055em] text-slate-950 sm:text-6xl md:text-7xl lg:text-[88px]">
            Shopping is better
            <br />
            <span className="relative inline-block text-[#0D9488]">
              when it&apos;s social.
              <svg
                aria-hidden="true"
                viewBox="0 0 320 14"
                preserveAspectRatio="none"
                className="absolute -bottom-2 left-0 h-2.5 w-full text-[#99E5D7]"
              >
                <path
                  d="M3 9C70 2 170 2 317 8"
                  stroke="currentColor"
                  strokeWidth="6"
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
            </span>
          </h1>

          <p className="mx-auto mt-8 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg sm:leading-9 md:text-xl">
            Meet Koombo — a fresh way to discover products, connect with
            sellers, and shop what you love. Explore products through engaging
            visuals and start conversations directly with the people selling
            them.
          </p>

          {/* Single web app button */}
          <div className="mt-10 flex flex-col items-center gap-4 sm:mt-12">
            <a
              href={webAppUrl}
              className="group inline-flex min-h-[60px] w-full items-center justify-center gap-3 rounded-2xl bg-[#0D9488] px-7 py-4 text-base font-bold text-white shadow-[0_12px_30px_rgba(13,148,136,0.22)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#0F766E] hover:shadow-[0_18px_40px_rgba(13,148,136,0.3)] active:scale-[0.98] sm:w-auto sm:min-w-[250px]"
            >
              <ShoppingBagIcon />
              <span>Explore Koombo</span>
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </a>

            <p className="text-sm text-slate-500">
              Shop your way. Connect with ease.
            </p>
          </div>

          {/* Product preview */}
          <div className="relative mx-auto mt-16 max-w-5xl sm:mt-20">
            <div
              aria-hidden="true"
              className="absolute -inset-4 -z-10 rounded-[36px] bg-gradient-to-br from-[#CCFBF1]/70 via-white to-[#DBEAFE]/60 blur-2xl"
            />

            <div className="relative overflow-hidden rounded-[24px] border border-slate-200/80 bg-white p-2 shadow-[0_30px_90px_rgba(15,23,42,0.10)] sm:rounded-[32px] sm:p-3">
              <div className="relative h-[260px] overflow-hidden rounded-[18px] bg-[#E5F5F1] sm:h-[360px] md:h-[470px] md:rounded-[24px]">
                <img
                  src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1800&q=90"
                  alt="A curated retail shopping experience"
                  className="absolute inset-0 h-full w-full object-cover"
                  fetchPriority="high"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/10 to-slate-950/5" />

                <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full border border-white/30 bg-white/90 px-3.5 py-2 text-xs font-bold text-slate-800 shadow-lg backdrop-blur-md sm:left-7 sm:top-7 sm:text-sm">
                  <span className="h-2 w-2 rounded-full bg-[#0D9488]" />
                  Welcome to Koombo
                </div>

                <div className="absolute inset-x-5 bottom-6 text-left sm:inset-x-9 sm:bottom-9 md:inset-x-12 md:bottom-12">
                  <span className="mb-3 inline-flex rounded-full border border-white/25 bg-white/15 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md sm:text-sm">
                    Your next favourite find starts here
                  </span>

                  <h2 className="max-w-2xl text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl md:text-6xl">
                    Find it.
                    <br className="sm:hidden" /> Love it. Shop it.
                  </h2>

                  <p className="mt-3 max-w-lg text-sm leading-6 text-white/85 sm:text-base sm:leading-7">
                    Discover products worth talking about and connect with
                    the sellers behind them.
                  </p>
                </div>
              </div>
            </div>

            {/* Floating feature labels */}
            <div className="absolute -left-1 top-[22%] hidden -translate-x-1/4 items-center gap-3 rounded-2xl border border-slate-100 bg-white p-3.5 shadow-xl md:flex lg:-left-8">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E0F7F2] text-[#0D9488]">
                <PlayIcon />
              </span>

              <div>
                <p className="text-sm font-bold text-slate-900">
                  Discover products
                </p>
                <p className="mt-0.5 text-xs text-slate-500">
                  See what catches your eye
                </p>
              </div>
            </div>

            <div className="absolute -right-1 bottom-[20%] hidden translate-x-1/4 items-center gap-3 rounded-2xl border border-slate-100 bg-white p-3.5 shadow-xl md:flex lg:-right-8">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <MessageIcon />
              </span>

              <div>
                <p className="text-sm font-bold text-slate-900">
                  Connect with sellers
                </p>
                <p className="mt-0.5 text-xs text-slate-500">
                  Ask before you buy
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Features introduction */}
        <div className="mb-12 max-w-2xl sm:mb-16">
          <span className="text-xs font-bold uppercase tracking-[0.22em] text-[#0D9488]">
            THE KOOMBO EXPERIENCE
          </span>

          <h2 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-slate-950 sm:text-4xl md:text-5xl">
            More than a place to shop.
          </h2>

          <p className="mt-5 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
            From discovering your next favourite product to speaking directly
            with sellers, Koombo brings product discovery and conversations
            closer together.
          </p>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 gap-6 md:gap-8">
          {FEATURES.map((feature) => (
            <FeatureCard key={feature.number} {...feature} />
          ))}
        </div>

        {/* Final call to action */}
        <div className="relative mt-20 overflow-hidden rounded-[28px] bg-[#0B2928] px-6 py-12 text-center sm:mt-28 sm:px-12 sm:py-16 lg:py-20">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-36 h-80 w-80 rounded-full bg-[#0D9488]/30 blur-[80px]"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-40 -left-20 h-80 w-80 rounded-full bg-[#14B8A6]/20 blur-[80px]"
          />

          <div className="relative mx-auto max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-[#99F6E4] sm:text-sm">
              <SparkleIcon />
              Your next discovery awaits
            </span>

            <h2 className="mt-6 text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
              Ready to shop differently?
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-base leading-8 text-slate-300 sm:text-lg">
              Discover products, meet sellers, and experience a more connected
              way to shop with Koombo.
            </p>

            <a
              href={webAppUrl}
              className="group mt-8 inline-flex min-h-[58px] items-center justify-center gap-3 rounded-2xl bg-white px-7 py-4 text-base font-bold text-[#0B2928] transition-all duration-300 hover:-translate-y-1 hover:bg-[#CCFBF1] active:scale-[0.98]"
            >
              <ShoppingBagIcon />
              <span>Explore Koombo</span>
              <ArrowUpRight />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

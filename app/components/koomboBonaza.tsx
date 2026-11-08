'use client';

import React, { useEffect, useRef, useState } from 'react';

type FormData = {
  name: string;
  email: string;
  phone: string;
};

const INK = '#17102B';
const PURPLE = '#5B21B6';
const PAPER = '#F5F1E8';

const PRIZES = [
  {
    title: 'Exclusive merch pack',
    desc: 'A limited edition Koombo hoodie, cap and stickers.',
  },
  {
    title: 'Free delivery credits',
    desc: 'GH₵ 200 of delivery credits to kick-start your first orders.',
  },
  {
    title: 'Featured on Koombo',
    desc: 'Get spotlighted on our homepage and social channels.',
  },
];

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
    const element = ref.current;

    if (!element || typeof IntersectionObserver === 'undefined') {
      setShown(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-[cubic-bezier(.16,1,.3,1)] ${
        shown
          ? 'translate-y-0 opacity-100'
          : 'translate-y-8 opacity-0'
      } ${className}`}
    >
      {children}
    </div>
  );
}

function Arrow({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Star({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M12 2l2.6 6.6L21 9.3l-5 4.4 1.6 6.9L12 17l-5.6 3.6L8 13.7 3 9.3l6.4-.7L12 2Z" />
    </svg>
  );
}

function Sticker() {
  return (
    <div
      className="kb-sticker relative h-[76px] w-[76px] sm:h-[120px] sm:w-[120px]"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 120 120"
        className="kb-spin absolute inset-0 h-full w-full"
      >
        <defs>
          <path
            id="kb-circle"
            d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0"
          />
        </defs>

        <circle cx="60" cy="60" r="58" fill={PURPLE} />

        <text
          fill={PAPER}
          fontSize="11.5"
          fontWeight="800"
          letterSpacing="2"
        >
          <textPath href="#kb-circle" textLength="272" lengthAdjust="spacing">
            SIGN UP BEFORE LAUNCH • WIN PRIZES •
          </textPath>
        </text>
      </svg>

      <span className="absolute inset-0 flex items-center justify-center text-[#F5F1E8]">
        <Star className="h-6 w-6 sm:h-9 sm:w-9" />
      </span>
    </div>
  );
}

export default function BonanzaPage() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [entryNo, setEntryNo] = useState('0000');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);

    // Replace with your actual registration API.
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setEntryNo(String(Math.floor(1000 + Math.random() * 9000)));

    setIsSubmitting(false);
    setSubmitted(true);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&display=swap');

        /*
         * PAGE-SPECIFIC TYPOGRAPHY OVERRIDES
         * The unique page ID gives these selectors higher specificity
         * than ordinary global h1, h2 and h3 styles.
         */

        #koombo-bonanza-page {
          font-family: Arial, Helvetica, sans-serif;
          font-size: 16px;
          -webkit-text-size-adjust: 100%;
          text-size-adjust: 100%;
        }

        #koombo-bonanza-page .kb-display {
          font-family: 'Bricolage Grotesque', Arial, sans-serif !important;
        }

        #koombo-bonanza-page .kb-balance {
          text-wrap: balance;
        }

        /* HERO HEADING */

        #koombo-bonanza-page h1.kb-hero-heading {
          display: block !important;
          width: 100% !important;
          max-width: 1000px !important;
          margin-top: 30px !important;
          margin-bottom: 0 !important;
          font-family: 'Bricolage Grotesque', Arial, sans-serif !important;
          font-size: 48px !important;
          font-weight: 800 !important;
          line-height: 1.02 !important;
          letter-spacing: -0.055em !important;
          color: ${INK} !important;
        }

        /* SECTION HEADINGS */

        #koombo-bonanza-page h2.kb-section-heading {
          display: block !important;
          font-family: 'Bricolage Grotesque', Arial, sans-serif !important;
          font-size: 36px !important;
          font-weight: 800 !important;
          line-height: 1.08 !important;
          letter-spacing: -0.045em !important;
          color: ${INK} !important;
        }

        /* PRIZE HEADINGS */

        #koombo-bonanza-page h3.kb-prize-heading {
          display: block !important;
          font-family: 'Bricolage Grotesque', Arial, sans-serif !important;
          font-size: 25px !important;
          font-weight: 800 !important;
          line-height: 1.15 !important;
          letter-spacing: -0.025em !important;
          color: inherit;
        }

        /* FORM HEADING */

        #koombo-bonanza-page h2.kb-form-heading {
          font-family: 'Bricolage Grotesque', Arial, sans-serif !important;
          font-size: 29px !important;
          font-weight: 800 !important;
          line-height: 1.12 !important;
          letter-spacing: -0.035em !important;
        }

        /* BODY TEXT */

        #koombo-bonanza-page .kb-body-copy {
          font-size: 17px !important;
          line-height: 1.7 !important;
        }

        /* SMALL MOBILE */

        @media (max-width: 374px) {
          #koombo-bonanza-page h1.kb-hero-heading {
            font-size: 39px !important;
            line-height: 1.04 !important;
          }

          #koombo-bonanza-page h2.kb-section-heading {
            font-size: 31px !important;
          }

          #koombo-bonanza-page h3.kb-prize-heading {
            font-size: 22px !important;
          }

          #koombo-bonanza-page h2.kb-form-heading {
            font-size: 25px !important;
          }
        }

        /* STANDARD MOBILE */

        @media (min-width: 375px) and (max-width: 639px) {
          #koombo-bonanza-page h1.kb-hero-heading {
            font-size: 46px !important;
            line-height: 1.03 !important;
          }

          #koombo-bonanza-page h2.kb-section-heading {
            font-size: 37px !important;
          }

          #koombo-bonanza-page h3.kb-prize-heading {
            font-size: 24px !important;
          }

          #koombo-bonanza-page h2.kb-form-heading {
            font-size: 28px !important;
          }
        }

        /* TABLET */

        @media (min-width: 640px) and (max-width: 1023px) {
          #koombo-bonanza-page h1.kb-hero-heading {
            font-size: 68px !important;
            line-height: 1.01 !important;
          }

          #koombo-bonanza-page h2.kb-section-heading {
            font-size: 48px !important;
          }

          #koombo-bonanza-page h3.kb-prize-heading {
            font-size: 27px !important;
          }

          #koombo-bonanza-page h2.kb-form-heading {
            font-size: 32px !important;
          }

          #koombo-bonanza-page .kb-body-copy {
            font-size: 18px !important;
          }
        }

        /* DESKTOP */

        @media (min-width: 1024px) {
          #koombo-bonanza-page h1.kb-hero-heading {
            font-size: 84px !important;
            line-height: 0.99 !important;
          }

          #koombo-bonanza-page h2.kb-section-heading {
            font-size: 56px !important;
          }

          #koombo-bonanza-page h3.kb-prize-heading {
            font-size: 30px !important;
          }

          #koombo-bonanza-page h2.kb-form-heading {
            font-size: 34px !important;
          }

          #koombo-bonanza-page .kb-body-copy {
            font-size: 19px !important;
          }
        }

        /* LARGE DESKTOP */

        @media (min-width: 1440px) {
          #koombo-bonanza-page h1.kb-hero-heading {
            font-size: 96px !important;
          }

          #koombo-bonanza-page h2.kb-section-heading {
            font-size: 62px !important;
          }
        }

        /* ANIMATIONS */

        @keyframes kb-spin {
          to { transform: rotate(360deg); }
        }

        #koombo-bonanza-page .kb-spin {
          animation: kb-spin 16s linear infinite;
        }

        @keyframes kb-wobble {
          0%, 100% { transform: rotate(-8deg); }
          50% { transform: rotate(6deg); }
        }

        #koombo-bonanza-page .kb-sticker {
          animation: kb-wobble 6s ease-in-out infinite;
        }

        @keyframes kb-draw {
          to { stroke-dashoffset: 0; }
        }

        #koombo-bonanza-page .kb-draw {
          stroke-dasharray: 1;
          stroke-dashoffset: 1;
          animation: kb-draw 1s cubic-bezier(.65,0,.35,1) .9s forwards;
        }

        @keyframes kb-rise {
          from {
            opacity: 0;
            transform: translateY(22px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        #koombo-bonanza-page .kb-rise {
          display: inline-block;
          opacity: 0;
          animation: kb-rise .8s cubic-bezier(.16,1,.3,1) forwards;
        }

        @keyframes kb-ping {
          0% {
            transform: scale(1);
            opacity: .6;
          }
          100% {
            transform: scale(2.4);
            opacity: 0;
          }
        }

        #koombo-bonanza-page .kb-ping {
          animation: kb-ping 1.8s ease-out infinite;
        }

        @keyframes kb-stamp {
          0% {
            transform: scale(2.6) rotate(-18deg);
            opacity: 0;
          }
          60% {
            transform: scale(.94) rotate(-8deg);
            opacity: 1;
          }
          80% {
            transform: scale(1.04) rotate(-8deg);
          }
          100% {
            transform: scale(1) rotate(-8deg);
            opacity: 1;
          }
        }

        #koombo-bonanza-page .kb-stamp {
          animation: kb-stamp .7s cubic-bezier(.2,.8,.2,1) .15s both;
        }

        @keyframes kb-fade-up {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        #koombo-bonanza-page .kb-fade-up {
          animation: kb-fade-up .6s cubic-bezier(.16,1,.3,1) both;
        }

        /* FORM */

        #koombo-bonanza-page .kb-field {
          display: block;
          width: 100%;
          min-height: 54px;
          border: 2px solid ${INK};
          border-radius: 12px;
          background: #fff;
          padding: 14px 16px;
          font-size: 17px !important;
          font-weight: 500;
          color: ${INK};
          outline: none;
          transition: transform .15s ease, box-shadow .15s ease;
        }

        #koombo-bonanza-page .kb-field::placeholder {
          color: #17102B66;
        }

        #koombo-bonanza-page .kb-field:focus {
          transform: translate(-2px, -2px);
          box-shadow: 4px 4px 0 ${PURPLE};
        }

        #koombo-bonanza-page .kb-btn {
          box-shadow: 5px 5px 0 ${INK};
          transition: transform .15s ease, box-shadow .15s ease, background-color .2s ease;
        }

        #koombo-bonanza-page .kb-btn:hover:not(:disabled) {
          transform: translate(-2px, -2px);
          box-shadow: 7px 7px 0 ${INK};
        }

        #koombo-bonanza-page .kb-btn:active:not(:disabled) {
          transform: translate(3px, 3px);
          box-shadow: 2px 2px 0 ${INK};
        }

        @media (prefers-reduced-motion: reduce) {
          #koombo-bonanza-page .kb-spin,
          #koombo-bonanza-page .kb-sticker,
          #koombo-bonanza-page .kb-ping,
          #koombo-bonanza-page .kb-stamp,
          #koombo-bonanza-page .kb-fade-up,
          #koombo-bonanza-page .kb-rise {
            animation: none !important;
          }

          #koombo-bonanza-page .kb-rise {
            opacity: 1 !important;
          }

          #koombo-bonanza-page .kb-draw {
            animation: none !important;
            stroke-dashoffset: 0;
          }
        }
      `}</style>

      <main
        id="koombo-bonanza-page"
        className="relative min-h-screen overflow-x-hidden pb-16 sm:pb-24"
        style={{
          backgroundColor: PAPER,
          color: INK,
          fontSize: '16px',
          transform: 'none',
        }}
      >
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">

          {/* HERO */}

          <section className="relative pt-10 sm:pt-16 lg:pt-20">
            <div className="flex items-start justify-between gap-4">
              <p className="kb-display inline-flex items-center gap-3 pt-1 text-[18px] font-extrabold uppercase leading-none tracking-[0.06em] sm:gap-3.5 sm:pt-2 sm:text-[26px] sm:tracking-[0.08em]">
                <span className="relative flex h-3 w-3 shrink-0 sm:h-3.5 sm:w-3.5">
                  <span className="kb-ping absolute inset-0 rounded-full bg-[#5B21B6]" />
                  <span className="relative h-full w-full rounded-full bg-[#5B21B6]" />
                </span>
                Koombo web app
              </p>

              <Sticker />
            </div>

            <h1 className="kb-hero-heading kb-balance">
              <span className="kb-rise" style={{ animationDelay: '.05s' }}>
                Koombo is
              </span>{' '}
              <span className="kb-rise" style={{ animationDelay: '.18s' }}>
                coming
              </span>{' '}
              <span className="kb-rise" style={{ animationDelay: '.31s' }}>
                to the
              </span>{' '}
              <span
                className="kb-rise relative whitespace-nowrap"
                style={{
                  animationDelay: '.44s',
                  color: PURPLE,
                }}
              >
                web.
                <svg
                  aria-hidden="true"
                  viewBox="0 0 200 16"
                  preserveAspectRatio="none"
                  className="absolute -bottom-1 left-0 h-[0.16em] w-full sm:-bottom-2"
                >
                  <path
                    d="M2 11 C 40 2, 70 15, 105 7 S 170 3, 198 9"
                    pathLength={1}
                    fill="none"
                    stroke={PURPLE}
                    strokeWidth="5"
                    strokeLinecap="round"
                    className="kb-draw"
                  />
                </svg>
              </span>
            </h1>

            <p className="kb-body-copy mt-6 max-w-xl text-[#17102B]/80 sm:mt-7">
              Be one of the first people in through the door. Sign up before
              launch day and you go into the draw for Koombo prizes.
            </p>

            <a
              href="#enter"
              className="kb-btn group mt-7 inline-flex h-12 items-center gap-2 rounded-xl border-2 bg-[#5B21B6] px-6 text-[16px] font-extrabold text-white sm:mt-8 sm:h-14 sm:px-8 sm:text-[18px]"
              style={{ borderColor: INK }}
            >
              Enter the draw
              <Arrow className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </section>

          {/* KEY DATES */}

          <Reveal className="mt-12 sm:mt-16">
            <div
              className="grid grid-cols-2 divide-x-2 overflow-hidden rounded-2xl border-2 bg-white shadow-[6px_6px_0_#17102B] sm:rounded-3xl sm:shadow-[8px_8px_0_#17102B]"
              style={{ borderColor: INK }}
            >
              <div className="min-w-0 px-4 py-5 sm:px-8 sm:py-7">
                <p className="text-[13px] font-extrabold uppercase tracking-[0.12em] text-[#17102B]/60 sm:text-[15px]">
                  Launch day
                </p>
                <p className="kb-display mt-2 text-[30px] font-extrabold leading-none tracking-[-0.04em] text-[#5B21B6] sm:text-[44px] lg:text-[48px]">
                  30 Nov
                </p>
              </div>

              <div className="min-w-0 px-4 py-5 sm:px-8 sm:py-7">
                <p className="text-[13px] font-extrabold uppercase tracking-[0.12em] text-[#17102B]/60 sm:text-[15px]">
                  Winners announced
                </p>
                <p className="kb-display mt-2 text-[26px] font-extrabold leading-none tracking-[-0.04em] sm:text-[38px] lg:text-[44px]">
                  Launch day
                </p>
              </div>
            </div>
          </Reveal>

          {/* PRIZES AND REGISTRATION */}

          <div className="mt-14 grid items-start gap-12 sm:mt-20 lg:grid-cols-[1fr_minmax(0,460px)] lg:gap-16">

            {/* PRIZES */}

            <section aria-labelledby="prizes-heading" className="min-w-0">
              <Reveal>
                <h2
                  id="prizes-heading"
                  className="kb-section-heading kb-balance"
                >
                  What&rsquo;s in the draw
                </h2>
              </Reveal>

              <ul
                className="mt-6 border-t-2 sm:mt-8"
                style={{ borderColor: INK }}
              >
                {PRIZES.map((prize, index) => (
                  <li key={prize.title}>
                    <Reveal delay={index * 110}>
                      <div
                        tabIndex={0}
                        className="group flex cursor-default items-start gap-4 border-b-2 px-1 py-6 outline-none transition-all duration-300 hover:bg-[#5B21B6] hover:px-4 hover:text-white focus-visible:bg-[#5B21B6] focus-visible:px-4 focus-visible:text-white sm:gap-7 sm:py-8"
                        style={{ borderColor: INK }}
                      >
                        <span className="kb-display w-[2.1ch] shrink-0 text-[32px] font-extrabold leading-none tracking-[-0.04em] text-[#5B21B6] transition-colors duration-300 group-hover:text-[#F5F1E8] group-focus-visible:text-[#F5F1E8] sm:w-auto sm:text-[44px]">
                          0{index + 1}
                        </span>

                        <div className="min-w-0 flex-1">
                          <h3 className="kb-prize-heading transition-colors duration-300">
                            {prize.title}
                          </h3>
                          <p className="mt-2 text-[16px] leading-[1.65] opacity-75 sm:text-[17px]">
                            {prize.desc}
                          </p>
                        </div>

                        <Arrow className="mt-1 hidden h-6 w-6 shrink-0 -translate-x-2 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 sm:block" />
                      </div>
                    </Reveal>
                  </li>
                ))}
              </ul>

              <Reveal delay={120}>
                <p className="mt-6 max-w-md text-[16px] leading-relaxed text-[#17102B]/70 sm:text-[17px]">
                  Winners are announced on launch day, 30 November. One entry
                  per person.
                </p>
              </Reveal>
            </section>

            {/* REGISTRATION FORM */}

            <section
              id="enter"
              aria-label="Enter the draw"
              className="min-w-0 scroll-mt-6"
            >
              <Reveal delay={80}>
                <div
                  className="relative rounded-[20px] border-2 bg-white shadow-[6px_6px_0_#17102B] sm:rounded-[24px] sm:shadow-[8px_8px_0_#17102B]"
                  style={{ borderColor: INK }}
                >
                  <div className="flex items-center justify-between gap-3 rounded-t-[17px] bg-[#17102B] px-5 py-4 text-[#F5F1E8] sm:rounded-t-[21px] sm:px-7">
                    <span className="text-[13px] font-extrabold uppercase tracking-[0.14em] sm:text-[14px]">
                      Admit one
                    </span>
                    <span className="text-[13px] font-extrabold uppercase tracking-[0.14em] text-[#C4B5FD] sm:text-[14px]">
                      Koombo · 30 Nov
                    </span>
                  </div>

                  {!submitted ? (
                    <form
                      onSubmit={handleSubmit}
                      className="px-5 pb-7 pt-7 sm:px-7 sm:pb-8 sm:pt-8"
                    >
                      <h2 className="kb-form-heading kb-display kb-balance">
                        Sign up for Koombo today and enter the draw
                      </h2>

                      <p className="mt-3 text-[16px] leading-relaxed text-[#17102B]/70 sm:text-[17px]">
                        Join the waitlist and be first in when we launch.
                      </p>

                      <div className="mt-7 space-y-5">
                        <div>
                          <label
                            htmlFor="kb-name"
                            className="mb-2 block text-[14px] font-extrabold uppercase tracking-[0.1em] text-[#17102B]/75"
                          >
                            Full name
                          </label>
                          <input
                            id="kb-name"
                            required
                            type="text"
                            autoComplete="name"
                            placeholder="Richy"
                            className="kb-field"
                            value={formData.name}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                name: e.target.value,
                              })
                            }
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="kb-email"
                            className="mb-2 block text-[14px] font-extrabold uppercase tracking-[0.1em] text-[#17102B]/75"
                          >
                            Email address
                          </label>
                          <input
                            id="kb-email"
                            required
                            type="email"
                            autoComplete="email"
                            placeholder="kwame@example.com"
                            className="kb-field"
                            value={formData.email}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                email: e.target.value,
                              })
                            }
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="kb-phone"
                            className="mb-2 block text-[14px] font-extrabold uppercase tracking-[0.1em] text-[#17102B]/75"
                          >
                            Phone number
                          </label>
                          <input
                            id="kb-phone"
                            required
                            type="tel"
                            autoComplete="tel"
                            inputMode="tel"
                            placeholder="+233 XX XXX XXXX"
                            className="kb-field"
                            value={formData.phone}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                phone: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>

                      <div
                        className="relative my-7 sm:my-8"
                        aria-hidden="true"
                      >
                        <div
                          className="border-t-2 border-dashed"
                          style={{ borderColor: INK }}
                        />

                        <span
                          className="absolute -left-[33px] top-1/2 h-6 w-6 -translate-y-1/2 rounded-full border-2 sm:-left-[41px]"
                          style={{
                            borderColor: INK,
                            backgroundColor: PAPER,
                            clipPath: 'inset(0 0 0 50%)',
                          }}
                        />

                        <span
                          className="absolute -right-[33px] top-1/2 h-6 w-6 -translate-y-1/2 rounded-full border-2 sm:-right-[41px]"
                          style={{
                            borderColor: INK,
                            backgroundColor: PAPER,
                            clipPath: 'inset(0 50% 0 0)',
                          }}
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="kb-btn flex h-14 w-full items-center justify-center gap-2 rounded-xl border-2 bg-[#5B21B6] text-[17px] font-extrabold text-white disabled:cursor-not-allowed disabled:opacity-60 sm:text-[18px]"
                        style={{ borderColor: INK }}
                      >
                        {isSubmitting ? (
                          <>
                            <svg
                              className="h-5 w-5 animate-spin"
                              viewBox="0 0 24 24"
                              fill="none"
                              aria-hidden="true"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                              />
                            </svg>
                            Printing your ticket…
                          </>
                        ) : (
                          <>
                            Join the bonanza
                            <Arrow className="h-5 w-5" />
                          </>
                        )}
                      </button>

                      <p className="mt-4 text-center text-[14px] leading-relaxed text-[#17102B]/60">
                        By signing up you agree to get launch updates from
                        Koombo.
                      </p>
                    </form>
                  ) : (
                    <div className="relative overflow-hidden px-5 pb-8 pt-8 text-center sm:px-7 sm:pb-10 sm:pt-10">
                      <div className="kb-stamp mx-auto flex w-fit max-w-full flex-col items-center rounded-2xl border-[4px] border-[#5B21B6] px-5 py-3 text-[#5B21B6] sm:px-6">
                        <span className="kb-display text-[32px] font-extrabold leading-none tracking-[-0.03em] sm:text-[44px]">
                          YOU&rsquo;RE IN
                        </span>
                        <span className="mt-2 text-[13px] font-extrabold uppercase tracking-[0.18em]">
                          Entry no. {entryNo}
                        </span>
                      </div>

                      <p
                        className="kb-fade-up mx-auto mt-8 max-w-sm text-[17px] leading-relaxed text-[#17102B]/80 sm:text-[18px]"
                        style={{ animationDelay: '.7s' }}
                      >
                        Thanks, {formData.name.split(' ')[0] || 'friend'}. We&rsquo;ll
                        send launch updates to{' '}
                        <span className="break-all font-bold text-[#5B21B6]">
                          {formData.email}
                        </span>
                        . Winners are announced on 30 November.
                      </p>

                      <button
                        type="button"
                        onClick={() => {
                          setSubmitted(false);
                          setFormData({
                            name: '',
                            email: '',
                            phone: '',
                          });
                        }}
                        className="kb-fade-up mt-7 inline-flex min-h-[46px] items-center rounded-xl border-2 px-5 text-[16px] font-extrabold transition-colors hover:bg-[#17102B] hover:text-white"
                        style={{
                          borderColor: INK,
                          animationDelay: '.9s',
                        }}
                      >
                        Register another person
                      </button>
                    </div>
                  )}
                </div>
              </Reveal>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
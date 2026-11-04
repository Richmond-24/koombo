"use client";

import { useState } from "react";
import Link from "next/link";

const TINT = "#F3EFFF";
const ACCENT = "#5B21B6";
const PILL = "#E4DAFB";

function SellerPhoto() {
  const [ok, setOk] = useState(true);

  return (
    <div
      className="ks-photo relative h-[320px] w-full overflow-hidden sm:h-[420px] lg:absolute lg:right-0 lg:top-0 lg:h-full lg:w-[42%]
                 [clip-path:polygon(0_9%,100%_0,100%_100%,0_100%)]
                 lg:[clip-path:polygon(15%_0,100%_0,100%_100%,0_100%)]"
      style={{ backgroundColor: ACCENT }}
    >
      {ok ? (
        <img
          src="/44.jpg"
          alt="Koombo sellers in their shop"
          onError={() => setOk(false)}
          className="absolute inset-0 h-full w-full select-none object-cover object-[center_30%]"
          draggable={false}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#8B5CF6] via-[#6D28D9] to-[#24133F]">
          <img src="/koombo.jpeg" alt="" className="absolute left-[10%] top-[6%] w-[60%] select-none opacity-80" draggable={false} />
        </div>
      )}
    </div>
  );
}

export default function KoomboSellerSignup() {
  return (
    <main
      id="vendors"
      className="relative min-h-screen w-full overflow-hidden bg-white text-[#222222] antialiased"
      style={{
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        textRendering: "optimizeLegibility",
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
      }}
    >
      <style>{`
        :root { --ks-accent: ${ACCENT}; }

        @keyframes ks-up { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: none; } }
        @keyframes ks-in-r { from { opacity: 0; transform: translateX(40px); } to { opacity: 1; transform: none; } }
        @keyframes ks-in-b { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: none; } }

        /* Visible by default; animation only adds the entrance effect */
        .ks-a { animation: ks-up .8s cubic-bezier(.16,1,.3,1) both; }
        .ks-photo { animation: ks-in-b 1s cubic-bezier(.16,1,.3,1) .2s both; }
        @media (min-width: 1024px) { .ks-photo { animation-name: ks-in-r; } }

        /* Button hover handled in CSS so the text turns white */
        .ks-btn { border-color: var(--ks-accent); color: var(--ks-accent); background: transparent; }
        .ks-btn:hover { background: var(--ks-accent); color: #fff; }

        /* Same headline sizing as the rider page; both lines identical, only colour differs */
        .ks-h1 {
          font-size: clamp(40px, 5.8vw, 100px);
          font-weight: 900;
          line-height: 1.04;
          letter-spacing: -0.03em;
        }
        .ks-h1 span {
          display: block;
          font-size: 1em;
          font-weight: inherit;
          letter-spacing: inherit;
          line-height: inherit;
        }
        .ks-h1-dark { color: #1a0b14; }
        .ks-h1-purple { color: var(--ks-accent); }

        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation: none !important; }
        }
      `}</style>

      <div className="mx-auto max-w-[1700px] px-4 py-6 sm:px-6 lg:px-8">
        <section
          className="relative overflow-hidden rounded-[32px] lg:min-h-[760px]"
          style={{ backgroundColor: TINT }}
        >
          {/* Text column: 58% wide, photo is 42% (same split as the rider page) */}
          <div className="relative z-10 flex flex-col justify-center px-6 pb-12 pt-12 sm:px-12 lg:min-h-[760px] lg:w-[58%] lg:py-20 lg:pl-[72px] lg:pr-6">
            {/* Pill label */}
            <p
              className="ks-a mb-8 inline-flex w-fit items-center rounded-xl px-5 py-3 font-extrabold uppercase leading-none"
              style={{
                animationDelay: ".05s",
                backgroundColor: PILL,
                color: ACCENT,
                fontSize: "clamp(13px, 1.2vw, 20px)",
                letterSpacing: "0.12em",
              }}
            >
              For sellers &amp; vendors
            </p>

            {/* Headline */}
            <h1 className="ks-a ks-h1" style={{ animationDelay: ".15s" }}>
              <span className="ks-h1-dark">Turn your space</span>
              <span className="ks-h1-purple">into a thriving business</span>
            </h1>

            {/* AI business CTA + button (same wrapper and sizing as the rider page) */}
            <div className="ks-a mt-8 w-full max-w-[760px] lg:mt-12" style={{ animationDelay: ".25s" }}>
              <p
                className="mb-4 font-extrabold uppercase tracking-[0.12em]"
                style={{
                  color: ACCENT,
                  fontSize: "clamp(13px, 1.4vw, 20px)",
                  letterSpacing: "0.12em",
                }}
              >
                Add your business with AI
              </p>

              <p
                className="mb-10 font-normal text-[#222222]/80"
                style={{
                  fontSize: "clamp(20px, 2.2vw, 36px)",
                  lineHeight: 1.35,
                  letterSpacing: "-0.01em",
                }}
              >
                List your products and storefront in a beautifully simple marketplace built for discovery, trust, and
                real growth.
              </p>

              <Link
                href="/lister"
                className="ks-btn inline-flex w-full items-center justify-center whitespace-nowrap rounded-full border-[3px] text-center font-extrabold transition-all duration-200 hover:shadow-xl active:scale-[.97] sm:w-auto"
                style={{
                  minHeight: "clamp(56px, 4.8vw, 84px)",
                  padding: "12px clamp(28px, 3.2vw, 56px)",
                  fontSize: "clamp(18px, 1.9vw, 30px)",
                  letterSpacing: "-0.01em",
                }}
              >
                Start selling
              </Link>
            </div>
          </div>

          <SellerPhoto />
        </section>
      </div>
    </main>
  );
}
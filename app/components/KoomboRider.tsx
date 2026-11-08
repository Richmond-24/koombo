'use client';

import { useState } from "react";

const TINT = "#F3EFFF";
const ACCENT = "#5B21B6";

function RiderPhoto() {
  const [ok, setOk] = useState(true);

  return (
    <div
      className="ks-photo relative h-[280px] w-full overflow-hidden sm:h-[360px] lg:absolute lg:left-0 lg:top-0 lg:h-full lg:w-[42%]
                 [clip-path:polygon(0_0,100%_0,100%_92%,0_100%)]
                 lg:[clip-path:polygon(0_0,92%_0,100%_100%,0_100%)]"
      style={{ backgroundColor: ACCENT }}
    >
      {ok ? (
        <img
          src="/koombo.jpeg"
          alt="Koombo delivery partner with packages"
          onError={() => setOk(false)}
          className="absolute inset-0 h-full w-full select-none object-cover object-center"
          draggable={false}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#F5D0FE] via-[#C4B5FD] to-[#4C1D95]" />
      )}
    </div>
  );
}

export default function KoomboRiderSignup({
  onBack,
  onRegisterClick,
}: {
  onBack?: () => void;
  onRegisterClick?: () => void;
}) {
  return (
    <main
      id="rider"
      className="relative min-h-screen w-full overflow-hidden bg-white text-[#24133F] antialiased"
      style={{
        fontFamily: '"Lufga", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        textRendering: "optimizeLegibility",
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
      }}
    >
      <style>{`
        @keyframes ks-up{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:none}}
        @keyframes ks-in-l{from{opacity:0;transform:translateX(-50px)}to{opacity:1;transform:none}}
        @keyframes ks-in-t{from{opacity:0;transform:translateY(-30px)}to{opacity:1;transform:none}}

        .ks-a{animation:ks-up .8s cubic-bezier(.16,1,.3,1) both}
        .ks-photo{animation:ks-in-t 1s cubic-bezier(.16,1,.3,1) .1s both}
        @media(min-width:1024px){.ks-photo{animation-name:ks-in-l}}
        @media(prefers-reduced-motion:reduce){*,*::before,*::after{animation:none!important}}

        .ks-h1{
          font-size:clamp(28px, 6.5vw, 44px);
          font-weight:800;
          line-height:1.15;
          letter-spacing:-0.02em;
        }
        @media(min-width:1024px){
          .ks-h1{font-size:clamp(30px, 3.5vw, 48px);line-height:1.2;letter-spacing:-0.015em}
        }
        .ks-h1 span{
          display:block;
          font-size:1em;
          font-weight:inherit;
          letter-spacing:inherit;
          line-height:inherit;
        }
        .ks-h1-purple{color:${ACCENT}}
        .ks-h1-dark{color:#1A0B33}
      `}</style>

      <div className="mx-auto max-w-[1700px] px-4 py-6 sm:px-6 lg:px-8">
        {/* ONE CARD holding both the photo and the text (same design as the seller page) */}
        <section
          className="relative overflow-hidden rounded-[32px] lg:min-h-[760px]"
          style={{ backgroundColor: TINT }}
        >
          {/* LEFT: SLANTED PHOTO (top on mobile) */}
          <RiderPhoto />

          {/* RIGHT: TEXT. Starts at 40% so it sits right next to the slanted edge */}
          <div className="relative z-10 flex flex-col justify-center px-6 pb-10 pt-8 sm:px-10 lg:ml-[40%] lg:min-h-[760px] lg:w-[60%] lg:py-16 lg:pl-12 lg:pr-[4vw]">
            <h1 className="ks-a ks-h1" style={{ animationDelay: ".15s" }}>
              <span className="ks-h1-purple">Deliver for thousands of</span>
              <span className="ks-h1-dark">local vendors and shoppers</span>
            </h1>

            <div className="ks-a mt-4 w-full max-w-[640px] lg:mt-6" style={{ animationDelay: ".3s" }}>
              <p
                className="mb-6 font-normal text-[#24133F]/80"
                style={{
                  fontSize: "clamp(15px, 1.4vw, 18px)",
                  lineHeight: 1.65,
                }}
              >
                Grow your earnings with Koombo. Partner with local vendors, deliver packages safely, and get paid for every
                successful drop-off you make.
              </p>

              <button
                type="button"
                onClick={() => {
                  if (onRegisterClick) {
                    onRegisterClick();
                    return;
                  }
                  window.location.href = "/rider";
                }}
                className="inline-flex w-full items-center justify-center rounded-full bg-[#5B21B6] text-center font-semibold text-white shadow-md shadow-[#5B21B6]/25 transition hover:-translate-y-0.5 hover:bg-[#4C1D95] active:scale-[.98] sm:w-auto"
                style={{
                  minHeight: "clamp(48px, 3.6vw, 54px)",
                  padding: "8px clamp(24px, 2.4vw, 32px)",
                  fontSize: "clamp(15px, 1.3vw, 16px)",
                  letterSpacing: "-0.005em",
                }}
              >
                Register as a delivery partner
              </button>

              <p
                className="mt-4 font-medium text-[#24133F]/60"
                style={{ fontSize: "clamp(13px, 1.2vw, 15px)" }}
              >
                Flexible hours. Weekly payouts. Start earning today.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
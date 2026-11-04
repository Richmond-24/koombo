"use client";

import { useState } from "react";
import Link from "next/link";

function SellerPhoto() {
  const [ok, setOk] = useState(true);
  return (
    <div className="ks-photo relative h-[340px] w-full overflow-hidden bg-[#5B21B6] [clip-path:ellipse(120%_100%_at_50%_100%)] sm:h-[420px] lg:absolute lg:right-0 lg:top-0 lg:h-full lg:w-[45%] lg:[clip-path:ellipse(100%_85%_at_100%_50%)]">
      {ok ? (
        <img
          src="/june.jpg"
          alt="Koombo sellers in their shop"
          onError={() => setOk(false)}
          className="absolute inset-0 h-full w-full select-none object-cover object-[center_30%]"
          draggable={false}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#8B5CF6] via-[#6D28D9] to-[#24133F]">
          <img src="/left.png" alt="" className="absolute left-[6%] top-[4%] w-[62%] select-none" draggable={false} />
          <img src="/right.png" alt="" className="absolute bottom-0 right-0 w-[46%] select-none" draggable={false} />
        </div>
      )}
    </div>
  );
}

export default function KoomboSellerSignup() {
  return (
    <main
      id="vendors"
      className="relative min-h-screen w-full overflow-hidden bg-[#F3EFFF] text-[#24133F] antialiased"
      style={{
        fontFamily:
          "'Airbnb Cereal VF','Airbnb Cereal',Circular,-apple-system,BlinkMacSystemFont,Roboto,'Helvetica Neue','DM Sans',Inter,system-ui,sans-serif",
      }}
    >
      <style>{`
        @keyframes ks-up{from{opacity:0;transform:translateY(34px)}to{opacity:1;transform:none}}
        @keyframes ks-in-r{from{opacity:0;transform:translateX(70px)}to{opacity:1;transform:none}}
        @keyframes ks-in-b{from{opacity:0;transform:translateY(70px)}to{opacity:1;transform:none}}
        .ks-a{opacity:0;animation:ks-up .8s cubic-bezier(.16,1,.3,1) forwards}
        .ks-photo{animation:ks-in-b 1s cubic-bezier(.16,1,.3,1) .2s both}
        @media(min-width:1024px){.ks-photo{animation-name:ks-in-r}}
        @media(prefers-reduced-motion:reduce){*{animation:none!important}.ks-a{opacity:1}}
      `}</style>

      <div className="relative">
        {/* LEFT: headline + seller registration link */}
        <div className="relative z-10 flex min-h-screen flex-col justify-center px-6 pb-10 pt-12 sm:px-10 lg:pl-[7vw] lg:pr-0">
          {/* Airbnb heading scale: 32/36 mobile, 44/48 tablet, 56/60 desktop, semibold, tight tracking */}
          <h1
            className="ks-a text-[32px] font-semibold leading-[36px] tracking-[-0.02em] sm:text-[44px] sm:leading-[48px] lg:max-w-[44vw] lg:text-[56px] lg:leading-[60px] lg:tracking-[-0.03em]"
            style={{ animationDelay: ".1s" }}
          >
            <span className="block text-[#6D28D9]">Reach millions of shoppers</span>
            <span className="block text-[#24133F]">who value the convenience of seamless social shopping</span>
          </h1>

          <div
            className="ks-a mt-6 w-full max-w-[588px] lg:mt-8 lg:w-[min(588px,44vw)] lg:max-w-none"
            style={{ animationDelay: ".3s" }}
          >
            {/* Airbnb body: 16/20 mobile, 18/24 desktop, regular weight, muted */}
            <p className="mb-8 max-w-lg text-[16px] font-normal leading-[22px] text-[#24133F]/70 sm:text-[18px] sm:leading-[26px]">
              Join a trusted marketplace designed for your growth. Enjoy zero hassle, powerful selling tools, and a
              community that makes growing your business simple and rewarding.
            </p>

            {/* Airbnb button: 16px semibold, 8px radius, ~48px tall */}
            <Link
              href="/lister"
              className="inline-flex h-12 w-full items-center justify-center rounded-lg bg-[#5B21B6] px-6 text-[16px] font-semibold leading-5 text-white transition hover:bg-[#4C1D95] active:scale-[.97] sm:w-auto"
            >
              Fill seller registration form
            </Link>
          </div>
        </div>

        {/* RIGHT: curved photo */}
        <SellerPhoto />
      </div>
    </main>
  );
}
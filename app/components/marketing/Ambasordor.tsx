"use client";

import { useState } from "react";
import { useRouter } from 'next/navigation';

export default function KoomboConnector({ onJoinClick }: { onJoinClick?: () => void }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const router = useRouter();

  const handleJoin = () => {
    try {
      if (typeof onJoinClick === 'function') onJoinClick();
    } catch (e) {
      /* ignore */
    }
    router.push('/lister/connectors');
  };

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-[#F3EFFF]">
      <style>{`
        @keyframes kc-up{from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:none}}
        @keyframes kc-fade{from{opacity:0}to{opacity:1}}
        .kc-a{opacity:0;animation:kc-up .9s cubic-bezier(.16,1,.3,1) forwards}
        .kc-fade{animation:kc-fade .6s ease-out forwards}
        .kc-display{font-family:'Anton','Oswald',Impact,'Arial Narrow',sans-serif;text-transform:uppercase;letter-spacing:.01em}
        @media(prefers-reduced-motion:reduce){*{animation:none!important}.kc-a{opacity:1}}
      `}</style>

      {/* Background decorative elements */}
      <div className="pointer-events-none absolute -left-32 top-20 h-96 w-96 rounded-full bg-[#8B5CF6]/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-[40%] h-[500px] w-[500px] rounded-full bg-[#5B21B6]/15 blur-3xl" />

      <div id="connect" className="relative mx-auto flex min-h-screen max-w-7xl items-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid w-full items-center gap-12 lg:grid-cols-2 lg:gap-16">
          
          {/* LEFT: Image Side */}
          <div className="kc-a order-2 lg:order-1" style={{ animationDelay: ".2s" }}>
            <div className="relative">
              {/* Main image container with rounded corners */}
              <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#5B21B6] to-[#8B5CF6] p-1.5 shadow-2xl">
                <div className="relative overflow-hidden rounded-[1.75rem] bg-white">
                  {!imageLoaded && (
                    <div className="flex h-[400px] w-full items-center justify-center bg-gradient-to-br from-[#F3EFFF] to-[#D4E9EB] sm:h-[500px]">
                      <div className="text-center">
                        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#6D28D9]/10">
                          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#6D28D9" strokeWidth="1.5">
                            <rect x="2" y="7" width="20" height="14" rx="2" />
                            <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                            <path d="M12 12v6" />
                            <path d="M9 15h6" />
                          </svg>
                        </div>
                        <p className="text-sm font-semibold text-[#24133F]">Koombo Connector Partner</p>
                        <p className="mt-1 text-xs text-[#24133F]/60">Image loading...</p>
                      </div>
                    </div>
                  )}
                  
                  <img
                    src="/hero/koombo-connect.jpg"
                    alt="Koombo Connector Partner earning commission"
                    onLoad={() => setImageLoaded(true)}
                    onError={() => setImageLoaded(true)}
                    className={`h-[400px] w-full object-cover object-center sm:h-[500px] ${imageLoaded ? 'kc-fade' : 'hidden'}`}
                  />

                  {/* Overlay badge */}
                  <div className="absolute bottom-4 left-4 right-4 rounded-xl bg-white/95 p-4 shadow-lg backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#5B21B6] to-[#8B5CF6] text-white">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#24133F]">Earn Commission</p>
                        <p className="text-[10px] text-[#24133F]/60">On every transaction</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating stats card */}
              <div className="absolute -right-4 top-8 hidden rounded-2xl bg-white p-4 shadow-xl sm:block lg:-right-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FFC20E]/20">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="#FFC20E">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-2xl font-black text-[#24133F]">Up to 15%</p>
                    <p className="text-xs text-[#24133F]/60">Commission Rate</p>
                  </div>
                </div>
              </div>

              {/* Floating success card */}
              <div className="absolute -bottom-6 -left-4 hidden rounded-2xl bg-white p-4 shadow-xl sm:block lg:-left-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#6D28D9]/10">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6D28D9" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <path d="M22 4 12 14.01l-3-3" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-[#24133F]">Verified</p>
                    <p className="text-xs text-[#24133F]/60">Trusted Partner</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Text Side */}
          <div className="kc-a order-1 lg:order-2" style={{ animationDelay: ".1s" }}>
            {/* Badge */}
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#5B21B6]/20 bg-white px-4 py-2 shadow-sm">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#8B5CF6]" />
              <span className="text-xs font-bold uppercase tracking-[0.15em] text-[#5B21B6]">Koombo Connector</span>
            </div>

            {/* Main heading */}
            <h1 className="kc-display text-[clamp(32px,4.5vw,56px)] font-black leading-[1.05] tracking-tight text-[#24133F]">
              Become a Koombo{" "}
              <span className="bg-gradient-to-r from-[#5B21B6] to-[#8B5CF6] bg-clip-text text-transparent">
                Connector
              </span>{" "}
              Today
            </h1>

            {/* Subheading */}
            <p className="mt-4 text-lg font-medium text-[#24133F]/80 sm:text-xl">
              Bring in business and earn commission on every successful transaction made through your network.
            </p>

            {/* Key benefits */}
            <div className="mt-8 space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#6D28D9]/10 text-[#6D28D9]">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-[#24133F]">Earn Commission</h3>
                  <p className="mt-1 text-sm text-[#24133F]/65">Get paid on every successful transaction from vendors and shoppers you bring to Koombo</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#8B5CF6]/10 text-[#8B5CF6]">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-[#24133F]">Grow Your Network</h3>
                  <p className="mt-1 text-sm text-[#24133F]/65">Onboard vendors, sellers, and shoppers to build your earning potential</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FFC20E]/20 text-[#FF8A00]">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-[#24133F]">Track Everything</h3>
                  <p className="mt-1 text-sm text-[#24133F]/65">Real-time dashboard to monitor your referrals, transactions, and earnings</p>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <button
                type="button"
                onClick={handleJoin}
                className="group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-full bg-[#5B21B6] px-8 py-4 text-base font-bold text-white shadow-xl shadow-[#5B21B6]/25 transition-all hover:-translate-y-0.5 hover:bg-[#4C1D95] active:scale-[0.98] sm:text-lg"
              >
                <span className="relative">Join Koombo Connector Now</span>
                <svg 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  className="transition-transform group-hover:translate-x-1"
                >
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </button>
              
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#5B21B6]/20 bg-white px-8 py-4 text-base font-bold text-[#5B21B6] transition-all hover:border-[#5B21B6]/40 hover:bg-[#5B21B6]/5 active:scale-[0.98] sm:text-lg"
              >
                Learn More
              </button>
            </div>

            {/* Trust indicators */}
            <div className="mt-8 flex items-center gap-6 text-xs text-[#24133F]/55">
              <div className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
                <span>Secure & Verified</span>
              </div>
              <div className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
                <span>Instant Payouts</span>
              </div>
              <div className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                <span>60M+ Users</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
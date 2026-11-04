'use client';

import Link from "next/link";
import SiteHeader from "../components/SiteHeader";
import KoomboFooter from "../components/Footer";

const LOGO_SRC = "/koombo-logo.png";
const BG_SRC = "/bb.png";

export default function SellerGateway() {
  return (
    <div className="min-h-screen bg-white">
      <SiteHeader ctaLabel="Become a Vendor" />

      <section className="relative isolate min-h-screen overflow-hidden bg-white pt-[120px]">
        <div className="absolute inset-0 lg:inset-y-0 lg:left-0 lg:right-1/2">
          <img
            src={BG_SRC}
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1B0B3A]/90 via-[#2A0F5C]/70 to-transparent lg:bg-gradient-to-r lg:from-[#1B0B3A]/80 lg:via-[#2A0F5C]/60 lg:to-[#1B0B3A]/40" />
        </div>

        <div className="relative">
          <div className="absolute inset-0 hidden lg:flex lg:flex-col lg:justify-center lg:px-12">
            <div className="max-w-xl">
              <h1 className="text-6xl font-black leading-[0.95] tracking-tight text-white">
                SELL WITH
                <br />
                <span className="text-[#FDE047]">CONFIDENCE</span>
              </h1>
              <p className="mt-6 text-xl text-white/90 leading-relaxed">
                Peace of mind while selling is essential. That includes knowing that you can easily get help when you need it. And while we hope every sale goes smoothly, we’ve got your back if things don’t go as planned.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                {['Instant Listings', 'Secure Payments', '24/7 Support'].map((chip) => (
                  <span
                    key={chip}
                    className="rounded-full border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-md"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="relative min-h-screen bg-[#FEF9C3] lg:ml-auto lg:w-1/2 lg:min-h-screen">
            <div className="flex min-h-screen flex-col justify-center px-6 py-16 sm:px-12 lg:px-16 xl:px-20">
              <div className="mb-8 lg:hidden">
                <img
                  src={LOGO_SRC}
                  alt="Koombo"
                  className="h-10 w-auto"
                  style={{ filter: 'brightness(0) saturate(100%) invert(15%) sepia(78%) saturate(3574%) hue-rotate(256deg) brightness(83%) contrast(102%)' }}
                />
              </div>

              <div className="mb-10 lg:hidden">
                <h1 className="text-4xl font-black leading-tight tracking-tight text-[#1B0B3A]">
                  SELL WITH
                  <br />
                  <span className="text-[#5B21B6]">CONFIDENCE</span>
                </h1>
                <p className="mt-4 text-base text-stone-600 leading-relaxed">
                  Join thousands of sellers on Koombo. List products, connect with buyers, and grow your business with our powerful platform.
                </p>
              </div>

              <div className="space-y-4">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-[#1B0B3A] sm:text-3xl">
                    Get started today
                  </h2>
                  <p className="mt-2 text-stone-600">
                    Choose your path to start selling on Koombo
                  </p>
                </div>

                <Link
                  href="/seller/signin"
                  className="group flex w-full items-center justify-between rounded-2xl bg-[#DC2626] p-6 text-left text-white shadow-lg shadow-red-600/20 transition-all duration-200 hover:-translate-y-1 hover:bg-[#B91C1C] hover:shadow-xl hover:shadow-red-600/30 active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-red-500/30"
                >
                  <div className="flex items-center gap-4">
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    </span>
                    <div>
                      <span className="block text-lg font-bold">Already a seller?</span>
                      <span className="block text-sm text-white/90">Sign in to your dashboard</span>
                    </div>
                  </div>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-1">
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </Link>

                <Link
                  href="/lister/setup"
                  className="group flex w-full items-center justify-between rounded-2xl border-2 border-[#5B21B6] bg-white p-6 text-left text-[#1B0B3A] shadow-lg transition-all duration-200 hover:-translate-y-1 hover:bg-[#5B21B6] hover:text-white hover:shadow-xl active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-[#5B21B6]/30"
                >
                  <div className="flex items-center gap-4">
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#EDE9FE] text-[#5B21B6] transition-colors group-hover:bg-white/20 group-hover:text-white">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                    </span>
                    <div>
                      <span className="block text-lg font-bold">First time selling?</span>
                      <span className="block text-sm text-stone-600 group-hover:text-white/90">Create your seller account</span>
                    </div>
                  </div>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-stone-400 transition-all group-hover:translate-x-1 group-hover:text-white">
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </Link>

                <p className="mt-8 text-center text-sm text-stone-600">
                  Looking to buy instead?{' '}
                  <a href="/" className="font-semibold text-[#5B21B6] underline-offset-4 transition hover:underline">
                    Browse products
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <KoomboFooter />
    </div>
  );
}
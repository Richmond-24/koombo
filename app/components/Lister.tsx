'use client';

import { useState, FormEvent } from "react";
import { getSellerAppUrl } from "../../lib/seller-app-url";

const LOGO_SRC = "/koombo-logo.png";
const BG_SRC = "/bb.png";

export default function SellerGateway({
  apiBaseUrl,
  onNewSeller,
}: {
  apiBaseUrl: string;
  onNewSeller: () => void;
}) {
  const [view, setView] = useState<"choose" | "signin">("choose");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const canSubmit =
    /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/.test(email.trim()) && password.length >= 1;

  const handleSignIn = async (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmit || loading) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${apiBaseUrl}/api/sellers/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      });
      const data = await res.json().catch(() => null);
      const id = data?.seller?.id || data?.seller?._id;
      if (!res.ok || !data?.token || !id) {
        throw new Error(
          data?.error || data?.message || "Email or password is incorrect."
        );
      }
      try {
        window.localStorage.setItem("seller_id", String(id));
      } catch {}
      const path = `/sellers/${encodeURIComponent(String(id))}#seller_token=${encodeURIComponent(String(data.token))}`;
      window.location.assign(getSellerAppUrl(path));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not sign in. Try again.");
      setLoading(false);
    }
  };

  const input =
    "mt-2 w-full rounded-xl border border-stone-200 bg-white text-stone-900 outline-none transition placeholder:text-stone-400 hover:border-stone-300 focus:border-[#5B21B6] focus:ring-4 focus:ring-[#5B21B6]/15";

  return (
    <section className="relative isolate min-h-screen overflow-hidden bg-white">
      <style jsx global>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: none; }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out both;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-fade-in-up { animation: none; opacity: 1; }
        }
      `}</style>

      {/* BACKGROUND IMAGE - Full screen left side */}
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

      {/* MAIN CONTENT */}
      <div className="relative">
        {/* Left side overlay content - hidden on mobile, visible on lg */}
        <div className="absolute inset-0 hidden lg:flex lg:flex-col lg:justify-center lg:px-12 lg:pt-0">
          <div className="max-w-xl animate-fade-in-up">
            <h1 className="text-6xl font-black leading-[0.95] tracking-tight text-white">
              SELL WITH
              <br />
              <span className="text-[#FDE047]">CONFIDENCE</span>
            </h1>
            <p className="mt-6 text-xl text-white/90 leading-relaxed">
              Peace of mind while selling is essential. That includes knowing that you can easily get help when you need it. And while we hope every sale goes smoothly, we've got your back if things don't go as planned.
            </p>
            
            {/* Feature chips */}
            <div className="mt-8 flex flex-wrap gap-3">
              {["Instant Listings", "Secure Payments", "24/7 Support"].map((chip, i) => (
                <span
                  key={chip}
                  className="rounded-full border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-md"
                  style={{ animationDelay: `${0.2 + i * 0.1}s` }}
                >
                  {chip}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right side - Yellow background with buttons */}
        <div className="relative min-h-screen bg-[#FEF9C3] lg:ml-auto lg:w-1/2 lg:min-h-screen">
          <div className="flex min-h-screen flex-col justify-center px-6 py-16 sm:px-12 lg:px-16 xl:px-20">
            
            {/* Mobile logo - hidden on lg */}
            <div className="mb-8 lg:hidden">
              <img
                src={LOGO_SRC}
                alt="Koombo"
                className="h-10 w-auto"
                style={{ filter: 'brightness(0) saturate(100%) invert(15%) sepia(78%) saturate(3574%) hue-rotate(256deg) brightness(83%) contrast(102%)' }}
              />
            </div>

            {/* Mobile headline */}
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

            {/* Desktop spacing adjustment */}
            <div className="hidden lg:block lg:mb-12" />

            {view === "choose" ? (
              <div className="animate-fade-in-up space-y-4">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-[#1B0B3A] sm:text-3xl">
                    Get started today
                  </h2>
                  <p className="mt-2 text-stone-600">
                    Choose your path to start selling on Koombo
                  </p>
                </div>

                {/* Already a Seller Button */}
                <button
                  type="button"
                  onClick={() => {
                    setView("signin");
                    setError("");
                  }}
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
                      <span className="block text-lg font-bold">
                        Already a seller?
                      </span>
                      <span className="block text-sm text-white/90">
                        Sign in to your dashboard
                      </span>
                    </div>
                  </div>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-1">
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </button>

                {/* First Time Button */}
                <button
                  type="button"
                  onClick={onNewSeller}
                  className="group flex w-full items-center justify-between rounded-2xl border-2 border-[#5B21B6] bg-white p-6 text-left text-[#1B0B3A] shadow-lg transition-all duration-200 hover:-translate-y-1 hover:bg-[#5B21B6] hover:text-white hover:shadow-xl active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-[#5B21B6]/30"
                >
                  <div className="flex items-center gap-4">
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#EDE9FE] text-[#5B21B6] transition-colors group-hover:bg-white/20 group-hover:text-white">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                    </span>
                    <div>
                      <span className="block text-lg font-bold">
                        First time selling?
                      </span>
                      <span className="block text-sm text-stone-600 group-hover:text-white/90">
                        Create your seller account
                      </span>
                    </div>
                  </div>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-stone-400 transition-all group-hover:translate-x-1 group-hover:text-white">
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </button>

                <p className="mt-8 text-center text-sm text-stone-600">
                  Looking to buy instead?{" "}
                  <a href="/" className="font-semibold text-[#5B21B6] underline-offset-4 transition hover:underline">
                    Browse products
                  </a>
                </p>
              </div>
            ) : (
              <form onSubmit={handleSignIn} noValidate className="animate-fade-in-up">
                <button
                  type="button"
                  onClick={() => {
                    setView("choose");
                    setError("");
                  }}
                  className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-stone-600 transition-colors hover:text-[#1B0B3A]"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m15 18-6-6 6-6" />
                  </svg>
                  Back to options
                </button>

                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-[#1B0B3A]">
                    Welcome back
                  </h2>
                  <p className="mt-2 text-stone-600">
                    Sign in to continue selling on Koombo
                  </p>
                </div>

                {error && (
                  <div className="mb-6 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm font-semibold text-red-700">
                    {error}
                  </div>
                )}

                <div className="space-y-5">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#1B0B3A]">
                      Email address
                    </label>
                    <input
                      autoFocus
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setError("");
                      }}
                      placeholder="you@example.com"
                      className={`${input} h-12 px-4`}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#1B0B3A]">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPw ? "text" : "password"}
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          setError("");
                        }}
                        placeholder="Your password"
                        className={`${input} h-12 pr-24 px-4`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPw((s) => !s)}
                        aria-pressed={showPw}
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg px-3 py-1.5 text-sm font-semibold text-stone-600 transition-colors hover:bg-stone-100"
                      >
                        {showPw ? "Hide" : "Show"}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={!canSubmit || loading}
                    className="mt-8 flex w-full items-center justify-center rounded-xl bg-[#DC2626] py-4 text-base font-bold text-white shadow-lg shadow-red-600/20 transition-all hover:-translate-y-0.5 hover:bg-[#B91C1C] hover:shadow-xl hover:shadow-red-600/30 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Signing in...
                      </span>
                    ) : (
                      "Sign in"
                    )}
                  </button>

                  <p className="mt-6 text-center text-sm text-stone-600">
                    Don't have an account?{" "}
                    <button
                      type="button"
                      onClick={onNewSeller}
                      className="font-semibold text-[#5B21B6] underline-offset-4 transition hover:underline"
                    >
                      Create seller account
                    </button>
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
"use client";

import { useEffect, useMemo, useRef, useState, ReactNode } from "react";
import Link from "next/link";
import Onboarding from "./Onboarding";
import GoogleButton from "../GoogleButton";
import { getSellerAppUrl } from "../../../lib/seller-app-url";
import { GOOGLE_CLIENT_ID } from "../../../lib/auth-config";
import { Home, Info, Users, Phone, LogIn, ShoppingBag } from "lucide-react";
import SiteHeader from "../SiteHeader";
import { connectSellerTelegram, createConnectNonce, fetchTelegramConfig, openTelegramDeepLink, pollTelegramConnect } from "../../../lib/telegram-connect";

/* ============ CONFIG (deep teal blue: #5B21B6 / hover #4C1D95 / dark #24133F) ============ */
const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE ||
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  (process.env.NODE_ENV === "development" ? "http://localhost:5000" : "https://unimart-backend-2.onrender.com")
).replace(/\/+$/, "").replace(/\/api$/i, "");

interface SellerFormData { fullName: string; businessName: string; phone: string; email: string; password: string; location: string; categories: string[]; sellerType: string }
type CredentialMethod = "email" | "google";

const CATEGORIES = ["Fashion", "Electronics", "Phones & Accessories", "Food", "Books", "Beauty", "Home & Furniture", "Services", "Sports", "Other"];
const LOCATIONS = ["Sunyani", "Kumasi", "Accra", "Takoradi", "Cape Coast", "Tamale", "Other"];

/* ============ ICONS ============ */
const ico = (d: string, size = 20, fill = false, sw = 2.5) => () => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill ? "currentColor" : "none"} stroke={fill ? "none" : "currentColor"} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>
);
const Icons = {
  ChevronRight: ico("m9 18 6-6-6-6"),
  ChevronLeft: ico("m15 18-6-6 6-6"),
  ChevronDown: ico("m6 9 6 6 6-6", 18),
  Check: ico("M20 6 9 17l-5-5", 18, false, 3),
  User: ico("M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8", 22, false, 2),
  Store: ico("M3 9l1-5h16l1 5M5 9v11h14V9M9 20v-5h6v5", 22, false, 2),
  Telegram: ico("M21.7 3.2 18.4 20c-.2 1.2-.9 1.5-1.8.9l-5-3.7-2.4 2.3c-.3.3-.5.5-1 .5l.4-5.1 9.3-8.4c.4-.4-.1-.6-.6-.2L5.8 13.6.9 12c-1.1-.3-1.1-1.1.2-1.6L20.3 3c.9-.3 1.7.2 1.4.2Z", 20, true),
  Message: ico("M21 11.5a8.4 8.4 0 0 1-9 8.5 9.5 9.5 0 0 1-4-.9L3 21l1.9-4.7A8.2 8.2 0 0 1 3 11.5 8.5 8.5 0 1 1 21 11.5Z", 21, false, 2),
  Camera: ico("M15 18H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2l1.2-2h5.6L14 6h1a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2ZM12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8", 22, false, 2),
  Shield: ico("M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10ZM9 12l2 2 4-4", 20, false, 2),
  ArrowUpRight: ico("M7 17 17 7M7 7h10v10", 18),
  Sparkles: ico("m12 3-1.4 4.1L7 8.5l3.6 1.4L12 14l1.4-4.1L17 8.5l-3.6-1.4L12 3Z", 20, false, 2),
  Image: ico("M4 5h16v14H4zM4 16l5-5 4 4 2-2 5 5M9 9.5a1 1 0 1 0 2 0 1 1 0 0 0-2 0", 26, false, 1.8),
};

/* ============ ANIMATION ============ */
function useInView() {
  const ref = useRef<HTMLDivElement>(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const o = new IntersectionObserver(([e]) => setV(e.isIntersecting), { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    o.observe(el);
    return () => o.disconnect();
  }, []);
  return [ref, v] as const;
}

function FadeIn({ children, delay = 0, className = "", from = "up" }: { children: ReactNode; delay?: number; className?: string; from?: "up" | "left" | "right" | "scale" }) {
  const [ref, v] = useInView();
  const hidden = { up: "translate-y-10", left: "-translate-x-10", right: "translate-x-10", scale: "scale-90" }[from];
  return (
    <div ref={ref} style={{ transitionDelay: `${delay}ms` }} className={`transition-all duration-[900ms] ease-[cubic-bezier(.16,1,.3,1)] ${v ? "opacity-100 translate-x-0 translate-y-0 scale-100" : `opacity-0 ${hidden}`} ${className}`}>
      {children}
    </div>
  );
}

/* ============ BOT ICON ============ */
function ModernBotIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none">
      <defs><linearGradient id="botGradient" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#8B5CF6" /><stop offset="100%" stopColor="#5B21B6" /></linearGradient></defs>
      <rect x="15" y="20" width="70" height="60" rx="20" fill="url(#botGradient)" />
      <rect x="25" y="30" width="50" height="35" rx="12" fill="white" fillOpacity=".9" />
      <circle cx="38" cy="47" r="4" fill="#5B21B6" /><circle cx="62" cy="47" r="4" fill="#5B21B6" />
      <rect x="42" y="56" width="16" height="4" rx="2" fill="#5B21B6" fillOpacity=".6" />
      <path d="M50 20V10" stroke="white" strokeWidth="4" strokeLinecap="round" /><circle cx="50" cy="8" r="4" fill="#8B5CF6" />
    </svg>
  );
}

/* ============ BRAND MARQUEE ============ */
function BrandMarquee() {
  const brands = ["NIKE", "adidas", "Apple", "GUCCI", "DIOR", "Samsung", "PUMA"];
  return (
    <section className="bg-white border-b border-slate-100 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-10">
        <p className="text-xs font-bold uppercase tracking-[.2em] text-[#5B21B6]">Trusted Brands</p>
        <h2 className="mt-1 mb-6 text-xl sm:text-2xl font-extrabold tracking-tight">Shop from your favorite brands</h2>
        <div className="relative overflow-hidden">
          <div className="flex whitespace-nowrap animate-marquee">
            {[...brands, ...brands, ...brands].map((b, i) => (
              <span key={i} className="mx-8 sm:mx-12 text-2xl font-black tracking-tight text-[#5B21B6] opacity-60 hover:opacity-100 transition-opacity">{b}</span>
            ))}
          </div>
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent pointer-events-none" />
        </div>
      </div>
    </section>
  );
}

/* ============ SELLER SETUP INTRO (Figma-style welcome screen) ============ */
function SellerIntro({ onStart }: { onStart: () => void }) {
  const perks = ["Free to join", "Takes about 2 minutes", "Go live today"];

  return (
    <section className="px-4 pb-14 pt-[104px] sm:px-6 sm:pt-[116px] lg:pb-20">
      <div className="mx-auto grid max-w-6xl items-center gap-10 rounded-[28px] border border-[#E4DFF0] bg-white p-5 shadow-[0_30px_80px_-40px_rgba(36,19,63,0.35)] sm:gap-12 sm:rounded-[36px] sm:p-10 lg:grid-cols-[1.05fr_.95fr] lg:gap-16 lg:p-14">
        {/* ---------- TEXT SIDE ---------- */}
        <div className="text-center lg:text-left">
          <p className="animate-fade-in-up inline-flex items-center gap-2 rounded-full bg-[#F3EFFF] px-4 py-2 text-xs font-bold text-[#5B21B6] sm:text-sm">
            <Icons.Sparkles /> First time on Koombo
          </p>

          <h1
            className="animate-fade-in-up mt-5 text-[2.15rem] font-extrabold leading-[1.08] tracking-[-0.04em] text-[#12161C] min-[400px]:text-[2.4rem] sm:text-5xl lg:text-[3.4rem]"
            style={{ fontFamily: "'DM Sans', 'Inter', sans-serif", animationDelay: ".08s", opacity: 0 }}
          >
            Set up your seller account
          </h1>

          <p
            className="animate-fade-in-up mx-auto mt-4 max-w-md text-[15px] leading-7 text-slate-500 sm:text-lg sm:leading-8 lg:mx-0"
            style={{ animationDelay: ".16s", opacity: 0 }}
          >
            New to Koombo? Tell us about you and your shop, connect Telegram for buyer chats, and you are ready to start selling.
          </p>

          <div className="animate-fade-in-up mt-7 sm:mt-9" style={{ animationDelay: ".24s", opacity: 0 }}>
            <button
              type="button"
              onClick={onStart}
              className="group inline-flex h-14 w-full max-w-sm items-center justify-center gap-2 rounded-2xl bg-[#5B21B6] px-10 text-lg font-bold text-white shadow-lg shadow-[#5B21B6]/30 transition-all hover:-translate-y-0.5 hover:bg-[#4C1D95] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#5B21B6]/30 active:scale-[0.98] sm:w-auto"
            >
              Start
              <span className="transition-transform duration-200 group-hover:translate-x-1"><Icons.ChevronRight /></span>
            </button>
          </div>

          <ul
            className="animate-fade-in-up mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm font-semibold text-slate-500 lg:justify-start"
            style={{ animationDelay: ".32s", opacity: 0 }}
          >
            {perks.map((p) => (
              <li key={p} className="inline-flex items-center gap-1.5">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-[#F3EFFF] text-[#5B21B6]"><Icons.Check /></span>
                {p}
              </li>
            ))}
          </ul>
        </div>

        {/* ---------- FIGMA-STYLE DESIGN FRAME ---------- */}
        <div className="animate-fade-in-up relative mx-auto w-full max-w-[420px] pb-6 pt-8" style={{ animationDelay: ".2s", opacity: 0 }} aria-hidden="true">
          {/* frame name tag, like the label above a Figma frame */}
          <span className="absolute left-0 top-0 rounded-md bg-[#5B21B6] px-2.5 py-1 text-[11px] font-semibold text-white">
            Seller setup
          </span>

          {/* selection box with corner handles */}
          <div className="relative rounded-[22px] border-[1.5px] border-[#5B21B6] p-2.5 sm:p-3">
            {["-left-1.5 -top-1.5", "-right-1.5 -top-1.5", "-bottom-1.5 -left-1.5", "-bottom-1.5 -right-1.5"].map((pos) => (
              <span key={pos} className={`absolute ${pos} h-2.5 w-2.5 rounded-[2px] border-[1.5px] border-[#5B21B6] bg-white`} />
            ))}

            <div className="overflow-hidden rounded-[16px] bg-[#F7F5FD] ring-1 ring-[#E4DFF0]">
              {/* window bar */}
              <div className="flex items-center justify-between bg-[#24133F] px-4 py-3">
                <span className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-white/30" />
                  <span className="h-2.5 w-2.5 rounded-full bg-white/30" />
                  <span className="h-2.5 w-2.5 rounded-full bg-white/30" />
                </span>
                <span className="text-[11px] font-semibold text-white/70">Step 1 of 7</span>
              </div>

              <div className="space-y-3 p-4 sm:p-5">
                {/* progress */}
                <div className="flex gap-1.5">
                  <span className="h-1.5 flex-[2] rounded-full bg-[#5B21B6]" />
                  <span className="h-1.5 flex-1 rounded-full bg-[#DDD6F3]" />
                  <span className="h-1.5 flex-1 rounded-full bg-[#DDD6F3]" />
                </div>

                {/* profile card */}
                <div className="flex items-center gap-3 rounded-2xl bg-white p-3 ring-1 ring-[#E4DFF0]">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#F3EFFF] text-[#5B21B6]"><Icons.User /></span>
                  <div className="min-w-0 flex-1 space-y-1.5">
                    <span className="block h-2.5 w-3/4 rounded-full bg-[#12161C]/80" />
                    <span className="block h-2 w-1/2 rounded-full bg-[#DDD6F3]" />
                  </div>
                  <span className="rounded-full bg-[#F3EFFF] px-2.5 py-1 text-[10px] font-bold text-[#5B21B6]">You</span>
                </div>

                {/* business field */}
                <div className="rounded-2xl bg-white p-3 ring-1 ring-[#E4DFF0]">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Business name</p>
                  <div className="mt-1.5 flex items-center gap-2 rounded-lg border border-[#5B21B6]/40 bg-[#F7F5FD] px-3 py-2.5">
                    <span className="text-[#5B21B6]"><Icons.Store /></span>
                    <span className="truncate text-sm font-semibold text-[#12161C]">{"Richy's Fashion"}</span>
                    <span className="ml-auto h-4 w-px animate-pulse bg-[#5B21B6]" />
                  </div>
                </div>

                {/* telegram row */}
                <div className="flex items-center gap-3 rounded-2xl bg-white p-3 ring-1 ring-[#E4DFF0]">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#0088cc] text-white"><Icons.Telegram /></span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-extrabold text-[#12161C]">Telegram</p>
                    <p className="text-[11px] text-slate-400">Buyer chats and alerts</p>
                  </div>
                  <span className="rounded-lg border border-[#5B21B6]/30 px-3 py-1.5 text-[11px] font-bold text-[#5B21B6]">Connect</span>
                </div>

                {/* fake continue button */}
                <div className="rounded-xl bg-[#5B21B6] py-3 text-center text-sm font-bold text-white">Continue</div>
              </div>
            </div>
          </div>

          {/* floating chips */}
          <div className="animate-gentle-bounce absolute -right-1 top-14 sm:-right-5">
            <div className="flex items-center gap-2 rounded-2xl bg-white px-3 py-2.5 shadow-[0_14px_30px_-10px_rgba(36,19,63,0.4)] ring-1 ring-[#E4DFF0]">
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-[#5B21B6] text-white"><Icons.Sparkles /></span>
              <span className="leading-tight">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-[#5B21B6]">Shuri AI</span>
                <span className="block text-xs font-extrabold text-[#12161C]">Listing ready</span>
              </span>
            </div>
          </div>

          <div className="animate-gentle-bounce absolute -left-1 bottom-16 sm:-left-5" style={{ animationDelay: "1s" }}>
            <div className="flex items-center gap-2 rounded-2xl bg-white px-3 py-2.5 shadow-[0_14px_30px_-10px_rgba(36,19,63,0.4)] ring-1 ring-[#E4DFF0]">
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-[#0088cc] text-white"><Icons.Telegram /></span>
              <span className="leading-tight">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-[#0088cc]">Instant</span>
                <span className="block text-xs font-extrabold text-[#12161C]">Order alert</span>
              </span>
            </div>
          </div>

          {/* Figma-style cursor with name tag */}
          <div className="animate-cursor absolute bottom-0 right-6 sm:right-2">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="#5B21B6" stroke="#fff" strokeWidth="1.6" strokeLinejoin="round">
              <path d="M4 3l16 7.5-7 2.5-2.5 7L4 3z" />
            </svg>
            <span className="-mt-1 ml-4 inline-block rounded-md rounded-tl-none bg-[#5B21B6] px-2 py-0.5 text-[10px] font-semibold text-white">New seller</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============ MAIN ============ */
export default function TelegramListPage() {
  const [showIntro, setShowIntro] = useState(true);
  const [step, setStep] = useState(1);
  const [subStep, setSubStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [credentialMethod, setCredentialMethod] = useState<CredentialMethod>(GOOGLE_CLIENT_ID ? "google" : "email");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [googleCredential, setGoogleCredential] = useState("");
  const [telegramConnectionToken, setTelegramConnectionToken] = useState<string | null>(null);
  const [telegramConnected, setTelegramConnected] = useState(false);
  const [telegramNotice, setTelegramNotice] = useState("");
  const [formData, setFormData] = useState<SellerFormData>({ fullName: "", businessName: "", phone: "", email: "", password: "", location: "", categories: [], sellerType: "" });
  const [telegramBotUsername, setTelegramBotUsername] = useState(() => (process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || "").replace(/^@/, "").trim());

  // The bot handle comes from the backend so the deep link always targets the
  // bot that owns the webhook/poller.
  useEffect(() => {
    let cancelled = false;
    void fetchTelegramConfig().then((config) => {
      if (!cancelled && config.botUsername) setTelegramBotUsername(config.botUsername);
    });
    return () => { cancelled = true; };
  }, []);

  const isValidEmail = (value: string) => /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/.test(value.trim());

  const sellerDetailsValid = useMemo(
    () => formData.fullName.trim().length >= 2 && formData.businessName.trim().length >= 2 && formData.phone.trim().length >= 7 && isValidEmail(formData.email) && formData.location.trim().length > 0 && formData.categories.length > 0,
    [formData]
  );

  const updateField = (field: keyof SellerFormData, value: string) => { setFormData((p) => ({ ...p, [field]: value })); setError(""); };
  const toggleCategory = (c: string) => {
    setFormData((p) => ({ ...p, categories: p.categories.includes(c) ? p.categories.filter((i) => i !== c) : [...p.categories, c] }));
    setError("");
  };

  const createSellerAccount = async (forcedMethod?: CredentialMethod): Promise<{ id: string; token: string } | null> => {
    const activeMethod = forcedMethod ?? (credentialMethod === "google" && !GOOGLE_CLIENT_ID ? "email" : credentialMethod);
    const email = formData.email.trim().toLowerCase();
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address before creating your seller account.");
      return null;
    }
    if (!sellerDetailsValid) { setError("Please complete all required seller details."); return null; }
    if (activeMethod === "email" && (formData.password.length < 8 || formData.password !== confirmPassword)) {
      setError(formData.password.length < 8 ? "Your password must be at least 8 characters." : "Your passwords do not match.");
      return null;
    }
    if (activeMethod === "google" && !GOOGLE_CLIENT_ID) {
      setCredentialMethod("email");
      setGoogleCredential("");
      return createSellerAccount("email");
    }
    if (activeMethod === "google" && !googleCredential) { setError("Connect your Google account to continue."); return null; }
    setIsSubmitting(true); setError("");
    try {
      const registrationDetails = { fullName: formData.fullName.trim(), businessName: formData.businessName.trim(), phone: formData.phone.trim(), email, password: activeMethod === "email" ? formData.password : undefined, location: formData.location.trim(), categories: formData.categories, sellerType: formData.sellerType, status: "pending", telegramConnected: false, sendWelcomeEmail: true };
      const registrationUrl = activeMethod === "google"
        ? `${API_BASE_URL}/api/sellers/auth/google`
        : `${API_BASE_URL}/api/sellers/register`;
      const response = activeMethod === "google"
        ? await fetch(registrationUrl, {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ credential: googleCredential, ...registrationDetails }),
          })
        : await fetch(registrationUrl, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registrationDetails),
      });
      let data: any = null;
      try { data = await response.json(); } catch { data = null; }

      const id = data?.sellerId || data?.seller?.id || data?.seller?._id || data?._id || data?.id || null;
      if (response.status === 409) throw new Error("A seller account already exists for this email. Use the seller dashboard address saved when the account was created.");

      if (!response.ok) {
        if (response.status === 404 && activeMethod === "google") {
          setCredentialMethod("email");
          setGoogleCredential("");
          return createSellerAccount("email");
        }
        if (response.status === 404) {
          throw new Error(`Seller ${"registration"} endpoint was not found (${registrationUrl}). Check that NEXT_PUBLIC_API_BASE points to the seller backend and that this endpoint is deployed.`);
        }
        throw new Error(data?.message || data?.error || `Could not create seller account (HTTP ${response.status}).`);
      }
      if (!id) throw new Error("Seller account was created but no seller ID was returned.");
      const sellerAccountId = String(id);
      if (!data?.token) throw new Error("Seller account was created, but its dashboard session could not be started. Seller ID: " + sellerAccountId);
      const sessionToken = String(data.token);
      window.localStorage.setItem("seller_id", sellerAccountId);
      window.localStorage.setItem("seller_token", sessionToken);
      setTelegramConnectionToken(data?.telegramConnectionToken || null);
      return { id: sellerAccountId, token: sessionToken };
    } catch (err) {
      console.error("Seller registration error:", err);
      setError(err instanceof Error ? err.message : "Unable to create seller account.");
      return null;
    } finally { setIsSubmitting(false); }
  };

  const connectTelegramForSeller = async () => {
    const sellerId = typeof window !== "undefined" ? window.localStorage.getItem("seller_id") : null;
    const sellerToken = typeof window !== "undefined" ? window.localStorage.getItem("seller_token") : null;

    if (!sellerId || !sellerToken) {
      setTelegramNotice("Finish creating your seller account, then connect Telegram from the dashboard so buyer messages can be linked to the right store.");
      return;
    }

    setIsSubmitting(true);
    setError("");
    setTelegramNotice("Connecting Telegram…");

    try {
      const nonce = createConnectNonce();
      const link = await connectSellerTelegram({
        sellerId,
        email: formData.email.trim().toLowerCase() || undefined,
        token: sellerToken || undefined,
        nonce,
      });

      setTelegramConnectionToken(link.telegramLink || null);
      setTelegramConnected(Boolean(link.alreadyConnected));
      setTelegramNotice("✅ Telegram connected. You can now receive buyer notifications and reply from Telegram.");

      if (typeof window !== "undefined") {
        window.alert("Telegram connected. You will receive buyer notifications and can reply from Telegram.");
      }

      const initialStatus = await pollTelegramConnect({ nonce });
      if (initialStatus?.connected || initialStatus?.status === "connected") {
        setTelegramConnected(true);
        setTelegramNotice("✅ Telegram connected. You can now receive buyer notifications and replies in this chat.");
        return;
      }

      if (initialStatus?.status === "conflict") {
        setError("That Telegram account is already connected to another seller. Sign in to that seller first if you need to switch it.");
        return;
      }
      if (initialStatus?.status === "expired") {
        setError("That Telegram link expired. Please try the Connect Telegram button again.");
        return;
      }

      setTelegramNotice("✅ Telegram connected. You can now receive buyer notifications and reply from Telegram.");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to connect Telegram. Please try again.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openTelegramBot = () => {
    if (telegramConnectionToken) {
      openTelegramDeepLink(telegramConnectionToken);
      return;
    }
    void connectTelegramForSeller();
  };

  const handleStart = () => { setStep(1); setSubStep(1); setError(""); window.scrollTo({ top: 0, behavior: "smooth" }); };

  // "Start" on the welcome screen: hide the intro and open the real setup form.
  const handleBeginSetup = () => { setShowIntro(false); handleStart(); };

  const goBack = () => { if (subStep > 1) setSubStep((p) => p - 1); setError(""); };

  const canProceedSubStep = () => {
    switch (subStep) {
      case 1: return formData.sellerType.length > 0;
      case 2: return formData.fullName.trim().length >= 2;
      case 3: return formData.businessName.trim().length >= 2;
      case 4: return formData.phone.trim().length >= 7 && isValidEmail(formData.email);
      case 5: return formData.location.trim().length > 0 && formData.categories.length > 0;
      // Telegram can be opened later from the dashboard, so this step never blocks.
      case 6: return true;
      case 7: return credentialMethod === "google" ? googleCredential.length > 0 : formData.password.length >= 8 && formData.password === confirmPassword;
      default: return false;
    }
  };

  // The dashboard reads the seller session from localStorage, but a fresh tab
  // (or a different subdomain) may not share it, so the token travels in the
  // URL fragment where it never reaches server logs.
  const dashboardHref = (id: string) => {
    const token = typeof window !== "undefined" ? window.localStorage.getItem("seller_token") : null;
    const path = `/sellers/${encodeURIComponent(id)}${token ? `#seller_token=${encodeURIComponent(token)}` : ""}`;
    return getSellerAppUrl(path);
  };

  const handleSubStepNext = async () => {
    if (!canProceedSubStep()) { setError("Please fill in the required fields."); return; }
    if (subStep < 7) { setSubStep((p) => p + 1); setError(""); return; }
    const createdSeller = await createSellerAccount();
    if (createdSeller) {
      // Replace the setup route in browser history so the seller lands on the
      // dashboard immediately and cannot bounce back into the onboarding wizard.
      window.location.replace(dashboardHref(createdSeller.id));
    }
  };

  const progressPhases = [
    { label: "Your details", lastSubStep: 5 },
    { label: "Connect Telegram", lastSubStep: 6 },
    { label: "Sign in", lastSubStep: 7 },
  ];
  const progressPercentage = ((subStep - 1) / 6) * 100;

  const renderProgress = () => (
    <FadeIn className="w-full max-w-4xl mx-auto mb-8 sm:mb-12 pt-[100px] relative z-10 px-4">
      <div className="flex justify-between relative">
        <div className="absolute top-5 left-0 w-full h-[3px] bg-[#E2E6EC] rounded-full -z-10" />
        <div className="absolute top-5 left-0 h-[3px] bg-[#5B21B6] rounded-full -z-10 transition-all duration-500" style={{ width: `${Math.min(progressPercentage, 100)}%` }} />
        {progressPhases.map((phase, i) => {
          const active = subStep > phase.lastSubStep; const current = subStep <= phase.lastSubStep && (i === 0 || subStep > progressPhases[i - 1].lastSubStep);
          return (
            <div key={phase.label} className="flex flex-col items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${active ? "bg-[#5B21B6] text-white" : "bg-white border-2 border-[#E2E6EC] text-[#9AA2AF]"} ${current ? "ring-4 ring-[#5B21B6]/15" : ""}`}>
                {active ? <Icons.Check /> : i + 1}
              </div>
              <span className={`text-xs font-semibold hidden sm:block ${current ? "text-[#5B21B6]" : active ? "text-[#58606F]" : "text-[#B7BEC9]"}`}>{phase.label}</span>
            </div>
          );
        })}
      </div>
    </FadeIn>
  );

  const inputClass = "w-full px-4 py-3.5 sm:py-4 rounded-xl bg-[#F7F9FB] border border-[#E2E6EC] focus:border-[#5B21B6] focus:bg-white focus:ring-4 focus:ring-[#5B21B6]/10 outline-none transition-all font-medium text-[#12161C] placeholder:text-[#9AA2AF] hover:border-[#C7CEDA] text-base sm:text-lg";
  const primaryBtn = "inline-flex items-center justify-center gap-2 bg-[#5B21B6] hover:bg-[#4C1D95] text-white rounded-xl font-bold shadow-lg shadow-[#5B21B6]/25 transition-all hover:-translate-y-0.5";

  return (
    <div className="min-h-screen bg-[#F4F8F9] text-[#12161C] overflow-x-hidden" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <style jsx global>{`
        html { scroll-behavior: smooth; }
        @keyframes gentle-bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-9px)} }
        @keyframes bubble-fade { 0%,100%{opacity:0;transform:translateY(10px) scale(.9)} 10%,90%{opacity:1;transform:none} }
        @keyframes ping-slow { 75%,100%{transform:scale(1.5);opacity:0} }
        @keyframes fade-in-up { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:none} }
        @keyframes marquee { 0%{transform:translateX(0)} 100%{transform:translateX(-33.33%)} }
        @keyframes hdr { from{transform:translateY(-100%)} to{transform:none} }
        @keyframes cursor-move { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-12px,-10px)} }
        .animate-gentle-bounce { animation: gentle-bounce 3s infinite ease-in-out; }
        .animate-bubble-fade { animation: bubble-fade 6s infinite ease-in-out; }
        .animate-ping-slow { animation: ping-slow 2s cubic-bezier(0,0,.2,1) infinite; }
        .animate-fade-in-up { animation: fade-in-up .45s cubic-bezier(.16,1,.3,1) forwards; }
        .animate-marquee { animation: marquee 25s linear infinite; }
        .animate-marquee:hover { animation-play-state: paused; }
        .animate-hdr { animation: hdr .6s ease-out; }
        .animate-cursor { animation: cursor-move 3.5s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) { *,*::before,*::after { animation-duration:.01ms !important; animation-iteration-count:1 !important; scroll-behavior:auto !important; } }
      `}</style>

      <SiteHeader ctaLabel="Become a Vendor" />

      {/* WELCOME SCREEN: shown first, the Start button opens the real setup form */}
      {showIntro && <SellerIntro onStart={handleBeginSetup} />}

      {/* LANDING */}
      {!showIntro && step === 0 && (
        <div className="pt-[76px]">

          <BrandMarquee />

          
        
          <Onboarding/>

          <section className="bg-[#F3EFFF] py-16 sm:py-20 lg:py-28 overflow-hidden">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-20 items-center">
              <FadeIn from="left">
                <p className="text-xs sm:text-sm font-extrabold uppercase tracking-[.25em] text-[#5B21B6]">Meet RIRI.ai</p>
                <h2 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-[-.04em] leading-[1.02]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Your AI<br />selling assistant.</h2>
                <p className="mt-5 text-lg text-slate-500 leading-relaxed max-w-xl">No complicated listing forms. Send your product and let RIRI help transform it into a professional Koombo listing.</p>
                <button type="button" onClick={handleStart} className={`${primaryBtn} mt-7 px-6 py-4`}>Become a seller <Icons.ArrowUpRight /></button>
              </FadeIn>

              <FadeIn from="right" delay={150}>
                <div className="rounded-[28px] border border-violet-200 bg-white p-5 shadow-[0_25px_65px_-35px_rgba(91,33,182,0.4)] sm:p-7">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-100 text-[#5B21B6]">
                      <Icons.User />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-600">Seller</p>
                      <h3 className="text-xl font-extrabold text-slate-900">Seller workspace</h3>
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed text-slate-600">Create your seller account once and continue straight to your dashboard and product listings.</p>
                  <button type="button" onClick={handleStart} className="mt-5 w-full rounded-xl bg-slate-900 px-4 py-3.5 text-sm font-bold text-white transition hover:bg-slate-800">Create seller account</button>
                </div>
              </FadeIn>
            </div>
          </section>

          <section className="bg-white py-16 sm:py-20 lg:py-28">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <FadeIn className="text-center">
                <p className="text-xs font-extrabold uppercase tracking-[.25em] text-[#5B21B6]">Simple setup</p>
                <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">Start selling in a few steps.</h2>
              </FadeIn>
              <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { n: "01", t: "Create your seller profile", d: "Tell us who you are and what you sell.", I: Icons.User },
                  { n: "02", t: "Connect your channel", d: "Connect Telegram and continue your seller workflow.", I: Icons.Message },
                  { n: "03", t: "Send your product", d: "Share a product photo, video and simple description.", I: Icons.Camera },
                  { n: "04", t: "Go live", d: "RIRI helps prepare your listing for Koombo.", I: Icons.Store },
                ].map((it, i) => (
                  <FadeIn key={it.n} delay={i * 100}>
                    <div className="h-full rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 hover:-translate-y-1.5 hover:border-[#5B21B6]/30 hover:shadow-xl hover:shadow-slate-200/40 transition-all">
                      <div className="flex items-center justify-between">
                        <div className="w-12 h-12 rounded-2xl bg-[#F3EFFF] text-[#5B21B6] flex items-center justify-center"><it.I /></div>
                        <span className="text-sm font-extrabold text-slate-300">{it.n}</span>
                      </div>
                      <h3 className="mt-6 text-lg font-extrabold">{it.t}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-slate-500">{it.d}</p>
                    </div>
                  </FadeIn>
                ))}
              </div>
            </div>
          </section>

          <section className="relative overflow-hidden bg-[#5B21B6] py-16 sm:py-20 lg:py-24">
            <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full bg-white/10" />
            <div className="absolute -left-20 -bottom-28 w-80 h-80 rounded-full bg-black/10" />
            <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
              <FadeIn>
                <p className="text-sm font-bold uppercase tracking-[.25em] text-white/70">Your next sale starts here</p>
                <h2 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white" style={{ fontFamily: "'DM Sans', sans-serif" }}>Ready to turn your hustle into income?</h2>
                <p className="mt-5 text-lg text-white/75 max-w-2xl mx-auto">Create your seller profile and start building your presence on Koombo.</p>
                <button type="button" onClick={handleStart} className="mt-8 inline-flex items-center gap-2 bg-white text-[#5B21B6] hover:bg-[#F3EFFF] px-7 sm:px-9 py-4 sm:py-5 rounded-2xl font-extrabold text-base sm:text-lg shadow-xl transition-all hover:-translate-y-0.5">Start selling on Koombo <Icons.ArrowUpRight /></button>
              </FadeIn>
            </div>
          </section>
        </div>
      )}

      {!showIntro && step === 1 && renderProgress()}

      {!showIntro && step === 1 && error && (
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
          <div className="rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm font-medium text-red-700 flex items-start gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0 mt-1.5" /><span>{error}</span>
          </div>
        </div>
      )}

      {/* STEP 1 */}
      {!showIntro && step === 1 && (
        <main className="pb-16 px-4 sm:px-6">
          <FadeIn className="max-w-2xl mx-auto" key={`step-${subStep}`}>
            <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200/60 border border-slate-200 overflow-hidden">
              <div className="w-full h-1.5 bg-slate-100"><div className="h-full bg-[#5B21B6] transition-all duration-500" style={{ width: `${(subStep / 7) * 100}%` }} /></div>
              <div className="p-6 sm:p-10 min-h-[480px] flex flex-col justify-center">
                {subStep === 1 && (
                  <div className="space-y-7 animate-fade-in-up">
                    <Head n={1} title="What best describes you?" sub="This helps us tailor your seller experience." />
                    <div className="grid gap-3">
                      {[
                        { id: "student", label: "Student", description: "I sell products while studying.", icon: Icons.User },
                        { id: "business", label: "Business", description: "I represent a business or brand.", icon: Icons.Store },
                        { id: "individual", label: "Individual seller", description: "I sell independently.", icon: Icons.User },
                      ].map((o) => {
                        const sel = formData.sellerType === o.id; const I = o.icon;
                        return (
                          <button key={o.id} type="button" onClick={() => updateField("sellerType", o.id)} className={`flex items-center gap-4 p-4 sm:p-5 rounded-2xl border-2 text-left transition-all ${sel ? "border-[#5B21B6] bg-[#F3EFFF]" : "border-slate-200 hover:border-[#5B21B6]/40"}`}>
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${sel ? "bg-[#5B21B6] text-white" : "bg-slate-100 text-slate-500"}`}><I /></div>
                            <div className="flex-1"><p className="font-extrabold text-lg">{o.label}</p><p className="mt-1 text-sm text-slate-500">{o.description}</p></div>
                            {sel && <div className="text-[#5B21B6]"><Icons.Check /></div>}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
                {subStep === 2 && (
                  <div className="space-y-7 animate-fade-in-up">
                    <Head n={2} title="Let's start with your name." sub="This will be displayed to buyers." />
                    <input autoFocus type="text" value={formData.fullName} onChange={(e) => updateField("fullName", e.target.value)} onKeyDown={(e) => e.key === "Enter" && canProceedSubStep() && void handleSubStepNext()} className={inputClass} placeholder="e.g. Richmond Afoblikame" autoComplete="name" />
                  </div>
                )}
                {subStep === 3 && (
                  <div className="space-y-7 animate-fade-in-up">
                    <Head n={3} title="Tell us about your business." sub="What is your shop or brand called?" />
                    <div>
                      <input autoFocus type="text" value={formData.businessName} onChange={(e) => updateField("businessName", e.target.value)} onKeyDown={(e) => e.key === "Enter" && canProceedSubStep() && void handleSubStepNext()} className={inputClass} placeholder="e.g. Richy's Fashion" autoComplete="organization" />
                      <p className="mt-2 text-sm text-slate-400">No business name yet? You can use your own name.</p>
                    </div>
                  </div>
                )}
                {subStep === 4 && (
                  <div className="space-y-7 animate-fade-in-up">
                    <Head n={4} title="How can we reach you?" sub="We'll use this for account security and seller updates." />
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div><label className="block text-sm font-bold mb-2">Phone number</label><input autoFocus type="tel" value={formData.phone} onChange={(e) => updateField("phone", e.target.value)} className={inputClass} placeholder="+233 XX XXX XXXX" autoComplete="tel" /></div>
                      <div><label className="block text-sm font-bold mb-2">Email</label><input type="email" value={formData.email} onChange={(e) => updateField("email", e.target.value)} className={inputClass} placeholder="you@example.com" autoComplete="email" /></div>
                    </div>
                  </div>
                )}
                {subStep === 5 && (
                  <div className="space-y-7 animate-fade-in-up">
                    <Head n={5} title="Where do you sell?" sub="Choose your location and the categories you sell." />
                    <div>
                      <label className="block text-sm font-bold mb-2">Location</label>
                      <select value={formData.location} onChange={(e) => updateField("location", e.target.value)} className={inputClass}>
                        <option value="">Select your location</option>
                        {LOCATIONS.map((l) => <option key={l} value={l}>{l}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-3">What do you sell?</label>
                      <div className="flex flex-wrap gap-2">
                        {CATEGORIES.map((c) => {
                          const sel = formData.categories.includes(c);
                          return (
                            <button type="button" key={c} onClick={() => toggleCategory(c)} className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full border text-sm font-bold transition-all ${sel ? "bg-[#5B21B6] border-[#5B21B6] text-white" : "bg-white border-slate-200 text-slate-600 hover:border-[#5B21B6]/40"}`}>
                              {sel && <Icons.Check />}{c}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
                {subStep === 6 && (
                  <div className="space-y-6 animate-fade-in-up">
                    <Head n={6} title="Connect Telegram for buyer chats." sub="Buyer messages land in your Telegram chat, and you reply to them from there." />
                    <div className="rounded-2xl border-2 border-slate-200 bg-[#F7F9FB] p-5">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 shrink-0 rounded-xl flex items-center justify-center text-white bg-[#5B21B6]"><Icons.Telegram /></div>
                        <div className="flex-1 min-w-0">
                          <p className="font-extrabold text-lg">Telegram bot</p>
                          <p className="mt-1 text-sm text-slate-500">
                            {telegramBotUsername ? `Opens @${telegramBotUsername} in the Telegram app.` : "Opens the Koombo seller bot in the Telegram app."}
                          </p>
                          <button type="button" onClick={openTelegramBot} disabled={isSubmitting} className="inline-flex items-center gap-2 mt-4 px-5 py-3 rounded-xl border border-[#5B21B6]/30 bg-white text-sm font-bold text-[#5B21B6] transition hover:bg-[#F3EFFF] disabled:opacity-60">
                            <Icons.Telegram /> {telegramConnected ? "Connected to Telegram" : isSubmitting ? "Connecting..." : "Open Telegram"}
                          </button>
                          {telegramNotice && (
                            <p className={`mt-3 text-sm font-medium ${telegramConnected ? "text-emerald-700" : "text-[#5B21B6]"}`} role="status">{telegramNotice}</p>
                          )}
                        </div>
                      </div>
                    </div>
                    <p className="rounded-xl bg-[#F3EFFF] px-4 py-3 text-sm font-semibold text-[#5B21B6]">Telegram attaches to your seller account after it is created. If you are ready, click the button and press Start in Telegram; the app will confirm the connection here.</p>
                  </div>
                )}
                {subStep === 7 && (
                  <div className="space-y-5 animate-fade-in-up">
                    <Head n={7} title="Create your sign-in credentials." sub="Choose how you’ll securely sign in to your seller account." />

                    {/* Google is the recommended path: one tap, no password to forget. */}
                    <button type="button" onClick={() => { setCredentialMethod("google"); setError(""); }} className={`w-full rounded-2xl border-2 p-6 text-left transition ${credentialMethod === "google" ? "border-[#5B21B6] bg-[#F3EFFF] shadow-lg shadow-[#5B21B6]/15" : "border-slate-200 hover:border-[#5B21B6]/40"}`}>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#5B21B6] px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.12em] text-white">
                        <Icons.Sparkles /> Recommended
                      </span>
                      <span className="mt-4 block text-2xl font-extrabold leading-tight tracking-tight text-[#12161C]">Continue with Google</span>
                      <span className="mt-2 block text-base font-semibold text-slate-600">Much easier to sign in — one tap, no password to remember.</span>
                    </button>

                    {credentialMethod === "google" && (
                      <div className="space-y-2">
                        <GoogleButton text="signup_with" onCredential={(credential) => { setGoogleCredential(credential); setError(""); }} onError={setError} />
                        {googleCredential && <p className="text-center text-sm font-semibold text-emerald-700">Google account connected.</p>}
                      </div>
                    )}

                    <button type="button" onClick={() => { setCredentialMethod("email"); setError(""); }} className={`block w-full text-center text-xs font-semibold underline underline-offset-4 transition ${credentialMethod === "email" ? "text-[#5B21B6]" : "text-slate-400 hover:text-slate-600"}`}>
                      Or sign in with email and password
                    </button>

                    {credentialMethod === "email" && (
                      <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                        <label className="block text-xs font-bold text-slate-500">Password<input type="password" autoComplete="new-password" minLength={8} value={formData.password} onChange={(e) => updateField("password", e.target.value)} className="mt-1.5 w-full px-3 py-2.5 rounded-lg bg-white border border-slate-200 focus:border-[#5B21B6] focus:ring-2 focus:ring-[#5B21B6]/10 outline-none transition text-sm placeholder:text-[#9AA2AF]" placeholder="At least 8 characters" /></label>
                        <label className="block text-xs font-bold text-slate-500">Confirm password<input type="password" autoComplete="new-password" value={confirmPassword} onChange={(e) => { setConfirmPassword(e.target.value); setError(""); }} className="mt-1.5 w-full px-3 py-2.5 rounded-lg bg-white border border-slate-200 focus:border-[#5B21B6] focus:ring-2 focus:ring-[#5B21B6]/10 outline-none transition text-sm placeholder:text-[#9AA2AF]" placeholder="Enter your password again" /></label>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="p-5 sm:p-7 bg-[#F7F9F9] border-t border-slate-200 flex flex-col sm:flex-row justify-between gap-3">
                <button type="button" onClick={goBack} disabled={isSubmitting} className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-bold text-slate-600 hover:bg-white transition-all"><Icons.ChevronLeft /> Back</button>
                <button type="button" onClick={() => void handleSubStepNext()} disabled={isSubmitting || !canProceedSubStep()} className={`${primaryBtn} px-7 py-3.5 disabled:opacity-40 disabled:cursor-not-allowed`}>
                  {isSubmitting ? "Setting up..." : subStep === 7 ? "Create seller account" : "Continue"}{!isSubmitting && <Icons.ChevronRight />}
                </button>
              </div>
            </div>
          </FadeIn>
        </main>
      )}

    </div>
  );
}

/* ============ SMALL COMPONENTS ============ */
function Head({ n, total = 7, title, sub }: { n: number; total?: number; title: string; sub: string }) {
  return (
    <div>
      <p className="text-sm font-bold uppercase tracking-widest text-[#5B21B6]">Step {n} of {total}</p>
      <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight">{title}</h2>
      <p className="mt-3 text-slate-500">{sub}</p>
    </div>
  );
}

function ValueCard({ icon, number, title, description }: { icon: ReactNode; number: string; title: string; description: string }) {
  return (
    <div className="group h-full rounded-3xl border border-slate-200 p-6 sm:p-8 bg-white hover:-translate-y-1.5 hover:border-[#5B21B6]/30 hover:shadow-xl hover:shadow-slate-200/40 transition-all">
      <div className="flex items-center justify-between">
        <div className="w-14 h-14 rounded-2xl bg-[#F3EFFF] text-[#5B21B6] flex items-center justify-center group-hover:scale-105 transition-transform">{icon}</div>
        <span className="text-sm font-extrabold text-slate-200">{number}</span>
      </div>
      <h3 className="mt-7 text-xl font-extrabold">{title}</h3>
      <p className="mt-3 text-sm sm:text-base text-slate-500 leading-relaxed">{description}</p>
    </div>
  );
}

function RiriDemo() {
  return (
    <div className="relative">
      <div className="rounded-[30px] bg-white border border-slate-200 shadow-[0_30px_80px_-30px_rgba(0,0,0,.2)] overflow-hidden">
        <div className="bg-[#24133F] px-5 py-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-3"><ModernBotIcon className="w-9 h-9" /><div><p className="font-extrabold">RIRI.ai</p><p className="text-xs text-white/50">Koombo seller assistant</p></div></div>
          <span className="text-xs font-bold text-[#7FD6E2]">Online</span>
        </div>
        <div className="p-5 sm:p-7 bg-[#F7F9F9] space-y-4">
          <div className="flex justify-end"><div className="max-w-[80%] bg-[#5B21B6] text-white rounded-2xl rounded-br-md px-4 py-3"><p className="text-sm">📸<br />Vintage leather jacket<br />Size M — GH₵850</p></div></div>
          <div className="flex gap-3">
            <ModernBotIcon className="w-9 h-9 flex-shrink-0" />
            <div className="bg-white rounded-2xl rounded-bl-md border border-slate-200 px-4 py-3 max-w-[90%]">
              <p className="text-sm font-bold text-[#5B21B6]">I've created a draft for you ✨</p>
              <div className="mt-3 space-y-2 text-xs">
                <div><span className="font-bold">Title</span><p className="text-slate-500">Vintage Brown Leather Jacket</p></div>
                <div><span className="font-bold">Category</span><p className="text-slate-500">Fashion</p></div>
                <div><span className="font-bold">Price</span><p className="text-slate-500">GH₵850</p></div>
              </div>
              <div className="mt-4 flex gap-2"><button className="px-4 py-2 rounded-lg bg-[#5B21B6] text-white text-xs font-bold">Publish</button><button className="px-4 py-2 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold">Edit</button></div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute -bottom-5 -right-4 sm:-right-8 bg-white rounded-2xl shadow-xl border border-slate-200 px-4 py-3 flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-[#F3EFFF] text-[#5B21B6] flex items-center justify-center"><Icons.Check /></div>
        <div><p className="text-xs font-extrabold">Listing created</p><p className="text-[10px] text-slate-400">Ready for review</p></div>
      </div>
    </div>
  );
}
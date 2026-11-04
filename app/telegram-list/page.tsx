"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import Footer from "../components/marketing/Footer";

/* Koombo — "List your products" page (Next.js + Tailwind)
   Photos (any size, they fill the shapes):  public/hero/seller.jpg   – happy vendors in their shop
                                             public/hero/riri.jpg     – seller photographing a product with a phone
   Logo: public/logo.png.  Until the photos exist, nice teal fallbacks are shown. */

/* ---------- scroll fade-in ---------- */
function Reveal({ children, delay = 0, from = "up", className = "" }: { children: ReactNode; delay?: number; from?: "up" | "left" | "right"; className?: string }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setOn(true); io.disconnect(); } }, { threshold: 0.12 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const hidden = { up: "translate-y-10", left: "-translate-x-10", right: "translate-x-10" }[from];
  return (
    <div ref={ref} style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-[900ms] ease-[cubic-bezier(.16,1,.3,1)] ${on ? "translate-x-0 translate-y-0 opacity-100 blur-0" : `opacity-0 blur-[5px] ${hidden}`} ${className}`}>
      {children}
    </div>
  );
}

const Arrow = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>);

/* ---------- photo with a fallback ---------- */
function Photo({ src, alt, children, pos = "center 30%" }: { src: string; alt: string; children: ReactNode; pos?: string }) {
  const [ok, setOk] = useState(true);
  return ok ? (
    <img src={src} alt={alt} draggable={false} onError={() => setOk(false)} className="absolute inset-0 h-full w-full select-none object-cover" style={{ objectPosition: pos }} />
  ) : (
    <div className="absolute inset-0 bg-gradient-to-br from-[#8B5CF6] via-[#6D28D9] to-[#24133F]">{children}</div>
  );
}

/* ---------- count-up number (starts when scrolled into view) ---------- */
function CountUp({ to, prefix = "", suffix = "" }: { to: number; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [v, setV] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const tick = (t: number) => {
        const p = Math.min(1, (t - t0) / 1500);
        setV(Math.round(to * (1 - Math.pow(1 - p, 3))));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [to]);
  return <span ref={ref}>{prefix}{v}{suffix}</span>;
}

/* sample figures — replace with your real numbers */
const STATS = [
  { to: 300, suffix: "+", caption: "extra orders every week", src: "/june.jpg", grad: "from-[#4a6b78] to-[#1c2f38]", cls: "" },
  { to: 25, suffix: "%", caption: "of total revenue from Koombo", src: "/77.jpg", grad: "from-[#8B5CF6] to-[#24133F]", cls: "lg:min-w-0", by: ["Ama's Boutique", "Ama Mensah"] },
  { to: 25, prefix: "+", suffix: "%", caption: "average order value lift", src: "/o.jpeg", grad: "from-[#7a5b4a] to-[#2b1d17]", cls: "" },
];

const Dot = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M10 3h4v7h7v4h-7v7h-4v-7H3v-4h7z" /></svg>);

/* =========================================================
   PAGE
========================================================= */
export default function ListYourProducts({ onLearnMore }: { onLearnMore?: () => void }) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white text-[#24133F]" style={{ fontFamily: "'Lufga','DM Sans','Inter',system-ui,sans-serif" }}>
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8 lg:px-10">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Koombo" className="h-9 w-auto sm:h-10" />
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-[#6D28D9]">Seller</p>
              <p className="text-sm font-semibold text-[#24133F]">Telegram communication</p>
            </div>
          </div>

          <nav className="hidden items-center gap-8 text-sm font-medium text-[#24133F]/70 md:flex">
            <a href="/" className="transition hover:text-[#6D28D9]">Home</a>
            <a href="/about" className="transition hover:text-[#6D28D9]">Features</a>
            <a href="/watch-demo" className="transition hover:text-[#6D28D9]">Pricing</a>
            <a href="/contact" className="transition hover:text-[#6D28D9]">Support</a>
          </nav>

          <div className="flex items-center gap-3">
            <button type="button" className="hidden rounded-full border border-[#6D28D9]/20 px-4 py-2 text-sm font-semibold text-[#24133F] transition hover:border-[#6D28D9] hover:text-[#6D28D9] sm:inline-flex">
              Sign in
            </button>
            <button type="button" onClick={() => router.push("/seller/signin")} className="inline-flex items-center justify-center rounded-full bg-[#6D28D9] px-4 py-2 text-sm font-bold text-white shadow-lg shadow-[#6D28D9]/20 transition hover:-translate-y-0.5 hover:bg-[#4C1D95]">
              Connect Telegram
            </button>
          </div>
        </div>
      </header>

      <main className="w-full overflow-x-hidden bg-white text-[#24133F]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Anton&family=DM+Sans:wght@400;500;600;700&display=swap');
        @keyframes lp-up{from{opacity:0;transform:translateY(34px)}to{opacity:1;transform:none}}
        @keyframes lp-in-r{from{opacity:0;transform:translateX(70px)}to{opacity:1;transform:none}}
        @keyframes lp-in-b{from{opacity:0;transform:translateY(60px)}to{opacity:1;transform:none}}
        @keyframes lp-pop{0%{transform:scale(.6);opacity:0}70%{transform:scale(1.1)}100%{transform:scale(1);opacity:1}}
        @keyframes lp-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
        .lp-a{opacity:0;animation:lp-up .8s cubic-bezier(.16,1,.3,1) forwards}
        .lp-photo{animation:lp-in-b 1s cubic-bezier(.16,1,.3,1) .2s both}
        @media(min-width:1024px){.lp-photo{animation-name:lp-in-r}}
        .lp-pop{animation:lp-pop .6s cubic-bezier(.16,1,.3,1) both}
        .lp-float{animation:lp-float 5s ease-in-out infinite}
        .lp-display{font-family:'Anton','Oswald',Impact,'Arial Narrow',sans-serif;text-transform:uppercase;letter-spacing:.01em}
        @media(prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}.lp-a{opacity:1}}
      `}</style>

      {/* ============ 1. HERO: headline + button + curved photo ============ */}
      <section className="relative overflow-hidden bg-[#F3EFFF]">
        <div className="relative z-20 flex items-center px-5 py-4 sm:px-8 lg:pl-[7vw] lg:pr-[3vw]">
          <div className="flex items-center">
            <img src="/logo.png" alt="Koombo" className="h-10 w-auto sm:h-12" />
          </div>
        </div>

        <div className="relative">
          <div className="relative z-10 px-5 pb-10 pt-6 sm:px-8 lg:min-h-[calc(100vh-76px)] lg:pb-16 lg:pl-[7vw] lg:pr-0 lg:pt-10">
            <h1 className="lp-display lp-a text-[clamp(34px,3.9vw,60px)] leading-[1.04] lg:max-w-[48vw]" style={{ animationDelay: ".1s" }}>
              <span className="block text-[#6D28D9]">Chat with buyers instantly</span>
              <span className="block text-[#24133F]">through Telegram, not a listing flow</span>
            </h1>

            <div className="lp-a mt-6 w-full max-w-[588px] rounded-[20px] bg-white p-6 shadow-[0_20px_60px_-25px_rgba(6,50,61,.35)] sm:p-9 lg:mt-9 lg:w-[min(588px,48vw)] lg:max-w-none lg:px-12 lg:py-11" style={{ animationDelay: ".3s" }}>
              <h2 className="lp-display text-[21px] leading-[1.25] sm:text-[24px]">Connect your Telegram in minutes</h2>
              <p className="mt-3 text-[15px] text-[#24133F]/70">
                Keep your store conversations in one channel. Buyers can reach you instantly with no listing-first workflow.
              </p>
              <button
                type="button"
                onClick={() => router.push("/seller/signin")}
                className="mt-6 w-full rounded-full bg-[#5B21B6] py-3.5 text-[15px] font-bold text-white shadow-lg shadow-[#5B21B6]/25 transition hover:-translate-y-0.5 hover:bg-[#4C1D95] active:scale-[.98]"
              >
                Connect Telegram
              </button>
              <p className="mt-3 text-center text-[12px] text-[#24133F]/55">
                By continuing you agree to Koombo's Seller Terms and Privacy Policy.
              </p>
            </div>
          </div>

          {/* curved photo (right) */}
          <div className="lp-photo relative h-[340px] w-full overflow-hidden bg-[#5B21B6] [clip-path:ellipse(120%_100%_at_50%_100%)] sm:h-[420px] lg:absolute lg:right-0 lg:top-0 lg:h-full lg:w-[45%] lg:[clip-path:ellipse(100%_85%_at_100%_50%)]">
            <Photo src="/s.jpg" alt="Koombo sellers in their shop">
              <img src="/left.png" alt="" className="absolute left-[6%] top-[4%] w-[62%] select-none" draggable={false} />
              <img src="/right.png" alt="" className="absolute bottom-0 right-0 w-[46%] select-none" draggable={false} />
            </Photo>
          </div>
        </div>
      </section>

      {/* ============ 2. SELL VIA CHAT (New Section) ============ */}
      <section className="px-4 py-14 sm:px-6 sm:py-20 bg-[#F8FAFA]">
        <div className="mx-auto max-w-[1240px]">
          <Reveal>
            <div className="text-center max-w-3xl mx-auto">
              <span className="inline-block rounded-md bg-[#6D28D9]/12 px-3.5 py-1.5 text-[11px] font-extrabold uppercase tracking-[.16em] text-[#6D28D9]">Seamless Selling</span>
              <h2 className="mt-4 text-[32px] font-extrabold leading-[1.1] tracking-[-0.04em] sm:text-5xl text-[#24133F]">
                Manage your store effortlessly via chat
              </h2>
              <p className="mt-4 text-[17px] leading-relaxed text-[#24133F]/70">
                No complicated dashboards to learn. List products, manage orders, and chat with buyers directly from your favorite messaging apps.
              </p>
            </div>
          </Reveal>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Reveal delay={100}>
              <div className="h-full rounded-3xl bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg border border-[#F3EFFF]">
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#25D366]/10 text-[#25D366] mb-6">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
                </div>
                <h3 className="text-xl font-bold text-[#24133F]">WhatsApp & Telegram</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-[#24133F]/70">
                  Manage your store and selling is easier using WhatsApp and Telegram. Stay connected with your customers where they already are.
                </p>
              </div>
            </Reveal>

            <Reveal delay={200}>
              <div className="h-full rounded-3xl bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg border border-[#F3EFFF]">
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#6D28D9]/10 text-[#6D28D9] mb-6">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z"/></svg>
                </div>
                <h3 className="text-xl font-bold text-[#24133F]">RIRI AI Bot</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-[#24133F]/70">
                  List products using WhatsApp and Telegram bots called riri.ai easily. Just send a photo and let our AI write the title, description, and price.
                </p>
              </div>
            </Reveal>

            <Reveal delay={300}>
              <div className="h-full rounded-3xl bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg border border-[#F3EFFF]">
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#F59E0B]/10 text-[#F59E0B] mb-6">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                </div>
                <h3 className="text-xl font-bold text-[#24133F]">Real-time Messages</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-[#24133F]/70">
                  See buyers' messages in real-time without any complicated dashboard. Respond instantly and close sales faster.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============ 3. GROWING WITH KOOMBO: stat photo cards ============ */}
      <section className="px-4 py-14 sm:px-6 sm:py-20">
        <Reveal>
          <h2 className="mx-auto max-w-3xl text-center text-[32px] font-extrabold leading-[1.1] tracking-[-0.04em] sm:text-5xl">
            See how sellers are growing with Koombo<sup className="ml-0.5 text-[.45em] font-bold align-super">1</sup>
          </h2>
        </Reveal>

        <div className="mx-auto mt-10 max-w-[1240px] sm:mt-14">
          <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:-mx-6 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-[1fr_1.5fr_1fr] lg:overflow-visible lg:px-0 [&::-webkit-scrollbar]:hidden">
            {STATS.map((st, i) => (
              <Reveal key={st.caption} delay={i * 130} className={`min-w-[84%] shrink-0 snap-center sm:min-w-[60%] lg:min-w-0 ${st.cls}`}>
                <article className="group relative h-[400px] overflow-hidden rounded-2xl bg-[#24133F] sm:h-[440px]">
                  <div className="absolute inset-0 transition-transform duration-[1200ms] ease-out group-hover:scale-105">
                    <div className={`absolute inset-0 bg-gradient-to-br ${st.grad}`} />
                    <img src={st.src} alt={st.caption} draggable={false} className="absolute inset-0 h-full w-full select-none object-cover object-center" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-black/10" />
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 text-white sm:p-7">
                    <div>
                      <p className="text-[56px] font-medium leading-none tracking-[-0.04em] sm:text-[68px]"><CountUp to={st.to} prefix={st.prefix} suffix={st.suffix} /></p>
                      <p className="mt-2 text-[17px] font-bold leading-snug sm:text-xl">{st.caption}</p>
                    </div>
                    {st.by && <p className="shrink-0 pb-1 text-right text-[12px] leading-5 text-white/85">{st.by[0]}<br />{st.by[1]}</p>}
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
          <p className="mt-4 text-[12px] text-[#24133F]/50"><sup>1</sup> Sample figures shown for illustration.</p>
        </div>
      </section>

      {/* ============ 4. FROM DISCOVERY TO REPEAT ORDERS ============ */}
      <section className="px-4 pb-16 sm:px-6 sm:pb-24">
        <div className="mx-auto max-w-[1240px]">
          <Reveal>
            <span className="inline-block rounded-md bg-[#6D28D9]/12 px-3.5 py-1.5 text-[11px] font-extrabold uppercase tracking-[.16em] text-[#6D28D9]">Products</span>
            <h2 className="mt-3 text-[34px] font-semibold leading-[1.05] tracking-[-0.045em] sm:text-5xl lg:text-[56px]">From discovery to repeat orders</h2>
          </Reveal>

          <div className="mt-8 grid gap-5 sm:mt-12 lg:grid-cols-[1.85fr_1fr]">
            {/* left column */}
            <div>
              <Reveal>
                <div className="grid overflow-hidden rounded-3xl bg-[#6D28D9] md:grid-cols-[1.35fr_1fr]">
                  <div className="flex flex-col justify-center p-7 text-white sm:p-10">
                    <span className="inline-flex w-fit items-center gap-2 rounded-lg bg-white px-3.5 py-2 text-[11px] font-extrabold uppercase tracking-[.14em] text-[#6D28D9]">
                      <img src="/logo.png" alt="" className="h-4 w-auto" /> Koombo Marketplace
                    </span>
                    <h3 className="mt-6 text-[28px] font-medium leading-[1.12] tracking-[-0.03em] sm:text-[34px]">Get discovered by shoppers already active in your area</h3>
                    <button type="button" className="group mt-7 inline-flex w-fit items-center gap-2 rounded-full bg-white px-6 py-3.5 text-[14px] font-extrabold text-[#24133F] transition duration-300 hover:-translate-y-0.5 hover:shadow-xl active:scale-95">
                      Explore Marketplace <span className="transition-transform duration-300 group-hover:translate-x-1"><Arrow /></span>
                    </button>
                  </div>
                  <div className="relative min-h-[300px] overflow-hidden bg-black">
                    <Photo src="/44.jpg" alt="Seller preparing an order"><span /></Photo>
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                      <div className="flex items-end gap-3">
                        <p className="text-[52px] font-extrabold leading-none tracking-[-0.04em]"><CountUp to={30} suffix="%" /></p>
                        <p className="pb-1 text-[13px] leading-snug text-white/90">of orders came from first-time shoppers<sup>2</sup></p>
                      </div>
                      <span className="mt-3 inline-block text-white"><Dot /></span>
                    </div>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={150} className="mt-8">
                <p className="text-[12px] font-extrabold uppercase tracking-[.16em] text-[#6D28D9]">Level up your shop</p>
                <div className="mt-2 h-px w-full bg-[#6D28D9]" />
                <div className="mt-5 grid gap-4 rounded-3xl bg-[#F3EFFF] p-5 sm:grid-cols-3 sm:p-7">
                  {[
                    { t: "RIRI AI listings", d: "Turn one photo into a ready-to-sell listing.", d2: "M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z" },
                    { t: "Social discovery", d: "Get followers, likes and shares on every product.", d2: "M12 21s-8-5-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 6-8 11-8 11Z" },
                    { t: "Easy payouts", d: "Get paid with mobile money and cards.", d2: "M3 7a2 2 0 0 1 2-2h13v4M3 7v11a2 2 0 0 0 2 2h15V9H5a2 2 0 0 1-2-2ZM16 14.5h.01" },
                  ].map((f) => (
                    <div key={f.t} className="rounded-2xl bg-white p-5 transition duration-300 hover:-translate-y-1 hover:shadow-lg">
                      <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#6D28D9]/10 text-[#6D28D9]">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d={f.d2} /></svg>
                      </span>
                      <p className="mt-4 text-[15px] font-extrabold">{f.t}</p>
                      <p className="mt-1 text-[13px] leading-relaxed text-[#24133F]/65">{f.d}</p>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>

            {/* right column: photo + info panel */}
            <Reveal from="right" delay={120}>
              <div className="flex h-full flex-col overflow-hidden rounded-3xl bg-[#F6F6F6]">
                <div className="relative min-h-[300px] flex-1 overflow-hidden bg-black">
                  <Photo src="/77.jpg" alt="Shoppers enjoying a live shopping event"><span /></Photo>
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                  <div className="absolute left-1/2 top-[18%] flex -translate-x-1/2 flex-col items-center gap-2">
                    <span className="lp-float inline-flex items-center gap-1.5 rounded-full bg-[#6D28D9] px-3 py-1 text-[10px] font-bold text-white shadow"><img src="/logo-white.png" alt="" className="h-2.5 w-auto" onError={(e) => ((e.target as HTMLImageElement).style.display = "none")} />Local</span>
                    <span className="lp-float inline-flex items-center gap-1.5 rounded-full bg-[#4AA3B0] px-3 py-1 text-[10px] font-bold text-white shadow" style={{ animationDelay: "-2s" }}>Style Lover</span>
                  </div>
                </div>
                <div className="p-7 sm:p-8">
                  <p className="text-[12px] font-extrabold uppercase tracking-[.16em] text-[#6D28D9]">Live shopping</p>
                  <p className="mt-3 text-[20px] font-semibold leading-snug tracking-[-0.02em]">Go live, show your products and let shoppers buy as they watch.</p>
                </div>
              </div>
            </Reveal>
          </div>
          <p className="mt-6 text-[12px] text-[#24133F]/50"><sup>2</sup> Sample figures shown for illustration.</p>
        </div>
      </section>

      {/* ============ 5. MEET RIRI: tinted card + slanted photo ============ */}
      <section className="px-4 py-14 sm:px-6 sm:py-20 lg:px-10">
        <div className="mx-auto grid max-w-[1240px] overflow-hidden rounded-[28px] bg-[#F3EFFF] lg:grid-cols-[1fr_1.08fr]">
          <div className="flex flex-col justify-center px-6 py-10 sm:px-10 sm:py-14 lg:py-20 lg:pl-16 lg:pr-10">
            <Reveal from="left">
              <span className="inline-block rounded-lg bg-[#6D28D9]/15 px-3.5 py-2 text-[11px] font-extrabold uppercase tracking-[.16em] text-[#6D28D9]">Meet RIRI</span>
            </Reveal>
            <Reveal from="left" delay={120}>
              <h2 className="mt-5 text-[34px] font-semibold leading-[1.05] tracking-[-0.04em] sm:text-5xl lg:text-[56px]">
                Send a photo,<br /><span className="text-[#6D28D9]">RIRI lists it for you</span>
              </h2>
            </Reveal>
            <Reveal from="left" delay={240}>
              <p className="mt-5 max-w-md text-[16px] leading-[1.7] text-[#24133F]/65 sm:text-[17px]">
                Snap your product, add the price and RIRI writes the title, description and category. Review, publish and watch shoppers discover it on Koombo.
              </p>
            </Reveal>
            <Reveal from="left" delay={360} className="mt-7">
              <button type="button" onClick={onLearnMore} className="group inline-flex items-center gap-2 rounded-full border-2 border-[#6D28D9] px-6 py-3 text-[14px] font-extrabold text-[#6D28D9] transition duration-300 hover:bg-[#6D28D9] hover:text-white active:scale-95">
                See how RIRI works <span className="transition-transform duration-300 group-hover:translate-x-1"><Arrow /></span>
              </button>
            </Reveal>
          </div>

          {/* slanted photo */}
          <Reveal from="right" delay={150} className="relative min-h-[320px] sm:min-h-[400px] lg:min-h-[500px]">
            <div className="absolute inset-0 overflow-hidden bg-[#5B21B6] [clip-path:polygon(0_9%,100%_0,100%_100%,0_100%)] lg:[clip-path:polygon(15%_0,100%_0,100%_100%,0_100%)]">
              <Photo src="/hero/riri.jpg" alt="Seller listing a product with RIRI" pos="center 35%">
                <div className="absolute inset-0 grid place-items-center">
                  <div className="lp-float w-[210px] rounded-[28px] border-[6px] border-white/90 bg-white p-3 shadow-2xl sm:w-[240px]">
                    <div className="aspect-[4/3] rounded-xl bg-[#BFE3E0]" />
                    <p className="mt-3 text-[13px] font-extrabold text-[#24133F]">Vintage Leather Jacket</p>
                    <p className="text-[11px] text-[#24133F]/55">Fashion · AI-written description</p>
                    <div className="mt-2 flex items-center justify-between"><span className="text-[14px] font-black text-[#6D28D9]">GH₵850</span><span className="rounded-full bg-[#6D28D9] px-3 py-1 text-[10px] font-bold text-white">Publish</span></div>
                  </div>
                </div>
              </Photo>
            </div>
          </Reveal>
        </div>
      </section>
    </main>

      <Footer />
    </div>
  );
}
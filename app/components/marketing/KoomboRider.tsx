'use client';

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import {
  ArrowUp,
  Bike,
  Briefcase,
  CalendarDays,
  Gift,
  Mail,
  MessageCircle,
  Phone,
  Shirt,
  Smartphone,
  Sun,
  Sunset,
  Moon,
  Trophy,
  Users,
  Wallet,
  Zap,
} from "lucide-react";

const WHATSAPP_NUMBER = "233531190274";
const CONTACT_EMAIL = "hello@koombo.app";

/* Brand colours (same as the seller page).
   To match the screenshot exactly: TINT #FFEBE8, ACCENT #FF3008, PILL #FFD6D0 */
const TINT = "#F3EFFF";
const ACCENT = "#5B21B6";
const PILL = "#E4DAFB";
const INK = "#222222";
const MUTED = "#6A6A6A";
const LINE = "#DDDDDD";

/* Edit these to match your real rider terms. The numbers below are placeholders. */
const TERMS = {
  riderSharePercent: 80,
  tipsPercent: 100,
  payoutFrequency: "Weekly",
};

const requirements = [
  { icon: Bike, title: "A motorbike", text: "Your own motorbike, roadworthy and ready to take orders across the city." },
  { icon: Briefcase, title: "An existing courier business", text: "You already run deliveries and want a steady stream of Koombo orders on top." },
  { icon: Smartphone, title: "A smartphone", text: "To receive orders, follow routes and track your earnings as you ride." },
];

const availability = [
  { icon: Sun, title: "Mornings", time: "6am to 11am", text: "Early pickups and deliveries before the day gets busy." },
  { icon: Sun, title: "Midday", time: "11am to 3pm", text: "A busy window as shoppers order on their breaks." },
  { icon: Sunset, title: "Evenings", time: "5pm to 10pm", text: "After-work shoppers placing and receiving orders." },
  { icon: Moon, title: "Weekends", time: "All day", text: "Higher demand and boosted earnings." },
];

const incentives = [
  { icon: Shirt, title: "Free Koombo rider kit", text: "A branded jacket and delivery bag, so you ride looking sharp and customers know it's you.", big: true },
  { icon: Trophy, title: "Weekly bonus", text: "Hit your weekly delivery target and earn a cash bonus on top of your commission." },
  { icon: Zap, title: "Peak-hour boosts", text: "Earn extra during busy hours, in the rain and over weekends." },
  { icon: Users, title: "Referral rewards", text: "Bring another rider on board and get rewarded when they complete their first deliveries." },
];

/* ---------------- helpers ---------------- */
function useInView<T extends HTMLElement>(threshold = 0.15) {
  const ref = useRef<T | null>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setSeen(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return { ref, seen };
}

function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const { ref, seen } = useInView<HTMLDivElement>();
  return (
    <div ref={ref} className={`ks-reveal ${seen ? "ks-in" : ""} ${className}`} style={{ ["--d" as string]: `${delay}s` }}>
      {children}
    </div>
  );
}

function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const { ref, seen } = useInView<HTMLSpanElement>(0.4);
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!seen) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setN(to);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const dur = 1300;
    const tick = (now: number) => {
      const t = Math.min((now - start) / dur, 1);
      setN(Math.round(to * (1 - Math.pow(1 - t, 3))));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [seen, to]);

  return (
    <span ref={ref}>
      {n}
      {suffix}
    </span>
  );
}

function SectionTitle({ children, sub, eyebrow }: { children: ReactNode; sub?: string; eyebrow?: string }) {
  return (
    <div className="max-w-3xl">
      {eyebrow && <p className="mb-2 text-[16px] font-semibold" style={{ color: MUTED }}>{eyebrow}</p>}
      <h2 className="text-[clamp(32px,4.4vw,56px)] font-bold leading-[1.05] tracking-[-0.035em]" style={{ color: INK }}>
        {children}
      </h2>
      {sub && (
        <p className="mt-4 text-[20px] leading-[1.5] sm:text-[22px]" style={{ color: MUTED }}>
          {sub}
        </p>
      )}
    </div>
  );
}

function IconChip({ icon: Icon, light = false }: { icon: typeof Bike; light?: boolean }) {
  return (
    <span
      className="flex h-12 w-12 items-center justify-center rounded-2xl"
      style={light ? { backgroundColor: "rgba(255,255,255,.15)", color: "#fff" } : { backgroundColor: PILL, color: ACCENT }}
    >
      <Icon size={22} />
    </span>
  );
}

/* ---------------- hero photo (slanted, same as seller page) ---------------- */
function RiderPhoto() {
  const [ok, setOk] = useState(true);

  return (
    <div
      className="ks-photo relative h-[360px] w-full overflow-hidden sm:h-[440px] lg:absolute lg:right-0 lg:top-0 lg:h-full lg:w-[52%]
                 [clip-path:polygon(0_9%,100%_0,100%_100%,0_100%)]
                 lg:[clip-path:polygon(15%_0,100%_0,100%_100%,0_100%)]"
      style={{ backgroundColor: ACCENT }}
    >
      {ok ? (
        <img
          src="/koombo.jpeg"
          alt="Koombo rider delivering orders"
          onError={() => setOk(false)}
          className="absolute inset-0 h-full w-full select-none object-cover object-center"
          draggable={false}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#8B5CF6] via-[#6D28D9] to-[#24133F]" />
      )}
    </div>
  );
}

/* ---------------- page ---------------- */
export default function KoomboRiderSignup(_props: { onBack?: () => void; onRegisterClick?: () => void }) {
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const buildMessage = () =>
    `Hi Koombo, I'd like to join as a rider.\nMy mobile number: ${phone.trim() || "-"}\nMy email: ${email.trim() || "-"}`;

  const contactViaWhatsApp = () => {
    if (phone.replace(/\D/g, "").length < 7) {
      setError("Enter your mobile number so we can reach you.");
      return;
    }
    setError("");
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildMessage())}`, "_blank", "noopener,noreferrer");
  };

  const contactViaEmail = () => {
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError("Enter a valid email address so we can reply.");
      return;
    }
    setError("");
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Rider application")}&body=${encodeURIComponent(buildMessage())}`;
  };

  const inputClass =
    "h-14 w-full rounded-xl border border-[#DDDDDD] bg-white pl-12 pr-4 text-[18px] font-medium text-[#222222] placeholder:text-[#6A6A6A] transition focus:border-[#222222] focus:outline-none focus:ring-2 focus:ring-[#5B21B6]/20";

  const wrap = "mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8";
  const card = "rounded-[24px] border bg-white p-7";

  return (
    <main
      id="rider"
      className="relative w-full overflow-hidden bg-white antialiased"
      style={{
        color: INK,
        fontFamily:
          "'Airbnb Cereal VF','Airbnb Cereal',Circular,'Figtree',-apple-system,BlinkMacSystemFont,Roboto,'Helvetica Neue','DM Sans',Inter,system-ui,sans-serif",
      }}
    >
      <style>{`
        @keyframes ks-up{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:none}}
        @keyframes ks-in-r{from{opacity:0;transform:translateX(40px)}to{opacity:1;transform:none}}
        @keyframes ks-in-b{from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:none}}
        .ks-a{opacity:0;animation:ks-up .8s cubic-bezier(.16,1,.3,1) forwards}
        .ks-photo{animation:ks-in-b 1s cubic-bezier(.16,1,.3,1) .2s both}
        @media(min-width:1024px){.ks-photo{animation-name:ks-in-r}}
        .ks-reveal{opacity:0;transform:translateY(20px);transition:opacity .6s cubic-bezier(.16,1,.3,1) var(--d,0s),transform .6s cubic-bezier(.16,1,.3,1) var(--d,0s)}
        .ks-reveal.ks-in{opacity:1;transform:none}
        @media(prefers-reduced-motion:reduce){
          *{animation:none!important;transition:none!important}
          .ks-a,.ks-reveal{opacity:1;transform:none}
        }
      `}</style>

      {/* ============ HERO CARD ============ */}
      <div className={`${wrap} py-6`}>
        <section className="relative overflow-hidden rounded-[28px] lg:min-h-[680px]" style={{ backgroundColor: TINT }}>
          <div className="relative z-10 flex flex-col justify-center px-6 pb-10 pt-12 sm:px-10 lg:min-h-[680px] lg:w-[55%] lg:pb-16 lg:pl-[72px] lg:pr-6 lg:pt-16">
            <p
              className="ks-a mb-6 inline-flex w-fit items-center rounded-lg px-3.5 py-2 text-[12px] font-bold uppercase leading-none tracking-[0.12em]"
              style={{ animationDelay: ".05s", backgroundColor: PILL, color: ACCENT }}
            >
              For riders
            </p>

            <h1
              className="ks-a text-[clamp(44px,5.6vw,84px)] font-medium leading-[1.02] tracking-[-0.04em]"
              style={{ animationDelay: ".15s" }}
            >
              <span className="block text-[#1a0b14]">Reach millions of</span>
              <span className="block" style={{ color: ACCENT }}>
                shoppers near you
              </span>
            </h1>

            <p
              className="ks-a mt-7 max-w-[560px] text-[20px] font-normal leading-[1.5] sm:text-[22px] lg:text-[24px]"
              style={{ animationDelay: ".25s", color: MUTED }}
            >
              Grow your delivery business with Koombo. Connect with sellers, deliver fast, and earn more with every order
              you complete.
            </p>

            {/* Contact form */}
            <div
              className="ks-a mt-8 w-full max-w-[560px] rounded-[24px] border bg-white p-5 sm:p-7"
              style={{ animationDelay: ".35s", borderColor: LINE }}
            >
              <h2 className="text-[26px] font-semibold leading-[1.15] tracking-[-0.025em]">Start as a Koombo rider</h2>
              <p className="mb-5 mt-2 text-[16px] leading-[1.5]" style={{ color: MUTED }}>
                Leave your details and pick how you want to reach us. We’ll take it from there.
              </p>

              <div className="space-y-4">
                <div className="relative">
                  <Phone className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#6A6A6A]" />
                  <input
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    name="phone"
                    aria-label="Mobile number"
                    placeholder="Mobile number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div className="relative">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#6A6A6A]" />
                  <input
                    type="email"
                    autoComplete="email"
                    name="email"
                    aria-label="Email address"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputClass}
                  />
                </div>

                <p role="alert" className="min-h-[1.25rem] text-[15px] font-medium text-[#B42318]">
                  {error}
                </p>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={contactViaWhatsApp}
                    className="inline-flex h-14 flex-1 items-center justify-center gap-2.5 rounded-full bg-[#1AA755] px-6 text-[18px] font-bold tracking-[-0.01em] text-white transition hover:bg-[#158a46] active:scale-[.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1AA755]"
                  >
                    <MessageCircle size={20} />
                    Chat on WhatsApp
                  </button>
                  <button
                    type="button"
                    onClick={contactViaEmail}
                    className="inline-flex h-14 flex-1 items-center justify-center gap-2.5 rounded-full border bg-transparent px-6 text-[18px] font-bold tracking-[-0.01em] transition hover:bg-[#5B21B6] hover:text-white active:scale-[.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5B21B6]"
                    style={{ borderColor: ACCENT, color: undefined }}
                  >
                    <Mail size={20} />
                    Send an email
                  </button>
                </div>
              </div>
            </div>
          </div>

          <RiderPhoto />
        </section>
      </div>

      {/* ============ Requirements ============ */}
      <section className="py-16 lg:py-24">
        <div className={wrap}>
          <Reveal>
            <SectionTitle eyebrow="Before you start" sub="Three things to have in place before you start delivering with us.">
              What you need to ride with Koombo
            </SectionTitle>
          </Reveal>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {requirements.map(({ icon, title, text }, i) => (
              <Reveal key={title} delay={i * 0.1}>
                <article className={`${card} h-full`} style={{ borderColor: LINE }}>
                  <IconChip icon={icon} />
                  <h3 className="mt-6 text-[26px] font-semibold leading-[1.15] tracking-[-0.025em]">{title}</h3>
                  <p className="mt-3 text-[18px] leading-[1.5]" style={{ color: MUTED }}>{text}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ Availability ============ */}
      <section className="py-4 lg:py-8">
        <div className={wrap}>
          <div className="rounded-[28px] p-6 sm:p-8 lg:p-12" style={{ backgroundColor: TINT }}>
            <Reveal>
              <SectionTitle eyebrow="Your schedule" sub="Pick the slots that work for you. The more of the busy windows you cover, the more orders you get.">
                Ride when it suits you
              </SectionTitle>
            </Reveal>

            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {availability.map(({ icon, title, time, text }, i) => (
                <Reveal key={title} delay={i * 0.08}>
                  <article className="h-full rounded-[24px] bg-white p-7">
                    <IconChip icon={icon} />
                    <h3 className="mt-5 text-[26px] font-semibold leading-[1.15] tracking-[-0.025em]">{title}</h3>
                    <p className="mt-1 text-[20px] font-semibold" style={{ color: ACCENT }}>{time}</p>
                    <p className="mt-3 text-[18px] leading-[1.5]" style={{ color: MUTED }}>{text}</p>
                  </article>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.1}>
              <p className="mt-8 flex items-center gap-3 text-[18px]" style={{ color: MUTED }}>
                <CalendarDays size={22} style={{ color: ACCENT }} />
                Tell us which slots you can cover when you get in touch.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============ Commission ============ */}
      <section className="py-16 lg:py-24">
        <div className={wrap}>
          <Reveal>
            <SectionTitle eyebrow="Your earnings" sub="You keep most of every delivery fee, and all of your tips. Payouts land on a fixed schedule.">
              Earn on every delivery
            </SectionTitle>
          </Reveal>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            <Reveal>
              <article className="h-full rounded-[24px] p-8 text-white" style={{ backgroundColor: ACCENT }}>
                <div className="text-[clamp(72px,9vw,120px)] font-bold leading-none tracking-[-0.045em]">
                  <CountUp to={TERMS.riderSharePercent} suffix="%" />
                </div>
                <p className="mt-4 text-[26px] font-semibold leading-[1.15] tracking-[-0.025em]">of every delivery fee is yours</p>
                <p className="mt-3 text-[18px] leading-[1.5] text-white/75">Commission is paid on each completed order.</p>
              </article>
            </Reveal>

            <Reveal delay={0.1}>
              <article className={`${card} h-full p-8`} style={{ borderColor: LINE }}>
                <div className="text-[clamp(72px,9vw,120px)] font-bold leading-none tracking-[-0.045em]" style={{ color: ACCENT }}>
                  <CountUp to={TERMS.tipsPercent} suffix="%" />
                </div>
                <p className="mt-4 text-[26px] font-semibold leading-[1.15] tracking-[-0.025em]">of customer tips</p>
                <p className="mt-3 text-[18px] leading-[1.5]" style={{ color: MUTED }}>Every tip a customer adds goes straight to you.</p>
              </article>
            </Reveal>

            <Reveal delay={0.2}>
              <article className={`${card} flex h-full flex-col justify-between p-8`} style={{ borderColor: LINE }}>
                <IconChip icon={Wallet} />
                <div className="mt-10">
                  <div className="text-[clamp(48px,6vw,80px)] font-bold leading-none tracking-[-0.04em]">{TERMS.payoutFrequency}</div>
                  <p className="mt-4 text-[26px] font-semibold leading-[1.15] tracking-[-0.025em]">payouts</p>
                  <p className="mt-3 text-[18px] leading-[1.5]" style={{ color: MUTED }}>Track what you’ve earned and what’s on the way.</p>
                </div>
              </article>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============ Incentives ============ */}
      <section className="py-4 lg:py-8">
        <div className={wrap}>
          <div className="rounded-[28px] p-6 sm:p-8 lg:p-12" style={{ backgroundColor: TINT }}>
            <Reveal>
              <SectionTitle eyebrow="Perks" sub="Commission is just the start. Riders who keep delivering get rewarded.">
                Bonuses, boosts and free merch
              </SectionTitle>
            </Reveal>

            <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-6">
              {incentives.map(({ icon, title, text, big }, i) => (
                <Reveal
                  key={title}
                  delay={i * 0.1}
                  className={big ? "md:col-span-2 lg:col-span-3 lg:row-span-2" : "lg:col-span-3"}
                >
                  {big ? (
                    <article className="h-full rounded-[24px] p-8 text-white sm:p-10" style={{ backgroundColor: ACCENT }}>
                      <div className="flex h-full min-h-[18rem] flex-col justify-between">
                        <IconChip icon={icon} light />
                        <div>
                          <Gift className="mb-4 text-[#DDD6FE]" size={28} />
                          <h3 className="text-[clamp(32px,4vw,48px)] font-bold leading-[1.05] tracking-[-0.035em]">{title}</h3>
                          <p className="mt-3 max-w-md text-[20px] leading-[1.5] text-white/80">{text}</p>
                        </div>
                      </div>
                    </article>
                  ) : (
                    <article className="h-full rounded-[24px] bg-white p-7">
                      <IconChip icon={icon} />
                      <h3 className="mt-5 text-[26px] font-semibold leading-[1.15] tracking-[-0.025em]">{title}</h3>
                      <p className="mt-3 text-[18px] leading-[1.5]" style={{ color: MUTED }}>{text}</p>
                    </article>
                  )}
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ Closing call to action ============ */}
      <section className="py-16 lg:py-24">
        <div className={wrap}>
          <Reveal>
            <div
              className="rounded-[28px] px-6 py-14 text-center sm:px-12 sm:py-20"
              style={{ backgroundColor: TINT }}
            >
              <h2 className="mx-auto max-w-3xl text-[clamp(36px,5vw,68px)] font-bold leading-[1.04] tracking-[-0.035em]">
                Ready to ride with <span style={{ color: ACCENT }}>Koombo?</span>
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-[20px] leading-[1.5] sm:text-[22px]" style={{ color: MUTED }}>
                Send us your number or email and we’ll get you started.
              </p>
              <a
                href="#rider"
                className="mt-8 inline-flex h-14 items-center justify-center gap-2.5 rounded-full px-8 text-[18px] font-bold tracking-[-0.01em] text-white transition active:scale-[.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5B21B6]"
                style={{ backgroundColor: ACCENT }}
              >
                <ArrowUp size={20} />
                Get in touch
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
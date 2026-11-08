'use client';

import { useEffect, useRef, useState } from "react";
import {
  Check,
  Handshake,
  Send,
  ShoppingBag,
  Sparkles,
  Store,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

type Category = { id: string; label: string; src: string };

const CATEGORIES: Category[] = [
  { id: "fashion", label: "Fashion & Style", src: "/o.jpeg" },
  { id: "beauty", label: "Beauty & Care", src: "/i.jpg" },
  { id: "tech", label: "Gadgets & Tech", src: "/images.jpeg" },
  { id: "home", label: "Home & Living", src: "/bb.png" },
  { id: "secondhand", label: "Secondhand", src: "/fourth.jpeg" },
  { id: "art", label: "Perfumes", src: "/8.webp" },
  { id: "food", label: "Food & Groceries", src: "/10.jpeg" },
  { id: "fitness", label: "Health & Fitness", src: "/g.jpeg" },
];

/* What Loki does for each kind of person. Edit the wording to match
   exactly what Loki can do today. */
const LOKI_ROLES = [
  {
    id: "buyers",
    label: "Buyers",
    icon: ShoppingBag,
    title: "Find it. Trust it. Buy it.",
    points: [
      "Find the right product faster by simply asking",
      "Get quick answers about sellers, orders and delivery",
      "Spot fake or suspicious listings before you pay",
    ],
    question: "I need size 43 sneakers under GH₵ 900.",
    answer:
      "Here are 3 verified sellers with size 43 in stock. Want me to sort them by price or by delivery time?",
  },
  {
    id: "sellers",
    label: "Sellers",
    icon: Store,
    title: "List faster. Sell more.",
    points: [
      "Turn a photo and a few details into a ready listing",
      "Get help writing clear titles and descriptions",
      "Answer common buyer questions so you never miss a sale",
    ],
    question: "Help me list my Air runner sneakers.",
    answer:
      "Sure! Send me a photo, the size and your price, and I will draft the listing for you to review.",
  },
  {
    id: "connectors",
    label: "Connectors",
    icon: Handshake,
    title: "Connect. Share. Earn.",
    points: [
      "Find products and vendors worth promoting",
      "Get help with your referral links and your sales",
      "Understand exactly how your commission works",
    ],
    question: "Which products should I share this week?",
    answer:
      "Sneakers and beauty are popular right now. I can pick a few and get your referral links ready.",
  },
];

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setIsDesktop(mq.matches);

    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return isDesktop;
}

/* Fades + slides an element in the first time it scrolls into view */
function Reveal({
  children,
  delay = 0,
  y = 32,
  x = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  x?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "translate3d(0,0,0)" : `translate3d(${x}px, ${y}px, 0)`,
        transition: `opacity 0.9s cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 0.9s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/* Opens the Loki chat widget (Botpress) if it has loaded */
function openLokiChat() {
  if (typeof window === "undefined") return;
  const bp = (window as unknown as {
    botpress?: { toggle?: () => void; open?: () => void; show?: () => void };
  }).botpress;

  if (bp?.open) return bp.open();
  if (bp?.toggle) return bp.toggle();
  if (bp?.show) return bp.show();
}

/* ------------------------------------------------------------------ */
/* Arc carousel                                                        */
/* ------------------------------------------------------------------ */

const STEP = 17; // degrees between cards
const TOTAL = CATEGORIES.length * STEP; // full loop length in degrees
const FADE_START = 48;
const FADE_END = 66;
const AUTO_SPEED = -3.5; // degrees per second

function ArcCarousel({ onSelect }: { onSelect: (id: string) => void }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [rot, setRot] = useState(0);
  const [scale, setScale] = useState(1);

  const rotRef = useRef(0);
  const velRef = useRef(AUTO_SPEED);
  const dragging = useRef(false);
  const hovering = useRef(false);
  const moved = useRef(0);
  const lastX = useRef(0);
  const lastT = useRef(0);
  const reduced = useRef(false);

  // Responsive scale
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const update = () => setScale(Math.min(1.15, Math.max(0.55, el.clientWidth / 1100)));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Auto-rotation + inertia
  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let prev = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - prev) / 1000);
      prev = now;
      if (!dragging.current) {
        const target = reduced.current || hovering.current ? 0 : AUTO_SPEED;
        velRef.current += (target - velRef.current) * Math.min(1, dt * 1.6);
        rotRef.current += velRef.current * dt;
        setRot(rotRef.current);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    moved.current = 0;
    lastX.current = e.clientX;
    lastT.current = performance.now();
    velRef.current = 0;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    const now = performance.now();
    const dx = e.clientX - lastX.current;
    const dDeg = (dx / scale) * 0.12;
    moved.current += Math.abs(dx);
    rotRef.current += dDeg;
    const dt = Math.max(1, now - lastT.current) / 1000;
    velRef.current = dDeg / dt;
    lastX.current = e.clientX;
    lastT.current = now;
    setRot(rotRef.current);
  };

  const onPointerUp = () => {
    dragging.current = false;
    velRef.current = Math.max(-180, Math.min(180, velRef.current));
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") velRef.current = STEP * 3;
    if (e.key === "ArrowRight") velRef.current = -STEP * 3;
  };

  const R = 640 * scale;
  const cardW = 190 * scale;
  const cardH = 236 * scale;

  return (
    <div
      ref={wrapRef}
      role="group"
      aria-roledescription="carousel"
      aria-label="Koombo categories. Drag or use the arrow keys to turn."
      tabIndex={0}
      onKeyDown={onKeyDown}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onPointerEnter={() => (hovering.current = true)}
      onPointerLeave={() => (hovering.current = false)}
      className="relative mx-auto w-full max-w-[1400px] cursor-grab touch-pan-y select-none overflow-hidden outline-none active:cursor-grabbing focus-visible:ring-2 focus-visible:ring-[#1f1f1f]"
      style={{
        height: 470 * scale,
        WebkitMaskImage: "linear-gradient(to bottom, #000 72%, transparent 100%)",
        maskImage: "linear-gradient(to bottom, #000 72%, transparent 100%)",
      }}
    >
      {CATEGORIES.map((cat, i) => {
        // wrap angle into [-TOTAL/2, TOTAL/2)
        const raw = i * STEP + rot;
        const theta = ((((raw + TOTAL / 2) % TOTAL) + TOTAL) % TOTAL) - TOTAL / 2;
        const abs = Math.abs(theta);
        const opacity =
          abs <= FADE_START ? 1 : Math.max(0, 1 - (abs - FADE_START) / (FADE_END - FADE_START));
        if (opacity <= 0) return null;

        const rad = (theta * Math.PI) / 180;
        const x = R * Math.sin(rad);
        const y = R * (1 - Math.cos(rad)) + 36 * scale;

        return (
          <button
            key={cat.id}
            type="button"
            aria-label={`Browse ${cat.label}`}
            onClick={() => {
              if (moved.current < 6) onSelect(cat.id);
            }}
            className="absolute left-1/2 top-0 block overflow-hidden bg-white shadow-[0_20px_40px_rgba(0,0,0,0.12)] outline-none transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_24px_50px_rgba(0,0,0,0.18)] focus-visible:ring-4 focus-visible:ring-[#1f1f1f]"
            style={{
              width: cardW,
              height: cardH,
              borderRadius: 26 * scale,
              opacity,
              transform: `translate(-50%, 0) translate(${x}px, ${y}px) rotate(${theta}deg) scale(${Math.abs(theta) < 18 ? 1.03 : 1})`,
              willChange: "transform, box-shadow",
            }}
          >
            <img
              src={cat.src}
              alt=""
              draggable={false}
              className="h-full w-full object-cover"
            />
            <span
              className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-3 pb-3 pt-10 text-left text-sm font-semibold text-white"
              style={{ fontSize: Math.max(12, 14 * scale) }}
            >
              {cat.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Loki section                                                        */
/*                                                                     */
/* One brand color only: #3A1D6E (deep purple), used as a solid fill,  */
/* with white and tints (opacity) of that same color. No gradients,    */
/* glow blobs or extra accent colors.                                  */
/*                                                                     */
/* Mobile order:  heading + tabs -> chat card -> points + button       */
/* Desktop:       left column (heading, tabs, points, button)          */
/*                right column (chat card, vertically centred)         */
/* ------------------------------------------------------------------ */

function LokiSection() {
  const [roleId, setRoleId] = useState(LOKI_ROLES[0].id);
  const role = LOKI_ROLES.find((r) => r.id === roleId) ?? LOKI_ROLES[0];

  return (
    <section className="px-3 pb-12 sm:px-8 md:pb-28" aria-labelledby="loki-heading">
      <Reveal y={40}>
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[1.75rem] bg-[#3A1D6E] text-white sm:rounded-[2.5rem]">
          <div className="grid gap-6 px-4 py-7 sm:gap-8 sm:px-10 sm:py-12 lg:grid-cols-[1.05fr_.95fr] lg:grid-rows-[auto_1fr] lg:gap-x-16 lg:gap-y-0 lg:px-16 lg:py-20">

            {/* ---------- A: heading + tabs ---------- */}
            <div className="min-w-0 lg:col-start-1 lg:row-start-1">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/25 px-3 py-1 text-[11px] font-semibold text-white sm:px-3.5 sm:py-1.5 sm:text-xs">
                <Sparkles size={13} aria-hidden />
                Meet Loki
              </span>

              <h2
                id="loki-heading"
                className="mt-3 text-[1.6rem] font-extrabold leading-[1.1] tracking-tight min-[380px]:text-[1.85rem] sm:mt-5 sm:text-5xl"
              >
                Loki, our custom AI assistant
              </h2>

              <p className="mt-2 max-w-lg text-[0.88rem] leading-6 text-white/75 sm:mt-4 sm:text-lg sm:leading-8">
                Built into Koombo to make the work easier for everyone, from
                first search to final sale.
              </p>

              {/* role tabs */}
              <div
                role="tablist"
                aria-label="How Loki helps"
                className="mt-5 grid w-full grid-cols-3 gap-1 rounded-2xl border border-white/20 p-1 sm:mt-8 sm:inline-grid sm:w-auto sm:rounded-full sm:p-1.5"
              >
                {LOKI_ROLES.map(({ id, label, icon: Icon }) => {
                  const selected = id === roleId;
                  return (
                    <button
                      key={id}
                      role="tab"
                      type="button"
                      aria-selected={selected}
                      onClick={() => setRoleId(id)}
                      className={`flex min-w-0 items-center justify-center gap-1.5 rounded-xl px-1.5 py-2 text-[11px] font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white min-[380px]:text-xs sm:gap-2 sm:rounded-full sm:px-5 sm:py-2.5 sm:text-sm ${
                        selected
                          ? "bg-white text-[#3A1D6E]"
                          : "text-white/80 hover:bg-white/10"
                      }`}
                    >
                      <Icon size={15} aria-hidden className="shrink-0" />
                      <span className="truncate">{label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ---------- B: chat preview card ---------- */}
            <Reveal
              x={0}
              y={24}
              delay={120}
              className="min-w-0 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-center"
            >
              <div className="mx-auto w-full max-w-[22rem] sm:max-w-md lg:ml-auto lg:mr-0">
                <div className="overflow-hidden rounded-2xl bg-white text-[#20201F] shadow-[0_10px_30px_rgba(0,0,0,0.18)] sm:rounded-3xl">

                  {/* header */}
                  <div className="flex items-center gap-2.5 border-b border-[#3A1D6E]/15 px-3.5 py-2.5 sm:gap-3 sm:px-5 sm:py-4">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#3A1D6E] text-white sm:h-10 sm:w-10">
                      <Sparkles size={16} aria-hidden />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[13px] font-extrabold leading-tight text-[#3A1D6E] sm:text-sm">
                        Loki
                      </p>
                      <p className="truncate text-[11px] text-[#3A1D6E]/65 sm:text-xs">
                        Koombo assistant
                      </p>
                    </div>
                    <span className="ml-auto shrink-0 rounded-full border border-[#3A1D6E]/25 px-2 py-0.5 text-[9px] font-bold text-[#3A1D6E]/70 sm:px-2.5 sm:py-1 sm:text-[10px]">
                      Example
                    </span>
                  </div>

                  {/* messages: small fixed min-height so switching tabs doesn't jump the page */}
                  <div
                    key={role.id}
                    className="animate-fade-in-up flex min-h-[150px] flex-col justify-end gap-2.5 px-3.5 py-4 text-[13px] leading-[1.45] sm:min-h-[250px] sm:gap-3 sm:px-4 sm:py-5 sm:text-sm sm:leading-6"
                  >
                    <p className="max-w-[88%] self-end break-words rounded-2xl rounded-br-sm bg-[#3A1D6E] px-3.5 py-2 text-white sm:px-4 sm:py-2.5">
                      {role.question}
                    </p>
                    <p className="max-w-[92%] self-start break-words rounded-2xl rounded-bl-sm bg-[#3A1D6E]/10 px-3.5 py-2 text-[#3A1D6E] sm:max-w-[90%] sm:px-4 sm:py-2.5">
                      {role.answer}
                    </p>
                  </div>

                  {/* fake input */}
                  <div
                    aria-hidden
                    className="flex items-center gap-2.5 border-t border-[#3A1D6E]/15 px-3.5 py-2 sm:gap-3 sm:px-4 sm:py-3"
                  >
                    <span className="min-w-0 flex-1 truncate text-[13px] text-[#3A1D6E]/50 sm:text-sm">
                      Ask Loki anything…
                    </span>
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#3A1D6E] text-white sm:h-9 sm:w-9">
                      <Send size={14} />
                    </span>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* ---------- C: role details + button ---------- */}
            <div className="min-w-0 lg:col-start-1 lg:row-start-2">
              <div key={role.id} role="tabpanel" className="animate-fade-in-up">
                <h3 className="text-lg font-extrabold tracking-tight sm:mt-7 sm:text-3xl">
                  {role.title}
                </h3>

                <ul className="mt-3 space-y-2.5 sm:mt-5 sm:space-y-3">
                  {role.points.map((point) => (
                    <li
                      key={point}
                      className="flex items-start gap-2.5 text-[0.88rem] leading-6 text-white/85 sm:gap-3 sm:text-[0.95rem] sm:leading-7"
                    >
                      <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-white/15 sm:mt-1 sm:h-6 sm:w-6">
                        <Check size={12} strokeWidth={3} aria-hidden />
                      </span>
                      <span className="min-w-0">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 flex flex-col gap-2.5 sm:mt-9 sm:flex-row sm:items-center sm:gap-5">
                <button
                  type="button"
                  onClick={openLokiChat}
                  className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-[#3A1D6E] transition hover:bg-white/90 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/40 sm:w-auto sm:px-7 sm:py-4 sm:text-base"
                >
                  Send us a message
                  <Send
                    size={17}
                    aria-hidden
                    className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </button>
                <p className="text-center text-xs text-white/65 sm:text-left sm:text-sm">
                  Questions or ideas? We would love to hear from you.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function KoomboCategories() {
  const [active, setActive] = useState<string>("all");
  const isDesktop = useIsDesktop();

  const selectCategory = (id: string) => {
    setActive(id);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        .font-airbnb {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          letter-spacing: -0.02em;
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation: none !important; }
          .animate-fade-in-up { opacity: 1; }
        }
      `}</style>

      {/* Full category UI: visible on all screens without any splash blocking. */}
      <div className="font-airbnb min-h-screen overflow-x-hidden bg-white">
        <section className="relative w-full overflow-hidden pt-12 pb-20 md:pt-16 md:pb-32">
          {isDesktop && <ArcCarousel onSelect={selectCategory} />}

          <div
            className="animate-fade-in-up relative z-10 mx-auto max-w-4xl px-6 pt-8 text-center"
            style={{ animationDelay: ".1s" }}
          >
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-[#1f1f1f]">
              KOOMBO CATEGORIES
            </p>
            <h2 className="text-5xl font-extrabold leading-[1.05] tracking-tight text-[#222222] sm:text-6xl md:text-7xl lg:text-[clamp(3.5rem,8vw,6.5rem)]">
              Everything you want
              <br className="hidden sm:block" /> in one platform
            </h2>

            {/* Category filter pills */}
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              {[{ id: "all", label: "All Categories" }, ...CATEGORIES].map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => selectCategory(c.id)}
                  className={`rounded-full border px-5 py-2.5 text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1f1f1f] ${
                    active === c.id
                      ? "scale-105 border-[#1f1f1f] bg-[#1f1f1f] text-white shadow-md"
                      : "border-gray-200 bg-white text-[#222222] hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Loki, our custom AI assistant */}
        <LokiSection />
      </div>
    </>
  );
}
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

/* What Shuri does for each kind of person. Edit the wording to match
   exactly what Shuri can do today. */
const SHURI_ROLES = [
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

/* Opens the native Shuri chat widget */
function openShuriChat() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent('koombo-shuri-open'));
}

/* ------------------------------------------------------------------ */
/* Shuri section: mobile-first                                         */
/*                                                                     */
/* One brand color only: #3A1D6E, plus white and tints of it.          */
/* Mobile order: heading + tabs -> chat card -> points + button        */
/* Desktop (lg): left column text, right column chat card              */
/* ------------------------------------------------------------------ */

export default function ShuriSection() {
  const [roleId, setRoleId] = useState<string>(SHURI_ROLES[0].id);
  const role = SHURI_ROLES.find((r) => r.id === roleId) ?? SHURI_ROLES[0];

  return (
    <>
      {/* Animation used by this section (kept here so the file is self-contained) */}
      <style>{`
        @keyframes shuriFadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: shuriFadeInUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-fade-in-up { animation: none !important; opacity: 1; }
        }
      `}</style>

      <section className="px-3 pb-12 sm:px-8 md:pb-28" aria-labelledby="shuri-heading">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-4xl bg-[#3A1D6E] text-white sm:rounded-[2.5rem]">
          <div className="grid gap-8 px-5 py-8 sm:px-10 sm:py-12 lg:grid-cols-[1.05fr_.95fr] lg:grid-rows-[auto_1fr] lg:gap-x-16 lg:gap-y-0 lg:px-16 lg:py-20">

            {/* ---------- A: heading + tabs ---------- */}
            <div className="min-w-0 lg:col-start-1 lg:row-start-1">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/25 px-3.5 py-1.5 text-xs font-semibold">
                <Sparkles size={14} aria-hidden />
                Meet Shuri
              </span>

              <h2
                id="shuri-heading"
                className="mt-4 text-[2rem] font-extrabold leading-[1.1] tracking-tight sm:text-5xl"
              >
                Shuri, our custom AI assistant
              </h2>

              <p className="mt-3 max-w-lg text-base leading-relaxed text-white/75 sm:mt-4 sm:text-lg sm:leading-8">
                Built into Koombo to make the work easier for everyone, from
                first search to final sale.
              </p>

              {/* role tabs */}
              <div
                role="tablist"
                aria-label="How Shuri helps"
                className="mt-6 grid w-full grid-cols-3 gap-1 rounded-[1.25rem] bg-white/10 p-1 sm:mt-8 sm:inline-grid sm:w-auto sm:rounded-full sm:p-1.5"
              >
                {SHURI_ROLES.map(({ id, label, icon: Icon }) => {
                  const selected = id === roleId;
                  return (
                    <button
                      key={id}
                      id={`shuri-tab-${id}`}
                      role="tab"
                      type="button"
                      aria-selected={selected}
                      aria-controls="shuri-panel"
                      onClick={() => setRoleId(id)}
                      className={`flex h-14 min-w-0 flex-col items-center justify-center gap-1 rounded-2xl px-2 text-[13px] font-bold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:h-12 sm:flex-row sm:gap-2 sm:rounded-full sm:px-6 sm:text-sm ${
                        selected
                          ? "bg-white text-[#3A1D6E]"
                          : "text-white/80 active:bg-white/10 sm:hover:bg-white/10"
                      }`}
                    >
                      <Icon size={18} aria-hidden className="shrink-0" />
                      <span className="max-w-full truncate leading-none">{label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ---------- B: chat preview card ---------- */}
            <Reveal
              x={0}
              y={24}
              delay={80}
              className="min-w-0 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-center"
            >
              <div className="w-full sm:mx-auto sm:max-w-md lg:ml-auto lg:mr-0">
                <div className="overflow-hidden rounded-3xl bg-white text-[#20201F] shadow-[0_12px_32px_rgba(0,0,0,0.22)]">

                  {/* header */}
                  <div className="flex items-center gap-3 border-b border-[#3A1D6E]/15 px-4 py-3.5 sm:px-5 sm:py-4">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#3A1D6E] text-white">
                      <Sparkles size={18} aria-hidden />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[15px] font-extrabold leading-tight text-[#3A1D6E]">
                        Shuri
                      </p>
                      <p className="truncate text-xs text-[#3A1D6E]/65">
                        Koombo assistant
                      </p>
                    </div>
                    <span className="ml-auto shrink-0 rounded-full border border-[#3A1D6E]/25 px-2.5 py-1 text-[11px] font-bold text-[#3A1D6E]/70">
                      Example
                    </span>
                  </div>

                  {/* messages: steady height so switching tabs never jumps the page */}
                  <div
                    key={role.id}
                    className="flex min-h-60 flex-col justify-end gap-3 px-4 py-5 text-[15px] leading-6 sm:min-h-67.5 sm:px-5"
                  >
                    <p className="animate-fade-in-up wrap-break-word max-w-[88%] self-end rounded-2xl rounded-br-md bg-[#3A1D6E] px-4 py-3 text-white">
                      {role.question}
                    </p>
                    <p
                      className="animate-fade-in-up wrap-break-word max-w-[92%] self-start rounded-2xl rounded-bl-md bg-[#3A1D6E]/10 px-4 py-3 text-[#3A1D6E]"
                      style={{ animationDelay: "0.35s" }}
                    >
                      {role.answer}
                    </p>
                  </div>

                  {/* fake input */}
                  <div aria-hidden className="border-t border-[#3A1D6E]/15 p-3 sm:p-4">
                    <div className="flex h-12 items-center gap-3 rounded-full bg-[#3A1D6E]/[0.07] pl-4 pr-1.5">
                      <span className="min-w-0 flex-1 truncate text-sm text-[#3A1D6E]/55">
                        Ask Shuri anything…
                      </span>
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#3A1D6E] text-white">
                        <Send size={15} />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* ---------- C: role details + button ---------- */}
            <div className="min-w-0 lg:col-start-1 lg:row-start-2 lg:mt-10">
              <div
                key={role.id}
                id="shuri-panel"
                role="tabpanel"
                aria-labelledby={`shuri-tab-${role.id}`}
                className="animate-fade-in-up"
              >
                <h3 className="text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl">
                  {role.title}
                </h3>

                <ul className="mt-4 space-y-3.5 sm:mt-5">
                  {role.points.map((point) => (
                    <li
                      key={point}
                      className="flex items-start gap-3 text-[15px] leading-6 text-white/90 sm:text-base sm:leading-7"
                    >
                      <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-white/15">
                        <Check size={14} strokeWidth={3} aria-hidden />
                      </span>
                      <span className="min-w-0">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:mt-9 sm:flex-row sm:items-center sm:gap-5">
                <button
                  type="button"
                  onClick={openShuriChat}
                  className="group inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-white px-7 text-base font-bold text-[#3A1D6E] transition-colors hover:bg-white/90 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/40 sm:w-auto"
                >
                  Send us a message
                  <Send
                    size={18}
                    aria-hidden
                    className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </button>
                <p className="text-center text-sm leading-6 text-white/70 sm:text-left">
                  Questions or ideas? We would love to hear from you.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
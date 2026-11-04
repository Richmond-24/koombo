"use client";

import { useState } from "react";

const faqs = [
  {
    question: "What is Koombo?",
    answer:
      "Koombo is a social commerce platform that connects local vendors with customers through live shopping experiences. Discover authentic products, follow your favorite sellers, and shop in real-time — all in one app.",
  },
  {
    question: "What locations do we currently deliver to?",
    answer:
      "We currently operate in major cities across Ghana including Accra, Kumasi, Sunyani, Takoradi, Cape Coast, and Tamale. We're expanding rapidly and adding new locations every month. Check the app for the most up-to-date coverage in your area.",
  },
  {
    question: "Will my products be fresh if I order on Koombo?",
    answer:
      "Absolutely! All our vendors are verified local businesses committed to quality. For food and perishable items, vendors prepare products fresh upon order. You can also watch live streams to see products being prepared in real-time before you buy.",
  },
  {
    question: "How do I sign up as a vendor on Koombo?",
    answer:
      "Go to Playstore or App Store on your phone, search for Koombo Vendor and download the app. Create an account in minutes by entering your personal and business details, set up your storefront with product listings and prices, opening and closing times, average preparation time, and start receiving orders from customers in your area.",
  },
  {
    question: "How do I become a Koombo rider?",
    answer:
      "Download the Koombo Rider app, create an account with your valid ID and vehicle details, complete a brief onboarding session, and start accepting delivery requests. You earn per delivery with flexible hours — work when it suits you.",
  },
  {
    question: "What payment methods are accepted?",
    answer:
      "We accept mobile money (MTN MoMo, Vodafone Cash, AirtelTigo Money), bank cards (Visa, Mastercard), and cash on delivery. All digital payments are processed securely through our encrypted payment gateway.",
  },
];

const BOLD = ["Koombo Vendor", "Koombo Rider", "Koombo"];

/* answer text; on desktop each word fades up one after another */
function Answer({ text, stagger = false }: { text: string; stagger?: boolean }) {
  let n = 0;
  return (
    <>
      {text.split(/(Koombo Vendor|Koombo Rider|Koombo)/g).map((part, i) => {
        const bold = BOLD.includes(part);
        return part.split(/(\s+)/).map((tok, j) =>
          tok === "" || /^\s+$/.test(tok) ? (
            tok
          ) : (
            <span
              key={`${i}-${j}`}
              className={`inline-block ${bold ? "font-black" : ""} ${stagger ? "faq-word" : ""}`}
              style={stagger ? { animationDelay: `${Math.min(n++, 55) * 16 + 250}ms` } : undefined}
            >
              {tok}
            </span>
          )
        );
      })}
    </>
  );
}

const Star = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.09 6.26L20.18 9l-5 4.27L16.18 20 12 16.27 7.82 20l1-6.73-5-4.27 6.09-.74L12 2z" /></svg>
);
const Chevron = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
);

export default function FAQSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(3);

  const handleToggle = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="reveal-on-scroll bg-white px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <style>{`
        @keyframes faq-in{from{opacity:0;transform:translateX(36px) scale(.98)}to{opacity:1;transform:none}}
        @keyframes faq-wipe{from{transform:translateX(0)}to{transform:translateX(101%)}}
        @keyframes faq-word{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
        @keyframes faq-spin{from{transform:rotate(-180deg) scale(.2);opacity:0}to{transform:none;opacity:1}}
        .faq-in{animation:faq-in .6s cubic-bezier(.16,1,.3,1) both}
        .faq-wipe{animation:faq-wipe .7s cubic-bezier(.65,0,.35,1) both}
        .faq-word{opacity:0;animation:faq-word .5s cubic-bezier(.16,1,.3,1) forwards}
        .faq-spin{animation:faq-spin .6s cubic-bezier(.16,1,.3,1) both}
        @media(prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}.faq-word{opacity:1}}
      `}</style>

      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          {/* LEFT COLUMN - FAQs (on phones the answer opens right under the question) */}
          <div>
            <h2 className="mb-8 text-6xl font-black tracking-tight text-[#4C1D95] sm:text-7xl lg:text-8xl">FAQs.</h2>

            <div className="space-y-3">
              {faqs.map((faq, index) => {
                const isActive = index === activeIndex;
                return (
                  <div key={index}>
                    <button
                      type="button"
                      onClick={() => handleToggle(index)}
                      aria-expanded={isActive}
                      aria-controls={`faq-panel-${index}`}
                      className={`group w-full rounded-2xl px-6 py-5 text-left transition-all duration-300 ${
                        isActive ? "bg-[#0a0a0a] text-white shadow-lg lg:translate-x-2" : "border border-gray-100 bg-[#f8f9fa] text-[#4C1D95] hover:bg-[#eef2f2]"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-base font-semibold leading-snug sm:text-lg">{faq.question}</span>
                        {isActive ? (
                          <Star key="s" className="faq-spin h-6 w-6 flex-shrink-0 text-[#FFC107]" />
                        ) : (
                          <Chevron className="h-5 w-5 flex-shrink-0 text-[#4C1D95]/40 transition group-hover:translate-y-0.5 lg:hidden" />
                        )}
                      </div>
                    </button>

                    {/* phones / tablets: answer slides open under the question */}
                    <div
                      id={`faq-panel-${index}`}
                      className={`grid transition-[grid-template-rows,opacity] duration-500 ease-out lg:hidden ${isActive ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
                    >
                      <div className="overflow-hidden">
                        <div className="mt-2 rounded-2xl bg-[#FFC107] p-5 text-base font-medium leading-relaxed text-black shadow-md sm:p-6 sm:text-lg">
                          <Answer text={faq.answer} />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT COLUMN - Ans. (desktop): stays in view while you click through */}
          <div className="hidden self-start lg:sticky lg:top-24 lg:block">
            <h2 className="mb-8 text-6xl font-black tracking-tight text-[#4C1D95] sm:text-7xl lg:text-8xl">Ans.</h2>

            {activeIndex !== null ? (
              <div className="relative min-h-[320px] overflow-hidden rounded-3xl bg-[#FFC107] shadow-xl" aria-live="polite">
                {/* panel that sweeps across to reveal the new answer */}
                <div key={`wipe-${activeIndex}`} className="faq-wipe pointer-events-none absolute inset-0 z-10 bg-[#E0A700]" />

                <div key={activeIndex} className="faq-in p-8 sm:p-10 lg:p-12">
                  <div className="mb-6 flex items-center justify-between">
                    <Star className="faq-spin h-8 w-8 text-black" />
                    <span className="rounded-full bg-black/10 px-3 py-1 text-xs font-bold tracking-widest text-black/70">
                      {String(activeIndex + 1).padStart(2, "0")} / {String(faqs.length).padStart(2, "0")}
                    </span>
                  </div>

                  <p className="text-lg font-medium leading-relaxed text-black sm:text-xl lg:text-2xl">
                    <Answer text={faqs[activeIndex].answer} stagger />
                  </p>
                </div>
              </div>
            ) : (
              <div className="relative min-h-[320px] overflow-hidden rounded-3xl bg-[#FFC107]/30 shadow-xl flex items-center justify-center p-8 sm:p-10 lg:p-12">
                <p className="text-lg font-medium text-black/50 text-center">
                  Select a question to view the answer
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
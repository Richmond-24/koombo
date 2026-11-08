
"use client";

import { useState } from "react";

const faqs = [
  {
    question: "What is Koombo, and how does it work?",
    answer:
      "Koombo is a social commerce platform that makes discovering and shopping for products more engaging. Explore product photos and videos, discover items from different sellers, and connect directly with the people behind the products. Find something you love, start a conversation with the seller, and take the next step toward making it yours.",
  },
  {
    question: "How do I discover products on Koombo?",
    answer:
      "Explore Koombo to discover products through engaging photos, videos, and seller listings. Browse items that catch your attention, learn more about what sellers offer, and discover new products as you explore. Whether you know exactly what you want or simply want to see what's out there, Koombo makes finding your next favourite product easier.",
  },
  {
    question: "How do I buy a product I find on Koombo?",
    answer:
      "When you find something you like, open its listing to learn more about the product and the seller. You can contact the seller to ask questions, confirm availability, and discuss the details of your purchase. Follow the purchase instructions provided in the listing or by the seller. Available ordering and payment options may depend on the features Koombo has enabled and the seller's arrangements.",
  },
  {
    question: "Can I chat directly with sellers?",
    answer:
      "Yes! Koombo is designed to help buyers connect with sellers instead of simply browsing products. You can start a conversation about a product, ask questions, and discuss your purchase. Koombo's messaging experience is designed to connect buyers using the app with sellers through supported communication channels, including WhatsApp or Telegram where configured.",
  },
  {
    question: "How can I sell products on Koombo?",
    answer:
      "Koombo helps sellers showcase their products to people who are ready to discover something new. Create your seller account, provide your store details, and submit your products for listing. Add clear product photos, videos, descriptions, and prices so buyers can understand what you offer. Once your listings are approved and published, potential customers can discover your products and contact you.",
  },
  {
    question: "How do sellers add products to Koombo?",
    answer:
      "Koombo is designed to make product listing convenient for sellers. Rather than requiring sellers to manage every task through a separate seller application, supported listing workflows can let them submit product details and media through connected messaging channels such as Telegram. Submitted listings can be reviewed before publication, helping ensure that products displayed on Koombo meet the platform's requirements.",
  },
  {
    question: "How will I know when a seller replies to my message?",
    answer:
      "Koombo is designed to make communication between buyers and sellers easier. When messaging and notifications are enabled, you can receive updates about seller replies through the app. This helps you follow conversations, get answers to your questions, and continue discussing a product without constantly checking another messaging platform.",
  },
  {
    question: "Are products reviewed before appearing on Koombo?",
    answer:
      "Koombo can review submitted product listings before they appear on the platform. This helps the team check listing information, product images, descriptions, and compliance with platform requirements. Approval does not guarantee a seller's trustworthiness or product quality, so buyers should still ask questions, confirm important details, and exercise good judgment before purchasing.",
  },
];

const BOLD = ["Koombo", "WhatsApp", "Telegram"];

function Answer({
  text,
  stagger = false,
}: {
  text: string;
  stagger?: boolean;
}) {
  let n = 0;

  return (
    <>
      {text.split(/(WhatsApp|Telegram|Koombo)/g).map((part, i) => {
        const bold = BOLD.includes(part);

        return part.split(/(\s+)/).map((tok, j) =>
          tok === "" || /^\s+$/.test(tok) ? (
            tok
          ) : (
            <span
              key={`${i}-${j}`}
              className={`inline-block ${
                bold ? "font-black" : ""
              } ${stagger ? "faq-word" : ""}`}
              style={
                stagger
                  ? {
                      animationDelay: `${
                        Math.min(n++, 55) * 16 + 250
                      }ms`,
                    }
                  : undefined
              }
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
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M12 2l2.09 6.26L20.18 9l-5 4.27L16.18 20 12 16.27 7.82 20l1-6.73-5-4.27 6.09-.74L12 2z" />
  </svg>
);

const Chevron = ({ className = "" }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.4"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export default function FAQSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  const handleToggle = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="reveal-on-scroll bg-white px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <style>{`
        @keyframes faq-in {
          from {
            opacity: 0;
            transform: translateX(36px) scale(.98);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }

        @keyframes faq-wipe {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(101%);
          }
        }

        @keyframes faq-word {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }

        @keyframes faq-spin {
          from {
            transform: rotate(-180deg) scale(.2);
            opacity: 0;
          }
          to {
            transform: none;
            opacity: 1;
          }
        }

        .faq-in {
          animation: faq-in .6s cubic-bezier(.16,1,.3,1) both;
        }

        .faq-wipe {
          animation: faq-wipe .7s cubic-bezier(.65,0,.35,1) both;
        }

        .faq-word {
          opacity: 0;
          animation: faq-word .5s cubic-bezier(.16,1,.3,1) forwards;
        }

        .faq-spin {
          animation: faq-spin .6s cubic-bezier(.16,1,.3,1) both;
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation: none !important;
            transition: none !important;
          }

          .faq-word {
            opacity: 1;
          }
        }
      `}</style>

      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          {/* LEFT COLUMN — FAQ QUESTIONS */}
          <div>
            <h2 className="kb-section-title mb-8 text-[#4C1D95]">
              FAQs.
            </h2>

            <div className="space-y-3">
              {faqs.map((faq, index) => {
                const isActive = index === activeIndex;

                return (
                  <div key={faq.question}>
                    <button
                      type="button"
                      onClick={() => handleToggle(index)}
                      aria-expanded={isActive}
                      aria-controls={`faq-panel-${index}`}
                      className={`group w-full rounded-2xl px-6 py-5 text-left transition-all duration-300 ${
                        isActive
                          ? "bg-[#0a0a0a] text-white shadow-lg lg:translate-x-2"
                          : "border border-gray-100 bg-[#f8f9fa] text-[#4C1D95] hover:bg-[#eef2f2]"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-base font-semibold leading-snug sm:text-lg">
                          {faq.question}
                        </span>

                        {isActive ? (
                          <Star
                            key="star"
                            className="faq-spin h-6 w-6 flex-shrink-0 text-white"
                          />
                        ) : (
                          <Chevron className="h-5 w-5 flex-shrink-0 text-[#4C1D95]/40 transition group-hover:translate-y-0.5 lg:hidden" />
                        )}
                      </div>
                    </button>

                    {/* MOBILE ANSWER */}
                    <div
                      id={`faq-panel-${index}`}
                      className={`grid transition-[grid-template-rows,opacity] duration-500 ease-out lg:hidden ${
                        isActive
                          ? "grid-rows-[1fr] opacity-100"
                          : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <div className="mt-2 rounded-2xl bg-[#374151] p-5 text-base font-medium leading-relaxed text-white shadow-md sm:p-6 sm:text-lg">
                          <Answer text={faq.answer} />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT COLUMN — DESKTOP ANSWER PANEL */}
          <div className="hidden self-start lg:sticky lg:top-24 lg:block">
            <h2 className="kb-section-title mb-8 text-[#4C1D95]">
              Ans.
            </h2>

            {activeIndex !== null ? (
              <div
                className="relative min-h-[320px] overflow-hidden rounded-3xl bg-[#374151] shadow-xl"
                aria-live="polite"
              >
                <div
                  key={`wipe-${activeIndex}`}
                  className="faq-wipe pointer-events-none absolute inset-0 z-10 bg-[#1F2937]"
                />

                <div key={activeIndex} className="faq-in p-8 sm:p-10 lg:p-12">
                  <div className="mb-6 flex items-center justify-between">
                    <Star className="faq-spin h-8 w-8 text-white" />

                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold tracking-widest text-white/70">
                      {String(activeIndex + 1).padStart(2, "0")} /{" "}
                      {String(faqs.length).padStart(2, "0")}
                    </span>
                  </div>

                  <h3 className="mb-5 text-xl font-bold text-white sm:text-2xl">
                    {faqs[activeIndex].question}
                  </h3>

                  <p className="text-lg font-medium leading-relaxed text-white sm:text-xl lg:text-2xl">
                    <Answer text={faqs[activeIndex].answer} stagger />
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex min-h-[320px] items-center justify-center rounded-3xl bg-[#374151]/30 p-8 shadow-xl sm:p-10 lg:p-12">
                <p className="text-center text-lg font-medium text-gray-500">
                  Select a question to view the answer.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

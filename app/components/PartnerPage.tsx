'use client';

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

/* Next.js + Tailwind. Drop <JoinNetworkSection /> anywhere.
   Copy is Koombo-flavoured – edit the text in the `cards` list. */

/* ---------- scroll fade-in ---------- */
function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setOn(true); io.disconnect(); } }, { threshold: 0.12 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-[900ms] ease-[cubic-bezier(.16,1,.3,1)] ${on ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"} ${className}`}>
      {children}
    </div>
  );
}

/* ---------- little icons (top-left of each card) ---------- */
const Burst = () => (
  <svg width="20" height="20" viewBox="0 0 28 28" aria-hidden><path fill="#FF8A4C" d="M14 1l3.3 3.1 4.5-.6 1.5 4.3 4.1 2.1-1.4 4.3 1.4 4.3-4.1 2.1-1.5 4.3-4.5-.6L14 27l-3.3-3.1-4.5.6-1.5-4.3-4.1-2.1 1.4-4.3-1.4-4.3 4.1-2.1 1.5-4.3 4.5.6L14 1Z" /></svg>
);
const HalfCircle = () => (
  <svg width="32" height="18" viewBox="0 0 40 24" aria-hidden><path fill="#06CF82" d="M0 24a20 20 0 0 1 40 0z" /></svg>
);
const Sparkle = () => (
  <svg width="28" height="28" viewBox="0 0 40 40" aria-hidden><path fill="#8B7BEF" d="M20 0c2 11 9 18 20 20-11 2-18 9-20 20-2-11-9-18-20-20C11 18 18 11 20 0Z" /></svg>
);
const ArrowRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);

/* ---------- data ---------- */
const cards: { icon: ReactNode; title: string; text: string; art: ReactNode; href: string; action: string }[] = [
  {
    icon: <Burst />, 
    title: "Start selling",
    text: "Do you own a boutique, store, or service? Join Koombo to reach new customers and grow your business with ease.",
    href: "/lister",
    action: "Start selling",
    art: <img src="/s.jpg" alt="Start selling on Koombo" className="h-full w-full object-cover" />,
  },
  {
    icon: <HalfCircle />, 
    title: "Deliver happiness",
    text: "Join our elite league of delivery riders delivering happiness to customers and earn to achieve your dreams while at it.",
    href: "/rider",
    action: "Become a rider",
    art: <img src="/koombo.jpeg" alt="Delivery rider" className="h-full w-full object-cover" />,
  },
  {
    icon: <Sparkle />, 
    title: "Become a Koombo connector today",
    text: "Help local sellers reach more customers and earn a 5% commission when the sellers you refer make sales. It’s a flexible way to earn without handling inventory.",
    href: "/lister/connectors",
    action: "Become a connector",
    art: <img src="/connect.jpg" alt="Become a Koombo connector" className="h-full w-full object-cover" />,
  },
];

export default function JoinNetworkSection() {
  return (
    <section id="partner" className="scroll-mt-24 w-full bg-white px-4 pb-16 pt-8 sm:px-6 sm:pb-20 sm:pt-12 lg:px-8">
      <style>{`
        @keyframes jn-bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(8px)}}
        @media(prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}
      `}</style>

      <div className="mx-auto max-w-[1100px]">
        {/* heading - Reduced size */}
        <Reveal>
          <h2 className="kb-section-title flex flex-wrap items-center justify-center gap-x-2 text-center text-[#1F1630]">
            Join our growing network
            <svg className="h-[.75em] w-[.75em] shrink-0 [animation:jn-bounce_2s_ease-in-out_infinite]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M12 3v17M5 13l7 7 7-7" />
            </svg>
          </h2>
        </Reveal>

        {/* cards - Reduced gaps and padding */}
        <div className="mt-8 grid min-w-0 grid-cols-1 gap-5 sm:mt-10 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cards.map((c, i) => (
            <Reveal key={c.title} delay={i * 130} className={`h-full min-w-0 ${i === 2 ? 'md:col-span-2 md:mx-auto md:w-1/2 lg:col-span-1 lg:w-full' : ''}`}>
              <a href={c.href} className="group block h-full text-inherit no-underline">
                <article className="flex h-full min-w-0 flex-col overflow-hidden rounded-[18px] border-2 border-black bg-white transition duration-300 hover:-translate-y-1.5 hover:shadow-[6px_8px_0_0_#000] sm:border-[2.5px]">
                  <div className="flex flex-1 flex-col px-5 pb-5 pt-5 sm:px-6 sm:pb-6 sm:pt-6">
                    <div className="flex h-8 items-end transition duration-500 group-hover:rotate-12 group-hover:scale-110">{c.icon}</div>
                    
                    {/* Title - Reduced size */}
                    <h3 className="mt-2 break-words text-xl font-extrabold leading-tight tracking-[-0.045em] text-black sm:mt-3 sm:text-2xl">{c.title}</h3>
                    
                    {/* Text - Reduced size */}
                    <p className="mt-2 flex-1 text-sm font-normal leading-relaxed tracking-[-0.01em] text-black sm:mt-3 sm:text-[15px]">{c.text}</p>
                    
                    {/* Action Link - Reduced size */}
                    <span className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-extrabold uppercase tracking-wide text-black sm:mt-5 sm:text-sm">
                      {c.action} <span className="transition-transform duration-300 group-hover:translate-x-1.5"><ArrowRight /></span>
                    </span>
                  </div>
                  
                  {/* Image Area - Reduced height */}
                  <div className="h-44 w-full shrink-0 overflow-hidden border-t-2 border-black sm:h-48 sm:border-t-[2.5px] lg:h-44">
                    <div className="h-full w-full transition-transform duration-700 group-hover:scale-105">
                      {c.art}
                    </div>
                  </div>
                </article>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

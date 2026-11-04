'use client';

import { Fragment, useState } from "react";

/* Photos: put your own pictures in  public/people/  (portrait, about 600x1100):
   koombo-1.jpg … koombo-6.jpg  — real shoppers & vendors in Ghana, shot with phones, products in hand.
   Until they exist, each card shows a gradient placeholder. */

type Toast = { title: string; text: string; time: string; pos: string };
type Moment = { src: string; from: string; to: string; toast?: Toast };

const MOMENTS: Moment[] = [
  { src: "/bb.png", from: "#E9A27C", to: "#7A4A3A", toast: { title: "New follower 🎉", text: "Ama's Boutique started following you", time: "34m ago", pos: "top-[50%]" } },
  { src: "/44.jpg", from: "#C98A6B", to: "#4A2F28" },
  { src: "/77.jpg", from: "#D8D2CC", to: "#6F6A66", toast: { title: "Vendor went live 🔴", text: "Kofi Kicks is selling sneakers right now", time: "12m ago", pos: "top-[24%]" } },
  { src: "/o.jpeg", from: "#E8D9C8", to: "#7B5B44", toast: { title: "Order accepted ✅", text: "Your vendor has accepted your order", time: "3m ago", pos: "bottom-3" } },
  { src: "/9.jpg", from: "#B7D8DD", to: "#3F6E78", toast: { title: "Someone liked your post ❤️", text: "Efua and 48 others liked your style pic", time: "1h ago", pos: "top-[38%]" } },
  { src: "/7.jpg", from: "#F0C9A8", to: "#8A5A3C", toast: { title: "New drop 🛍️", text: "Zainab Beauty just posted 3 new items", time: "5m ago", pos: "bottom-3" } },
];

function ToastView({ t }: { t: Toast }) {
  return (
    <div className={`absolute left-2 right-2 ${t.pos} flex items-center gap-2.5 rounded-xl bg-neutral-600/70 px-3 py-2.5 text-white shadow-lg backdrop-blur-md z-20`}>
      <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#5B21B6] md:h-9 md:w-9">
        <img src="/hero/logo-white.png" alt="" className="h-5 w-5 object-contain md:h-6 md:w-6" />
      </div>
      <div className="min-w-0 flex-1 leading-tight">
        <div className="flex items-baseline justify-between gap-2">
          <p className="truncate text-[12.5px] font-semibold md:text-[13.5px]">{t.title}</p>
          <span className="shrink-0 text-[10.5px] text-white/70 md:text-[11.5px]">{t.time}</span>
        </div>
        <p className="mt-0.5 truncate text-[11.5px] text-white/90 md:text-[12.5px]">{t.text}</p>
      </div>
    </div>
  );
}

function PhotoCard({ m, index }: { m: Moment; index: number }) {
  const [ok, setOk] = useState(true);
  
  // Staggered animation delays for natural pendulum effect
  const delay = `${index * 0.4}s`;
  // Slight random rotation variation for realism
  const rotateBase = index % 2 === 0 ? -3 : 3; 

  return (
    <div 
      className="relative w-[240px] shrink-0 md:w-[295px] origin-top animate-pendulum hover:[animation-play-state:paused]"
      style={{ 
        animationDelay: delay,
        transform: `rotate(${rotateBase}deg)` 
      }}
    >
      {/* Wooden Peg */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-8 bg-[#D4A373] rounded-sm shadow-md z-20 border-l border-white/20" />
      
      {/* Card Container */}
      <div
        className="relative h-[380px] md:h-[460px] overflow-hidden rounded-[24px] shadow-2xl ring-1 ring-black/5 transition-transform duration-300 hover:scale-[1.02]"
        style={{ background: `linear-gradient(160deg, ${m.from}, ${m.to})` }}
      >
        {ok && <img src={m.src} alt="" draggable={false} onError={() => setOk(false)} className="h-full w-full select-none object-cover" />}
        {m.toast && <ToastView t={m.toast} />}
        
        {/* Subtle inner shadow for depth */}
        <div className="absolute inset-0 rounded-[24px] shadow-[inset_0_0_20px_rgba(0,0,0,0.1)] pointer-events-none" />
      </div>
    </div>
  );
}

export default function KoomboMoments() {
  return (
    <section className="relative w-full overflow-hidden bg-[#FDFBF7] py-12 md:py-20">
      <style>{`
        @keyframes km-scroll { 
          from { transform: translateX(0); } 
          to { transform: translateX(-50%); } 
        }
        @keyframes pendulum {
          0%, 100% { transform: rotate(-3deg); }
          50% { transform: rotate(3deg); }
        }
        .km-track { 
          animation: km-scroll 60s linear infinite; 
        }
        .km-track:hover { 
          animation-play-state: paused; 
        }
        .animate-pendulum {
          animation: pendulum 4s ease-in-out infinite alternate;
        }
        /* Rope SVG styling */
        .rope-svg {
          filter: drop-shadow(0px 4px 6px rgba(0,0,0,0.1));
        }
        @media (prefers-reduced-motion: reduce) { 
          .km-track, .animate-pendulum { animation: none !important; } 
        }
      `}</style>

      {/* Background Texture (Optional subtle paper grain) */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />

      {/* The Rope */}
      <div className="absolute top-[100px] md:top-[140px] left-0 w-full h-[200px] pointer-events-none z-0">
        <svg className="w-full h-full rope-svg" preserveAspectRatio="none" viewBox="0 0 1440 200">
          {/* Main Rope Path - Sagging in the middle */}
          <path 
            d="M-100,20 Q720,180 1540,20" 
            fill="none" 
            stroke="#A68A64" 
            strokeWidth="3" 
            strokeLinecap="round"
          />
          {/* Rope Shadow/Highlight for 3D effect */}
          <path 
            d="M-100,22 Q720,182 1540,22" 
            fill="none" 
            stroke="#8C7352" 
            strokeWidth="1" 
            opacity="0.5"
          />
        </svg>
      </div>

      {/* Two identical groups side by side -> seamless endless loop */}
      <div className="km-track flex items-start justify-center pt-[80px] md:pt-[120px] w-max">
        {[0, 1].map((k) => (
          <div key={k} className="flex items-start shrink-0 gap-8 md:gap-12 px-4">
            {MOMENTS.map((m, i) => (
              <Fragment key={`${k}-${i}`}>
                <PhotoCard m={m} index={i} />
              </Fragment>
            ))}
          </div>
        ))}
      </div>
      
      {/* Bottom Fade for smooth edge blending */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#FDFBF7] to-transparent pointer-events-none" />
    </section>
  );
}
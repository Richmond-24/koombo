"use client";

import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";

const animatedPhrases = [
  { text: "Shop Faster", color: "text-[#5B21B6]" },
  { text: "Shop Cheaper", color: "text-[#FF6B8A]" },
  { text: "Shop Smarter", color: "text-[#FFB648]" },
  { text: "Shop Local", color: "text-[#008751]" },
  { text: "Shop Live", color: "text-[#7C5CFF]" },
];

export default function KoomboHeroArch() {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      // Fade out
      setIsVisible(false);
      
      // Wait for fade out, then change text and fade in
      setTimeout(() => {
        setPhraseIndex((prev) => (prev + 1) % animatedPhrases.length);
        setIsVisible(true);
      }, 400); // Matches the transition duration
    }, 2500); // Change text every 2.5 seconds

    return () => clearInterval(interval);
  }, []);

  const currentPhrase = animatedPhrases[phraseIndex];

  return (
    <section className="relative w-full min-h-screen bg-[#FDF6E3] overflow-hidden flex flex-col items-center pt-16 pb-12">
      
      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col items-center">
        
        {/* Headline */}
        <div className="text-center mb-8 relative z-20 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-[#1a1a1a] leading-[1.05] tracking-tight">
            Ready to turn your<br />
            <span className="text-[#5B21B6]">hustle into income?</span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-gray-600 max-w-xl mx-auto">
            Join thousands of Ghanaian entrepreneurs selling on Koombo. Start today, earn tomorrow.
          </p>
        </div>

        {/* CTA Button */}
        <div className="text-center mb-12 relative z-20">
          <a
            href="/lister"
            className="group inline-flex items-center gap-3 bg-[#5B21B6] hover:bg-[#4C1D95] text-white px-8 sm:px-10 py-4 sm:py-5 rounded-full font-bold text-base sm:text-lg shadow-xl hover:shadow-2xl transition-all hover:scale-105"
          >
            Start Selling on Koombo
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        {/* Independence Arch Illustration */}
        <div className="relative w-full max-w-6xl mx-auto">
          <svg viewBox="0 0 800 600" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
            {/* Sky / Background */}
            <rect width="800" height="600" fill="#FDF6E3" />

            {/* Ground */}
            <rect x="0" y="520" width="800" height="80" fill="#E8DCC0" />

            {/* Left Tree */}
            <g transform="translate(80, 380)">
              <rect x="45" y="100" width="20" height="60" fill="#6B4423" />
              <circle cx="55" cy="60" r="70" fill="#008751" />
              <circle cx="20" cy="80" r="50" fill="#008751" />
              <circle cx="90" cy="80" r="50" fill="#008751" />
              <circle cx="55" cy="30" r="55" fill="#008751" />
            </g>

            {/* Right Tree */}
            <g transform="translate(620, 380)">
              <rect x="45" y="100" width="20" height="60" fill="#6B4423" />
              <circle cx="55" cy="60" r="70" fill="#008751" />
              <circle cx="20" cy="80" r="50" fill="#008751" />
              <circle cx="90" cy="80" r="50" fill="#008751" />
              <circle cx="55" cy="30" r="55" fill="#008751" />
            </g>

            {/* Arch Base */}
            <rect x="220" y="480" width="360" height="40" fill="#D4C4A0" />

            {/* Left Pillar */}
            <rect x="240" y="320" width="80" height="160" fill="#E8DCC0" />
            <rect x="240" y="320" width="80" height="10" fill="#C4B490" />
            <g stroke="#C4B490" strokeWidth="1" opacity="0.5">
              <line x1="240" y1="340" x2="320" y2="340" />
              <line x1="240" y1="360" x2="320" y2="360" />
              <line x1="240" y1="380" x2="320" y2="380" />
              <line x1="240" y1="400" x2="320" y2="400" />
              <line x1="240" y1="420" x2="320" y2="420" />
              <line x1="240" y1="440" x2="320" y2="440" />
              <line x1="240" y1="460" x2="320" y2="460" />
            </g>

            {/* Right Pillar */}
            <rect x="480" y="320" width="80" height="160" fill="#E8DCC0" />
            <rect x="480" y="320" width="80" height="10" fill="#C4B490" />
            <g stroke="#C4B490" strokeWidth="1" opacity="0.5">
              <line x1="480" y1="340" x2="560" y2="340" />
              <line x1="480" y1="360" x2="560" y2="360" />
              <line x1="480" y1="380" x2="560" y2="380" />
              <line x1="480" y1="400" x2="560" y2="400" />
              <line x1="480" y1="420" x2="560" y2="420" />
              <line x1="480" y1="440" x2="560" y2="440" />
              <line x1="480" y1="460" x2="560" y2="460" />
            </g>

            {/* Center Opening */}
            <rect x="320" y="320" width="160" height="160" fill="#1a1a1a" />
            <rect x="335" y="335" width="130" height="145" fill="#FDF6E3" />

            {/* Arch Top Beam */}
            <rect x="220" y="290" width="360" height="30" fill="#C4B490" />
            <rect x="230" y="280" width="340" height="10" fill="#A89878" />

            {/* "FREEDOM AND JUSTICE" text area */}
            <rect x="260" y="260" width="280" height="25" fill="#E8DCC0" />
            <text x="400" y="277" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#8B7D6B" letterSpacing="3">
              FREEDOM AND JUSTICE
            </text>

            {/* Upper Section */}
            <rect x="250" y="200" width="300" height="60" fill="#E8DCC0" />
            <g stroke="#C4B490" strokeWidth="1" opacity="0.5">
              <line x1="250" y1="220" x2="550" y2="220" />
              <line x1="250" y1="240" x2="550" y2="240" />
            </g>

            {/* AD 1957 Plaque */}
            <rect x="330" y="210" width="140" height="30" fill="#D4C4A0" stroke="#A89878" strokeWidth="2" />
            <text x="400" y="230" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#8B7D6B" letterSpacing="2">
              AD 1957
            </text>

            {/* Top Platform */}
            <rect x="280" y="170" width="240" height="30" fill="#C4B490" />
            <rect x="300" y="150" width="200" height="20" fill="#D4C4A0" />
            <rect x="340" y="130" width="120" height="20" fill="#E8DCC0" />

            {/* Black Star */}
            <g transform="translate(400, 100)">
              <polygon
                points="0,-40 10,-10 40,-10 15,10 25,40 0,20 -25,40 -15,10 -40,-10 -10,-10"
                fill="#1a1a1a"
              />
            </g>

            {/* Decorative Circles on Pillars */}
            <circle cx="260" cy="360" r="8" fill="none" stroke="#1a1a1a" strokeWidth="2" />
            <circle cx="300" cy="360" r="8" fill="none" stroke="#1a1a1a" strokeWidth="2" />
            <circle cx="340" cy="360" r="8" fill="none" stroke="#1a1a1a" strokeWidth="2" />
            <circle cx="460" cy="360" r="8" fill="none" stroke="#1a1a1a" strokeWidth="2" />
            <circle cx="500" cy="360" r="8" fill="none" stroke="#1a1a1a" strokeWidth="2" />
            <circle cx="540" cy="360" r="8" fill="none" stroke="#1a1a1a" strokeWidth="2" />

            {/* Small decorative elements */}
            <circle cx="150" cy="500" r="4" fill="#FF6B8A" />
            <circle cx="650" cy="490" r="4" fill="#7C5CFF" />
            <circle cx="200" cy="510" r="3" fill="#FFB648" />
            <circle cx="600" cy="515" r="3" fill="#008751" />
          </svg>

          {/* Real Koombo Logo Overlay */}
          <div className="absolute bottom-8 sm:bottom-12 left-1/2 -translate-x-1/2 z-10">
            <div className="bg-white rounded-full p-2 sm:p-3 shadow-2xl border-4 border-white">
              <img 
                src="/logo1.png" 
                alt="Koombo" 
                className="h-16 sm:h-20 w-auto object-contain" 
              />
            </div>
          </div>
        </div>

        {/* REPLACED STATS BAR WITH ANIMATED TEXT */}
        <div className="mt-12 w-full max-w-4xl mx-auto text-center min-h-[120px] flex flex-col items-center justify-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-gray-500 mb-2">
            The Koombo Way
          </p>
          
          <div className="relative h-20 sm:h-24 w-full flex items-center justify-center overflow-hidden">
            <h2 
              className={`text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight transition-all duration-500 ease-out transform ${
                isVisible 
                  ? "opacity-100 translate-y-0 scale-100" 
                  : "opacity-0 translate-y-8 scale-95"
              } ${currentPhrase.color}`}
              key={phraseIndex} // Forces re-render for animation
            >
              {currentPhrase.text}
            </h2>
          </div>
        </div>

      </div>

      {/* Floating Elements */}
      <div className="absolute top-32 left-10 w-16 h-16 bg-[#FF6B8A]/20 rounded-full blur-xl pointer-events-none" />
      <div className="absolute bottom-32 right-10 w-24 h-24 bg-[#FFB648]/20 rounded-full blur-xl pointer-events-none" />
    </section>
  );
}
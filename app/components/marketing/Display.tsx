
"use client";

import { useRef, useState, useEffect, useCallback } from "react";

/*
  ARC CARDS
  Edit this list to change what appears on the rotating arc.
  - `src`   : optional image from /public (shown cropped inside the card)
  - `color` : the card's pastel background (also the fallback if no image)
  Add or remove items freely; the arc adapts to the count.
*/
const ARC_ITEMS: { src?: string; color: string }[] = [
  { src: "/1.jpeg", color: "#B79CE0" },
  { src: "/9.jpeg", color: "#D9D9D6" },
  { src: "/shop.jpg", color: "#C6E02E" },
  { src: "/june.jpg", color: "#7FB2E8" },
  { src: "/koombo.jpeg", color: "#F08CB5" },
  { src: "/second.webp", color: "#F6C945" },
  { src: "/4.jpg", color: "#D9D9D6" },
  { src: "/s.jpg", color: "#FF6240" },
  { src: "/3f97bc4e85753fda4451ce801889149c.jpg", color: "#9ED9C2" },
];

const STEP_DEG = 14; // angle between neighbouring cards
const AUTO_SPEED = 0.3; // cards per second when idle

export default function AppDownloadSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  // ---- Arc state (kept in refs so animation never re-renders React) ----
  const arcRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const offsetRef = useRef(0);
  const draggingRef = useRef(false);
  const lastXRef = useRef(0);
  const [dims, setDims] = useState({ size: 170, radius: 1100, height: 330 });

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch((err) => {
        console.error("Playback failed:", err);
      });
      setIsPlaying(true);
      setHasStarted(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime);
    const pct = (videoRef.current.currentTime / videoRef.current.duration) * 100;
    setProgress(isNaN(pct) ? 0 : pct);
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration);
  };

  const handleWaiting = () => setIsLoading(true);
  const handleCanPlay = () => setIsLoading(false);
  const handleEnded = () => {
    setIsPlaying(false);
    setProgress(0);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return;
    const time = (Number(e.target.value) / 100) * duration;
    videoRef.current.currentTime = time;
    setProgress(Number(e.target.value));
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    return () => {
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.src = "";
      }
    };
  }, []);

  // --------------------------------------------------
  // Arc layout: place every card on a circle
  // --------------------------------------------------

  const layoutArc = useCallback(() => {
    const n = ARC_ITEMS.length;
    const { radius, size } = dims;

    cardRefs.current.forEach((el, i) => {
      if (!el) return;

      // wrap distance from centre into [-n/2, n/2)
      let d = (((i - offsetRef.current) % n) + n) % n;
      if (d >= n / 2) d -= n;

      const deg = d * STEP_DEG;
      const rad = (deg * Math.PI) / 180;
      const x = radius * Math.sin(rad);
      const y = radius * (1 - Math.cos(rad));

      // fade cards out before they wrap to the other side
      const abs = Math.abs(deg);
      const half = (n / 2) * STEP_DEG;
      const opacity = Math.max(0, Math.min(1, (half - 6 - abs) / 14));

      el.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${deg}deg)`;
      el.style.opacity = String(opacity);
      el.style.marginLeft = `${-size / 2}px`;
    });
  }, [dims]);

  // responsive dimensions
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w < 640) setDims({ size: 112, radius: 560, height: 210 });
      else if (w < 1024) setDims({ size: 150, radius: 900, height: 290 });
      else setDims({ size: 180, radius: 1150, height: 340 });
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // auto-turn + initial layout
  useEffect(() => {
    layoutArc();

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduce) return;

    let raf = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      if (!draggingRef.current) {
        offsetRef.current += AUTO_SPEED * dt;
        layoutArc();
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [layoutArc]);

  // drag to turn the arc
  const onArcPointerDown = (e: React.PointerEvent) => {
    draggingRef.current = true;
    lastXRef.current = e.clientX;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onArcPointerMove = (e: React.PointerEvent) => {
    if (!draggingRef.current) return;
    const dx = e.clientX - lastXRef.current;
    lastXRef.current = e.clientX;
    offsetRef.current -= dx / (dims.size * 0.6);
    layoutArc();
  };

  const onArcPointerUp = () => {
    draggingRef.current = false;
  };

  return (
    <section
      id="live"
      className="scroll-mt-24 relative w-full overflow-hidden pt-10 sm:pt-14 lg:pt-20 pb-12 sm:pb-16 lg:pb-24 bg-gradient-to-b from-white via-[#F1F1EF] via-40% to-[#151515]"
    >
      {/* ==================================================
          ROTATING ARC OF CARDS
          ================================================== */}
      <div
        ref={arcRef}
        role="presentation"
        onPointerDown={onArcPointerDown}
        onPointerMove={onArcPointerMove}
        onPointerUp={onArcPointerUp}
        onPointerCancel={onArcPointerUp}
        className="relative w-full select-none cursor-grab active:cursor-grabbing"
        style={{ height: dims.height, touchAction: "pan-y" }}
      >
        {ARC_ITEMS.map((item, i) => (
          <div
            key={i}
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
            className="absolute top-0 left-1/2 overflow-hidden rounded-[22px] shadow-[0_18px_40px_-18px_rgba(0,0,0,0.35)] will-change-transform"
            style={{
              width: dims.size,
              height: dims.size,
              backgroundColor: item.color,
              backgroundImage: item.src
                ? `url(${item.src})`
                : "radial-gradient(circle at 30% 25%, rgba(255,255,255,0.45), transparent 55%)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        ))}
      </div>

      {/* ==================================================
          HEADLINE BLOCK
          ================================================== */}
      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 -mt-6 sm:-mt-8 text-center">
        <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#151515]/70 mb-3">
          See Koombo in action
        </p>
        <h2
          className="text-[2.5rem] sm:text-5xl lg:text-6xl text-[#151515] leading-[1.05] tracking-tight"
        >
          Social Shopping,
          <br className="hidden sm:block" /> Reimagined.
        </h2>
        <p className="mt-4 text-[13px] sm:text-sm text-[#151515]/65 max-w-md mx-auto leading-relaxed">
          Watch how Koombo brings buyers and sellers together in one seamless, social experience.
        </p>
      </div>

      {/* ==================================================
          VIDEO SHOWCASE
          ================================================== */}
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 mt-10 sm:mt-14">
        <div className="relative rounded-[28px] sm:rounded-[32px] overflow-hidden bg-black aspect-[9/16] sm:aspect-video max-h-[520px] mx-auto ring-1 ring-white/15 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.6)]">

          {/* Video Element - NO autoplay, NO muted */}
          <video
            ref={videoRef}
            src=""
            poster="/koombo.jpeg"
            playsInline
            preload="metadata"
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onWaiting={handleWaiting}
            onCanPlay={handleCanPlay}
            onEnded={handleEnded}
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Loading spinner */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-20">
              <div className="w-12 h-12 border-4 border-white/30 border-t-[#FF6240] rounded-full animate-spin" />
            </div>
          )}

          {/* Play button overlay - shows when paused or not started */}
          {!isPlaying && (
            <button
              type="button"
              onClick={togglePlay}
              className="absolute inset-0 flex items-center justify-center z-10 bg-black/20"
              aria-label="Play video"
            >
              <div className="flex flex-col items-center gap-3">
                <div className="flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white shadow-2xl hover:scale-105 transition-transform duration-200">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="#151515" className="ml-1">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                {!hasStarted && (
                  <p className="text-white text-sm font-semibold bg-black/50 px-4 py-1.5 rounded-full backdrop-blur-sm">
                    Tap to play demo
                  </p>
                )}
              </div>
            </button>
          )}

          {/* Pause overlay - shows on hover when playing */}
          {isPlaying && (
            <button
              type="button"
              onClick={togglePlay}
              className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 bg-black/30 z-10"
              aria-label="Pause video"
            >
              <div className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/90 backdrop-blur-sm shadow-2xl hover:scale-105 transition-transform">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="#151515">
                  <rect x="6" y="5" width="4" height="14" rx="1" />
                  <rect x="14" y="5" width="4" height="14" rx="1" />
                </svg>
              </div>
            </button>
          )}

          {/* Bottom control bar */}
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-3 sm:p-4 z-10">
            {/* Progress bar */}
            <div className="mb-2 flex items-center gap-2">
              <span className="text-white text-[10px] sm:text-xs tabular-nums w-10 text-right">
                {formatTime(currentTime)}
              </span>
              <input
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={handleSeek}
                aria-label="Seek"
                className="flex-1 h-1 sm:h-1.5 appearance-none bg-white/30 rounded-full cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#FF6240] [&::-webkit-slider-thumb]:shadow-lg [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#FF6240] [&::-moz-range-thumb]:border-0"
                style={{
                  background: `linear-gradient(to right, #FF6240 ${progress}%, rgba(255,255,255,0.3) ${progress}%)`,
                }}
              />
              <span className="text-white text-[10px] sm:text-xs tabular-nums w-10">
                {formatTime(duration)}
              </span>
            </div>

            {/* Controls row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={togglePlay}
                  className="text-white hover:text-[#FF6240] transition-colors"
                  aria-label={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <rect x="6" y="5" width="4" height="14" rx="1" />
                      <rect x="14" y="5" width="4" height="14" rx="1" />
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  )}
                </button>

                <button
                  type="button"
                  onClick={toggleMute}
                  className="text-white hover:text-[#FF6240] transition-colors"
                  aria-label={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                      <line x1="23" y1="9" x2="17" y2="15" />
                      <line x1="17" y1="9" x2="23" y2="15" />
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                    </svg>
                  )}
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-[#FF6240] animate-pulse" />
                <p className="text-white text-[10px] sm:text-xs font-semibold tracking-wide">
                  Koombo Demo
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ==================================================
          BOTTOM CTA
          ================================================== */}
      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
        <button className="w-full sm:w-auto rounded-full bg-white px-8 py-3 text-sm font-semibold text-[#151515] transition-colors hover:bg-[#F1F1EF] active:scale-[.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
          Download the App
        </button>
        <button className="w-full sm:w-auto rounded-full border border-white/50 px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10 active:scale-[.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
          Learn More
        </button>
      </div>
    </section>
  );
}

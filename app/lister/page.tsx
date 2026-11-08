'use client';

import Link from 'next/link';
import Image from 'next/image';
import SiteHeader from '../components/SiteHeader';
import KoomboFooter from '../components/Footer';

/* -------------------------------------------------------------------------- */
/* ICONS                                                                      */
/* -------------------------------------------------------------------------- */

function GoogleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

function SparklesIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
    </svg>
  );
}

function TelegramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
    </svg>
  );
}

function ArrowUpRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* PAGE                                                                       */
/* -------------------------------------------------------------------------- */

export default function SellerGateway() {
  return (
    <div className="min-h-screen bg-white font-sans text-[#1a1a1a]">
      
      {/* LUFGA FONT & ANIMATIONS INJECTION */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lufga:wght@400;500;600;700;800;900&display=swap');
        
        .font-lufga { 
          font-family: 'Lufga', ui-sans-serif, system-ui, sans-serif; 
        }

        /* Entrance Animations */
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-up { animation: fade-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) both; }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
        .delay-500 { animation-delay: 0.5s; }

        /* Continuous Floating Animations */
        @keyframes float-slow {
          0%, 100% { transform: translate(-50%, -50%) translateY(0px); }
          50% { transform: translate(-50%, -50%) translateY(-15px); }
        }
        @keyframes float-fast {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float-center { animation: float-slow 7s ease-in-out infinite; }
        .animate-float-card { animation: float-fast 5s ease-in-out infinite; }
      `}</style>

      <SiteHeader />

      {/* MAIN SPLIT CONTENT */}
      <main className="flex min-h-[calc(100vh-80px)] flex-col pt-[110px] sm:pt-[130px] lg:flex-row">
        
        {/* LEFT PANEL: LOGIN FORM */}
        <div className="flex w-full flex-col justify-center px-6 py-12 sm:px-12 md:px-20 lg:w-1/2 lg:px-24 xl:px-32">
          <div className="max-w-md mx-auto w-full">
            
            <h1 className="text-4xl font-bold tracking-tight text-[#1a1a1a] animate-fade-up delay-100">Welcome back</h1>
            <p className="mt-3 text-base text-[#5e5e5e] animate-fade-up delay-200">Log in to your Koombo Seller Portal</p>

            <button className="mt-8 flex w-full items-center justify-center gap-3 rounded-lg border border-[#dcdcdc] bg-white py-3.5 text-base font-semibold text-[#333] shadow-sm transition hover:bg-gray-50 active:scale-[0.99] animate-fade-up delay-300">
              <GoogleIcon />
              Login with Google
            </button>

            <div className="relative my-8 animate-fade-up delay-300">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#e0e0e0]" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-3 text-[#888]">or</span>
              </div>
            </div>

            <form className="space-y-5 animate-fade-up delay-400" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-semibold text-[#1a1a1a]">
                  Email address
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  className="w-full rounded-lg border border-[#dcdcdc] bg-[#f7f7f7] px-4 py-3.5 text-base outline-none transition-colors focus:border-[#6B21A8] focus:bg-white focus:ring-1 focus:ring-[#6B21A8]"
                />
              </div>

              <div>
                <label htmlFor="password" className="mb-2 block text-sm font-semibold text-[#1a1a1a]">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  placeholder="Enter your password"
                  className="w-full rounded-lg border border-[#dcdcdc] bg-[#f7f7f7] px-4 py-3.5 text-base outline-none transition-colors focus:border-[#6B21A8] focus:bg-white focus:ring-1 focus:ring-[#6B21A8]"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-[#6B21A8] py-3.5 text-base font-bold text-white shadow-sm transition-all hover:bg-[#581c87] active:scale-[0.99]"
              >
                Login with email
              </button>
            </form>

            <div className="mt-10 flex items-center justify-between border-t border-[#e0e0e0] pt-8 animate-fade-up delay-500">
              <div>
                <h3 className="text-base font-bold text-[#1a1a1a]">New to Koombo?</h3>
                <p className="mt-1 text-sm text-[#5e5e5e]">Partner with us today!</p>
              </div>
              <Link 
                href="/lister/setup"
                className="rounded-lg border border-[#dcdcdc] bg-white px-6 py-2.5 text-sm font-bold text-[#1a1a1a] transition hover:bg-gray-50 hover:border-[#bbb]"
              >
                Get started
              </Link>
            </div>

            <p className="mt-8 text-xs leading-relaxed text-[#888] animate-fade-up delay-500">
              By logging in, you agree to Koombo's Seller{' '}
              <Link href="/terms" className="font-semibold text-[#1a1a1a] underline hover:text-[#6B21A8]">
                Security Terms
              </Link>.
            </p>

          </div>
        </div>

        {/* RIGHT PANEL: FULLY VISIBLE IMAGE BG WITH INNOVATIVE FLOATING UI */}
        <div className="relative hidden w-1/2 lg:flex lg:flex-col lg:items-center lg:justify-center overflow-hidden">
          
          {/* BACKGROUND IMAGE - NO COLOR OVERLAY, FULLY VISIBLE */}
          <img 
            src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=2070&auto=format&fit=crop" 
            alt="Business manager on phone" 
            className="absolute inset-0 h-full w-full object-cover animate-fade-up"
          />

          {/* CONTENT CONTAINER */}
          <div className="relative z-10 flex max-w-xl flex-col items-center text-center px-8">
            
            {/* Headline with text shadow for visibility over any image area */}
            <h2 className="font-lufga text-4xl font-black uppercase leading-[1.1] tracking-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] sm:text-5xl xl:text-6xl animate-fade-up delay-100">
              List Smarter.<br />Sell Faster.
            </h2>
            
            {/* Subtitle in a semi-transparent pill for guaranteed readability */}
            <div className="mx-auto mt-6 max-w-lg rounded-2xl bg-black/40 backdrop-blur-md px-6 py-4 border border-white/10 animate-fade-up delay-200">
              <p className="text-base font-medium leading-relaxed text-white sm:text-lg">
                Use <span className="font-bold text-[#b794f6]">Loki AI</span> to create perfect product listings in seconds. Get instant order notifications directly on Telegram—no extra apps needed.
              </p>
            </div>

            {/* INNOVATIVE FLOATING UI COMPOSITION */}
            <div className="mt-16 relative flex items-center justify-center h-[320px] w-full animate-fade-up delay-300">
              
              {/* Center Glowing Orb / Brand Anchor (Purple Logo) */}
              <div className="absolute left-1/2 top-1/2 z-0 animate-float-center">
                <div className="relative flex h-28 w-28 items-center justify-center rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-[0_0_60px_-10px_rgba(107,33,168,0.5)]">
                  {/* PURPLE LOGO: Removed brightness-0 invert so original purple shows through */}
                  <Image 
                    src="/logo.png" 
                    alt="Koombo" 
                    width={96} 
                    height={96} 
                    className="h-14 w-14 object-contain opacity-95"
                  />
                  {/* Pulse Ring */}
                  <div className="absolute inset-0 rounded-3xl border border-[#6B21A8]/40 animate-ping opacity-30" />
                </div>
              </div>

              {/* Floating Card 1: Loki AI Real-time Listing (Top Right) */}
              <div className="absolute right-0 top-0 z-10 animate-float-card" style={{ animationDelay: '0.5s' }}>
                <div className="group flex items-center gap-3 rounded-2xl bg-white/90 backdrop-blur-md px-5 py-4 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] border border-white/40 hover:scale-105 transition-transform duration-300 cursor-default">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#6B21A8] text-white shadow-lg shadow-[#6B21A8]/30">
                    <SparklesIcon className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#6B21A8]">Loki AI</p>
                    <p className="text-sm font-extrabold text-[#1a1a1a]">Real-time Listing</p>
                  </div>
                  <ArrowUpRightIcon className="h-4 w-4 text-[#888] group-hover:text-[#6B21A8] transition-colors" />
                </div>
              </div>

              {/* Floating Card 2: Telegram Alerts (Bottom Left) */}
              <div className="absolute bottom-0 left-0 z-10 animate-float-card" style={{ animationDelay: '1.2s' }}>
                <div className="group flex items-center gap-3 rounded-2xl bg-white/90 backdrop-blur-md px-5 py-4 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] border border-white/40 hover:scale-105 transition-transform duration-300 cursor-default">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0088cc] text-white shadow-lg shadow-[#0088cc]/30">
                    <TelegramIcon className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#0088cc]">Instant</p>
                    <p className="text-sm font-extrabold text-[#1a1a1a]">Telegram Alerts</p>
                  </div>
                  <ArrowUpRightIcon className="h-4 w-4 text-[#888] group-hover:text-[#0088cc] transition-colors" />
                </div>
              </div>

              {/* Connecting Lines (Decorative SVG) */}
              <svg className="absolute inset-0 h-full w-full pointer-events-none z-0 opacity-30" preserveAspectRatio="none">
                <line x1="50%" y1="50%" x2="85%" y2="20%" stroke="white" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="50%" y1="50%" x2="15%" y2="80%" stroke="white" strokeWidth="1" strokeDasharray="4 4" />
              </svg>

            </div>

            {/* BOTTOM INFO */}
            <div className="mt-8 flex items-center justify-center gap-2 rounded-full bg-black/40 backdrop-blur-md px-5 py-2.5 border border-white/10 animate-fade-up delay-400">
              <span className="inline-block h-2 w-2 rounded-full bg-[#0088cc] shadow-[0_0_8px_rgba(0,136,204,0.6)]"></span>
              <span className="text-sm font-medium text-white">Powered by Loki AI • Telegram Integration</span>
            </div>

          </div>
        </div>

      </main>

      <KoomboFooter />
    </div>
  );
}
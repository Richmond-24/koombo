'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Home, Info, Phone, Play, Store, Users, X, Menu } from 'lucide-react';

const navLinks = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'About', href: '/about', icon: Info },
  { label: 'Connector', href: '/lister/connectors', icon: Users },
  { label: 'Contact', href: '/contact', icon: Phone },
];

function PromoSpark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-3 w-3 text-white shrink-0">
      <path d="M12 1.5v4.2m0 16.8v-4.2m10.5-10.5h-4.2M5.7 18.3H1.5M18.7 5.3l-3 3m-7.4 7.4 3-3m0-7.4-3 3m10.4 10.4-3-3" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

export default function SiteHeader({
  ctaLabel = 'Become a Vendor',
  demoHref = '/watch-demo',
}: {
  ctaLabel?: string;
  demoHref?: string;
}) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);

  return (
    <>
      {/* PROMO BANNER - dark grey with a simple pop animation */}
      <div className="fixed top-0 left-0 right-0 z-[99] h-[30px] overflow-hidden bg-[#27272A] px-3 sm:h-[36px] sm:px-6 lg:px-10">
        <div className="mx-auto flex h-full max-w-[1400px] items-center justify-center">
          <div className="kb-pop flex items-center gap-1.5 text-center text-[9px] font-semibold uppercase tracking-[0.08em] text-white sm:gap-2 sm:text-[10px] sm:tracking-[0.12em]">
            <PromoSpark />
            <span className="leading-tight truncate">Free flyer if you list your business today</span>
            <PromoSpark />
          </div>
        </div>
      </div>

      {/* MAIN HEADER - Full width on mobile, no horizontal padding */}
      <header style={{ position: 'fixed', top: 0, left: 0, right: 0 }} className="z-[100] pt-[30px] sm:pt-[36px]">
        <div className="w-full rounded-b-2xl border-x-0 sm:border-x border-b border-[#E5E7EB] bg-white/95 backdrop-blur-xl shadow-sm sm:mx-auto sm:max-w-[1400px] sm:rounded-b-2xl">
          {/* Mobile: h-16 | Desktop: h-18 */}
          <div className="flex items-center justify-between h-16 sm:h-[72px] px-4 sm:px-6 lg:px-8">
            
            {/* LEFT: Brand logo */}
            <Link href="/" className="flex shrink-0 items-center" aria-label="Koombo home">
              <img 
                src="/logo.png" 
                alt="Koombo" 
                className="h-9 w-auto object-contain sm:h-10 lg:h-12" 
                style={{ filter: 'brightness(0) saturate(100%) invert(15%) sepia(78%) saturate(3574%) hue-rotate(256deg) brightness(83%) contrast(102%)' }} 
              />
            </Link>

            {/* CENTER: Desktop Nav Only */}
            <nav aria-label="Main navigation" className="hidden lg:flex items-center gap-8 xl:gap-10">
              {navLinks.map(({ label, href, icon: Icon }) => {
                const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href);
                return (
                  <Link key={label} href={href} aria-current={isActive ? 'page' : undefined} className={`group relative inline-flex items-center gap-2 text-sm font-medium transition-colors ${isActive ? 'text-[#6D28D9]' : 'text-[#101820] hover:text-[#6D28D9]'}`}>
                    <Icon size={18} />
                    {label}
                    <span className={`absolute -bottom-1 left-0 h-0.5 rounded-full bg-[#6D28D9] transition-all duration-300 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                  </Link>
                );
              })}
            </nav>

            {/* RIGHT: Hamburger (Mobile) + CTAs (Desktop) */}
            <div className="flex items-center gap-3">
              {/* Mobile Hamburger - Right aligned, larger touch target */}
              <button 
                onClick={() => setIsMenuOpen(true)}
                className="lg:hidden p-3 -mr-2 rounded-full hover:bg-gray-100 active:scale-95 transition-all"
                aria-label="Open menu"
              >
                <Menu size={24} className="text-[#101820]" strokeWidth={2} />
              </button>

              {/* Desktop CTAs */}
              <div className="hidden lg:flex items-center gap-4 xl:gap-6">
                <Link href="/seller/signin" className="inline-flex items-center gap-2 text-sm font-semibold text-[#101820] transition-colors hover:text-[#6D28D9]">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-violet-50 text-[#6D28D9]"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4" /></svg></span>
                  Sign in
                </Link>
                <Link href="/lister" className="inline-flex items-center gap-2 text-sm font-semibold text-[#101820] transition-colors hover:text-[#6D28D9]">
                  <Store size={18} />
                  {ctaLabel}
                </Link>
                <Link href={demoHref} className="inline-flex items-center gap-2 rounded-xl bg-[#6D28D9] px-4 py-2.5 text-sm font-bold text-white transition-all hover:bg-[#5B21B6]">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-[#6D28D9]"><Play size={12} /></span>
                  Watch Demo
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* MOBILE SLIDE-OUT MENU DRAWER - Full width */}
      {isMenuOpen && (
        <>
          <div className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-[110] lg:hidden animate-fadeIn" onClick={() => setIsMenuOpen(false)} />
          <div className="fixed top-0 left-0 bottom-0 w-full bg-white z-[120] lg:hidden shadow-2xl animate-slideIn overflow-y-auto" style={{ paddingTop: "env(safe-area-inset-top)", paddingBottom: "env(safe-area-inset-bottom)" }}>
            <div className="p-5 flex flex-col h-full">
              {/* Drawer Header */}
              <div className="flex items-center justify-between mb-6">
                <img src="/logo.png" alt="Koombo" className="h-8 w-auto" style={{ filter: 'brightness(0) saturate(100%) invert(15%) sepia(78%) saturate(3574%) hue-rotate(256deg) brightness(83%) contrast(102%)' }} />
                <button onClick={() => setIsMenuOpen(false)} className="p-2 rounded-full hover:bg-gray-100 transition-colors" aria-label="Close menu">
                  <X size={22} className="text-[#101820]" strokeWidth={2} />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="space-y-1 flex-1">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
                  return (
                    <Link key={link.label} href={link.href} onClick={() => setIsMenuOpen(false)} className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all ${isActive ? 'bg-[#6D28D9]/10 text-[#6D28D9] font-semibold' : 'text-[#101820] hover:bg-gray-50'}`}>
                      <Icon size={20} strokeWidth={2} />
                      <span>{link.label}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* Mobile CTAs */}
              <div className="mt-6 pt-6 border-t border-gray-100 space-y-3">
                <Link href="/seller/signin" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl border border-violet-200 bg-violet-50 text-sm font-semibold text-[#6D28D9] hover:bg-violet-100 transition-all">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4" /></svg>
                  Sign in
                </Link>
                <Link href="/lister" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-[#101820] hover:bg-gray-50 transition-all">
                  <Store size={18} strokeWidth={2} />
                  {ctaLabel}
                </Link>
                <Link href={demoHref} onClick={() => setIsMenuOpen(false)} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#6D28D9] px-4 py-3 text-sm font-bold text-white transition-all hover:bg-[#5B21B6]">
                  <Play size={16} strokeWidth={2} />
                  Watch a Demo
                </Link>
              </div>
            </div>
          </div>
        </>
      )}

      <style jsx global>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideIn { from { transform: translateX(-100%); } to { transform: translateX(0); } }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out forwards; }
        .animate-slideIn { animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

        /* Promo banner: simple pop */
        @keyframes kb-pop-in { 0% { transform: scale(0.6); opacity: 0; } 60% { transform: scale(1.08); opacity: 1; } 100% { transform: scale(1); opacity: 1; } }
        .kb-pop { animation: kb-pop-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s both; }

        @media (prefers-reduced-motion: reduce) {
          .kb-pop { animation: none !important; }
        }
      `}</style>
    </>  
  );
}
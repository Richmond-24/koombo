'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { ArrowRight, Gift, Home, Info, LogIn, Menu, Phone, Play, Store, User, UserPlus, Users, X } from 'lucide-react';

const navLinks = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'About', href: '/about', icon: Info },
  { label: 'Connector', href: '/lister/connectors', icon: Users },
  { label: 'Contact', href: '/contact', icon: Phone },
];

export default function SiteHeader({
  ctaLabel = 'Become a Vendor',
  demoHref = '/watch-demo',
  promoHref = '/lister',
  loginHref = '/login',
  signupHref = '/signup',
}: {
  ctaLabel?: string;
  demoHref?: string;
  promoHref?: string;
  loginHref?: string;
  signupHref?: string;
}) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);

  // Close profile dropdown on outside click / Escape
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setIsProfileOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsProfileOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setIsProfileOpen(false);
  }, [pathname]);

  // Small delay on mouse leave so the dropdown doesn't flicker shut
  const openProfile = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setIsProfileOpen(true);
  };
  const scheduleCloseProfile = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setIsProfileOpen(false), 150);
  };

  return (
    <>
      {/* PROMO BANNER: deep dark gray, slim, with a soft shimmer, gift chip and a "List now" pill */}
      <div className="kb-promo fixed left-0 right-0 top-0 z-[99] h-[30px] overflow-hidden bg-[#18181B] sm:h-[36px]">
        {/* soft neutral glow on both sides */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(60% 140% at 0% 50%, rgba(255,255,255,.07) 0%, transparent 70%), radial-gradient(60% 140% at 100% 50%, rgba(255,255,255,.07) 0%, transparent 70%)',
          }}
        />
        {/* hairline at the bottom to separate it from the header */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-white/10" />
        {/* moving shine */}
        <div aria-hidden="true" className="kb-shine pointer-events-none absolute inset-y-0 w-1/3" />

        <Link
          href={promoHref}
          aria-label="Free flyer when you list your business today. List now"
          className="group relative mx-auto flex h-full max-w-[1400px] items-center justify-center gap-2 px-3 text-white sm:gap-3 sm:px-6 lg:px-10"
        >
          {/* gift chip */}
          <span className="kb-wiggle flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-[#7C3AED] shadow-[0_0_0_3px_rgba(255,255,255,.08)] sm:h-[22px] sm:w-[22px]">
            <Gift className="h-[10px] w-[10px] sm:h-3 sm:w-3" strokeWidth={2.4} aria-hidden="true" />
          </span>

          {/* FREE tag */}
          <span className="shrink-0 rounded-[5px] bg-white px-1.5 py-[1px] text-[10px] font-black uppercase leading-[14px] tracking-[0.08em] text-[#18181B] sm:text-[11px] sm:leading-4">
            Free
          </span>

          {/* message */}
          <span className="min-w-0 truncate text-[12px] font-semibold leading-none tracking-[-0.005em] text-white/95 sm:text-[14px]">
            <span className="sm:hidden">Flyer when you list today</span>
            <span className="hidden sm:inline">
              Get a free flyer when you list your business today
            </span>
          </span>

          {/* action pill */}
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-white/10 px-2 py-[2px] text-[10px] font-bold text-white ring-1 ring-white/25 transition-all duration-300 group-hover:bg-white group-hover:text-[#18181B] sm:px-3 sm:py-[3px] sm:text-[12px]">
            List now
            <ArrowRight
              className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5"
              strokeWidth={2.6}
              aria-hidden="true"
            />
          </span>
        </Link>
      </div>

      {/* MAIN HEADER */}
      <header style={{ position: 'fixed', top: 0, left: 0, right: 0 }} className="z-[100] pt-[30px] sm:pt-[36px]">
        <div className="w-full rounded-b-2xl border-x-0 sm:border-x border-b border-[#E5E7EB] bg-white/95 backdrop-blur-xl shadow-sm sm:mx-auto sm:max-w-[1400px] sm:rounded-b-2xl">
          {/* Mobile: h-16 | Desktop: h-18 */}
          <div className="flex items-center justify-between h-16 sm:h-[72px] px-4 sm:px-6 lg:px-8">

            {/* LEFT: Brand logo */}
            <Link href="/" className="flex shrink-0 items-center" aria-label="Koombo home">
              <img
                src="/logo.png"
                alt="Koombo"
                className="h-10 w-auto object-contain sm:h-12 lg:h-14"
                style={{ filter: 'brightness(0) saturate(100%) invert(15%) sepia(78%) saturate(3574%) hue-rotate(256deg) brightness(83%) contrast(102%)' }}
              />
            </Link>

            {/* CENTER: Desktop Nav Only */}
            <nav aria-label="Main navigation" className="hidden lg:flex items-center gap-8 xl:gap-10">
              {navLinks.map(({ label, href, icon: Icon }) => {
                const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href);
                return (
                  <Link key={label} href={href} aria-current={isActive ? 'page' : undefined} className={`group relative inline-flex items-center gap-2 text-[15px] font-medium transition-colors ${isActive ? 'text-[#6D28D9]' : 'text-[#101820] hover:text-[#6D28D9]'}`}>
                    <Icon size={18} />
                    {label}
                    <span className={`absolute -bottom-1 left-0 h-0.5 rounded-full bg-[#6D28D9] transition-all duration-300 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                  </Link>
                );
              })}
            </nav>

            {/* RIGHT: Hamburger (Mobile) + CTAs (Desktop) */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMenuOpen(true)}
                className="lg:hidden p-3 -mr-2 rounded-full hover:bg-gray-100 active:scale-95 transition-all"
                aria-label="Open menu"
              >
                <Menu size={24} className="text-[#101820]" strokeWidth={2} />
              </button>

              {/* Desktop CTAs */}
              <div className="hidden lg:flex items-center gap-4 xl:gap-6">
                <Link href="/lister" className="inline-flex items-center gap-2 text-[15px] font-semibold text-[#101820] transition-colors hover:text-[#6D28D9]">
                  <Store size={18} />
                  {ctaLabel}
                </Link>

                {/* PROFILE PILL (Airbnb style) with hover dropdown */}
                <div
                  ref={profileRef}
                  className="relative"
                  onMouseEnter={openProfile}
                  onMouseLeave={scheduleCloseProfile}
                >
                  <button
                    type="button"
                    onClick={() => setIsProfileOpen((v) => !v)}
                    onFocus={openProfile}
                    aria-haspopup="menu"
                    aria-expanded={isProfileOpen}
                    aria-label="Account menu"
                    className={`flex items-center gap-3 rounded-full border bg-white py-1.5 pl-3.5 pr-1.5 transition-shadow hover:shadow-md ${
                      isProfileOpen ? 'border-[#D1D5DB] shadow-md' : 'border-[#DDDDDD]'
                    }`}
                  >
                    <Menu size={18} className="text-[#101820]" strokeWidth={2.2} />
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#6D28D9] text-white">
                      <User size={18} fill="currentColor" strokeWidth={0} />
                    </span>
                  </button>

                  {/* Dropdown */}
                  <div
                    role="menu"
                    aria-label="Account"
                    className={`absolute right-0 top-full z-[130] w-64 pt-2 transition-all duration-200 ${
                      isProfileOpen
                        ? 'pointer-events-auto translate-y-0 opacity-100'
                        : 'pointer-events-none -translate-y-1 opacity-0'
                    }`}
                  >
                    <div className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white py-2 shadow-[0_8px_30px_rgba(0,0,0,0.14)]">
                      <Link
                        href={signupHref}
                        role="menuitem"
                        className="flex items-center gap-3 px-4 py-3 text-[15px] font-semibold text-[#101820] transition-colors hover:bg-gray-50"
                      >
                        <UserPlus size={18} className="text-[#6D28D9]" />
                        Create account
                      </Link>
                      <Link
                        href={loginHref}
                        role="menuitem"
                        className="flex items-center gap-3 px-4 py-3 text-[15px] text-[#101820] transition-colors hover:bg-gray-50"
                      >
                        <LogIn size={18} className="text-[#6B7280]" />
                        Log in
                      </Link>

                      <div className="my-2 border-t border-[#E5E7EB]" />

                      <Link
                        href="/lister"
                        role="menuitem"
                        className="flex items-center gap-3 px-4 py-3 text-[15px] text-[#101820] transition-colors hover:bg-gray-50"
                      >
                        <Store size={18} className="text-[#6B7280]" />
                        {ctaLabel}
                      </Link>
                      <Link
                        href={demoHref}
                        role="menuitem"
                        className="flex items-center gap-3 px-4 py-3 text-[15px] text-[#101820] transition-colors hover:bg-gray-50"
                      >
                        <Play size={18} className="text-[#6B7280]" />
                        Watch Demo
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* MOBILE SLIDE-OUT MENU DRAWER - Full width */}
      {isMenuOpen && (
        <>
          <div className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-[110] lg:hidden animate-fadeIn" onClick={() => setIsMenuOpen(false)} />
          <div className="fixed top-0 left-0 bottom-0 w-full bg-white z-[120] lg:hidden shadow-2xl animate-slideIn overflow-y-auto" style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}>
            <div className="p-5 flex flex-col h-full">
              {/* Drawer Header */}
              <div className="flex items-center justify-between mb-6">
                <img src="/logo.png" alt="Koombo" className="h-10 w-auto sm:h-12" style={{ filter: 'brightness(0) saturate(100%) invert(15%) sepia(78%) saturate(3574%) hue-rotate(256deg) brightness(83%) contrast(102%)' }} />
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
                    <Link key={link.label} href={link.href} onClick={() => setIsMenuOpen(false)} className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-base transition-all ${isActive ? 'bg-[#6D28D9]/10 text-[#6D28D9] font-semibold' : 'text-[#101820] hover:bg-gray-50'}`}>
                      <Icon size={20} strokeWidth={2} />
                      <span>{link.label}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* Mobile CTAs */}
              <div className="mt-6 pt-6 border-t border-gray-100 space-y-3">
                <Link href="/lister" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl border border-gray-200 text-base font-semibold text-[#101820] hover:bg-gray-50 transition-all">
                  <Store size={18} strokeWidth={2} />
                  {ctaLabel}
                </Link>
                <Link href={signupHref} onClick={() => setIsMenuOpen(false)} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#6D28D9] px-4 py-3 text-base font-bold text-white transition-all hover:bg-[#5B21B6]">
                  <UserPlus size={18} strokeWidth={2} />
                  Create account
                </Link>
                <Link href={loginHref} onClick={() => setIsMenuOpen(false)} className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-base font-semibold text-[#101820] hover:bg-gray-50 transition-all">
                  <LogIn size={18} strokeWidth={2} />
                  Log in
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

        /* Promo banner */
        @keyframes kb-slide-down { from { transform: translateY(-100%); } to { transform: translateY(0); } }
        .kb-promo { animation: kb-slide-down 0.55s cubic-bezier(0.16, 1, 0.3, 1) both; }

        @keyframes kb-shine-move {
          0%   { transform: translateX(-120%) skewX(-20deg); }
          55%, 100% { transform: translateX(420%) skewX(-20deg); }
        }
        .kb-shine {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,.14), transparent);
          animation: kb-shine-move 5.5s ease-in-out 1s infinite;
        }

        @keyframes kb-wiggle {
          0%, 72%, 100% { transform: rotate(0) scale(1); }
          78% { transform: rotate(-14deg) scale(1.12); }
          84% { transform: rotate(12deg) scale(1.12); }
          90% { transform: rotate(-8deg) scale(1.06); }
          95% { transform: rotate(4deg) scale(1); }
        }
        .kb-wiggle { animation: kb-wiggle 4.5s ease-in-out 1.5s infinite; }

        @media (prefers-reduced-motion: reduce) {
          .kb-promo, .kb-shine, .kb-wiggle { animation: none !important; }
        }
      `}</style>
    </>
  );
}
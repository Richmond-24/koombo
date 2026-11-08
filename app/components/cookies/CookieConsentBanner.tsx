'use client';

import { useCookieConsent } from './CookieConsentProvider';

export default function CookieConsentBanner() {
  const { isBannerVisible, acceptAll, rejectOptional, openPreferences } = useCookieConsent();

  if (!isBannerVisible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[200] flex justify-center px-3 pb-4 sm:px-6">
      <div className="w-full max-w-6xl overflow-hidden rounded-[28px] border border-[#E5E7EB] bg-white/95 shadow-[0_24px_80px_-24px_rgba(15,23,42,0.35)] backdrop-blur-xl">
        <div className="flex flex-col gap-6 p-4 sm:p-6 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
          <div className="max-w-3xl">
            <div className="mb-3 flex items-center gap-2 text-[#5B21B6]">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F3E8FF] text-xl">🍪</span>
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#5B21B6]">Privacy</span>
            </div>
            <h2 className="text-2xl font-bold tracking-[-0.04em] text-[#101820] sm:text-[2rem]">Your privacy matters to us 🍪</h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#475569] sm:text-base">
              Koombo uses cookies and similar technologies to improve your shopping experience, personalize content,
              understand how our platform is used, and keep our services secure. You can choose which cookies to allow.
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto lg:flex-col xl:flex-row">
            <button
              type="button"
              onClick={acceptAll}
              className="inline-flex items-center justify-center rounded-full bg-[#5B21B6] px-5 py-3 text-sm font-bold text-white shadow-[0_12px_25px_rgba(91,33,182,0.24)] transition hover:bg-[#4C1D95]"
            >
              Accept All
            </button>
            <button
              type="button"
              onClick={rejectOptional}
              className="inline-flex items-center justify-center rounded-full border border-[#D1D5DB] bg-white px-5 py-3 text-sm font-bold text-[#101820] transition hover:bg-[#F8FAFC]"
            >
              Reject Optional Cookies
            </button>
            <button
              type="button"
              onClick={openPreferences}
              className="inline-flex items-center justify-center rounded-full border border-[#E9D5FF] bg-[#F5F3FF] px-5 py-3 text-sm font-bold text-[#5B21B6] transition hover:bg-[#F0E7FF]"
            >
              Customize Preferences
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

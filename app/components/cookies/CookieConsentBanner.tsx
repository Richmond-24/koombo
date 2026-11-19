'use client';

import { useCookieConsent } from './CookieConsentProvider';

export default function CookieConsentBanner() {
  const { isBannerVisible, acceptAll, rejectOptional, openPreferences } = useCookieConsent();

  if (!isBannerVisible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[200] flex justify-center px-3 pb-3 sm:px-6 sm:pb-4">
      <div className="max-h-[85vh] w-full max-w-6xl overflow-y-auto rounded-2xl border-2 border-black bg-white shadow-[4px_4px_0_0_#000] sm:rounded-3xl sm:shadow-[6px_6px_0_0_#000]">
        <div className="flex flex-col gap-3 p-3.5 sm:gap-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
          <div className="min-w-0 flex-1">
            <div className="mb-1.5 hidden items-center gap-2 text-[#5B21B6] sm:flex">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#F3E8FF] text-base">🍪</span>
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#5B21B6]">Privacy</span>
            </div>
            <h2 className="text-lg font-bold tracking-[-0.03em] text-[#101820] sm:text-2xl">Your privacy matters to us 🍪</h2>
            <p className="mt-1.5 max-w-3xl text-xs leading-snug text-[#475569] sm:mt-2 sm:text-sm sm:leading-relaxed">
              Koombo uses cookies and similar technologies to improve your shopping experience, personalize content,
              understand how our platform is used, and keep our services secure. You can choose which cookies to allow.
            </p>
          </div>

          <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:flex-row sm:gap-3 lg:w-auto lg:shrink-0 lg:flex-col xl:flex-row">
            <button
              type="button"
              onClick={acceptAll}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-xl bg-[#5B21B6] px-4 py-2.5 text-xs font-bold text-white shadow-[0_8px_18px_rgba(91,33,182,0.24)] transition hover:bg-[#4C1D95] sm:text-sm"
            >
              Accept All
            </button>
            <button
              type="button"
              onClick={rejectOptional}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-xl border border-[#D1D5DB] bg-white px-4 py-2.5 text-xs font-bold text-[#101820] transition hover:bg-[#F8FAFC] sm:text-sm"
            >
              Reject Optional Cookies
            </button>
            <button
              type="button"
              onClick={openPreferences}
              className="col-span-2 inline-flex items-center justify-center whitespace-nowrap rounded-xl border border-[#E9D5FF] bg-[#F5F3FF] px-4 py-2.5 text-xs font-bold text-[#5B21B6] transition hover:bg-[#F0E7FF] sm:col-span-1 sm:text-sm"
            >
              Customize Preferences
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
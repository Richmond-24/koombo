'use client';

import { useEffect, useState } from 'react';
import { CATEGORY_CONFIG, type CookieConsentState } from './cookieConsent';
import { useCookieConsent } from './CookieConsentProvider';

export default function CookiePreferencesModal() {
  const { isPreferencesOpen, closePreferences, consent, categories, acceptAll, rejectOptional, savePreferences } = useCookieConsent();
  const [draft, setDraft] = useState<CookieConsentState>(categories);

  useEffect(() => {
    if (isPreferencesOpen) {
      setDraft(consent?.categories ?? categories);
    }
  }, [categories, consent, isPreferencesOpen]);

  if (!isPreferencesOpen) return null;

  const updateCategory = (key: keyof CookieConsentState, value: boolean) => {
    setDraft((current) => ({
      ...current,
      [key]: key === 'necessary' ? true : value,
    }));
  };

  return (
    <div className="fixed inset-0 z-[220] flex items-end justify-center bg-black/40 px-3 py-4 sm:items-center sm:px-6">
      <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-[28px] border border-[#E2E8F0] bg-white shadow-[0_30px_120px_-30px_rgba(15,23,42,0.45)]">
        <div className="flex items-center justify-between gap-3 border-b border-[#EEF2F7] px-5 py-4 sm:px-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#5B21B6]">Cookie preferences</p>
            <h3 className="mt-1 text-2xl font-bold tracking-[-0.04em] text-[#101820]">Choose your cookie settings</h3>
          </div>
          <button
            type="button"
            onClick={closePreferences}
            className="rounded-full border border-[#E5E7EB] px-3 py-2 text-sm font-semibold text-[#101820] transition hover:bg-[#F8FAFC]"
            aria-label="Close cookie preferences"
          >
            Close
          </button>
        </div>

        <div className="space-y-4 px-5 py-5 sm:px-6">
          <p className="text-sm leading-relaxed text-[#475569]">
            Necessary cookies are always enabled because they support secure browsing, authentication, and checkout.
            Optional categories are disabled by default and can be enabled independently.
          </p>

          {CATEGORY_CONFIG.map((item) => {
            const isActive = item.required || draft[item.key];
            const isDisabled = item.required;

            return (
              <div
                key={item.key}
                className="rounded-2xl border border-[#EEF2F7] bg-[#F8FAFC] p-4 sm:p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-base font-bold text-[#101820]">{item.label}</p>
                    <p className="mt-1 text-sm leading-relaxed text-[#475569]">{item.description}</p>
                  </div>

                  <button
                    type="button"
                    aria-label={`${item.label} ${isActive ? 'enabled' : 'disabled'}`}
                    aria-pressed={isActive}
                    disabled={isDisabled}
                    onClick={() => !isDisabled && updateCategory(item.key, !isActive)}
                    className={`relative h-7 w-12 shrink-0 rounded-full transition ${isDisabled ? 'cursor-not-allowed bg-[#E5E7EB]' : isActive ? 'bg-[#5B21B6]' : 'bg-[#CBD5E1]'} `}
                  >
                    <span
                      className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition ${isActive ? 'left-6' : 'left-1'}`}
                    />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="border-t border-[#EEF2F7] px-5 py-4 sm:px-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={acceptAll}
              className="rounded-full bg-[#5B21B6] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#4C1D95]"
            >
              Accept All
            </button>
            <button
              type="button"
              onClick={rejectOptional}
              className="rounded-full border border-[#D1D5DB] bg-white px-5 py-3 text-sm font-bold text-[#101820] transition hover:bg-[#F8FAFC]"
            >
              Reject Optional Cookies
            </button>
            <button
              type="button"
              onClick={() => savePreferences(draft)}
              className="rounded-full bg-[#F3E8FF] px-5 py-3 text-sm font-bold text-[#5B21B6] transition hover:bg-[#E9D5FF]"
            >
              Save My Preferences
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

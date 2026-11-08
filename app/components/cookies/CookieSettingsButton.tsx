'use client';

import { useCookieConsent } from './CookieConsentProvider';

export default function CookieSettingsButton({ className = '' }: { className?: string }) {
  const { openPreferences } = useCookieConsent();

  return (
    <button
      type="button"
      onClick={openPreferences}
      className={`inline-flex items-center justify-center rounded-full border border-white/15 bg-white/10 px-3 py-2 text-sm font-medium text-white transition hover:bg-white/15 ${className}`}
    >
      Cookie Settings
    </button>
  );
}

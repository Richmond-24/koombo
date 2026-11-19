'use client';

import { useCookieConsent } from './CookieConsentProvider';

type CookieSettingsButtonProps = {
  className?: string;
};

export default function CookieSettingsButton({ className = '' }: CookieSettingsButtonProps) {
  const { openPreferences } = useCookieConsent();

  return (
    <button
      type="button"
      onClick={openPreferences}
      className={`text-sm text-white/75 transition-colors hover:text-white ${className}`}
    >
      Cookie Settings
    </button>
  );
}
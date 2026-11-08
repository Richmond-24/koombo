'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  buildConsentRecord,
  DEFAULT_CATEGORIES,
  getDefaultConsent,
  hasValidConsent,
  persistConsent,
  readStoredConsent,
  type ConsentRecord,
  type CookieCategory,
  type CookieConsentState,
} from './cookieConsent';

export type CookieConsentContextValue = {
  consent: ConsentRecord | null;
  isReady: boolean;
  isBannerVisible: boolean;
  isPreferencesOpen: boolean;
  categories: CookieConsentState;
  setCategory: (category: CookieCategory, enabled: boolean) => void;
  acceptAll: () => void;
  rejectOptional: () => void;
  savePreferences: (categories: CookieConsentState) => void;
  openPreferences: () => void;
  closePreferences: () => void;
};

const CookieConsentContext = createContext<CookieConsentContextValue | undefined>(undefined);

export function CookieConsentProvider({ children }: { children: React.ReactNode }) {
  const [consent, setConsent] = useState<ConsentRecord | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);

  useEffect(() => {
    const storedConsent = readStoredConsent();
    setConsent(storedConsent ?? getDefaultConsent());
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isReady || !consent) return;
    if (hasValidConsent(consent)) {
      persistConsent(consent);
    }
  }, [consent, isReady]);

  const categories = useMemo(() => consent?.categories ?? DEFAULT_CATEGORIES, [consent]);
  const isBannerVisible = isReady && !hasValidConsent(consent);

  const saveConsentRecord = useCallback((nextCategories: CookieConsentState, source: 'accept_all' | 'reject_optional' | 'custom') => {
    const nextConsent = buildConsentRecord(nextCategories, source);
    setConsent(nextConsent);
    persistConsent(nextConsent);
    setIsPreferencesOpen(false);
  }, []);

  const setCategory = useCallback((category: CookieCategory, enabled: boolean) => {
    setConsent((current) => {
      const existing = current ?? getDefaultConsent();
      const nextCategories = { ...existing.categories, [category]: category === 'necessary' ? true : enabled };
      if (nextCategories.necessary !== true) {
        nextCategories.necessary = true;
      }

      return {
        ...existing,
        version: 1,
        policyVersion: existing.policyVersion,
        consentedAt: new Date().toISOString(),
        source: 'custom',
        categories: nextCategories,
      };
    });
  }, []);

  const acceptAll = useCallback(() => {
    saveConsentRecord({ necessary: true, functional: true, analytics: true, marketing: true }, 'accept_all');
  }, [saveConsentRecord]);

  const rejectOptional = useCallback(() => {
    saveConsentRecord({ necessary: true, functional: false, analytics: false, marketing: false }, 'reject_optional');
  }, [saveConsentRecord]);

  const savePreferences = useCallback((nextCategories: CookieConsentState) => {
    const merged = { necessary: true, functional: nextCategories.functional, analytics: nextCategories.analytics, marketing: nextCategories.marketing };
    saveConsentRecord(merged, 'custom');
  }, [saveConsentRecord]);

  const openPreferences = useCallback(() => setIsPreferencesOpen(true), []);
  const closePreferences = useCallback(() => setIsPreferencesOpen(false), []);

  const value = useMemo<CookieConsentContextValue>(
    () => ({
      consent,
      isReady,
      isBannerVisible,
      isPreferencesOpen,
      categories,
      setCategory,
      acceptAll,
      rejectOptional,
      savePreferences,
      openPreferences,
      closePreferences,
    }),
    [acceptAll, categories, closePreferences, consent, isBannerVisible, isPreferencesOpen, isReady, openPreferences, rejectOptional, savePreferences, setCategory]
  );

  return <CookieConsentContext.Provider value={value}>{children}</CookieConsentContext.Provider>;
}

export function useCookieConsent(): CookieConsentContextValue {
  const context = useContext(CookieConsentContext);

  if (!context) {
    throw new Error('useCookieConsent must be used within CookieConsentProvider');
  }

  return context;
}

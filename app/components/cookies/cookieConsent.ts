'use client';

export type CookieCategory = 'necessary' | 'functional' | 'analytics' | 'marketing';
export type ConsentSource = 'accept_all' | 'reject_optional' | 'custom' | 'unset';

export type CookieConsentState = {
  necessary: boolean;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
};

export type ConsentRecord = {
  version: number;
  policyVersion: string;
  consentedAt: string;
  source: ConsentSource;
  categories: CookieConsentState;
};

export const COOKIE_CONSENT_KEY = 'koombo_cookie_consent_v1';
export const COOKIE_POLICY_VERSION = '2026-11-05';
export const CONSENT_RETENTION_DAYS = 365;

export const DEFAULT_CATEGORIES: CookieConsentState = {
  necessary: true,
  functional: false,
  analytics: false,
  marketing: false,
};

export const CATEGORY_CONFIG: Array<{ key: CookieCategory; label: string; description: string; required: boolean }> = [
  {
    key: 'necessary',
    label: 'Strictly Necessary',
    description: 'Required for core site functionality, security, authentication, checkout flow, and fraud prevention.',
    required: true,
  },
  {
    key: 'functional',
    label: 'Functional',
    description: 'Remembers your language, region, preferences, and selected shopping experience settings.',
    required: false,
  },
  {
    key: 'analytics',
    label: 'Analytics',
    description: 'Helps us understand traffic and feature interactions to improve discovery and product experience.',
    required: false,
  },
  {
    key: 'marketing',
    label: 'Marketing',
    description: 'Used for advertising measurement, conversion tracking, and audience personalization if enabled later.',
    required: false,
  },
];

function isValidCategoryValue(value: unknown): value is boolean {
  return typeof value === 'boolean';
}

export function getDefaultConsent(): ConsentRecord {
  return {
    version: 1,
    policyVersion: COOKIE_POLICY_VERSION,
    consentedAt: new Date(0).toISOString(),
    source: 'unset',
    categories: { ...DEFAULT_CATEGORIES },
  };
}

export function normalizeConsent(raw: unknown): ConsentRecord | null {
  if (!raw || typeof raw !== 'object') return null;

  const record = raw as Partial<ConsentRecord>;
  if (typeof record.version !== 'number' || record.version < 1) return null;
  if (typeof record.policyVersion !== 'string' || !record.policyVersion) return null;
  if (typeof record.consentedAt !== 'string' || !record.consentedAt) return null;
  if (typeof record.source !== 'string') return null;

  const categories = record.categories;
  if (!categories || typeof categories !== 'object') return null;

  const normalized: CookieConsentState = {
    necessary: isValidCategoryValue(categories.necessary) ? categories.necessary : true,
    functional: isValidCategoryValue(categories.functional) ? categories.functional : false,
    analytics: isValidCategoryValue(categories.analytics) ? categories.analytics : false,
    marketing: isValidCategoryValue(categories.marketing) ? categories.marketing : false,
  };

  normalized.necessary = true;

  return {
    version: record.version,
    policyVersion: record.policyVersion,
    consentedAt: record.consentedAt,
    source: (record.source as ConsentSource) || 'unset',
    categories: normalized,
  };
}

export function hasValidConsent(consent: ConsentRecord | null): boolean {
  if (!consent) return false;
  if (consent.policyVersion !== COOKIE_POLICY_VERSION) return false;
  if (consent.version !== 1) return false;
  if (consent.categories.necessary !== true) return false;

  const consentAgeMs = new Date().getTime() - new Date(consent.consentedAt).getTime();
  const retentionMs = CONSENT_RETENTION_DAYS * 24 * 60 * 60 * 1000;

  if (Number.isNaN(consentAgeMs) || consentAgeMs > retentionMs) return false;

  return true;
}

export function readStoredConsent(): ConsentRecord | null {
  if (typeof window === 'undefined') return null;

  try {
    const raw = window.localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!raw) return null;
    return normalizeConsent(JSON.parse(raw));
  } catch {
    return null;
  }
}

export function persistConsent(consent: ConsentRecord): void {
  if (typeof window === 'undefined') return;

  const payload = JSON.stringify(consent);
  window.localStorage.setItem(COOKIE_CONSENT_KEY, payload);

  const consentCookie = encodeURIComponent(payload);
  document.cookie = `${COOKIE_CONSENT_KEY}=${consentCookie}; path=/; max-age=${CONSENT_RETENTION_DAYS * 24 * 60 * 60}; SameSite=Lax`;

  const tagWindow = window as Window & {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  };

  if (Array.isArray(tagWindow.dataLayer)) {
    tagWindow.dataLayer.push({ event: 'koombo_consent_update', consent: consent.categories });
  }

  if (typeof tagWindow.gtag === 'function') {
    tagWindow.gtag('consent', 'update', {
      ad_storage: consent.categories.marketing ? 'granted' : 'denied',
      analytics_storage: consent.categories.analytics ? 'granted' : 'denied',
      functionality_storage: consent.categories.functional ? 'granted' : 'denied',
      personalization_storage: consent.categories.functional ? 'granted' : 'denied',
      security_storage: 'granted',
    });
  }

  if (typeof tagWindow.fbq === 'function') {
    if (consent.categories.marketing) {
      tagWindow.fbq('consent', 'grant');
    } else {
      tagWindow.fbq('consent', 'revoke');
    }
  }
}

export function buildConsentRecord(categories: Partial<CookieConsentState>, source: ConsentSource): ConsentRecord {
  const merged = {
    necessary: true,
    functional: Boolean(categories.functional),
    analytics: Boolean(categories.analytics),
    marketing: Boolean(categories.marketing),
  };

  return {
    version: 1,
    policyVersion: COOKIE_POLICY_VERSION,
    consentedAt: new Date().toISOString(),
    source,
    categories: merged,
  };
}

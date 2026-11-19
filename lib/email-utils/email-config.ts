export const BRAND_NAME = 'Koombo';
export const BRAND_PRIMARY = '#6D28D9';
export const BRAND_SECONDARY = '#101820';
export const BRAND_ACCENT = '#F59E0B';

export const APP_URL = (process.env.APP_URL || 'https://koomboapp.com').trim().replace(/\/$/, '');
export const DEFAULT_SENDER = (process.env.EMAIL_FROM || 'Koombo <noreply@koomboapp.com>').trim();
export const SUPPORT_EMAIL = (process.env.SUPPORT_EMAIL || 'support@koomboapp.com').trim();
export const EMAIL_FOOTER_NOTE = 'Koombo helps buyers and sellers trade smarter, faster, and more confidently.';

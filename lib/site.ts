export const siteName = 'Koombo';

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  ? process.env.NEXT_PUBLIC_SITE_URL.replace(/\/+$/, '')
  : 'https://www.koombo.app';

export const defaultDescription =
  'Koombo is a community marketplace for discovering authentic products, connecting with trusted sellers, and growing local businesses through direct commerce.';

export const defaultKeywords = [
  'Koombo',
  'local marketplace',
  'buy and sell in Ghana',
  'community marketplace',
  'trusted sellers',
  'product discovery',
  'shopping app Ghana',
  'seller marketplace',
  'online marketplace',
  'Koombo shop',
];

export const publicSiteRoutes = [
  '/',
  '/about',
  '/shop',
  '/contact',
  '/watch-demo',
  '/seller',
  '/lister',
  '/lister/connectors',
  '/privacy-policy',
  '/cookie-policy',
  '/terms',
];

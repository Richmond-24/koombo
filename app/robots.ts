import type { MetadataRoute } from 'next';
import { publicSiteRoutes, siteUrl } from '../lib/site';

export default function robots(): MetadataRoute.Robots {
  const disallow = [
    '/api/',
    '/login',
    '/seller/signin',
    '/seller/dashboard',
    '/lister/connectors/dashboard',
    '/lister/connectors/signin',
    '/lister/connectors/signup',
    '/lister/create-listing',
    '/lister/setup',
    '/test-webhook',
  ];

  return {
    rules: [
      {
        userAgent: '*',
        allow: publicSiteRoutes,
        disallow,
      },
    ],
    sitemap: [`${siteUrl}/sitemap.xml`],
  };
}

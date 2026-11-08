import type { MetadataRoute } from 'next';
import { publicSiteRoutes, siteUrl } from '../lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return publicSiteRoutes.map((route) => ({
    url: `${siteUrl}${route === '/' ? '' : route}`,
    lastModified: now,
    changeFrequency: route === '/' ? 'daily' : 'weekly',
    priority: route === '/' ? 1 : 0.8,
  }));
}

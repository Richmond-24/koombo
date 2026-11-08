
import type { Metadata, Viewport } from 'next'
import LokiChatButton from './components/LokiChatButton'
import ScrollReveal from './components/ScrollReveal'
import { CookieConsentProvider } from './components/cookies/CookieConsentProvider'
import CookieConsentBanner from './components/cookies/CookieConsentBanner'
import CookiePreferencesModal from './components/cookies/CookiePreferencesModal'
import { defaultDescription, defaultKeywords, siteName, siteUrl } from '../lib/site'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} | Discover products & trusted sellers`,
    template: `%s | ${siteName}`,
  },
  description: defaultDescription,
  applicationName: siteName,
  keywords: defaultKeywords,
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: `${siteName} | Discover products & trusted sellers`,
    description: defaultDescription,
    url: siteUrl,
    siteName,
    locale: 'en_GH',
    type: 'website',
    images: [{ url: `${siteUrl}/logo.png`, width: 1200, height: 630, alt: `${siteName} logo` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteName} | Discover products & trusted sellers`,
    description: defaultDescription,
    images: [`${siteUrl}/logo.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export const viewport: Viewport = {
  themeColor: '#5B21B6',
}

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: siteName,
  url: siteUrl,
  logo: `${siteUrl}/logo.png`,
  description: defaultDescription,
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer support',
    availableLanguage: ['English'],
    email: 'hello@koombo.app',
    telephone: '+233531190274',
  },
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: siteName,
  url: siteUrl,
  description: defaultDescription,
  potentialAction: {
    '@type': 'SearchAction',
    target: `${siteUrl}/shop?search={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className="antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([organizationSchema, websiteSchema]),
          }}
        />
        <CookieConsentProvider>
          <ScrollReveal />
          {children}
          <CookieConsentBanner />
          <CookiePreferencesModal />
          <LokiChatButton />
        </CookieConsentProvider>
      </body>
    </html>
  )
}

import type { Metadata } from 'next'
import KoomboHero from './components/KoomboHero'
import PartnerPage from './components/PartnerPage'
import Faq from './components/Faq'
import Banner from './components/Banner'
import SellerPage from './components/SellerPage'
import KoomboRider from './components/KoomboRider'
import KoomboConnector from './components/KoomboConnector'
import Display from './components/Display'
import KoomboBonaza from './components/koomboBonaza'
import Footer from './components/Footer'
import { defaultDescription, siteName, siteUrl } from '../lib/site'

export const metadata: Metadata = {
  title: `${siteName} | Discover products & trusted sellers`,
  description: defaultDescription,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: `${siteName} | Discover products & trusted sellers`,
    description: defaultDescription,
    url: siteUrl,
    siteName,
    type: 'website',
    images: [{ url: `${siteUrl}/logo.png`, width: 1200, height: 630, alt: `${siteName} logo` }],
  },
}

export default function Home() {
  return (
    <div>
      <KoomboHero />
      <PartnerPage />
      <SellerPage />
      <Banner />
      <KoomboRider />
      <KoomboConnector />
      <Faq />
      <Display />
      <KoomboBonaza />
      <Footer />
    </div>
  )
}

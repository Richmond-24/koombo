
import type { Metadata } from 'next'
import LokiChatButton from './components/LokiChatButton'
import ScrollReveal from './components/ScrollReveal'
import './globals.css'

export const metadata: Metadata = {
  title: 'Koombo | Seller Listing',
  description: 'List products directly from Telegram or WhatsApp. AI handles the rest.',
  icons: {
    icon: '/favicon.ico', // This references the file in public/
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className="antialiased">
        <ScrollReveal />
        {children}
        <LokiChatButton />
      </body>
    </html>
  )
}

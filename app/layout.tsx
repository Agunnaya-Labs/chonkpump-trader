import { Analytics } from '@vercel/analytics/next'
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ChonkPump - Trade CHONK9K from Telegram',
  description: 'Trade CHONK9K tokens directly from Telegram with real-time balance checking, instant swaps, leaderboard tracking, and portfolio analytics on Base network.',
  generator: 'v0.app',
  keywords: ['crypto', 'trading', 'telegram', 'defi', 'chonk9k', 'base', 'blockchain'],
  authors: [{ name: 'ChonkPump' }],
  openGraph: {
    title: 'ChonkPump - Trade CHONK9K from Telegram',
    description: 'Trade CHONK9K tokens directly from Telegram with dual wallet modes',
    url: 'https://chonkpump.vercel.app',
    siteName: 'ChonkPump',
    images: [
      {
        url: '/banner.png',
        width: 1200,
        height: 630,
        alt: 'ChonkPump Telegram Bot',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ChonkPump - Trade CHONK9K from Telegram',
    description: 'Trade CHONK9K tokens directly from Telegram',
    images: ['/banner.png'],
  },
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans antialiased bg-background text-foreground">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}

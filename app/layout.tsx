import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Rubbsh App - AI Waste Classification',
  description: 'Point your camera at waste items to classify them and get recycling recommendations',
  manifest: '/manifest.json',
  icons: {
    icon: '/icons/logo.png',
    apple: '/icons/logo.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Rubbsh',
  },
  openGraph: {
    title: 'Rubbsh App - AI Waste Classification',
    description: 'Point your camera at waste items to classify them and get recycling recommendations',
    type: 'website',
    images: [
      {
        url: '/icons/logo.png',
        width: 1024,
        height: 1024,
        alt: 'Rubbsh App Logo',
      }
    ],
  },
  twitter: {
    card: 'summary',
    title: 'Rubbsh App - AI Waste Classification',
    description: 'Point your camera at waste items to classify them and get recycling recommendations',
    images: ['/icons/logo.png'],
  },
  other: {
    'Content-Security-Policy': `
      default-src 'self';
      script-src 'self' 'unsafe-eval' 'unsafe-inline';
      style-src 'self' 'unsafe-inline';
      img-src 'self' blob: data:;
      media-src 'self' blob:;
      connect-src 'self' https://api.x.ai https://gafqrrhapewwzayngzqr.supabase.co wss://gafqrrhapewwzayngzqr.supabase.co;
    `.replace(/\s+/g, ' '),
    'Permissions-Policy': 'camera=(self), microphone=()'
  }
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" href="/icons/logo.png" />
        <link rel="apple-touch-icon" href="/icons/logo.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body>{children}</body>
    </html>
  )
}
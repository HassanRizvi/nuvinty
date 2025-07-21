import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Nuvinty',
  description: 'Your luxury fashion destination.',
  icons: {
    icon: '/favicon.png',
  },
  openGraph: {
    title: 'Nuvinty',
    description: 'Shop luxury fashion at Nuvinty.',
    url: 'https://nuvinty.com',
    siteName: 'Nuvinty',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Nuvinty - Luxury Fashion',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nuvinty',
    description: 'Shop luxury fashion at Nuvinty.',
    images: ['/og-image.png'],
    site: '@yourtwitterhandle', // Optional: replace with your Twitter handle
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      {children}
    </>
  )
}

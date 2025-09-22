import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import type { Metadata } from 'next'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
  preload: true,
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
  preload: true,
})

export const metadata: Metadata = {
  title: {
    default: 'Illia.club - Your Expat Lifeline in Latin America',
    template: '%s | Illia.club',
  },
  description:
    'Connect with trusted home services in Medellín and Florianópolis. Find cleaners, cooks, and more through our expat community platform.',
  keywords: [
    'expat services',
    'Medellín',
    'Florianópolis',
    'home services',
    'cleaners',
    'cooks',
    'expat community',
  ],
  openGraph: {
    title: 'Illia.club - Your Expat Lifeline in Latin America',
    description: 'Connect with trusted home services in Medellín and Florianópolis.',
    type: 'website',
    url: 'https://illia.club',
    siteName: 'Illia.club',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Illia.club - Your Expat Lifeline',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Illia.club - Your Expat Lifeline in Latin America',
    description: 'Connect with trusted home services in Medellín and Florianópolis.',
    images: ['/og-image.png'],
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
  metadataBase: new URL('https://illia.club'),
  alternates: {
    canonical: '/',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="antialiased flex flex-col min-h-screen">{children}</body>
    </html>
  )
}

import { Parkinsans, Poppins } from 'next/font/google'
import './globals.css'
import type { Metadata } from 'next'
import { Providers } from './providers'

const parkinsans = Parkinsans({
  variable: '--font-parkinsans',
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  weight: ['300', '400', '500', '600', '700', '800'],
})

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  weight: ['300', '400', '500', '600', '700'],
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
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Illia.club',
  },
  formatDetection: {
    telephone: false,
  },
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

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#14b8a6' },
    { media: '(prefers-color-scheme: dark)', color: '#0d9488' },
  ],
  colorScheme: 'light dark',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html className={`${parkinsans.variable} ${poppins.variable}`}>
      <body className="flex min-h-screen flex-col font-body antialiased">
        {/* Skip Navigation Link for Accessibility - Hidden by default, shows on focus */}
        <a
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-teal-600 focus:px-4 focus:py-2 focus:text-white focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
          href="#main-content"
        >
          Skip to main content
        </a>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

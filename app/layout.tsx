import { Parkinsans, Poppins } from 'next/font/google'
import './globals.css'
import type { Metadata } from 'next'

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
  maximumScale: 1,
}

export const themeColor = '#14b8a6'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html className={`${parkinsans.variable} ${poppins.variable}`}>
      <body className="antialiased flex flex-col min-h-screen font-body">
        {/* Skip Navigation Link for Accessibility */}
        <a
          href="#main-content"
          className="sr-only-focusable bg-teal-600 text-white px-4 py-2 rounded-md absolute top-4 left-4 z-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
        >
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  )
}

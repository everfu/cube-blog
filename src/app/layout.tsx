import type { Metadata } from 'next'
import '@unocss/reset/tailwind.css'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const SITE_URL = 'https://blog.efu.me'
const SITE_NAME = "Fuever's Blog"
const SITE_DESCRIPTION = 'A nook where thoughts & ideas sometimes echo'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  authors: [{ name: 'Fuever', url: SITE_URL }],
  creator: 'Fuever',
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: SITE_URL,
    types: {
      'application/atom+xml': `${SITE_URL}/atom.xml`,
    },
  },
  icons: {
    icon: '/favicon-32x32.ico',
    apple: '/apple-touch-icon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="min-h-screen relative px-4 md:px-0" suppressHydrationWarning>
        <Header />
        <main className="max-w-[780px] mx-auto relative z-10">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}

import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import '@/app/globals.css'
import { site } from '@/data/site'

const sans = Geist({ subsets: ['latin'], variable: '--font-sans' })
const mono = Geist_Mono({ subsets: ['latin'], variable: '--font-mono' })

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.name, template: `%s | ${site.name}` },
  description: site.description,
  authors: [{ name: site.author, url: site.homepage }],
  openGraph: { title: site.name, description: site.description, url: site.url, siteName: site.name, images: ['/og-image.png'], locale: 'zh_CN', type: 'website' },
  twitter: { card: 'summary_large_image', title: site.name, description: site.description, images: ['/og-image.png'] },
  alternates: { types: { 'application/atom+xml': '/atom.xml', 'text/x-opml': '/efu.opml' } },
  icons: { icon: '/favicon-32x32.ico', apple: '/apple-touch-icon.png' },
}

const themeScript = `(function(){try{var t=localStorage.getItem('theme');var d=t==='dark'||(!t&&matchMedia('(prefers-color-scheme:dark)').matches);document.documentElement.dataset.theme=d?'dark':'light';document.documentElement.style.colorScheme=d?'dark':'light'}catch(e){}})()`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="zh-CN" suppressHydrationWarning className={`${sans.variable} ${mono.variable}`}><head><script dangerouslySetInnerHTML={{ __html: themeScript }} /></head><body>{children}</body></html>
}

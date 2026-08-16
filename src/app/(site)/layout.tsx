import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'
import { ImageRevealProvider } from '@/features/images'

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="page-grid">
      <SiteHeader />
      <main className="site-main"><ImageRevealProvider>{children}</ImageRevealProvider></main>
      <SiteFooter />
    </div>
  )
}

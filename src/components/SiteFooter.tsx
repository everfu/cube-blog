import Link from 'next/link'
import { Code2, Mail } from 'lucide-react'
import { Newsletter } from '@/components/Newsletter'
import { site } from '@/data/site'

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-newsletter"><Newsletter /></div>
      <div className="footer-bottom">
        <div>
          <strong>{site.name}</strong>
          <p>© 2022 – {new Date().getFullYear()} 伍拾柒. All rights reserved.</p>
        </div>
        <nav aria-label="页脚导航">
          <Link href="/posts/" prefetch={false}>文章</Link>
          <Link href="/stack/" prefetch={false}>装备</Link>
          <Link href="/atom.xml" prefetch={false}>订阅</Link>
        </nav>
        <div className="footer-social">
          <a href={site.github} target="_blank" rel="noreferrer" aria-label="GitHub"><Code2 /></a>
          <a href={`mailto:${site.email}`} aria-label="Email"><Mail /></a>
        </div>
      </div>
    </footer>
  )
}

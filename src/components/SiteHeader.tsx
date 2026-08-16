'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Mail, Moon, Sun, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { navigation, site } from '@/data/site'
import { ManagedImage } from '@/features/images'

function ThemeButton() {
  const [dark, setDark] = useState(false)
  useEffect(() => {
    setDark(document.documentElement.dataset.theme === 'dark')
  }, [])
  function toggle() {
    const next = !dark
    setDark(next)
    document.documentElement.dataset.theme = next ? 'dark' : 'light'
    document.documentElement.style.colorScheme = next ? 'dark' : 'light'
    localStorage.setItem('theme', next ? 'dark' : 'light')
  }
  return <button className="round-control" onClick={toggle} aria-label={dark ? '切换到浅色模式' : '切换到深色模式'}>{dark ? <Sun /> : <Moon />}</button>
}

export function SiteHeader() {
  const pathname = usePathname()
  const home = pathname === '/'
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 64)
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  return (
    <header className={`site-header ${home ? 'site-header--home' : ''} ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="header-inner">
        <Link href="/" prefetch={false} className="avatar-link" aria-label="返回首页">
          <ManagedImage
            src={site.avatar}
            alt="伍拾柒"
            className="avatar-image"
            width={150}
            height={150}
            fill
            sizes="56px"
            intent="avatar"
            loading="eager"
          />
        </Link>

        <nav className="desktop-nav" aria-label="主导航">
          {navigation.map(item => <Link key={item.href} href={item.href} prefetch={false} className={pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href.slice(0, -1))) ? 'active' : ''}>{item.label}</Link>)}
        </nav>

        <button className="mobile-nav-trigger" onClick={() => setMenuOpen(true)} aria-expanded={menuOpen}>前往 <span aria-hidden="true">⌄</span></button>

        <div className="header-actions">
          <a className="round-control contact-control" href={`mailto:${site.email}`} aria-label="发送邮件"><Mail /></a>
          <ThemeButton />
        </div>
      </div>

      {menuOpen && <div className="mobile-menu-backdrop" role="presentation" onClick={() => setMenuOpen(false)}>
        <div className="mobile-menu" role="dialog" aria-modal="true" aria-label="站内导航" onClick={event => event.stopPropagation()}>
          <div className="mobile-menu-head"><span>站内导航</span><button onClick={() => setMenuOpen(false)} aria-label="关闭菜单"><X /></button></div>
          <nav>{navigation.map(item => <Link key={item.href} href={item.href} prefetch={false} onClick={() => setMenuOpen(false)}>{item.label}<span>↗</span></Link>)}</nav>
        </div>
      </div>}
    </header>
  )
}

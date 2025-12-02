'use client'

import Link from 'next/link'
import { useState } from 'react'
import { SectionDivider } from '@/components/common'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navItems = [
    { name: 'POSTS', href: '/posts' },
    { name: 'STACK', href: '/stack' },
    { name: 'ALBUM', href: '/album' },
  ]

  return (
    <header className="max-w-[780px] mx-auto relative z-10">
      <nav className="px-2 md:px-4 py-2">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center hover:opacity-60 transition-opacity">
            <svg width="32" height="32" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="overflow-visible">
              {/* e */}
              <path 
                d="M6 24c0-4 3-7 7-7s7 3 7 7-3 7-7 7c-2 0-4-1-5-2"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
                className="animate-draw"
                style={{ 
                  strokeDasharray: 50,
                  strokeDashoffset: 50,
                  animation: 'draw 1.2s ease forwards'
                }}
              />
              {/* e 中横线 */}
              <path 
                d="M6 24h14"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
                style={{ 
                  strokeDasharray: 14,
                  strokeDashoffset: 14,
                  animation: 'draw 0.6s ease forwards 0.4s'
                }}
              />
              {/* f */}
              <path 
                d="M24 31V20c0-3 2-5 5-5"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
                style={{ 
                  strokeDasharray: 20,
                  strokeDashoffset: 20,
                  animation: 'draw 0.8s ease forwards 0.6s'
                }}
              />
              {/* f 横线 */}
              <path 
                d="M22 22h7"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
                style={{ 
                  strokeDasharray: 7,
                  strokeDashoffset: 7,
                  animation: 'draw 0.4s ease forwards 1s'
                }}
              />
              {/* u */}
              <path 
                d="M34 17v10c0 2.5 2 4 4.5 4s4.5-1.5 4.5-4V17"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
                style={{ 
                  strokeDasharray: 30,
                  strokeDashoffset: 30,
                  animation: 'draw 1s ease forwards 1.2s'
                }}
              />
              <style>{`
                @keyframes draw {
                  to {
                    stroke-dashoffset: 0;
                  }
                }
              `}</style>
            </svg>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link 
                key={item.name}
                href={item.href}
                className="relative px-2 py-1 text-xs font-medium tracking-wide text-foreground transition-opacity group"
              >
                <span className='corner'></span>
                {item.name}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <span className={`i-lucide-${isMenuOpen ? 'x' : 'menu'} text-lg`}></span>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 space-y-3 pb-4 border-t border-border pt-4">
            {navItems.map((item) => (
              <Link 
                key={item.name}
                href={item.href}
                className="relative block text-sm font-medium hover:opacity-60 transition-opacity group"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className='corner'></span>
                {item.name}
              </Link>
            ))}
          </div>
        )}
      </nav>
      <SectionDivider />
    </header>
  )
}

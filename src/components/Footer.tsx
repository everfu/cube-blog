import Link from 'next/link'
import { SectionDivider } from '@/components/common'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative">
      <div className="max-w-[780px] mx-auto">
        <SectionDivider />
      </div>
      <div className="max-w-[780px] mx-auto px-4 md:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-xs text-muted">
            © 2022 - {currentYear} Fuever. All rights reserved.
          </div>
          
          <div className="flex items-center gap-4">
            <Link 
              href="https://github.com/everfu" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted hover:opacity-60 transition-opacity"
              aria-label="GitHub"
            >
              <div className="i-lucide-github text-base"></div>
            </Link>
            <Link 
              href="https://twitter.com/everfu8" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted hover:opacity-60 transition-opacity"
              aria-label="Twitter"
            >
              <div className="i-lucide-twitter text-base"></div>
            </Link>
            <Link 
              href="/atom.xml" 
              className="text-muted hover:opacity-60 transition-opacity"
              aria-label="Atom Feed"
            >
              <div className="i-lucide-rss text-base"></div>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

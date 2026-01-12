import Link from 'next/link'
import { SectionDivider } from '@/components/common'

export default function NotFound() {
  return (
    <div className="space-y-0">
      {/* Error Header */}
      <section>
        <h2 className="section-title">
          01 / <span className="text-foreground">ERROR</span>
        </h2>
        <SectionDivider />
      </section>

      {/* Error Content */}
      <section className="min-h-[70vh] flex flex-col items-center justify-center px-4">
        {/* 404 Number */}
        <div className="text-[60px] md:text-[100px] font-bold text-muted/20 leading-none select-none">
          404
        </div>

        {/* Error Title */}
        <h1 className="text-2xl md:text-3xl font-semibold mt-4 text-foreground">
          Page Not Found
        </h1>

        {/* Error Description */}
        <p className="text-muted text-sm mt-4 text-center max-w-md">
          The page you are looking for doesn&apos;t exist or has been moved.
        </p>

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Link href="/" className="relative btn text-center group">
            <span className="corner" />
            GO HOME
          </Link>
          <Link
            href="/posts"
            className="relative px-6 py-3 border border-foreground hover:bg-foreground hover:text-background transition-all cursor-pointer font-medium text-xs uppercase tracking-wide text-center group"
          >
            <span className="corner" />
            VIEW POSTS
          </Link>
        </div>
      </section>
    </div>
  )
}

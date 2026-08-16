import Link from 'next/link'
import { CalendarDays, Clock3, FileText } from 'lucide-react'
import { ManagedImage } from '@/features/images'
import { formatPostDate } from '@/features/posts/content'
import type { PostSnapshot } from '@/features/posts/types'

export function PostCard({ post, featured = false }: { post: PostSnapshot; featured?: boolean }) {
  return (
    <article className={`post-card ${featured ? 'post-card--featured' : ''}`}>
      <Link
        href={post.href}
        prefetch={false}
        className="post-card-link"
        aria-label={`阅读 ${post.title}`}
      >
        <span className="post-card-cover">
          <ManagedImage
            src={post.cover}
            alt=""
            className="post-card-cover-image"
            fill
            width={640}
            height={360}
            sizes="(max-width: 780px) calc(100vw - 56px), 520px"
            intent="cover"
          />
        </span>
        <span className="post-card-body">
          <ManagedImage
            src={post.cover}
            alt=""
            className="post-card-backdrop"
            fill
            width={320}
            height={180}
            sizes="320px"
            intent="thumbnail"
          />
          <h2>{post.title}</h2>
          <span className="post-card-meta">
            <span><CalendarDays />{formatPostDate(post.date)}</span>
            <span><FileText />{post.category}</span>
            <span><Clock3 />阅读</span>
          </span>
        </span>
      </Link>
    </article>
  )
}

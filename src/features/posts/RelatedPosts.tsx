import Link from 'next/link'
import { CalendarDays, FileText, Hourglass, MousePointerClick, PencilLine } from 'lucide-react'
import { ManagedImage } from '@/features/images'
import { formatPostDate, readingMinutes } from '@/features/posts/content'
import type { PostSnapshot } from '@/features/posts/types'

function RelatedPostCard({ post }: { post: PostSnapshot }) {
  return (
    <Link href={post.href} prefetch={false} className="article-related-card">
      <span className="article-related-cover">
        <ManagedImage
          src={post.cover}
          alt=""
          className="article-related-cover-image"
          fill
          width={640}
          height={360}
          sizes="(max-width: 780px) 75vw, 310px"
          intent="cover"
        />
      </span>
      <span className="article-related-body">
        <ManagedImage
          src={post.cover}
          alt=""
          className="article-related-backdrop"
          fill
          width={320}
          height={180}
          sizes="320px"
          intent="thumbnail"
        />
        <strong>{post.title}</strong>
        <span className="article-related-meta">
          <span><CalendarDays />{formatPostDate(post.date)}</span>
          <span><FileText />{post.category}</span>
          <span className="article-related-spacer" />
          <span><MousePointerClick />0</span>
          <span><Hourglass />{readingMinutes(post.content)}分钟阅读</span>
        </span>
      </span>
    </Link>
  )
}

export function RelatedPosts({ posts }: { posts: PostSnapshot[] }) {
  if (posts.length === 0) return null

  return (
    <section className="article-related" aria-labelledby="article-related-title">
      <h2 id="article-related-title"><PencilLine /><span>相关文章</span></h2>
      <div>{posts.map(post => <RelatedPostCard post={post} key={post.id} />)}</div>
    </section>
  )
}

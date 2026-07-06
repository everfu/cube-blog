import type { AdminPost } from '@/server/posts/contracts/types'
import type { PostStatus } from '@/types/supabase'

interface AdminPostsOverviewProps {
  posts: AdminPost[]
  counts?: Record<PostStatus, number>
}

export default function AdminPostsOverview({ posts, counts }: AdminPostsOverviewProps) {
  const published = counts?.published ?? posts.filter(post => post.status === 'published').length
  const drafts = counts?.draft ?? posts.filter(post => post.status === 'draft').length
  const total = counts ? counts.published + counts.draft + counts.archived : posts.length
  const totalViews = posts.reduce((sum, post) => sum + post.viewCount, 0)

  const cards = [
    { label: '文章', value: total },
    { label: '发布', value: published },
    { label: '草稿', value: drafts },
    { label: '当前浏览', value: totalViews },
  ]

  return (
    <div className="flex flex-wrap items-center gap-2">
      {cards.map(card => (
        <span key={card.label} className="inline-flex h-8 items-center gap-2 rounded-md border border-[var(--admin-border)] bg-background px-2.5 text-xs text-muted">
          <span>{card.label}</span>
          <span className="font-semibold text-foreground">{card.value}</span>
        </span>
      ))}
    </div>
  )
}

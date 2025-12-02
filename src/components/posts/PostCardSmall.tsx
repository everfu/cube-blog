import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { zhCN } from 'date-fns/locale'

interface Post {
  slug: string
  title: string
  date: string
  excerpt: string
  tags?: string[]
  cover?: string
  category?: string
  recent?: boolean
}

interface PostCardSmallProps {
  post: Post
}

// 分类颜色映射
const getCategoryColor = (category?: string) => {
  switch (category?.toUpperCase()) {
    case 'TECH':
      return 'text-blue-400'
    case 'DAILY':
      return 'text-purple-400'
    case 'THOUGHTS':
      return 'text-red-400'
    default:
      return 'text-muted'
  }
}

export default function PostCardSmall({ post }: PostCardSmallProps) {
  const timeAgo = formatDistanceToNow(new Date(post.date), { 
    addSuffix: false,
    locale: zhCN 
  })

  return (
    <Link href={`/posts/${post.slug}`} className="block">
      <article className="group bg-card border border-border p-4 hover:border-primary transition-all duration-200 min-h-[120px] flex flex-col justify-between">
        {/* 顶部：REC 标签和标题 */}
        <div className="flex items-center gap-3 mb-3">
          {post.recent && (
            <div className="flex items-center gap-1 bg-gray-600 px-1 py-1 rounded-md flex-shrink-0">
              <span className="i-lucide-star text-white text-xs" style={{ fill: 'currentColor' }}></span>
              <span className="text-white text-badge uppercase tracking-wide">REC</span>
            </div>
          )}
          <h3 className="text-md font-medium leading-relaxed text-foreground group-hover:opacity-60 transition-opacity flex-1">
            {post.title}
          </h3>
        </div>

        {/* 底部：时间分类 和 阅读 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <time className="text-xs text-muted">
              {timeAgo}
            </time>
            <span className={`text-[10px] font-bold uppercase tracking-wide ${getCategoryColor(post.category)}`}>
              {post.category || 'DAILY'}
            </span>
          </div>
          <span className="text-xs text-muted">阅读 →</span>
        </div>
      </article>
    </Link>
  )
}

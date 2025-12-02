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
}

interface PostCardLargeProps {
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

export default function PostCardLarge({ post }: PostCardLargeProps) {
  const timeAgo = formatDistanceToNow(new Date(post.date), { 
    addSuffix: false,
    locale: zhCN 
  })

  return (
    <Link href={`/posts/${post.slug}`} className="block">
      <article className="group border border-border hover:border-primary transition-all duration-500 min-h-[200px] flex flex-col md:flex-row bg-card overflow-hidden">
        {/* 左侧内容 */}
        <div className="flex-1 p-4 md:p-6 flex flex-col">
          {/* 顶部信息 */}
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className="i-lucide-calendar text-xs text-muted"></span>
            <time className="text-xs text-muted">
              {timeAgo}
            </time>
            <span className={`text-xs font-bold uppercase tracking-wide ${getCategoryColor(post.category)}`}>
              {post.category || 'DAILY'}
            </span>
          </div>

          {/* 标题 */}
          <h3 className="text-base md:text-lg font-bold leading-tight text-foreground group-hover:opacity-70 transition-opacity mb-3">
            {post.title}
          </h3>

          {/* 摘要 */}
          <p className="text-xs text-muted leading-relaxed">
            {post.excerpt}
          </p>
        </div>

        {/* 右侧图片区域 */}
        <div className="flex-1 h-full p-4 relative overflow-hidden flex items-center justify-center">
          <div className="w-full h-full overflow-hidden">
            {post.cover ? (
              <img 
                src={post.cover} 
                alt={post.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex-1 h-full flex items-center justify-center">
                <div className="i-lucide-image text-4xl opacity-20 text-muted"></div>
              </div>
            )}
          </div>
        </div>
      </article>
    </Link>
  )
}

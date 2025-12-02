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

interface PostCardProps {
  post: Post
}

export default function PostCard({ post }: PostCardProps) {
  const timeAgo = formatDistanceToNow(new Date(post.date), { 
    addSuffix: false,
    locale: zhCN 
  })

  return (
    <Link href={`/posts/${post.slug}`} className="block">
      <article 
        className="group bg-card border border-border p-5 hover:border-primary transition-all duration-500 min-h-[110px] flex flex-col relative overflow-hidden"
        style={{
          backgroundImage: post.cover ? `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${post.cover})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* 背景遮罩 - 悬停时淡出 */}
        <div className="absolute inset-0 bg-card transition-opacity duration-500 group-hover:opacity-0 z-0"></div>
        
        {/* 内容 - 悬停时变白色 */}
        <div className="relative z-10 flex flex-col h-full">
          <div className="flex items-center gap-2.5 mb-3">
            <span className="text-badge text-red-400 uppercase tracking-wide">
              NEW
            </span>
            <time className="text-xs text-muted group-hover:text-white transition-colors duration-500">{timeAgo}</time>
          </div>
          <h3 className="text-sm font-normal leading-relaxed text-foreground group-hover:text-white transition-all duration-500 flex-1">
            {post.title}
          </h3>
        </div>
      </article>
    </Link>
  )
}

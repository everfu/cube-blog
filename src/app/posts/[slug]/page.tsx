import { notFound } from 'next/navigation'
import { getAllPosts, getPostBySlug } from '@/lib/posts'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { formatDistanceToNow, format } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { SectionDivider } from '@/components/common'
import { mdxComponents } from '@/components/MDXComponents'
import Link from 'next/link'
import remarkGfm from 'remark-gfm'
import remarkDirective from 'remark-directive'
import { remarkCallout } from '@/lib/remarkCallout'
import Comment from '@/components/Comment'

// 计算阅读时间（假设每分钟阅读 300 字）
function getReadingTime(content: string): number {
  const words = content.length
  return Math.max(1, Math.ceil(words / 300))
}

// 分类颜色映射
function getCategoryColor(category?: string): string {
  switch (category?.toUpperCase()) {
    case 'TECH':
      return 'text-blue-400 border-blue-400/30'
    case 'DAILY':
      return 'text-purple-400 border-purple-400/30'
    case 'THOUGHTS':
      return 'text-red-400 border-red-400/30'
    default:
      return 'text-muted border-border'
  }
}

interface PageProps {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

const SITE_URL = 'https://blog.efu.me'

export async function generateMetadata({ params }: PageProps) {
  const post = getPostBySlug(params.slug)
  
  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  const postUrl = `${SITE_URL}/posts/${post.slug}`
  const ogImage = post.cover || '/og-image.png'

  return {
    title: post.title,
    description: post.excerpt,
    authors: [{ name: 'Fuever' }],
    openGraph: {
      type: 'article',
      url: postUrl,
      title: post.title,
      description: post.excerpt,
      publishedTime: new Date(post.date).toISOString(),
      authors: ['Fuever'],
      tags: post.tags,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [ogImage],
    },
    alternates: {
      canonical: postUrl,
    },
  }
}

export default function PostPage({ params }: PageProps) {
  const allPosts = getAllPosts()
  const post = getPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  // 获取下一篇文章
  const currentIndex = allPosts.findIndex(p => p.slug === params.slug)
  const nextPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null

  // 计算相对时间和阅读时间
  const timeAgo = formatDistanceToNow(new Date(post.date), { addSuffix: true, locale: zhCN })
  const readingTime = getReadingTime(post.content)

  return (
    <div className="space-y-0">
      {/* Back to Posts */}
      <section>
        <div className="mx-4 md:mx-8 py-4">
          <Link 
            href="/posts"
            className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors"
          >
            <span className="i-lucide-arrow-left text-xs"></span>
            Back to Posts
          </Link>
        </div>
        <SectionDivider />
      </section>

      {/* Article Header */}
      <section>
        <div className="mx-4 md:mx-8 py-4">
          {/* Meta Info Row */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted mb-4">
            <span className="inline-flex items-center gap-1">
              <span className="i-lucide-calendar text-[10px]"></span>
              {timeAgo}
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="i-lucide-clock text-[10px]"></span>
              {readingTime} 分钟
            </span>
            {post.category && (
              <span className={`px-2 py-0.5 border rounded text-xs ${getCategoryColor(post.category)}`}>
                {post.category}
              </span>
            )}
          </div>

          {/* Title and Cover */}
          <div className="flex gap-6">
            <div className="flex-1">
              <h1 
                className="text-xl md:text-2xl font-bold leading-tight mb-3 bg-gradient-to-r from-foreground to-muted bg-clip-text text-transparent"
              >
                {post.title}
              </h1>
              {post.excerpt && (
                <p className="text-sm text-muted leading-relaxed">
                  {post.excerpt}
                </p>
              )}
            </div>
            {/* Cover Image */}
            {post.cover ? (
              <div className="hidden md:block w-70 h-40 border border-border flex-shrink-0 bg-card overflow-hidden">
                <img 
                  src={post.cover} 
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="hidden md:flex w-32 h-24 flex-shrink-0 bg-card rounded items-center justify-center">
                <span className="i-lucide-image text-2xl text-muted"></span>
              </div>
            )}
          </div>
        </div>
        <SectionDivider />
      </section>

      {/* Article Content */}
      <article>
        <div className="mx-4 md:mx-8 py-8 mdx-content">
          <MDXRemote 
            source={post.content} 
            components={mdxComponents}
            options={{
              mdxOptions: {
                remarkPlugins: [remarkGfm, remarkDirective, remarkCallout],
              },
            }}
          />
        </div>
      </article>

      <SectionDivider />

      {/* Next Post Navigation */}
      {nextPost && (
        <section>
          <Link 
            href={`/posts/${nextPost.slug}`}
            className="block mx-4 md:mx-8 py-8 group"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <span className="text-xs text-muted mb-2 block">Next Post</span>
                <h3 className="text-lg font-semibold text-foreground group-hover:opacity-70 transition-opacity">
                  {nextPost.title}
                </h3>
                <span className="text-xs text-muted mt-1 block">
                  {format(new Date(nextPost.date), 'MMM dd, yyyy')}
                </span>
              </div>
              <span className="i-lucide-arrow-right text-muted group-hover:text-foreground transition-colors"></span>
            </div>
          </Link>
          <SectionDivider />
        </section>
      )}

      <Comment />
    </div>
  )
}

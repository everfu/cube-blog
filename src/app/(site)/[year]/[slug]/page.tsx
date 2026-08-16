import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CalendarDays, FileText, Hourglass, MousePointerClick, Undo2 } from 'lucide-react'
import { MDXRemote } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import { ManagedImage } from '@/features/images'
import { ArticleReactions } from '@/features/posts/ArticleReactions'
import { ArticleToc } from '@/features/posts/ArticleToc'
import { formatPostDate, getAllPosts, getPost, readingMinutes } from '@/features/posts/content'
import { mdxComponents } from '@/features/posts/mdx-components'
import { remarkArticleBlocks } from '@/features/posts/markdown'
import { RelatedPosts } from '@/features/posts/RelatedPosts'

interface Props { params: Promise<{ year: string; slug: string }> }

export async function generateStaticParams() { return (await getAllPosts()).map(post => ({ year: post.year, slug: post.slug })) }
export async function generateMetadata({ params }: Props): Promise<Metadata> { const { year, slug } = await params; const post = await getPost(year, slug); return post ? { title: post.title, description: post.excerpt, openGraph: { images: [post.cover], type: 'article', publishedTime: post.date } } : { title: '文章不存在' } }

export default async function ArticlePage({ params }: Props) {
  const { year, slug } = await params
  const posts = await getAllPosts()
  const post = posts.find(item => item.year === year && item.slug === slug)
  if (!post) notFound()
  const related = posts.filter((item) => item.id !== post.id && item.category === post.category).slice(0, 3)
  return <div className="article-page">
    <div className="article-shell">
      <aside className="article-left"><div><ArticleToc headings={post.headings} /></div></aside>
      <div className="article-center">
        <Link href="/posts/" prefetch={false} className="article-back" aria-label="返回文章列表"><Undo2 /></Link>
        <article data-postid={post.id}>
          <header className="article-header">
            <div className="article-cover">
              <ManagedImage
                src={post.cover}
                alt=""
                className="article-cover-glow"
                fill
                width={672}
                height={378}
                sizes="672px"
                intent="thumbnail"
              />
              <ManagedImage
                src={post.cover}
                alt={post.title}
                className="article-cover-image"
                fill
                width={672}
                height={378}
                sizes="(max-width: 780px) calc(100vw - 24px), 672px"
                intent="cover"
                loading="eager"
                fetchPriority="high"
              />
            </div>
            <div className="article-meta">
              <time dateTime={post.date}><CalendarDays />{formatPostDate(post.date)}</time>
              <span><FileText />{post.category}</span>
            </div>
            <h1>{post.title}</h1>
            <p>{post.excerpt}</p>
            <div className="article-stats">
              <span><MousePointerClick />0次点击</span>
              <span><Hourglass />{readingMinutes(post.content)}分钟阅读</span>
            </div>
          </header>
          <div className="article-prose">
            <MDXRemote source={post.content} components={mdxComponents} options={{ mdxOptions: { remarkPlugins: [remarkGfm, remarkArticleBlocks(post.id)] } }} />
          </div>
        </article>
      </div>
      <aside className="article-right"><div><ArticleReactions /></div></aside>
    </div>

    <RelatedPosts posts={related} />
  </div>
}

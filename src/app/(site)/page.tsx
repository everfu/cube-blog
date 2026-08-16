import Link from 'next/link'
import { ArrowUpRight, Code2, Mail } from 'lucide-react'
import { Newsletter } from '@/components/Newsletter'
import { albums } from '@/data/album'
import { watched } from '@/data/home'
import { site } from '@/data/site'
import { ManagedImage } from '@/features/images'
import { getAllPosts } from '@/features/posts/content'
import { PostCard } from '@/features/posts/PostCard'

export default async function HomePage() {
  const posts = await getAllPosts()
  const photos = albums.flatMap(album => album.photos).slice(0, 6)

  return (
    <>
      <section className="home-hero">
        <h1>
          <span className="code-word">&lt;Open source /&gt;</span> developer，
          <span className="selection-word">minimalist</span>，<br />
          <span className="spark-word">做东西</span>，<span>写博客</span>
        </h1>
        <p>做开源，也写博客。喜欢把复杂的东西做得简单、轻巧；代码之外，也用摄影、旅行和纪录片记录生活。</p>
        <div className="hero-links">
          <a href={site.github} target="_blank" rel="noreferrer"><Code2 />GitHub</a>
          <a href={`mailto:${site.email}`}><Mail />Email</a>
          <Link href="/about/" prefetch={false}>关于我 <ArrowUpRight /></Link>
        </div>
      </section>

      <section className="photo-rail" aria-label="相册精选">
        {photos.map((photo, index) => (
          <Link
            href="/album/"
            prefetch={false}
            key={photo.src}
            className={`photo-rail-item photo-${index + 1}`}
          >
            <ManagedImage
              src={photo.src}
              alt={photo.alt}
              className="photo-rail-image"
              fill
              width={320}
              height={420}
              sizes="(max-width: 780px) 118px, 18vw"
              intent="cover"
              loading={index === 0 ? 'eager' : 'lazy'}
              fetchPriority={index === 0 ? 'high' : 'auto'}
            />
          </Link>
        ))}
      </section>

      <section className="home-content">
        <div>
          <div className="section-heading"><span>✎</span><h2>近期精选</h2></div>
          <div className="featured-posts">
            {posts.slice(0, 5).map((post, index) => (
              <PostCard post={post} featured={index === 0} key={post.id} />
            ))}
          </div>
          <Link href="/posts/" prefetch={false} className="text-link">
            浏览全部 {posts.length} 篇文章 <ArrowUpRight />
          </Link>
        </div>
        <aside>
          <Newsletter compact />
          <section className="home-note">
            <span>NOW</span>
            <h2>此刻正在做什么</h2>
            <p>保持博客轻一点、慢一点。把技术实践、工具、照片和生活片段整理成以后还能抵达的形状。</p>
          </section>
        </aside>
      </section>

      <section className="watched-section">
        <div className="section-heading"><span>◉</span><h2>最近看过</h2></div>
        <div className="watched-grid">
          {watched.map(item => (
            <article key={item.title}>
              <div><strong>{item.rating}</strong><small>/ 10</small></div>
              <h3>{item.title}</h3>
              <p>{item.meta}</p>
              <time>{item.date}</time>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}

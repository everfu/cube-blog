import Link from 'next/link'
import {
  ArrowUpRight,
  Camera,
  Code2,
  GitBranch,
  Mail,
  NotebookPen,
  Wrench,
} from 'lucide-react'
import { aboutSocialLinks, aboutTopics } from '@/data/about'
import { site } from '@/data/site'
import { ManagedImage } from '@/features/images'

export const metadata = {
  title: '关于',
  description: '关于伍拾柒、这个博客，以及那些被慢慢整理下来的想法。',
}

const topicIcons = {
  code: Code2,
  write: NotebookPen,
  camera: Camera,
  tools: Wrench,
} as const

function BlueskyIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M5.202 2.857C7.954 4.922 10.913 9.11 12 11.358c1.087-2.247 4.046-6.436 6.798-8.501C20.783 1.366 24 .213 24 3.883c0 .732-.42 6.156-.667 7.037-.856 3.061-3.978 3.842-6.755 3.37 4.854.826 6.089 3.562 3.422 6.299-5.065 5.196-7.28-1.304-7.847-2.97-.104-.305-.152-.448-.153-.327 0-.121-.05.022-.153.327-.568 1.666-2.782 8.166-7.847 2.97-2.667-2.737-1.432-5.473 3.422-6.3-2.777.473-5.899-.308-6.755-3.369C.42 10.04 0 4.615 0 3.883c0-3.67 3.217-2.517 5.202-1.026"
      />
    </svg>
  )
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
      />
    </svg>
  )
}

function TwitterIcon() {
  return (
    <svg viewBox="0 0 512 512" aria-hidden="true">
      <path
        fill="currentColor"
        d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z"
      />
    </svg>
  )
}

const socialIcons = {
  bluesky: BlueskyIcon,
  github: GitHubIcon,
  twitter: TwitterIcon,
  mail: Mail,
} as const

function SectionHeading({ index, title }: { index: string; title: string }) {
  return (
    <header className="about-section-heading">
      <span>{index}</span>
      <h2>{title}</h2>
    </header>
  )
}

export default function AboutPage() {
  return (
    <div className="about-page">
      <section className="about-hero" aria-labelledby="about-title">
        <div className="about-hero-copy">
          <p className="about-kicker">ABOUT / 伍拾柒</p>
          <h1 id="about-title">你好，我是伍拾柒</h1>
          <p>
            我喜欢把复杂的东西做得简单、轻巧。在互联网、代码和各种工具之间工作，
            也用写作、摄影、旅行和纪录片保存日常。
          </p>
          <div className="about-hero-links" aria-label="主要联系方式">
            <a href={site.github} target="_blank" rel="noopener noreferrer">
              <GitBranch />GitHub
            </a>
            <a href={`mailto:${site.email}`}>
              <Mail />Email
            </a>
            <a href={site.homepage} target="_blank" rel="noopener noreferrer">
              个人主页 <ArrowUpRight />
            </a>
          </div>
        </div>

        <figure className="about-portrait">
          <div className="about-portrait-frame">
            <ManagedImage
              src="/media/album/portrait-4.jpg"
              alt="伍拾柒在演讲台上发言"
              className="about-portrait-image"
              fill
              sizes="(max-width: 780px) calc(100vw - 56px), 390px"
              intent="cover"
              loading="eager"
              fetchPriority="high"
            />
          </div>
          <figcaption><span aria-hidden="true">✦</span> 一次演讲，和一段被留下来的现场。</figcaption>
        </figure>
      </section>

      <section className="about-section">
        <SectionHeading index="01" title="关于我" />
        <div className="about-copy">
          <p>
            多数时候，我在代码、设计和各种工具之间来回走动。我喜欢理解事物如何工作，
            也关心它们怎样影响人的习惯、情绪和判断。
          </p>
          <p>
            做东西对我来说，不只是把功能完成，而是把复杂的过程整理成更轻、更清楚、
            以后还能继续维护的形状。
          </p>
        </div>
      </section>

      <section className="about-section">
        <SectionHeading index="02" title="正在发生" />
        <div className="about-topic-grid">
          {aboutTopics.map((topic) => {
            const Icon = topicIcons[topic.icon]
            const content = (
              <>
                <ManagedImage
                  src={topic.imageLight}
                  alt=""
                  className="about-card-background about-card-background--light"
                  fill
                  sizes="(max-width: 780px) calc(100vw - 56px), 410px"
                  intent="thumbnail"
                  loading="lazy"
                  deferUntilVisible
                  failureMode="hide"
                />
                <ManagedImage
                  src={topic.imageDark}
                  alt=""
                  className="about-card-background about-card-background--dark"
                  fill
                  sizes="(max-width: 780px) calc(100vw - 56px), 410px"
                  intent="thumbnail"
                  loading="lazy"
                  deferUntilVisible
                  failureMode="hide"
                />
                <span className="about-card-shade" aria-hidden="true" />
                <span className="about-card-icon"><Icon /></span>
                <ArrowUpRight className="about-card-arrow" />
                <span className="about-card-label">{topic.label}</span>
                <strong>{topic.title}</strong>
                <p>{topic.description}</p>
              </>
            )

            return topic.external ? (
              <a
                className="about-topic-card"
                href={topic.href}
                target="_blank"
                rel="noopener noreferrer"
                key={topic.title}
              >
                {content}
              </a>
            ) : (
              <Link className="about-topic-card" href={topic.href} prefetch={false} key={topic.title}>
                {content}
              </Link>
            )
          })}
        </div>
      </section>

      <section className="about-section">
        <SectionHeading index="03" title="关于博客" />
        <div className="about-blog-copy">
          <p className="about-blog-leadline">这个博客没什么明确的定位。</p>
          <p>
            我做了什么、最近在用什么、去了哪里、拍到什么，就顺手记下来。
            有些文章是在回答问题，有些只是把当时的想法留住。
          </p>
          <p>
            更新不会很勤，我也不打算追着热点跑。只希望过一段时间再回来，
            仍然知道自己为什么这样想、这样做。如果这些记录刚好也帮到你，那就更好了。
          </p>
        </div>
      </section>

      <section className="about-section about-section--last">
        <SectionHeading index="04" title="社交媒体" />
        <div>
          <div className="about-social-grid">
            {aboutSocialLinks.map((social) => {
              const Icon = socialIcons[social.icon]
              const mailLink = social.href.startsWith('mailto:')
              return (
                <a
                  href={social.href}
                  target={mailLink ? undefined : '_blank'}
                  rel={mailLink ? undefined : 'noopener noreferrer'}
                  key={social.label}
                >
                  <span className="about-social-copy">
                    <small>{social.label}</small>
                    <strong>{social.value}</strong>
                  </span>
                  <span
                    className={`about-social-icon about-social-icon--${social.icon}`}
                    aria-hidden="true"
                  >
                    <Icon />
                  </span>
                  <ArrowUpRight />
                </a>
              )
            })}
          </div>
          <p className="about-closing">
            如果你从搜索、朋友链接或某篇文章来到这里，
            希望这些文字能在某个具体又细小的地方帮到你。
          </p>
        </div>
      </section>
    </div>
  )
}

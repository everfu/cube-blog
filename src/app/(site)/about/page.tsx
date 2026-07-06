import { SectionDivider } from '@/components/common'
import { OptimizedImage } from '@/components/common/OptimizedImage'
import { siteConfig } from '@/config/site'
import { isQiniuImageUrl } from '@/lib/images/qiniu'
import { getHomeSections, mergeDefaultHomeSections, parseAboutMetadata } from '@/server/home/adapters/page'

export const metadata = {
  title: 'About',
  description: `关于 ${siteConfig.author.name}、这个博客，以及那些被慢慢整理下来的想法。`,
}

const aboutLinks = [
  {
    label: 'GitHub',
    value: siteConfig.social.github.replace(/^https?:\/\//, ''),
    href: siteConfig.social.github,
    icon: 'i-lucide-github',
  },
  {
    label: 'Twitter',
    value: siteConfig.social.twitter.replace(/^https?:\/\//, ''),
    href: siteConfig.social.twitter,
    icon: 'i-lucide-twitter',
  },
  {
    label: 'Email',
    value: siteConfig.author.email,
    href: `mailto:${siteConfig.author.email}`,
    icon: 'i-lucide-mail',
  },
]

function AboutSection({
  index,
  title,
  children,
}: {
  index: string
  title: string
  children: React.ReactNode
}) {
  return (
    <section>
      <h2 className="section-title">
        {index} / <span className="text-foreground">{title}</span>
      </h2>
      <SectionDivider />
      <div className="mx-4 my-8 md:mx-8">
        {children}
      </div>
    </section>
  )
}

function shouldUseUnoptimizedImage(src: string) {
  return !src.startsWith('/') && !isQiniuImageUrl(src)
}

async function getAboutVisualConfig() {
  const aboutSection = mergeDefaultHomeSections(await getHomeSections(), true)
    .find(section => section.key === 'about')

  if (!aboutSection?.enabled) return null

  return parseAboutMetadata(aboutSection.metadata)
}

export default async function AboutPage() {
  const aboutVisual = await getAboutVisualConfig()

  return (
    <div className="space-y-0">
      <AboutSection index="01" title="这个角落">
        <div className="space-y-6">
          <p className="font-serif text-base italic leading-8 text-muted md:text-lg">
            “把正在发生的想法，放到以后还能抵达的地方。”
          </p>
          {aboutVisual && (
            <figure className="about-visual group">
              <OptimizedImage
                src={aboutVisual.imageUrl}
                alt={aboutVisual.imageCaption}
                fill
                sizes="(max-width: 780px) calc(100vw - 4rem), 716px"
                qiniuQuality={82}
                unoptimized={shouldUseUnoptimizedImage(aboutVisual.imageUrl)}
                className="about-visual-image"
                priority
              />
              <figcaption className="about-visual-caption">
                {aboutVisual.imageCaption}
              </figcaption>
            </figure>
          )}
          <div className="space-y-4 text-sm leading-7 text-foreground/90">
            <p>
              这里是 {siteConfig.name}，一个用来安放想法、代码、工具和生活片段的个人空间。
              它不急着变成主题明确的站点，更像一张长期使用的工作台：有些记录已经归档，有些问题仍摊在手边。
            </p>
            <p>
              如果你从搜索、朋友链接或某篇文章来到这里，希望这些文字能在某个具体又细小的地方帮到你。
            </p>
          </div>
        </div>
      </AboutSection>

      <SectionDivider />

      <AboutSection index="02" title="关于我">
        <div className="space-y-4 text-sm leading-7 text-foreground/90">
          <p>
            我是 {siteConfig.author.name}。多数时候在互联网、代码和各种工具之间来回走动，也会把日常里一些暂时不好命名的感受写下来。
          </p>
          <p>
            我喜欢理解事物如何工作，也喜欢观察它们怎样影响人的习惯、情绪和判断。写作对我来说不是给事情下结论，而是给思考留一个可以回看的形状。
          </p>
        </div>
      </AboutSection>

      <SectionDivider />

      <AboutSection index="03" title="关于这个博客">
        <div className="space-y-6">
          <blockquote className="border-l border-border pl-4 font-serif text-sm italic leading-7 text-muted">
            它首先是一份给自己的记录，然后才是一次偶然的分享。
          </blockquote>
          <div className="space-y-4 text-sm leading-7 text-foreground/90">
            <p>
              这里会出现技术实践、设备和软件体验、照片、朋友链接，也会有一些更松散的生活记录。内容不刻意维持固定栏目，只希望在发布时足够清楚、足够诚实。
            </p>
            <p>
              我希望这个博客保持轻一点、慢一点：少一点包装，多一点真实的过程；少一点立刻正确的姿态，多一点以后还能追踪的上下文。
            </p>
          </div>
        </div>
      </AboutSection>

      <SectionDivider />

      <AboutSection index="04" title="其它地方">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
          {aboutLinks.map(link => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith('mailto:') || link.href.startsWith('/') ? undefined : '_blank'}
              rel={link.href.startsWith('mailto:') || link.href.startsWith('/') ? undefined : 'noopener noreferrer'}
              className="card group/link relative block min-h-24 overflow-hidden p-3 opacity-100 outline-none focus-visible:border-primary motion-reduce:transition-none"
            >
              <span className="flex h-full flex-col justify-between gap-3">
                <span className="flex items-center justify-between gap-2">
                  <span className="inline-flex h-7 w-7 flex-shrink-0 items-center justify-center border border-border bg-background text-muted transition-colors duration-300 group-hover/link:border-primary group-hover/link:text-foreground group-focus-visible/link:border-primary group-focus-visible/link:text-foreground">
                    <span className={`${link.icon} h-3.5 w-3.5`} aria-hidden="true" />
                  </span>
                  <span className="i-lucide-arrow-up-right h-3.5 w-3.5 flex-shrink-0 text-muted transition-colors duration-300 group-hover/link:text-foreground group-focus-visible/link:text-foreground" aria-hidden="true" />
                </span>

                <span className="min-w-0">
                  <span className="block font-mono text-xs uppercase tracking-wide text-muted">
                    {link.label}
                  </span>
                  <span className="mt-1 block truncate text-xs font-medium text-foreground transition-opacity group-hover/link:opacity-75 group-focus-visible/link:opacity-75">
                    {link.value}
                  </span>
                </span>
              </span>
            </a>
          ))}
        </div>
      </AboutSection>
    </div>
  )
}

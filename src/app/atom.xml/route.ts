import { getAllPosts, type PostMetadata } from '@/lib/posts'

export const dynamic = 'force-dynamic'

// Site Configuration
const CONFIG = {
  url: 'https://blog.efu.me',
  title: "Fuever'blog",
  description: 'A nook where thoughts & ideas sometimes echo',
  author: {
    name: 'Fuever',
    email: 'o@efu.me',
    uri: 'https://blog.efu.me',
  },
  avatar: '/mstile-150x150.png',
  favicon: '/favicon-32x32.png',
} as const

// XML escape helper
function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

// Build entry XML
function buildEntry(post: PostMetadata): string {
  const postUrl = `${CONFIG.url}/posts/${post.slug}`
  const pubDate = new Date(post.date).toISOString()

  const categories = [
    post.category ? `<category term="${escapeXml(post.category)}"/>` : '',
    ...(post.tags?.map((tag: string) => `<category term="${escapeXml(tag)}"/>`) || []),
  ].filter(Boolean).join('\n    ')

  return `
  <entry>
    <title><![CDATA[${post.title}]]></title>
    <link href="${postUrl}" rel="alternate" type="text/html"/>
    <id>${postUrl}</id>
    <published>${pubDate}</published>
    <updated>${pubDate}</updated>
    <author>
      <name>${escapeXml(CONFIG.author.name)}</name>
    </author>
    <summary type="html"><![CDATA[${post.excerpt || ''}]]></summary>${post.cover ? `\n    <cover>${escapeXml(post.cover)}</cover>` : ''}${categories ? `\n    ${categories}` : ''}
  </entry>`
}

// Build feed XML
function buildFeed(posts: PostMetadata[]): string {
  const currentYear = new Date().getFullYear()
  const lastUpdated = posts.length > 0 
    ? new Date(posts[0].date).toISOString() 
    : new Date().toISOString()

  const entries = posts.map(buildEntry).join('')

  return `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/atom.xsl"?>
<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="zh-CN">
  <title>${escapeXml(CONFIG.title)}</title>
  <subtitle>${escapeXml(CONFIG.description)}</subtitle>
  <link href="${CONFIG.url}/atom.xml" rel="self" type="application/atom+xml"/>
  <link href="${CONFIG.url}" rel="alternate" type="text/html"/>
  <id>${CONFIG.url}/</id>
  <updated>${lastUpdated}</updated>
  <author>
    <name>${escapeXml(CONFIG.author.name)}</name>${CONFIG.author.email ? `\n    <email>${escapeXml(CONFIG.author.email)}</email>` : ''}
    <uri>${CONFIG.author.uri}</uri>
  </author>
  <icon>${CONFIG.url}${CONFIG.favicon}</icon>
  <logo>${CONFIG.url}${CONFIG.avatar}</logo>
  <rights>© 2022 - ${currentYear} ${escapeXml(CONFIG.author.name)}</rights>
  <generator uri="https://nextjs.org">Next.js</generator>${entries}
</feed>`
}

export async function GET() {
  const posts = getAllPosts()
  const atom = buildFeed(posts)

  return new Response(atom, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}

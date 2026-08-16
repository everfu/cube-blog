import { XMLBuilder } from 'fast-xml-parser'
import { friendGroups } from '@/data/links'
import { site } from '@/data/site'
import type { PostSnapshot } from '@/features/posts/types'

const builder = new XMLBuilder({
  attributeNamePrefix: '@_',
  cdataPropName: '#cdata',
  format: true,
  ignoreAttributes: false,
  suppressEmptyNode: true,
})

const siteStartedAt = '2022-01-01'

function absoluteUrl(path: string) {
  return new URL(path, site.url).href
}

function toIsoDate(date: string) {
  const normalized = date.replaceAll('.', '-')
  return `${normalized}T00:00:00+08:00`
}

function escapeHtmlAttribute(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

function renderPreviewContent(post: PostSnapshot) {
  const parts = [
    post.cover
      ? `<img src="${escapeHtmlAttribute(absoluteUrl(post.cover))}" alt="${escapeHtmlAttribute(post.title)}" />`
      : '',
    post.excerpt ? `<p>${post.excerpt}</p>` : '',
    `<p><a class="view-full" href="${absoluteUrl(post.href)}">阅读全文</a></p>`,
  ]

  return parts.filter(Boolean).join('')
}

export function buildAtomFeed(posts: PostSnapshot[]) {
  const entries = [...posts]
    .sort((left, right) => right.date.localeCompare(left.date))
    .map(post => ({
      id: absoluteUrl(post.href),
      title: post.title,
      link: {
        '@_href': absoluteUrl(post.href),
        '@_rel': 'alternate',
        '@_type': 'text/html',
      },
      published: toIsoDate(post.date),
      updated: toIsoDate(post.date),
      author: { name: site.author },
      summary: {
        '@_type': 'html',
        '#cdata': post.excerpt,
      },
      content: {
        '@_type': 'html',
        '#cdata': renderPreviewContent(post),
      },
      category: { '@_term': post.category },
    }))

  return builder.build({
    '?xml': { '@_version': '1.0', '@_encoding': 'UTF-8' },
    '?xml-stylesheet': { '@_type': 'text/xsl', '@_href': '/atom.xsl' },
    feed: {
      '@_xmlns': 'http://www.w3.org/2005/Atom',
      '@_xml:lang': 'zh-CN',
      id: absoluteUrl('/'),
      title: site.name,
      subtitle: site.description,
      updated: entries[0]?.updated ?? toIsoDate(siteStartedAt),
      author: {
        name: site.author,
        email: site.email,
        uri: site.homepage,
      },
      link: [
        { '@_href': absoluteUrl('/atom.xml'), '@_rel': 'self', '@_type': 'application/atom+xml' },
        { '@_href': absoluteUrl('/'), '@_rel': 'alternate', '@_type': 'text/html' },
      ],
      icon: absoluteUrl('/favicon-32x32.ico'),
      logo: absoluteUrl(site.avatar),
      rights: `© 2022 - ${new Date().getFullYear()} ${site.author}`,
      generator: {
        '@_uri': 'https://nextjs.org',
        '#text': 'Next.js',
      },
      entry: entries,
    },
  })
}

export function buildOpml() {
  const friendFeeds = friendGroups
    .flatMap(group => group.links)
    .filter((friend): friend is typeof friend & { feed: string } => Boolean(friend.feed))

  const dates = friendFeeds.map(friend => friend.date.replaceAll('.', '-')).sort()
  const dateModified = dates.at(-1) ?? siteStartedAt
  const outlines = [
    {
      '@_text': site.name,
      '@_title': site.name,
      '@_type': 'rss',
      '@_xmlUrl': absoluteUrl('/atom.xml'),
      '@_htmlUrl': site.url,
      '@_created': toIsoDate(siteStartedAt),
      '@_description': site.description,
    },
    ...friendFeeds.map(friend => ({
      '@_text': friend.name,
      '@_title': friend.name,
      '@_type': 'rss',
      '@_xmlUrl': friend.feed,
      '@_htmlUrl': friend.href,
      '@_created': toIsoDate(friend.date),
      '@_description': friend.description,
    })),
  ]

  return builder.build({
    '?xml': { '@_version': '1.0', '@_encoding': 'UTF-8' },
    opml: {
      '@_version': '2.0',
      head: {
        title: `${site.name} 的友链订阅`,
        dateCreated: toIsoDate(siteStartedAt),
        dateModified: toIsoDate(dateModified),
        ownerName: site.author,
        ownerEmail: site.email,
        ownerId: site.homepage,
        docs: 'https://opml.org/spec2.opml',
      },
      body: { outline: outlines },
    },
  })
}

export function createDocumentResponse(
  body: string,
  filename: string,
  contentType: string,
) {
  return new Response(body, {
    headers: {
      'Content-Type': `${contentType}; charset=utf-8`,
      'Content-Disposition': `inline; filename="${filename}"`,
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      'Content-Language': 'zh-CN',
      'X-Content-Type-Options': 'nosniff',
    },
  })
}

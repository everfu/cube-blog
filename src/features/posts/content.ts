import { readFile, readdir } from 'node:fs/promises'
import { join } from 'node:path'
import { cache } from 'react'
import { z } from 'zod'
import { extractArticleHeadings, normalizeArticleMarkdown } from '@/features/posts/markdown'
import type { PostSnapshot } from '@/features/posts/types'

const metaSchema = z.object({
  id: z.string(), title: z.string(), excerpt: z.string(), date: z.string(),
  year: z.string(), slug: z.string(), category: z.string(), cover: z.string(),
})

const postsDir = join(process.cwd(), 'content', 'posts')

function parsePost(source: string): PostSnapshot {
  const match = source.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
  if (!match) throw new Error('Invalid post snapshot')
  const metadata = Object.fromEntries(match[1].split('\n').map(line => {
    const index = line.indexOf(':')
    const key = line.slice(0, index).trim()
    const raw = line.slice(index + 1).trim()
    return [key, JSON.parse(raw)]
  }))
  const meta = metaSchema.parse(metadata)
  const content = normalizeArticleMarkdown(match[2].trim())
  const headings = extractArticleHeadings(content)
  return { ...meta, content, headings, href: `/${meta.year}/${meta.slug}/` }
}

export const getAllPosts = cache(async function getAllPosts() {
  const files = (await readdir(postsDir)).filter(file => file.endsWith('.mdx'))
  const posts = await Promise.all(files.map(async file => parsePost(await readFile(join(postsDir, file), 'utf8'))))
  return posts.sort((a, b) => b.date.localeCompare(a.date))
})

export async function getPost(year: string, slug: string) {
  const posts = await getAllPosts()
  return posts.find(post => post.year === year && post.slug === slug) ?? null
}

export function formatPostDate(date: string) {
  return date.replaceAll('-', '/')
}

export function readingMinutes(content: string) {
  return Math.max(1, Math.ceil(content.replace(/\s+/g, '').length / 450))
}

import type { MetadataRoute } from 'next'
import { site } from '@/data/site'
import { getAllPosts } from '@/features/posts/content'

const staticRoutes = [
  { path: '/', changeFrequency: 'daily', priority: 1 },
  { path: '/posts/', changeFrequency: 'daily', priority: 0.9 },
  { path: '/album/', changeFrequency: 'weekly', priority: 0.7 },
  { path: '/stack/', changeFrequency: 'weekly', priority: 0.7 },
  { path: '/friends/', changeFrequency: 'daily', priority: 0.7 },
  { path: '/links/', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/about/', changeFrequency: 'monthly', priority: 0.6 },
] as const

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts()
  const pages = staticRoutes.map(route => ({
    url: new URL(route.path, site.url).href,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }))
  const articles = posts.map(post => ({
    url: new URL(post.href, site.url).href,
    lastModified: new Date(`${post.date}T00:00:00+08:00`),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  return [...pages, ...articles]
}

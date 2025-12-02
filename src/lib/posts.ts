import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const postsDirectory = path.join(process.cwd(), 'content/posts')

export interface Post {
  slug: string
  title: string
  date: string
  excerpt: string
  tags?: string[]
  cover?: string
  category?: string
  content: string
}

export interface PostMetadata {
  slug: string
  title: string
  date: string
  excerpt: string
  tags?: string[]
  cover?: string
  category?: string
  recent?: boolean
}

export function getAllPosts(): PostMetadata[] {
  // Create directory if it doesn't exist
  if (!fs.existsSync(postsDirectory)) {
    return []
  }

  const fileNames = fs.readdirSync(postsDirectory)
  const allPosts = fileNames
    .filter((fileName) => {
      // 只包含 .md 或 .mdx 文件，排除 README
      const isMarkdown = fileName.endsWith('.md') || fileName.endsWith('.mdx')
      const isNotReadme = !fileName.toLowerCase().startsWith('readme')
      return isMarkdown && isNotReadme
    })
    .map((fileName) => {
      const slug = fileName.replace(/\.(md|mdx)$/, '')
      const fullPath = path.join(postsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data, content } = matter(fileContents)

      return {
        slug,
        title: data.title || slug,
        date: data.date || new Date().toISOString(),
        excerpt: data.excerpt || content.slice(0, 150) + '...',
        tags: data.tags || [],
        cover: data.cover,
        category: data.category || 'DAILY',
        recent: data.recent || false,
      }
    })

  // Sort posts by date
  return allPosts.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })
}

export function getPostBySlug(slug: string): Post | null {
  try {
    // Try .mdx first, then .md
    let fullPath = path.join(postsDirectory, `${slug}.mdx`)
    if (!fs.existsSync(fullPath)) {
      fullPath = path.join(postsDirectory, `${slug}.md`)
    }
    
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)

    return {
      slug,
      title: data.title || slug,
      date: data.date || new Date().toISOString(),
      excerpt: data.excerpt || content.slice(0, 150) + '...',
      tags: data.tags || [],
      cover: data.cover,
      category: data.category || 'DAILY',
      content,
    }
  } catch {
    return null
  }
}

export function getPostPath(slug: string): string | null {
  const mdxPath = path.join(postsDirectory, `${slug}.mdx`)
  const mdPath = path.join(postsDirectory, `${slug}.md`)
  
  if (fs.existsSync(mdxPath)) {
    return mdxPath
  }
  if (fs.existsSync(mdPath)) {
    return mdPath
  }
  
  return null
}

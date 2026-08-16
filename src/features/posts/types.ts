export interface ArticleHeading {
  id: string
  text: string
  level: 2 | 3 | 4
}

export interface PostSnapshot {
  id: string
  title: string
  excerpt: string
  date: string
  year: string
  slug: string
  category: string
  cover: string
  content: string
  headings: ArticleHeading[]
  href: string
}

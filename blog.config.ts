export const siteConfig = {
  // 基本信息
  name: "Fuever's Blog",
  title: "Fuever's Blog",
  description: 'A nook where thoughts & ideas sometimes echo',
  url: 'https://blog.efu.me',
  locale: 'zh-CN',

  // 作者信息
  author: {
    name: 'Fuever',
    email: 'o@efu.me',
    url: 'https://efu.me',
  },

  // 社交链接
  social: {
    github: 'https://github.com/everfu',
    twitter: 'https://twitter.com/everfu8',
  },

  // 资源路径
  assets: {
    favicon: '/favicon-32x32.ico',
    appleTouchIcon: '/apple-touch-icon.png',
    ogImage: '/og-image.png',
    avatar: '/mstile-150x150.png',
  },

  // 版权信息
  copyright: {
    startYear: 2022,
  },

  // 统计信息（可选，用于首页展示）
  stats: {
    repositories: 18,
    stars: 1106,
  },
} as const

export type SiteConfig = typeof siteConfig

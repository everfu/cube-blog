export const site = {
  name: "伍拾柒的博客",
  description: 'A nook where thoughts & ideas sometimes echo',
  url: 'https://blog.efu.me',
  author: '伍拾柒',
  email: 'o@efu.me',
  homepage: 'https://efu.me',
  bluesky: 'https://bsky.app/profile/everfu.bsky.social',
  github: 'https://github.com/everfu',
  twitter: 'https://twitter.com/everfu8',
  avatar: '/mstile-150x150.png',
} as const

export const navigation = [
  { href: '/', label: '首页' },
  { href: '/posts/', label: '文章' },
  { href: '/album/', label: '相册' },
  { href: '/friends/', label: '动态' },
  { href: '/links/', label: '友链' },
  { href: '/about/', label: '关于' },
] as const

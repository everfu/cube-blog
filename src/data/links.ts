import type { FriendGroup, FriendLink } from '@/features/friends/types'

export const friendGroups: FriendGroup[] = [
  {
    name: '推荐',
    description: '都是大佬，推荐关注',
    links: [
      {
        name: '阮一峰的网络日志',
        author: '阮一峰',
        description: '科技观察与思考，每周五更新',
        href: 'https://www.ruanyifeng.com/blog/',
        date: '2024.01.29',
        feed: 'https://www.ruanyifeng.com/blog/atom.xml',
        tags: ['Cloudflare'],
      },
      {
        name: 'Antfu',
        author: 'Antfu',
        description: '前端开发与开源实践',
        href: 'https://antfu.me/',
        date: '2024.01.29',
        feed: 'https://antfu.me/feed.xml',
        tags: ['Vue', 'Vercel'],
      },
    ],
  },
  {
    name: '挚交好友',
    description: '这里记录了我的挚交好友',
    links: [
      {
        name: '青桔气球',
        author: '青桔气球',
        description: '分享网络安全与科技生活',
        href: 'https://blog.qjqq.cn/',
        date: '2024.01.29',
      },
      {
        name: '爱吃肉的猫',
        author: '亦封',
        description: '有肉有猫有生活.',
        href: 'https://meuicat.com/',
        date: '2024.01.29',
      },
      {
        name: 'isYangs',
        author: 'isYangs',
        description: '一个前端 Bug 构造师的博客',
        href: 'https://isyangs.cn',
        date: '2024.01.29',
        feed: 'https://isyangs.cn/atom.xml',
        quiet: true,
        tags: ['Vue', 'Vercel'],
      },
      {
        name: '纸鹿摸鱼处',
        author: '纸鹿',
        description: '记录工作与生活的小想法',
        href: 'https://blog.zhilu.site/',
        date: '2024.01.29',
        feed: 'https://blog.zhilu.site/atom.xml',
        tags: ['Nuxt', 'Vercel'],
      },
    ],
  },
  {
    name: '冲浪好友',
    description: '这里记录了在冲浪时关注的好友',
    links: [
      {
        name: 'Mo的记事簿',
        author: 'Mo',
        description: '产品、设计与日常记录',
        href: 'https://blog.xiowo.net/',
        date: '2026.06.02',
        feed: 'https://blog.xiowo.net/atom.xml',
        tags: ['Hexo', 'Vercel'],
      },
      {
        name: 'Frederick',
        author: 'Frederick',
        description: 'Frederick 的博客，记录生活点滴',
        href: 'https://ooowl.net/',
        date: '2026.06.02',
      },
    ],
  },
]

export const friendFeedSources = friendGroups
  .flatMap(group => group.links)
  .filter((link): link is FriendLink & { feed: string } => Boolean(link.feed) && link.quiet !== true)

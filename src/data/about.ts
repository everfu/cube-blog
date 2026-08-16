import { site } from '@/data/site'

export const aboutTopics = [
  {
    label: 'MAKE',
    title: '做东西',
    description: '开源、网站，以及那些值得被做得更简单的工具。',
    href: site.github,
    icon: 'code',
    imageLight: '/media/about/make-background-light.webp',
    imageDark: '/media/about/make-background.webp',
    external: true,
  },
  {
    label: 'WRITE',
    title: '写博客',
    description: '技术实践、学习笔记，以及暂时不好命名的生活感受。',
    href: '/posts/',
    icon: 'write',
    imageLight: '/media/about/write-background-light.webp',
    imageDark: '/media/about/write-background.webp',
    external: false,
  },
  {
    label: 'CAPTURE',
    title: '记录生活',
    description: '用照片、旅行和纪录片保存具体而普通的日常。',
    href: '/album/',
    icon: 'camera',
    imageLight: '/media/about/capture-background-light.webp',
    imageDark: '/media/about/capture-background.webp',
    external: false,
  },
  {
    label: 'TOOLS',
    title: '工具与习惯',
    description: '长期使用、愿意推荐，或仍在认真了解的设备与软件。',
    href: '/stack/',
    icon: 'tools',
    imageLight: '/media/about/tools-background-light.webp',
    imageDark: '/media/about/tools-background.webp',
    external: false,
  },
] as const

export const aboutSocialLinks = [
  { label: 'Bluesky', value: '@everfu.bsky.social', href: site.bluesky, icon: 'bluesky' },
  { label: 'GitHub', value: site.github.replace(/^https?:\/\//, ''), href: site.github, icon: 'github' },
  { label: 'Twitter', value: '@everfu8', href: site.twitter, icon: 'twitter' },
  { label: 'Email', value: site.email, href: `mailto:${site.email}`, icon: 'mail' },
] as const

import type { SoftwareCategory } from '@/types'

export type { SoftwareItem, SoftwareCategory } from '@/types'

export const softwareCategories: SoftwareCategory[] = [
  {
    name: 'Design',
    items: [
      {
        name: 'Sketch',
        icon: 'i-logos-sketch',
        description: '一款仅Mac端的矢量设计工具。',
        url: 'https://www.sketch.com/',
        recommended: true,
      },
      {
        name: 'Adobe XD',
        icon: 'i-logos-adobe-xd',
        description: 'Adobe 的设计工具。',
        url: 'https://www.adobe.com/hk_zh/products/xd.html',
      },
      {
        name: 'Illustrator',
        icon: 'i-logos-adobe-illustrator',
        description: 'Adobe 的矢量软件。',
        url: 'https://www.adobe.com/hk_zh/products/illustrator.html',
      },
      {
        name: 'Photoshop',
        icon: 'i-logos-adobe-photoshop',
        description: 'Adobe提供的强大图像处理软件。',
        url: 'https://www.adobe.com/hk_zh/products/photoshop.html',
      },
    ],
  },
  {
    name: 'Mind',
    items: [
      {
        name: 'Xmind',
        icon: 'i-flat-color-icons-mind-map',
        description: '一款思维导图软件。',
        url: 'https://xmind.com/',
      },
      {
        name: 'Visio',
        icon: 'i-logos-microsoft',
        description: '一款流程图软件。',
        url: 'https://www.microsoft.com/en-us/microsoft-365/visio',
      }
    ]
  },
  {
    name: 'Development & Tools',
    items: [
      {
        name: 'Visual Studio Code',
        icon: 'i-logos-visual-studio-code',
        description: '微软的代码编辑软件。',
        url: 'https://code.visualstudio.com/',
      },
      {
        name: 'Copilot',
        icon: 'i-logos-github-octocat',
        description: 'Github 的 AI 助手。',
        url: 'https://github.com/features/copilot',
        recommended: true,
      },
      {
        name: 'Wechat Mini Program',
        icon: 'i-icon-park-weixin-mini-app',
        description: '微信小程序开发工具。',
        url: 'https://mp.weixin.qq.com/',
      },
      {
        name: 'Google Chrome',
        icon: 'i-logos-chrome',
        description: 'Google 的浏览器，插件丰富。',
        url: 'https://www.google.com/chrome/',
      },
      {
        name: 'Obsidian',
        icon: 'i-logos-obsidian',
        description: '知识管理笔记类软件。',
        url: 'https://obsidian.md/',
      },
    ],
  },
  {
    name: 'Entertainment',
    items: [
      {
        name: 'Bilibili',
        icon: 'i-simple-icons-bilibili',
        description: '哔哩哔哩。',
        url: 'https://www.bilibili.com/',
      },
      {
        name: 'Youtube',
        icon: 'i-logos-youtube-icon',
        description: 'Google 的视频软件。',
        url: 'https://youtube.com',
      },
      {
        name: 'Netflix',
        icon: 'i-logos-netflix',
        description: '海外流媒体视频软件。',
        url: 'https://netflix.com/',
        recommended: true,
      },
      {
        name: 'Telegram',
        icon: 'i-logos-telegram',
        description: '著名的跨平台即时通讯软件。',
        url: 'https://telegram.org/',
      },
      {
        name: 'Spotify',
        icon: 'i-logos-spotify',
        description: '音乐软件。',
        url: 'https://www.spotify.com/',
      }
    ],
  },
]


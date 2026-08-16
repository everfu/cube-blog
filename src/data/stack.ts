interface StackItem {
  name: string
  description: string
  href: string
  recommended?: boolean
}

interface StackGroup {
  name: string
  items: StackItem[]
}

export const hardware: StackItem[] = [
  { name: 'iPhone 13 mini', description: '手机', href: 'https://www.apple.com/iphone/' },
  { name: 'MacBook Pro 2022 M2', description: '电脑', href: 'https://www.apple.com/macbook-pro/' },
  { name: 'AirPods Pro（第二代）', description: '耳机', href: 'https://www.apple.com/airpods-pro/' },
  { name: 'PΛNDΛER Real Bag', description: '双肩包', href: 'https://detail.meizu.com/item/realbag.html?skuId=22925' },
]

export const software: StackGroup[] = [
  { name: 'Design', items: [
    { name: 'Sketch', description: '一款仅 Mac 端的矢量设计工具。', href: 'https://www.sketch.com/', recommended: true },
    { name: 'Adobe XD', description: 'Adobe 的设计工具。', href: 'https://www.adobe.com/hk_zh/products/xd.html' },
    { name: 'Illustrator', description: 'Adobe 的矢量软件。', href: 'https://www.adobe.com/hk_zh/products/illustrator.html' },
    { name: 'Photoshop', description: 'Adobe 提供的强大图像处理软件。', href: 'https://www.adobe.com/hk_zh/products/photoshop.html' },
  ] },
  { name: 'Mind', items: [
    { name: 'Notion', description: '集笔记、数据库、看板等功能于一体的生产力工具。', href: 'https://www.notion.so/', recommended: true },
  ] },
  { name: 'Development & Tools', items: [
    { name: 'Visual Studio Code', description: '微软的代码编辑软件。', href: 'https://code.visualstudio.com/' },
    { name: 'Codex', description: 'OpenAI 的代码协作工具。', href: 'https://openai.com/codex/' },
    { name: 'Android Studio', description: 'Google 的 Android 开发工具。', href: 'https://developer.android.com/studio' },
    { name: 'Xcode', description: 'Apple 的开发工具，主要用于 iOS 开发。', href: 'https://developer.apple.com/xcode/' },
    { name: '微信小程序开发工具', description: '微信小程序开发工具。', href: 'https://mp.weixin.qq.com/' },
    { name: 'Google Chrome', description: 'Google 的浏览器，插件丰富。', href: 'https://www.google.com/chrome/' },
  ] },
  { name: 'Entertainment', items: [
    { name: 'Bilibili', description: '哔哩哔哩。', href: 'https://www.bilibili.com/' },
    { name: 'YouTube', description: 'Google 的视频平台。', href: 'https://youtube.com' },
    { name: 'Netflix', description: '海外流媒体视频服务。', href: 'https://netflix.com/', recommended: true },
    { name: 'Telegram', description: '跨平台即时通讯软件。', href: 'https://telegram.org/' },
    { name: 'Spotify', description: '音乐软件。', href: 'https://www.spotify.com/' },
  ] },
]

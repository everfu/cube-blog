# 伍拾柒的博客

一个个人博客，用来整理技术实践、生活记录、照片、朋友动态与长期使用的工具。

[访问博客](https://blog.efu.me) · [订阅 Atom](https://blog.efu.me/atom.xml) · [导出友链 OPML](https://blog.efu.me/efu.opml)

## 项目特点

- 文章以 MDX 文件保存在仓库中，构建和阅读不依赖数据库。
- 首页、相册、友链、关于页和装备清单均由本地 TypeScript 数据驱动。
- 朋友动态在服务端聚合公开的 RSS/Atom Feed，并保留每个来源的读取状态。
- 站内图片统一处理响应式尺寸、现代格式和模糊占位，可选接入七牛云图片处理。
- 自动生成 Atom、OPML、Sitemap 和站点元数据。
- 支持浅色与深色主题，并适配桌面端和移动端。

## 页面与公开接口

| 路径 | 内容 |
| --- | --- |
| `/` | 首页、近期文章、相册精选与最近观看 |
| `/posts/` | 全部文章 |
| `/:year/:slug/` | MDX 文章详情 |
| `/album/` | 本地相册 |
| `/friends/` | 实时聚合的朋友动态 |
| `/links/` | 友情链接与订阅源 |
| `/about/` | 个人与博客介绍 |
| `/stack/` | 设备和软件清单 |
| `/api/friends/` | 只读的朋友动态 JSON 接口 |
| `/atom.xml` | 博客 Atom Feed |
| `/efu.opml`、`/feeds.opml` | 友链订阅 OPML |
| `/sitemap.xml` | 站点地图 |

## 技术栈

- Next.js 16（App Router）
- React 19
- TypeScript 5.9
- `next-mdx-remote` + `remark-gfm`
- `fast-xml-parser`
- Sharp
- pnpm 9

## 本地开发

环境要求：Node.js 20.9 或更高版本、pnpm 9。

```bash
pnpm install
pnpm dev
```

打开 <http://localhost:3000> 查看网站。普通开发和构建不会从线上同步文章，也不需要配置数据库或登录系统。

## 常用命令

| 命令 | 用途 |
| --- | --- |
| `pnpm dev` | 启动开发服务器 |
| `pnpm check` | 依次执行类型检查和 ESLint |
| `pnpm build` | 生成图片元数据并创建生产构建 |
| `pnpm start` | 启动生产服务器 |
| `pnpm images:generate` | 更新本地图片尺寸和模糊预览清单 |
| `pnpm snapshot:content` | 从线上博客重新生成文章与封面快照 |

提交改动前建议至少运行：

```bash
pnpm check
pnpm build
```

## 内容维护

项目内容分散在几个职责明确的目录中：

```text
content/posts/          文章 MDX 快照
public/media/           文章封面、相册及页面图片
src/data/site.ts        站点信息、作者信息与导航
src/data/links.ts       友链、Feed 与免打扰设置
src/data/album.ts       相册分组和照片说明
src/data/about.ts       关于页主题与社交链接
src/data/home.ts        首页的最近观看内容
src/data/stack.ts       设备和软件清单
```

文章文件需要包含以下 frontmatter：

```mdx
---
id: "post-id"
title: "文章标题"
excerpt: "文章摘要"
date: "2026-08-16"
year: "2026"
slug: "article-slug"
category: "TECH"
cover: "/media/posts/article-cover.jpg"
---
```

### 更新文章快照

```bash
pnpm snapshot:content
```

该命令会访问 `https://blog.efu.me`，从 Sitemap 中读取文章，转换为本地 MDX，并下载文章封面到 `public/media/posts/`。它只会在人工执行时联网；运行前请确认本机已安装 Chrome 或 Chromium，也可以通过 `CHROME_PATH` 指定浏览器可执行文件。

同步完成后会自动更新图片元数据。直接新增或替换本地图片时，可单独运行 `pnpm images:generate`。

## 朋友动态

`src/data/links.ts` 中配置了 `feed` 且未设置 `quiet: true` 的友链会进入朋友动态聚合：

- 每个来源最多读取 10 条，最终按时间合并为最多 100 条。
- 单个 Feed 的请求超时为 8 秒，失败不会阻塞其他来源。
- 服务端聚合结果缓存 5 分钟，避免频繁请求外部站点。
- `/api/friends/` 在所有来源均失败且没有可用缓存时返回 `502`。

因此，生产环境必须支持 Next.js Node.js 服务端运行时，不能部署为完全静态导出。

## 图片配置

默认使用 Next.js 本地图片优化，无需环境变量。若要让 `/media/**` 使用七牛云图片处理，可以设置：

```bash
NEXT_PUBLIC_IMAGE_PROVIDER=qiniu
NEXT_PUBLIC_IMAGE_CDN_ORIGIN=https://cdn.example.com
NEXT_PUBLIC_QINIU_IMAGE_HOSTS=cdn.example.com,images.example.com
```

- `NEXT_PUBLIC_IMAGE_CDN_ORIGIN`：将站内 `/media/**` 地址映射到指定 CDN。
- `NEXT_PUBLIC_QINIU_IMAGE_HOSTS`：允许使用七牛 `imageView2` 的外部图片域名，多个域名以逗号分隔。
- 未设置变量或将 `NEXT_PUBLIC_IMAGE_PROVIDER` 设为 `local` 时，不改写公开图片地址。
- GIF、SVG 和已经包含七牛处理参数的图片不会被重复转换。

这些变量只控制公开图片地址和展示参数；项目不负责私有桶签名或文件上传。

## 项目结构

```text
src/app/                页面、布局、元数据和 HTTP 路由
src/components/         跨页面通用组件
src/features/           文章、相册、友链、Feed 和图片功能
src/data/               本地站点内容配置
src/styles/             全局及分区样式
content/                文章内容与快照记录
public/                 图标、媒体和其他静态资源
scripts/                内容快照与图片元数据脚本
```

## 部署

项目可以部署到 Vercel，或任何支持 Next.js Node.js 服务端运行时的平台。部署前运行 `pnpm check` 和 `pnpm build`；如未使用七牛云图片处理，无需配置环境变量。

朋友动态会在运行时访问第三方 Feed，部署环境需要允许出站网络请求。

## License

[MIT](./LICENSE)

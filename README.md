# Cube Blog

A modern, minimalist personal blog built with Next.js 16 and UnoCSS.

## Features

- ✨ Clean, minimalist design
- 📝 MDX support with syntax highlighting (Shiki)
- 🎨 Atomic CSS with UnoCSS
- 🚀 Next.js 16 App Router
- 📱 Fully responsive
- 💬 Real-time online presence (Liveblocks)
- 🖼️ Photo album with lightbox
- � RSS feed (Atom)
- 🗺️ Auto-generated sitemap

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/)
- **Styling**: [UnoCSS](https://unocss.dev/)
- **Content**: MDX with [next-mdx-remote](https://github.com/hashicorp/next-mdx-remote) + [gray-matter](https://github.com/jonschlinkert/gray-matter)
- **Syntax Highlighting**: [Shiki](https://shiki.style/)
- **Icons**: [Lucide](https://lucide.dev/) via @unocss/preset-icons
- **Real-time**: [Liveblocks](https://liveblocks.io/)
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 9+

### Installation

```bash
pnpm install
```

### Environment Variables

Copy `.env.example` to `.env.local` and configure:

```bash
NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY=your_liveblocks_public_key
```

### Development

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the blog.

### Build

```bash
pnpm build
pnpm start
```

## Project Structure

```
cube-blog/
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── layout.tsx    # Root layout
│   │   ├── page.tsx      # Home page
│   │   ├── posts/        # Blog posts
│   │   ├── stack/        # Tech stack page
│   │   ├── album/        # Photo album
│   │   ├── atom.xml/     # RSS feed
│   │   └── sitemap.ts    # Sitemap generator
│   ├── components/       # React components
│   ├── data/             # Static data
│   ├── lib/              # Utilities
│   └── types/            # TypeScript types
├── content/
│   └── posts/            # Markdown/MDX posts
├── blog.config.ts        # Site configuration
├── uno.config.ts         # UnoCSS configuration
└── next.config.js        # Next.js configuration
```

## Configuration

Edit `blog.config.ts` to customize site info:

```typescript
export const siteConfig = {
  name: "Your Blog Name",
  title: "Your Blog Title",
  description: "Your blog description",
  url: "https://your-domain.com",
  author: {
    name: "Your Name",
    email: "you@example.com",
  },
  // ...
}
```

## Writing Posts

Create a new `.mdx` file in `content/posts/`:

```markdown
---
title: "Your Post Title"
date: "2024-11-30"
excerpt: "A brief description"
tags: ["tag1", "tag2"]
---

Your content here with **MDX** support...
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import on [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy

### Other Platforms

Compatible with Netlify, Cloudflare Pages, AWS Amplify, or self-hosted.

## License

[MIT](./LICENSE)

## Credit

Thank you design by [suss.me](https://suus.me).
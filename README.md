# Fuever's Blog

A modern, minimalist blog built with Next.js and UnoCSS, inspired by [suus.me](https://suus.me/).

## Features

- ✨ Modern and clean design
- 📝 Markdown/MDX support for blog posts
- 🎨 Styled with UnoCSS (atomic CSS)
- 🚀 Built with Next.js 14 (App Router)
- 📱 Fully responsive
- ⚡️ Fast and optimized
- 🔍 SEO friendly

## Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/)
- **Styling**: [UnoCSS](https://unocss.dev/)
- **Content**: Markdown with [gray-matter](https://github.com/jonschlinkert/gray-matter) and [next-mdx-remote](https://github.com/hashicorp/next-mdx-remote)
- **Icons**: [Lucide Icons](https://lucide.dev/) via UnoCSS preset
- **Language**: TypeScript

## Getting Started

### Installation

```bash
# Install dependencies
npm install
# or
pnpm install
# or
yarn install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the blog.

### Build

```bash
npm run build
npm run start
```

## Project Structure

```
blog.efu.me/
├── src/
│   ├── app/              # Next.js app router pages
│   │   ├── layout.tsx    # Root layout
│   │   ├── page.tsx      # Home page
│   │   ├── posts/        # Blog posts pages
│   │   ├── about/        # About page
│   │   ├── stack/        # Tech stack page
│   │   └── album/        # Photo album page
│   ├── components/       # React components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── PostCard.tsx
│   └── lib/              # Utility functions
│       └── posts.ts      # Blog post utilities
├── content/
│   └── posts/            # Markdown blog posts
├── uno.config.ts         # UnoCSS configuration
├── next.config.js        # Next.js configuration
└── tsconfig.json         # TypeScript configuration
```

## Writing Blog Posts

Create a new `.md` file in `content/posts/`:

```markdown
---
title: "Your Post Title"
date: "2024-11-30"
excerpt: "A brief description of your post"
tags: ["tag1", "tag2"]
---

# Your Post Title

Your content here...
```

## Customization

### Colors

Edit `uno.config.ts` to customize the color scheme:

```typescript
theme: {
  colors: {
    primary: '#000000',
    secondary: '#666666',
    accent: '#0066cc',
    // ...
  }
}
```

### Content

- Update personal information in `src/app/about/page.tsx`
- Modify tech stack in `src/app/stack/page.tsx`
- Customize navigation in `src/components/Header.tsx`

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Deploy with one click

### Other Platforms

The blog can be deployed to any platform that supports Next.js:

- Netlify
- Cloudflare Pages
- AWS Amplify
- Self-hosted

## License

[MIT](./LICENSE)

## Acknowledgments

Design inspired by [suus.me](https://suus.me/)

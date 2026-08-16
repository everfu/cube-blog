import { createHash } from 'node:crypto'
import { access, mkdir, writeFile } from 'node:fs/promises'
import { extname, join } from 'node:path'
import { chromium } from 'playwright-core'

const origin = 'https://blog.efu.me'
const root = process.cwd()
const postsDir = join(root, 'content', 'posts')
const mediaDir = join(root, 'public', 'media', 'posts')
const manifestPath = join(root, 'content', 'snapshot-manifest.json')
const chromeCandidates = [
  process.env.CHROME_PATH,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
].filter(Boolean)

async function resolveChrome() {
  for (const candidate of chromeCandidates) {
    try {
      await access(candidate)
      return candidate
    } catch {}
  }
  return undefined
}

function escapeFrontmatter(value) {
  return JSON.stringify(String(value ?? ''))
}

function cleanUrl(value) {
  return value ? new URL(value, origin).href.replace(/\?.*$/, '') : ''
}

async function download(url, outputBase) {
  if (!url) return null
  const source = cleanUrl(url)
  const suffix = extname(new URL(source).pathname).toLowerCase() || '.jpg'
  const extension = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'].includes(suffix) ? suffix : '.jpg'
  const filename = `${outputBase}${extension}`
  const destination = join(mediaDir, filename)
  const response = await fetch(source)
  if (!response.ok) throw new Error(`Failed to download ${source}: ${response.status}`)
  await writeFile(destination, Buffer.from(await response.arrayBuffer()))
  return `/media/posts/${filename}`
}

async function main() {
  await mkdir(postsDir, { recursive: true })
  await mkdir(mediaDir, { recursive: true })
  const sitemap = await (await fetch(`${origin}/sitemap.xml`)).text()
  const urls = [...sitemap.matchAll(/<loc>([^<]+\/[0-9]{4}\/[^<]+)<\/loc>/g)].map(match => match[1])
  const browser = await chromium.launch({ headless: true, executablePath: await resolveChrome() })
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  const manifest = { source: origin, capturedAt: new Date().toISOString(), posts: [], failures: [] }

  for (const url of urls) {
    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 60_000 })
      const snapshot = await page.evaluate(() => {
        const main = document.querySelector('main')
        const article = main?.querySelector('article > div')
        const heading = main?.querySelector('h1')
        const paragraphs = main ? [...main.querySelectorAll('#article-header p, h1 + p')] : []
        const cover = main?.querySelector('#article-header img') || main?.querySelector('img')
        const text = main?.innerText || ''
        const date = text.match(/20\d{2}-\d{2}-\d{2}/)?.[0] || ''
        const category = [...(main?.querySelectorAll('#article-header span') || [])]
          .map(node => node.textContent?.trim() || '')
          .find(value => /^(TECH|DAILY)$/i.test(value)) || 'NOTE'

        function md(node) {
          if (node.nodeType === Node.TEXT_NODE) return node.textContent || ''
          if (!(node instanceof HTMLElement)) return ''
          const tag = node.tagName.toLowerCase()
          if (tag === 'button' || node.classList.contains('post-reactions')) return ''
          const children = [...node.childNodes].map(md).join('')
          if (tag === 'h2') return `\n\n## ${node.textContent?.trim()}\n\n`
          if (tag === 'h3') return `\n\n### ${node.textContent?.trim()}\n\n`
          if (tag === 'p') return `\n\n${children.trim()}\n\n`
          if (tag === 'strong' || tag === 'b') return `**${children.trim()}**`
          if (tag === 'em' || tag === 'i') return `*${children.trim()}*`
          if (tag === 'code' && node.parentElement?.tagName !== 'PRE') return `\`${node.textContent}\``
          if (tag === 'pre') return `\n\n\`\`\`\n${node.textContent?.trim()}\n\`\`\`\n\n`
          if (tag === 'a') return `[${children.trim()}](${node.getAttribute('href') || '#'})`
          if (tag === 'blockquote') return `\n\n${(node.textContent || '').split('\n').map(line => `> ${line}`).join('\n')}\n\n`
          if (tag === 'table') {
            const rows = [...node.querySelectorAll('tr')].map(row => [...row.querySelectorAll('th,td')].map(cell => (cell.textContent || '').trim().replace(/\|/g, '\\|')))
            if (!rows.length) return ''
            const width = Math.max(...rows.map(row => row.length))
            const normalized = rows.map(row => [...row, ...Array(width - row.length).fill('')])
            return `\n\n| ${normalized[0].join(' | ')} |\n| ${Array(width).fill('---').join(' | ')} |\n${normalized.slice(1).map(row => `| ${row.join(' | ')} |`).join('\n')}\n\n`
          }
          if (tag === 'li') return `${children.trim()}\n`
          if (tag === 'ul') return `\n${[...node.children].map(child => `- ${md(child).trim()}`).join('\n')}\n`
          if (tag === 'ol') return `\n${[...node.children].map((child, index) => `${index + 1}. ${md(child).trim()}`).join('\n')}\n`
          return children
        }

        return {
          title: heading?.textContent?.trim() || document.title.split('|')[0].trim(),
          excerpt: paragraphs.at(-1)?.textContent?.trim() || '',
          date,
          category,
          cover: cover instanceof HTMLImageElement ? (cover.currentSrc || cover.src) : '',
          markdown: article ? md(article).replace(/\n{3,}/g, '\n\n').trim() : '',
          headings: article ? [...article.querySelectorAll('h2,h3')].map(node => node.textContent?.trim() || '') : [],
        }
      })
      const parsed = new URL(url)
      const [year, slug] = parsed.pathname.split('/').filter(Boolean)
      const cover = await download(snapshot.cover, `${year}-${slug}`)
      const id = createHash('sha1').update(url).digest('hex').slice(0, 12)
      const frontmatter = [
        '---',
        `id: ${escapeFrontmatter(id)}`,
        `title: ${escapeFrontmatter(snapshot.title)}`,
        `excerpt: ${escapeFrontmatter(snapshot.excerpt)}`,
        `date: ${escapeFrontmatter(snapshot.date)}`,
        `year: ${escapeFrontmatter(year)}`,
        `slug: ${escapeFrontmatter(slug)}`,
        `category: ${escapeFrontmatter(snapshot.category)}`,
        `cover: ${escapeFrontmatter(cover || '')}`,
        '---',
        '',
      ].join('\n')
      await writeFile(join(postsDir, `${year}-${slug}.mdx`), `${frontmatter}${snapshot.markdown}\n`)
      manifest.posts.push({ url, file: `content/posts/${year}-${slug}.mdx`, cover, headings: snapshot.headings })
      process.stdout.write(`snapshotted ${year}/${slug}\n`)
    } catch (error) {
      manifest.failures.push({ url, error: String(error) })
      process.stderr.write(`failed ${url}: ${error}\n`)
    }
  }

  await browser.close()
  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`)
  if (manifest.failures.length) process.exitCode = 1
}

main().catch(error => {
  console.error(error)
  process.exitCode = 1
})

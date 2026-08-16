import { readdir, readFile, writeFile } from 'node:fs/promises'
import { extname, join, relative, sep } from 'node:path'
import sharp from 'sharp'

const root = process.cwd()
const publicDir = join(root, 'public')
const outputPath = join(root, 'src', 'features', 'images', 'image-manifest.generated.ts')
const supportedExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif'])

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = await Promise.all(entries.map(async (entry) => {
    const path = join(directory, entry.name)
    return entry.isDirectory() ? walk(path) : [path]
  }))
  return files.flat()
}

function publicPath(file) {
  return `/${relative(publicDir, file).split(sep).join('/')}`
}

async function metadataFor(file) {
  const image = sharp(file, { animated: false }).rotate()
  const metadata = await image.metadata()
  if (!metadata.width || !metadata.height) throw new Error(`Missing dimensions for ${file}`)

  const preview = await image
    .clone()
    .resize({ width: 10, height: 10, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 35, effort: 4 })
    .toBuffer()

  const oriented = metadata.autoOrient ?? metadata
  return {
    width: oriented.width,
    height: oriented.height,
    blurDataURL: `data:image/webp;base64,${preview.toString('base64')}`,
  }
}

async function main() {
  const files = (await walk(publicDir))
    .filter(file => supportedExtensions.has(extname(file).toLowerCase()))
    .sort((left, right) => publicPath(left).localeCompare(publicPath(right)))
  const manifest = Object.fromEntries(await Promise.all(files.map(async file => [publicPath(file), await metadataFor(file)])))
  const source = [
    "import type { LocalImageMetadata } from '@/features/images/types'",
    '',
    `export const generatedImageManifest: Record<string, LocalImageMetadata> = ${JSON.stringify(manifest, null, 2)}`,
    '',
  ].join('\n')

  let current = ''
  try {
    current = await readFile(outputPath, 'utf8')
  } catch {}

  if (current !== source) await writeFile(outputPath, source)
  process.stdout.write(`Generated metadata for ${files.length} images.\n`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})

import type { ImageLoaderProps } from 'next/image'
import type { ImageVariantOptions } from '@/features/images/types'

const TRANSFORMED_IMAGE_PATTERN = /(?:^|[?&|])(?:imageView2|imageMogr2)\//i
const UNTRANSFORMED_FORMAT_PATTERN = /\.(?:gif|svg)(?:[?#].*)?$/i
const NEXT_IMAGE_WIDTHS = [32, 48, 64, 96, 128, 256, 384, 640, 750, 828, 1080, 1200, 1600, 1920, 2400]

function clampInteger(value: number | undefined, fallback: number, minimum: number, maximum: number) {
  if (typeof value !== 'number' || !Number.isFinite(value)) return fallback
  return Math.min(maximum, Math.max(minimum, Math.round(value)))
}

function normalizeOrigin(value: string | undefined) {
  const origin = value?.trim().replace(/\/+$/, '')
  if (!origin) return ''

  try {
    const url = new URL(origin)
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.origin + url.pathname.replace(/\/+$/, '') : ''
  } catch {
    return ''
  }
}

function configuredQiniuHosts() {
  const hosts = (process.env.NEXT_PUBLIC_QINIU_IMAGE_HOSTS || '')
    .split(',')
    .map(host => host.trim().toLowerCase())
    .filter(Boolean)
  const origin = normalizeOrigin(process.env.NEXT_PUBLIC_IMAGE_CDN_ORIGIN)
  if (origin) hosts.push(new URL(origin).hostname.toLowerCase())
  return new Set(hosts)
}

function isQiniuEnabled() {
  return process.env.NEXT_PUBLIC_IMAGE_PROVIDER?.trim().toLowerCase() === 'qiniu'
}

function isAbsoluteHttpUrl(src: string) {
  try {
    const url = new URL(src)
    return url.protocol === 'https:' || url.protocol === 'http:'
  } catch {
    return false
  }
}

export function isAnimatedOrVectorImage(src: string) {
  return UNTRANSFORMED_FORMAT_PATTERN.test(src)
}

export function isQiniuManagedSource(src: string) {
  if (!isQiniuEnabled() || isAnimatedOrVectorImage(src) || TRANSFORMED_IMAGE_PATTERN.test(src)) return false

  if (src.startsWith('/')) {
    return Boolean(normalizeOrigin(process.env.NEXT_PUBLIC_IMAGE_CDN_ORIGIN))
  }

  if (!isAbsoluteHttpUrl(src)) return false
  return configuredQiniuHosts().has(new URL(src).hostname.toLowerCase())
}

export function resolveQiniuSource(src: string) {
  if (!src.startsWith('/')) return src
  const origin = normalizeOrigin(process.env.NEXT_PUBLIC_IMAGE_CDN_ORIGIN)
  return origin ? `${origin}${src}` : src
}

export function getQiniuImageUrl(src: string, options: ImageVariantOptions = {}) {
  if (!isQiniuManagedSource(src)) return src

  const width = clampInteger(options.width, options.preview ? 12 : 1200, 1, 9999)
  const height = options.height ? clampInteger(options.height, 1, 1, 9999) : undefined
  const quality = clampInteger(options.quality, options.preview ? 30 : 82, 1, 100)
  const mode = options.fit === 'cover' && height ? 1 : 2
  const parts = ['imageView2', String(mode), 'w', String(width)]

  if (height) parts.push('h', String(height))
  parts.push('format', 'webp', 'q', String(quality), 'ignore-error', '1')

  const source = resolveQiniuSource(src)
  return `${source}${source.includes('?') ? '&' : '?'}${parts.join('/')}`
}

export function qiniuImageLoader({ src, width, quality }: ImageLoaderProps) {
  return getQiniuImageUrl(src, { width, quality, fit: 'contain' })
}

export function getImagePreloadUrl(src: string, options: ImageVariantOptions = {}) {
  const width = clampInteger(options.width, 1600, 32, 2400)
  const quality = clampInteger(options.quality, 90, 1, 100)

  if (isQiniuManagedSource(src)) return getQiniuImageUrl(src, { ...options, width, quality })
  if (!src.startsWith('/') || isAnimatedOrVectorImage(src)) return src

  const nextWidth = NEXT_IMAGE_WIDTHS.find(candidate => candidate >= width) ?? NEXT_IMAGE_WIDTHS.at(-1)!
  return `/_next/image?url=${encodeURIComponent(src)}&w=${nextWidth}&q=${quality}`
}

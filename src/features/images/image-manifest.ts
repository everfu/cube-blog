import { generatedImageManifest } from '@/features/images/image-manifest.generated'

export function getLocalImageMetadata(src: string) {
  return src.startsWith('/') ? generatedImageManifest[src] : undefined
}

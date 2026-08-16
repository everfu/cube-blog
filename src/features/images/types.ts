export type ImageIntent = 'avatar' | 'thumbnail' | 'cover' | 'content' | 'lightbox'

export type ImageFit = 'cover' | 'contain'

export type ImageFailureMode = 'placeholder' | 'hide'

export interface ImageVariantOptions {
  width?: number
  height?: number
  quality?: number
  fit?: ImageFit
  preview?: boolean
}

export interface LocalImageMetadata {
  width: number
  height: number
  blurDataURL: string
}

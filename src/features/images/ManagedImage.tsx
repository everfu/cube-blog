'use client'

import Image, { type ImageProps } from 'next/image'
import { useEffect, useId, useRef, useState, type CSSProperties, type MouseEventHandler, type ReactNode } from 'react'
import { getLocalImageMetadata } from '@/features/images/image-manifest'
import { useImageRevealCoordinator } from '@/features/images/ImageRevealProvider'
import { getQiniuImageUrl, isAnimatedOrVectorImage, isQiniuManagedSource } from '@/features/images/qiniu'
import type { ImageFailureMode, ImageFit, ImageIntent } from '@/features/images/types'

const INTENT_QUALITY: Record<ImageIntent, 45 | 75 | 82 | 90> = {
  avatar: 75,
  thumbnail: 45,
  cover: 75,
  content: 82,
  lightbox: 90,
}

type ManagedImageProps = {
  src: string
  alt: string
  className?: string
  imageClassName?: string
  width?: number
  height?: number
  fill?: boolean
  sizes?: string
  intent?: ImageIntent
  fit?: ImageFit
  quality?: 45 | 75 | 82 | 90
  loading?: 'eager' | 'lazy'
  fetchPriority?: 'high' | 'low' | 'auto'
  decoding?: 'async' | 'sync' | 'auto'
  failureMode?: ImageFailureMode
  deferUntilVisible?: boolean
  fallbackLabel?: string
  onError?: () => void
  onClick?: MouseEventHandler<HTMLImageElement>
  style?: CSSProperties
}

function placeholderStyle(src: string, blurDataURL?: string) {
  const preview = blurDataURL || (isQiniuManagedSource(src)
    ? getQiniuImageUrl(src, { width: 12, quality: 45, fit: 'contain', preview: true })
    : '')

  if (!preview) return undefined
  return { '--managed-image-placeholder': `url("${preview.replaceAll('"', '%22')}")` } as CSSProperties
}

export function ManagedImage({
  src,
  alt,
  className = '',
  imageClassName = '',
  width,
  height,
  fill = false,
  sizes,
  intent = 'content',
  fit = 'cover',
  quality = INTENT_QUALITY[intent],
  loading = 'lazy',
  fetchPriority = 'auto',
  decoding = 'async',
  failureMode = 'placeholder',
  deferUntilVisible = false,
  fallbackLabel = '图片暂时无法显示',
  onError,
  onClick,
  style,
}: ManagedImageProps) {
  const metadata = getLocalImageMetadata(src)
  const resolvedWidth = width ?? metadata?.width
  const resolvedHeight = height ?? metadata?.height
  const wrapperRef = useRef<HTMLSpanElement>(null)
  const revealId = useId()
  const revealCoordinator = useImageRevealCoordinator()
  const [loadedSource, setLoadedSource] = useState<string | null>(null)
  const [failedSource, setFailedSource] = useState<string | null>(null)
  const [revealedSource, setRevealedSource] = useState<string | null>(null)
  const [visibleSource, setVisibleSource] = useState<string | null>(
    deferUntilVisible && loading === 'lazy' ? null : src,
  )
  const isLocal = src.startsWith('/')
  const isQiniu = isQiniuManagedSource(src)
  const canUseNextImage = isLocal || isQiniu
  const loaded = loadedSource === src
  const failed = failedSource === src
  const sequenceReveal = revealCoordinator !== null && intent !== 'lightbox'
  const revealed = !sequenceReveal || revealedSource === src
  const shouldRenderImage = !deferUntilVisible || loading !== 'lazy' || visibleSource === src
  const wrapperStyle = {
    ...placeholderStyle(src, metadata?.blurDataURL),
    ...style,
  }

  useEffect(() => {
    if (!deferUntilVisible || loading !== 'lazy') {
      setVisibleSource(src)
      return
    }

    const element = wrapperRef.current
    if (!element || typeof IntersectionObserver === 'undefined') {
      setVisibleSource(src)
      return
    }

    const observer = new IntersectionObserver((entries) => {
      if (!entries.some(entry => entry.isIntersecting)) return
      setVisibleSource(src)
      observer.disconnect()
    }, {
      rootMargin: '240px 0px',
      threshold: 0.01,
    })

    observer.observe(element)
    return () => observer.disconnect()
  }, [deferUntilVisible, loading, src])

  useEffect(() => {
    const element = wrapperRef.current
    if (!revealCoordinator || !element || intent === 'lightbox') return

    revealCoordinator.register(revealId, element, setRevealedSource)
    return () => revealCoordinator.unregister(revealId)
  }, [intent, revealCoordinator, revealId, src])

  useEffect(() => {
    if (!revealCoordinator || intent === 'lightbox') return
    revealCoordinator.update(revealId, src, loaded, failed)
  }, [failed, intent, loaded, revealCoordinator, revealId, src])

  function handleLoad() {
    setLoadedSource(src)
  }

  function handleError() {
    setFailedSource(src)
    onError?.()
  }

  if (failed && failureMode === 'hide') return null

  const stateClassName = [
    'managed-image',
    `managed-image--${fit}`,
    `managed-image--${intent}`,
    loaded && revealed ? 'is-loaded' : '',
    failed ? 'is-failed' : '',
    shouldRenderImage ? '' : 'is-deferred',
    className,
  ].filter(Boolean).join(' ')

  const imageClassNames = ['managed-image__media', imageClassName].filter(Boolean).join(' ')
  const commonProps = {
    className: imageClassNames,
    loading,
    fetchPriority,
    decoding,
    onLoad: handleLoad,
    onError: handleError,
    onClick,
  } as const

  let image: ReactNode = null
  if (shouldRenderImage && canUseNextImage && (fill || (resolvedWidth && resolvedHeight))) {
    const loader = isQiniu
      ? ({ src: loaderSrc, width: loaderWidth, quality: loaderQuality }: Parameters<NonNullable<ImageProps['loader']>>[0]) => {
          const loaderHeight = fit === 'cover' && resolvedWidth && resolvedHeight
            ? Math.round(loaderWidth * resolvedHeight / resolvedWidth)
            : undefined
          return getQiniuImageUrl(loaderSrc, {
            width: loaderWidth,
            height: loaderHeight,
            quality: loaderQuality,
            fit,
          })
        }
      : undefined
    const nextImageProps: ImageProps = {
      ...commonProps,
      src,
      alt,
      sizes,
      quality,
      fill: fill || undefined,
      width: fill ? undefined : resolvedWidth,
      height: fill ? undefined : resolvedHeight,
      loader,
      unoptimized: isAnimatedOrVectorImage(src),
    }
    image = <Image {...nextImageProps} alt={alt} />
  } else if (shouldRenderImage) {
    image = (
      // Third-party feed and avatar images intentionally bypass the Next.js proxy.
      <img
        {...commonProps}
        src={src}
        alt={alt}
        width={resolvedWidth}
        height={resolvedHeight}
        sizes={sizes}
      />
    )
  }

  return (
    <span ref={wrapperRef} className={stateClassName} style={wrapperStyle}>
      {image}
      {failed && failureMode === 'placeholder' ? (
        <span className="managed-image__fallback" aria-hidden="true">
          <span aria-hidden="true">◇</span>
          {alt ? <small>{fallbackLabel}</small> : null}
        </span>
      ) : null}
    </span>
  )
}

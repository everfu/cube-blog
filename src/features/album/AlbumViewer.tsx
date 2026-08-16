'use client'

import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { AlbumCollection } from '@/features/album/types'
import { getImagePreloadUrl, ManagedImage } from '@/features/images'

const focusableSelector = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

export function AlbumViewer({ album, onClose }: { album: AlbumCollection; onClose: () => void }) {
  const [activePhotoIndex, setActivePhotoIndex] = useState(0)
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const activePhoto = album.photos[activePhotoIndex]

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    const previousPaddingRight = document.body.style.paddingRight
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth

    document.body.style.overflow = 'hidden'
    if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`
    window.requestAnimationFrame(() => closeButtonRef.current?.focus())

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        setActivePhotoIndex(current => (current - 1 + album.photos.length) % album.photos.length)
        return
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault()
        setActivePhotoIndex(current => (current + 1) % album.photos.length)
        return
      }

      if (event.key !== 'Tab' || !dialogRef.current) return
      const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(focusableSelector))
      if (focusable.length === 0) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.body.style.paddingRight = previousPaddingRight
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [album.photos.length, onClose])

  useEffect(() => {
    if (album.photos.length < 2) return

    const previous = (activePhotoIndex - 1 + album.photos.length) % album.photos.length
    const next = (activePhotoIndex + 1) % album.photos.length
    ;[previous, next].forEach((index) => {
      const image = new window.Image()
      image.decoding = 'async'
      image.src = getImagePreloadUrl(album.photos[index].src, { width: 1600, quality: 90, fit: 'contain' })
    })
  }, [activePhotoIndex, album.photos])

  if (!activePhoto) return null

  return (
    <div
      ref={dialogRef}
      className="album-viewer"
      role="dialog"
      aria-modal="true"
      aria-labelledby="album-viewer-title"
      onClick={event => event.target === event.currentTarget && onClose()}
    >
      <div className="album-viewer-shell">
        <header className="album-viewer-head">
          <div>
            <span>{album.photos.length} 张照片</span>
            <h2 id="album-viewer-title">{album.name}</h2>
          </div>
          <button ref={closeButtonRef} type="button" onClick={onClose} aria-label="关闭相册">
            <X aria-hidden="true" />
          </button>
        </header>

        <div className="album-viewer-stage">
          {album.photos.length > 1 ? (
            <button
              type="button"
              className="album-viewer-arrow album-viewer-arrow--previous"
              onClick={() => setActivePhotoIndex(current => (current - 1 + album.photos.length) % album.photos.length)}
              aria-label="上一张照片"
            >
              <ChevronLeft aria-hidden="true" />
            </button>
          ) : null}

          <figure>
            <div className="album-viewer-image">
              <ManagedImage
                key={activePhoto.src}
                src={activePhoto.src}
                alt={activePhoto.alt}
                className="album-viewer-main-image"
                sizes="(max-width: 780px) calc(100vw - 120px), 1200px"
                intent="lightbox"
                fit="contain"
                loading="eager"
              />
            </div>
            <figcaption>
              <div>
                <strong>{activePhoto.alt}</strong>
                {activePhoto.note ? <span>{activePhoto.note}</span> : null}
              </div>
              <span>第 {activePhotoIndex + 1} / {album.photos.length} 张</span>
            </figcaption>
          </figure>

          {album.photos.length > 1 ? (
            <button
              type="button"
              className="album-viewer-arrow album-viewer-arrow--next"
              onClick={() => setActivePhotoIndex(current => (current + 1) % album.photos.length)}
              aria-label="下一张照片"
            >
              <ChevronRight aria-hidden="true" />
            </button>
          ) : null}
        </div>

        <div className="album-thumbnails" aria-label="照片缩略图">
          {album.photos.map((item, index) => (
            <button
              key={item.src}
              type="button"
              className={index === activePhotoIndex ? 'active' : ''}
              aria-label={`查看第 ${index + 1} 张：${item.alt}`}
              aria-pressed={index === activePhotoIndex}
              onClick={() => setActivePhotoIndex(index)}
            >
              <ManagedImage
                src={item.src}
                alt=""
                className="album-thumbnail-image"
                fill
                width={152}
                height={112}
                sizes="76px"
                intent="thumbnail"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

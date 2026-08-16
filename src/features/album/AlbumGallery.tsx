'use client'

import { useCallback, useRef, useState } from 'react'
import { AlbumViewer } from '@/features/album/AlbumViewer'
import type { AlbumCollection } from '@/features/album/types'
import { ManagedImage } from '@/features/images'

export function AlbumGallery({ albums }: { albums: AlbumCollection[] }) {
  const availableAlbums = albums.filter(album => album.photos.length > 0)
  const pendingAlbums = albums.filter(album => album.photos.length === 0)
  const [activeAlbum, setActiveAlbum] = useState<AlbumCollection | null>(null)
  const triggerRef = useRef<HTMLButtonElement | null>(null)

  const closeViewer = useCallback(() => {
    const trigger = triggerRef.current
    setActiveAlbum(null)
    window.requestAnimationFrame(() => trigger?.focus())
  }, [])

  function openViewer(album: AlbumCollection, trigger: HTMLButtonElement) {
    triggerRef.current = trigger
    setActiveAlbum(album)
  }

  return (
    <div className="album-content">
      <div className="album-grid">
        {availableAlbums.map((album, index) => (
          <button
            key={album.name}
            type="button"
            className="album-card"
            aria-haspopup="dialog"
            onClick={event => openViewer(album, event.currentTarget)}
          >
            <ManagedImage
              src={album.photos[0]?.src ?? album.cover}
              alt=""
              className="album-card-image"
              fill
              width={600}
              height={780}
              sizes="(max-width: 780px) calc(100vw - 56px), 50vw"
              intent="cover"
              loading={index === 0 ? 'eager' : 'lazy'}
              fetchPriority={index === 0 ? 'high' : 'auto'}
            />
            <span className="album-shade" />
            <span className="album-index">相册 {String(index + 1).padStart(2, '0')}</span>
            <strong>{album.name}</strong>
            <small>{album.photos.length} 张照片 · 打开相册</small>
          </button>
        ))}
      </div>

      {pendingAlbums.length > 0 ? (
        <section className="pending-albums" aria-labelledby="pending-albums-title">
          <header className="pending-albums-head">
            <div>
              <span>Coming soon</span>
              <h2 id="pending-albums-title">仍在收集中</h2>
            </div>
            <p>新的照片加入后，这些分类会在这里开放。</p>
          </header>
          <div className="pending-albums-list">
            {pendingAlbums.map(album => (
              <article key={album.name}>
                <ManagedImage
                  src={album.cover}
                  alt=""
                  className="pending-album-image"
                  fill
                  width={152}
                  height={116}
                  sizes="76px"
                  intent="thumbnail"
                />
                <div><strong>{album.name}</strong><span>筹备中</span></div>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {activeAlbum ? (
        <AlbumViewer key={activeAlbum.name} album={activeAlbum} onClose={closeViewer} />
      ) : null}
    </div>
  )
}

'use client'

import React, { useState, useEffect } from 'react'
import type { AlbumCategory } from '@/types'
import Lightbox from 'yet-another-react-lightbox'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'
import 'yet-another-react-lightbox/styles.css'

interface AlbumDetailProps {
  category: AlbumCategory | null
  onClose: () => void
}

interface Photo {
  label?: string
  image: string
  date: string
}

export default function AlbumDetail({ category, onClose }: AlbumDetailProps) {
  const [selectedYear, setSelectedYear] = useState('全部')
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const [animationKey, setAnimationKey] = useState(0)

  // 关闭时的过渡动画
  const handleClose = () => {
    if (isClosing) return
    setIsClosing(true)
    setIsVisible(false)
    setTimeout(() => {
      onClose()
    }, 300)
  }

  // 入场动画 & ESC 键监听
  useEffect(() => {
    if (category) {
      document.body.style.overflow = 'hidden'
      // 延迟触发入场动画
      requestAnimationFrame(() => {
        setIsVisible(true)
      })

      // ESC 键关闭
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && !lightboxOpen) {
          handleClose()
        }
      }
      document.addEventListener('keydown', handleKeyDown)
      return () => {
        document.body.style.overflow = 'unset'
        document.removeEventListener('keydown', handleKeyDown)
      }
    }
  }, [category, lightboxOpen])

  if (!category) return null

  // 从 category.list 获取照片数据
  const photos = category.list || []

  // 获取所有年份
  const allYears = [...new Set(photos.map(p => p.date.split('-')[0]))].sort((a, b) => Number(b) - Number(a))
  const years = ['全部', ...allYears]

  const filteredPhotos = selectedYear === '全部' 
    ? photos 
    : photos.filter(p => p.date.startsWith(selectedYear))

  return (
    <>
      {/* 全屏遮罩 */}
      <div 
        className={`fixed inset-0 bg-black/90 z-50 overflow-y-auto transition-opacity duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={(e) => {
          if (e.target === e.currentTarget) handleClose()
        }}
      >
        <div className={`mx-auto px-4 md:px-8 py-6 transition-all duration-300 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          {/* 头部：标题和关闭按钮 */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-white">{category.label}</h2>
            <button
              onClick={handleClose}
              className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors text-2xl text-white/80 hover:text-white"
              aria-label="关闭"
            >
              ×
            </button>
          </div>

          {/* 年份筛选 */}
          {years.length > 1 && (
            <div className="flex gap-2 mb-6">
              {years.map((year) => (
                <button
                  key={year}
                  onClick={() => {
                    setSelectedYear(year)
                    setAnimationKey(prev => prev + 1)
                  }}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                    selectedYear === year
                      ? 'bg-white/20 text-white border border-white/30'
                      : 'bg-transparent text-white/60 border border-white/10 hover:text-white hover:border-white/30'
                  }`}
                >
                  {year}
                </button>
              ))}
            </div>
          )}

          {/* 图片网格 */}
          <div key={animationKey} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {filteredPhotos.map((photo, index) => (
              <div 
                key={index} 
                className="group cursor-pointer animate-photo-pop"
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={() => {
                  setLightboxIndex(index)
                  setLightboxOpen(true)
                }}
              >
                <div className="relative aspect-[4/3] bg-white/5 overflow-hidden">
                  <img
                    src={photo.image}
                    alt={photo.label || ''}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* 左下角文字 */}
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
                    {photo.label && <p className="text-white text-xs font-medium truncate">{photo.label}</p>}
                    <p className="text-white/60 text-[10px]">{photo.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 空状态 */}
          {filteredPhotos.length === 0 && (
            <div className="text-center py-20">
              <p className="text-white/50">暂无照片</p>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox 图片预览 */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={filteredPhotos.map(photo => ({
          src: photo.image,
          alt: photo.label || '',
          title: photo.label,
          description: photo.date,
        }))}
        plugins={[Zoom]}
        animation={{ fade: 300, swipe: 300 }}
        carousel={{ finite: filteredPhotos.length <= 1 }}
        controller={{ closeOnBackdropClick: true }}
        styles={{
          container: { backgroundColor: 'rgba(0, 0, 0, 0.95)' },
        }}
        zoom={{
          maxZoomPixelRatio: 3,
          scrollToZoom: true,
        }}
      />
    </>
  )
}


'use client'

import { useState } from 'react'
import { SectionDivider } from '@/components/common'
import { AlbumCard, AlbumDetail } from '@/components/album'
import { albumCategories, albumLastUpdated } from '@/data/album'
import { formatDistanceToNow } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import type { AlbumCategory } from '@/types'

export default function AlbumPage() {
  const [selectedCategory, setSelectedCategory] = useState<AlbumCategory | null>(null)
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null)
  
  const timeAgo = formatDistanceToNow(new Date(albumLastUpdated), { addSuffix: true, locale: zhCN })

  const handleCardClick = (category: AlbumCategory) => {
    setSelectedCategory(category)
  }

  const handleClose = () => {
    setSelectedCategory(null)
  }

  return (
    <div className="space-y-0">
      {/* 01 / ALBUM */}
      <section>
        <h2 className="section-title">
          01 / <span className="text-foreground">ALBUM</span>
          <span className="text-muted text-sm font-normal ml-2">(⏱ {timeAgo})</span>
        </h2>
        <SectionDivider />
        
        <div className="mx-4 md:mx-8 my-8">
          <p className="text-sm text-muted leading-relaxed">
            记录生活中的美好瞬间，用镜头捕捉时光的痕迹。这里收藏着我的日常留影，分为日常、风景、人物、美食、旅行等不同主题。每一张照片都承载着独特的故事和回忆。
          </p>
        </div>
      </section>

      <SectionDivider />

      {/* 相册分类网格 */}
      <section>
        <div 
          className="grid grid-cols-2 gap-4 mx-4 md:mx-8 my-8"
          onMouseLeave={() => setHoveredCategory(null)}
        >
          {albumCategories.map((category) => (
            <AlbumCard 
              key={category.name} 
              category={category}
              onClick={() => handleCardClick(category)}
              onHover={() => setHoveredCategory(category.name)}
              isBlurred={hoveredCategory !== null && hoveredCategory !== category.name}
            />
          ))}
        </div>
      </section>

      {/* 详情弹窗 */}
      {selectedCategory && (
        <AlbumDetail category={selectedCategory} onClose={handleClose} />
      )}
    </div>
  )
}

import type { AlbumCollection } from '@/features/album/types'

export const albums: AlbumCollection[] = [
  { name: 'Daily', cover: '/media/album/daily.jpg', photos: [] },
  { name: 'Landscape', cover: '/media/album/landscape.jpg', photos: [] },
  {
    name: 'Portrait',
    cover: '/media/album/portrait.jpg',
    photos: [
      { src: '/media/album/portrait-1.jpg', alt: '四兄弟' },
      { src: '/media/album/portrait-2.jpg', alt: '朋友合照' },
      { src: '/media/album/portrait-3.jpg', alt: '朋友合照' },
      { src: '/media/album/portrait-4.jpg', alt: '演讲' },
      { src: '/media/album/portrait-5.jpg', alt: '橘子洲头' },
    ],
  },
  { name: 'Food', cover: '/media/album/food.jpg', photos: [] },
  {
    name: 'Travel',
    cover: '/media/album/travel.jpg',
    photos: [
      { src: '/media/album/travel-1.jpg', alt: '鄱阳湖畔', note: 'OnePlus Ace 5 · 2025-09-30 18:15' },
      { src: '/media/album/travel-2.jpg', alt: '武功山' },
    ],
  },
]

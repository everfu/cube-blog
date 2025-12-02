import type { AlbumCategory } from '@/types'

export type { AlbumCategory, AlbumPhoto } from '@/types'

// 相册最后更新日期
export const albumLastUpdated = '2024-12-14'

export const albumCategories: AlbumCategory[] = [
  {
    name: 'daily',
    label: 'DAILY',
    image: 'https://cdn.lightxi.com/cloudreve/uploads/2025/12/02/znXNlPOB_photo-1506905925346-21bda4d32df4.jpeg',
    list: [
      {
        label: '青年马拉松',
        image: 'https://cdn.lightxi.com/cloudreve/uploads/2025/12/02/s95FquSV_167CB093-6394-4F16-9378-B2978F7F6994_1_105_c.jpeg',
        date: '2024-12-14'
      }
    ]
  },
  {
    name: 'landscape',
    label: 'LANDSCAPE',
    image: 'https://cdn.lightxi.com/cloudreve/uploads/2025/12/02/TqvUXcGi_photo-1501594907352-04cda38ebc29.jpeg',
  },
  {
    name: 'portrait',
    label: 'PORTRAIT',
    image: 'https://cdn.lightxi.com/cloudreve/uploads/2025/12/02/ikUprqQG_photo-1441974231531-c6227db76b6e.jpeg',
  },
  {
    name: 'food',
    label: 'FOOD',
    image: 'https://cdn.lightxi.com/cloudreve/uploads/2025/12/02/4bluhWPO_photo-1504674900247-0877df9cc836.jpeg',
  },
  {
    name: 'travel',
    label: 'TRAVEL',
    image: 'https://cdn.lightxi.com/cloudreve/uploads/2025/12/02/JkyZ5FzL_photo-1469854523086-cc02fe5d8800.jpeg',
  },
]


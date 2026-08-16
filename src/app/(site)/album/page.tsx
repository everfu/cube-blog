import { PageIntro } from '@/components/PageIntro'
import { albums } from '@/data/album'
import { AlbumGallery } from '@/features/album/AlbumGallery'

export const metadata = { title: '相册', description: '镜头留下的生活片段' }

export default function AlbumPage() {
  return (
    <>
      <PageIntro
        title="镜头把时间留在原地。"
        description="日常、风景、人物、美食与旅行。每一张照片都承载着一段可以重新抵达的记忆。"
      />
      <AlbumGallery albums={albums} />
    </>
  )
}

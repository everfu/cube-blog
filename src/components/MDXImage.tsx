'use client'

import { useState } from 'react'
import Image from 'next/image'
import Lightbox from 'yet-another-react-lightbox'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'
import 'yet-another-react-lightbox/styles.css'

interface MDXImageProps {
  src: string
  alt?: string
}

export default function MDXImage({ src, alt }: MDXImageProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <span className="block my-6">
        <Image 
          src={src} 
          alt={alt || ''} 
          width={800} 
          height={400} 
          className="w-full h-auto border border-border cursor-zoom-in hover:opacity-90 transition-opacity"
          onClick={() => setOpen(true)}
        />
        {alt && (
          <span className="block text-center text-xs text-muted mt-2">{alt}</span>
        )}
      </span>

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={[{ src, alt: alt || '' }]}
        plugins={[Zoom]}
        animation={{ fade: 300 }}
        controller={{ closeOnBackdropClick: true }}
        styles={{
          container: { backgroundColor: 'rgba(0, 0, 0, 0.95)' },
        }}
        zoom={{
          maxZoomPixelRatio: 3,
          scrollToZoom: true,
        }}
        render={{
          buttonPrev: () => null,
          buttonNext: () => null,
        }}
      />
    </>
  )
}

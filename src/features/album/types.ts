export interface AlbumPhoto {
  src: string
  alt: string
  note?: string
}

export interface AlbumCollection {
  name: string
  cover: string
  photos: AlbumPhoto[]
}

export interface FriendLink {
  name: string
  author: string
  description: string
  href: string
  avatar?: string
  resolvedAvatar?: string
  date: string
  feed?: string
  quiet?: boolean
  tags?: string[]
}

export interface FriendGroup {
  name: string
  description: string
  links: FriendLink[]
}

export interface FriendArticle {
  author: string
  avatar?: string
  resolvedAvatar?: string
  sourceHref: string
  date: string
  title: string
  description: string
  href: string
  tags: string[]
  cover?: string
}

export interface FriendSourceStatus {
  name: string
  description: string
  avatar?: string
  resolvedAvatar?: string
  href: string
  feed: string
  ok: boolean
  count: number
  error?: string
}

export interface FriendsResponse {
  items: FriendArticle[]
  sources: FriendSourceStatus[]
  generatedAt: string
}

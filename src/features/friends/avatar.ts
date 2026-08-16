import type { FriendLink } from '@/features/friends/types'

export const DEFAULT_SITE_AVATAR = '/media/avatars/default-site-avatar.png'

export type FriendAvatarSource = Pick<FriendLink, 'avatar' | 'resolvedAvatar'>

export function getAvatarCandidates(source: FriendAvatarSource) {
  const primaryLogo = source.avatar?.trim() || source.resolvedAvatar?.trim()
  return [...new Set([primaryLogo, DEFAULT_SITE_AVATAR].filter((value): value is string => Boolean(value)))]
}

export function getFriendDomain(href: string) {
  try {
    return new URL(href).hostname.replace(/^www\./, '')
  } catch {
    return href
  }
}

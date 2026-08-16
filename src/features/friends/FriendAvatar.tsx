'use client'

import { useEffect, useState } from 'react'
import { DEFAULT_SITE_AVATAR, getAvatarCandidates, type FriendAvatarSource } from '@/features/friends/avatar'
import { ManagedImage } from '@/features/images'

type FriendAvatarProps = FriendAvatarSource & {
  name: string
  className: string
  imageSize: number
  decorative?: boolean
}

export function FriendAvatar({
  name,
  avatar,
  resolvedAvatar,
  className,
  imageSize,
  decorative = false,
}: FriendAvatarProps) {
  const candidates = getAvatarCandidates({ avatar, resolvedAvatar })
  const [logoIndex, setLogoIndex] = useState(0)
  const src = candidates[logoIndex] ?? DEFAULT_SITE_AVATAR

  useEffect(() => {
    setLogoIndex(0)
  }, [avatar, resolvedAvatar])

  return (
    <span className={className}>
      <ManagedImage
        key={src}
        src={src}
        alt={decorative ? '' : `${name} 的头像`}
        width={imageSize}
        height={imageSize}
        fill
        sizes={`${imageSize}px`}
        intent="avatar"
        deferUntilVisible
        onError={() => setLogoIndex(current => Math.min(current + 1, candidates.length - 1))}
      />
    </span>
  )
}

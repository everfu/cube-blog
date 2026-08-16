'use client'

import { ExternalLink } from 'lucide-react'
import type { PointerEvent } from 'react'
import { getFriendDomain } from '@/features/friends/avatar'
import { FriendAvatar } from '@/features/friends/FriendAvatar'
import type { FriendLink } from '@/features/friends/types'

function FriendLinkCard({ link }: { link: FriendLink }) {
  const domain = getFriendDomain(link.href)

  function updateSpotlight(event: PointerEvent<HTMLLIElement>) {
    if (event.pointerType === 'touch' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const bounds = event.currentTarget.getBoundingClientRect()
    const radius = Math.sqrt(bounds.width ** 2 + bounds.height ** 2) / 2

    event.currentTarget.style.setProperty('--pointer-x', `${event.clientX - bounds.left}px`)
    event.currentTarget.style.setProperty('--pointer-y', `${event.clientY - bounds.top}px`)
    event.currentTarget.style.setProperty('--pointer-radius', `${radius}px`)
  }

  return (
    <li className="friend-link-card" onPointerEnter={updateSpotlight} onPointerMove={updateSpotlight}>
      <span className="friend-link-card-background" aria-hidden="true" />
      <a href={link.href} target="_blank" rel="noreferrer noopener">
        <FriendAvatar
          className="friend-link-avatar"
          imageSize={36}
          name={link.name}
          avatar={link.avatar}
          resolvedAvatar={link.resolvedAvatar}
          decorative
        />
        <h2>{link.name}</h2>
        <p>{link.description}</p>
        <span className="friend-link-domain">
          {domain}
          <ExternalLink aria-hidden="true" />
        </span>
      </a>
      <span className="friend-link-scan" aria-hidden="true">
        <span className="friend-link-scan-border" />
        <span className="friend-link-scan-content">
          <span className="friend-link-avatar-placeholder" />
          <span className="friend-link-scan-name">{link.name}</span>
          <span className="friend-link-scan-description">{link.description}</span>
          <span className="friend-link-scan-domain">
            {domain}
            <ExternalLink />
          </span>
        </span>
      </span>
    </li>
  )
}

export function FriendLinkGrid({ links }: { links: FriendLink[] }) {
  return (
    <ul className="friend-link-grid" role="list">
      {links.map(link => <FriendLinkCard key={link.href} link={link} />)}
    </ul>
  )
}

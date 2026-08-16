import { friendGroups } from '@/data/links'
import { FriendLinkGrid } from '@/features/friends/FriendLinkGrid'
import { resolveFriendLinkAvatar } from '@/features/friends/site-icon'

export const metadata = { title: '友链', description: '我的朋友们和帮助过我的人' }

export default async function LinksPage() {
  const links = await Promise.all(friendGroups.flatMap(group => group.links).map(resolveFriendLinkAvatar))

  return (
    <div className="links-page">
      <header className="links-intro">
        <h1>我的朋友们。</h1>
        <p>我的朋友们和帮助过我的人。每一张名片都通向一个认真生活、写作或创造的人。</p>
      </header>
      <div className="links-grid-wrap">
        <FriendLinkGrid links={links} />
      </div>
    </div>
  )
}

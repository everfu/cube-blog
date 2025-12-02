'use client'

import { useState, useEffect } from 'react'
import PostCardSmall from './PostCardSmall'
import { PostMetadata } from '@/lib/posts'

interface PostsClientProps {
  posts: PostMetadata[]
}

export default function PostsClient({ posts }: PostsClientProps) {
  const [displayedPosts, setDisplayedPosts] = useState(posts.slice(0, 8))
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(posts.length > 8)

  // 加载更多文章
  const loadMore = () => {
    if (isLoading || !hasMore) return
    
    setIsLoading(true)
    
    // 模拟加载延迟
    setTimeout(() => {
      const currentLength = displayedPosts.length
      const nextPosts = posts.slice(currentLength, currentLength + 8)
      
      setDisplayedPosts(prev => [...prev, ...nextPosts])
      setHasMore(currentLength + 8 < posts.length)
      setIsLoading(false)
    }, 500)
  }

  // 滚动监听
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 1000) {
        loadMore()
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [displayedPosts, isLoading, hasMore])

  return (
    <>
      <div className="grid md:grid-cols-2 gap-4 mx-4 md:mx-8 my-8">
        {displayedPosts.map((post, index) => (
          <PostCardSmall 
            key={post.slug} 
            post={post}
          />
        ))}
      </div>

      {/* 加载更多按钮和状态 */}
      {isLoading && (
        <div className="text-center py-8">
          <div className="inline-flex items-center gap-2 text-muted">
            <div className="w-4 h-4 border-2 border-muted border-t-primary rounded-full animate-spin"></div>
            <span className="text-sm">加载中...</span>
          </div>
        </div>
      )}

      {!hasMore && displayedPosts.length > 0 && (
        <div className="text-center py-8">
          <span className="text-sm text-muted">已显示全部文章</span>
        </div>
      )}
    </>
  )
}

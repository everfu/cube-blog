import { PageIntro } from '@/components/PageIntro'
import { getAllPosts } from '@/features/posts/content'
import { PostCard } from '@/features/posts/PostCard'

export const metadata = { title: '文章', description: '所有文章与长期记录' }

export default async function PostsPage() {
  const posts = await getAllPosts()
  return (
    <>
      <PageIntro
        title="欢迎光临！"
        description="这里收录技术实践、工具、生活和仍在生长的想法。更新不算频繁，但希望每篇都值得留下。"
      />
      <div className="posts-grid posts-grid--archive">
        {posts.map(post => <PostCard key={post.id} post={post} />)}
      </div>
    </>
  )
}

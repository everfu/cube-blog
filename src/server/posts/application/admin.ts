import { isSupabaseConfigured } from '@/lib/supabase/config'
import { createClient } from '@/lib/supabase/server'
import type { PostStatus } from '@/types/supabase'
import { mapPost, postSelect } from '../data/mapper'
import type { AdminPost, AdminPostFilters, PostRevisionSummary } from '../contracts/types'

function sanitizeSearchValue(value: string) {
  return value.replace(/[%_,]/g, ' ').trim()
}

export async function getAdminPosts(filters: AdminPostFilters = {}): Promise<AdminPost[]> {
  if (!isSupabaseConfigured) return []

  const supabase = await createClient()
  let query = supabase
    .from('posts')
    .select(postSelect)
    .order('updated_at', { ascending: false })

  if (filters.status && filters.status !== 'all') {
    query = query.eq('status', filters.status)
  }

  if (filters.recent) {
    query = query.eq('recent', true)
  }

  if (filters.year?.trim()) {
    const year = Number(filters.year.trim())
    if (Number.isInteger(year)) query = query.eq('year', year)
  }

  if (filters.category?.trim()) {
    query = query.ilike('category', sanitizeSearchValue(filters.category))
  }

  if (filters.keyword?.trim()) {
    const keyword = sanitizeSearchValue(filters.keyword)
    query = query.or([
      `title.ilike.%${keyword}%`,
      `slug.ilike.%${keyword}%`,
      `excerpt.ilike.%${keyword}%`,
      `category.ilike.%${keyword}%`,
    ].join(','))
  }

  const { data, error } = await query

  if (error || !data) return []

  return data.map(mapPost)
}

export async function getAdminPostById(id: string): Promise<AdminPost | null> {
  if (!isSupabaseConfigured) return null

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('posts')
    .select(postSelect)
    .eq('id', id)
    .maybeSingle()

  if (error || !data) return null

  return mapPost(data)
}

export async function getPostCountByStatus() {
  if (!isSupabaseConfigured) {
    return { draft: 0, published: 0, archived: 0 }
  }

  const supabase = await createClient()
  const statuses: PostStatus[] = ['draft', 'published', 'archived']
  const counts = await Promise.all(statuses.map(async status => {
    const { count } = await supabase
      .from('posts')
      .select('id', { count: 'exact', head: true })
      .eq('status', status)

    return [status, count || 0] as const
  }))

  return counts.reduce<Record<PostStatus, number>>(
    (result, [status, count]) => ({ ...result, [status]: count }),
    { draft: 0, published: 0, archived: 0 }
  )
}

export async function getPostRevisions(postId: string, limit = 5): Promise<PostRevisionSummary[]> {
  if (!isSupabaseConfigured) return []

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('post_revisions')
    .select('id, post_id, snapshot, created_by, created_at')
    .eq('post_id', postId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error || !data) return []

  return data.map(revision => ({
    id: revision.id,
    postId: revision.post_id,
    snapshot: revision.snapshot,
    createdBy: revision.created_by,
    createdAt: revision.created_at,
  }))
}

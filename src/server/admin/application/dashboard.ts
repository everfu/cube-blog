import { isSupabaseConfigured } from '@/lib/supabase/config'
import { createClient } from '@/lib/supabase/server'
import { getAdminComments } from '@/server/comments/adapters/page'
import { getAdminPosts } from '@/server/posts/adapters/admin'
import type { AdminComment } from '@/server/comments/contracts/types'
import type { AdminPost } from '@/server/posts/contracts/types'
import type {
  AdminActivityItem,
  AdminAuditLog,
  AdminDashboardOverview,
  AdminDashboardSummary,
  AdminModuleKey,
  AdminModuleSummary,
  AdminTaskItem,
  AdminTaskTone,
} from '../contracts/types'

const moduleDefaults: Record<AdminModuleKey, Omit<AdminModuleSummary, 'total' | 'description'>> = {
  posts: { key: 'posts', label: '文章', href: '/admin/posts', icon: 'i-lucide-file-text' },
  comments: { key: 'comments', label: '评论', href: '/admin/comments', icon: 'i-lucide-message-square' },
  media: { key: 'media', label: '媒体', href: '/admin/media', icon: 'i-lucide-image' },
  home: { key: 'home', label: '首页', href: '/admin/home', icon: 'i-lucide-panels-top-left' },
  watched: { key: 'watched', label: '电影', href: '/admin/watched', icon: 'i-lucide-film' },
  album: { key: 'album', label: '相册', href: '/admin/album', icon: 'i-lucide-images' },
  stack: { key: 'stack', label: 'Stack', href: '/admin/stack', icon: 'i-lucide-boxes' },
  friends: { key: 'friends', label: '友链', href: '/admin/friends', icon: 'i-lucide-network' },
  settings: { key: 'settings', label: '设置', href: '/admin/settings', icon: 'i-lucide-fingerprint' },
  audit: { key: 'audit', label: '审计', href: '/admin/audit', icon: 'i-lucide-activity' },
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {}
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : []
}

function asString(value: unknown, fallback = '') {
  return typeof value === 'string' ? value : fallback
}

function asOptionalString(value: unknown) {
  return typeof value === 'string' ? value : null
}

function asNumber(value: unknown, fallback = 0) {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback
}

function asBoolean(value: unknown, fallback = false) {
  return typeof value === 'boolean' ? value : fallback
}

function asTone(value: unknown): AdminTaskTone {
  if (value === 'neutral' || value === 'success' || value === 'warning' || value === 'danger' || value === 'muted') return value
  return 'muted'
}

function asModuleKey(value: unknown): AdminModuleKey | null {
  return typeof value === 'string' && value in moduleDefaults ? value as AdminModuleKey : null
}

function parsePost(value: unknown): AdminPost | null {
  const row = asRecord(value)
  const id = asString(row.id)
  const slug = asString(row.slug)
  const title = asString(row.title)
  if (!id || !slug || !title) return null

  return {
    id,
    year: String(row.year || ''),
    slug,
    title,
    date: asString(row.date, asString(row.createdAt)),
    excerpt: asString(row.excerpt),
    tags: asArray(row.tags).filter((tag): tag is string => typeof tag === 'string'),
    cover: typeof row.cover === 'string' ? row.cover : undefined,
    category: asString(row.category, 'DAILY'),
    recent: asBoolean(row.recent),
    viewCount: asNumber(row.viewCount),
    likeCount: asNumber(row.likeCount),
    reactions: {},
    content: asString(row.content),
    status: row.status === 'published' || row.status === 'archived' ? row.status : 'draft',
    updatedAt: asString(row.updatedAt, asString(row.date)),
  }
}

function parseComment(value: unknown): AdminComment | null {
  const row = asRecord(value)
  const id = asString(row.id)
  const authorName = asString(row.authorName)
  const body = asString(row.body)
  if (!id || !authorName || !body) return null

  return {
    id,
    pagePath: asString(row.pagePath),
    postId: asOptionalString(row.postId),
    parentId: asOptionalString(row.parentId),
    authorName,
    authorAvatarUrl: asOptionalString(row.authorAvatarUrl),
    emailHash: asOptionalString(row.emailHash),
    website: asOptionalString(row.website),
    body,
    authMode: row.authMode === 'authenticated' ? 'authenticated' : 'email',
    locationLabel: asOptionalString(row.locationLabel),
    uaSummary: asOptionalString(row.uaSummary),
    likeCount: asNumber(row.likeCount),
    status: row.status === 'approved' || row.status === 'spam' || row.status === 'deleted' ? row.status : 'pending',
    isOwnPending: false,
    createdAt: asString(row.createdAt),
    authorEmail: asOptionalString(row.authorEmail),
    userAgent: asOptionalString(row.userAgent),
    uaRequestId: asOptionalString(row.uaRequestId),
    notifiedOwnerAt: asOptionalString(row.notifiedOwnerAt),
    notifiedReplyAt: asOptionalString(row.notifiedReplyAt),
  }
}

function getActivityHref(log: Pick<AdminAuditLog, 'entityType' | 'entityId'>) {
  if (log.entityType === 'post' && log.entityId) return `/admin/posts/${log.entityId}`
  if (log.entityType === 'comment') return '/admin/comments'
  if (log.entityType.startsWith('friend_')) return '/admin/friends'
  if (log.entityType.startsWith('album_')) return '/admin/album'
  if (log.entityType.startsWith('stack_')) return '/admin/stack'
  if (log.entityType === 'watched_item') return '/admin/watched'
  if (log.entityType === 'home_section') return '/admin/home'
  if (log.entityType === 'comment_settings') return '/admin/comment-settings'
  return null
}

function parseActivity(value: unknown): AdminActivityItem | null {
  const row = asRecord(value)
  const id = asString(row.id)
  const action = asString(row.action)
  const entityType = asString(row.entityType)
  if (!id || !action || !entityType) return null

  const log: AdminAuditLog = {
    id,
    actorId: asOptionalString(row.actorId),
    action,
    entityType,
    entityId: asOptionalString(row.entityId),
    metadata: row.metadata as AdminAuditLog['metadata'],
    createdAt: asString(row.createdAt),
  }

  return {
    ...log,
    label: asString(row.label, `${action}:${entityType}`),
    href: asOptionalString(row.href) || getActivityHref(log),
  }
}

function parseModule(value: unknown): AdminModuleSummary | null {
  const row = asRecord(value)
  const key = asModuleKey(row.key)
  if (!key) return null
  const defaults = moduleDefaults[key]

  return {
    ...defaults,
    label: asString(row.label, defaults.label),
    href: asString(row.href, defaults.href),
    icon: asString(row.icon, defaults.icon),
    total: asNumber(row.total),
    published: asNumber(row.published),
    draft: asNumber(row.draft),
    archived: asNumber(row.archived),
    pending: asNumber(row.pending),
    warning: asNumber(row.warning),
    updatedAt: asOptionalString(row.updatedAt),
    description: asString(row.description),
  }
}

function parseTask(value: unknown): AdminTaskItem | null {
  const row = asRecord(value)
  const moduleKey = asModuleKey(row.module)
  const id = asString(row.id)
  if (!moduleKey || !id) return null

  return {
    id,
    label: asString(row.label),
    value: asNumber(row.value),
    href: asString(row.href, moduleDefaults[moduleKey].href),
    tone: asTone(row.tone),
    description: asString(row.description),
    module: moduleKey,
  }
}

function parseOverview(value: unknown): AdminDashboardOverview | null {
  const row = asRecord(value)
  const totals = asRecord(row.totals)
  const modules = asArray(row.modules).map(parseModule).filter((module): module is AdminModuleSummary => Boolean(module))

  if (modules.length === 0) return null

  return {
    generatedAt: asString(row.generatedAt, new Date().toISOString()),
    totals: {
      posts: asNumber(totals.posts),
      comments: asNumber(totals.comments),
      media: asNumber(totals.media),
      tasks: asNumber(totals.tasks),
    },
    modules,
    tasks: asArray(row.tasks).map(parseTask).filter((task): task is AdminTaskItem => Boolean(task)),
    recentPosts: asArray(row.recentPosts).map(parsePost).filter((post): post is AdminPost => Boolean(post)),
    pendingComments: asArray(row.pendingComments).map(parseComment).filter((comment): comment is AdminComment => Boolean(comment)),
    activity: asArray(row.activity).map(parseActivity).filter((activity): activity is AdminActivityItem => Boolean(activity)),
  }
}

export async function getRecentAdminAuditLogs(limit = 8): Promise<AdminAuditLog[]> {
  if (!isSupabaseConfigured) return []

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('admin_audit_logs')
    .select('id, actor_id, action, entity_type, entity_id, metadata, created_at')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error || !data) return []

  return data.map(log => ({
    id: log.id,
    actorId: log.actor_id,
    action: log.action,
    entityType: log.entity_type,
    entityId: log.entity_id,
    metadata: log.metadata,
    createdAt: log.created_at,
  }))
}

export async function getAdminRecentActivity(limit = 8): Promise<AdminActivityItem[]> {
  const logs = await getRecentAdminAuditLogs(limit)
  return logs.map(log => ({
    ...log,
    label: `${log.action}:${log.entityType}`,
    href: getActivityHref(log),
  }))
}

async function getFallbackOverview(): Promise<AdminDashboardOverview> {
  const [posts, comments, activity] = await Promise.all([
    getAdminPosts(),
    getAdminComments({ status: 'all' }),
    getAdminRecentActivity(8),
  ])
  const draftPosts = posts.filter(post => post.status === 'draft').length
  const pendingComments = comments.filter(comment => comment.status === 'pending')
  const spamComments = comments.filter(comment => comment.status === 'spam').length

  const modules: AdminModuleSummary[] = [
    {
      ...moduleDefaults.posts,
      total: posts.length,
      published: posts.filter(post => post.status === 'published').length,
      draft: draftPosts,
      archived: posts.filter(post => post.status === 'archived').length,
      warning: draftPosts,
      description: '发布、草稿与近期内容',
    },
    {
      ...moduleDefaults.comments,
      total: comments.length,
      published: comments.filter(comment => comment.status === 'approved').length,
      pending: pendingComments.length,
      archived: comments.filter(comment => comment.status === 'deleted').length + spamComments,
      warning: pendingComments.length + spamComments,
      description: '审核队列、垃圾评论与互动状态',
    },
  ]

  const tasks: AdminTaskItem[] = [
    {
      id: 'pending-comments',
      label: '待审评论',
      value: pendingComments.length,
      href: '/admin/comments?status=pending',
      tone: pendingComments.length > 0 ? 'danger' : 'success',
      description: '需要审核后才会进入前台评论区',
      module: 'comments',
    },
    {
      id: 'draft-posts',
      label: '草稿文章',
      value: draftPosts,
      href: '/admin/posts?status=draft',
      tone: draftPosts > 0 ? 'warning' : 'muted',
      description: '可继续编辑或发布',
      module: 'posts',
    },
  ]

  return {
    generatedAt: new Date().toISOString(),
    totals: {
      posts: posts.length,
      comments: comments.length,
      media: 0,
      tasks: tasks.reduce((sum, task) => sum + task.value, 0),
    },
    modules,
    tasks,
    recentPosts: posts.slice(0, 6),
    pendingComments: pendingComments.slice(0, 5),
    activity,
  }
}

export async function getAdminDashboardOverview(): Promise<AdminDashboardOverview> {
  if (!isSupabaseConfigured) return getFallbackOverview()

  const supabase = await createClient()
  const { data, error } = await supabase.rpc('get_admin_dashboard_overview')

  if (!error && data) {
    const overview = parseOverview(data)
    if (overview) return overview
  }

  return getFallbackOverview()
}

export async function getAdminModuleSummaries(): Promise<AdminModuleSummary[]> {
  const overview = await getAdminDashboardOverview()
  return overview.modules
}

export async function getAdminDashboardSummary(): Promise<AdminDashboardSummary> {
  const overview = await getAdminDashboardOverview()
  const postsModule = overview.modules.find(module => module.key === 'posts')
  const commentsModule = overview.modules.find(module => module.key === 'comments')

  return {
    postTotal: postsModule?.total || overview.totals.posts,
    publishedPosts: postsModule?.published || 0,
    draftPosts: postsModule?.draft || 0,
    archivedPosts: postsModule?.archived || 0,
    commentTotal: commentsModule?.total || overview.totals.comments,
    pendingComments: commentsModule?.pending || 0,
    approvedComments: commentsModule?.published || 0,
    spamComments: Math.max((commentsModule?.warning || 0) - (commentsModule?.pending || 0), 0),
    recentPosts: overview.recentPosts,
    pendingCommentItems: overview.pendingComments,
    auditLogs: overview.activity,
  }
}

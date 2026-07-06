import type { Json } from '@/types/supabase'
import type { AdminComment } from '@/server/comments/contracts/types'
import type { AdminPost } from '@/server/posts/contracts/types'

export type AdminModuleKey =
  | 'posts'
  | 'comments'
  | 'media'
  | 'home'
  | 'watched'
  | 'album'
  | 'stack'
  | 'friends'
  | 'settings'
  | 'audit'

export type AdminTaskTone = 'neutral' | 'success' | 'warning' | 'danger' | 'muted'

export interface AdminAuditLog {
  id: string
  actorId: string | null
  action: string
  entityType: string
  entityId: string | null
  metadata: Json
  createdAt: string
}

export interface AdminActivityItem extends AdminAuditLog {
  label: string
  href: string | null
}

export interface AdminTaskItem {
  id: string
  label: string
  value: number
  href: string
  tone: AdminTaskTone
  description: string
  module: AdminModuleKey
}

export interface AdminModuleSummary {
  key: AdminModuleKey
  label: string
  href: string
  icon: string
  total: number
  published?: number
  draft?: number
  archived?: number
  pending?: number
  warning?: number
  updatedAt?: string | null
  description: string
}

export interface AdminDashboardOverview {
  generatedAt: string
  totals: {
    posts: number
    comments: number
    media: number
    tasks: number
  }
  modules: AdminModuleSummary[]
  tasks: AdminTaskItem[]
  recentPosts: AdminPost[]
  pendingComments: AdminComment[]
  activity: AdminActivityItem[]
}

export interface AdminListResult<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
}

export interface AdminDashboardSummary {
  postTotal: number
  publishedPosts: number
  draftPosts: number
  archivedPosts: number
  commentTotal: number
  pendingComments: number
  approvedComments: number
  spamComments: number
  recentPosts: AdminPost[]
  pendingCommentItems: AdminComment[]
  auditLogs: AdminAuditLog[]
}

export interface AdminDashboardSource {
  posts: AdminPost[]
  comments: AdminComment[]
  auditLogs: AdminAuditLog[]
}

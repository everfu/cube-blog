import Link from 'next/link'
import { getAdminDashboardOverview } from '@/server/admin/adapters/page'
import { getPostHref } from '@/server/posts/contracts/routes'
import { requireAdminPage } from '@/lib/auth/require-admin'
import { formatDate, formatTimeAgo } from '@/lib/utils'
import {
  AdminButtonLink,
  AdminEmptyState,
  AdminPageHeader,
  AdminPanel,
  AdminPanelHeader,
  AdminStat,
  StatusBadge,
  formatAdminAction,
  formatAdminEntity,
  getCommentStatusLabel,
  getPostStatusLabel,
  getStatusTone,
} from '@/components/admin/AdminPrimitives'

function ModuleCard({
  module,
}: {
  module: Awaited<ReturnType<typeof getAdminDashboardOverview>>['modules'][number]
}) {
  const active = module.published || 0
  const inactive = (module.draft || 0) + (module.archived || 0)
  const attention = (module.pending || 0) + (module.warning || 0)

  return (
    <Link href={module.href} className="group block rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] p-4 shadow-[var(--admin-shadow)] transition-colors hover:border-[var(--admin-border-strong)] hover:opacity-100">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-[var(--admin-border)] bg-background text-muted">
            <span className={`${module.icon} text-base`} />
          </span>
          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold text-foreground">{module.label}</h3>
            <p className="mt-0.5 truncate text-xs text-muted">{module.description}</p>
          </div>
        </div>
        {attention > 0 && <StatusBadge tone={module.pending ? 'danger' : 'warning'}>{attention}</StatusBadge>}
      </div>
      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className="rounded-md border border-[var(--admin-border)] bg-background px-2.5 py-2">
          <div className="font-semibold tabular-nums text-foreground">{module.total}</div>
          <div className="mt-0.5 truncate text-muted">总量</div>
        </div>
        <div className="rounded-md border border-[var(--admin-border)] bg-background px-2.5 py-2">
          <div className="font-semibold tabular-nums text-emerald-600 dark:text-emerald-400">{active}</div>
          <div className="mt-0.5 truncate text-muted">活跃</div>
        </div>
        <div className="rounded-md border border-[var(--admin-border)] bg-background px-2.5 py-2">
          <div className="font-semibold tabular-nums text-amber-600 dark:text-amber-400">{inactive}</div>
          <div className="mt-0.5 truncate text-muted">待整理</div>
        </div>
      </div>
    </Link>
  )
}

export default async function AdminPage() {
  await requireAdminPage('/admin')
  const overview = await getAdminDashboardOverview()
  const postModule = overview.modules.find(module => module.key === 'posts')
  const commentModule = overview.modules.find(module => module.key === 'comments')

  const stats = [
    { label: '待办', value: overview.totals.tasks, icon: 'i-lucide-list-checks', hint: '跨模块需要处理', tone: overview.totals.tasks > 0 ? 'warning' as const : 'success' as const },
    { label: '文章', value: overview.totals.posts, icon: 'i-lucide-files', hint: `${postModule?.published || 0} 篇已发布`, tone: 'muted' as const },
    { label: '评论', value: overview.totals.comments, icon: 'i-lucide-message-square', hint: `${commentModule?.pending || 0} 条待审`, tone: (commentModule?.pending || 0) > 0 ? 'danger' as const : 'success' as const },
    { label: '媒体', value: overview.totals.media, icon: 'i-lucide-image', hint: '站点素材文件', tone: 'muted' as const },
  ]

  return (
    <section className="space-y-5">
      <AdminPageHeader
        eyebrow="概览 / 任务中心"
        title="管理工作台"
        actions={(
          <>
            <AdminButtonLink href="/admin/media" icon="i-lucide-upload" variant="secondary">
              上传素材
            </AdminButtonLink>
            <AdminButtonLink href="/admin/posts/new" icon="i-lucide-plus" variant="primary">
              新建文章
            </AdminButtonLink>
          </>
        )}
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(card => (
          <AdminStat key={card.label} {...card} />
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
        <AdminPanel>
          <AdminPanelHeader title="关键待办" description="优先处理会影响前台展示或访客互动的事项。" icon="i-lucide-list-checks" />
          <div className="grid gap-3 p-4 md:p-5">
            {overview.tasks.map(task => (
              <Link key={task.id} href={task.href} className="flex items-center justify-between gap-3 rounded-md border border-[var(--admin-border)] bg-background px-4 py-3 hover:border-[var(--admin-border-strong)] hover:opacity-100">
                <div className="min-w-0">
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="truncate text-sm font-medium text-foreground">{task.label}</span>
                    <StatusBadge tone={task.tone}>{task.value}</StatusBadge>
                  </div>
                  <p className="mt-1 truncate text-xs text-muted">{task.description}</p>
                </div>
                <span className="i-lucide-arrow-right shrink-0 text-sm text-muted" />
              </Link>
            ))}
            {overview.tasks.length === 0 && (
              <AdminEmptyState icon="i-lucide-check-circle-2" title="暂无待办" body="所有内容队列保持干净，可以继续发布或整理内容。" />
            )}
          </div>
        </AdminPanel>

        <AdminPanel>
          <AdminPanelHeader title="模块状态" description="从内容、互动、媒体到系统维护的后台健康概览。" icon="i-lucide-layout-dashboard" />
          <div className="grid gap-3 p-4 sm:grid-cols-2 md:p-5">
            {overview.modules.map(module => (
              <ModuleCard key={module.key} module={module} />
            ))}
          </div>
        </AdminPanel>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <AdminPanel>
          <AdminPanelHeader title="最近更新文章" icon="i-lucide-clock-3" />
          <div className="divide-y divide-[var(--admin-border)]">
            {overview.recentPosts.map(post => (
              <div key={post.id} className="flex items-center justify-between gap-3 px-4 py-3 md:px-5">
                <div className="min-w-0">
                  <Link href={`/admin/posts/${post.id}`} className="truncate text-sm font-medium text-foreground hover:opacity-70">
                    {post.title}
                  </Link>
                  <p className="truncate text-xs text-muted">{getPostHref(post)} / 更新于 {formatDate(post.updatedAt)}</p>
                </div>
                <StatusBadge tone={getStatusTone(post.status)}>{getPostStatusLabel(post.status)}</StatusBadge>
              </div>
            ))}
            {overview.recentPosts.length === 0 && (
              <div className="p-4 md:p-5">
                <AdminEmptyState title="暂无文章" body="新建第一篇文章后，这里会展示最近更新内容。" />
              </div>
            )}
          </div>
        </AdminPanel>

        <AdminPanel>
          <div className="flex items-start justify-between gap-3 border-b border-[var(--admin-border)] px-4 py-3 md:px-5">
            <div className="min-w-0">
              <h3 className="truncate text-sm font-semibold text-foreground">近期操作</h3>
            </div>
            <Link href="/admin/audit" className="inline-flex h-8 shrink-0 items-center gap-1 rounded-md border border-[var(--admin-border)] bg-background px-2.5 text-xs font-medium text-muted hover:border-[var(--admin-border-strong)] hover:text-foreground">
              查看全部
              <span className="i-lucide-arrow-right text-sm" />
            </Link>
          </div>
          <div className="divide-y divide-[var(--admin-border)]">
            {overview.activity.map(log => (
              <Link key={log.id} href={log.href || '/admin/audit'} className="block px-4 py-3 hover:bg-[var(--admin-accent-soft)] hover:opacity-100 md:px-5">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-medium text-foreground">
                    {formatAdminAction(log.action)}{formatAdminEntity(log.entityType)}
                  </span>
                  <span className="shrink-0 text-xs text-muted">{formatTimeAgo(log.createdAt, true)}</span>
                </div>
                <p className="mt-1 truncate text-xs text-muted">{log.entityId || '系统记录'}</p>
              </Link>
            ))}
            {overview.activity.length === 0 && (
              <div className="p-4 md:p-5">
                <AdminEmptyState icon="i-lucide-activity" title="暂无操作记录" body="文章保存、评论审核等操作会在这里出现。" />
              </div>
            )}
          </div>
        </AdminPanel>
      </div>

      <AdminPanel>
        <AdminPanelHeader title="待审评论预览" icon="i-lucide-message-circle-warning" />
        <div className="grid gap-3 p-4 md:grid-cols-2 md:p-5 xl:grid-cols-3">
          {overview.pendingComments.map(comment => (
            <Link key={comment.id} href="/admin/comments?status=pending" className="rounded-md border border-[var(--admin-border)] bg-background p-3 hover:border-[var(--admin-border-strong)] hover:opacity-100">
              <div className="flex items-center justify-between gap-3">
                <span className="truncate text-sm font-medium text-foreground">{comment.authorName}</span>
                <StatusBadge tone={getStatusTone(comment.status)}>{getCommentStatusLabel(comment.status)}</StatusBadge>
              </div>
              <p className="mt-2 line-clamp-2 text-sm text-muted">{comment.body}</p>
            </Link>
          ))}
          {overview.pendingComments.length === 0 && (
            <AdminEmptyState icon="i-lucide-check-circle-2" title="暂无待审核评论" body="当前互动队列保持干净。" />
          )}
        </div>
      </AdminPanel>
    </section>
  )
}

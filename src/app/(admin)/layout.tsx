import AdminNav from '@/components/admin/AdminNav'
import { getAdminModuleSummaries } from '@/server/admin/adapters/page'
import { getCurrentAdmin } from '@/lib/auth/admin'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const admin = await getCurrentAdmin()
  const modules = admin ? await getAdminModuleSummaries() : []
  const badges = Object.fromEntries(
    modules.map(module => [module.href, module.pending || module.warning || 0])
  )

  return (
    <div className="admin-shell min-h-screen bg-[var(--admin-bg)] text-foreground">
      <div className="lg:flex">
        <AdminNav badges={badges} />
        <main className="min-w-0 flex-1 px-4 py-5 sm:px-6 lg:px-8 lg:py-7">
          <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-5">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

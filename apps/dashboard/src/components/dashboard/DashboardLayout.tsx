import { Outlet, Navigate } from 'react-router-dom'
import { Sidebar } from '@/components/dashboard/Sidebar'
import { TopBar } from '@/components/dashboard/TopBar'
import { useRoleStore } from '@/stores/useRoleStore'
import { getRoleScope } from '@/lib/roleFilter'

function RoleContextBanner() {
  const { activeRole } = useRoleStore()
  const scope = getRoleScope(activeRole)

  return (
    <div className="border-b-2 border-[#1A1A18] bg-[#F5F2E8] px-8 py-2 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="text-xs font-medium uppercase tracking-wider text-[#8A8680]">Viewing as:</span>
        <span className="text-xs font-black uppercase tracking-wider text-[#1A1A18] bg-[#E8C018] px-2 py-0.5">{scope.label}</span>
        <span className="text-xs font-medium uppercase tracking-wider text-[#4A4845]">{scope.description}</span>
      </div>
      <span className="text-xs font-medium uppercase tracking-wider text-[#8A8680]">Role-scoped view</span>
    </div>
  )
}

export function DashboardLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-[#F5F2E8]">
      {/* Sidebar */}
      <Sidebar />

      {/* Main area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopBar />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-[#F5F2E8]">
          <RoleContextBanner />
          <Outlet />
        </main>
      </div>
    </div>
  )
}

/** Index redirect: /dashboard → /dashboard/overview */
export function DashboardIndexRedirect() {
  return <Navigate to="/dashboard/overview" replace />
}

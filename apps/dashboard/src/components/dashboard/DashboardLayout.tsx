import { Outlet, Navigate } from 'react-router-dom'
import { Sidebar } from '@/components/dashboard/Sidebar'
import { TopBar } from '@/components/dashboard/TopBar'

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

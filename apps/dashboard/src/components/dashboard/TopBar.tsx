import { Breadcrumb } from '@/components/dashboard/Breadcrumb'
import { RoleSwitcher } from '@/components/dashboard/RoleSwitcher'
import { useAuth } from '@/context/AuthContext'
import { User } from 'lucide-react'

export function TopBar() {
  const { user } = useAuth()

  return (
    <header className="flex items-center justify-between h-14 px-6 border-b-2 border-[#1A1A18] bg-[#F5F2E8] shrink-0">
      {/* Left: Breadcrumb */}
      <Breadcrumb />

      {/* Right: Role switcher + user chip */}
      <div className="flex items-center gap-4">
        <RoleSwitcher />

        {/* Divider */}
        <div className="w-px h-6 bg-[#1A1A18]" />

        {/* User chip */}
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-7 h-7 bg-[#1A1A18]">
            <User className="w-3.5 h-3.5 text-[#F5F2E8]" strokeWidth={2.5} />
          </div>
          {user && (
            <span className="text-sm font-medium uppercase tracking-wider text-[#1A1A18] max-w-36 truncate">
              {user.name}
            </span>
          )}
        </div>
      </div>
    </header>
  )
}

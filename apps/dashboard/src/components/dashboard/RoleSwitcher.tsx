import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useRoleStore, ROLE_LABELS, type Role } from '@/stores/useRoleStore'
import { UserCog } from 'lucide-react'

const ROLES = Object.keys(ROLE_LABELS) as Role[]

export function RoleSwitcher() {
  const { activeRole, setRole } = useRoleStore()

  return (
    <div className="flex items-center gap-2">
      <UserCog className="w-4 h-4 text-[#8A8680]" strokeWidth={2} />
      <Select value={activeRole} onValueChange={(v) => setRole(v as Role)}>
        <SelectTrigger
          id="role-switcher"
          className="h-8 w-52 border-2 border-[#1A1A18] rounded-none bg-[#F5F2E8] text-[#1A1A18] text-xs font-medium uppercase tracking-wider focus:ring-0 focus:ring-offset-0 focus:border-[#1E3878]"
        >
          <SelectValue placeholder="Select role" />
        </SelectTrigger>
        <SelectContent className="rounded-none border-2 border-[#1A1A18] bg-[#FFFFFF] shadow-none">
          {ROLES.map((role) => (
            <SelectItem
              key={role}
              value={role}
              className="rounded-none text-xs font-medium uppercase tracking-wider text-[#1A1A18] focus:bg-[#E8C018] focus:text-[#1A1A18] cursor-pointer"
            >
              {ROLE_LABELS[role]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

import { create } from 'zustand'

export type Role = 'MP' | 'DM' | 'AUDITOR' | 'ADMIN'

interface RoleState {
  activeRole: Role
  setRole: (role: Role) => void
}

export const ROLE_LABELS: Record<Role, string> = {
  MP: 'Member of Parliament',
  DM: 'District Magistrate',
  AUDITOR: 'Auditor',
  ADMIN: 'System Admin',
}

export const useRoleStore = create<RoleState>((set) => ({
  activeRole: 'MP',
  setRole: (role) => set({ activeRole: role }),
}))

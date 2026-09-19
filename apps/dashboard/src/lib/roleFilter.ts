import type { Role } from '@/stores/useRoleStore'

const SAMPLE_MP = 'AASHTIKAR PATIL NAGESH BAPURAO' // top MP by record count in CSV
const SAMPLE_STATE = 'Maharashtra'                  // 1,080 rows in CSV

export interface RoleScope {
  /** Short label shown in the banner, e.g. "CONSTITUENCY" */
  label: string
  /** Human-readable description, e.g. "MP: AASHTIKAR PATIL NAGESH BAPURAO" */
  description: string
  /** Predicate returning true if the row belongs to this scope */
  matches: (row: { mp_name: string; state: string }) => boolean
}

export function getRoleScope(role: Role): RoleScope {
  switch (role) {
    case 'MP':
      return {
        label: 'Constituency',
        description: `MP: ${SAMPLE_MP}`,
        matches: (r) => r.mp_name === SAMPLE_MP,
      }
    case 'DM':
      return {
        label: 'State',
        description: `State: ${SAMPLE_STATE}`,
        matches: (r) => r.state === SAMPLE_STATE,
      }
    case 'AUDITOR':
    case 'ADMIN':
    default:
      return {
        label: 'National',
        description: 'All records · National scope',
        matches: () => true,
      }
  }
}

export function filterByRole<T extends { mp_name: string; state: string }>(
  rows: T[],
  role: Role,
): T[] {
  const scope = getRoleScope(role)
  return rows.filter(scope.matches)
}

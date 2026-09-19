import { useState, useMemo, useCallback, useEffect } from 'react'
import { HardHat, ChevronUp, ChevronDown } from 'lucide-react'
import { ALERTS } from '@/data/mockAlerts'
import type { AlertRow } from '@/data/mockAlerts'
import { useRoleStore } from '@/stores/useRoleStore'
import { filterByRole } from '@/lib/roleFilter'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type SortKey = 'work_id' | 'work_category' | 'state' | 'mp_name' | 'status' | 'cost_estimate' | 'payment_released_pct' | 'risk_score'
type SortDir = 'asc' | 'desc' | 'none'
type SeverityFilter = 'ALL' | 'HIGH' | 'MEDIUM' | 'LOW'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatCost(raw: string): string {
  const n = Number(raw)
  if (isNaN(n)) return raw
  if (n >= 1e7) return `₹${(n / 1e7).toFixed(1)} Cr`
  if (n >= 1e5) return `₹${(n / 1e5).toFixed(1)} L`
  return `₹${n.toLocaleString('en-IN')}`
}

const STATUS_STYLES: Record<string, string> = {
  'Completed':   'bg-[#1A1A18] text-[#F5F2E8]',
  'In Progress': 'bg-[#1E3878] text-[#F5F2E8]',
  'Sanctioned':  'bg-[#E8C018] text-[#1A1A18]',
}

const RISK_BADGE: Record<string, string> = {
  High:   'bg-[#C8302A] text-[#F5F2E8]',
  Medium: 'bg-[#E8C018] text-[#1A1A18]',
  Low:    'bg-[#F5F2E8] text-[#1A1A18] border border-[#8A8680]',
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  if (!active || dir === 'none') {
    return <span className="inline-block w-3 h-3 opacity-20"><ChevronUp className="w-3 h-3" /></span>
  }
  return dir === 'asc'
    ? <ChevronUp className="w-3 h-3 text-[#1E3878]" />
    : <ChevronDown className="w-3 h-3 text-[#1E3878]" />
}

// ---------------------------------------------------------------------------
// Unique option lists (computed once at module level)
// ---------------------------------------------------------------------------

const ALL_CATEGORIES = Array.from(new Set(ALERTS.map((r) => r.work_category))).sort()
const ALL_STATES     = Array.from(new Set(ALERTS.map((r) => r.state))).sort()

// ---------------------------------------------------------------------------
// Column definitions
// ---------------------------------------------------------------------------

const COLS: { key: SortKey; label: string }[] = [
  { key: 'work_id',              label: 'Work ID'  },
  { key: 'work_category',        label: 'Category' },
  { key: 'state',                label: 'State'    },
  { key: 'mp_name',              label: 'MP'       },
  { key: 'status',               label: 'Status'   },
  { key: 'cost_estimate',        label: 'Cost'     },
  { key: 'payment_released_pct', label: 'Paid %'   },
  { key: 'risk_score',           label: 'Risk'     },
]

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

export function Works() {
  const { activeRole } = useRoleStore()

  // Role-scoped base dataset
  const scopedWorks = useMemo(() => filterByRole(ALERTS, activeRole), [activeRole])

  // Filter state
  const [severity, setSeverity] = useState<SeverityFilter>('ALL')
  const [category, setCategory] = useState('All Categories')
  const [stateFilter, setStateFilter] = useState('All States')
  const [search, setSearch] = useState('')

  // Sort state
  const [sortKey, setSortKey] = useState<SortKey>('risk_score')
  const [sortDir, setSortDir] = useState<SortDir>('desc')

  // Pagination state
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(50)

  // Reset page on any filter/size/role change
  useEffect(() => {
    setPage(1)
  }, [severity, category, stateFilter, search, pageSize, activeRole])

  // Toggle sort: desc → asc → none → desc
  const toggleSort = useCallback((key: SortKey) => {
    setSortKey((prev) => {
      if (prev !== key) {
        setSortDir('desc')
        return key
      }
      setSortDir((d) => {
        if (d === 'desc') return 'asc'
        if (d === 'asc')  return 'none'
        return 'desc'
      })
      return key
    })
  }, [])

  // Filtered + sorted rows
  const filteredRows = useMemo<AlertRow[]>(() => {
    const q = search.trim().toLowerCase()

    let rows = scopedWorks.filter((row) => {
      if (severity !== 'ALL' && row.risk_level.toUpperCase() !== severity) return false
      if (category !== 'All Categories' && row.work_category !== category) return false
      if (stateFilter !== 'All States' && row.state !== stateFilter) return false
      if (q) {
        const hit =
          row.work_id.toLowerCase().includes(q) ||
          row.mp_name.toLowerCase().includes(q) ||
          row.implementing_agency.toLowerCase().includes(q)
        if (!hit) return false
      }
      return true
    })

    if (sortDir !== 'none') {
      rows = [...rows].sort((a, b) => {
        let cmp = 0
        if (sortKey === 'risk_score' || sortKey === 'cost_estimate' || sortKey === 'payment_released_pct') {
          cmp = Number(a[sortKey]) - Number(b[sortKey])
        } else {
          cmp = a[sortKey].localeCompare(b[sortKey])
        }
        return sortDir === 'asc' ? cmp : -cmp
      })
    }

    return rows
  }, [severity, category, stateFilter, search, sortKey, sortDir, scopedWorks])

  // Pagination
  const totalFiltered = filteredRows.length
  const totalPages = Math.max(1, Math.ceil(totalFiltered / pageSize))
  const startIdx = (page - 1) * pageSize
  const pagedRows = filteredRows.slice(startIdx, startIdx + pageSize)

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Page header */}
      <div className="flex flex-wrap items-center gap-3 mb-6 border-b-2 border-[#1A1A18] pb-4">
        <HardHat className="w-5 h-5 text-[#1E3878]" strokeWidth={2} />
        <h1 className="text-xl font-black uppercase tracking-tight text-[#1A1A18]">Works</h1>
        <span className="w-full sm:w-auto sm:ml-auto text-xs font-medium uppercase tracking-wider text-[#8A8680] whitespace-nowrap">
          SHOWING {totalFiltered.toLocaleString()} OF {scopedWorks.length.toLocaleString()} RECORDS
        </span>
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        {/* Severity pills */}
        <div className="flex flex-wrap gap-2">
          {(['ALL', 'HIGH', 'MEDIUM', 'LOW'] as const).map((sev) => (
            <button
              key={sev}
              onClick={() => setSeverity(sev)}
              className={`px-3 h-8 text-xs font-medium uppercase tracking-wider transition-colors border-2 border-[#1A1A18] ${
                severity === sev
                  ? 'bg-[#1A1A18] text-[#F5F2E8]'
                  : 'bg-white text-[#1A1A18] hover:bg-[#F5F2E8]'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>

        {/* Category dropdown */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="bg-white border-2 border-[#1A1A18] rounded-none h-8 text-xs font-medium uppercase tracking-wider px-2 outline-none cursor-pointer text-[#1A1A18]"
        >
          <option value="All Categories">All Categories</option>
          {ALL_CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        {/* State dropdown */}
        <select
          value={stateFilter}
          onChange={(e) => setStateFilter(e.target.value)}
          className="bg-white border-2 border-[#1A1A18] rounded-none h-8 text-xs font-medium uppercase tracking-wider px-2 outline-none cursor-pointer text-[#1A1A18]"
        >
          <option value="All States">All States</option>
          {ALL_STATES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        {/* Search */}
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="SEARCH WORK ID, MP, AGENCY..."
          className="min-w-[200px] flex-1 sm:flex-initial px-3 h-8 text-xs border-2 border-[#1A1A18] bg-white text-[#1A1A18] placeholder:text-[#8A8680] outline-none focus:bg-[#F5F2E8] transition-colors font-medium uppercase tracking-wide"
        />

        {/* Rows per page */}
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-xs uppercase tracking-wider text-[#8A8680]">ROWS:</span>
          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="bg-white border-2 border-[#1A1A18] rounded-none h-8 text-xs font-medium uppercase tracking-wider px-2 outline-none cursor-pointer text-[#1A1A18]"
          >
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="border-2 border-[#1A1A18] bg-white overflow-x-auto">
        <table className="w-full text-sm border-collapse min-w-[720px]">
          <thead>
            <tr className="border-b-2 border-[#1A1A18] bg-[#F5F2E8]">
              {COLS.map((col) => (
                <th
                  key={col.key}
                  onClick={() => toggleSort(col.key)}
                  className="px-3 sm:px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#8A8680] whitespace-nowrap cursor-pointer select-none hover:text-[#1A1A18]"
                >
                  <span className="inline-flex items-center gap-1">
                    {col.label}
                    <SortIcon active={sortKey === col.key} dir={sortDir} />
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-[#1A1A18]">
            {pagedRows.length === 0 ? (
              <tr>
                <td colSpan={COLS.length} className="px-4 py-12 text-center text-sm uppercase tracking-wider text-[#8A8680]">
                  NO RECORDS MATCH FILTERS
                </td>
              </tr>
            ) : (
              pagedRows.map((row) => {
                const statusStyle = STATUS_STYLES[row.status] ?? 'bg-white text-[#1A1A18] border border-[#1A1A18]'
                const riskStyle   = RISK_BADGE[row.risk_level] ?? 'bg-white text-[#1A1A18] border border-[#1A1A18]'
                const paidPct     = (Number(row.payment_released_pct) * 100).toFixed(1)
                return (
                  <tr key={row.work_id} className="hover:bg-[#F5F2E8] transition-colors cursor-default">
                    {/* Work ID */}
                    <td className="px-3 sm:px-4 py-3 whitespace-nowrap">
                      <span className="font-mono text-xs font-medium text-[#1A1A18]">{row.work_id}</span>
                    </td>

                    {/* Category */}
                    <td className="px-3 sm:px-4 py-3 text-xs text-[#4A4845] max-w-[200px] truncate" title={row.work_category}>
                      {row.work_category.length > 30 ? `${row.work_category.slice(0, 30)}\u2026` : row.work_category}
                    </td>

                    {/* State */}
                    <td className="px-3 sm:px-4 py-3 text-xs text-[#4A4845] whitespace-nowrap">
                      {row.state}
                    </td>

                    {/* MP */}
                    <td className="px-3 sm:px-4 py-3 text-xs text-[#4A4845] max-w-[160px] truncate" title={row.mp_name}>
                      {row.mp_name
                        ? (row.mp_name.length > 24 ? `${row.mp_name.slice(0, 24)}\u2026` : row.mp_name)
                        : '\u2014'}
                    </td>

                    {/* Status */}
                    <td className="px-3 sm:px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 py-0.5 text-xs font-black uppercase tracking-wider ${statusStyle}`}>
                        {row.status}
                      </span>
                    </td>

                    {/* Cost */}
                    <td className="px-3 sm:px-4 py-3 text-xs font-medium text-[#1A1A18] whitespace-nowrap">
                      {formatCost(row.cost_estimate)}
                    </td>

                    {/* Paid % */}
                    <td className="px-3 sm:px-4 py-3 text-xs font-medium text-[#4A4845] text-right whitespace-nowrap">
                      {paidPct}%
                    </td>

                    {/* Risk */}
                    <td className="px-3 sm:px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 py-0.5 text-xs font-black uppercase tracking-wider ${riskStyle}`}>
                        {row.risk_level.toUpperCase()} {Number(row.risk_score).toFixed(1)}
                      </span>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination footer */}
      <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <span className="text-xs font-medium uppercase tracking-wider text-[#8A8680]">
          SHOWING {totalFiltered === 0 ? 0 : startIdx + 1}–{Math.min(startIdx + pageSize, totalFiltered)} OF {totalFiltered} RECORDS
        </span>
        <div className="flex items-center gap-2 justify-between sm:justify-end">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="border-2 border-[#1A1A18] bg-white rounded-none h-8 px-3 text-xs font-medium uppercase tracking-wider hover:bg-[#E8C018] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            ← PREV
          </button>
          <span className="text-xs font-medium uppercase tracking-wider text-[#1A1A18]">
            PAGE {page} OF {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="border-2 border-[#1A1A18] bg-white rounded-none h-8 px-3 text-xs font-medium uppercase tracking-wider hover:bg-[#E8C018] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            NEXT →
          </button>
        </div>
      </div>
    </div>
  )
}

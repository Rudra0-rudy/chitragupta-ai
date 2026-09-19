import { useState, useMemo, useCallback, useEffect } from 'react'
import { AlertTriangle, ChevronUp, ChevronDown, X, CheckCircle2, ArrowUpRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { ALERTS, TOTAL_COUNT } from '@/data/mockAlerts'
import type { AlertRow } from '@/data/mockAlerts'

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const SEVERITY_ORDER = ['High', 'Medium', 'Low'] as const
type Severity = (typeof SEVERITY_ORDER)[number]
type SortKey = 'work_id' | 'risk_score' | 'risk_level' | 'state' | 'work_category'
type SortDir = 'asc' | 'desc'

// Severity → badge styles (Bauhaus palette, 0px radius)
const SEVERITY_BADGE: Record<string, string> = {
  High:   'bg-[#C8302A] text-[#F5F2E8]',
  Medium: 'bg-[#E8C018] text-[#1A1A18]',
  Low:    'bg-[#F5F2E8] text-[#1A1A18] border border-[#8A8680]',
}

const ANOMALY_LABEL: Record<string, string> = {
  cost_inflation:       'Cost Inflation',
  premature_payment:    'Premature Payment',
  suspiciously_fast:    'Suspiciously Fast',
  vendor_concentration: 'Vendor Concentration',
}

// ---------------------------------------------------------------------------
// Model Validation — computed once at module level from ALERTS
// ---------------------------------------------------------------------------

const synthetic    = ALERTS.filter((r) => r.is_synthetic_anomaly === 'True')
const injectedN    = synthetic.length
const caughtHigh   = synthetic.filter((r) => r.risk_level === 'High').length
const caughtMedium = synthetic.filter((r) => r.risk_level === 'Medium').length
const missedLow    = synthetic.filter((r) => r.risk_level === 'Low').length
const catchRate    = injectedN > 0 ? (((caughtHigh + caughtMedium) / injectedN) * 100).toFixed(1) : '0.0'

// ---------------------------------------------------------------------------
// Subcomponents
// ---------------------------------------------------------------------------

function ModelValidationPanel() {
  const cells = [
    { label: 'Injected',        value: injectedN.toLocaleString(),    accent: false },
    { label: 'Caught (High)',   value: caughtHigh.toLocaleString(),   accent: false },
    { label: 'Caught (Medium)', value: caughtMedium.toLocaleString(), accent: false },
    { label: 'Missed (Low)',    value: missedLow.toLocaleString(),    accent: false },
    { label: 'Catch Rate',      value: `${catchRate}%`,               accent: true  },
  ]

  return (
    <div className="border-2 border-[#1A1A18] bg-[#FFFFFF] mb-6">
      {/* Header */}
      <div className="border-b-2 border-[#1A1A18] bg-[#F5F2E8] px-4 py-2">
        <p className="text-xs font-medium uppercase tracking-wider text-[#8A8680]">
          Model Validation — Synthetic Anomaly Catch Rate
        </p>
      </div>
      {/* Cells */}
      <div className="flex">
        {cells.map((cell, i) => (
          <div
            key={cell.label}
            className={`flex-1 px-4 py-4 ${i < cells.length - 1 ? 'border-r-2 border-[#1A1A18]' : ''}`}
          >
            <p className="text-xs font-medium uppercase tracking-wider text-[#8A8680] mb-1">
              {cell.label}
            </p>
            <p
              className={`text-2xl font-black tracking-tight ${
                cell.accent ? 'text-[#1E3878]' : 'text-[#1A1A18]'
              }`}
            >
              {cell.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ISO / LOF cell renderer
function ModelFlagCell({ flag, score }: { flag: string; score: string }) {
  const flagged = flag === '-1'
  return (
    <div className="flex flex-col gap-0.5">
      <span
        className={`text-xs font-black uppercase tracking-wider ${
          flagged ? 'text-[#C8302A]' : 'text-[#8A8680]'
        }`}
      >
        {flagged ? '■ FLAGGED' : '□ clear'}
      </span>
      <span className="text-[10px] text-[#8A8680] font-mono">
        {parseFloat(score).toFixed(3)}
      </span>
    </div>
  )
}

// Synthetic tag
function SyntheticCell({ isSynthetic, anomalyType }: { isSynthetic: string; anomalyType: string }) {
  if (isSynthetic !== 'True') return <span className="text-[#8A8680] text-xs">—</span>
  return (
    <span className="inline-block px-2 py-0.5 text-xs font-black uppercase tracking-wider bg-[#E8C018] text-[#1A1A18]">
      {ANOMALY_LABEL[anomalyType] ?? anomalyType}
    </span>
  )
}

// Risk score bar
function RiskBar({ score }: { score: number }) {
  const pct = Math.min(100, Math.max(0, score))
  const color = pct >= 75 ? '#C8302A' : pct >= 40 ? '#E8C018' : '#1E3878'
  return (
    <div className="flex items-center gap-2 min-w-[90px]">
      <div className="flex-1 h-1.5 bg-[#F5F2E8] border border-[#1A1A18]">
        <div style={{ width: `${pct}%`, backgroundColor: color }} className="h-full" />
      </div>
      <span className="text-xs font-mono text-[#4A4845] w-8 text-right shrink-0">
        {pct.toFixed(1)}
      </span>
    </div>
  )
}

// Sort indicator
function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  if (!active) return <span className="inline-block w-3 h-3 opacity-20"><ChevronUp className="w-3 h-3" /></span>
  return dir === 'asc'
    ? <ChevronUp className="w-3 h-3 text-[#1E3878]" />
    : <ChevronDown className="w-3 h-3 text-[#1E3878]" />
}

// ---------------------------------------------------------------------------
// Detail Sheet (slide-over)
// ---------------------------------------------------------------------------

function AlertDetailSheet({
  row,
  onClose,
  dismissed,
  escalated,
  onDismiss,
  onEscalate,
}: {
  row: AlertRow | null
  onClose: () => void
  dismissed: Set<string>
  escalated: Set<string>
  onDismiss: (id: string) => void
  onEscalate: (id: string) => void
}) {
  return (
    <AnimatePresence>
      {row && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-[#1A1A18]/30"
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.aside
            key="sheet"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.28, ease: [0.32, 0, 0.67, 0] }}
            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-[480px] bg-[#FFFFFF] border-l-2 border-[#1A1A18] flex flex-col overflow-y-auto"
          >
            {/* Sheet header */}
            <div className="flex items-start justify-between gap-4 px-6 py-5 border-b-2 border-[#1A1A18] bg-[#F5F2E8] shrink-0">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-[#8A8680] mb-0.5">
                  Work Detail
                </p>
                <p className="text-lg font-black uppercase tracking-tight text-[#1A1A18]">
                  {row.work_id}
                </p>
                <p className="text-xs text-[#4A4845] mt-0.5">{row.work_description}</p>
              </div>
              <button
                onClick={onClose}
                className="shrink-0 p-1.5 border-2 border-[#1A1A18] hover:bg-[#1A1A18] hover:text-[#F5F2E8] transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Sheet body */}
            <div className="flex-1 px-6 py-5 space-y-6">

              {/* Status badges row */}
              <div className="flex flex-wrap gap-2">
                <span className={`px-2 py-0.5 text-xs font-black uppercase tracking-wider ${SEVERITY_BADGE[row.risk_level] ?? ''}`}>
                  {row.risk_level}
                </span>
                <span className="px-2 py-0.5 text-xs font-black uppercase tracking-wider bg-[#F5F2E8] border border-[#1A1A18] text-[#1A1A18]">
                  {row.status}
                </span>
                {row.is_synthetic_anomaly === 'True' && (
                  <span className="px-2 py-0.5 text-xs font-black uppercase tracking-wider bg-[#E8C018] text-[#1A1A18]">
                    {ANOMALY_LABEL[row.anomaly_type] ?? row.anomaly_type}
                  </span>
                )}
                {dismissed.has(row.work_id) && (
                  <span className="px-2 py-0.5 text-xs font-black uppercase tracking-wider bg-[#8A8680] text-[#F5F2E8]">
                    Dismissed
                  </span>
                )}
                {escalated.has(row.work_id) && (
                  <span className="px-2 py-0.5 text-xs font-black uppercase tracking-wider bg-[#1E3878] text-[#F5F2E8]">
                    ★ Escalated
                  </span>
                )}
              </div>

              {/* Meta grid */}
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-[#8A8680] mb-2 border-b border-[#1A1A18] pb-1">
                  Project Info
                </p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  {[
                    ['State',       row.state],
                    ['MP',          row.mp_name],
                    ['Category',    row.work_category],
                    ['Agency',      row.implementing_agency],
                    ['Sanction',    row.sanction_date],
                    ['Duration',    row.completion_days ? `${row.completion_days} days` : 'N/A'],
                    ['Payment',     `${(parseFloat(row.payment_released_pct) * 100).toFixed(1)}% released`],
                    ['Cost Est.',   `₹${parseFloat(row.cost_estimate).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`],
                  ].map(([label, val]) => (
                    <div key={label}>
                      <p className="text-[10px] uppercase tracking-wider text-[#8A8680]">{label}</p>
                      <p className="font-medium text-[#1A1A18] truncate text-xs" title={val}>{val}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Engineered features */}
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-[#8A8680] mb-2 border-b border-[#1A1A18] pb-1">
                  Engineered Features
                </p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  {[
                    ['Cost Ratio',          row.cost_ratio],
                    ['Speed Ratio',         row.completion_speed_ratio],
                    ['Vendor Concentration',row.vendor_concentration],
                    ['Payment Mismatch',    row.payment_mismatch],
                  ].map(([label, val]) => (
                    <div key={label} className="bg-[#F5F2E8] border border-[#1A1A18] px-3 py-2">
                      <p className="text-[10px] uppercase tracking-wider text-[#8A8680]">{label}</p>
                      <p className="font-black text-sm font-mono text-[#1A1A18]">
                        {parseFloat(val).toFixed(3)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Model Scores */}
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-[#8A8680] mb-2 border-b border-[#1A1A18] pb-1">
                  Model Signals
                </p>

                {/* Risk score gauge */}
                <div className="mb-4">
                  <div className="flex items-baseline justify-between mb-1">
                    <span className="text-xs uppercase tracking-wider text-[#8A8680]">Risk Score</span>
                    <span className="text-3xl font-black text-[#1A1A18] font-mono">
                      {parseFloat(row.risk_score).toFixed(1)}
                    </span>
                  </div>
                  <div className="h-3 bg-[#F5F2E8] border-2 border-[#1A1A18]">
                    <div
                      style={{
                        width: `${Math.min(100, parseFloat(row.risk_score))}%`,
                        backgroundColor: parseFloat(row.risk_score) >= 75 ? '#C8302A' : parseFloat(row.risk_score) >= 40 ? '#E8C018' : '#1E3878',
                      }}
                      className="h-full"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* ISO */}
                  <div className="bg-[#F5F2E8] border-2 border-[#1A1A18] px-3 py-3">
                    <p className="text-[10px] uppercase tracking-wider text-[#8A8680] mb-1">ISO (Isolation Forest)</p>
                    <p className={`text-sm font-black uppercase tracking-wider ${row.iso_flag === '-1' ? 'text-[#C8302A]' : 'text-[#8A8680]'}`}>
                      {row.iso_flag === '-1' ? '■ FLAGGED' : '□ clear'}
                    </p>
                    <p className="text-xs font-mono text-[#4A4845] mt-0.5">
                      score: {parseFloat(row.iso_score).toFixed(4)}
                    </p>
                  </div>
                  {/* LOF */}
                  <div className="bg-[#F5F2E8] border-2 border-[#1A1A18] px-3 py-3">
                    <p className="text-[10px] uppercase tracking-wider text-[#8A8680] mb-1">LOF (Local Outlier Factor)</p>
                    <p className={`text-sm font-black uppercase tracking-wider ${row.lof_flag === '-1' ? 'text-[#C8302A]' : 'text-[#8A8680]'}`}>
                      {row.lof_flag === '-1' ? '■ FLAGGED' : '□ clear'}
                    </p>
                    <p className="text-xs font-mono text-[#4A4845] mt-0.5">
                      score: {parseFloat(row.lof_score).toFixed(4)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sheet footer — actions */}
            <div className="shrink-0 border-t-2 border-[#1A1A18] px-6 py-4 bg-[#F5F2E8] flex gap-3">
              <button
                onClick={() => onDismiss(row.work_id)}
                disabled={dismissed.has(row.work_id)}
                className="flex items-center gap-2 px-4 py-2 text-xs font-black uppercase tracking-wider border-2 border-[#1A1A18] bg-[#FFFFFF] hover:bg-[#F5F2E8] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                {dismissed.has(row.work_id) ? 'Dismissed' : 'Dismiss'}
              </button>
              <button
                onClick={() => onEscalate(row.work_id)}
                disabled={escalated.has(row.work_id)}
                className="flex items-center gap-2 px-4 py-2 text-xs font-black uppercase tracking-wider border-2 border-[#1A1A18] bg-[#1E3878] text-[#F5F2E8] hover:bg-[#1A1A18] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ArrowUpRight className="w-3.5 h-3.5" />
                {escalated.has(row.work_id) ? 'Escalated' : 'Escalate'}
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

export function Alerts() {
  // Filter state
  const [severityFilter, setSeverityFilter] = useState<Severity | 'ALL'>('High')
  const [search, setSearch] = useState('')

  // Pagination state
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(50)

  // Reset page on filter/search/size change
  useEffect(() => {
    setPage(1)
  }, [severityFilter, search, pageSize])

  // Sort state — default: risk_score descending
  const [sortKey, setSortKey] = useState<SortKey>('risk_score')
  const [sortDir, setSortDir] = useState<SortDir>('desc')

  // Detail sheet
  const [selectedRow, setSelectedRow] = useState<AlertRow | null>(null)

  // Triage actions (local state only — no network requests)
  const [dismissed, setDismissed] = useState<Set<string>>(new Set())
  const [escalated, setEscalated] = useState<Set<string>>(new Set())

  const handleDismiss = useCallback((id: string) => {
    setDismissed((prev) => new Set(prev).add(id))
  }, [])

  const handleEscalate = useCallback((id: string) => {
    setEscalated((prev) => new Set(prev).add(id))
  }, [])

  const toggleSort = useCallback((key: SortKey) => {
    setSortKey((prev) => {
      if (prev === key) {
        setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
        return key
      }
      setSortDir('desc')
      return key
    })
  }, [])

  // Filtered + sorted rows
  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase()
    let rows = ALERTS

    if (severityFilter !== 'ALL') {
      rows = rows.filter((r) => r.risk_level === severityFilter)
    }

    if (q) {
      rows = rows.filter(
        (r) =>
          r.work_id.toLowerCase().includes(q) ||
          r.state.toLowerCase().includes(q) ||
          r.mp_name.toLowerCase().includes(q) ||
          r.work_category.toLowerCase().includes(q) ||
          r.implementing_agency.toLowerCase().includes(q),
      )
    }

    rows = [...rows].sort((a, b) => {
      let cmp = 0
      if (sortKey === 'risk_score') {
        cmp = parseFloat(a.risk_score) - parseFloat(b.risk_score)
      } else if (sortKey === 'risk_level') {
        cmp = SEVERITY_ORDER.indexOf(a.risk_level as Severity) - SEVERITY_ORDER.indexOf(b.risk_level as Severity)
      } else {
        cmp = a[sortKey].localeCompare(b[sortKey])
      }
      return sortDir === 'asc' ? cmp : -cmp
    })

    return rows
  }, [severityFilter, search, sortKey, sortDir])

  // Pagination slice
  const totalFiltered = filteredRows.length
  const totalPages = Math.max(1, Math.ceil(totalFiltered / pageSize))
  const startIdx = (page - 1) * pageSize
  const pagedRows = filteredRows.slice(startIdx, startIdx + pageSize)

  // KPI strip (live from filteredRows — represents current view)
  const highCount   = useMemo(() => ALERTS.filter((r) => r.risk_level === 'High').length,   [])
  const mediumCount = useMemo(() => ALERTS.filter((r) => r.risk_level === 'Medium').length, [])

  const COLS: { key: SortKey | null; label: string; sortable: boolean }[] = [
    { key: 'work_id',       label: 'Work ID',    sortable: true },
    { key: 'work_category', label: 'Category',   sortable: true },
    { key: 'state',         label: 'State',      sortable: true },
    { key: 'risk_score',    label: 'Risk Score', sortable: true },
    { key: 'risk_level',    label: 'Severity',   sortable: true },
    { key: null,            label: 'ISO',        sortable: false },
    { key: null,            label: 'LOF',        sortable: false },
    { key: null,            label: 'Synthetic',  sortable: false },
  ]

  return (
    <div className="p-8">
      {/* Page header */}
      <div className="flex items-center gap-3 mb-6 border-b-2 border-[#1A1A18] pb-4">
        <AlertTriangle className="w-5 h-5 text-[#C8302A]" strokeWidth={2} />
        <h1 className="text-xl font-black uppercase tracking-tight text-[#1A1A18]">Alerts</h1>
        <div className="ml-auto flex items-center gap-4">
          <span className="text-xs font-medium uppercase tracking-wider text-[#8A8680]">
            High: <strong className="text-[#C8302A]">{highCount}</strong>
          </span>
          <span className="text-xs font-medium uppercase tracking-wider text-[#8A8680]">
            Medium: <strong className="text-[#E8C018]">{mediumCount}</strong>
          </span>
        </div>
      </div>

      {/* Model Validation Panel */}
      <ModelValidationPanel />

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        {/* Severity pills */}
        <div className="flex items-center gap-0 border-2 border-[#1A1A18]">
          {(['ALL', 'High', 'Medium', 'Low'] as const).map((sev) => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              className={`px-3 py-1.5 text-xs font-black uppercase tracking-wider transition-colors border-r-2 border-[#1A1A18] last:border-r-0 ${
                severityFilter === sev
                  ? 'bg-[#1A1A18] text-[#F5F2E8]'
                  : 'bg-[#FFFFFF] text-[#1A1A18] hover:bg-[#F5F2E8]'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>

        {/* Search */}
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search work ID, state, MP, agency…"
          className="flex-1 min-w-[220px] px-3 py-1.5 text-xs border-2 border-[#1A1A18] bg-[#FFFFFF] text-[#1A1A18] placeholder:text-[#8A8680] outline-none focus:bg-[#F5F2E8] transition-colors font-medium uppercase tracking-wide"
        />

        <div className="ml-auto flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider text-[#8A8680]">ROWS:</span>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="bg-white border-2 border-[#1A1A18] rounded-none h-8 text-xs font-medium uppercase tracking-wider px-2 outline-none cursor-pointer"
            >
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
          {/* Row counter */}
          <span className="text-xs font-medium uppercase tracking-wider text-[#8A8680] whitespace-nowrap">
            SHOWING {totalFiltered.toLocaleString()} OF {TOTAL_COUNT.toLocaleString()} RECORDS
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="border-2 border-[#1A1A18] bg-[#FFFFFF] overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b-2 border-[#1A1A18] bg-[#F5F2E8]">
              {COLS.map((col) => (
                <th
                  key={col.label}
                  onClick={col.sortable && col.key ? () => toggleSort(col.key as SortKey) : undefined}
                  className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#8A8680] whitespace-nowrap ${
                    col.sortable ? 'cursor-pointer select-none hover:text-[#1A1A18]' : ''
                  }`}
                >
                  <span className="inline-flex items-center gap-1">
                    {col.label}
                    {col.sortable && col.key && (
                      <SortIcon active={sortKey === col.key} dir={sortDir} />
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-[#1A1A18]">
            {pagedRows.length === 0 ? (
              <tr>
                <td colSpan={COLS.length} className="px-4 py-12 text-center text-xs uppercase tracking-wider text-[#8A8680]">
                  No records match the current filter
                </td>
              </tr>
            ) : (
              pagedRows.map((row) => {
                const isDismissed = dismissed.has(row.work_id)
                const isEscalated = escalated.has(row.work_id)
                return (
                  <tr
                    key={row.work_id}
                    onClick={() => setSelectedRow(row)}
                    className={`cursor-pointer transition-colors hover:bg-[#F5F2E8] ${
                      isDismissed ? 'opacity-40' : ''
                    }`}
                  >
                    {/* Work ID */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        {isEscalated && (
                          <span className="text-[#1E3878] text-xs font-black">★</span>
                        )}
                        <span className={`font-mono text-xs font-medium text-[#1A1A18] ${isDismissed ? 'line-through' : ''}`}>
                          {row.work_id}
                        </span>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-4 py-3 text-xs text-[#4A4845] max-w-[180px] truncate" title={row.work_category}>
                      {row.work_category}
                    </td>

                    {/* State */}
                    <td className="px-4 py-3 text-xs text-[#4A4845] whitespace-nowrap">
                      {row.state}
                    </td>

                    {/* Risk Score */}
                    <td className="px-4 py-3 min-w-[120px]">
                      <RiskBar score={parseFloat(row.risk_score)} />
                    </td>

                    {/* Severity */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 py-0.5 text-xs font-black uppercase tracking-wider ${SEVERITY_BADGE[row.risk_level] ?? ''}`}>
                        {row.risk_level}
                      </span>
                    </td>

                    {/* ISO */}
                    <td className="px-4 py-3">
                      <ModelFlagCell flag={row.iso_flag} score={row.iso_score} />
                    </td>

                    {/* LOF */}
                    <td className="px-4 py-3">
                      <ModelFlagCell flag={row.lof_flag} score={row.lof_score} />
                    </td>

                    {/* Synthetic */}
                    <td className="px-4 py-3">
                      <SyntheticCell
                        isSynthetic={row.is_synthetic_anomaly}
                        anomalyType={row.anomaly_type}
                      />
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="mt-4 flex items-center justify-between">
        <div className="text-xs font-medium uppercase tracking-wider text-[#8A8680]">
          SHOWING {totalFiltered === 0 ? 0 : startIdx + 1}–{Math.min(startIdx + pageSize, totalFiltered)} OF {totalFiltered} RECORDS
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="border-2 border-[#1A1A18] bg-white rounded-none h-8 px-3 text-xs font-medium uppercase tracking-wider hover:bg-[#E8C018] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            &larr; PREV
          </button>
          <span className="text-xs font-medium uppercase tracking-wider text-[#1A1A18]">
            PAGE {page} OF {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="border-2 border-[#1A1A18] bg-white rounded-none h-8 px-3 text-xs font-medium uppercase tracking-wider hover:bg-[#E8C018] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            NEXT &rarr;
          </button>
        </div>
      </div>

      {/* Detail Sheet */}
      <AlertDetailSheet
        row={selectedRow}
        onClose={() => setSelectedRow(null)}
        dismissed={dismissed}
        escalated={escalated}
        onDismiss={handleDismiss}
        onEscalate={handleEscalate}
      />
    </div>
  )
}

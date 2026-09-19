import { LayoutDashboard } from 'lucide-react'

// ---------------------------------------------------------------------------
// F1 — KPI demo data
// Fields are intentionally named after the planned SummaryResponse contract
// (total_sanctioned, works_completed, high_risk_count, avg_risk_score) so that
// the F13 / TanStack Query integration can replace this object without touching
// the card JSX below.
// ---------------------------------------------------------------------------
interface OverviewStats {
  total_sanctioned: string
  works_completed: string
  high_risk_count: string
  avg_risk_score: string
}

const overviewStats: OverviewStats = {
  total_sanctioned: '₹4,466 Cr',
  works_completed: '12,840',
  high_risk_count: '318',
  avg_risk_score: '6.4 / 10',
}

const kpiCards = [
  { label: 'Total Sanctioned', value: overviewStats.total_sanctioned, sub: 'FY 2024–25' },
  { label: 'Works Completed',  value: overviewStats.works_completed,  sub: 'Across all MPs' },
  { label: 'High-Risk Cases',  value: overviewStats.high_risk_count,  sub: 'Flagged for review' },
  { label: 'Avg Risk Score',   value: overviewStats.avg_risk_score,   sub: 'Portfolio average' },
] as const

export function Overview() {
  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-8 border-b-2 border-[#1A1A18] pb-4">
        <LayoutDashboard className="w-5 h-5 text-[#1E3878]" strokeWidth={2} />
        <h1 className="text-xl font-black uppercase tracking-tight text-[#1A1A18]">Overview</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {kpiCards.map((card) => (
          <div
            key={card.label}
            className="border-2 border-[#1A1A18] bg-[#FFFFFF] p-5"
          >
            <p className="text-xs font-medium uppercase tracking-wider text-[#8A8680] mb-1">
              {card.label}
            </p>
            <p className="text-2xl font-black tracking-tight text-[#1A1A18] mb-0.5">
              {card.value}
            </p>
            <p className="text-xs text-[#4A4845]">{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Placeholder chart area */}
      <div className="border-2 border-[#1A1A18] bg-[#FFFFFF] p-6 flex items-center justify-center h-64">
        <p className="text-sm font-medium uppercase tracking-wider text-[#8A8680]">
          Analytics charts — coming soon
        </p>
      </div>
    </div>
  )
}

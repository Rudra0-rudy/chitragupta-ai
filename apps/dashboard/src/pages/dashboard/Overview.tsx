import { LayoutDashboard } from 'lucide-react'
import { ALERTS } from '@/data/mockAlerts'
import type { AlertRow } from '@/data/mockAlerts'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'

// ---------------------------------------------------------------------------
// KPI aggregates — computed once at module level from the real CSV dataset
// ---------------------------------------------------------------------------

function formatCrore(rupees: number): string {
  const crore = rupees / 1e7
  if (crore >= 1000) return `₹${Math.round(crore).toLocaleString('en-IN')} Cr`
  return `₹${crore.toFixed(1)} Cr`
}

const totalSanctioned = ALERTS.reduce(
  (sum, r) => sum + (Number(r.cost_estimate) || 0),
  0,
)

const worksCompleted = ALERTS.filter((r) => r.status === 'Completed').length

const highRiskCount = ALERTS.filter((r) => r.risk_level === 'High').length

const avgRiskScore =
  ALERTS.length > 0
    ? ALERTS.reduce((sum, r) => sum + (Number(r.risk_score) || 0), 0) / ALERTS.length
    : 0

const kpiCards = [
  { label: 'Total Sanctioned', value: formatCrore(totalSanctioned),               sub: 'FY 2024–25' },
  { label: 'Works Completed',  value: worksCompleted.toLocaleString('en-IN'),      sub: 'Across all MPs' },
  { label: 'High-Risk Cases',  value: highRiskCount.toLocaleString('en-IN'),       sub: 'Flagged for review' },
  { label: 'Avg Risk Score',   value: avgRiskScore.toFixed(1),                     sub: 'Portfolio average' },
] as const

// ---------------------------------------------------------------------------
// Trend data — monthly Sanctioned vs Expenditure from the CSV
// ---------------------------------------------------------------------------

interface TrendPoint {
  month: string
  sanctioned: number
  expenditure: number
}

function buildTrendData(rows: AlertRow[]): TrendPoint[] {
  const buckets = new Map<string, { sanctioned: number; expenditure: number }>()

  for (const row of rows) {
    const date = row.sanction_date
    if (!date || date.length < 7) continue
    const key = date.slice(0, 7) // "YYYY-MM"

    const cost  = Number(row.cost_estimate)        || 0
    const paid  = Number(row.payment_released_pct) || 0
    const spent = cost * paid // payment_released_pct is decimal 0-1

    const bucket = buckets.get(key) ?? { sanctioned: 0, expenditure: 0 }
    bucket.sanctioned  += cost
    bucket.expenditure += spent
    buckets.set(key, bucket)
  }

  const sorted  = [...buckets.entries()].sort(([a], [b]) => a.localeCompare(b))
  const last12  = sorted.slice(-12)

  return last12.map(([key, v]) => {
    const [year, month] = key.split('-')
    const monthLabel = new Date(Number(year), Number(month) - 1, 1).toLocaleString('en-IN', {
      month: 'short',
    })
    return {
      month:       monthLabel,
      sanctioned:  Math.round(v.sanctioned  / 1e7),
      expenditure: Math.round(v.expenditure / 1e7),
    }
  })
}

const trendData: TrendPoint[] = buildTrendData(ALERTS)

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

      {/* F2 — Expenditure vs Sanction Trend chart */}
      <div className="border-2 border-[#1A1A18] bg-[#FFFFFF] p-6">
        <p className="text-sm font-black uppercase tracking-wider text-[#1A1A18] mb-0.5">
          Expenditure vs Sanction Trend
        </p>
        <p className="text-xs text-[#8A8680] mb-4">Monthly comparison — FY 2024–25</p>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={trendData} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="#8A8680" strokeDasharray="4 4" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: '#4A4845', fontFamily: 'Inter Variable, sans-serif' }}
              axisLine={{ stroke: '#1A1A18' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#4A4845', fontFamily: 'Inter Variable, sans-serif' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v: number) => `₹${v}Cr`}
              width={60}
            />
            <Tooltip
              contentStyle={{
                border: '2px solid #1A1A18',
                borderRadius: 0,
                background: '#FFFFFF',
                fontSize: 12,
                fontFamily: 'Inter Variable, sans-serif',
              }}
              formatter={(value, name) => [
                `₹${value} Cr`,
                String(name).charAt(0).toUpperCase() + String(name).slice(1),
              ]}
            />
            <Legend
              wrapperStyle={{ fontSize: 12, fontFamily: 'Inter Variable, sans-serif', paddingTop: 12 }}
            />
            <Line
              type="monotone"
              dataKey="sanctioned"
              name="Sanctioned"
              stroke="#1E3878"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, stroke: '#1E3878', strokeWidth: 2, fill: '#FFFFFF' }}
            />
            <Line
              type="monotone"
              dataKey="expenditure"
              name="Expenditure"
              stroke="#E8C018"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, stroke: '#E8C018', strokeWidth: 2, fill: '#FFFFFF' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}


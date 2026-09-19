import { useMemo } from 'react'
import { LayoutDashboard } from 'lucide-react'
import { ALERTS } from '@/data/mockAlerts'
import type { AlertRow } from '@/data/mockAlerts'
import { useRoleStore } from '@/stores/useRoleStore'
import { filterByRole } from '@/lib/roleFilter'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts'

// ---------------------------------------------------------------------------
// Helpers (pure, module-level — no dependency on role)
// ---------------------------------------------------------------------------

function formatCrore(rupees: number): string {
  const crore = rupees / 1e7
  if (crore >= 1000) return `₹${Math.round(crore).toLocaleString('en-IN')} Cr`
  return `₹${crore.toFixed(1)} Cr`
}

// ---------------------------------------------------------------------------
// Trend helper — pure function, computes monthly buckets from any row slice
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


// ---------------------------------------------------------------------------
// State Risk helper — computes average risk per state
// ---------------------------------------------------------------------------

interface StateRisk {
  state: string
  avgRisk: number
  works: number
}

function buildStateRiskData(rows: AlertRow[]): StateRisk[] {
  const buckets = new Map<string, { sum: number; count: number }>()

  for (const row of rows) {
    const score = Number(row.risk_score) || 0
    const bucket = buckets.get(row.state) ?? { sum: 0, count: 0 }
    bucket.sum += score
    bucket.count += 1
    buckets.set(row.state, bucket)
  }

  return [...buckets.entries()]
    .map(([state, { sum, count }]) => ({
      state,
      avgRisk: count > 0 ? sum / count : 0,
      works: count,
    }))
    .sort((a, b) => b.avgRisk - a.avgRisk)
    .slice(0, 5)
}


// ---------------------------------------------------------------------------
// F3 — Risk Distribution demo data
// Keys align with future RiskDistributionResponse shape.
// ---------------------------------------------------------------------------
interface RiskSegment {
  label: string
  value: number
  color: string
}

function buildRiskData(rows: AlertRow[]): RiskSegment[] {
  const total = rows.length
  if (total === 0) {
    return [
      { label: 'Low Risk',    value: 0, color: '#1E3878' },
      { label: 'Medium Risk', value: 0, color: '#E8C018' },
      { label: 'High Risk',   value: 0, color: '#C8302A' },
    ]
  }

  const low    = rows.filter((r) => r.risk_level === 'Low').length
  const medium = rows.filter((r) => r.risk_level === 'Medium').length
  const high   = rows.filter((r) => r.risk_level === 'High').length

  return [
    { label: 'Low Risk',    value: Math.round((low    / total) * 100), color: '#1E3878' },
    { label: 'Medium Risk', value: Math.round((medium / total) * 100), color: '#E8C018' },
    { label: 'High Risk',   value: Math.round((high   / total) * 100), color: '#C8302A' },
  ]
}

export function Overview() {
  const { activeRole } = useRoleStore()

  const { kpiCards, trendData, stateData, riskData } = useMemo(() => {
    const scopedRows = filterByRole(ALERTS, activeRole)

    const totalSanctioned = scopedRows.reduce(
      (sum, r) => sum + (Number(r.cost_estimate) || 0),
      0,
    )
    const worksCompleted = scopedRows.filter((r) => r.status === 'Completed').length
    const highRiskCount  = scopedRows.filter((r) => r.risk_level === 'High').length
    const avgRiskScore   =
      scopedRows.length > 0
        ? scopedRows.reduce((sum, r) => sum + (Number(r.risk_score) || 0), 0) / scopedRows.length
        : 0

    return {
      kpiCards: [
        { label: 'Total Sanctioned', value: formatCrore(totalSanctioned),          sub: 'FY 2024–25' },
        { label: 'Works Completed',  value: worksCompleted.toLocaleString('en-IN'), sub: 'Across all MPs' },
        { label: 'High-Risk Cases',  value: highRiskCount.toLocaleString('en-IN'),  sub: 'Flagged for review' },
        { label: 'Avg Risk Score',   value: avgRiskScore.toFixed(1),                sub: 'Portfolio average' },
      ],
      trendData: buildTrendData(scopedRows),
      stateData: buildStateRiskData(scopedRows),
      riskData: buildRiskData(scopedRows),
    }
  }, [activeRole])
  return (
    <div className="p-4 sm:p-6 lg:p-8">
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
      <div className="border-2 border-[#1A1A18] bg-[#FFFFFF] p-4 sm:p-6">
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

      {/* F3 — Risk Distribution donut chart */}
      <div className="border-2 border-[#1A1A18] bg-[#FFFFFF] p-4 sm:p-6 mt-4">
        <p className="text-sm font-black uppercase tracking-wider text-[#1A1A18] mb-0.5">
          Risk Distribution
        </p>
        <p className="text-xs text-[#8A8680] mb-4">Current portfolio risk breakdown</p>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={riskData}
              dataKey="value"
              nameKey="label"
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={110}
              strokeWidth={2}
              stroke="#1A1A18"
              label={({ label, percent }: { label: string; percent: number }) =>
                `${label} ${(percent * 100).toFixed(0)}%`
              }
              labelLine={{ stroke: '#4A4845', strokeWidth: 1 }}
            >
              {riskData.map((seg) => (
                <Cell key={seg.label} fill={seg.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                border: '2px solid #1A1A18',
                borderRadius: 0,
                background: '#FFFFFF',
                fontSize: 12,
                fontFamily: 'Inter Variable, sans-serif',
              }}
              formatter={(value: number, name: string) => [`${value}%`, name]}
            />
            <Legend
              wrapperStyle={{ fontSize: 12, fontFamily: 'Inter Variable, sans-serif', paddingTop: 12 }}
              formatter={(value: string) => (
                <span style={{ color: '#1A1A18' }}>{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* F4 — Top 5 Risk States horizontal bar chart */}
      <div className="border-2 border-[#1A1A18] bg-[#FFFFFF] p-4 sm:p-6 mt-4">
        <p className="text-sm font-black uppercase tracking-wider text-[#1A1A18] mb-0.5">
          Top 5 Risk States
        </p>
        <p className="text-xs text-[#8A8680] mb-4">
          States with highest average risk score in current scope
        </p>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart
            data={stateData}
            layout="vertical"
            margin={{ top: 4, right: 48, left: 8, bottom: 4 }}
          >
            <CartesianGrid stroke="#8A8680" strokeDasharray="4 4" horizontal={false} />
            <XAxis
              type="number"
              domain={[0, 100]}
              tickCount={6}
              tick={{ fontSize: 11, fill: '#4A4845', fontFamily: 'Inter Variable, sans-serif' }}
              axisLine={{ stroke: '#1A1A18' }}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="state"
              width={110}
              tick={{ fontSize: 11, fill: '#4A4845', fontFamily: 'Inter Variable, sans-serif' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                border: '2px solid #1A1A18',
                borderRadius: 0,
                background: '#FFFFFF',
                fontSize: 12,
                fontFamily: 'Inter Variable, sans-serif',
              }}
              cursor={{ fill: '#F5F2E8' }}
              formatter={(value, name, props) => {
                if (name === 'avgRisk') {
                  const works = (props as { payload?: { works?: number } })?.payload?.works ?? 0
                  return [`${Number(value).toFixed(1)} (${works} works)`, 'Avg Risk Score']
                }
                return [String(value), String(name)]
              }}
            />
            <Bar dataKey="avgRisk" name="avgRisk" fill="#1E3878" radius={0} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}


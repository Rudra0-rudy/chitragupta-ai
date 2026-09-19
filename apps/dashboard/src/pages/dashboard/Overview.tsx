import { LayoutDashboard } from 'lucide-react'
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

// ---------------------------------------------------------------------------
// F2 — Expenditure vs Sanction trend demo data (FY 2024–25)
// Keyed as { month, sanctioned, expenditure } to align with future API shape.
// ---------------------------------------------------------------------------
interface TrendPoint {
  month: string
  sanctioned: number
  expenditure: number
}

const trendData: TrendPoint[] = [
  { month: 'Apr', sanctioned: 340, expenditure: 210 },
  { month: 'May', sanctioned: 360, expenditure: 240 },
  { month: 'Jun', sanctioned: 390, expenditure: 270 },
  { month: 'Jul', sanctioned: 420, expenditure: 300 },
  { month: 'Aug', sanctioned: 450, expenditure: 330 },
  { month: 'Sep', sanctioned: 480, expenditure: 355 },
  { month: 'Oct', sanctioned: 510, expenditure: 380 },
  { month: 'Nov', sanctioned: 530, expenditure: 400 },
  { month: 'Dec', sanctioned: 560, expenditure: 420 },
  { month: 'Jan', sanctioned: 590, expenditure: 450 },
  { month: 'Feb', sanctioned: 620, expenditure: 480 },
  { month: 'Mar', sanctioned: 650, expenditure: 510 },
]

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
              formatter={(value: number, name: string) => [
                `₹${value} Cr`,
                name.charAt(0).toUpperCase() + name.slice(1),
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

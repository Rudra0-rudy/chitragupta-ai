import { HardHat } from 'lucide-react'

const MOCK_WORKS = [
  { id: 'WK-4821', name: 'Rural Road Construction — Varanasi West', status: 'IN PROGRESS', amount: '₹48.5 L', risk: 82 },
  { id: 'WK-4820', name: 'Community Health Centre — Mirzapur', status: 'COMPLETED', amount: '₹92.0 L', risk: 12 },
  { id: 'WK-4819', name: 'Primary School Renovation — Chandauli', status: 'SANCTIONED', amount: '₹36.2 L', risk: 35 },
  { id: 'WK-4818', name: 'Drinking Water Supply — Ghazipur', status: 'IN PROGRESS', amount: '₹61.8 L', risk: 54 },
  { id: 'WK-4817', name: 'Bridge Repair — Jaunpur', status: 'ON HOLD', amount: '₹28.4 L', risk: 67 },
]

const STATUS_STYLES: Record<string, string> = {
  'IN PROGRESS': 'bg-[#1E3878] text-[#F5F2E8]',
  'COMPLETED': 'bg-[#1A1A18] text-[#F5F2E8]',
  'SANCTIONED': 'bg-[#E8C018] text-[#1A1A18]',
  'ON HOLD': 'bg-[#C8302A] text-[#F5F2E8]',
}

function RiskBar({ score }: { score: number }) {
  const color = score >= 70 ? '#C8302A' : score >= 40 ? '#E8C018' : '#1E3878'
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 border border-[#1A1A18] bg-[#F5F2E8]">
        <div
          style={{ width: `${score}%`, backgroundColor: color }}
          className="h-full"
        />
      </div>
      <span className="text-xs font-medium text-[#4A4845] w-7 text-right">{score}</span>
    </div>
  )
}

export function Works() {
  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-8 border-b-2 border-[#1A1A18] pb-4">
        <HardHat className="w-5 h-5 text-[#1E3878]" strokeWidth={2} />
        <h1 className="text-xl font-black uppercase tracking-tight text-[#1A1A18]">Works</h1>
        <span className="ml-auto text-xs font-medium uppercase tracking-wider text-[#8A8680]">
          {MOCK_WORKS.length} records
        </span>
      </div>

      <div className="border-2 border-[#1A1A18] bg-[#FFFFFF] overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b-2 border-[#1A1A18] bg-[#F5F2E8]">
              {['Work ID', 'Name', 'Status', 'Amount', 'Risk Score'].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#8A8680]"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-[#1A1A18]">
            {MOCK_WORKS.map((w) => (
              <tr key={w.id} className="hover:bg-[#F5F2E8] transition-colors">
                <td className="px-4 py-3 font-medium text-[#1A1A18] whitespace-nowrap">{w.id}</td>
                <td className="px-4 py-3 text-[#4A4845] max-w-xs truncate">{w.name}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className={`px-2 py-0.5 text-xs font-black uppercase tracking-wider ${STATUS_STYLES[w.status]}`}>
                    {w.status}
                  </span>
                </td>
                <td className="px-4 py-3 font-medium text-[#1A1A18] whitespace-nowrap">{w.amount}</td>
                <td className="px-4 py-3 min-w-32">
                  <RiskBar score={w.risk} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

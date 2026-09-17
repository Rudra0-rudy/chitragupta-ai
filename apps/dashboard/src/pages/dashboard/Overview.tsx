import { LayoutDashboard } from 'lucide-react'

export function Overview() {
  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-8 border-b-2 border-[#1A1A18] pb-4">
        <LayoutDashboard className="w-5 h-5 text-[#1E3878]" strokeWidth={2} />
        <h1 className="text-xl font-black uppercase tracking-tight text-[#1A1A18]">Overview</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Sanctioned', value: '₹4,466 Cr', sub: 'FY 2024–25' },
          { label: 'Works Completed', value: '12,840', sub: 'Across all MPs' },
          { label: 'Anomalies Flagged', value: '1,284', sub: 'Pending review' },
          { label: 'Compliance Rate', value: '94.2%', sub: 'This quarter' },
        ].map((card) => (
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

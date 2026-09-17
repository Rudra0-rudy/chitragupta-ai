import { AlertTriangle } from 'lucide-react'

const MOCK_ALERTS = [
  { id: 'ALT-001', severity: 'HIGH', district: 'Varanasi', description: 'Duplicate payment detected — Work ID #WK-4821', ts: '2025-03-14 09:12' },
  { id: 'ALT-002', severity: 'MEDIUM', district: 'Patna', description: 'Contractor blacklisted — Bid submitted for Work ID #WK-3910', ts: '2025-03-13 14:40' },
  { id: 'ALT-003', severity: 'LOW', district: 'Jaipur', description: 'Utilization certificate delay — 45 days overdue', ts: '2025-03-12 11:05' },
  { id: 'ALT-004', severity: 'HIGH', district: 'Bhopal', description: 'Over-inflated cost estimate — 3.2x market rate', ts: '2025-03-11 16:22' },
  { id: 'ALT-005', severity: 'MEDIUM', district: 'Lucknow', description: 'Fund lapse risk — 78% unspent with 30 days remaining', ts: '2025-03-10 08:30' },
]

const SEVERITY_STYLES: Record<string, string> = {
  HIGH: 'bg-[#C8302A] text-[#F5F2E8]',
  MEDIUM: 'bg-[#E8C018] text-[#1A1A18]',
  LOW: 'bg-[#F5F2E8] text-[#1A1A18] border border-[#1A1A18]',
}

export function Alerts() {
  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-8 border-b-2 border-[#1A1A18] pb-4">
        <AlertTriangle className="w-5 h-5 text-[#C8302A]" strokeWidth={2} />
        <h1 className="text-xl font-black uppercase tracking-tight text-[#1A1A18]">Alerts</h1>
        <span className="ml-auto text-xs font-medium uppercase tracking-wider text-[#8A8680]">
          {MOCK_ALERTS.length} active
        </span>
      </div>

      <div className="border-2 border-[#1A1A18] bg-[#FFFFFF] divide-y-2 divide-[#1A1A18]">
        {MOCK_ALERTS.map((alert) => (
          <div key={alert.id} className="flex items-start gap-4 px-5 py-4">
            <span
              className={`mt-0.5 shrink-0 px-2 py-0.5 text-xs font-black uppercase tracking-wider ${SEVERITY_STYLES[alert.severity]}`}
            >
              {alert.severity}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#1A1A18] truncate">{alert.description}</p>
              <p className="text-xs text-[#8A8680] mt-0.5">{alert.district} · {alert.ts}</p>
            </div>
            <span className="shrink-0 text-xs font-medium uppercase tracking-wider text-[#8A8680]">
              {alert.id}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

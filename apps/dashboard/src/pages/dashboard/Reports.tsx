import { FileBarChart2, Download } from 'lucide-react'

const MOCK_REPORTS = [
  { id: 'RPT-2025-Q1', title: 'Q1 2025 — MPLADS Utilization Summary', type: 'QUARTERLY', date: '2025-04-01', status: 'READY' },
  { id: 'RPT-2025-M2', title: 'February 2025 — Anomaly Detection Report', type: 'MONTHLY', date: '2025-03-05', status: 'READY' },
  { id: 'RPT-2025-M1', title: 'January 2025 — Compliance Audit Report', type: 'MONTHLY', date: '2025-02-03', status: 'READY' },
  { id: 'RPT-2024-Q4', title: 'Q4 2024 — Year-End Fund Absorption', type: 'QUARTERLY', date: '2025-01-15', status: 'READY' },
  { id: 'RPT-2025-AD', title: 'Ad-hoc — Varanasi District Deep Dive', type: 'AD-HOC', date: '2025-03-20', status: 'GENERATING' },
]

const TYPE_STYLES: Record<string, string> = {
  QUARTERLY: 'bg-[#1E3878] text-[#F5F2E8]',
  MONTHLY: 'bg-[#1A1A18] text-[#F5F2E8]',
  'AD-HOC': 'bg-[#E8C018] text-[#1A1A18]',
}

export function Reports() {
  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-8 border-b-2 border-[#1A1A18] pb-4">
        <FileBarChart2 className="w-5 h-5 text-[#1E3878]" strokeWidth={2} />
        <h1 className="text-xl font-black uppercase tracking-tight text-[#1A1A18]">Reports</h1>
      </div>

      <div className="border-2 border-[#1A1A18] bg-[#FFFFFF] divide-y-2 divide-[#1A1A18]">
        {MOCK_REPORTS.map((report) => (
          <div key={report.id} className="flex items-center gap-4 px-5 py-4">
            <span
              className={`shrink-0 px-2 py-0.5 text-xs font-black uppercase tracking-wider ${TYPE_STYLES[report.type]}`}
            >
              {report.type}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#1A1A18] truncate">{report.title}</p>
              <p className="text-xs text-[#8A8680] mt-0.5">{report.id} · Generated {report.date}</p>
            </div>
            {report.status === 'READY' ? (
              <button
                className="shrink-0 flex items-center gap-1.5 px-3 h-8 border-2 border-[#1A1A18] text-xs font-medium uppercase tracking-wider text-[#1A1A18] hover:bg-[#E8C018] transition-colors"
                title="Download report"
              >
                <Download className="w-3.5 h-3.5" strokeWidth={2} />
                Download
              </button>
            ) : (
              <span className="shrink-0 text-xs font-medium uppercase tracking-wider text-[#8A8680] animate-pulse">
                Generating…
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

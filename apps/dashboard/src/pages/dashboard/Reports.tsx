import { useMemo } from 'react'
import { FileBarChart2, Download } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { useRoleStore } from '@/stores/useRoleStore'
import { filterByRole } from '@/lib/roleFilter'
import { ALERTS } from '@/data/mockAlerts'
import { downloadCsv } from '@/lib/downloadCsv'

function formatCrore(rupees: number): string {
  const crore = rupees / 1e7
  if (crore >= 1000) return `₹${Math.round(crore).toLocaleString('en-IN')} Cr`
  if (crore >= 1) return `₹${crore.toFixed(1)} Cr`
  return `₹${(rupees / 1e5).toFixed(1)} L`
}

function formatAnomalyType(raw: string): string {
  return raw.replace(/_/g, ' ').toUpperCase()
}

export function Reports() {
  const { activeRole } = useRoleStore()
  const scopedRows = useMemo(() => filterByRole(ALERTS, activeRole), [activeRole])

  // 1. Anomaly Types
  const { anomalyCsvRows, anomalyData, catchRate, caughtHigh, caughtMedium, missedLow, totalAnomalies } = useMemo(() => {
    const syntheticAnomalies = scopedRows.filter((r) => r.is_synthetic_anomaly === 'True')
    const total = syntheticAnomalies.length
    const groups = new Map<string, { count: number; high: number; medium: number; low: number }>()

    for (const r of syntheticAnomalies) {
      const g = groups.get(r.anomaly_type) ?? { count: 0, high: 0, medium: 0, low: 0 }
      g.count++
      if (r.risk_level === 'High') g.high++
      else if (r.risk_level === 'Medium') g.medium++
      else if (r.risk_level === 'Low') g.low++
      groups.set(r.anomaly_type, g)
    }

    const data = Array.from(groups.entries())
      .map(([k, v]) => ({
        anomaly_type: k,
        ...v,
        pct: total > 0 ? (v.count / total) * 100 : 0,
      }))
      .sort((a, b) => b.count - a.count)

    const cHigh = syntheticAnomalies.filter((r) => r.risk_level === 'High').length
    const cMed = syntheticAnomalies.filter((r) => r.risk_level === 'Medium').length
    const mLow = syntheticAnomalies.filter((r) => r.risk_level === 'Low').length
    const rate = total > 0 ? ((cHigh + cMed) / total) * 100 : 0

    const csvRows = data.map((d) => ({
      'Anomaly Type': formatAnomalyType(d.anomaly_type),
      Count: d.count,
      '% of Anomalies': d.pct.toFixed(1) + '%',
      'Caught High': d.high,
      'Caught Medium': d.medium,
      'Missed Low': d.low,
    }))

    return { anomalyCsvRows: csvRows, anomalyData: data, catchRate: rate, caughtHigh: cHigh, caughtMedium: cMed, missedLow: mLow, totalAnomalies: total }
  }, [scopedRows])

  // 2. MP-wise
  const { mpCsvRows, mpData } = useMemo(() => {
    const groups = new Map<
      string,
      { state: string; works: number; high_risk: number; risk_sum: number; cost_sum: number }
    >()
    for (const r of scopedRows) {
      const name = r.mp_name
      if (!name) continue
      const g = groups.get(name) ?? { state: r.state, works: 0, high_risk: 0, risk_sum: 0, cost_sum: 0 }
      g.works++
      if (r.risk_level === 'High') g.high_risk++
      g.risk_sum += Number(r.risk_score) || 0
      g.cost_sum += Number(r.cost_estimate) || 0
      groups.set(name, g)
    }
    const data = Array.from(groups.entries())
      .map(([k, v]) => ({
        mp_name: k,
        state: v.state,
        works: v.works,
        high_risk: v.high_risk,
        avg_risk: v.works > 0 ? v.risk_sum / v.works : 0,
        total_sanctioned: v.cost_sum,
      }))
      .sort((a, b) => b.works - a.works)

    const csvRows = data.map((d) => ({
      'MP Name': d.mp_name,
      State: d.state,
      Works: d.works,
      'High Risk': d.high_risk,
      'Avg Risk Score': d.avg_risk.toFixed(1),
      'Total Sanctioned': formatCrore(d.total_sanctioned),
    }))
    return { mpCsvRows: csvRows, mpData: data }
  }, [scopedRows])

  // 3. State-wise
  const { stateCsvRows, stateData } = useMemo(() => {
    const groups = new Map<
      string,
      { works: number; high_risk: number; risk_sum: number; cost_sum: number }
    >()
    for (const r of scopedRows) {
      const st = r.state
      if (!st) continue
      const g = groups.get(st) ?? { works: 0, high_risk: 0, risk_sum: 0, cost_sum: 0 }
      g.works++
      if (r.risk_level === 'High') g.high_risk++
      g.risk_sum += Number(r.risk_score) || 0
      g.cost_sum += Number(r.cost_estimate) || 0
      groups.set(st, g)
    }
    const data = Array.from(groups.entries())
      .map(([k, v]) => ({
        state: k,
        works: v.works,
        high_risk: v.high_risk,
        avg_risk: v.works > 0 ? v.risk_sum / v.works : 0,
        total_sanctioned: v.cost_sum,
      }))
      .sort((a, b) => b.works - a.works)

    const csvRows = data.map((d) => ({
      State: d.state,
      Works: d.works,
      'High Risk': d.high_risk,
      'Avg Risk Score': d.avg_risk.toFixed(1),
      'Total Sanctioned': formatCrore(d.total_sanctioned),
    }))
    return { stateCsvRows: csvRows, stateData: data }
  }, [scopedRows])

  const triggerClass = "rounded-none text-xs font-medium uppercase tracking-wider px-4 py-3 h-auto border-t-0 border-r-0 border-b-0 border-l-4 border-l-transparent text-[#4A4845] bg-transparent hover:bg-[#E8C018] hover:text-[#1A1A18] data-active:bg-white data-active:text-[#1A1A18] data-active:border-l-[#C8302A] after:hidden"
  const listClass = "bg-[#F5F2E8] border-b-2 border-[#1A1A18] rounded-none w-full justify-start gap-0 p-0 h-auto"

  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-8 border-b-2 border-[#1A1A18] pb-4">
        <FileBarChart2 className="w-5 h-5 text-[#1E3878]" strokeWidth={2} />
        <h1 className="text-xl font-black uppercase tracking-tight text-[#1A1A18]">Reports</h1>
      </div>

      <Tabs defaultValue="anomaly" className="w-full">
        <TabsList className={listClass}>
          <TabsTrigger value="anomaly" className={triggerClass}>Anomaly Types</TabsTrigger>
          <TabsTrigger value="mp" className={triggerClass}>MP-wise</TabsTrigger>
          <TabsTrigger value="state" className={triggerClass}>State-wise</TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="anomaly" className="rounded-none">
            <div className="flex justify-end mb-4">
              <button
                onClick={() => downloadCsv(`anomaly-types-${activeRole.toLowerCase()}.csv`, anomalyCsvRows)}
                disabled={anomalyData.length === 0}
                className="flex items-center gap-1.5 bg-[#1E3878] text-[#F5F2E8] border-2 border-[#1A1A18] rounded-none h-8 px-3 text-xs font-bold uppercase tracking-wider hover:bg-[#1A1A18] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Download className="w-[14px] h-[14px]" strokeWidth={2.5} />
                EXPORT CSV
              </button>
            </div>
            
            <div className="border-2 border-[#1A1A18] bg-white overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b-2 border-[#1A1A18] bg-[#F5F2E8]">
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#8A8680]">Anomaly Type</th>
                    <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-[#8A8680]">Count</th>
                    <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-[#8A8680]">% of Anomalies</th>
                    <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-[#8A8680]">Caught High</th>
                    <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-[#8A8680]">Caught Medium</th>
                    <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-[#8A8680]">Missed Low</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-[#1A1A18]">
                  {anomalyData.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center text-sm uppercase tracking-wider text-[#8A8680] py-12">
                        NO SYNTHETIC ANOMALIES IN THIS SCOPE
                      </td>
                    </tr>
                  ) : (
                    anomalyData.map((d) => (
                      <tr key={d.anomaly_type} className="hover:bg-[#F5F2E8] transition-colors">
                        <td className="px-4 py-3">{formatAnomalyType(d.anomaly_type)}</td>
                        <td className="px-4 py-3 text-right">{d.count.toLocaleString('en-IN')}</td>
                        <td className="px-4 py-3 text-right">{d.pct.toFixed(1)}%</td>
                        <td className="px-4 py-3 text-right">{d.high.toLocaleString('en-IN')}</td>
                        <td className="px-4 py-3 text-right">{d.medium.toLocaleString('en-IN')}</td>
                        <td className="px-4 py-3 text-right">{d.low.toLocaleString('en-IN')}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="border-2 border-t-0 border-[#1A1A18] bg-[#FFFFFF] px-4 py-3 flex flex-wrap gap-x-2 gap-y-1 items-center justify-between text-xs font-medium uppercase tracking-wider text-[#8A8680]">
              <span>Total anomalies: {totalAnomalies.toLocaleString('en-IN')}</span>
              <span className="hidden sm:inline">·</span>
              <span>Caught (High): {caughtHigh.toLocaleString('en-IN')}</span>
              <span className="hidden sm:inline">·</span>
              <span>Caught (Medium): {caughtMedium.toLocaleString('en-IN')}</span>
              <span className="hidden sm:inline">·</span>
              <span>Missed (Low): {missedLow.toLocaleString('en-IN')}</span>
              <span className="hidden sm:inline">·</span>
              <span className="text-[#1E3878] font-black">Catch rate: {catchRate.toFixed(1)}%</span>
            </div>
          </TabsContent>

          <TabsContent value="mp" className="rounded-none">
            <div className="flex justify-end mb-4">
              <button
                onClick={() => downloadCsv(`mp-wise-${activeRole.toLowerCase()}.csv`, mpCsvRows)}
                disabled={mpData.length === 0}
                className="flex items-center gap-1.5 bg-[#1E3878] text-[#F5F2E8] border-2 border-[#1A1A18] rounded-none h-8 px-3 text-xs font-bold uppercase tracking-wider hover:bg-[#1A1A18] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Download className="w-[14px] h-[14px]" strokeWidth={2.5} />
                EXPORT CSV
              </button>
            </div>
            
            <div className="border-2 border-[#1A1A18] bg-white overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b-2 border-[#1A1A18] bg-[#F5F2E8]">
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#8A8680]">MP Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#8A8680]">State</th>
                    <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-[#8A8680]">Works</th>
                    <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-[#8A8680]">High Risk</th>
                    <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-[#8A8680]">Avg Risk Score</th>
                    <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-[#8A8680]">Total Sanctioned</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-[#1A1A18]">
                  {mpData.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center text-sm uppercase tracking-wider text-[#8A8680] py-12">
                        NO MPS IN THIS SCOPE
                      </td>
                    </tr>
                  ) : (
                    mpData.map((d) => (
                      <tr key={d.mp_name} className="hover:bg-[#F5F2E8] transition-colors">
                        <td className="px-4 py-3 max-w-[240px] truncate" title={d.mp_name}>
                          {d.mp_name.length > 40 ? `${d.mp_name.slice(0, 40)}…` : d.mp_name}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">{d.state}</td>
                        <td className="px-4 py-3 text-right">{d.works.toLocaleString('en-IN')}</td>
                        <td className="px-4 py-3 text-right">{d.high_risk.toLocaleString('en-IN')}</td>
                        <td className="px-4 py-3 text-right">{d.avg_risk.toFixed(1)}</td>
                        <td className="px-4 py-3 text-right">{formatCrore(d.total_sanctioned)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="state" className="rounded-none">
            <div className="flex justify-end mb-4">
              <button
                onClick={() => downloadCsv(`state-wise-${activeRole.toLowerCase()}.csv`, stateCsvRows)}
                disabled={stateData.length === 0}
                className="flex items-center gap-1.5 bg-[#1E3878] text-[#F5F2E8] border-2 border-[#1A1A18] rounded-none h-8 px-3 text-xs font-bold uppercase tracking-wider hover:bg-[#1A1A18] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Download className="w-[14px] h-[14px]" strokeWidth={2.5} />
                EXPORT CSV
              </button>
            </div>
            
            <div className="border-2 border-[#1A1A18] bg-white overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b-2 border-[#1A1A18] bg-[#F5F2E8]">
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#8A8680]">State</th>
                    <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-[#8A8680]">Works</th>
                    <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-[#8A8680]">High Risk</th>
                    <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-[#8A8680]">Avg Risk Score</th>
                    <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-[#8A8680]">Total Sanctioned</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-[#1A1A18]">
                  {stateData.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center text-sm uppercase tracking-wider text-[#8A8680] py-12">
                        NO STATES IN THIS SCOPE
                      </td>
                    </tr>
                  ) : (
                    stateData.map((d) => (
                      <tr key={d.state} className="hover:bg-[#F5F2E8] transition-colors">
                        <td className="px-4 py-3 whitespace-nowrap">{d.state}</td>
                        <td className="px-4 py-3 text-right">{d.works.toLocaleString('en-IN')}</td>
                        <td className="px-4 py-3 text-right">{d.high_risk.toLocaleString('en-IN')}</td>
                        <td className="px-4 py-3 text-right">{d.avg_risk.toFixed(1)}</td>
                        <td className="px-4 py-3 text-right">{formatCrore(d.total_sanctioned)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}

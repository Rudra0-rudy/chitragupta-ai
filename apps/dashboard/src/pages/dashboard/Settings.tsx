import { Settings as SettingsIcon } from 'lucide-react'
import { useSettingsStore } from '@/stores/useSettingsStore'

function ThresholdRow({
  label,
  description,
  value,
  min,
  max,
  step,
  suffix,
  onChange,
}: {
  label: string
  description: string
  value: number
  min: number
  max: number
  step: number
  suffix: string
  onChange: (n: number) => void
}) {
  return (
    <div className="px-5 py-4">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-sm font-medium text-[#1A1A18] block mb-1">{label}</span>
          <p className="text-sm text-[#4A4845] mb-2">{description}</p>
        </div>
      </div>
      <div className="flex items-center mt-2">
        <input
          type="number"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-24 h-9 px-2 text-right text-sm font-medium text-[#1A1A18] bg-white border-2 border-[#1A1A18] rounded-none focus:outline-none focus:border-[#1E3878]"
        />
        <span className="text-xs font-medium uppercase tracking-wider text-[#8A8680] ml-2">
          {suffix}
        </span>
      </div>
      <div className="relative h-2 bg-[#F5F2E8] border border-[#1A1A18] mt-2">
        <div
          className="h-full bg-[#1E3878]"
          style={{ width: `${((value - min) / (max - min)) * 100}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-[#8A8680] mt-1">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  )
}

export function Settings() {
  const {
    sanctionDelayDays,
    costOverrunRatio,
    tenderBypassLimitLakh,
    setSanctionDelayDays,
    setCostOverrunRatio,
    setTenderBypassLimitLakh,
    resetToDefaults,
  } = useSettingsStore()

  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-8 border-b-2 border-[#1A1A18] pb-4">
        <SettingsIcon className="w-5 h-5 text-[#1A1A18]" strokeWidth={2} />
        <h1 className="text-xl font-black uppercase tracking-tight text-[#1A1A18]">Settings</h1>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Section A — Compliance Thresholds */}
        <div className="border-2 border-[#1A1A18] bg-white">
          <div className="border-b-2 border-[#1A1A18] bg-[#F5F2E8] px-5 py-3">
            <h2 className="text-xs font-medium uppercase tracking-wider text-[#4A4845]">
              Compliance Thresholds
            </h2>
          </div>
          <div className="divide-y-2 divide-[#1A1A18]">
            <ThresholdRow
              label="Sanction Delay Threshold"
              description="Works awaiting sanction beyond this many days are flagged for review."
              value={sanctionDelayDays}
              min={15}
              max={90}
              step={1}
              suffix="days"
              onChange={setSanctionDelayDays}
            />
            <ThresholdRow
              label="Cost Overrun Ratio"
              description="Expenditure exceeding the estimated cost by this factor is flagged."
              value={costOverrunRatio}
              min={1.0}
              max={3.0}
              step={0.1}
              suffix="x"
              onChange={setCostOverrunRatio}
            />
            <ThresholdRow
              label="Tender Bypass Limit"
              description="Works above this amount without a tender reference are flagged."
              value={tenderBypassLimitLakh}
              min={5}
              max={50}
              step={1}
              suffix="₹ lakh"
              onChange={setTenderBypassLimitLakh}
            />
          </div>
        </div>

        {/* Section B — Pipeline Configuration */}
        <div className="border-2 border-[#1A1A18] bg-white">
          <div className="border-b-2 border-[#1A1A18] bg-[#F5F2E8] px-5 py-3">
            <h2 className="text-xs font-medium uppercase tracking-wider text-[#4A4845]">
              Pipeline Configuration
            </h2>
          </div>
          <div className="divide-y-0">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#8A8680] last:border-b-0">
              <span className="text-sm text-[#4A4845]">Isolation Forest contamination</span>
              <span className="text-sm font-bold text-[#1A1A18] font-mono">0.05</span>
            </div>
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#8A8680] last:border-b-0">
              <span className="text-sm text-[#4A4845]">LOF n_neighbors</span>
              <span className="text-sm font-bold text-[#1A1A18] font-mono">20</span>
            </div>
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#8A8680] last:border-b-0">
              <span className="text-sm text-[#4A4845]">Peer group minimum size</span>
              <span className="text-sm font-bold text-[#1A1A18] font-mono">10</span>
            </div>
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#8A8680] last:border-b-0">
              <span className="text-sm text-[#4A4845]">Risk tiers</span>
              <span className="text-sm font-bold text-[#1A1A18] font-mono">Low / Medium / High</span>
            </div>
          </div>
        </div>

        {/* Section C — Actions */}
        <div>
          <div className="flex justify-end">
            <button
              onClick={resetToDefaults}
              className="bg-[#C8302A] text-[#F5F2E8] border-2 border-[#1A1A18] rounded-none font-bold uppercase text-xs tracking-wider px-5 py-2 hover:bg-[#1A1A18] transition-colors"
            >
              Reset to Defaults
            </button>
          </div>
          <p className="text-xs text-[#8A8680] mt-4 leading-relaxed">
            Thresholds are stored locally for reference. The production ML pipeline applies its own server-side values when classifying works.
          </p>
        </div>
      </div>
    </div>
  )
}

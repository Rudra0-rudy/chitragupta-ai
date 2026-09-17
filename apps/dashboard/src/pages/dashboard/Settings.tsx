import { Settings as SettingsIcon } from 'lucide-react'

const SETTING_GROUPS = [
  {
    title: 'Notification Preferences',
    items: [
      { label: 'Email alerts for HIGH severity anomalies', enabled: true },
      { label: 'Weekly digest report via email', enabled: true },
      { label: 'SMS alerts for fund lapse warnings', enabled: false },
    ],
  },
  {
    title: 'Data & Display',
    items: [
      { label: 'Show risk scores in works table', enabled: true },
      { label: 'Enable auto-refresh (every 5 min)', enabled: false },
      { label: 'Compact table density', enabled: false },
    ],
  },
]

export function Settings() {
  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-8 border-b-2 border-[#1A1A18] pb-4">
        <SettingsIcon className="w-5 h-5 text-[#1A1A18]" strokeWidth={2} />
        <h1 className="text-xl font-black uppercase tracking-tight text-[#1A1A18]">Settings</h1>
      </div>

      <div className="max-w-2xl space-y-6">
        {SETTING_GROUPS.map((group) => (
          <div key={group.title} className="border-2 border-[#1A1A18] bg-[#FFFFFF]">
            <div className="px-5 py-3 border-b-2 border-[#1A1A18] bg-[#F5F2E8]">
              <h2 className="text-xs font-medium uppercase tracking-wider text-[#4A4845]">
                {group.title}
              </h2>
            </div>
            <div className="divide-y-2 divide-[#1A1A18]">
              {group.items.map((item) => (
                <div key={item.label} className="flex items-center justify-between px-5 py-4">
                  <span className="text-sm text-[#4A4845]">{item.label}</span>
                  {/* Toggle placeholder */}
                  <div
                    className={`w-11 h-6 border-2 border-[#1A1A18] flex items-center px-0.5 cursor-pointer transition-colors ${
                      item.enabled ? 'bg-[#1E3878]' : 'bg-[#F5F2E8]'
                    }`}
                    role="switch"
                    aria-checked={item.enabled}
                    tabIndex={0}
                  >
                    <div
                      className={`w-4 h-4 bg-[#F5F2E8] border border-[#1A1A18] transition-transform ${
                        item.enabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <p className="text-xs font-medium uppercase tracking-wider text-[#8A8680]">
          Settings persistence — coming in a later task.
        </p>
      </div>
    </div>
  )
}

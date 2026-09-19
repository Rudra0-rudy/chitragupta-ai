import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface SettingsState {
  sanctionDelayDays: number
  costOverrunRatio: number
  tenderBypassLimitLakh: number
  setSanctionDelayDays: (n: number) => void
  setCostOverrunRatio: (n: number) => void
  setTenderBypassLimitLakh: (n: number) => void
  resetToDefaults: () => void
}

export const DEFAULT_SETTINGS = {
  sanctionDelayDays: 45,
  costOverrunRatio: 1.5,
  tenderBypassLimitLakh: 10,
} as const

function clamp(n: number, min: number, max: number): number {
  if (Number.isNaN(n)) return min
  return Math.min(max, Math.max(min, n))
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...DEFAULT_SETTINGS,
      setSanctionDelayDays: (n) => set({ sanctionDelayDays: clamp(n, 15, 90) }),
      setCostOverrunRatio: (n) => set({ costOverrunRatio: clamp(n, 1.0, 3.0) }),
      setTenderBypassLimitLakh: (n) => set({ tenderBypassLimitLakh: clamp(n, 5, 50) }),
      resetToDefaults: () => set({ ...DEFAULT_SETTINGS }),
    }),
    { name: 'chitragupta-settings' }
  )
)

import { parseCsv } from '@/lib/parseCsv'
import csvRaw from '../trained_model_results.csv?raw'

export interface AlertRow {
  work_id: string
  state: string
  mp_name: string
  work_category: string
  work_description: string
  cost_estimate: string
  implementing_agency: string
  sanction_date: string
  completion_days: string
  payment_released_pct: string
  status: string
  /** "True" | "False" */
  is_synthetic_anomaly: string
  /** "cost_inflation" | "premature_payment" | "suspiciously_fast" | "vendor_concentration" | "" */
  anomaly_type: string
  cost_ratio: string
  completion_days_filled: string
  completion_speed_ratio: string
  vendor_concentration: string
  expected_payment: string
  payment_mismatch: string
  /** "1" (clear) | "-1" (flagged) */
  iso_flag: string
  iso_score: string
  /** "1" (clear) | "-1" (flagged) */
  lof_flag: string
  lof_score: string
  /** "Low" | "Medium" | "High" */
  risk_level: string
  risk_score: string
}

export const ALERTS: AlertRow[] = parseCsv(csvRaw) as unknown as AlertRow[]

export const TOTAL_COUNT = ALERTS.length

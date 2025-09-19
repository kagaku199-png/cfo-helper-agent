export interface Scenario {
  id: string
  name: string
  revenue: number
  expenses: number
  growth_rate: number
  burn_rate: number
  cash_on_hand: number
  created_at: string
  updated_at: string
}

export interface UsageTracking {
  id: string
  action: string
  scenario_id?: string
  timestamp: string
  metadata: Record<string, any>
}

export interface FinancialMetrics {
  runway: number
  profitMargin: number
  monthlyBurn: number
  projectedRevenue: number
}

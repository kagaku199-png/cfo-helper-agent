import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    const { scenarioId, reportType = "full" } = body

    // Get scenario data
    const { data: scenario, error: scenarioError } = await supabase
      .from("scenarios")
      .select("*")
      .eq("id", scenarioId)
      .single()

    if (scenarioError || !scenario) {
      return NextResponse.json({ error: "Scenario not found" }, { status: 404 })
    }

    // Calculate financial metrics
    const profitMargin = ((scenario.revenue - scenario.expenses) / scenario.revenue) * 100
    const monthlyProfit = scenario.revenue - scenario.expenses
    const runway = scenario.cash_on_hand / scenario.burn_rate
    const breakEvenPoint = scenario.cash_on_hand / monthlyProfit

    // Generate projections (12 months)
    const projections = []
    let currentRevenue = scenario.revenue
    let currentCash = scenario.cash_on_hand

    for (let month = 1; month <= 12; month++) {
      const monthlyGrowth = scenario.growth_rate / 100 / 12 // Monthly growth rate
      currentRevenue = currentRevenue * (1 + monthlyGrowth)
      const monthlyProfit = currentRevenue - scenario.expenses
      currentCash = currentCash + monthlyProfit - scenario.burn_rate

      projections.push({
        month,
        revenue: Math.round(currentRevenue),
        expenses: scenario.expenses,
        profit: Math.round(monthlyProfit),
        cashBalance: Math.round(currentCash),
        runway: currentCash > 0 ? Math.round(currentCash / scenario.burn_rate) : 0,
      })
    }

    const reportData = {
      scenario,
      metrics: {
        profitMargin: Math.round(profitMargin * 100) / 100,
        monthlyProfit: Math.round(monthlyProfit),
        runway: Math.round(runway * 10) / 10,
        breakEvenPoint: Math.round(breakEvenPoint * 10) / 10,
      },
      projections,
      generatedAt: new Date().toISOString(),
      reportType,
    }

    // Track usage
    await supabase.from("usage_tracking").insert({
      action: "report_generated",
      scenario_id: scenarioId,
      metadata: { reportType },
    })

    return NextResponse.json({ report: reportData })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

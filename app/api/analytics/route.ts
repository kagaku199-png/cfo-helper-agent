import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const scenarioId = searchParams.get("scenario_id")

    // Get usage analytics
    let usageQuery = supabase.from("usage_tracking").select("*").order("timestamp", { ascending: false })

    if (scenarioId) {
      usageQuery = usageQuery.eq("scenario_id", scenarioId)
    }

    const { data: usage, error: usageError } = await usageQuery.limit(100)

    if (usageError) {
      console.error("Error fetching usage data:", usageError)
      return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
    }

    // Get scenario statistics
    const { data: scenarios, error: scenariosError } = await supabase.from("scenarios").select("*")

    if (scenariosError) {
      console.error("Error fetching scenarios:", scenariosError)
      return NextResponse.json({ error: "Failed to fetch scenarios" }, { status: 500 })
    }

    // Calculate analytics
    const analytics = {
      totalScenarios: scenarios?.length || 0,
      averageRevenue: scenarios?.reduce((sum, s) => sum + s.revenue, 0) / (scenarios?.length || 1),
      averageExpenses: scenarios?.reduce((sum, s) => sum + s.expenses, 0) / (scenarios?.length || 1),
      averageRunway: scenarios?.reduce((sum, s) => sum + s.cash_on_hand / s.burn_rate, 0) / (scenarios?.length || 1),
      recentActivity: usage?.slice(0, 10) || [],
      actionCounts:
        usage?.reduce((acc: Record<string, number>, item) => {
          acc[item.action] = (acc[item.action] || 0) + 1
          return acc
        }, {}) || {},
    }

    return NextResponse.json({ analytics })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

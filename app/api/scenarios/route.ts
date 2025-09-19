import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createClient()

    const { data: scenarios, error } = await supabase
      .from("scenarios")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching scenarios:", error)
      return NextResponse.json({ error: "Failed to fetch scenarios" }, { status: 500 })
    }

    return NextResponse.json({ scenarios })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const { name, revenue, expenses, growth_rate, burn_rate, cash_on_hand } = body

    // Validate required fields
    if (!name || revenue === undefined || expenses === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const { data: scenario, error } = await supabase
      .from("scenarios")
      .insert({
        name,
        revenue: Number(revenue),
        expenses: Number(expenses),
        growth_rate: Number(growth_rate) || 0,
        burn_rate: Number(burn_rate) || 0,
        cash_on_hand: Number(cash_on_hand) || 0,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating scenario:", error)
      return NextResponse.json({ error: "Failed to create scenario" }, { status: 500 })
    }

    // Track usage
    await supabase.from("usage_tracking").insert({
      action: "scenario_created",
      scenario_id: scenario.id,
      metadata: { name: scenario.name },
    })

    return NextResponse.json({ scenario }, { status: 201 })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const { data: scenario, error } = await supabase.from("scenarios").select("*").eq("id", id).single()

    if (error) {
      console.error("Error fetching scenario:", error)
      return NextResponse.json({ error: "Scenario not found" }, { status: 404 })
    }

    return NextResponse.json({ scenario })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const body = await request.json()

    const { name, revenue, expenses, growth_rate, burn_rate, cash_on_hand } = body

    const { data: scenario, error } = await supabase
      .from("scenarios")
      .update({
        name,
        revenue: Number(revenue),
        expenses: Number(expenses),
        growth_rate: Number(growth_rate),
        burn_rate: Number(burn_rate),
        cash_on_hand: Number(cash_on_hand),
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Error updating scenario:", error)
      return NextResponse.json({ error: "Failed to update scenario" }, { status: 500 })
    }

    // Track usage
    await supabase.from("usage_tracking").insert({
      action: "scenario_updated",
      scenario_id: id,
      metadata: { name: scenario.name },
    })

    return NextResponse.json({ scenario })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const { error } = await supabase.from("scenarios").delete().eq("id", id)

    if (error) {
      console.error("Error deleting scenario:", error)
      return NextResponse.json({ error: "Failed to delete scenario" }, { status: 500 })
    }

    // Track usage
    await supabase.from("usage_tracking").insert({
      action: "scenario_deleted",
      scenario_id: id,
      metadata: {},
    })

    return NextResponse.json({ message: "Scenario deleted successfully" })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

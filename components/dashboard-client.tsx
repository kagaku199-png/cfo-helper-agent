"use client"

import { Suspense, useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardGrid } from "@/components/dashboard-grid"
import { LoadingSpinner } from "@/components/loading-spinner"
import { createClient } from "@/lib/supabase/client"
import type { Scenario } from "@/lib/types"

interface DashboardClientProps {
  initialScenarios: Scenario[]
  userEmail: string
}

export function DashboardClient({ initialScenarios, userEmail }: DashboardClientProps) {
  const [scenarios, setScenarios] = useState<Scenario[]>(initialScenarios)
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(
    initialScenarios.length > 0 ? initialScenarios[0] : null,
  )

  const handleScenarioSelect = (scenario: Scenario) => {
    setSelectedScenario(scenario)
  }

  const handleScenarioCreate = async (scenarioData: Omit<Scenario, "id" | "created_at" | "updated_at">) => {
    try {
      const supabase = createClient()
      const { data: user } = await supabase.auth.getUser()

      if (!user.user) throw new Error("User not authenticated")

      const { data: newScenario, error } = await supabase
        .from("scenarios")
        .insert({
          ...scenarioData,
          user_id: user.user.id,
        })
        .select()
        .single()

      if (error) throw error

      setScenarios([newScenario, ...scenarios])
      setSelectedScenario(newScenario)
    } catch (error) {
      console.error("Failed to create scenario:", error)
    }
  }

  const handleScenarioUpdate = async (scenario: Scenario) => {
    try {
      const supabase = createClient()

      const { data: updatedScenario, error } = await supabase
        .from("scenarios")
        .update({
          name: scenario.name,
          revenue: scenario.revenue,
          expenses: scenario.expenses,
          growth_rate: scenario.growth_rate,
          burn_rate: scenario.burn_rate,
          cash_on_hand: scenario.cash_on_hand,
        })
        .eq("id", scenario.id)
        .select()
        .single()

      if (error) throw error

      setScenarios(scenarios.map((s) => (s.id === scenario.id ? updatedScenario : s)))
      if (selectedScenario?.id === scenario.id) {
        setSelectedScenario(updatedScenario)
      }
    } catch (error) {
      console.error("Failed to update scenario:", error)
    }
  }

  const handleScenarioDelete = async (scenarioId: string) => {
    try {
      const supabase = createClient()

      const { error } = await supabase.from("scenarios").delete().eq("id", scenarioId)

      if (error) throw error

      setScenarios(scenarios.filter((s) => s.id !== scenarioId))
      if (selectedScenario?.id === scenarioId) {
        setSelectedScenario(scenarios.find((s) => s.id !== scenarioId) || null)
      }
    } catch (error) {
      console.error("Failed to delete scenario:", error)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader scenarios={scenarios} selectedScenario={selectedScenario} userEmail={userEmail} />
      <main className="container mx-auto px-4 py-8">
        <Suspense fallback={<LoadingSpinner />}>
          <DashboardGrid
            scenarios={scenarios}
            selectedScenario={selectedScenario}
            onScenarioSelect={handleScenarioSelect}
            onScenarioCreate={handleScenarioCreate}
            onScenarioUpdate={handleScenarioUpdate}
            onScenarioDelete={handleScenarioDelete}
          />
        </Suspense>
      </main>
    </div>
  )
}

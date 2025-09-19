"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Plus, Save, Trash2 } from "lucide-react"
import { InsightsPanel } from "./insights-panel"
import { IndianFormatter } from "@/lib/indian-formatter"
import type { Scenario } from "@/lib/types"

interface ControlsPanelProps {
  selectedScenario: Scenario | null
  onScenarioUpdate: (scenario: Scenario) => void
}

export function ControlsPanel({ selectedScenario, onScenarioUpdate }: ControlsPanelProps) {
  const [localScenario, setLocalScenario] = useState<string>("conservative")
  const [revenue, setRevenue] = useState([8000000]) // 80 lakhs
  const [expenses, setExpenses] = useState([6400000]) // 64 lakhs
  const [growthRate, setGrowthRate] = useState([5])
  const [burnRate, setBurnRate] = useState([1200000]) // 12 lakhs
  const [cashOnHand, setCashOnHand] = useState([40000000]) // 4 crores

  useEffect(() => {
    if (selectedScenario) {
      setRevenue([selectedScenario.revenue])
      setExpenses([selectedScenario.expenses])
      setGrowthRate([selectedScenario.growth_rate])
      setBurnRate([selectedScenario.burn_rate])
      setCashOnHand([selectedScenario.cash_on_hand])
      setLocalScenario(selectedScenario.name.toLowerCase().replace(" ", "_"))
    }
  }, [selectedScenario])

  const [previousValues, setPreviousValues] = useState({
    revenue: 8000000,
    expenses: 6400000,
    runway: Math.floor(40000000 / 1200000),
  })
  const [currentInsight, setCurrentInsight] = useState("")
  const [isGeneratingInsight, setIsGeneratingInsight] = useState(false)

  const scenarios = [
    { id: "conservative", name: "Conservative Growth" },
    { id: "aggressive", name: "Aggressive Expansion" },
    { id: "steady", name: "Steady State" },
  ]

  const currentRunway = Math.floor(cashOnHand[0] / burnRate[0])

  const generateInsight = async (action: string) => {
    setIsGeneratingInsight(true)
    try {
      const response = await fetch("/api/insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "insight",
          data: {
            before: previousValues,
            after: {
              revenue: revenue[0],
              expenses: expenses[0],
              runway: currentRunway,
            },
            action,
          },
        }),
      })

      if (response.ok) {
        const { result } = await response.json()
        setCurrentInsight(result)
      }
    } catch (error) {
      console.error("Failed to generate insight:", error)
    } finally {
      setIsGeneratingInsight(false)
    }
  }

  useEffect(() => {
    const revenueChange = Math.abs(revenue[0] - previousValues.revenue) / previousValues.revenue
    const expensesChange = Math.abs(expenses[0] - previousValues.expenses) / previousValues.expenses

    if (revenueChange > 0.1 || expensesChange > 0.1) {
      let action = ""
      if (revenueChange > expensesChange) {
        action =
          revenue[0] > previousValues.revenue
            ? `Increased revenue by ${(revenueChange * 100).toFixed(1)}%`
            : `Decreased revenue by ${(revenueChange * 100).toFixed(1)}%`
      } else {
        action =
          expenses[0] > previousValues.expenses
            ? `Increased expenses by ${(expensesChange * 100).toFixed(1)}%`
            : `Decreased expenses by ${(expensesChange * 100).toFixed(1)}%`
      }

      generateInsight(action)
      setPreviousValues({
        revenue: revenue[0],
        expenses: expenses[0],
        runway: currentRunway,
      })
    }
  }, [revenue, expenses, currentRunway])

  const handleScenarioChange = (scenarioId: string) => {
    setLocalScenario(scenarioId)
    switch (scenarioId) {
      case "conservative":
        setRevenue([8000000]) // 80 lakhs
        setExpenses([6400000]) // 64 lakhs
        setGrowthRate([5])
        setBurnRate([1200000]) // 12 lakhs
        setCashOnHand([40000000]) // 4 crores
        break
      case "aggressive":
        setRevenue([12000000]) // 1.2 crores
        setExpenses([9600000]) // 96 lakhs
        setGrowthRate([15])
        setBurnRate([2000000]) // 20 lakhs
        setCashOnHand([24000000]) // 2.4 crores
        break
      case "steady":
        setRevenue([6400000]) // 64 lakhs
        setExpenses([5600000]) // 56 lakhs
        setGrowthRate([2])
        setBurnRate([800000]) // 8 lakhs
        setCashOnHand([60000000]) // 6 crores
        break
    }
  }

  const handleSave = () => {
    if (selectedScenario) {
      const updatedScenario: Scenario = {
        ...selectedScenario,
        revenue: revenue[0],
        expenses: expenses[0],
        growth_rate: growthRate[0],
        burn_rate: burnRate[0],
        cash_on_hand: cashOnHand[0],
      }
      onScenarioUpdate(updatedScenario)
    }
  }

  const terms = IndianFormatter.getBusinessTerms()

  return (
    <div className="space-y-4">
      <Card className="h-fit">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Scenario Controls
            <Button size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              New
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Scenario Selection */}
          <div className="space-y-2">
            <Label htmlFor="scenario-select">Current Scenario</Label>
            <Select value={localScenario} onValueChange={handleScenarioChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select scenario" />
              </SelectTrigger>
              <SelectContent>
                {scenarios.map((scenario) => (
                  <SelectItem key={scenario.id} value={scenario.id}>
                    {scenario.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Revenue Control */}
          <div className="space-y-3">
            <Label>
              {terms.revenue}: {IndianFormatter.formatCurrency(revenue[0])}
            </Label>
            <Slider
              value={revenue}
              onValueChange={setRevenue}
              max={50000000} // 5 crores
              min={1000000} // 10 lakhs
              step={500000} // 5 lakhs
              className="w-full"
            />
          </div>

          {/* Expenses Control */}
          <div className="space-y-3">
            <Label>
              {terms.expenses}: {IndianFormatter.formatCurrency(expenses[0])}
            </Label>
            <Slider
              value={expenses}
              onValueChange={setExpenses}
              max={40000000} // 4 crores
              min={500000} // 5 lakhs
              step={500000} // 5 lakhs
              className="w-full"
            />
          </div>

          {/* Growth Rate Control */}
          <div className="space-y-3">
            <Label>
              {terms.growthRate}: {IndianFormatter.formatPercentage(growthRate[0])}
            </Label>
            <Slider value={growthRate} onValueChange={setGrowthRate} max={50} min={-10} step={0.5} className="w-full" />
          </div>

          {/* Burn Rate Control */}
          <div className="space-y-3">
            <Label>
              {terms.burnRate}: {IndianFormatter.formatCurrency(burnRate[0])}
            </Label>
            <Slider
              value={burnRate}
              onValueChange={setBurnRate}
              max={10000000}
              min={0}
              step={100000}
              className="w-full"
            />
          </div>

          {/* Cash on Hand Control */}
          <div className="space-y-3">
            <Label>
              {terms.cashOnHand}: {IndianFormatter.formatCurrency(cashOnHand[0])}
            </Label>
            <Slider
              value={cashOnHand}
              onValueChange={setCashOnHand}
              max={200000000} // 20 crores
              min={5000000} // 50 lakhs
              step={1000000} // 10 lakhs
              className="w-full"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button className="flex-1" onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button variant="outline" size="icon">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          {/* Quick Metrics */}
          <div className="pt-4 border-t space-y-3">
            <div className="text-sm font-medium">Quick Metrics</div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{terms.profitMargin}:</span>
                <span className="font-medium">
                  {IndianFormatter.formatPercentage(((revenue[0] - expenses[0]) / revenue[0]) * 100)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{terms.profit}:</span>
                <span className="font-medium">{IndianFormatter.formatCurrency(revenue[0] - expenses[0])}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{terms.runway} (est):</span>
                <span className="font-medium">{currentRunway} months</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <InsightsPanel
        insight={currentInsight}
        isLoading={isGeneratingInsight}
        currentMetrics={{
          revenue: revenue[0],
          expenses: expenses[0],
          runway: currentRunway,
        }}
      />
    </div>
  )
}

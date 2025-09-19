"use client"

import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import type { Scenario } from "@/lib/types"

interface RunwayMeterProps {
  selectedScenario: Scenario | null
}

export function RunwayMeter({ selectedScenario }: RunwayMeterProps) {
  if (!selectedScenario) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="text-4xl font-bold text-muted-foreground mb-2">--</div>
          <Badge variant="secondary" className="mb-4">
            No Data
          </Badge>
        </div>
      </div>
    )
  }

  const currentRunway = selectedScenario.cash_on_hand / selectedScenario.burn_rate
  const maxRunway = 24 // months
  const runwayPercentage = Math.min((currentRunway / maxRunway) * 100, 100)

  const getRunwayStatus = (months: number) => {
    if (months >= 18) return { status: "Healthy", color: "bg-chart-2", variant: "default" as const }
    if (months >= 12) return { status: "Caution", color: "bg-chart-3", variant: "secondary" as const }
    return { status: "Critical", color: "bg-chart-4", variant: "destructive" as const }
  }

  const runwayStatus = getRunwayStatus(currentRunway)

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="text-4xl font-bold text-foreground mb-2">{currentRunway.toFixed(1)} months</div>
        <Badge variant={runwayStatus.variant} className="mb-4">
          {runwayStatus.status}
        </Badge>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>0 months</span>
          <span>{maxRunway} months</span>
        </div>
        <Progress value={runwayPercentage} className="h-3" />
      </div>

      <div className="grid grid-cols-3 gap-4 text-center text-sm">
        <div>
          <div className="font-semibold text-chart-4">Critical</div>
          <div className="text-muted-foreground">&lt; 12 months</div>
        </div>
        <div>
          <div className="font-semibold text-chart-3">Caution</div>
          <div className="text-muted-foreground">12-18 months</div>
        </div>
        <div>
          <div className="font-semibold text-chart-2">Healthy</div>
          <div className="text-muted-foreground">&gt; 18 months</div>
        </div>
      </div>
    </div>
  )
}

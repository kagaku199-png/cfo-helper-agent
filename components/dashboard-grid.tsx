import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RunwayMeter } from "@/components/runway-meter"
import { ExpensePie } from "@/components/expense-pie"
import { RevenueChart } from "@/components/revenue-chart"
import { ControlsPanel } from "@/components/controls-panel"
import { MetricsCards } from "@/components/metrics-cards"
import { ScenarioManager } from "@/components/scenario-manager"
import { CashFlowChart } from "@/components/cash-flow-chart"
import type { Scenario } from "@/lib/types"

interface DashboardGridProps {
  scenarios: Scenario[]
  selectedScenario: Scenario | null
  onScenarioSelect: (scenario: Scenario) => void
  onScenarioCreate: (scenario: Omit<Scenario, "id" | "created_at" | "updated_at">) => void
  onScenarioUpdate: (scenario: Scenario) => void
  onScenarioDelete: (scenarioId: string) => void
}

export function DashboardGrid({
  scenarios,
  selectedScenario,
  onScenarioSelect,
  onScenarioCreate,
  onScenarioUpdate,
  onScenarioDelete,
}: DashboardGridProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Metrics Cards - Full width on mobile, spans 3 columns on desktop */}
      <div className="lg:col-span-3">
        <MetricsCards selectedScenario={selectedScenario} />
      </div>

      {/* Controls Panel - Full width on mobile, 1 column on desktop */}
      <div className="lg:col-span-1">
        <ControlsPanel selectedScenario={selectedScenario} onScenarioUpdate={onScenarioUpdate} />
      </div>

      {/* Scenario Manager - Full width */}
      <div className="lg:col-span-4">
        <ScenarioManager
          scenarios={scenarios}
          onScenarioSelect={onScenarioSelect}
          onScenarioCreate={onScenarioCreate}
          onScenarioUpdate={onScenarioUpdate}
          onScenarioDelete={onScenarioDelete}
        />
      </div>

      {/* Runway Meter - Full width on mobile, spans 2 columns on desktop */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Cash Runway</CardTitle>
          </CardHeader>
          <CardContent>
            <RunwayMeter selectedScenario={selectedScenario} />
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart - Full width on mobile, spans 2 columns on desktop */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Projection</CardTitle>
          </CardHeader>
          <CardContent>
            <RevenueChart selectedScenario={selectedScenario} />
          </CardContent>
        </Card>
      </div>

      {/* Expense Pie Chart - Full width on mobile, spans 2 columns on desktop */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Expense Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ExpensePie />
          </CardContent>
        </Card>
      </div>

      {/* Cash Flow Chart - Full width on mobile, spans 2 columns on desktop */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Cash Flow Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <CashFlowChart selectedScenario={selectedScenario} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, IndianRupee, Calendar } from "lucide-react"
import type { Scenario } from "@/lib/types"
import { IndianFormatter } from "@/lib/indian-formatter"

interface MetricsCardsProps {
  selectedScenario: Scenario | null
}

export function MetricsCards({ selectedScenario }: MetricsCardsProps) {
  if (!selectedScenario) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Loading...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">--</div>
              <p className="text-xs text-muted-foreground">No data</p>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const profitMargin = ((selectedScenario.revenue - selectedScenario.expenses) / selectedScenario.revenue) * 100
  const monthlyProfit = selectedScenario.revenue - selectedScenario.expenses
  const runway = selectedScenario.cash_on_hand / selectedScenario.burn_rate

  const terms = IndianFormatter.getBusinessTerms()

  const metrics = [
    {
      title: terms.revenue,
      value: IndianFormatter.formatCurrency(selectedScenario.revenue),
      change: `+${IndianFormatter.formatPercentage(selectedScenario.growth_rate)}`,
      trend: "up",
      icon: IndianRupee,
    },
    {
      title: terms.expenses,
      value: IndianFormatter.formatCurrency(selectedScenario.expenses),
      change: "Stable",
      trend: "neutral",
      icon: TrendingDown,
    },
    {
      title: terms.profitMargin,
      value: IndianFormatter.formatPercentage(profitMargin),
      change: monthlyProfit > 0 ? "Profitable" : "Loss",
      trend: monthlyProfit > 0 ? "up" : "down",
      icon: TrendingUp,
    },
    {
      title: terms.runway,
      value: `${runway.toFixed(1)} months`,
      change: runway > 18 ? "Healthy" : runway > 12 ? "Caution" : "Critical",
      trend: runway > 18 ? "up" : runway > 12 ? "neutral" : "down",
      icon: Calendar,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {metrics.map((metric, index) => {
        const Icon = metric.icon
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{metric.title}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p
                className={`text-xs ${
                  metric.trend === "up"
                    ? "text-chart-2"
                    : metric.trend === "down"
                      ? "text-chart-4"
                      : "text-muted-foreground"
                }`}
              >
                {metric.change}
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sparkles, TrendingUp, FileText, Activity, Loader2 } from "lucide-react"

interface InsightsPanelProps {
  insight: string
  isLoading: boolean
  currentMetrics: {
    revenue: number
    expenses: number
    runway: number
  }
}

export function InsightsPanel({ insight, isLoading, currentMetrics }: InsightsPanelProps) {
  const [healthScore, setHealthScore] = useState<string>("")
  const [scenarioName, setScenarioName] = useState<string>("")
  const [executiveSummary, setExecutiveSummary] = useState<string>("")
  const [loadingStates, setLoadingStates] = useState({
    health: false,
    naming: false,
    report: false,
  })

  const generateHealthScore = async () => {
    setLoadingStates((prev) => ({ ...prev, health: true }))
    try {
      const response = await fetch("/api/insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "health",
          data: {
            before: currentMetrics,
            after: currentMetrics,
            action: "Current financial position assessment",
          },
        }),
      })

      if (response.ok) {
        const { result } = await response.json()
        setHealthScore(result)
      }
    } catch (error) {
      console.error("Failed to generate health score:", error)
    } finally {
      setLoadingStates((prev) => ({ ...prev, health: false }))
    }
  }

  const generateScenarioName = async () => {
    setLoadingStates((prev) => ({ ...prev, naming: true }))
    try {
      const response = await fetch("/api/insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "naming",
          data: {
            before: currentMetrics,
            after: currentMetrics,
            action: "Current scenario configuration",
          },
        }),
      })

      if (response.ok) {
        const { result } = await response.json()
        setScenarioName(result)
      }
    } catch (error) {
      console.error("Failed to generate scenario name:", error)
    } finally {
      setLoadingStates((prev) => ({ ...prev, naming: false }))
    }
  }

  const generateExecutiveSummary = async () => {
    setLoadingStates((prev) => ({ ...prev, report: true }))
    try {
      const response = await fetch("/api/insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "report",
          data: {
            before: currentMetrics,
            after: currentMetrics,
            action: "Financial scenario analysis",
          },
        }),
      })

      if (response.ok) {
        const { result } = await response.json()
        setExecutiveSummary(result)
      }
    } catch (error) {
      console.error("Failed to generate executive summary:", error)
    } finally {
      setLoadingStates((prev) => ({ ...prev, report: false }))
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-blue-500" />
          AI Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Real-time Insight */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <span className="text-sm font-medium">Live Analysis</span>
          </div>
          <div className="p-3 bg-muted rounded-lg text-sm">
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Analyzing changes...
              </div>
            ) : insight ? (
              insight
            ) : (
              "Adjust the controls above to see AI-powered insights about your financial changes."
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={generateHealthScore}
            disabled={loadingStates.health}
            className="justify-start bg-transparent"
          >
            {loadingStates.health ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Activity className="h-4 w-4 mr-2" />
            )}
            Get Health Score
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={generateScenarioName}
            disabled={loadingStates.naming}
            className="justify-start bg-transparent"
          >
            {loadingStates.naming ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4 mr-2" />
            )}
            Suggest Name
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={generateExecutiveSummary}
            disabled={loadingStates.report}
            className="justify-start bg-transparent"
          >
            {loadingStates.report ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <FileText className="h-4 w-4 mr-2" />
            )}
            Executive Summary
          </Button>
        </div>

        {/* Generated Results */}
        {healthScore && (
          <div className="space-y-2">
            <Badge variant="secondary" className="text-xs">
              Health Score
            </Badge>
            <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg text-sm">{healthScore}</div>
          </div>
        )}

        {scenarioName && (
          <div className="space-y-2">
            <Badge variant="secondary" className="text-xs">
              Suggested Name
            </Badge>
            <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg text-sm font-medium">{scenarioName}</div>
          </div>
        )}

        {executiveSummary && (
          <div className="space-y-2">
            <Badge variant="secondary" className="text-xs">
              Executive Summary
            </Badge>
            <div className="p-3 bg-purple-50 dark:bg-purple-950 rounded-lg text-sm">{executiveSummary}</div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

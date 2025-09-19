import type { Scenario } from "@/lib/types"

const API_BASE = "/api"

export class ApiClient {
  static async getScenarios(): Promise<Scenario[]> {
    const response = await fetch(`${API_BASE}/scenarios`)
    if (!response.ok) {
      throw new Error("Failed to fetch scenarios")
    }
    const data = await response.json()
    return data.scenarios
  }

  static async getScenario(id: string): Promise<Scenario> {
    const response = await fetch(`${API_BASE}/scenarios/${id}`)
    if (!response.ok) {
      throw new Error("Failed to fetch scenario")
    }
    const data = await response.json()
    return data.scenario
  }

  static async createScenario(scenario: Omit<Scenario, "id" | "created_at" | "updated_at">): Promise<Scenario> {
    const response = await fetch(`${API_BASE}/scenarios`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(scenario),
    })
    if (!response.ok) {
      throw new Error("Failed to create scenario")
    }
    const data = await response.json()
    return data.scenario
  }

  static async updateScenario(id: string, scenario: Partial<Scenario>): Promise<Scenario> {
    const response = await fetch(`${API_BASE}/scenarios/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(scenario),
    })
    if (!response.ok) {
      throw new Error("Failed to update scenario")
    }
    const data = await response.json()
    return data.scenario
  }

  static async deleteScenario(id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/scenarios/${id}`, {
      method: "DELETE",
    })
    if (!response.ok) {
      throw new Error("Failed to delete scenario")
    }
  }

  static async getAnalytics(scenarioId?: string) {
    const url = scenarioId ? `${API_BASE}/analytics?scenario_id=${scenarioId}` : `${API_BASE}/analytics`

    const response = await fetch(url)
    if (!response.ok) {
      throw new Error("Failed to fetch analytics")
    }
    const data = await response.json()
    return data.analytics
  }

  static async generateReport(scenarioId: string, reportType = "full") {
    const response = await fetch(`${API_BASE}/reports`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ scenarioId, reportType }),
    })
    if (!response.ok) {
      throw new Error("Failed to generate report")
    }
    const data = await response.json()
    return data.report
  }
}

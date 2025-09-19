"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Copy } from "lucide-react"
import type { Scenario } from "@/lib/types"
import { IndianFormatter } from "@/lib/indian-formatter"

interface ScenarioManagerProps {
  scenarios: Scenario[]
  onScenarioSelect: (scenario: Scenario) => void
  onScenarioCreate: (scenario: Omit<Scenario, "id" | "created_at" | "updated_at">) => void
  onScenarioUpdate: (scenario: Scenario) => void
  onScenarioDelete: (scenarioId: string) => void
}

export function ScenarioManager({
  scenarios,
  onScenarioSelect,
  onScenarioCreate,
  onScenarioUpdate,
  onScenarioDelete,
}: ScenarioManagerProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingScenario, setEditingScenario] = useState<Scenario | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    revenue: 0,
    expenses: 0,
    growth_rate: 0,
    burn_rate: 0,
    cash_on_hand: 0,
  })

  const resetForm = () => {
    setFormData({
      name: "",
      revenue: 0,
      expenses: 0,
      growth_rate: 0,
      burn_rate: 0,
      cash_on_hand: 0,
    })
  }

  const handleCreate = () => {
    onScenarioCreate(formData)
    setIsCreateDialogOpen(false)
    resetForm()
  }

  const handleUpdate = () => {
    if (editingScenario) {
      onScenarioUpdate({
        ...editingScenario,
        ...formData,
      })
      setEditingScenario(null)
      resetForm()
    }
  }

  const handleEdit = (scenario: Scenario) => {
    setEditingScenario(scenario)
    setFormData({
      name: scenario.name,
      revenue: scenario.revenue,
      expenses: scenario.expenses,
      growth_rate: scenario.growth_rate,
      burn_rate: scenario.burn_rate,
      cash_on_hand: scenario.cash_on_hand,
    })
  }

  const handleDuplicate = (scenario: Scenario) => {
    onScenarioCreate({
      name: `${scenario.name} (Copy)`,
      revenue: scenario.revenue,
      expenses: scenario.expenses,
      growth_rate: scenario.growth_rate,
      burn_rate: scenario.burn_rate,
      cash_on_hand: scenario.cash_on_hand,
    })
  }

  const getScenarioStatus = (scenario: Scenario) => {
    const profitMargin = ((scenario.revenue - scenario.expenses) / scenario.revenue) * 100
    const runway = scenario.cash_on_hand / scenario.burn_rate

    if (profitMargin > 20 && runway > 18) return { label: "Healthy", variant: "default" as const }
    if (profitMargin > 10 && runway > 12) return { label: "Moderate", variant: "secondary" as const }
    return { label: "Risk", variant: "destructive" as const }
  }

  const terms = IndianFormatter.getBusinessTerms()

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Scenario Manager</CardTitle>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Scenario
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Scenario</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Scenario Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter scenario name"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="revenue">{terms.revenue}</Label>
                    <Input
                      id="revenue"
                      type="number"
                      value={formData.revenue}
                      onChange={(e) => setFormData({ ...formData, revenue: Number(e.target.value) })}
                      placeholder="Amount in ₹"
                    />
                  </div>
                  <div>
                    <Label htmlFor="expenses">{terms.expenses}</Label>
                    <Input
                      id="expenses"
                      type="number"
                      value={formData.expenses}
                      onChange={(e) => setFormData({ ...formData, expenses: Number(e.target.value) })}
                      placeholder="Amount in ₹"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="growth_rate">{terms.growthRate} (%)</Label>
                    <Input
                      id="growth_rate"
                      type="number"
                      step="0.1"
                      value={formData.growth_rate}
                      onChange={(e) => setFormData({ ...formData, growth_rate: Number(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="burn_rate">{terms.burnRate}</Label>
                    <Input
                      id="burn_rate"
                      type="number"
                      value={formData.burn_rate}
                      onChange={(e) => setFormData({ ...formData, burn_rate: Number(e.target.value) })}
                      placeholder="Amount in ₹"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="cash_on_hand">{terms.cashOnHand}</Label>
                  <Input
                    id="cash_on_hand"
                    type="number"
                    value={formData.cash_on_hand}
                    onChange={(e) => setFormData({ ...formData, cash_on_hand: Number(e.target.value) })}
                    placeholder="Amount in ₹"
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleCreate} className="flex-1">
                    Create Scenario
                  </Button>
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {scenarios.map((scenario) => {
            const status = getScenarioStatus(scenario)
            return (
              <div
                key={scenario.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                onClick={() => onScenarioSelect(scenario)}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium">{scenario.name}</h4>
                    <Badge variant={status.variant} className="text-xs">
                      {status.label}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Revenue: {IndianFormatter.formatCurrency(scenario.revenue)} | Runway:{" "}
                    {Math.floor(scenario.cash_on_hand / scenario.burn_rate)}mo
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleEdit(scenario)
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDuplicate(scenario)
                    }}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation()
                      onScenarioDelete(scenario.id)
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>

      {/* Edit Dialog */}
      <Dialog open={!!editingScenario} onOpenChange={() => setEditingScenario(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Scenario</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Scenario Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-revenue">{terms.revenue}</Label>
                <Input
                  id="edit-revenue"
                  type="number"
                  value={formData.revenue}
                  onChange={(e) => setFormData({ ...formData, revenue: Number(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="edit-expenses">{terms.expenses}</Label>
                <Input
                  id="edit-expenses"
                  type="number"
                  value={formData.expenses}
                  onChange={(e) => setFormData({ ...formData, expenses: Number(e.target.value) })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-growth_rate">{terms.growthRate} (%)</Label>
                <Input
                  id="edit-growth_rate"
                  type="number"
                  step="0.1"
                  value={formData.growth_rate}
                  onChange={(e) => setFormData({ ...formData, growth_rate: Number(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="edit-burn_rate">{terms.burnRate}</Label>
                <Input
                  id="edit-burn_rate"
                  type="number"
                  value={formData.burn_rate}
                  onChange={(e) => setFormData({ ...formData, burn_rate: Number(e.target.value) })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="edit-cash_on_hand">{terms.cashOnHand}</Label>
              <Input
                id="edit-cash_on_hand"
                type="number"
                value={formData.cash_on_hand}
                onChange={(e) => setFormData({ ...formData, cash_on_hand: Number(e.target.value) })}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleUpdate} className="flex-1">
                Update Scenario
              </Button>
              <Button variant="outline" onClick={() => setEditingScenario(null)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

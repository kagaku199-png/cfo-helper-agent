"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { IndianFormatter } from "@/lib/indian-formatter"

const revenueData = [
  { month: "Jan", actual: 6400000, projected: 6800000 }, // 64L, 68L
  { month: "Feb", actual: 6800000, projected: 7200000 }, // 68L, 72L
  { month: "Mar", actual: 7360000, projected: 7600000 }, // 73.6L, 76L
  { month: "Apr", actual: 7840000, projected: 8000000 }, // 78.4L, 80L
  { month: "May", actual: 8400000, projected: 8800000 }, // 84L, 88L
  { month: "Jun", actual: 8960000, projected: 9200000 }, // 89.6L, 92L
  { month: "Jul", actual: null, projected: 9600000 }, // 96L
  { month: "Aug", actual: null, projected: 10000000 }, // 1Cr
  { month: "Sep", actual: null, projected: 10400000 }, // 1.04Cr
  { month: "Oct", actual: null, projected: 10800000 }, // 1.08Cr
  { month: "Nov", actual: null, projected: 11200000 }, // 1.12Cr
  { month: "Dec", actual: null, projected: 11600000 }, // 1.16Cr
]

export function RevenueChart() {
  return (
    <div className="space-y-4">
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={revenueData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={12} />
            <YAxis
              stroke="var(--color-muted-foreground)"
              fontSize={12}
              tickFormatter={(value) => IndianFormatter.formatCompactCurrency(value)}
            />
            <Tooltip
              formatter={(value: number) => [value ? IndianFormatter.formatCurrency(value) : "N/A", ""]}
              labelStyle={{ color: "var(--color-foreground)" }}
              contentStyle={{
                backgroundColor: "var(--color-card)",
                border: "1px solid var(--color-border)",
                borderRadius: "6px",
              }}
            />
            <Line
              type="monotone"
              dataKey="actual"
              stroke="var(--color-chart-1)"
              strokeWidth={3}
              dot={{ fill: "var(--color-chart-1)", strokeWidth: 2, r: 4 }}
              name="Actual Revenue"
            />
            <Line
              type="monotone"
              dataKey="projected"
              stroke="var(--color-chart-2)"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ fill: "var(--color-chart-2)", strokeWidth: 2, r: 3 }}
              name="Projected Revenue"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-0.5 bg-chart-1"></div>
          <span>Actual Revenue</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-0.5 bg-chart-2 border-dashed border-t-2"></div>
          <span>Projected Revenue</span>
        </div>
      </div>
    </div>
  )
}

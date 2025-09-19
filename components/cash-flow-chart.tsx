"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { IndianFormatter } from "@/lib/indian-formatter"

const cashFlowData = [
  { month: "Jan", inflow: 9600000, outflow: -7600000, net: 2000000 }, // 96L, -76L, 20L
  { month: "Feb", inflow: 10000000, outflow: -7840000, net: 2160000 }, // 1Cr, -78.4L, 21.6L
  { month: "Mar", inflow: 10400000, outflow: -8160000, net: 2240000 }, // 1.04Cr, -81.6L, 22.4L
  { month: "Apr", inflow: 10800000, outflow: -8400000, net: 2400000 }, // 1.08Cr, -84L, 24L
  { month: "May", inflow: 11200000, outflow: -8640000, net: 2560000 }, // 1.12Cr, -86.4L, 25.6L
  { month: "Jun", inflow: 11600000, outflow: -8960000, net: 2640000 }, // 1.16Cr, -89.6L, 26.4L
]

export function CashFlowChart() {
  return (
    <div className="space-y-4">
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={cashFlowData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
            <Bar dataKey="inflow" fill="var(--color-chart-2)" name="Cash Inflow" radius={[2, 2, 0, 0]} />
            <Bar dataKey="outflow" fill="var(--color-chart-4)" name="Cash Outflow" radius={[2, 2, 0, 0]} />
            <Bar dataKey="net" fill="var(--color-chart-1)" name="Net Cash Flow" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-chart-2 rounded"></div>
          <span>Cash Inflow</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-chart-4 rounded"></div>
          <span>Cash Outflow</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-chart-1 rounded"></div>
          <span>Net Cash Flow</span>
        </div>
      </div>
    </div>
  )
}

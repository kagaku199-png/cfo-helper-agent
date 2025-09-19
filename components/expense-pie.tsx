"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { IndianFormatter } from "@/lib/indian-formatter"

const expenseData = [
  { name: "Salaries & Benefits", value: 3600000, color: "var(--color-chart-1)" }, // 36 lakhs
  { name: "Marketing & Sales", value: 1600000, color: "var(--color-chart-2)" }, // 16 lakhs
  { name: "Operations & Rent", value: 1200000, color: "var(--color-chart-3)" }, // 12 lakhs
  { name: "Technology & IT", value: 800000, color: "var(--color-chart-4)" }, // 8 lakhs
  { name: "Other Expenses", value: 400000, color: "var(--color-chart-5)" }, // 4 lakhs
]

export function ExpensePie() {
  const total = expenseData.reduce((sum, item) => sum + item.value, 0)

  return (
    <div className="space-y-4">
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={expenseData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={120}
              paddingAngle={2}
              dataKey="value"
            >
              {expenseData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => [IndianFormatter.formatCurrency(value), "Amount"]} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-2">
        {expenseData.map((item, index) => (
          <div key={index} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
              <span>{item.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">{IndianFormatter.formatCurrency(item.value)}</span>
              <span className="text-muted-foreground">
                ({IndianFormatter.formatPercentage((item.value / total) * 100)})
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

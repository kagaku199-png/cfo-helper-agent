import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { IndianFormatter } from "@/lib/indian-formatter"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })

interface InsightRequest {
  mode: "insight" | "naming" | "report" | "health"
  data: {
    before: { revenue: number; expenses: number; runway: number }
    after: { revenue: number; expenses: number; runway: number }
    action: string
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: InsightRequest = await request.json()
    const { mode, data } = body

    if (!mode || !data) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    let prompt = ""

    switch (mode) {
      case "insight":
        prompt = `Summarize in 1–2 sentences what this financial change does for an Indian business. Be clear and business-like. Use Indian business terminology.
        
Before: Revenue: ${IndianFormatter.formatCurrency(data.before.revenue)}, Expenses: ${IndianFormatter.formatCurrency(data.before.expenses)}, Runway: ${data.before.runway} months
After: Revenue: ${IndianFormatter.formatCurrency(data.after.revenue)}, Expenses: ${IndianFormatter.formatCurrency(data.after.expenses)}, Runway: ${data.after.runway} months
Action: ${data.action}`
        break

      case "naming":
        prompt = `Suggest a short 2–3 word name for this Indian business financial strategy.
        
Revenue change: ${IndianFormatter.formatCurrency(data.before.revenue)} → ${IndianFormatter.formatCurrency(data.after.revenue)}
Expenses change: ${IndianFormatter.formatCurrency(data.before.expenses)} → ${IndianFormatter.formatCurrency(data.after.expenses)}
Runway change: ${data.before.runway} → ${data.after.runway} months
Action: ${data.action}`
        break

      case "report":
        prompt = `Write an executive summary paragraph for this Indian business financial scenario that could appear in a PDF report. Use Indian business terminology and context.
        
Before: Revenue: ${IndianFormatter.formatCurrency(data.before.revenue)}, Expenses: ${IndianFormatter.formatCurrency(data.before.expenses)}, Runway: ${data.before.runway} months
After: Revenue: ${IndianFormatter.formatCurrency(data.after.revenue)}, Expenses: ${IndianFormatter.formatCurrency(data.after.expenses)}, Runway: ${data.after.runway} months
Action: ${data.action}`
        break

      case "health":
        prompt = `On a scale of 0–100, rate the financial health of this Indian company based on profitability, runway, and spending discipline. Consider Indian market conditions. Respond with the number and one concise explanation.
        
Current metrics: Revenue: ${IndianFormatter.formatCurrency(data.after.revenue)}, Expenses: ${IndianFormatter.formatCurrency(data.after.expenses)}, Runway: ${data.after.runway} months
Recent change: ${data.action}`
        break

      default:
        return NextResponse.json({ error: "Invalid mode" }, { status: 400 })
    }

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    return NextResponse.json({ result: text })
  } catch (error) {
    console.error("Gemini API error:", error)
    return NextResponse.json({ error: "Failed to generate insights" }, { status: 500 })
  }
}

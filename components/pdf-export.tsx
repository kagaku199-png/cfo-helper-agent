"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Download, FileText, Loader2 } from "lucide-react"
import { ApiClient } from "@/lib/api-client"
import type { Scenario } from "@/lib/types"
import { IndianFormatter } from "@/lib/indian-formatter"

interface PdfExportProps {
  scenarios: Scenario[]
  selectedScenario?: Scenario
}

export function PdfExport({ scenarios, selectedScenario }: PdfExportProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedScenarioId, setSelectedScenarioId] = useState(selectedScenario?.id || "")
  const [reportOptions, setReportOptions] = useState({
    includeCharts: true,
    includeProjections: true,
    includeMetrics: true,
    includeAnalytics: false,
  })

  const handleExport = async () => {
    if (!selectedScenarioId) return

    setIsGenerating(true)
    try {
      // Generate report data
      const reportData = await ApiClient.generateReport(selectedScenarioId, "full")

      // Create PDF content with completely isolated styling
      await generatePDF(reportData, reportOptions)
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert("Failed to generate PDF report. Please try again.")
    } finally {
      setIsGenerating(false)
      setIsOpen(false)
    }
  }

  const generatePDF = async (reportData: any, options: typeof reportOptions) => {
    // Import html2pdf dynamically to avoid SSR issues
    const html2pdf: any = ((await import("html2pdf.js")) as any).default as any

    // Create HTML content for PDF with isolated styling
    const htmlContent = createPDFContent(reportData, options)

    // Simpler, robust approach: render in a hidden, offscreen container div
    // with strict inline CSS isolation to avoid tailwind/shadcn oklch tokens.
    const container = document.createElement("div")
    container.innerHTML = htmlContent
    container.style.cssText = `
      position: absolute !important;
      left: -99999px !important;
      top: -99999px !important;
      width: 800px !important;
      font-family: Arial, sans-serif !important;
      font-size: 14px !important;
      line-height: 1.4 !important;
      color: #000000 !important;
      background: #ffffff !important;
      all: initial !important;
    `
    document.body.appendChild(container)

    const element = container

    // PDF options
    const opt = {
      margin: 0.5,
      filename: `cfo-report-${reportData.scenario.name.toLowerCase().replace(/\s+/g, "-")}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        // Filter out any element whose computed color still resolves to an unsupported oklch()
        ignoreElements: (node: Element) => {
          try {
            const element = node as HTMLElement
            const view = element?.ownerDocument?.defaultView || window
            const style = element ? view.getComputedStyle(element) : null
            const color = style?.color || ""
            const bg = style?.backgroundColor || ""
            return color.includes("oklch") || bg.includes("oklch")
          } catch {
            return false
          }
        },
      },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    }

    try {
      await html2pdf().set(opt).from(element).save()
    } finally {
      document.body.removeChild(container)
    }
  }

  const createPDFContent = (reportData: any, options: typeof reportOptions) => {
    const { scenario, metrics, projections } = reportData
    const terms = IndianFormatter.getBusinessTerms()

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: Arial, sans-serif;
          }
          body {
            background: #ffffff;
            color: #000000;
            font-size: 14px;
            line-height: 1.4;
          }
          .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: #ffffff;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #333333;
            padding-bottom: 20px;
          }
          .header h1 {
            color: #000000;
            margin: 0;
            font-size: 28px;
            font-weight: bold;
          }
          .header h2 {
            color: #333333;
            margin: 10px 0;
            font-size: 20px;
          }
          .header p {
            color: #666666;
            margin: 0;
            font-size: 14px;
          }
          .section {
            margin-bottom: 30px;
          }
          .section h3 {
            color: #000000;
            border-bottom: 1px solid #cccccc;
            padding-bottom: 10px;
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 15px;
          }
          .metrics-grid {
            display: table;
            width: 100%;
            border-collapse: separate;
            border-spacing: 10px;
          }
          .metrics-row {
            display: table-row;
          }
          .metric-card {
            display: table-cell;
            width: 50%;
            background: #f8f9fa;
            padding: 15px;
            border: 1px solid #dddddd;
            vertical-align: top;
          }
          .metric-card h4 {
            margin: 0 0 10px 0;
            color: #333333;
            font-size: 14px;
            font-weight: 500;
          }
          .metric-value {
            font-size: 24px;
            font-weight: bold;
            margin: 0;
          }
          .metric-revenue { color: #008000; }
          .metric-expense { color: #cc0000; }
          .metric-percentage { color: #0066cc; }
          .metric-runway { color: #6600cc; }
          .table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
            border: 1px solid #cccccc;
          }
          .table th,
          .table td {
            padding: 12px;
            border: 1px solid #cccccc;
            text-align: left;
          }
          .table th {
            background: #f0f0f0;
            font-weight: 600;
            color: #333333;
          }
          .table tr:nth-child(even) {
            background: #f8f9fa;
          }
          .table tr:nth-child(odd) {
            background: #ffffff;
          }
          .text-right { text-align: right; }
          .text-center { text-align: center; }
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #cccccc;
            text-align: center;
            color: #666666;
            font-size: 12px;
          }
          .footer p {
            margin: 5px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <header class="header">
            <h1>CFO Financial Report</h1>
            <h2>${scenario.name}</h2>
            <p>Generated on ${IndianFormatter.formatDate(new Date())}</p>
          </header>

          ${
            options.includeMetrics
              ? `
          <section class="section">
            <h3>Key Metrics</h3>
            <div class="metrics-grid">
              <div class="metrics-row">
                <div class="metric-card">
                  <h4>${terms.revenue}</h4>
                  <p class="metric-value metric-revenue">${IndianFormatter.formatCurrency(scenario.revenue)}</p>
                </div>
                <div class="metric-card">
                  <h4>${terms.expenses}</h4>
                  <p class="metric-value metric-expense">${IndianFormatter.formatCurrency(scenario.expenses)}</p>
                </div>
              </div>
              <div class="metrics-row">
                <div class="metric-card">
                  <h4>${terms.profitMargin}</h4>
                  <p class="metric-value metric-percentage">${IndianFormatter.formatPercentage(metrics.profitMargin)}</p>
                </div>
                <div class="metric-card">
                  <h4>${terms.runway}</h4>
                  <p class="metric-value metric-runway">${metrics.runway} months</p>
                </div>
              </div>
            </div>
          </section>
          `
              : ""
          }

          <section class="section">
            <h3>Scenario Details</h3>
            <table class="table">
              <tr>
                <th>Parameter</th>
                <th>Value</th>
              </tr>
              <tr>
                <td>${terms.revenue}</td>
                <td class="metric-revenue">${IndianFormatter.formatCurrency(scenario.revenue)}</td>
              </tr>
              <tr>
                <td>${terms.expenses}</td>
                <td class="metric-expense">${IndianFormatter.formatCurrency(scenario.expenses)}</td>
              </tr>
              <tr>
                <td>${terms.growthRate}</td>
                <td class="metric-percentage">${IndianFormatter.formatPercentage(scenario.growth_rate)}</td>
              </tr>
              <tr>
                <td>${terms.burnRate}</td>
                <td class="metric-expense">${IndianFormatter.formatCurrency(scenario.burn_rate)}</td>
              </tr>
              <tr>
                <td>${terms.cashOnHand}</td>
                <td class="metric-revenue">${IndianFormatter.formatCurrency(scenario.cash_on_hand)}</td>
              </tr>
            </table>
          </section>

          ${
            options.includeProjections
              ? `
          <section class="section">
            <h3>12-Month Projections</h3>
            <table class="table">
              <tr>
                <th>Month</th>
                <th class="text-right">Revenue</th>
                <th class="text-right">Expenses</th>
                <th class="text-right">Profit</th>
                <th class="text-right">Cash Balance</th>
                <th class="text-right">Runway</th>
              </tr>
              ${projections
                .map(
                  (proj: any) => `
                <tr>
                  <td>Month ${proj.month}</td>
                  <td class="text-right metric-revenue">${IndianFormatter.formatCurrency(proj.revenue)}</td>
                  <td class="text-right metric-expense">${IndianFormatter.formatCurrency(proj.expenses)}</td>
                  <td class="text-right ${proj.profit >= 0 ? "metric-revenue" : "metric-expense"}">${IndianFormatter.formatCurrency(proj.profit)}</td>
                  <td class="text-right">${IndianFormatter.formatCurrency(proj.cashBalance)}</td>
                  <td class="text-right metric-runway">${proj.runway} mo</td>
                </tr>
              `,
                )
                .join("")}
            </table>
          </section>
          `
              : ""
          }

          <footer class="footer">
            <p>Generated by CFO Helper Agent on ${IndianFormatter.formatDate(new Date())} ${new Date().toLocaleTimeString("en-IN")}</p>
            <p>This report is based on the scenario parameters and assumptions provided.</p>
            <p>All amounts are in Indian Rupees (₹). Financial projections are estimates based on current parameters.</p>
          </footer>
        </div>
      </body>
      </html>
    `
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Export PDF Report
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="scenario-select">Select Scenario</Label>
            <Select value={selectedScenarioId} onValueChange={setSelectedScenarioId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a scenario" />
              </SelectTrigger>
              <SelectContent>
                {scenarios.map((scenario) => (
                  <SelectItem key={scenario.id} value={scenario.id}>
                    {scenario.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label>Report Options</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="metrics"
                  checked={reportOptions.includeMetrics}
                  onCheckedChange={(checked: boolean | 'indeterminate') =>
                    setReportOptions({ ...reportOptions, includeMetrics: !!checked })
                  }
                />
                <Label htmlFor="metrics" className="text-sm">
                  Include Key Metrics
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="projections"
                  checked={reportOptions.includeProjections}
                  onCheckedChange={(checked: boolean | 'indeterminate') =>
                    setReportOptions({ ...reportOptions, includeProjections: !!checked })
                  }
                />
                <Label htmlFor="projections" className="text-sm">
                  Include 12-Month Projections
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="charts"
                  checked={reportOptions.includeCharts}
                  onCheckedChange={(checked: boolean | 'indeterminate') =>
                    setReportOptions({ ...reportOptions, includeCharts: !!checked })
                  }
                />
                <Label htmlFor="charts" className="text-sm">
                  Include Charts (Coming Soon)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="analytics"
                  checked={reportOptions.includeAnalytics}
                  onCheckedChange={(checked: boolean | 'indeterminate') =>
                    setReportOptions({ ...reportOptions, includeAnalytics: !!checked })
                  }
                />
                <Label htmlFor="analytics" className="text-sm">
                  Include Usage Analytics
                </Label>
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button onClick={handleExport} disabled={!selectedScenarioId || isGenerating} className="flex-1">
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Export PDF
                </>
              )}
            </Button>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

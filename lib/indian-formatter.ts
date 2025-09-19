export class IndianFormatter {
  // Format currency in Indian Rupees with proper locale
  static formatCurrency(amount: number): string {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  // Format numbers in Indian numbering system (lakhs/crores)
  static formatNumber(num: number): string {
    return new Intl.NumberFormat("en-IN").format(num)
  }

  // Format large numbers with Indian units (L for lakhs, Cr for crores)
  static formatCompactCurrency(amount: number): string {
    if (amount >= 10000000) {
      // 1 crore
      return `₹${(amount / 10000000).toFixed(1)}Cr`
    } else if (amount >= 100000) {
      // 1 lakh
      return `₹${(amount / 100000).toFixed(1)}L`
    } else if (amount >= 1000) {
      // thousands
      return `₹${(amount / 1000).toFixed(0)}K`
    }
    return `₹${amount.toLocaleString("en-IN")}`
  }

  // Format percentage with Indian decimal notation
  static formatPercentage(value: number, decimals = 1): string {
    return `${value.toFixed(decimals)}%`
  }

  // Format date in DD/MM/YYYY format commonly used in India
  static formatDate(date: Date): string {
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  // Get Indian business terminology
  static getBusinessTerms() {
    return {
      revenue: "Monthly Turnover",
      expenses: "Monthly Expenses",
      profit: "Monthly Profit",
      profitMargin: "Profit Margin",
      runway: "Cash Runway",
      burnRate: "Monthly Burn Rate",
      cashOnHand: "Cash in Hand",
      growthRate: "Growth Rate",
    }
  }
}

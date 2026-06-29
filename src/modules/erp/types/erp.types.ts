export interface ERPWidget {
  id: string
  title: string
  metric: string
  delta: string
  status: 'positive' | 'warning' | 'critical'
  text: string
  icon: string
  type: 'kpi' | 'chart' | 'insight'
  chartType?: 'bar' | 'area' | 'line'
}

export interface FinancialKPIs {
  revenue: number
  cmv: number
  opex: number
  margin: number
  cash: number
  aging: number
  budget: number
  actual: number
}

export interface AIInsight {
  id: string
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  category: 'bottleneck' | 'opportunity' | 'risk' | 'recommendation'
}

export interface ParsedFile {
  name: string
  type: 'pdf' | 'spreadsheet'
  size: string
  data?: any[]
  text?: string
  sheets?: string[]
  selectedSheet?: string
}

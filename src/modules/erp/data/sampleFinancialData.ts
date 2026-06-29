export interface FinancialTrendPoint {
  month: string
  receita: number
  custos: number
  orcado: number
  realizado: number
}

export const sampleFinancialTrend: FinancialTrendPoint[] = [
  { month: 'Jan', receita: 19.5, custos: 12.2, orcado: 19.0, realizado: 19.5 },
  { month: 'Fev', receita: 21.0, custos: 13.0, orcado: 20.0, realizado: 21.0 },
  { month: 'Mar', receita: 20.8, custos: 12.9, orcado: 21.0, realizado: 20.8 },
  { month: 'Abr', receita: 22.4, custos: 14.1, orcado: 22.0, realizado: 22.4 },
  { month: 'Mai', receita: 23.9, custos: 14.8, orcado: 23.0, realizado: 23.9 },
  { month: 'Jun', receita: 24.8, custos: 15.2, orcado: 24.0, realizado: 24.8 },
]

export const defaultKPIs = {
  revenue: 24800000,
  cmv: 15200000,
  opex: 4100000,
  margin: 38.6,
  cash: 3100000,
  aging: 12.5,
  budget: 24000000,
  actual: 24800000,
}

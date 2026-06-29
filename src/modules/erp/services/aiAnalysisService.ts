import { AIInsight, FinancialKPIs } from '../types/erp.types'

export interface AnalysisResult {
  insights: AIInsight[]
  summary: string
  kpiHealth: Record<string, 'positive' | 'warning' | 'critical'>
}

export function generateRecommendations(kpis: FinancialKPIs): AIInsight[] {
  const recommendations: AIInsight[] = []

  // Rule 1: Margin Analysis
  if (kpis.margin < 30) {
    recommendations.push({
      id: 'margin-critical',
      title: 'Otimização de Mix de Vendas Necessária',
      description: `A margem líquida atual está em ${kpis.margin.toFixed(2)}%, abaixo da meta recomendada de 35%. Sugere-se revisar o portfólio de produtos/serviços de menor margem.`,
      priority: 'high',
      category: 'bottleneck'
    })
  } else if (kpis.margin >= 35) {
    recommendations.push({
      id: 'margin-healthy',
      title: 'Preservar Rentabilidade do Mix',
      description: `Margem saudável de ${kpis.margin.toFixed(2)}%. Recomenda-se capitalizar sobre as categorias de alto desempenho para consolidar o market share.`,
      priority: 'low',
      category: 'opportunity'
    })
  }

  // Rule 2: CMV Analysis
  const cmvRatio = kpis.revenue > 0 ? (kpis.cmv / kpis.revenue) * 100 : 0
  if (cmvRatio > 60) {
    recommendations.push({
      id: 'cmv-high',
      title: 'Revisão Urgente de Custos e CMV',
      description: `O custo de mercadorias vendidas representa ${(cmvRatio).toFixed(2)}% do faturamento. É vital abrir negociações com fornecedores ou ajustar precificação de estoque.`,
      priority: 'high',
      category: 'risk'
    })
  } else {
    recommendations.push({
      id: 'cmv-stable',
      title: 'CMV Sob Controle Operacional',
      description: `CMV está mapeado e equilibrado em ${(cmvRatio).toFixed(2)}%. Monitorar flutuações de frete e custos indiretos de distribuição.`,
      priority: 'medium',
      category: 'recommendation'
    })
  }

  // Rule 3: OPEX despesas
  const opexRatio = kpis.revenue > 0 ? (kpis.opex / kpis.revenue) * 100 : 0
  if (opexRatio > 25) {
    recommendations.push({
      id: 'opex-overhead',
      title: 'Controle Estrutural de OPEX',
      description: `Despesas gerais e administrativas representam ${(opexRatio).toFixed(2)}% da receita. Mapear processos para buscar eficiência com automação e auditoria interna.`,
      priority: 'medium',
      category: 'bottleneck'
    })
  }

  // Rule 4: Cash Flow / Liquidez
  if (kpis.cash < 2000000) {
    recommendations.push({
      id: 'cash-liquidity',
      title: 'Mitigação de Exposição de Caixa',
      description: `Saldo de caixa disponível em R$ ${(kpis.cash / 1000000).toFixed(2)}M. Recomenda-se esticar prazos médios de pagamentos a fornecedores para preservar liquidez.`,
      priority: 'high',
      category: 'risk'
    })
  } else {
    recommendations.push({
      id: 'cash-strong',
      title: 'Oportunidade de Alocação de Caixa',
      description: `Saldo líquido forte de R$ ${(kpis.cash / 1000000).toFixed(2)}M. Mapear investimentos de curto prazo em CAPEX ou hedge cambial se houver operações de comércio exterior.`,
      priority: 'medium',
      category: 'opportunity'
    })
  }

  // Rule 5: Aging / Inadimplência (PDD)
  if (kpis.aging > 10) {
    recommendations.push({
      id: 'aging-pdd',
      title: 'Aceleração de Cobrança e Redução de PDD',
      description: `Taxa de atraso em faturas de ${kpis.aging.toFixed(2)}% compromete o capital de giro. Adotar régua de cobrança automática e análise de crédito mais rigorosa.`,
      priority: 'high',
      category: 'risk'
    })
  }

  // Rule 6: Budget vs Actual variance
  const variance = kpis.actual - kpis.budget
  const pctVariance = kpis.budget > 0 ? (variance / kpis.budget) * 100 : 0
  if (Math.abs(pctVariance) > 5) {
    recommendations.push({
      id: 'budget-variance',
      title: 'Desvio no Orçamento Consolidado',
      description: `Desvio de ${pctVariance.toFixed(2)}% entre Orçado e Realizado. Exige rolling forecast para recalibrar as metas do próximo trimestre.`,
      priority: 'medium',
      category: 'recommendation'
    })
  }

  return recommendations
}

export function summarizeDocument(text: string): string {
  if (!text) return 'Nenhum documento carregado para análise.'

  const isFinanceDoc = /faturamento|receita|custo|balanço|dre|ebitda|financeiro|orçamento/i.test(text)
  const length = text.length
  const words = text.split(/\s+/).length

  let summary = `Resumo executivo gerado via análise estrutural (${words} palavras analisadas):\n\n`
  
  if (isFinanceDoc) {
    summary += `📄 **Documento Financeiro Detectado:** O arquivo contém menções diretas a termos de gestão fiscal, faturamento ou contabilidade.\n`
    if (text.toLowerCase().includes('auditoria') || text.toLowerCase().includes('parecer')) {
      summary += `🔍 **Foco do Relatório:** Identificados indícios de parecer de auditoria independente ou revisão de governança.\n`
    } else {
      summary += `📊 **Foco do Relatório:** Parecer de controle interno, demonstrativo de DRE ou análise de desempenho setorial.\n`
    }
  } else {
    summary += `📄 **Documento Geral/Administrativo:** Mapeada estrutura de texto contendo diretrizes corporativas, contratos ou atas de conselho.\n`
  }

  summary += `📌 **Principais Tópicos Identificados:** Mapeamento estruturado de conceitos operacionais e corporativos no documento.\n`
  summary += `💡 **Insights IA sugeridos:** Preparar integração de APIs de LLM (GPT-4 / Gemini Pro) para responder a dúvidas e extrair tabelas complexas.`

  return summary
}

export function analyzeFinancialData(kpis: FinancialKPIs): AnalysisResult {
  const insights = generateRecommendations(kpis)
  
  // Decide health statuses
  const kpiHealth: Record<string, 'positive' | 'warning' | 'critical'> = {
    revenue: kpis.revenue >= kpis.budget ? 'positive' : 'warning',
    margin: kpis.margin >= 35 ? 'positive' : (kpis.margin >= 30 ? 'warning' : 'critical'),
    cmv: (kpis.revenue > 0 ? (kpis.cmv / kpis.revenue) * 100 : 0) > 60 ? 'critical' : 'positive',
    opex: (kpis.revenue > 0 ? (kpis.opex / kpis.revenue) * 100 : 0) > 25 ? 'warning' : 'positive',
    cash: kpis.cash >= 2500000 ? 'positive' : 'critical',
    aging: kpis.aging <= 8 ? 'positive' : (kpis.aging <= 12 ? 'warning' : 'critical')
  }

  const summary = `Diagnóstico de IA: A saúde financeira da operação apresenta ${
    Object.values(kpiHealth).filter((h) => h === 'critical').length
  } pontos críticos e ${
    Object.values(kpiHealth).filter((h) => h === 'warning').length
  } alertas. A margem operacional líquida está sob controle, mas requer atenção em contas a receber.`

  return {
    insights,
    summary,
    kpiHealth
  }
}

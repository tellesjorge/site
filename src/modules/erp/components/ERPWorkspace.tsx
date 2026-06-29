import React, { useState, useMemo } from 'react'
import {
  Sparkles,
  TrendingUp,
  Percent,
  Activity,
  ArrowDownRight,
  DollarSign,
  Clock,
  Coins,
  BarChart2,
  Settings2,
  RotateCcw,
  AlertTriangle,
  Award,
  ShieldAlert,
  Lightbulb
} from 'lucide-react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts'
import { useLanguage } from '../../../context/LanguageContext'

export default function ERPWorkspace() {
  const { language, t } = useLanguage()

  // 1. Simulation states (dials controlled by the user)
  const [simRevenue, setSimRevenue] = useState(24800000)
  const [simCmvPct, setSimCmvPct] = useState(61.3)
  const [simOpexPct, setSimOpexPct] = useState(16.5)
  const [simPmr, setSimPmr] = useState(45) // Collection Days
  const [simPme, setSimPme] = useState(60) // Inventory Days
  const [simPmp, setSimPmp] = useState(30) // Payment Days
  const [simCash, setSimCash] = useState(3100000)
  const [simAging, setSimAging] = useState(12.5) // PDD Inadimplência

  // 2. Formatters
  const formatBRL = (val: number) => {
    const isEn = language === 'en'
    const prefix = isEn ? '$' : 'R$ '
    if (val >= 1000000) return `${prefix}${(val / 1000000).toFixed(2)}M`
    if (val >= 1000) return `${prefix}${(val / 1000).toFixed(1)}k`
    return `${prefix}${val.toFixed(2)}`
  }

  // 3. Computed FP&A Metrics
  const computedMetrics = useMemo(() => {
    const revenue = simRevenue
    const cmv = revenue * (simCmvPct / 100)
    const opex = revenue * (simOpexPct / 100)
    const ebitda = revenue - cmv - opex
    const margin = revenue > 0 ? (ebitda / revenue) * 100 : 0
    
    // Cycle calculations
    const operationalCycle = simPmr + simPme
    const cashCycle = simPmr + simPme - simPmp
    
    // Working Capital Need (NCG)
    // NCG formula: (Revenue / 360) * CCC
    const ncg = (revenue / 360) * cashCycle
    
    // Bad debt write-off exposure
    const pddExposure = revenue * (simAging / 100)

    return {
      revenue,
      cmv,
      opex,
      ebitda,
      margin,
      operationalCycle,
      cashCycle,
      ncg,
      pddExposure
    }
  }, [simRevenue, simCmvPct, simOpexPct, simPmr, simPme, simPmp, simAging])

  // 4. Dynamic AI Insights Rule Engine
  const aiAnalysis = useMemo(() => {
    const { margin, cashCycle, ncg, pddExposure } = computedMetrics
    const insights: Array<{
      id: string
      title: string
      description: string
      priority: 'high' | 'medium' | 'low'
      category: 'risk' | 'opportunity' | 'bottleneck' | 'recommendation'
    }> = []

    // Rule 1: Margins
    if (margin < 15) {
      insights.push({
        id: 'margin-critical',
        title: language === 'en' ? 'Critical EBITDA Margin' : 'Margem EBITDA Crítica',
        description: language === 'en'
          ? `The projected operating margin of ${margin.toFixed(1)}% is too low. We recommend reducing OPEX or reviewing supply costs (COGS/CMV).`
          : `A margem operacional projetada de ${margin.toFixed(1)}% está muito baixa. Recomenda-se corte em OPEX ou revisão de custos de insumos (CMV).`,
        priority: 'high',
        category: 'risk'
      })
    } else if (margin >= 30) {
      insights.push({
        id: 'margin-strong',
        title: language === 'en' ? 'Healthy Profitability' : 'Rentabilidade Saudável',
        description: language === 'en'
          ? `Excellent EBITDA margin of ${margin.toFixed(1)}%. It allows planning reinvestments or dividend distributions.`
          : `Excelente margem EBITDA de ${margin.toFixed(1)}%. Permite planejar reinvestimentos ou distribuição de dividendos.`,
        priority: 'low',
        category: 'opportunity'
      })
    }

    // Rule 2: Cash Conversion Cycle (CCC)
    if (cashCycle > 60) {
      insights.push({
        id: 'ccc-slow',
        title: language === 'en' ? 'Extended Cash Cycle' : 'Ciclo de Caixa Alongado',
        description: language === 'en'
          ? `The cycle is at ${cashCycle} days. Cash is locked in operations for too long, creating liquidity pressure.`
          : `O ciclo está em ${cashCycle} dias. O caixa fica retido na operação por tempo excessivo, gerando pressão de liquidez.`,
        priority: 'high',
        category: 'bottleneck'
      })
    } else if (cashCycle < 0) {
      insights.push({
        id: 'ccc-negative',
        title: language === 'en' ? 'Negative Cash Cycle' : 'Ciclo de Caixa Invertido',
        description: language === 'en'
          ? `Negative cycle of ${cashCycle} days. Excellent! The operation is entirely financed by suppliers.`
          : `Ciclo de ${cashCycle} dias. Excelente! A operação é inteiramente financiada pelos prazos com fornecedores.`,
        priority: 'low',
        category: 'opportunity'
      })
    }

    // Rule 3: NCG / Capital de Giro
    if (ncg > 1500000) {
      insights.push({
        id: 'ncg-high',
        title: language === 'en' ? 'High Working Capital Need' : 'Necessidade de Giro Elevada',
        description: language === 'en'
          ? `Working Capital Need estimated at ${formatBRL(ncg)}. Requires financing or reducing collection days (DSO).`
          : `Necessidade de Capital de Giro estimada em ${formatBRL(ncg)}. Exige captação ou redução de prazos de recebimento (PMR).`,
        priority: 'high',
        category: 'risk'
      })
    }

    // Rule 4: Inventory Days
    if (simPme > 90) {
      insights.push({
        id: 'inventory-slow',
        title: language === 'en' ? 'Slow Inventory Turn' : 'Giro de Estoque Lento',
        description: language === 'en'
          ? `Inventory held on average for ${simPme} days. High risk of obsolescence and elevated storage costs.`
          : `Estoque retido em média por ${simPme} dias. Alto risco de obsolescência e custo de armazenagem elevado.`,
        priority: 'medium',
        category: 'bottleneck'
      })
    }

    // Rule 5: Collection Risk
    if (simAging > 12) {
      insights.push({
        id: 'aging-pdd',
        title: language === 'en' ? 'High Delinquency Risk' : 'Risco de Inadimplência Alto',
        description: language === 'en'
          ? `${simAging}% client delay rate elevates bad debt provision (PDD). Implement stricter credit scoring and active collection.`
          : `Taxa de ${simAging}% de atrasos de clientes eleva a PDD. Implemente análise de crédito mais rigorosa e cobrança ativa.`,
        priority: 'medium',
        category: 'recommendation'
      })
    }

    const criticalCount = insights.filter((i) => i.priority === 'high').length
    const warningCount = insights.filter((i) => i.priority === 'medium').length

    let summary = language === 'en'
      ? 'Operational financial health is balanced. Adjust the sliders to simulate capital stress or cost-cutting scenarios.'
      : 'A saúde financeira da operação está equilibrada. Ajuste as barras deslizantes para simular cenários de estresse de capital ou redução de custos.'
    if (criticalCount > 0) {
      summary = language === 'en'
        ? `Attention: Detected ${criticalCount} high-impact critical points on working capital and margins. Immediate corrective actions recommended.`
        : `Atenção: Detectados ${criticalCount} pontos críticos de alto impacto no capital de giro e margem. Recomenda-se ação corretiva imediata.`
    } else if (warningCount > 0) {
      summary = language === 'en'
        ? `Warning: Identified opportunities for operational optimization in inventory or collections to unlock operating cash.`
        : `Alerta: Identificadas oportunidades de otimização operacional em estoques ou cobrança para liberar caixa operacional.`
    }

    return {
      insights,
      summary
    }
  }, [computedMetrics, simPme, simAging, language])

  // 5. Chart Data Generation
  const chartDataDRE = useMemo(() => {
    return [
      { name: t({ pt: 'Receita', en: 'Revenue' }), Realizado: Math.round(computedMetrics.revenue / 1000), Orcado: 24000 },
      { name: t({ pt: 'CMV', en: 'COGS' }), Realizado: Math.round(computedMetrics.cmv / 1000), Orcado: 14800 },
      { name: t({ pt: 'OPEX', en: 'OPEX' }), Realizado: Math.round(computedMetrics.opex / 1000), Orcado: 4000 },
      { name: t({ pt: 'EBITDA', en: 'EBITDA' }), Realizado: Math.round(computedMetrics.ebitda / 1000), Orcado: 5200 }
    ]
  }, [computedMetrics, t])

  const chartDataCycles = useMemo(() => {
    return [
      { name: t({ pt: 'PMR (Clientes)', en: 'DSO (Receivables)' }), Dias: simPmr, fill: '#0071e3' },
      { name: t({ pt: 'PME (Estoque)', en: 'DIO (Inventory)' }), Dias: simPme, fill: '#00c7be' },
      { name: t({ pt: 'PMP (Forneced.)', en: 'DPO (Payables)' }), Dias: simPmp, fill: '#ff9500' },
      { name: t({ pt: 'Ciclo de Caixa', en: 'Cash Cycle' }), Dias: computedMetrics.cashCycle, fill: computedMetrics.cashCycle > 60 ? '#ff3b30' : computedMetrics.cashCycle > 30 ? '#ffcc00' : '#34c759' }
    ]
  }, [simPmr, simPme, simPmp, computedMetrics.cashCycle, t])

  // 6. Reset function
  const resetSimulation = () => {
    setSimRevenue(24800000)
    setSimCmvPct(61.3)
    setSimOpexPct(16.5)
    setSimPmr(45)
    setSimPme(60)
    setSimPmp(30)
    setSimCash(3100000)
    setSimAging(12.5)
  }

  // Helper classes for priorities
  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-50 text-red-700 border-red-200'
      case 'medium': return 'bg-amber-50 text-amber-700 border-amber-200'
      default: return 'bg-slate-50 text-slate-600 border-slate-200'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'bottleneck': return <AlertTriangle className="h-4 w-4 text-amber-500" />
      case 'risk': return <ShieldAlert className="h-4 w-4 text-red-500" />
      case 'opportunity': return <Award className="h-4 w-4 text-emerald-500" />
      default: return <Lightbulb className="h-4 w-4 text-blue-500" />
    }
  }

  return (
    <div className="space-y-8">
      {/* 1. Simulation Dial Controls */}
      <div className="rounded-[32px] border border-slate-100 bg-white p-6 shadow-[0_20px_50px_rgba(15,23,42,0.02)] space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Settings2 className="h-4.5 w-4.5 text-[#0071e3] animate-pulse" />
              {t({ pt: 'Painel de Controles e Variáveis FP&A', en: 'Control Panel & FP&A Variables' })}
            </h3>
            <p className="text-[11px] text-slate-500">
              {t({
                pt: 'Arraste os seletores para alterar o cenário operacional e recalcular a rentabilidade da operação.',
                en: 'Drag the sliders to modify the operational scenario and recalculate performance.'
              })}
            </p>
          </div>
          
          <button
            type="button"
            onClick={resetSimulation}
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-800"
          >
            <RotateCcw className="h-3.5 w-3.5" /> {t({ pt: 'Restaurar Baseline', en: 'Reset Baseline' })}
          </button>
        </div>

        {/* Sliders Grid */}
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 pt-3 border-t border-slate-100/60">
          {/* Slider 1: Revenue */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-slate-600">{t({ pt: 'Receita Realizada (Anual)', en: 'Realized Revenue (Annual)' })}</span>
              <span className="font-extrabold text-[#0071e3]">{formatBRL(simRevenue)}</span>
            </div>
            <input
              type="range"
              min={1000000}
              max={50000000}
              step={200000}
              value={simRevenue}
              onChange={(e) => setSimRevenue(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#0071e3]"
            />
            <div className="flex justify-between text-[9px] text-slate-400 select-none">
              <span>{language === 'en' ? '$1M' : 'R$ 1M'}</span>
              <span>{language === 'en' ? '$50M' : 'R$ 50M'}</span>
            </div>
          </div>

          {/* Slider 2: CMV % */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-slate-600">{t({ pt: 'CMV / Custos', en: 'COGS / Costs' })}</span>
              <span className="font-extrabold text-[#0071e3]">{simCmvPct.toFixed(1)}%</span>
            </div>
            <input
              type="range"
              min={10}
              max={75}
              step={0.5}
              value={simCmvPct}
              onChange={(e) => setSimCmvPct(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#0071e3]"
            />
            <div className="flex justify-between text-[9px] text-slate-400 select-none">
              <span>10%</span>
              <span>75%</span>
            </div>
          </div>

          {/* Slider 3: OPEX % */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-slate-600">{t({ pt: 'OPEX / Despesas Firas', en: 'OPEX / Fixed Expenses' })}</span>
              <span className="font-extrabold text-[#0071e3]">{simOpexPct.toFixed(1)}%</span>
            </div>
            <input
              type="range"
              min={5}
              max={45}
              step={0.5}
              value={simOpexPct}
              onChange={(e) => setSimOpexPct(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#0071e3]"
            />
            <div className="flex justify-between text-[9px] text-slate-400 select-none">
              <span>5%</span>
              <span>45%</span>
            </div>
          </div>

          {/* Slider 4: PMR */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-slate-600">{t({ pt: 'Recebimento de Clientes', en: 'Receivables Cycle (DSO)' })}</span>
              <span className="font-extrabold text-[#0071e3]">{simPmr} {t({ pt: 'dias', en: 'days' })}</span>
            </div>
            <input
              type="range"
              min={15}
              max={120}
              step={1}
              value={simPmr}
              onChange={(e) => setSimPmr(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#0071e3]"
            />
            <div className="flex justify-between text-[9px] text-slate-400 select-none">
              <span>15 {t({ pt: 'dias', en: 'days' })}</span>
              <span>120 {t({ pt: 'dias', en: 'days' })}</span>
            </div>
          </div>

          {/* Slider 5: PME */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-slate-600">{t({ pt: 'Giro de Estoque (PME)', en: 'Inventory Turns (DIO)' })}</span>
              <span className="font-extrabold text-[#0071e3]">{simPme} {t({ pt: 'dias', en: 'days' })}</span>
            </div>
            <input
              type="range"
              min={10}
              max={180}
              step={1}
              value={simPme}
              onChange={(e) => setSimPme(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#0071e3]"
            />
            <div className="flex justify-between text-[9px] text-slate-400 select-none">
              <span>10 {t({ pt: 'dias', en: 'days' })}</span>
              <span>180 {t({ pt: 'dias', en: 'days' })}</span>
            </div>
          </div>

          {/* Slider 6: PMP */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-slate-600">{t({ pt: 'Prazo de Compra (PMP)', en: 'Payables Cycle (DPO)' })}</span>
              <span className="font-extrabold text-[#0071e3]">{simPmp} {t({ pt: 'dias', en: 'days' })}</span>
            </div>
            <input
              type="range"
              min={15}
              max={120}
              step={1}
              value={simPmp}
              onChange={(e) => setSimPmp(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#0071e3]"
            />
            <div className="flex justify-between text-[9px] text-slate-400 select-none">
              <span>15 {t({ pt: 'dias', en: 'days' })}</span>
              <span>120 {t({ pt: 'dias', en: 'days' })}</span>
            </div>
          </div>

          {/* Slider 7: Cash */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-slate-600">{t({ pt: 'Caixa Disponível', en: 'Available Cash' })}</span>
              <span className="font-extrabold text-[#0071e3]">{formatBRL(simCash)}</span>
            </div>
            <input
              type="range"
              min={100000}
              max={15000000}
              step={100000}
              value={simCash}
              onChange={(e) => setSimCash(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#0071e3]"
            />
            <div className="flex justify-between text-[9px] text-slate-400 select-none">
              <span>{language === 'en' ? '$100k' : 'R$ 100k'}</span>
              <span>{language === 'en' ? '$15.0M' : 'R$ 15.0M'}</span>
            </div>
          </div>

          {/* Slider 8: Aging */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-slate-600">{t({ pt: 'Inadimplência (PDD)', en: 'Bad Debt Rate' })}</span>
              <span className="font-extrabold text-[#0071e3]">{simAging.toFixed(1)}%</span>
            </div>
            <input
              type="range"
              min={1}
              max={25}
              step={0.5}
              value={simAging}
              onChange={(e) => setSimAging(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#0071e3]"
            />
            <div className="flex justify-between text-[9px] text-slate-400 select-none">
              <span>1%</span>
              <span>25%</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Executive Grid Layout: Cards & Insights */}
      <div className="grid gap-6 lg:grid-cols-[1fr_minmax(330px,380px)]">
        <div className="space-y-6">
          {/* KPI Dashboard Cards Grid */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {/* Card 1: Receita */}
            <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm space-y-2">
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-blue-50 p-1 text-[#0071e3]">
                  <TrendingUp className="h-4.5 w-4.5" />
                </div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t({ pt: 'Receita Realizada', en: 'Realized Revenue' })}</span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold tracking-tight text-slate-900">{formatBRL(computedMetrics.revenue)}</span>
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                  computedMetrics.revenue >= 24000000 ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-amber-50 border-amber-100 text-amber-700'
                }`}>
                  {computedMetrics.revenue >= 24000000 ? t({ pt: '+3.3% vs Orçado', en: '+3.3% vs Budget' }) : t({ pt: 'Abaixo da Meta', en: 'Below Target' })}
                </span>
              </div>
              <p className="text-[10px] text-slate-400">{t({ pt: 'Baseline anual projetada de faturamento bruto.', en: 'Projected annual gross billing baseline.' })}</p>
            </div>

            {/* Card 2: EBITDA */}
            <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm space-y-2">
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-emerald-50 p-1 text-emerald-600">
                  <Percent className="h-4.5 w-4.5" />
                </div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">EBITDA & {t({ pt: 'Margem', en: 'Margin' })}</span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold tracking-tight text-slate-900">{formatBRL(computedMetrics.ebitda)}</span>
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                  computedMetrics.margin >= 25 ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : computedMetrics.margin >= 15 ? 'bg-amber-50 border-amber-100 text-amber-700' : 'bg-red-50 border-red-100 text-red-700'
                }`}>
                  {computedMetrics.margin.toFixed(1)}% {t({ pt: 'Margem', en: 'Margin' })}
                </span>
              </div>
              <p className="text-[10px] text-slate-400">{t({ pt: 'Lucro operacional antes de impostos e amortizações.', en: 'Operating income before tax and depreciation.' })}</p>
            </div>

            {/* Card 3: Ciclo de Caixa */}
            <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm space-y-2">
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-amber-50 p-1 text-amber-600">
                  <Clock className="h-4.5 w-4.5" />
                </div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t({ pt: 'Ciclo de Caixa (CCC)', en: 'Cash Cycle (CCC)' })}</span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold tracking-tight text-slate-900">{computedMetrics.cashCycle} {t({ pt: 'dias', en: 'days' })}</span>
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                  computedMetrics.cashCycle <= 30 ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : computedMetrics.cashCycle <= 60 ? 'bg-amber-50 border-amber-100 text-amber-700' : 'bg-red-50 border-red-100 text-red-700'
                }`}>
                  PMR + PME - PMP
                </span>
              </div>
              <p className="text-[10px] text-slate-400">{t({ pt: 'Ciclo de conversão do capital de giro operacional.', en: 'Operating working capital conversion cycle.' })}</p>
            </div>

            {/* Card 4: NCG */}
            <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm space-y-2">
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-cyan-50 p-1 text-cyan-600">
                  <Coins className="h-4.5 w-4.5" />
                </div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t({ pt: 'Necessidade de Giro (NCG)', en: 'Working Capital Needs (WCN)' })}</span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold tracking-tight text-slate-900">
                  {computedMetrics.ncg > 0 ? formatBRL(computedMetrics.ncg) : t({ pt: 'Superávit Caixa', en: 'Cash Surplus' })}
                </span>
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                  computedMetrics.ncg > 2000000 ? 'bg-red-50 border-red-100 text-red-700' : computedMetrics.ncg > 0 ? 'bg-amber-50 border-amber-100 text-amber-700' : 'bg-emerald-50 border-emerald-100 text-emerald-700'
                }`}>
                  {computedMetrics.ncg > 0 ? t({ pt: 'Foco em liquidez', en: 'Focus on liquidity' }) : t({ pt: 'Financiado Fornec.', en: 'Supplier financed' })}
                </span>
              </div>
              <p className="text-[10px] text-slate-400">{t({ pt: 'Capital necessário para manter as operações de giro.', en: 'Required capital to fund rotating operations.' })}</p>
            </div>

            {/* Card 5: Ciclo Operacional */}
            <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm space-y-2">
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-purple-50 p-1 text-purple-600">
                  <Activity className="h-4.5 w-4.5" />
                </div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t({ pt: 'Ciclo Operacional', en: 'Operating Cycle' })}</span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold tracking-tight text-slate-900">{computedMetrics.operationalCycle} {t({ pt: 'dias', en: 'days' })}</span>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full border bg-slate-50 border-slate-150 text-slate-600">
                  PMR + PME
                </span>
              </div>
              <p className="text-[10px] text-slate-400">{t({ pt: 'Período total desde a compra do estoque até a venda.', en: 'Total days from inventory buy to customer sell.' })}</p>
            </div>

            {/* Card 6: Inadimplência */}
            <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm space-y-2">
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-rose-50 p-1 text-rose-600">
                  <DollarSign className="h-4.5 w-4.5" />
                </div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t({ pt: 'Liquidez & PDD', en: 'Liquidity & Bad Debt' })}</span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold tracking-tight text-slate-900">{formatBRL(simCash)}</span>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full border bg-red-50 border-red-100 text-red-700">
                  {simAging.toFixed(1)}% PDD
                </span>
              </div>
              <p className="text-[10px] text-slate-400">
                {t({ pt: 'Exposição à inadimplência: ', en: 'Exposure to defaults: ' })}{formatBRL(computedMetrics.pddExposure)}
              </p>
            </div>
          </div>

          {/* Recharts Graphical Analysis */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Chart 1: Budget vs Actual */}
            <div className="rounded-[32px] border border-slate-100 bg-white p-5 shadow-sm space-y-4">
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <BarChart2 className="h-4 w-4 text-[#0071e3]" />
                  {t({ pt: 'Orçamento vs Realizado (Anualizado)', en: 'Budget vs Actual (Annualized)' })}
                </h4>
                <p className="text-[10px] text-slate-400">
                  {t({ pt: 'Comparativo das rubricas do DRE em milhares.', en: 'Comparative income statement lines in thousands.' })}
                </p>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartDataDRE} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" tick={{ fontSize: 9 }} stroke="#94a3b8" />
                    <YAxis tick={{ fontSize: 9 }} stroke="#94a3b8" />
                    <Tooltip wrapperStyle={{ fontSize: 10 }} />
                    <Legend wrapperStyle={{ fontSize: 9 }} />
                    <Bar dataKey="Orcado" name={t({ pt: 'Meta/Orçado', en: 'Target/Budgeted' })} fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Realizado" name={t({ pt: 'Simulado', en: 'Simulated' })} fill="#0071e3" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Cycles Bar Chart */}
            <div className="rounded-[32px] border border-slate-100 bg-white p-5 shadow-sm space-y-4">
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Activity className="h-4 w-4 text-emerald-500" />
                  {t({ pt: 'Estrutura do Ciclo de Conversão (Dias)', en: 'Conversion Cycle Structure (Days)' })}
                </h4>
                <p className="text-[10px] text-slate-400">
                  {t({ pt: 'Relação entre prazos de recebimento, estocagem, pagamento e ciclo de caixa.', en: 'Relation between receivables, inventory holding, payment terms, and cash cycle.' })}
                </p>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    data={chartDataCycles}
                    margin={{ top: 10, right: 10, left: 10, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis type="number" tick={{ fontSize: 9 }} stroke="#94a3b8" />
                    <YAxis dataKey="name" type="category" tick={{ fontSize: 8 }} stroke="#94a3b8" width={90} />
                    <Tooltip wrapperStyle={{ fontSize: 10 }} />
                    <Bar dataKey="Dias" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic AI insights panel inside Workspace */}
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm space-y-6 h-full flex flex-col">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
                <Sparkles className="h-4.5 w-4.5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-800">
                  {t({ pt: 'Insights de IA & Recomendações', en: 'AI Insights & Recommendations' })}
                </h3>
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                  {t({ pt: 'Controller Virtual Ativo', en: 'Virtual Controller Active' })}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-cyan-100/40 bg-cyan-50/20 p-4 text-xs text-slate-700 leading-relaxed shadow-sm">
              <p className="font-semibold text-cyan-900 mb-1 flex items-center gap-1">
                📊 {t({ pt: 'Diagnóstico Financeiro Consolidado', en: 'Consolidated Financial Diagnosis' })}
              </p>
              <p className="text-slate-600">{aiAnalysis.summary}</p>
            </div>

            <div className="space-y-3 overflow-y-auto flex-1 max-h-[500px] pr-1">
              {aiAnalysis.insights.map((insight) => (
                <div
                  key={insight.id}
                  className="group rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition hover:shadow-md hover:border-slate-200"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="mt-0.5 rounded-xl bg-slate-50 p-1.5 transition group-hover:bg-slate-100">
                        {getCategoryIcon(insight.category)}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-slate-800 truncate">
                          {insight.title}
                        </h4>
                        <p className="mt-1 text-[11px] leading-relaxed text-slate-500">
                          {insight.description}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`inline-block rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide flex-shrink-0 ${getPriorityClass(
                        insight.priority
                      )}`}
                    >
                      {insight.priority === 'high'
                        ? t({ pt: 'Alta', en: 'High' })
                        : insight.priority === 'medium'
                        ? t({ pt: 'Média', en: 'Medium' })
                        : t({ pt: 'Baixa', en: 'Low' })}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-[10px] text-center text-slate-400 bg-slate-50 p-2.5 rounded-xl border border-slate-100/50 select-none font-medium">
              {t({
                pt: '💡 **Recomendações FP&A**: O simulador analisa o mix de prazos e CMV para sugerir ajustes imediatos no ciclo operacional e de tesouraria.',
                en: '💡 **FP&A Recommendations**: The engine reviews credit cycles and margins to suggest immediate tweaks to operating cycle metrics.'
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

import React, { useState } from 'react'
import { Sparkles, FileText, CheckCircle, Database } from 'lucide-react'
import ERPFileDropzone from './ERPFileDropzone'
import ERPDocumentReader from './ERPDocumentReader'
import ERPSpreadsheetReader from './ERPSpreadsheetReader'
import ERPDashboardGrid from './ERPDashboardGrid'
import ERPAIInsightsPanel from './ERPAIInsightsPanel'
import { ParsedFile, ERPWidget, FinancialKPIs } from '../types/erp.types'
import { defaultWidgets } from '../data/defaultWidgets'
import { defaultKPIs } from '../data/sampleFinancialData'
import { parsePdfText } from '../services/pdfService'
import { readSpreadsheetFile, mapFinancialColumns, extractFinancialKPIs } from '../services/spreadsheetService'
import { analyzeFinancialData, generateRecommendations } from '../services/aiAnalysisService'

export default function ERPWorkspace() {
  const [file, setFile] = useState<ParsedFile | null>(null)
  const [kpis, setKpis] = useState<FinancialKPIs>(defaultKPIs)
  const [widgets, setWidgets] = useState<ERPWidget[]>(defaultWidgets)
  
  // Initialize AI analysis with default KPIs
  const initialAnalysis = analyzeFinancialData(defaultKPIs)
  const [analysis, setAnalysis] = useState(initialAnalysis)

  // Simulation states for interactive What-If FP&A scenario planning
  const [isSimulating, setIsSimulating] = useState(false)
  const [simRevenue, setSimRevenue] = useState(24800000)
  const [simCmv, setSimCmv] = useState(61.29)
  const [simOpex, setSimOpex] = useState(16.53)
  const [simCash, setSimCash] = useState(3100000)
  const [simAging, setSimAging] = useState(12.5)

  // Centralized math recalibration for the simulation sliders
  const recalculateKPIs = (
    rev: number,
    cmvPct: number,
    opexPct: number,
    csh: number,
    ag: number
  ) => {
    const calculatedCmv = rev * (cmvPct / 100)
    const calculatedOpex = rev * (opexPct / 100)
    const calculatedMargin = rev > 0 ? ((rev - calculatedCmv - calculatedOpex) / rev) * 100 : 0

    const updatedKPIs: FinancialKPIs = {
      revenue: rev,
      cmv: calculatedCmv,
      opex: calculatedOpex,
      margin: calculatedMargin,
      cash: csh,
      aging: ag,
      budget: 24000000, // Fixed R$ 24M budget for meta calculations
      actual: rev
    }

    setKpis(updatedKPIs)
    
    const newAnalysis = analyzeFinancialData(updatedKPIs)
    setAnalysis(newAnalysis)

    const formatBRL = (val: number) => {
      if (val >= 1000000) return `R$ ${(val / 1000000).toFixed(2)}M`
      if (val >= 1000) return `R$ ${(val / 1000).toFixed(1)}k`
      return `R$ ${val.toFixed(2)}`
    }

    // Refresh KPI metrics and statuses on dashboard cards
    const updatedWidgets = widgets.map((w) => {
      if (w.id === 'kpi-revenue') {
        return { 
          ...w, 
          metric: formatBRL(rev), 
          status: newAnalysis.kpiHealth.revenue,
          text: rev >= 24000000 ? 'Faturamento superando a meta planejada.' : 'Faturamento abaixo da meta orçada.'
        }
      }
      if (w.id === 'kpi-margin') {
        return { 
          ...w, 
          metric: `${calculatedMargin.toFixed(2)}%`, 
          status: newAnalysis.kpiHealth.margin,
          text: calculatedMargin >= 35 ? 'Margem forte e rentabilidade sob controle.' : 'Margem comprometida, CMV e OPEX requerem corte.'
        }
      }
      if (w.id === 'kpi-cmv') {
        return { 
          ...w, 
          metric: `${cmvPct.toFixed(2)}%`, 
          status: newAnalysis.kpiHealth.cmv,
          text: cmvPct > 60 ? 'Custo de CMV crítico, renegociar contratos!' : 'CMV controlado e estável.'
        }
      }
      if (w.id === 'kpi-opex') {
        return { 
          ...w, 
          metric: formatBRL(calculatedOpex), 
          status: newAnalysis.kpiHealth.opex,
          text: opexPct > 25 ? 'Gargalo administrativo, OPEX elevado.' : 'OPEX mantido sob disciplina fiscal.'
        }
      }
      if (w.id === 'kpi-cash') {
        return { 
          ...w, 
          metric: formatBRL(csh), 
          status: newAnalysis.kpiHealth.cash,
          text: csh >= 2500000 ? 'Caixa saudável para alocação.' : 'Caixa sob risco de liquidez, esticar PMPs.'
        }
      }
      if (w.id === 'kpi-aging') {
        return { 
          ...w, 
          metric: `${ag.toFixed(2)}%`, 
          status: newAnalysis.kpiHealth.aging,
          text: ag > 10 ? 'Inadimplência alta, acelerar cobranças.' : 'Ciclo de recebimento sob controle.'
        }
      }
      if (w.id === 'chart-budget') {
        return {
          ...w,
          metric: `Realizado: ${formatBRL(rev)} / Orçado: R$ 24,0M`,
          delta: `${((rev / 24000000) * 100).toFixed(1)}% Meta`
        }
      }
      return w
    })
    setWidgets(updatedWidgets)
  }

  const handleToggleSimulation = (active: boolean) => {
    setIsSimulating(active)
    if (active) {
      recalculateKPIs(simRevenue, simCmv, simOpex, simCash, simAging)
    } else {
      recalculateKPIs(
        kpis.revenue,
        kpis.revenue > 0 ? (kpis.cmv / kpis.revenue) * 100 : 61.29,
        kpis.revenue > 0 ? (kpis.opex / kpis.revenue) * 100 : 16.53,
        kpis.cash,
        kpis.aging
      )
    }
  }

  const handleSliderChange = (
    field: 'revenue' | 'cmv' | 'opex' | 'cash' | 'aging',
    val: number
  ) => {
    let rev = simRevenue
    let cmvVal = simCmv
    let opexVal = simOpex
    let csh = simCash
    let ag = simAging

    if (field === 'revenue') {
      setSimRevenue(val)
      rev = val
    } else if (field === 'cmv') {
      setSimCmv(val)
      cmvVal = val
    } else if (field === 'opex') {
      setSimOpex(val)
      opexVal = val
    } else if (field === 'cash') {
      setSimCash(val)
      csh = val
    } else if (field === 'aging') {
      setSimAging(val)
      ag = val
    }

    recalculateKPIs(rev, cmvVal, opexVal, csh, ag)
  }

  const resetSimulation = () => {
    const defaultRev = file?.type === 'spreadsheet' ? kpis.revenue : 24800000
    const defaultCmv = file?.type === 'spreadsheet' && kpis.revenue > 0 ? (kpis.cmv / kpis.revenue) * 100 : 61.29
    const defaultOpex = file?.type === 'spreadsheet' && kpis.revenue > 0 ? (kpis.opex / kpis.revenue) * 100 : 16.53
    const defaultCash = file?.type === 'spreadsheet' ? kpis.cash : 3100000
    const defaultAging = file?.type === 'spreadsheet' ? kpis.aging : 12.5

    setSimRevenue(defaultRev)
    setSimCmv(defaultCmv)
    setSimOpex(defaultOpex)
    setSimCash(defaultCash)
    setSimAging(defaultAging)

    recalculateKPIs(defaultRev, defaultCmv, defaultOpex, defaultCash, defaultAging)
  }

  const handleFileParsed = async (
    rawFile: File,
    type: 'pdf' | 'spreadsheet',
    arrayBuffer: ArrayBuffer
  ) => {
    if (type === 'pdf') {
      try {
        const { text, pageCount } = await parsePdfText(arrayBuffer)
        setFile({
          name: rawFile.name,
          type: 'pdf',
          size: (rawFile.size / 1024 / 1024).toFixed(2) + ' MB',
          text,
          sheets: [],
          selectedSheet: ''
        })
      } catch (err) {
        console.error(err)
      }
    } else if (type === 'spreadsheet') {
      try {
        const { sheets, sheetData } = readSpreadsheetFile(arrayBuffer)
        const selectedSheet = sheets[0] || ''
        const rows = sheetData[selectedSheet] || []
        
        // Mapear colunas financeiras
        const cols = mapFinancialColumns(rows)
        // Extrair indicadores
        const extracted = extractFinancialKPIs(rows, cols)

        // Atualizar KPIs locais
        const updatedKPIs: FinancialKPIs = {
          ...kpis,
          revenue: extracted.revenue || kpis.revenue,
          cmv: extracted.cmv || kpis.cmv,
          opex: extracted.opex || kpis.opex,
          margin: extracted.margin || kpis.margin
        }
        setKpis(updatedKPIs)

        // Sincronizar estados dos sliders de simulação com a planilha
        setSimRevenue(updatedKPIs.revenue)
        const cmvRatio = updatedKPIs.revenue > 0 ? (updatedKPIs.cmv / updatedKPIs.revenue) * 100 : 61.29
        const opexRatio = updatedKPIs.revenue > 0 ? (updatedKPIs.opex / updatedKPIs.revenue) * 100 : 16.53
        setSimCmv(cmvRatio)
        setSimOpex(opexRatio)
        setSimCash(updatedKPIs.cash)
        setSimAging(updatedKPIs.aging)

        // Recalcular Diagnóstico de IA
        const newAnalysis = analyzeFinancialData(updatedKPIs)
        setAnalysis(newAnalysis)

        // Formatar valores para os widgets correspondentes
        const formatBRL = (val: number) => {
          if (val >= 1000000) return `R$ ${(val / 1000000).toFixed(2)}M`
          if (val >= 1000) return `R$ ${(val / 1000).toFixed(1)}k`
          return `R$ ${val.toFixed(2)}`
        }

        // Atualizar lista de widgets
        const updatedWidgets = widgets.map((w) => {
          if (w.id === 'kpi-revenue') {
            return { ...w, metric: formatBRL(updatedKPIs.revenue), status: newAnalysis.kpiHealth.revenue }
          }
          if (w.id === 'kpi-margin') {
            return { ...w, metric: `${updatedKPIs.margin.toFixed(2)}%`, status: newAnalysis.kpiHealth.margin }
          }
          if (w.id === 'kpi-cmv') {
            const cmvPct = updatedKPIs.revenue > 0 ? (updatedKPIs.cmv / updatedKPIs.revenue) * 100 : 0
            return { ...w, metric: `${cmvPct.toFixed(2)}%`, status: newAnalysis.kpiHealth.cmv }
          }
          if (w.id === 'kpi-opex') {
            return { ...w, metric: formatBRL(updatedKPIs.opex), status: newAnalysis.kpiHealth.opex }
          }
          return w
        })
        setWidgets(updatedWidgets)

        setFile({
          name: rawFile.name,
          type: 'spreadsheet',
          size: (rawFile.size / 1024).toFixed(1) + ' KB',
          data: rows,
          sheets,
          selectedSheet
        })
      } catch (err) {
        console.error(err)
      }
    }
  }

  const handleSheetChangeInReader = (sheetName: string) => {
    // If we have sheet data already cached in the file, we can optionally recalculate.
    // For demonstration, selecting tabs updates sheet view.
  }

  const clearWorkspace = () => {
    setFile(null)
    setKpis(defaultKPIs)
    setWidgets(defaultWidgets)
    setAnalysis(analyzeFinancialData(defaultKPIs))
  }

  return (
    <div className="space-y-8">
      {/* File Dropper Workspace area */}
      <div className="grid gap-6 lg:grid-cols-[1fr_minmax(320px,380px)]">
        <div className="space-y-6">
          <ERPFileDropzone onFileParsed={handleFileParsed} />

          {file && file.type === 'pdf' && file.text && (
            <ERPDocumentReader
              fileName={file.name}
              pageCount={file.sheets?.length || 1}
              text={file.text}
            />
          )}

          {file && file.type === 'spreadsheet' && file.sheets && (
            <ERPSpreadsheetReader
              fileName={file.name}
              sheets={file.sheets}
              sheetData={{ [file.selectedSheet || '']: file.data || [] }}
              onSheetChanged={handleSheetChangeInReader}
            />
          )}
        </div>

        <div className="space-y-6">
          <ERPAIInsightsPanel insights={analysis.insights} summary={analysis.summary} />
        </div>
      </div>

      {/* Interactive Simulation Sliders Panel */}
      <div className="rounded-[30px] border border-white/80 bg-white/70 p-6 shadow-[0_20px_50px_rgba(15,23,42,0.04)] backdrop-blur-xl space-y-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Sparkles className="h-4.5 w-4.5 text-[#0071e3] animate-pulse" />
              Simulador de Cenários & Planejamento (What-If)
            </h3>
            <p className="text-[11px] text-slate-500">
              Ajuste as variáveis operacionais para recalibrar o DRE, margens e as recomendações de IA em tempo real.
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            {isSimulating && (
              <button
                type="button"
                onClick={resetSimulation}
                className="text-xs text-[#0071e3] font-bold hover:underline"
              >
                Restaurar Padrão
              </button>
            )}
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={isSimulating}
                onChange={(e) => handleToggleSimulation(e.target.checked)}
                className="peer sr-only"
              />
              <div className="peer h-5.5 w-10 rounded-full bg-slate-200 after:absolute after:top-[2px] after:left-[2px] after:h-4.5 after:w-4.5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-[#0071e3] peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none"></div>
              <span className="ml-2 text-xs font-bold text-slate-700 select-none">Modo Simulação</span>
            </label>
          </div>
        </div>

        {isSimulating ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5 pt-3 border-t border-slate-100/60">
            {/* Slider 1: Revenue */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-slate-600">Receita Realizada</span>
                <span className="font-extrabold text-[#0071e3]">
                  {simRevenue >= 1000000 ? `R$ ${(simRevenue / 1000000).toFixed(2)}M` : `R$ ${(simRevenue / 1000).toFixed(0)}k`}
                </span>
              </div>
              <input
                type="range"
                min={1000000}
                max={50000000}
                step={100000}
                value={simRevenue}
                onChange={(e) => handleSliderChange('revenue', Number(e.target.value))}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#0071e3]"
              />
              <div className="flex justify-between text-[9px] text-slate-400">
                <span>R$ 1.0M</span>
                <span>R$ 50.0M</span>
              </div>
            </div>

            {/* Slider 2: CMV % */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-slate-600">CMV / Custos</span>
                <span className="font-extrabold text-[#0071e3]">{simCmv.toFixed(1)}%</span>
              </div>
              <input
                type="range"
                min={20}
                max={75}
                step={0.1}
                value={simCmv}
                onChange={(e) => handleSliderChange('cmv', Number(e.target.value))}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#0071e3]"
              />
              <div className="flex justify-between text-[9px] text-slate-400">
                <span>20%</span>
                <span>75%</span>
              </div>
            </div>

            {/* Slider 3: OPEX % */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-slate-600">OPEX / Despesas</span>
                <span className="font-extrabold text-[#0071e3]">{simOpex.toFixed(1)}%</span>
              </div>
              <input
                type="range"
                min={5}
                max={45}
                step={0.1}
                value={simOpex}
                onChange={(e) => handleSliderChange('opex', Number(e.target.value))}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#0071e3]"
              />
              <div className="flex justify-between text-[9px] text-slate-400">
                <span>5%</span>
                <span>45%</span>
              </div>
            </div>

            {/* Slider 4: Cash */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-slate-600">Fluxo de Caixa</span>
                <span className="font-extrabold text-[#0071e3]">
                  {simCash >= 1000000 ? `R$ ${(simCash / 1000000).toFixed(2)}M` : `R$ ${(simCash / 1000).toFixed(0)}k`}
                </span>
              </div>
              <input
                type="range"
                min={100000}
                max={10000000}
                step={100000}
                value={simCash}
                onChange={(e) => handleSliderChange('cash', Number(e.target.value))}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#0071e3]"
              />
              <div className="flex justify-between text-[9px] text-slate-400">
                <span>R$ 100k</span>
                <span>R$ 10.0M</span>
              </div>
            </div>

            {/* Slider 5: Aging */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-slate-600">Aging / PDD</span>
                <span className="font-extrabold text-[#0071e3]">{simAging.toFixed(1)}%</span>
              </div>
              <input
                type="range"
                min={1}
                max={25}
                step={0.1}
                value={simAging}
                onChange={(e) => handleSliderChange('aging', Number(e.target.value))}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#0071e3]"
              />
              <div className="flex justify-between text-[9px] text-slate-400">
                <span>1%</span>
                <span>25%</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="pt-3 border-t border-slate-100/60 text-center py-4">
            <p className="text-xs text-slate-400">
              Ative o <strong className="text-slate-500 font-semibold">Modo Simulação</strong> para habilitar as barras deslizantes e realizar simulações DRE.
            </p>
          </div>
        )}
      </div>

      {/* Main Interactive Dashboard Area */}
      <div className="space-y-4 pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <Database className="h-5 w-5 text-[#0071e3]" /> Painel Executivo Demonstrativo
          </h3>
          {file && (
            <button
              type="button"
              onClick={clearWorkspace}
              className="text-xs text-red-500 font-bold hover:underline"
            >
              Limpar Workspace
            </button>
          )}
        </div>

        <ERPDashboardGrid widgets={widgets} />
      </div>
    </div>
  )
}

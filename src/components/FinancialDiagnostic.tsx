import { motion } from 'framer-motion'
import { AlertTriangle, ArrowRight, Copy, FileSpreadsheet, Mail, Save, Send, Sparkles, TrendingUp, UploadCloud } from 'lucide-react'
import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from 'react'
import { jsPDF } from 'jspdf'
import * as XLSX from 'xlsx'
import * as pdfjsLib from 'pdfjs-dist'

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString()

type DiagnosticState = {
  revenue: number
  cogs: number
  budget: number
  actual: number
  cash: number
  inventory: number
  receivables: number
  payables: number
}

type InsightItem = {
  label: string
  value: string
  detail: string
  tone: 'critical' | 'warning' | 'positive'
}

type LeadForm = {
  name: string
  email: string
  company: string
  goal: string
}

type LeadEntry = LeadForm & {
  createdAt: string
  summary: {
    revenue: string
    margin: string
    cashCoverage: string
  }
}

const STORAGE_KEY = 'jorge-financial-diagnostic'
const LEAD_STORAGE_KEY = 'jorge-financial-leads'

const initialState: DiagnosticState = {
  revenue: 1250000,
  cogs: 780000,
  budget: 1400000,
  actual: 1180000,
  cash: 240000,
  inventory: 190000,
  receivables: 180000,
  payables: 220000,
}

const sampleState: DiagnosticState = {
  revenue: 980000,
  cogs: 660000,
  budget: 1100000,
  actual: 900000,
  cash: 110000,
  inventory: 260000,
  receivables: 240000,
  payables: 310000,
}

function parseNumber(value: string) {
  if (!value) return 0
  const sanitized = value
    .replace(/[^\d,.-]/g, '')
  const numeric = Number(sanitized)
  return Number.isFinite(numeric) ? numeric : 0
}

function findMetric(text: string, patterns: string[]) {
  const normalized = text.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
  for (const pattern of patterns) {
    const index = normalized.indexOf(pattern)
    if (index >= 0) {
      const slice = normalized.slice(index, index + 220)
      const match = slice.match(/[-+]?\d{1,3}(?:[.\s]\d{3})*(?:,\d+)?|[-+]?\d+(?:,\d+)?/)
      if (match) return parseNumber(match[0])
    }
  }
  return 0
}

function extractMetricsFromText(text: string): Partial<DiagnosticState> {
  return {
    revenue: findMetric(text, ['receita', 'revenue', 'vendas', 'faturamento']),
    cogs: findMetric(text, ['custo', 'cogs', 'cmv', 'custos']),
    budget: findMetric(text, ['orcamento', 'budget', 'meta', 'planejado']),
    actual: findMetric(text, ['realizado', 'actual', 'real', 'resultado']),
    cash: findMetric(text, ['caixa', 'cash', 'disponibilidade']),
    inventory: findMetric(text, ['estoque', 'inventory', 'estoques']),
    receivables: findMetric(text, ['contas a receber', 'recebiveis', 'recebíveis', 'accounts receivable']),
    payables: findMetric(text, ['contas a pagar', 'fornecedores', 'accounts payable']),
  }
}

function handleExcelFile(file: File) {
  return new Promise<Partial<DiagnosticState>>((resolve) => {
    const reader = new FileReader()
    reader.onload = (event) => {
      const data = event.target?.result
      if (!data) {
        resolve({})
        return
      }

      const workbook = XLSX.read(data, { type: 'array' })
      const sheetName = workbook.SheetNames[0]
      const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(workbook.Sheets[sheetName], { defval: '' })
      const text = rows.map((row) => Object.values(row as Record<string, unknown>).join(' ')).join('\n')
      resolve(extractMetricsFromText(text))
    }
    reader.readAsArrayBuffer(file)
  })
}

async function handlePdfFile(file: File) {
  const arrayBuffer = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
  let text = ''

  for (let index = 1; index <= pdf.numPages; index += 1) {
    const page = await pdf.getPage(index)
    const content = await page.getTextContent()
    text += content.items.map((item: any) => ('str' in item ? item.str : '')).join(' ') + '\n'
  }

  return extractMetricsFromText(text)
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

function FinancialDiagnostic() {
  const [formData, setFormData] = useState<DiagnosticState>(initialState)
  const [status, setStatus] = useState('Envie um PDF, Excel ou preencha os campos para gerar o diagnóstico.')
  const [fileName, setFileName] = useState('Nenhum arquivo selecionado')
  const [leadForm, setLeadForm] = useState<LeadForm>({ name: '', email: '', company: '', goal: '' })
  const [leadSubmitted, setLeadSubmitted] = useState(false)

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<DiagnosticState>
        setFormData({ ...initialState, ...parsed })
        setStatus('Diagnóstico carregado automaticamente a partir do último salvamento.')
        setFileName('Diagnóstico salvo localmente')
      }
    } catch {
      setStatus('Não foi possível restaurar o diagnóstico salvo. Você pode começar do zero.')
    }
  }, [])

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(formData))
    } catch {
      // ignore persistence errors in the browser
    }
  }, [formData])

  const metrics = useMemo(() => {
    const margin = formData.revenue > 0 ? ((formData.revenue - formData.cogs) / formData.revenue) * 100 : 0
    const budgetGap = formData.budget > 0 ? ((formData.actual - formData.budget) / formData.budget) * 100 : 0
    const cashCoverage = formData.payables > 0 ? formData.cash / formData.payables : 0
    const inventoryDays = formData.inventory > 0 && formData.cogs > 0 ? (formData.inventory / (formData.cogs / 30)) : 0
    const receivablesDays = formData.receivables > 0 && formData.revenue > 0 ? (formData.receivables / (formData.revenue / 30)) : 0

    const insights: InsightItem[] = [
      {
        label: 'Margem bruta',
        value: `${margin.toFixed(1)}%`,
        detail: margin < 25 ? 'A margem está abaixo do esperado para um modelo de crescimento saudável.' : 'A margem mostra boa capacidade de absorver custos e proteger resultado.',
        tone: margin < 25 ? 'critical' : 'positive',
      },
      {
        label: 'Desvio do orçamento',
        value: `${budgetGap.toFixed(1)}%`,
        detail: budgetGap < -5 ? 'A execução está abaixo da meta e merece revisão imediata.' : 'A execução está próxima do planejado, com espaço para melhora.',
        tone: budgetGap < -5 ? 'warning' : 'positive',
      },
      {
        label: 'Cobertura de caixa',
        value: `${cashCoverage.toFixed(2)}x`,
        detail: cashCoverage < 1 ? 'O caixa não cobre adequadamente as obrigações de curto prazo.' : 'O fluxo de caixa mostra boa capacidade de sustentar o ciclo operacional.',
        tone: cashCoverage < 1 ? 'critical' : 'positive',
      },
      {
        label: 'Dias de estoque',
        value: `${inventoryDays.toFixed(0)} dias`,
        detail: inventoryDays > 45 ? 'O estoque pode estar travando capital e reduzindo eficiência.' : 'A rotação está razoável para o cenário atual.',
        tone: inventoryDays > 45 ? 'warning' : 'positive',
      },
      {
        label: 'Dias de recebimento',
        value: `${receivablesDays.toFixed(0)} dias`,
        detail: receivablesDays > 45 ? 'O ciclo de recebimento parece alongado e pode prejudicar liquidez.' : 'O ciclo de recebimento está controlado.',
        tone: receivablesDays > 45 ? 'warning' : 'positive',
      },
    ]

    const healthScore = Math.max(0, Math.min(100, 100 - Math.abs(budgetGap) * 2.4 + (margin > 25 ? 8 : 0) - (inventoryDays > 45 ? 5 : 0) - (receivablesDays > 45 ? 5 : 0)))

    return { margin, budgetGap, cashCoverage, inventoryDays, receivablesDays, healthScore, insights }
  }, [formData])

  const setField = (key: keyof DiagnosticState, value: string) => {
    setFormData((current) => ({ ...current, [key]: Number(value || 0) }))
  }

  const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setFileName(file.name)
    const extension = file.name.split('.').pop()?.toLowerCase()

    try {
      let extracted: Partial<DiagnosticState> = {}

      if (extension === 'xlsx' || extension === 'xls' || extension === 'csv') {
        extracted = await handleExcelFile(file)
        setStatus(`Arquivo ${file.name} carregado. Os principais indicadores foram extraídos para a análise.`)
      } else if (extension === 'pdf') {
        extracted = await handlePdfFile(file)
        setStatus(`PDF importado com sucesso. O diagnóstico está sendo montado com base no conteúdo do documento.`)
      } else {
        setStatus('Formato ainda não suportado. Tente PDF, Excel ou CSV.')
        return
      }

      setFormData((current) => ({ ...current, ...extracted, }))
    } catch (error) {
      setStatus('Não foi possível interpretar o arquivo. Você pode preencher os campos manualmente.')
    }
  }

  const loadSample = () => {
    setFormData(sampleState)
    setStatus('Exemplo carregado para mostrar como o painel identifica gargalos financeiros.')
    setFileName('Exemplo de empresa')
  }

  const saveDiagnostic = () => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(formData))
      setStatus('Diagnóstico salvo localmente para você retomar depois.')
    } catch {
      setStatus('Não foi possível salvar localmente neste momento.')
    }
  }

  const copySummary = async () => {
    const summary = [
      `Diagnóstico financeiro — Jorge Telles`,
      `Saúde financeira: ${metrics.healthScore.toFixed(0)}/100`,
      `Margem bruta: ${metrics.margin.toFixed(1)}%`,
      `Cobertura de caixa: ${metrics.cashCoverage.toFixed(2)}x`,
      `Recomendação: ${metrics.insights[0]?.detail ?? 'Acompanhar execução e priorizar ações'}`,
    ].join('\n')

    try {
      await navigator.clipboard.writeText(summary)
      setStatus('Resumo executivo copiado para a área de transferência.')
    } catch {
      setStatus('Não foi possível copiar automaticamente. Você pode reproduzir o resumo manualmente.')
    }
  }

  const handleLeadSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!leadForm.name || !leadForm.email || !leadForm.company) {
      setStatus('Complete nome, e-mail e empresa para registrar a solicitação.')
      return
    }

    const entry: LeadEntry = {
      ...leadForm,
      createdAt: new Date().toISOString(),
      summary: {
        revenue: formatCurrency(formData.revenue),
        margin: `${metrics.margin.toFixed(1)}%`,
        cashCoverage: `${metrics.cashCoverage.toFixed(2)}x`,
      },
    }

    try {
      const existing = window.localStorage.getItem(LEAD_STORAGE_KEY)
      const items = existing ? (JSON.parse(existing) as LeadEntry[]) : []
      items.unshift(entry)
      window.localStorage.setItem(LEAD_STORAGE_KEY, JSON.stringify(items.slice(0, 8)))
      setLeadSubmitted(true)
      setStatus(`Pedido registrado para ${leadForm.name}. O pacote executivo foi preparado para análise.`)
      setLeadForm({ name: '', email: '', company: '', goal: '' })
    } catch {
      setStatus('Não foi possível registrar sua solicitação no momento. Tente novamente em instantes.')
    }
  }

  const exportToPdf = () => {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' })
    const lineHeight = 18
    let y = 40

    doc.setFillColor(8, 21, 39)
    doc.rect(0, 0, 595, 76, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(18)
    doc.text('Relatório executivo de diagnóstico financeiro', 40, 58)
    doc.setFontSize(10)
    doc.text(`Gerado em ${new Date().toLocaleString('pt-BR')}`, 40, 78)

    doc.setTextColor(40, 40, 40)
    y = 112
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(13)
    doc.text('Resumo executivo', 40, y)
    y += lineHeight
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(11)

    const summaryLines = [
      `Saúde financeira: ${metrics.healthScore.toFixed(0)}/100`,
      `Margem bruta: ${metrics.margin.toFixed(1)}%`,
      `Desvio do orçamento: ${metrics.budgetGap.toFixed(1)}%`,
      `Cobertura de caixa: ${metrics.cashCoverage.toFixed(2)}x`,
      `Recomendação: ${metrics.insights[0]?.detail ?? 'Acompanhar execução e priorizar ações'}`,
    ]

    summaryLines.forEach((line) => {
      doc.text(line, 40, y)
      y += lineHeight
    })

    y += 10
    doc.setFont('helvetica', 'bold')
    doc.text('Indicadores principais', 40, y)
    y += lineHeight
    doc.setFont('helvetica', 'normal')

    const rows = [
      ['Receita', formatCurrency(formData.revenue)],
      ['CMV / Custos', formatCurrency(formData.cogs)],
      ['Orçamento', formatCurrency(formData.budget)],
      ['Realizado', formatCurrency(formData.actual)],
      ['Caixa', formatCurrency(formData.cash)],
      ['Estoque', formatCurrency(formData.inventory)],
      ['Contas a receber', formatCurrency(formData.receivables)],
      ['Contas a pagar', formatCurrency(formData.payables)],
    ]

    rows.forEach(([label, value]) => {
      doc.text(`${label}: ${value}`, 40, y)
      y += lineHeight
    })

    y += 8
    doc.setFont('helvetica', 'bold')
    doc.text('Gargalos e ações prioritárias', 40, y)
    y += lineHeight
    doc.setFont('helvetica', 'normal')

    metrics.insights.forEach((item) => {
      const text = `${item.label}: ${item.value} — ${item.detail}`
      const splitLines = doc.splitTextToSize(text, 500)
      doc.text(splitLines, 40, y)
      y += splitLines.length * lineHeight
    })

    doc.save(`diagnostico-financeiro-${new Date().toISOString().slice(0, 10)}.pdf`)
    setStatus('Relatório executivo enriquecido gerado e baixado em PDF.')
  }

  return (
    <motion.section
      id="diagnostico"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7 }}
      className="mb-20 rounded-[32px] border border-white/10 bg-surface2/90 p-8 shadow-glass"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-cyan-300">Diagnóstico financeiro</p>
          <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">Transforme dados em um painel executivo</h2>
          <p className="mt-4 max-w-2xl text-slate-400">
            Você pode inserir os dados manualmente ou importar PDF, Excel ou CSV. O painel identifica gargalos, desvios e pontos de atenção em poucos segundos.
          </p>
        </div>
        <button
          type="button"
          onClick={loadSample}
          className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-200 transition hover:bg-cyan-500/20"
        >
          <Sparkles className="h-4 w-4" /> Ver exemplo
        </button>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[28px] border border-white/10 bg-slate-950/90 p-6 shadow-glass">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-white">Entrada de dados</p>
              <p className="text-sm text-slate-400">Arquivo carregado: {fileName}</p>
            </div>
            <div className="rounded-2xl bg-cyan-500/10 p-2 text-cyan-300">
              <UploadCloud className="h-5 w-5" />
            </div>
          </div>

          <label className="mt-5 flex cursor-pointer flex-col items-center justify-center gap-3 rounded-[24px] border border-dashed border-slate-700 bg-slate-900/80 p-6 text-center text-sm text-slate-300 transition hover:border-cyan-400/40 hover:bg-slate-900">
            <FileSpreadsheet className="h-7 w-7 text-cyan-300" />
            <span>Arraste ou clique para importar um PDF, Excel ou CSV</span>
            <input type="file" accept=".pdf,.xlsx,.xls,.csv" onChange={handleFileUpload} className="hidden" />
          </label>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {[
              { key: 'revenue', label: 'Receita', value: formData.revenue },
              { key: 'cogs', label: 'CMV / Custos', value: formData.cogs },
              { key: 'budget', label: 'Orçamento', value: formData.budget },
              { key: 'actual', label: 'Realizado', value: formData.actual },
              { key: 'cash', label: 'Caixa', value: formData.cash },
              { key: 'inventory', label: 'Estoque', value: formData.inventory },
              { key: 'receivables', label: 'Contas a receber', value: formData.receivables },
              { key: 'payables', label: 'Contas a pagar', value: formData.payables },
            ].map((field) => (
              <label key={field.key} className="space-y-2 text-sm text-slate-300">
                <span>{field.label}</span>
                <input
                  type="number"
                  value={field.value}
                  onChange={(event) => setField(field.key as keyof DiagnosticState, event.target.value)}
                  className="w-full rounded-2xl border border-slate-700/70 bg-slate-900/90 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20"
                />
              </label>
            ))}
          </div>

          <div className="mt-6 rounded-[20px] border border-slate-700/70 bg-slate-900/80 p-4 text-sm text-slate-300">
            <p className="font-medium text-white">Status do processo</p>
            <p className="mt-2 text-slate-400">{status}</p>
          </div>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-slate-950/90 p-6 shadow-glass">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Dashboard de gargalos</p>
              <p className="mt-2 text-2xl font-semibold text-white">Visão executiva pronta para decisão</p>
            </div>
            <div className="rounded-2xl bg-emerald-500/10 p-2 text-emerald-300">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[22px] border border-cyan-400/20 bg-cyan-500/10 p-4">
              <p className="text-sm text-cyan-100">Receita atual</p>
              <p className="mt-2 text-2xl font-semibold text-white">{formatCurrency(formData.revenue)}</p>
            </div>
            <div className="rounded-[22px] border border-amber-400/20 bg-amber-500/10 p-4">
              <p className="text-sm text-amber-100">Desvio de meta</p>
              <p className="mt-2 text-2xl font-semibold text-white">{metrics.budgetGap.toFixed(1)}%</p>
            </div>
            <div className="rounded-[22px] border border-emerald-400/20 bg-emerald-500/10 p-4">
              <p className="text-sm text-emerald-100">Margem bruta</p>
              <p className="mt-2 text-2xl font-semibold text-white">{metrics.margin.toFixed(1)}%</p>
            </div>
            <div className="rounded-[22px] border border-rose-400/20 bg-rose-500/10 p-4">
              <p className="text-sm text-rose-100">Cobertura de caixa</p>
              <p className="mt-2 text-2xl font-semibold text-white">{metrics.cashCoverage.toFixed(2)}x</p>
            </div>
          </div>

          <div className="mt-6 rounded-[24px] border border-slate-700/70 bg-slate-900/80 p-5">
            <div className="flex items-center gap-2 text-amber-300">
              <AlertTriangle className="h-4 w-4" />
              <p className="text-sm font-semibold text-white">Gargalos detectados</p>
            </div>
            <ul className="mt-4 space-y-3 text-sm text-slate-300">
              {metrics.insights.map((item) => (
                <li key={item.label} className="rounded-2xl border border-slate-700/60 bg-slate-950/80 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-medium text-white">{item.label}</span>
                    <span className="text-cyan-300">{item.value}</span>
                  </div>
                  <p className="mt-2 text-slate-400">{item.detail}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 rounded-[24px] border border-slate-700/70 bg-slate-900/80 p-5">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-white">Comparativo de desempenho</p>
              <span className="text-sm text-cyan-300">Saúde {metrics.healthScore.toFixed(0)}/100</span>
            </div>
            <div className="mt-4 space-y-3">
              {[
                { label: 'Receita atual', value: formData.revenue, max: Math.max(formData.revenue, formData.budget, formData.actual, 1), color: 'bg-cyan-400' },
                { label: 'Meta', value: formData.budget, max: Math.max(formData.revenue, formData.budget, formData.actual, 1), color: 'bg-emerald-400' },
                { label: 'Realizado', value: formData.actual, max: Math.max(formData.revenue, formData.budget, formData.actual, 1), color: 'bg-amber-400' },
              ].map((item) => (
                <div key={item.label}>
                  <div className="mb-2 flex items-center justify-between text-sm text-slate-300">
                    <span>{item.label}</span>
                    <span className="text-slate-100">{formatCurrency(item.value)}</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-800">
                    <div className={`h-2 rounded-full ${item.color}`} style={{ width: `${(item.value / item.max) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={saveDiagnostic}
              className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-500/10 px-4 py-3 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-500/20"
            >
              <Save className="h-4 w-4" /> Salvar diagnóstico
            </button>
            <button
              type="button"
              onClick={exportToPdf}
              className="inline-flex items-center gap-2 rounded-full bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
            >
              Baixar relatório PDF
            </button>
            <button
              type="button"
              onClick={copySummary}
              className="inline-flex items-center gap-2 rounded-full border border-slate-700/70 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-slate-400 hover:text-white"
            >
              <Copy className="h-4 w-4" /> Copiar resumo
            </button>
          </div>

          <form onSubmit={handleLeadSubmit} className="mt-6 rounded-[24px] border border-cyan-400/20 bg-cyan-500/10 p-5">
            <div className="flex items-center gap-2 text-cyan-200">
              <Mail className="h-4 w-4" />
              <p className="text-sm font-semibold uppercase tracking-[0.24em]">Fluxo de lead executivo</p>
            </div>
            <p className="mt-3 text-sm text-slate-300">Receba um pacote executivo com a análise, os gargalos e a recomendação de ação em formato de diagnóstico premium.</p>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <input
                type="text"
                placeholder="Seu nome"
                value={leadForm.name}
                onChange={(event) => setLeadForm((current) => ({ ...current, name: event.target.value }))}
                className="w-full rounded-2xl border border-slate-700/60 bg-slate-950/70 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-cyan-400/50"
              />
              <input
                type="email"
                placeholder="E-mail corporativo"
                value={leadForm.email}
                onChange={(event) => setLeadForm((current) => ({ ...current, email: event.target.value }))}
                className="w-full rounded-2xl border border-slate-700/60 bg-slate-950/70 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-cyan-400/50"
              />
              <input
                type="text"
                placeholder="Empresa"
                value={leadForm.company}
                onChange={(event) => setLeadForm((current) => ({ ...current, company: event.target.value }))}
                className="w-full rounded-2xl border border-slate-700/60 bg-slate-950/70 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-cyan-400/50"
              />
              <input
                type="text"
                placeholder="Objetivo da análise"
                value={leadForm.goal}
                onChange={(event) => setLeadForm((current) => ({ ...current, goal: event.target.value }))}
                className="w-full rounded-2xl border border-slate-700/60 bg-slate-950/70 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-cyan-400/50"
              />
            </div>
            <button
              type="submit"
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
            >
              <Send className="h-4 w-4" /> Enviar solicitação
            </button>
            {leadSubmitted ? (
              <p className="mt-3 text-sm text-emerald-300">Solicitação registrada com sucesso. O próximo passo é preparar o pacote executivo para você.</p>
            ) : null}
          </form>

          <p className="mt-3 text-sm text-slate-400">Ideal para empresas, gestores, RH e oportunidades executivas com demanda por clareza e velocidade.</p>
        </div>
      </div>
    </motion.section>
  )
}

export default FinancialDiagnostic

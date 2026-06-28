import { motion } from 'framer-motion'
import { AlertTriangle, ArrowRight, BarChart3, Landmark, ShieldCheck, Sparkles } from 'lucide-react'
import { useMemo, useState } from 'react'

type ScenarioKey = 'base' | 'otimizacao' | 'estresse'
type MetricKey = 'revenue' | 'growth' | 'grossMargin' | 'opex' | 'inventoryDays' | 'receivableDays' | 'payableDays' | 'cash'

type ControlState = Record<MetricKey, number>

type ModuleCard = {
  title: string
  summary: string
  icon: typeof Landmark
  accent: string
}

const initialState: ControlState = {
  revenue: 12_800_000,
  growth: 8,
  grossMargin: 38,
  opex: 24,
  inventoryDays: 42,
  receivableDays: 34,
  payableDays: 40,
  cash: 3_500_000,
}

const scenarioPresets: Record<ScenarioKey, ControlState> = {
  base: { ...initialState },
  otimizacao: {
    revenue: 14_200_000,
    growth: 12,
    grossMargin: 43,
    opex: 20,
    inventoryDays: 31,
    receivableDays: 28,
    payableDays: 45,
    cash: 4_800_000,
  },
  estresse: {
    revenue: 10_600_000,
    growth: 2,
    grossMargin: 29,
    opex: 31,
    inventoryDays: 57,
    receivableDays: 48,
    payableDays: 34,
    cash: 1_800_000,
  },
}

const moduleCards: ModuleCard[] = [
  {
    title: 'Fechamento executivo',
    summary: 'Consolidação de DRE, balanço e apuração com rastreio de exceções.',
    icon: Landmark,
    accent: 'from-[#2997ff] to-[#0071e3]',
  },
  {
    title: 'Fluxo de caixa',
    summary: 'Visão clara de liquidez, ciclo operacional e necessidade de capital de giro.',
    icon: BarChart3,
    accent: 'from-[#34c759] to-[#30d158]',
  },
  {
    title: 'Governança e risco',
    summary: 'Indicadores, alertas e ações corretivas para apoiar a diretoria.',
    icon: ShieldCheck,
    accent: 'from-[#ff9f0a] to-[#ffb84d]',
  },
]

function ControladoriaSystem() {
  const [scenario, setScenario] = useState<ScenarioKey>('base')
  const [state, setState] = useState<ControlState>(initialState)

  const metrics = useMemo(() => {
    const projectedRevenue = state.revenue * (1 + state.growth / 100)
    const grossProfit = projectedRevenue * (state.grossMargin / 100)
    const opexCost = projectedRevenue * (state.opex / 100)
    const operatingResult = grossProfit - opexCost
    const cashCoverage = state.cash / Math.max(1, state.payableDays * 120_000)
    const riskScore = Math.min(100, Math.round((state.inventoryDays / 60) * 30 + (state.receivableDays / 60) * 25 + (state.opex / 40) * 25 + (state.grossMargin < 35 ? 20 : 0)))

    return {
      projectedRevenue,
      grossProfit,
      opexCost,
      operatingResult,
      cashCoverage,
      riskScore,
    }
  }, [state])

  const alerts = useMemo(() => {
    const list = [] as Array<{ title: string; detail: string; tone: 'critical' | 'warning' | 'positive' }>

    if (state.grossMargin < 35) {
      list.push({ title: 'Margem pressionada', detail: 'A margem bruta está abaixo do patamar que sustenta crescimento com disciplina.', tone: 'critical' })
    }

    if (metrics.cashCoverage < 1.1) {
      list.push({ title: 'Cobertura de caixa fraca', detail: 'O capital de giro não está suficiente para sustentar o ciclo operacional atual.', tone: 'critical' })
    }

    if (state.inventoryDays > 45) {
      list.push({ title: 'Estoque travado', detail: 'O nível de estoque pode estar consumindo capital e reduzindo eficiência.', tone: 'warning' })
    }

    if (state.receivableDays > 40) {
      list.push({ title: 'Recebimentos lentos', detail: 'O ciclo de recebimento está alongado e pode afetar liquidez.', tone: 'warning' })
    }

    if (state.opex > 25) {
      list.push({ title: 'Estrutura operacional cara', detail: 'Os custos operacionais precisam de revisão para proteger a margem.', tone: 'warning' })
    }

    if (list.length === 0) {
      list.push({ title: 'Operação saudável', detail: 'O cenário atual mostra disciplina financeira e boa capacidade de resposta.', tone: 'positive' })
    }

    return list
  }, [metrics.cashCoverage, state.grossMargin, state.inventoryDays, state.opex, state.receivableDays])

  const recommendation = useMemo(() => {
    if (metrics.riskScore > 72) {
      return 'Prioridade máxima: controlar caixa, revisar estoque e acelerar recebimentos.'
    }

    if (metrics.riskScore > 45) {
      return 'Prioridade média: corrigir estrutura de custos e proteger a margem.'
    }

    return 'Prioridade estratégica: manter disciplina, expandir previsibilidade e preservar capital.'
  }, [metrics.riskScore])

  const updateScenario = (value: ScenarioKey) => {
    setScenario(value)
    setState(scenarioPresets[value])
  }

  const updateMetric = (key: MetricKey, value: number) => {
    setState((current) => ({ ...current, [key]: value }))
  }

  const inputFields: Array<{ key: MetricKey; label: string; min: number; max: number; step: number; suffix: string; formatter?: (value: number) => string }> = [
    { key: 'revenue', label: 'Receita anual', min: 5_000_000, max: 25_000_000, step: 100_000, suffix: 'R$', formatter: (value) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }) },
    { key: 'growth', label: 'Crescimento projetado', min: -10, max: 20, step: 1, suffix: '%' },
    { key: 'grossMargin', label: 'Margem bruta', min: 20, max: 60, step: 1, suffix: '%' },
    { key: 'opex', label: 'Opex', min: 10, max: 40, step: 1, suffix: '%' },
    { key: 'inventoryDays', label: 'Dias de estoque', min: 10, max: 90, step: 1, suffix: ' dias' },
    { key: 'receivableDays', label: 'Dias de recebimento', min: 10, max: 90, step: 1, suffix: ' dias' },
    { key: 'payableDays', label: 'Dias de pagamento', min: 10, max: 90, step: 1, suffix: ' dias' },
    { key: 'cash', label: 'Caixa disponível', min: 500_000, max: 10_000_000, step: 100_000, suffix: 'R$', formatter: (value) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }) },
  ]

  return (
    <motion.section
      id="controladoria"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7 }}
      className="mb-20 rounded-[40px] border border-black/5 bg-[#f5f5f7] p-8 shadow-[0_30px_90px_rgba(0,0,0,0.12)]"
    >
      <div className="grid gap-8 xl:grid-cols-[1.02fr_0.98fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#0071e3]">Sistema integrado de controladoria</p>
          <h2 className="mt-3 text-4xl font-semibold tracking-[-0.03em] text-[#1d1d1f] sm:text-5xl">
            Uma simulação real de controladoria, pensada para decisão executiva.
          </h2>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-[#6e6e73]">
            Este é o tipo de ambiente em que eu atuo: estrutura financeira, gestão de liquidez, planejamento, risco, controle e visão integrada para a diretoria.
          </p>

          <div className="mt-8 flex flex-wrap gap-2">
            {([
              { key: 'base', label: 'Base' },
              { key: 'otimizacao', label: 'Otimização' },
              { key: 'estresse', label: 'Estresse' },
            ] as Array<{ key: ScenarioKey; label: string }>).map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => updateScenario(item.key)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${scenario === item.key ? 'bg-[#1d1d1f] text-white' : 'bg-white text-[#424245] ring-1 ring-black/10 hover:bg-[#f2f2f2]'}`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-[24px] border border-black/5 bg-white p-5 shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
              <p className="text-sm text-[#6e6e73]">Receita projetada</p>
              <p className="mt-3 text-3xl font-semibold text-[#1d1d1f]">{metrics.projectedRevenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })}</p>
            </div>
            <div className="rounded-[24px] border border-black/5 bg-white p-5 shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
              <p className="text-sm text-[#6e6e73]">Resultado operacional</p>
              <p className="mt-3 text-3xl font-semibold text-[#1d1d1f]">{metrics.operatingResult.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })}</p>
            </div>
            <div className="rounded-[24px] border border-black/5 bg-white p-5 shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
              <p className="text-sm text-[#6e6e73]">Cobertura de caixa</p>
              <p className="mt-3 text-3xl font-semibold text-[#1d1d1f]">{metrics.cashCoverage.toFixed(2)}x</p>
            </div>
            <div className="rounded-[24px] border border-black/5 bg-white p-5 shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
              <p className="text-sm text-[#6e6e73]">Índice de risco</p>
              <p className="mt-3 text-3xl font-semibold text-[#1d1d1f]">{metrics.riskScore}</p>
            </div>
          </div>

          <div className="mt-8 rounded-[28px] border border-black/5 bg-white p-6 shadow-[0_16px_50px_rgba(0,0,0,0.06)]">
            <div className="flex items-center gap-2 text-[#ff3b30]">
              <AlertTriangle className="h-5 w-5" />
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#1d1d1f]">Alertas automáticos</p>
            </div>
            <div className="mt-5 space-y-3">
              {alerts.map((alert) => (
                <div key={alert.title} className="rounded-[20px] border border-black/5 bg-[#fafafa] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-[#1d1d1f]">{alert.title}</p>
                      <p className="mt-1 text-sm text-[#6e6e73]">{alert.detail}</p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${alert.tone === 'critical' ? 'bg-[#ff3b30]/10 text-[#ff3b30]' : alert.tone === 'warning' ? 'bg-[#ff9f0a]/10 text-[#ff9f0a]' : 'bg-[#34c759]/10 text-[#34c759]'}`}>
                      {alert.tone === 'critical' ? 'Crítico' : alert.tone === 'warning' ? 'Atenção' : 'Saudável'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-[32px] border border-black/5 bg-[#0f0f12] p-6 text-white shadow-[0_24px_70px_rgba(0,0,0,0.2)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#8e8e93]">Painel executivo</p>
              <h3 className="mt-2 text-2xl font-semibold">Matriz de decisão</h3>
            </div>
            <div className="rounded-full border border-white/10 bg-white/10 px-3 py-2 text-sm text-[#f5f5f7]">Live</div>
          </div>

          <div className="mt-6 space-y-4">
            {inputFields.map((field) => (
              <label key={field.key} className="block rounded-[20px] border border-white/10 bg-white/5 p-4">
                <div className="mb-3 flex items-center justify-between gap-3 text-sm text-[#d1d1d6]">
                  <span>{field.label}</span>
                  <span className="text-[#f5f5f7]">{field.formatter ? field.formatter(state[field.key]) : `${state[field.key]}${field.suffix}`}</span>
                </div>
                <input
                  type="range"
                  min={field.min}
                  max={field.max}
                  step={field.step}
                  value={state[field.key]}
                  onChange={(event) => updateMetric(field.key, Number(event.target.value))}
                  className="h-2 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-[#2997ff]"
                />
              </label>
            ))}
          </div>

          <div className="mt-6 rounded-[24px] border border-white/10 bg-white/5 p-5">
            <div className="flex items-center gap-2 text-[#2997ff]">
              <Sparkles className="h-5 w-5" />
              <p className="text-sm font-semibold uppercase tracking-[0.24em]">Recomendação prioritária</p>
            </div>
            <p className="mt-3 text-sm leading-7 text-[#d1d1d6]">{recommendation}</p>
          </div>

          <div className="mt-6 h-28 rounded-[24px] border border-white/10 bg-white/5 p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-[#d1d1d6]">Pressão do cenário</p>
              <p className="text-sm text-[#2997ff]">{metrics.riskScore}/100</p>
            </div>
            <div className="mt-4 flex h-12 items-end gap-2">
              {Array.from({ length: 8 }).map((_, index) => {
                const height = 30 + ((index + metrics.riskScore / 14) % 7) * 8
                return <div key={index} className="flex-1 rounded-t-full bg-gradient-to-t from-[#2997ff] via-[#34c759] to-[#f5f5f7]" style={{ height: `${height}%` }} />
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        {moduleCards.map((module) => {
          const Icon = module.icon
          return (
            <div key={module.title} className="rounded-[24px] border border-black/5 bg-white p-5 shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
              <div className={`inline-flex rounded-2xl bg-gradient-to-br ${module.accent} p-3 text-white`}>
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-xl font-semibold text-[#1d1d1f]">{module.title}</h3>
              <p className="mt-2 text-sm leading-7 text-[#6e6e73]">{module.summary}</p>
              <div className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-[#0071e3]">
                Ver mais <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          )
        })}
      </div>
    </motion.section>
  )
}

export default ControladoriaSystem

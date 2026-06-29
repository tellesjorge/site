import { lazy, Suspense } from 'react'
import PageTransition from '../components/layout/PageTransition'
import LiveContextWidget from '../components/widgets/LiveContextWidget'
import { Sparkles } from 'lucide-react'
import { useSEO } from '../hooks/useSEO'
import { useLanguage } from '../context/LanguageContext'

// Lazy-load the heavy ERP workspace modules to optimize portfolio bundle performance (Tarefa 13)
const ERPWorkspace = lazy(() => import('../modules/erp/components/ERPWorkspace'))

export default function AIDashboardsPage() {
  const { t } = useLanguage()

  useSEO({
    title: t({ pt: 'Simulador FP&A & Dashboards IA', en: 'FP&A Simulator & AI Dashboards' }),
    description: t({
      pt: 'Experimente a modelagem financeira em tempo real: simulador reativo de receita, custos CMV, despesas OPEX, prazos de pagamento e ciclo de caixa.',
      en: 'Experience real-time financial modeling: reactive simulator of revenues, COGS (CMV) costs, OPEX expenses, payment terms, and cash cycles.'
    })
  })

  return (
    <PageTransition>
      <section className="mx-auto max-w-7xl px-6 pb-24 pt-12 sm:px-8 lg:px-10 space-y-12 bg-white">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[#0071e3]/10 px-3 py-1 text-xs font-semibold text-[#0071e3]">
              <Sparkles className="h-3.5 w-3.5" /> {t({ pt: 'Plataforma Integrada', en: 'Integrated Cockpit' })}
            </div>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-[#0f172a] sm:text-5xl">
              {t({ pt: 'Plataforma Executiva de Controladoria', en: 'Executive Controllership Platform' })}
            </h1>
            <p className="mt-4 max-w-3xl text-sm font-medium leading-relaxed text-slate-600 sm:text-base">
              {t({
                pt: 'Simulador Interativo de Planejamento FP&A, Ciclo de Caixa e Necessidade de Capital de Giro (NCG). Ajuste os controles operacionais para recalibrar o DRE e obter análises automatizadas do Controller Virtual.',
                en: 'Interactive FP&A planning simulator, cash cycles, and working capital needs (WCN/NCG). Adjust operational sliders to recalibrate income statements and receive virtual controller reviews.'
              })}
            </p>
          </div>
        </div>

        <LiveContextWidget />

        <div className="rounded-[24px] border border-blue-400/20 bg-blue-50/10 p-5 text-xs text-slate-600 leading-relaxed max-w-5xl shadow-sm">
          {t({
            pt: '💡 **Nota de Planejamento**: Este simulador de cenários demonstra a modelagem financeira estratégica executada por um Controller. O motor de cálculo recalibra indicadores de rentabilidade e capital de giro, ideal para apresentações e diagnósticos executivos de diretoria.',
            en: '💡 **Planning Note**: This simulation environment demonstrates strategic financial modeling executed by a senior Controller. The calculation engine recalibrates indicators of profitability and working capital, ideal for board presentations and diagnosis.'
          })}
        </div>

        {/* Lazy boundary for heavy ERP features */}
        <Suspense fallback={
          <div className="h-80 flex flex-col items-center justify-center text-xs text-slate-400 gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-blue-500" />
            {t({ pt: 'Carregando Workspace Executivo...', en: 'Loading Executive Workspace...' })}
          </div>
        }>
          <ERPWorkspace />
        </Suspense>
      </section>
    </PageTransition>
  )
}

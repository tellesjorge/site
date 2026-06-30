import { lazy, Suspense, useState } from 'react'
import PageTransition from '../components/layout/PageTransition'
import LiveContextWidget from '../components/widgets/LiveContextWidget'
import { Sparkles, Settings2, Database } from 'lucide-react'
import { useSEO } from '../hooks/useSEO'
import { useLanguage } from '../context/LanguageContext'

// Lazy-load the heavy ERP workspace modules to optimize portfolio bundle performance (Tarefa 13)
const ERPWorkspace = lazy(() => import('../modules/erp/components/ERPWorkspace'))
const ERPPortal = lazy(() => import('../modules/erp/components/ERPPortal'))

export default function AIDashboardsPage() {
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState<'simulator' | 'portal'>('simulator')

  useSEO({
    title: t({ pt: 'Plataforma FP&A & Portal ERP', en: 'FP&A Platform & ERP Portal' }),
    description: t({
      pt: 'Experimente a modelagem financeira em tempo real e simule o portal ERP com importação de XML de Notas Fiscais e dashboards analíticos.',
      en: 'Experience real-time financial modeling and simulate the ERP portal with XML invoice uploads and analytical dashboards.'
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
                pt: 'Ambiente completo de simulação financeira e demonstração de ERP. Alterne entre o simulador de cenários macro ou a demonstração de processamento de notas e conexões analíticas.',
                en: 'Comprehensive financial simulation and ERP environment. Switch between macro scenario modeling or mock database processing and analytical pipelines.'
              })}
            </p>
          </div>
        </div>

        <LiveContextWidget />

        {/* Tab Selection Capsule */}
        <div className="flex border-b border-slate-100 max-w-xl">
          <button
            type="button"
            onClick={() => setActiveTab('simulator')}
            className={`flex items-center gap-2 px-6 py-3.5 text-xs font-bold uppercase tracking-wider border-b-2 transition ${activeTab === 'simulator' ? 'border-[#0071e3] text-[#0071e3]' : 'border-transparent text-slate-400 hover:text-slate-700'}`}
          >
            <Settings2 className="h-4 w-4" />
            {t({ pt: 'Simulador FP&A (Variáveis)', en: 'FP&A Simulator (Variables)' })}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('portal')}
            className={`flex items-center gap-2 px-6 py-3.5 text-xs font-bold uppercase tracking-wider border-b-2 transition ${activeTab === 'portal' ? 'border-[#0071e3] text-[#0071e3]' : 'border-transparent text-slate-400 hover:text-slate-700'}`}
          >
            <Database className="h-4 w-4" />
            {t({ pt: 'Portal ERP (XML & DB)', en: 'ERP Portal (XML & DB)' })}
          </button>
        </div>

        <div className="rounded-[24px] border border-blue-400/20 bg-blue-50/10 p-5 text-xs text-slate-600 leading-relaxed max-w-5xl shadow-sm">
          {t({
            pt: '💡 **Nota de Planejamento**: Este demonstrador de cockpit operacional reúne cenários FP&A e recursos de ERP para simular de forma transparente o fluxo de dados em controladoria avançada.',
            en: '💡 **Planning Note**: This operational cockpit demonstrator integrates FP&A scenarios and mock ERP tools to visually represent modern advanced controllership pipelines.'
          })}
        </div>

        {/* Lazy boundary for heavy ERP features */}
        <Suspense fallback={
          <div className="h-80 flex flex-col items-center justify-center text-xs text-slate-400 gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-blue-500" />
            {t({ pt: 'Carregando Workspace Executivo...', en: 'Loading Executive Workspace...' })}
          </div>
        }>
          {activeTab === 'simulator' ? <ERPWorkspace /> : <ERPPortal />}
        </Suspense>
      </section>
    </PageTransition>
  )
}

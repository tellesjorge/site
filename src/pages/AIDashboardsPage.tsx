import PageTransition from '../components/layout/PageTransition'
import DashboardPreview from '../components/DashboardPreview'
import FinancialDiagnostic from '../components/FinancialDiagnostic'
import ControladoriaSystem from '../components/ControladoriaSystem'
import AIFinanceSection from '../components/AIFinanceSection'
import LiveContextWidget from '../components/widgets/LiveContextWidget'
import { Sparkles } from 'lucide-react'

export default function AIDashboardsPage() {
  return (
    <PageTransition>
      <section className="mx-auto max-w-7xl px-6 pb-24 pt-12 sm:px-8 lg:px-10 space-y-12">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-600">
              <Sparkles className="h-3.5 w-3.5" /> Futuro da Decisão Financeira
            </div>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-[#1d1d1f] sm:text-5xl">
              Plataforma de IA & Dashboards de Controladoria
            </h1>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-[#6e6e73]">
              Simule cenários, gere diagnósticos financeiros a partir de planilhas/PDFs e visualize recomendações guiadas por inteligência de dados em tempo real.
            </p>
          </div>
        </div>

        <LiveContextWidget />

        {/* Dynamic Warning/Info banner explaining mock status */}
        <div className="rounded-[24px] border border-cyan-400/20 bg-cyan-500/5 p-5 text-sm text-cyan-800 leading-relaxed max-w-5xl">
          💡 **Nota de Arquitetura**: Esta versão interativa roda localmente no navegador utilizando dados simulados e persistência via `localStorage`. A infraestrutura está totalmente preparada para integração direta via API com modelos reais de LLM, bancos de dados SQL e relatórios ativos do Power BI.
        </div>

        {/* 1. Real-time Dashboard Preview */}
        <DashboardPreview />

        {/* 2. Upload / Manual Financial Diagnostic Tool */}
        <FinancialDiagnostic />

        {/* 3. Controladoria Simulation Framework */}
        <ControladoriaSystem />

        {/* 4. Complete AI Finance Suite (Insights, Recommendations, Forecast, etc) */}
        <AIFinanceSection />
      </section>
    </PageTransition>
  )
}

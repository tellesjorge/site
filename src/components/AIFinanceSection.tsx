import AIDashboard from './AIDashboard'
import AIInsights from './AIInsights'
import AIRecommendations from './AIRecommendations'
import BudgetVsActual from './BudgetVsActual'
import SmartForecast from './SmartForecast'
import AutomationDataAI from './AutomationDataAI'

function AIFinanceSection() {
  return (
    <section id="ia" className="mb-16 rounded-[32px] border border-white/10 bg-surface2/90 p-8 shadow-glass">
      <div className="mb-12 flex flex-col gap-4">
        <p className="text-sm uppercase tracking-[0.28em] text-cyan-300">Inteligência Artificial aplicada à Controladoria</p>
        <h2 className="text-3xl font-semibold text-white sm:text-4xl">Uso dados, automação e análise inteligente para decisões financeiras estratégicas</h2>
        <p className="max-w-3xl text-slate-400">
          A combinação entre Controladoria, FP&A, Power BI, Python, SQL e Inteligência Artificial permite identificar desvios, antecipar riscos, analisar margens, projetar cenários e apoiar a diretoria com informações de maior valor para a tomada de decisão.
        </p>
      </div>
      <div className="space-y-10">
        <div>
          <div className="mb-6 flex items-center justify-between gap-4 rounded-[28px] border border-white/10 bg-slate-950/90 p-5">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-slate-400">AI Executive Dashboard</p>
              <p className="mt-2 text-xl font-semibold text-white">Painel inteligente de métricas financeiras</p>
            </div>
            <div className="rounded-3xl bg-cyan-500/10 px-4 py-2 text-sm text-cyan-200">Tecnologia de insights preditivos</div>
          </div>
          <AIDashboard />
        </div>
        <div>
          <div className="mb-6 flex items-center justify-between gap-4 rounded-[28px] border border-white/10 bg-slate-950/90 p-5">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-slate-400">AI Insights Engine</p>
              <p className="mt-2 text-xl font-semibold text-white">Recomendações automáticas para a diretoria</p>
            </div>
            <div className="rounded-3xl bg-emerald-500/10 px-4 py-2 text-sm text-emerald-200">Análise em tempo real</div>
          </div>
          <AIInsights />
        </div>
        <AIRecommendations />
        <BudgetVsActual />
        <SmartForecast />
        <AutomationDataAI />
      </div>
    </section>
  )
}

export default AIFinanceSection

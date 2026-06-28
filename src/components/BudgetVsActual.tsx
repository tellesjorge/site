import { motion } from 'framer-motion'
import { budgetVsActual } from '../data/budgetVsActual'

const statusClasses: Record<string, string> = {
  positivo: 'border-emerald-400/20 text-emerald-200',
  atencao: 'border-amber-400/20 text-amber-200',
  critico: 'border-rose-400/20 text-rose-200',
}

function BudgetVsActual() {
  return (
    <section className="grid gap-6">
      <div className="rounded-[28px] border border-white/10 bg-surface2/90 p-6 shadow-glass">
        <p className="text-sm uppercase tracking-[0.28em] text-cyan-300">Orçado x Realizado</p>
        <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">Simulação comparativa com IA</h2>
        <p className="mt-4 max-w-3xl text-slate-400">
          Visualização profissional de orçado, realizado, variação e análise automática do painel financeiro.
        </p>
      </div>
      <div className="grid gap-5 xl:grid-cols-2">
        {budgetVsActual.items.map((item) => (
          <motion.article
            key={item.label}
            whileHover={{ y: -6 }}
            className="rounded-[28px] border border-white/10 bg-slate-950/90 p-6 shadow-glass transition"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-slate-400">{item.label}</p>
                <h3 className="mt-3 text-2xl font-semibold text-white">{item.actual}</h3>
              </div>
              <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusClasses[item.status]}`}>
                {item.status === 'positivo' ? 'Positivo' : 'Atenção'}
              </span>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-3xl bg-surface2/95 p-4">
                <p className="text-sm text-slate-400">Orçado</p>
                <p className="mt-2 text-lg font-semibold text-white">{item.budget}</p>
              </div>
              <div className="rounded-3xl bg-surface2/95 p-4">
                <p className="text-sm text-slate-400">Variação</p>
                <p className="mt-2 text-lg font-semibold text-white">{item.variance}</p>
              </div>
            </div>
            <p className="mt-5 text-sm leading-6 text-slate-400">{item.analysis}</p>
          </motion.article>
        ))}
      </div>
    </section>
  )
}

export default BudgetVsActual

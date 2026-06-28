import { motion } from 'framer-motion'
import { profile } from '../data/profile'
import { aiRecommendations } from '../data/aiRecommendations'

const priorityStyles: Record<string, string> = {
  Alta: 'bg-rose-500/15 text-rose-200 ring-rose-400/20',
  Média: 'bg-amber-500/15 text-amber-200 ring-amber-400/20',
  Baixa: 'bg-slate-700/70 text-slate-100 ring-slate-500/20',
}

function AIRecommendations() {
  return (
    <section className="grid gap-6">
      <div className="rounded-[28px] border border-white/10 bg-surface2/90 p-6 shadow-glass">
        <p className="text-sm uppercase tracking-[0.28em] text-cyan-300">Recomendações de IA</p>
        <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">Painel executivo de ações recomendadas</h2>
        <p className="mt-4 max-w-3xl text-slate-400">
          Recomendações voltadas a redução de custos, margem, estoque, capital de giro, forecast e governança financeira.
        </p>
      </div>
      <div className="grid gap-5 xl:grid-cols-2">
        {aiRecommendations.recommendations.map((item) => (
          <motion.article
            key={item.title}
            whileHover={{ y: -6 }}
            className="rounded-[28px] border border-white/10 bg-slate-950/90 p-6 shadow-glass transition"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-400">{item.diagnosis}</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${priorityStyles[item.priority]}`}>
                Prioridade {item.priority}
              </span>
            </div>
            <div className="mt-5 space-y-4 text-slate-300">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Impacto esperado</p>
                <p className="mt-2 text-sm">{item.impact}</p>
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Ação recomendada</p>
                <p className="mt-2 text-sm">{item.action}</p>
              </div>
              <div className="rounded-3xl bg-slate-900/80 px-4 py-3 text-sm text-slate-200">
                Área envolvida: {item.area}
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  )
}

export default AIRecommendations

import { motion } from 'framer-motion'
import * as Icons from 'lucide-react'
import { aiDashboard } from '../data/aiDashboard'

const statusStyles: Record<string, string> = {
  positivo: 'bg-emerald-500/10 text-emerald-200 ring-emerald-400/20',
  atencao: 'bg-amber-500/10 text-amber-200 ring-amber-400/20',
  critico: 'bg-rose-500/10 text-rose-200 ring-rose-400/20',
}

function AIDashboard() {
  return (
    <section className="grid gap-5 xl:grid-cols-3">
      {aiDashboard.cards.map((card) => {
        const Icon = (Icons as Record<string, any>)[card.icon] ?? Icons.BarChart3
        return (
          <motion.article
            key={card.title}
            whileHover={{ y: -6 }}
            className="rounded-[28px] border border-white/10 bg-surface2/90 p-6 shadow-glass transition"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-cyan-500/10 text-cyan-300">
                <Icon className="h-6 w-6" />
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${statusStyles[card.status]}`}>
                {card.status === 'positivo' ? 'Positivo' : card.status === 'atencao' ? 'Atenção' : 'Crítico'}
              </span>
            </div>
            <h3 className="mt-6 text-lg font-semibold text-white">{card.title}</h3>
            <div className="mt-3 flex items-end justify-between gap-3">
              <p className="text-3xl font-semibold text-white">{card.value}</p>
              <span className="text-sm text-slate-300">{card.trend}</span>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-400">{card.explanation}</p>
          </motion.article>
        )
      })}
    </section>
  )
}

export default AIDashboard

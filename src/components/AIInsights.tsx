import { motion } from 'framer-motion'
import { Activity, AlertTriangle, Lightbulb, PieChart, ShieldCheck } from 'lucide-react'
import { aiInsights } from '../data/aiInsights'

const iconMap: Record<string, typeof Lightbulb> = {
  oportunidade: Lightbulb,
  risco: ShieldCheck,
  alerta: AlertTriangle,
  estrategia: PieChart,
  eficiencia: Activity,
}

const statusMap: Record<string, string> = {
  oportunidade: 'bg-cyan-500/10 text-cyan-200',
  risco: 'bg-rose-500/10 text-rose-200',
  alerta: 'bg-amber-500/10 text-amber-200',
  estrategia: 'bg-sky-500/10 text-sky-200',
  eficiencia: 'bg-emerald-500/10 text-emerald-200',
}

function AIInsights() {
  return (
    <section className="grid gap-5 xl:grid-cols-2">
      {aiInsights.insights.map((item) => {
        const Icon = iconMap[item.type] ?? Lightbulb
        return (
          <motion.article
            key={item.title}
            whileHover={{ y: -6 }}
            className="rounded-[28px] border border-white/10 bg-surface2/90 p-6 shadow-glass transition"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className={`inline-flex h-11 w-11 items-center justify-center rounded-3xl ${statusMap[item.type]}`}>
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm uppercase tracking-[0.28em] text-slate-400">{item.category}</p>
                  <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                </div>
              </div>
            </div>
            <p className="mt-4 text-slate-400">{item.description}</p>
          </motion.article>
        )
      })}
    </section>
  )
}

export default AIInsights

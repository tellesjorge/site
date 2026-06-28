import { motion } from 'framer-motion'
import * as Icons from 'lucide-react'
import { automationDataAI } from '../data/automationDataAI'

function AutomationDataAI() {
  return (
    <section className="grid gap-6">
      <div className="rounded-[28px] border border-white/10 bg-surface2/90 p-6 shadow-glass">
        <p className="text-sm uppercase tracking-[0.28em] text-cyan-300">Automação, Dados e IA para Finanças</p>
        <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">Tecnologia a serviço da controladoria</h2>
        <p className="mt-4 max-w-3xl text-slate-400">
          Capacidade de unir finanças e tecnologia para gerar mais velocidade, confiança e visão estratégica.
        </p>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {automationDataAI.cards.map((item) => {
          const Icon = (Icons as any)[item.icon] ?? Icons.Cpu
          return (
            <motion.article
              key={item.title}
              whileHover={{ y: -6 }}
              className="rounded-[28px] border border-white/10 bg-slate-950/90 p-6 shadow-glass transition"
            >
              <div className="flex items-center gap-4">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-cyan-500/10 text-cyan-300">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="text-lg font-semibold text-white">{item.title}</h3>
              </div>
              <p className="mt-4 text-slate-400">{item.description}</p>
            </motion.article>
          )
        })}
      </div>
    </section>
  )
}

export default AutomationDataAI

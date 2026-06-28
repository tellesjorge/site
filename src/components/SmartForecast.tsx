import { motion } from 'framer-motion'
import { forecastData } from '../data/forecast'

function SmartForecast() {
  return (
    <section className="grid gap-6">
      <div className="rounded-[28px] border border-white/10 bg-surface2/90 p-6 shadow-glass">
        <p className="text-sm uppercase tracking-[0.28em] text-cyan-300">Forecast inteligente</p>
        <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">Projeção executiva baseada em dados</h2>
        <p className="mt-4 max-w-3xl text-slate-400">
          Simulação de forecast com interpretação automática da IA para autoridade em decisões de médio prazo.
        </p>
      </div>
      <div className="grid gap-5 xl:grid-cols-2">
        {forecastData.forecast.map((item) => (
          <motion.article
            key={item.label}
            whileHover={{ y: -6 }}
            className="rounded-[28px] border border-white/10 bg-slate-950/90 p-6 shadow-glass transition"
          >
            <p className="text-sm uppercase tracking-[0.28em] text-slate-400">{item.label}</p>
            <div className="mt-4 flex items-center justify-between gap-4">
              <p className="text-3xl font-semibold text-white">{item.value}</p>
              <span className="text-sm text-slate-300">{item.trend}</span>
            </div>
            <p className="mt-5 text-slate-400">{item.analysis}</p>
          </motion.article>
        ))}
      </div>
    </section>
  )
}

export default SmartForecast

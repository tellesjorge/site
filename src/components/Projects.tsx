import { motion } from 'framer-motion'
import { profile } from '../data/profile'

function Projects() {
  return (
    <motion.section
      id="projetos"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7 }}
      className="mb-16"
    >
      <div className="mb-10 flex flex-col gap-4">
        <p className="text-sm uppercase tracking-[0.28em] text-[#0071e3]">Resultados e projetos</p>
        <h2 className="text-3xl font-semibold text-[#1d1d1f] sm:text-4xl">Impacto mensurável e cases de resultado</h2>
        <p className="max-w-2xl text-[#6e6e73]">
          Projetos e resultados que refletem excelência em controle, análise financeira e governança corporativa.
        </p>
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        {profile.projects.map((item) => (
          <motion.div
            key={item.title}
            whileHover={{ y: -6 }}
            className="rounded-[28px] border border-black/5 bg-white/90 p-6 shadow-[0_14px_45px_rgba(15,23,42,0.05)] transition"
          >
            <h3 className="text-xl font-semibold text-[#1d1d1f]">{item.title}</h3>
            <p className="mt-3 text-[#6e6e73]">{item.description}</p>
          </motion.div>
        ))}
      </div>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {profile.metrics.map((metric) => (
          <div key={metric.label} className="rounded-[24px] border border-black/5 bg-white/90 p-6 shadow-[0_14px_45px_rgba(15,23,42,0.05)]">
            <p className="text-sm uppercase tracking-[0.28em] text-[#6e6e73]">{metric.label}</p>
            <p className="mt-4 text-3xl font-semibold text-[#1d1d1f]">{metric.value}</p>
          </div>
        ))}
      </div>
    </motion.section>
  )
}

export default Projects

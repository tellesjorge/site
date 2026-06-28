import { motion } from 'framer-motion'
import { profile } from '../data/profile'

function TechStack() {
  return (
    <motion.section
      id="tecnologias"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7 }}
      className="mb-16"
    >
      <div className="mb-10 flex flex-col gap-4">
        <p className="text-sm uppercase tracking-[0.28em] text-cyan-300">Sistemas e tecnologias</p>
        <h2 className="text-3xl font-semibold text-white sm:text-4xl">Ferramentas da rotina financeira</h2>
        <p className="max-w-2xl text-slate-400">
          Ecossistema de sistemas ERP, BI e desenvolvimento usados em controles, análises e automações.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {profile.technologies.map((tech) => (
          <motion.div
            key={tech}
            whileHover={{ y: -4 }}
            className="rounded-[28px] border border-white/10 bg-surface2/90 p-5 text-center shadow-glass transition"
          >
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-3xl bg-cyan-500/10 text-cyan-300">
              <span className="text-lg font-semibold">{tech[0]}</span>
            </div>
            <p className="text-sm font-semibold text-white">{tech}</p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  )
}

export default TechStack

import { motion } from 'framer-motion'
import { profile } from '../data/profile'
import { useLanguage } from '../context/LanguageContext'

function Projects() {
  const { t } = useLanguage()

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
        <p className="text-sm uppercase tracking-[0.28em] text-[#0071e3]">
          {t({ pt: 'Resultados e projetos', en: 'Deliveries & Projects' })}
        </p>
        <h2 className="text-3xl font-semibold text-[#1d1d1f] sm:text-4xl">
          {t({ pt: 'Impacto mensurável e cases de resultado', en: 'Measurable Impact & Case Studies' })}
        </h2>
        <p className="max-w-2xl text-[#6e6e73]">
          {t({
            pt: 'Projetos e resultados que refletem excelência em controle, análise financeira e governança corporativa.',
            en: 'Projects and deliverables demonstrating excellence in control mechanisms, financial forecasting, and corporate governance.'
          })}
        </p>
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        {profile.projects.map((item) => {
          const titleStr = t(item.title)
          return (
            <motion.div
              key={titleStr}
              whileHover={{ y: -6 }}
              className="rounded-[28px] border border-black/5 bg-white/90 p-6 shadow-[0_14px_45px_rgba(15,23,42,0.05)] transition"
            >
              <h3 className="text-xl font-semibold text-[#1d1d1f]">{titleStr}</h3>
              <p className="mt-3 text-[#6e6e73]">{t(item.description)}</p>
            </motion.div>
          )
        })}
      </div>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {profile.metrics.map((metric) => {
          const labelStr = t(metric.label)
          return (
            <div key={labelStr} className="rounded-[24px] border border-black/5 bg-white/90 p-6 shadow-[0_14px_45px_rgba(15,23,42,0.05)]">
              <p className="text-[10px] uppercase font-bold tracking-[0.16em] text-[#6e6e73] leading-relaxed">{labelStr}</p>
              <p className="mt-4 text-3xl font-semibold text-[#1d1d1f]">{t(metric.value)}</p>
            </div>
          )
        })}
      </div>
    </motion.section>
  )
}

export default Projects

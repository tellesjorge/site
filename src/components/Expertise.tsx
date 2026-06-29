import { motion } from 'framer-motion'
import * as Icons from 'lucide-react'
import { profile } from '../data/profile'
import { useLanguage } from '../context/LanguageContext'

function Expertise() {
  const { t } = useLanguage()

  return (
    <motion.section
      id="especialidades"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7 }}
      className="mb-16"
    >
      <div className="mb-10 flex flex-col gap-4">
        <p className="text-sm uppercase tracking-[0.28em] text-[#0071e3]">
          {t({ pt: 'Áreas de Especialidade', en: 'Areas of Expertise' })}
        </p>
        <h2 className="text-3xl font-semibold text-[#1d1d1f] sm:text-4xl">
          {t({ pt: 'Competências estratégicas e técnicas', en: 'Strategic & Technical Skills' })}
        </h2>
        <p className="max-w-2xl text-[#6e6e73]">
          {t({
            pt: 'Especializações alinhadas à atuação executiva em finanças, controladoria e análise integrada de resultados.',
            en: 'Specializations aligned with executive performance in finance, controllership and integrated performance analysis.'
          })}
        </p>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {profile.specialties.map((item) => {
          const Icon = (Icons as any)[item.icon] ?? Icons.Target
          const titleStr = t(item.title)
          return (
            <motion.div
              key={titleStr}
              whileHover={{ y: -6 }}
              className="group rounded-[28px] border border-black/5 bg-white/90 p-6 shadow-[0_14px_45px_rgba(15,23,42,0.05)] transition"
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-[#0071e3]/10 text-[#0071e3] transition group-hover:bg-[#0071e3]/15">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-[#1d1d1f]">{titleStr}</h3>
              <p className="mt-3 text-[#6e6e73]">{t(item.description)}</p>
            </motion.div>
          )
        })}
      </div>
    </motion.section>
  )
}

export default Expertise

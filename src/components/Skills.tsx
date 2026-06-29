import { motion } from 'framer-motion'
import { profile } from '../data/profile'
import { useLanguage } from '../context/LanguageContext'

function Skills() {
  const { language, t } = useLanguage()

  const hardSkillsList = profile.skills.hard[language] || profile.skills.hard['pt'] || []
  const softSkillsList = profile.skills.soft[language] || profile.skills.soft['pt'] || []

  return (
    <motion.section
      id="competencias"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7 }}
      className="mb-16 rounded-[32px] border border-black/5 bg-white/90 p-8 shadow-sm"
    >
      <div className="mb-10 grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-[#0071e3] font-semibold">
            {t({ pt: 'Competências', en: 'Competencies' })}
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-[#1d1d1f] sm:text-4xl">
            {t({ pt: 'Hard e Soft Skills', en: 'Hard & Soft Skills' })}
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-6 text-[#6e6e73]">
            {t({
              pt: 'Uma combinação de expertise técnica e postura executiva para liderar a transformação financeira.',
              en: 'A combination of technical expertise and executive stance to drive financial transformation.'
            })}
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-4 rounded-3xl border border-black/5 bg-slate-50 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6e6e73]">Hard Skills</p>
            <div className="grid gap-2">
              {hardSkillsList.map((skill) => (
                <div key={skill} className="rounded-2xl border border-black/5 bg-white px-4 py-2.5 text-xs font-medium text-[#1d1d1f] shadow-sm">
                  {skill}
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4 rounded-3xl border border-black/5 bg-slate-50 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6e6e73]">Soft Skills</p>
            <div className="grid gap-2">
              {softSkillsList.map((skill) => (
                <div key={skill} className="rounded-2xl border border-black/5 bg-white px-4 py-2.5 text-xs font-medium text-[#1d1d1f] shadow-sm">
                  {skill}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  )
}

export default Skills

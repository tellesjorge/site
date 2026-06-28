import { motion } from 'framer-motion'
import { profile } from '../data/profile'

function Skills() {
  return (
    <motion.section
      id="competencias"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7 }}
      className="mb-16 rounded-[32px] border border-white/10 bg-surface2/90 p-8 shadow-glass"
    >
      <div className="mb-10 grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-cyan-300">Competências</p>
          <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">Hard skills e soft skills</h2>
          <p className="mt-4 max-w-xl text-slate-400">
            Uma combinação de expertise técnica e postura executiva para liderar transformação financeira.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-4 rounded-3xl border border-white/10 bg-slate-900/80 p-6">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Hard Skills</p>
            <div className="grid gap-3">
              {profile.skills.hard.map((skill) => (
                <div key={skill} className="rounded-3xl bg-slate-950/80 px-4 py-3 text-sm text-slate-200 shadow-sm">
                  {skill}
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4 rounded-3xl border border-white/10 bg-slate-900/80 p-6">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Soft Skills</p>
            <div className="grid gap-3">
              {profile.skills.soft.map((skill) => (
                <div key={skill} className="rounded-3xl bg-slate-950/80 px-4 py-3 text-sm text-slate-200 shadow-sm">
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

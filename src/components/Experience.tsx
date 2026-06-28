import { motion } from 'framer-motion'
import { profile } from '../data/profile'

function Experience() {
  return (
    <motion.section
      id="experiencia"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7 }}
      className="mb-16"
    >
      <div className="mb-10 flex flex-col gap-4">
        <p className="text-sm uppercase tracking-[0.28em] text-[#0071e3]">Experiência profissional</p>
        <h2 className="text-3xl font-semibold text-[#1d1d1f] sm:text-4xl">Trajetória executiva em controladoria e FP&A</h2>
        <p className="max-w-2xl text-[#6e6e73]">
          Experiências com foco em controladoria, FP&A, gestão financeira estratégica, Power BI e apoio à decisão executiva.
        </p>
      </div>
      <div className="relative border-l border-black/10 pl-8">
        {profile.experience.map((item) => (
          <div key={item.role} className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start">
            <div className="relative mt-2 h-3 w-3 rounded-full bg-[#0071e3] shadow-[0_0_0_8px_rgba(0,113,227,0.08)]" />
            <div className="sm:ml-6">
              <div className="flex flex-col gap-2 rounded-[24px] border border-black/5 bg-white/90 p-6 shadow-[0_14px_45px_rgba(15,23,42,0.05)]">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-[#1d1d1f]">{item.role}</h3>
                    {item.company && <p className="text-sm font-medium text-[#0071e3]">{item.company}</p>}
                  </div>
                  <span className="rounded-full border border-black/5 bg-[#f5f5f7] px-4 py-2 text-sm text-[#424245]">{item.period}</span>
                </div>
                <p className="text-[#424245]">{item.summary}</p>
                <ul className="grid gap-2 text-[#6e6e73] sm:grid-cols-2">
                  {item.highlights.map((highlight) => (
                    <li key={highlight} className="before:mr-2 before:inline-block before:h-2 before:w-2 before:rounded-full before:bg-[#0071e3] before:align-middle">
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.section>
  )
}

export default Experience

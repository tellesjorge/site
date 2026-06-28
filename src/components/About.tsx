import { motion } from 'framer-motion'
import { profile } from '../data/profile'

function About() {
  return (
    <motion.section
      id="sobre"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7 }}
      className="mb-16 rounded-[32px] border border-black/5 bg-white/90 p-8 shadow-[0_20px_60px_rgba(15,23,42,0.06)]"
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-[#0071e3]">Sobre mim</p>
          <h2 className="mt-3 text-3xl font-semibold text-[#1d1d1f] sm:text-4xl">Profissional de finanças e controladoria sênior</h2>
        </div>
        <div className="max-w-2xl text-[#424245]">
          <p className="leading-8">{profile.about}</p>
        </div>
      </div>
    </motion.section>
  )
}

export default About

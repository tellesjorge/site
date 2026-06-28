import { motion } from 'framer-motion'
import { Download } from 'lucide-react'
import { profile } from '../data/profile'

function ResumeDownload() {
  return (
    <motion.section
      id="curriculo"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7 }}
      className="mb-16 rounded-[32px] border border-white/10 bg-surface2/90 p-8 shadow-glass"
    >
      <div className="flex flex-col gap-6 rounded-[28px] border border-slate-700/80 bg-slate-950/90 p-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-cyan-300">Currículo</p>
          <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">Download do currículo em PDF</h2>
          <p className="mt-4 max-w-xl text-slate-400">
            Baixe o perfil profissional com histórico de carreira, competências e resultados para apresentação executiva.
          </p>
        </div>
        <a
          href={profile.actions.resume}
          className="inline-flex items-center gap-3 rounded-full bg-cyan-500 px-5 py-4 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
        >
          <Download className="h-4 w-4" /> Baixar Currículo em PDF
        </a>
      </div>
    </motion.section>
  )
}

export default ResumeDownload

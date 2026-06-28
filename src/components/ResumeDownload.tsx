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
      className="mb-16 rounded-[32px] border border-black/5 bg-white/90 p-8 shadow-sm"
    >
      <div className="flex flex-col gap-6 rounded-[28px] border border-black/5 bg-slate-50 p-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-[#0071e3] font-semibold">Currículo</p>
          <h2 className="mt-3 text-3xl font-semibold text-[#1d1d1f] sm:text-4xl">Download do Currículo em PDF</h2>
          <p className="mt-4 max-w-xl text-sm leading-6 text-[#6e6e73]">
            Baixe o perfil profissional completo com histórico de carreira, competências e resultados para fins de recrutamento.
          </p>
        </div>
        <a
          href={profile.actions.resume}
          download
          className="inline-flex items-center justify-center gap-3 rounded-full bg-[#0071e3] px-6 py-4 text-sm font-semibold text-white transition hover:bg-[#2997ff]"
        >
          <Download className="h-4 w-4" /> Baixar Currículo em PDF
        </a>
      </div>
    </motion.section>
  )
}

export default ResumeDownload

import { motion } from 'framer-motion'
import { ArrowDownRight, Briefcase, Smartphone } from 'lucide-react'
import { profile } from '../data/profile'

function Hero() {
  return (
    <section id="top" className="relative overflow-hidden px-6 pb-20 pt-28 sm:px-8 lg:px-10 lg:pb-24 lg:pt-32">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(0,113,227,0.12),_transparent_42%),linear-gradient(135deg,_rgba(255,255,255,0.98),_rgba(241,247,255,0.97))]" />
      <div className="relative mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl"
        >
          <div className="apple-pill w-fit">
            <Briefcase className="h-4 w-4" />
            Controladoria, FP&A e estratégia financeira
          </div>
          <p className="mt-6 text-sm uppercase tracking-[0.32em] text-[#6e6e73]">{profile.name}</p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight text-[#1d1d1f] sm:text-5xl lg:text-6xl">
            {profile.headline}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#424245] sm:text-xl">
            {profile.subtitle}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#contato"
              className="inline-flex items-center gap-2 rounded-full bg-[#0071e3] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#2997ff]"
            >
              <Smartphone className="h-4 w-4" /> Conversar agora
            </a>
            <a
              href="#especialidades"
              className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-[#1d1d1f] transition hover:bg-[#f5f5f7]"
            >
              <ArrowDownRight className="h-4 w-4" /> Ver como ajudo
            </a>
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            {[
              ['Controle', 'Visão clara de caixa, custos e risco.'],
              ['Planejamento', 'Previsão, cenários e decisão executiva.'],
              ['Impacto', 'Estratégia prática para o negócio crescer.'],
            ].map(([title, description]) => (
              <div key={title} className="rounded-[24px] border border-black/5 bg-white/90 p-4 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
                <p className="text-base font-semibold text-[#1d1d1f]">{title}</p>
                <p className="mt-2 text-sm leading-6 text-[#6e6e73]">{description}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Hero

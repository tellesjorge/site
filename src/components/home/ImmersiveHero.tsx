import { motion } from 'framer-motion'
import { Briefcase } from 'lucide-react'
import { Link } from 'react-router-dom'
import HeroImageAtmosphere from '../brand/HeroImageAtmosphere'
import InteractiveAuroraBackground from '../ui/InteractiveAuroraBackground'
import LiveContextWidget from '../widgets/LiveContextWidget'

export default function ImmersiveHero() {
  return (
    <InteractiveAuroraBackground className="relative w-full min-h-[calc(100vh-80px)] lg:min-h-[780px] flex flex-col justify-between px-6 pb-6 pt-28 sm:px-8 lg:px-10 lg:pb-10 lg:pt-32">
      <div className="relative mx-auto max-w-6xl w-full z-10 flex-grow flex flex-col justify-center">
        {/* Main Grid Content */}
        <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          
          {/* Left Column: Text & Actions */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="space-y-6 text-left"
          >
            <div className="apple-pill w-fit text-[11px] px-3.5 py-1.5 font-bold">
              <Briefcase className="h-3.5 w-3.5" />
              Controladoria + FP&A + IA + Dados
            </div>
            
            <div className="space-y-2">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.36em] text-[#0071e3]">
                JORGE TELLES
              </p>
              <h1 
                className="font-black text-[#1d1d1f] tracking-tight leading-[1.05] sm:leading-[1.05]"
                style={{ 
                  fontSize: 'clamp(2.1rem, 4.2vw, 3.6rem)',
                  letterSpacing: '-0.04em'
                }}
              >
                Controller Estratégico | FP&A | Inteligência Artificial aplicada à Controladoria
              </h1>
            </div>

            <p className="max-w-xl text-xs sm:text-sm leading-relaxed text-[#6e6e73] font-medium">
              Transformo dados financeiros, custos, estoques, orçamento e indicadores em decisões executivas com apoio de dashboards, automação e inteligência artificial.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                to="/contato?interest=hire"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0071e3] px-6 py-3 text-xs font-semibold text-white transition hover:bg-[#2997ff]"
              >
                Contratar como Controller
              </Link>
              <Link
                to="/contato?interest=consulting"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-black/10 bg-white/70 backdrop-blur-sm px-6 py-3 text-xs font-semibold text-[#1d1d1f] transition hover:bg-[#f5f5f7]"
              >
                Solicitar Diagnóstico Financeiro
              </Link>
            </div>
          </motion.div>

          {/* Right Column: HeroImageAtmosphere */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            className="flex justify-center lg:justify-end"
          >
            <HeroImageAtmosphere />
          </motion.div>
        </div>
      </div>

      {/* Embedded Live Context Status Bar overlapping the bottom of the first fold */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.35, ease: 'easeOut' }}
        className="w-full relative z-20 mt-12 sm:mt-16"
      >
        <LiveContextWidget className="mt-4 shadow-[0_15px_45px_rgba(0,0,0,0.02)]" />
      </motion.div>
    </InteractiveAuroraBackground>
  )
}

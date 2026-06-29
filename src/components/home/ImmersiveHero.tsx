import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import HeroImageAtmosphere from '../brand/HeroImageAtmosphere'
import InteractiveAuroraBackground from '../ui/InteractiveAuroraBackground'

const INSIGHTS = [
  "IA Diagnóstico: CMV médio projetado em 42% devido a flutuações de estoque de insumos.",
  "IA Forecast: Margem operacional estimada para R$ 1.8M (+3.2% vs. orçamento anterior).",
  "IA Auditoria: Divergência de R$ 12.4k corrigida no fluxo de caixa projetado.",
  "IA Capital de Giro: Sugestão de alongamento de prazos em 15 dias com fornecedores principais.",
  "IA Autodiagnóstico: Análise preditiva indica ganho de eficiência operacional de 4.8% no setor A."
]

export default function ImmersiveHero() {
  const [currentInsightIndex, setCurrentInsightIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentInsightIndex((prev) => (prev + 1) % INSIGHTS.length)
    }, 7000)
    return () => clearInterval(interval)
  }, [])

  return (
    <InteractiveAuroraBackground className="relative flex w-full flex-col px-5 pb-8 pt-14 sm:px-8 sm:pt-16 lg:px-10 lg:pb-10 lg:pt-20 overflow-hidden">
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 items-start pt-2 lg:pt-4">
        <div className="relative grid w-full items-center gap-9 lg:grid-cols-[minmax(0,0.92fr)_minmax(420px,0.88fr)] lg:gap-9 xl:gap-12">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.72, ease: 'easeOut' }}
            className="relative z-20 max-w-2xl space-y-5 text-left"
          >
            <div className="space-y-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#0071e3] opacity-95">
                Controladoria • FP&A • IA • Dados
              </p>
              <h1
                className="max-w-3xl text-[#0f172a]"
                style={{
                  fontSize: 'clamp(2.0rem, 3.8vw, 3.65rem)',
                  fontWeight: 700,
                  letterSpacing: '-0.026em',
                  lineHeight: 1.04
                }}
              >
                Controller Estratégico | FP&A
                <span className="block text-[#1f2937]">IA aplicada à Controladoria</span>
              </h1>
            </div>

            <p className="max-w-xl text-sm font-medium leading-relaxed text-slate-700 sm:text-[15px]">
              Transformo dados financeiros, custos, estoques, orçamento e indicadores em decisões executivas com apoio de dashboards, automação e inteligência artificial.
            </p>

            {/* AI Auto-regenerative Insights Feed */}
            <div className="flex items-center gap-3 rounded-2xl border border-white/60 bg-white/45 p-3 text-xs text-slate-700 shadow-[0_8px_30px_rgb(0,0,0,0.02)] backdrop-blur-md transition-all hover:bg-white/60 max-w-xl">
              <div className="flex-shrink-0 flex items-center justify-center rounded-xl bg-[#0071e3]/10 p-2 text-[#0071e3]">
                <Sparkles className="h-4 w-4 animate-pulse" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-[#0071e3] uppercase text-[9px] tracking-wider">Agente IA Ativo</span>
                  <span className="h-1 w-1 rounded-full bg-emerald-500 animate-ping" />
                </div>
                <p className="mt-0.5 text-slate-800 text-[11px] leading-relaxed transition-all duration-500 font-medium">
                  {INSIGHTS[currentInsightIndex]}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-1 sm:flex-row">
              <Link
                to="/contato?interest=hire"
                className="inline-flex items-center justify-center rounded-full bg-[#0071e3] px-6 py-3 text-xs font-semibold text-[#fff] shadow-[0_18px_42px_rgba(0,122,255,0.22)] transition hover:bg-[#2997ff]"
              >
                Contratar como Controller
              </Link>
              <Link
                to="/contato?interest=consulting"
                className="inline-flex items-center justify-center rounded-full border border-white/80 bg-white/70 px-6 py-3 text-xs font-semibold text-slate-950 shadow-[0_16px_42px_rgba(15,23,42,0.08)] backdrop-blur-2xl transition hover:bg-white/90"
              >
                Solicitar Diagnóstico Financeiro
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.78, delay: 0.12, ease: 'easeOut' }}
            className="relative z-10 flex justify-center lg:-ml-4 lg:justify-end xl:-ml-8"
          >
            <HeroImageAtmosphere />
          </motion.div>
        </div>
      </div>

    </InteractiveAuroraBackground>
  )
}

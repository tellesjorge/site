import { useEffect, useState } from 'react'
import { Cpu, RefreshCw, Server } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'

export default function LiveContextWidget({ className = 'my-6' }: { className?: string }) {
  const [updatedAt, setUpdatedAt] = useState('')
  const { t } = useLanguage()

  useEffect(() => {
    const now = new Date()
    setUpdatedAt(now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }))
  }, [])

  return (
    <div className={`mx-auto w-full max-w-3xl ${className}`}>
      <div className="grid grid-cols-1 gap-3 rounded-[30px] border border-white/70 bg-white/65 p-3 shadow-[0_24px_80px_rgba(15,23,42,0.06)] backdrop-blur-xl sm:grid-cols-2 sm:p-4">
        {/* Item 1: Painel Executivo */}
        <div className="flex min-w-0 items-center gap-3 rounded-[22px] border border-white/80 bg-white/70 p-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.72)] transition-all duration-300 hover:bg-white/85">
          <div className="flex-shrink-0 rounded-2xl bg-blue-500/10 p-2 text-blue-600">
            <Server className="h-4.5 w-4.5" />
          </div>
          <div className="min-w-0">
            <p className="text-[9px] font-bold uppercase tracking-widest text-slate-600">
              {t({ pt: 'Painel Executivo', en: 'Executive Panel' })}
            </p>
            <p className="truncate text-xs font-bold text-slate-900">
              {t({ pt: 'Status Operacional', en: 'Operational Status' })}
            </p>
            <div className="mt-0.5 flex items-center gap-1.5 text-[10px] font-semibold text-emerald-600">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>{t({ pt: 'Dashboard Ativo', en: 'Dashboard Active' })}</span>
            </div>
          </div>
        </div>

        {/* Item 2: Automação IA */}
        <div className="flex min-w-0 items-center gap-3 rounded-[22px] border border-white/80 bg-white/70 p-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.72)] transition-all duration-300 hover:bg-white/85">
          <div className="flex-shrink-0 rounded-2xl bg-cyan-500/10 p-2 text-cyan-600">
            <Cpu className="h-4.5 w-4.5" />
          </div>
          <div className="min-w-0">
            <p className="text-[9px] font-bold uppercase tracking-widest text-slate-600">
              {t({ pt: 'Automação IA', en: 'AI Automation' })}
            </p>
            <p className="truncate text-xs font-bold text-slate-900">
              {t({ pt: 'Modo de Simulação', en: 'Simulation Engine' })}
            </p>
            <div className="mt-0.5 flex items-center gap-1 text-[10px] text-slate-600">
              <RefreshCw className="h-2.5 w-2.5 animate-spin" />
              <span className="truncate">
                {t({
                  pt: `Auto-regenerando às ${updatedAt}`,
                  en: `Auto-regenerating at ${updatedAt}`
                })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

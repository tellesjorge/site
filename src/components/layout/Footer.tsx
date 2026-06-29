import { Link } from 'react-router-dom'
import Logo from '../brand/Logo'
import { useLanguage } from '../../context/LanguageContext'

export default function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="border-t border-black/5 bg-slate-50 py-12 text-slate-500">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10 flex flex-col gap-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between border-b border-black/5 pb-8">
          <div className="space-y-4 max-w-md">
            <Logo variant="full" />
            <p className="text-xs text-slate-400 leading-relaxed">
              {t({
                pt: 'Jorge Telles — Controladoria, FP&A e Inteligência Financeira aplicada à decisão executiva.',
                en: 'Jorge Telles — Controllership, FP&A and Financial Intelligence applied to executive decisions.'
              })}
            </p>
            <div className="pt-1">
              <Link
                to="/contato"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0071e3] px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-[#2997ff]"
              >
                {t({ pt: 'Falar com Jorge', en: 'Contact Jorge' })}
              </Link>
            </div>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-3 text-xs font-semibold text-[#6e6e73]">
            <Link to="/" className="transition hover:text-[#1d1d1f]">
              {t({ pt: 'Início', en: 'Home' })}
            </Link>
            <Link to="/perfil" className="transition hover:text-[#1d1d1f]">
              {t({ pt: 'Perfil', en: 'Profile' })}
            </Link>
            <Link to="/ia-dashboards" className="transition hover:text-[#1d1d1f]">
              {t({ pt: 'IA & Dashboards', en: 'AI & Dashboards' })}
            </Link>
            <Link to="/consultoria" className="transition hover:text-[#1d1d1f]">
              {t({ pt: 'Consultoria', en: 'Consulting' })}
            </Link>
            <Link to="/contato" className="transition hover:text-[#1d1d1f]">
              {t({ pt: 'Contato', en: 'Contact' })}
            </Link>
          </div>
        </div>
        <div className="flex flex-col gap-4 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left text-xs text-slate-400">
          <p>© 2026 Jorge Telles. {t({ pt: 'Todos os direitos reservados.', en: 'All rights reserved.' })}</p>
          <span>{t({ pt: 'Dados protegidos em conformidade com a LGPD', en: 'Data protected in compliance with LGPD / GDPR' })}</span>
        </div>
      </div>
    </footer>
  )
}

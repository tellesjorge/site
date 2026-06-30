import { NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronRight } from 'lucide-react'
import { navigationItems } from '../../data/navigation'
import Logo from '../brand/Logo'
import { useLanguage } from '../../context/LanguageContext'

type MobileNavProps = {
  isOpen: boolean
  onClose: () => void
}

const BrazilFlag = () => (
  <svg viewBox="0 0 20 20" className="h-4 w-4 rounded-full overflow-hidden shadow-sm" xmlns="http://www.w3.org/2000/svg">
    <rect width="20" height="20" fill="#009c3b" />
    <polygon points="10,2 18,10 10,18 2,10" fill="#ffdf00" />
    <circle cx="10" cy="10" r="4" fill="#002776" />
  </svg>
)

const USFlag = () => (
  <svg viewBox="0 0 20 20" className="h-4 w-4 rounded-full overflow-hidden shadow-sm" xmlns="http://www.w3.org/2000/svg">
    <rect width="20" height="20" fill="#ffffff" />
    <rect width="20" height="2" y="0" fill="#b22234" />
    <rect width="20" height="2" y="4" fill="#b22234" />
    <rect width="20" height="2" y="8" fill="#b22234" />
    <rect width="20" height="2" y="12" fill="#b22234" />
    <rect width="20" height="2" y="16" fill="#b22234" />
    <rect width="10" height="10" fill="#3c3b6e" />
    <circle cx="3" cy="3" r="0.7" fill="#ffffff" />
    <circle cx="7" cy="3" r="0.7" fill="#ffffff" />
    <circle cx="3" cy="7" r="0.7" fill="#ffffff" />
    <circle cx="7" cy="7" r="0.7" fill="#ffffff" />
    <circle cx="5" cy="5" r="0.7" fill="#ffffff" />
  </svg>
)

export default function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const { language, setLanguage, t } = useLanguage()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 z-50 w-full max-w-[320px] bg-white/95 backdrop-blur-xl border-l border-black/5 shadow-2xl p-6 flex flex-col lg:hidden"
          >
            <div className="flex items-center justify-between mb-8">
              <Logo variant="compact" onClick={onClose} />
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/5 bg-slate-50 text-[#1d1d1f] hover:bg-slate-100 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex-1 flex flex-col gap-1.5 overflow-y-auto">
              {navigationItems.map((item) => {
                if (item.dropdown) {
                  return (
                    <div key={item.href} className="space-y-1">
                      <div className="px-5 py-2 text-xs font-bold text-[#8e8e93] uppercase tracking-wider select-none">
                        {t(item.label)}
                      </div>
                      <div className="pl-3 space-y-1 border-l border-slate-100 ml-5">
                        {item.dropdown.map((sub) => (
                          <NavLink
                            key={sub.href}
                            to={sub.href}
                            onClick={onClose}
                            className={({ isActive }) =>
                              `flex items-center justify-between rounded-xl px-4 py-2.5 text-xs font-semibold transition ${
                                isActive
                                  ? 'bg-[#0071e3]/10 text-[#0071e3]'
                                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                              }`
                            }
                          >
                            {t(sub.label)}
                            <ChevronRight className="h-3.5 w-3.5 opacity-40" />
                          </NavLink>
                        ))}
                      </div>
                    </div>
                  )
                }

                return (
                  <NavLink
                    key={item.href}
                    to={item.href}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center justify-between rounded-2xl px-5 py-3.5 text-sm font-medium transition ${
                        isActive
                          ? 'bg-[#0071e3]/10 text-[#0071e3]'
                          : 'text-[#424245] hover:bg-[#f5f5f7] hover:text-[#1d1d1f]'
                      }`
                    }
                  >
                    {t(item.label)}
                    <ChevronRight className="h-4 w-4 opacity-50" />
                  </NavLink>
                )
              })}
            </nav>

            <div className="mt-auto pt-6 border-t border-black/5 flex flex-col gap-3">
              {/* Language Switcher */}
              <div className="flex items-center justify-between border border-black/5 bg-slate-50 p-2 rounded-2xl">
                <span className="text-xs font-semibold text-[#8e8e93] pl-2">
                  {t({ pt: 'Idioma', en: 'Language' })}
                </span>
                <div className="flex items-center gap-1 bg-white p-0.5 rounded-full shadow-sm border border-black/5">
                  <button
                    type="button"
                    onClick={() => setLanguage('pt')}
                    className={`flex h-7 px-3.5 items-center gap-1.5 rounded-full text-xs transition duration-200 ${
                      language === 'pt'
                        ? 'bg-[#0071e3] text-white shadow-sm font-bold'
                        : 'text-slate-500 hover:bg-slate-100'
                    }`}
                  >
                    <BrazilFlag />
                    <span>PT</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setLanguage('en')}
                    className={`flex h-7 px-3.5 items-center gap-1.5 rounded-full text-xs transition duration-200 ${
                      language === 'en'
                        ? 'bg-[#0071e3] text-white shadow-sm font-bold'
                        : 'text-slate-500 hover:bg-slate-100'
                    }`}
                  >
                    <USFlag />
                    <span>EN</span>
                  </button>
                </div>
              </div>

              <NavLink
                to="/contato"
                onClick={onClose}
                className="flex items-center justify-center rounded-2xl bg-[#0071e3] px-5 py-4 text-sm font-medium text-white transition hover:bg-[#2997ff]"
              >
                {t({ pt: 'Falar com Jorge', en: 'Contact Jorge' })}
              </NavLink>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

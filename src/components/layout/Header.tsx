import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Menu } from 'lucide-react'
import { navigationItems } from '../../data/navigation'
import MobileNav from './MobileNav'
import Logo from '../brand/Logo'
import { useLanguage } from '../../context/LanguageContext'

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

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const { language, setLanguage, t } = useLanguage()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'border-b border-black/5 bg-white/80 backdrop-blur-xl py-3 shadow-[0_1px_10px_rgba(0,0,0,0.02)]'
            : 'border-b border-transparent bg-transparent py-4'
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 sm:px-8 lg:px-10">
          <Logo variant="full" className="hidden sm:inline-flex" />
          <Logo variant="compact" className="sm:hidden" />

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-6 lg:flex">
            {navigationItems.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) =>
                  `text-sm font-medium transition ${
                    isActive
                      ? 'text-[#0071e3]'
                      : 'text-[#6e6e73] hover:text-[#1d1d1f]'
                  }`
                }
              >
                {t(item.label)}
              </NavLink>
            ))}
          </nav>

          {/* Call to Action, Flags & Hamburger */}
          <div className="flex items-center gap-3">
            {/* Language Switcher */}
            <div className="flex items-center gap-1 border border-black/5 bg-slate-100/60 p-0.5 rounded-full shadow-sm">
              <button
                type="button"
                onClick={() => setLanguage('pt')}
                className={`flex h-7 px-2.5 items-center gap-1.5 rounded-full text-[11px] font-semibold transition-all duration-200 ${
                  language === 'pt'
                    ? 'bg-[#0071e3] text-white shadow-sm font-bold scale-105'
                    : 'text-slate-600 hover:bg-slate-200'
                }`}
                title="Português"
              >
                <BrazilFlag />
                <span>PT</span>
              </button>
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`flex h-7 px-2.5 items-center gap-1.5 rounded-full text-[11px] font-semibold transition-all duration-200 ${
                  language === 'en'
                    ? 'bg-[#0071e3] text-white shadow-sm font-bold scale-105'
                    : 'text-slate-600 hover:bg-slate-200'
                }`}
                title="English"
              >
                <USFlag />
                <span>EN</span>
              </button>
            </div>

            <Link
              to="/contato"
              className="hidden rounded-full bg-[#0071e3] px-4 py-2 text-xs font-semibold text-white tracking-wide transition hover:bg-[#2997ff] lg:block animate-fade-in"
            >
              {t({ pt: 'Falar com Jorge', en: 'Contact Jorge' })}
            </Link>

            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/5 bg-white text-[#1d1d1f] shadow-sm hover:bg-[#f5f5f7] transition lg:hidden"
              aria-label="Abrir menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </motion.header>

      <MobileNav isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}

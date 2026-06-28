import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Menu } from 'lucide-react'
import { navigationItems } from '../../data/navigation'
import MobileNav from './MobileNav'
import Logo from '../brand/Logo'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

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
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Call to Action & Hamburger */}
          <div className="flex items-center gap-3">
            <Link
              to="/contato"
              className="hidden rounded-full bg-[#0071e3] px-4 py-2 text-xs font-semibold text-white tracking-wide transition hover:bg-[#2997ff] lg:block"
            >
              Falar com Jorge
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

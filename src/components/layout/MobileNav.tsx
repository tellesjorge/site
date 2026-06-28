import { NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronRight } from 'lucide-react'
import { navigationItems } from '../../data/navigation'
import Logo from '../brand/Logo'

type MobileNavProps = {
  isOpen: boolean
  onClose: () => void
}

export default function MobileNav({ isOpen, onClose }: MobileNavProps) {
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

            <nav className="flex-1 flex flex-col gap-2">
              {navigationItems.map((item) => (
                <NavLink
                  key={item.href}
                  to={item.href}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center justify-between rounded-2xl px-5 py-4 text-sm font-medium transition ${
                      isActive
                        ? 'bg-[#0071e3]/10 text-[#0071e3]'
                        : 'text-[#424245] hover:bg-[#f5f5f7] hover:text-[#1d1d1f]'
                    }`
                  }
                >
                  {item.label}
                  <ChevronRight className="h-4 w-4 opacity-50" />
                </NavLink>
              ))}
            </nav>

            <div className="mt-auto pt-6 border-t border-black/5 flex flex-col gap-3">
              <NavLink
                to="/contato"
                onClick={onClose}
                className="flex items-center justify-center rounded-2xl bg-[#0071e3] px-5 py-4 text-sm font-medium text-white transition hover:bg-[#2997ff]"
              >
                Falar agora
              </NavLink>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

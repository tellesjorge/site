import { useState } from 'react'
import { motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { profile } from '../data/profile'

const navigation = [
  { label: 'Sobre', href: '#sobre' },
  { label: 'Especialidades', href: '#especialidades' },
  { label: 'Experiência', href: '#experiencia' },
  { label: 'Projetos', href: '#projetos' },
  { label: 'Diagnóstico', href: '#diagnostico' },
  { label: 'Controladoria', href: '#controladoria' },
  { label: 'IA & Dashboards', href: '#ia' },
  { label: 'Contato', href: '#contato' },
]

function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="fixed inset-x-0 top-0 z-50 border-b border-black/5 bg-white/85 backdrop-blur-xl"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 sm:px-8 lg:px-10">
        <a href="#top" className="text-base font-semibold tracking-[0.24em] text-[#1d1d1f]">
          {profile.name}
        </a>
        <nav className="hidden items-center gap-8 lg:flex">
          {navigation.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm text-[#6e6e73] transition hover:text-[#1d1d1f]"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          <a
            href="#contato"
            className="rounded-full bg-[#0071e3] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#2997ff]"
          >
            Falar agora
          </a>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen((state) => !state)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white text-[#1d1d1f] shadow-sm transition hover:bg-[#f5f5f7] lg:hidden"
          aria-label="Abrir menu"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {isOpen && (
        <div className="lg:hidden">
          <div className="mx-auto max-w-7xl px-6 pb-6 sm:px-8 lg:px-10">
            <div className="space-y-4 rounded-[28px] border border-black/5 bg-white/95 p-5 shadow-[0_14px_45px_rgba(15,23,42,0.08)]">
              {navigation.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="block rounded-2xl px-4 py-3 text-sm text-[#1d1d1f] transition hover:bg-[#f5f5f7]"
                >
                  {item.label}
                </a>
              ))}
              <div className="flex flex-col gap-3 pt-2">
                <a
                  href="#contato"
                  className="rounded-2xl bg-[#0071e3] px-4 py-3 text-sm font-medium text-white transition hover:bg-[#2997ff]"
                >
                  Falar agora
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.header>
  )
}

export default Header

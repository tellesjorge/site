import { profile } from '../data/profile'

function Footer() {
  return (
    <footer className="border-t border-white/10 bg-surface/95 py-8 text-slate-400">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left sm:px-8 lg:px-10">
        <p>© 2026 {profile.name}</p>
        <div className="flex flex-wrap items-center justify-center gap-3 text-sm sm:justify-end">
          <a href="#privacidade" className="transition hover:text-white">
            Política de Privacidade
          </a>
          <a href="#contato" className="transition hover:text-white">
            Contato
          </a>
          <span>Dados tratados conforme a LGPD</span>
        </div>
      </div>
    </footer>
  )
}

export default Footer

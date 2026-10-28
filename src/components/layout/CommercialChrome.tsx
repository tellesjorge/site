import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

export function CommercialHeader() {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  useEffect(() => { setOpen(false) }, [location.pathname])
  return <header className="jt-header">
    <a className="jt-brand" href="/" aria-label="Jorge Telles, início"><span className="jt-monogram" aria-hidden="true">JT<span>·</span></span><span>Jorge Telles<small>ESTRATÉGIA, DADOS & TECNOLOGIA</small></span></a>
    <button className="jt-menu-toggle" type="button" aria-controls="jt-navigation" aria-expanded={open} onClick={() => setOpen(!open)} onKeyDown={event => { if (event.key === 'Escape') setOpen(false) }}>Menu <span aria-hidden="true">☰</span></button>
    <nav id="jt-navigation" className={open ? 'is-open' : ''} aria-label="Menu principal" onClick={() => setOpen(false)}>
      <a href="/#consultoria">Consultoria</a><a href="/#inteligencia">IA & dashboards</a><a href="/#sistema">Sistema fiscal</a><a href="/artigos/">Artigos</a><a href="/perfil" aria-current={location.pathname === '/perfil' ? 'page' : undefined}>Sobre Jorge</a><a href="https://mail.jorgetelles.com.br" aria-label="Webmail — acesso restrito">Webmail</a><a className="jt-client-link" href="https://app.jorgetelles.com.br/login">Área do cliente ↗</a>
    </nav>
  </header>
}

export function CommercialFooter() {
  return <footer className="jt-footer"><div className="jt-container jt-footer-top"><a className="jt-brand" href="/"><span className="jt-monogram" aria-hidden="true">JT<span>·</span></span><span>Jorge Telles<small>ESTRATÉGIA, DADOS & TECNOLOGIA</small></span></a><div><a href="/#consultoria">Consultoria</a><a href="/#inteligencia">IA & dashboards</a><a href="/artigos/">Artigos</a><a href="/perfil">Perfil profissional</a><a href="/contato?interest=consulting">Contato</a><a href="https://mail.jorgetelles.com.br" aria-label="Webmail — acesso restrito">Webmail</a><a href="https://app.jorgetelles.com.br/login">Área do cliente</a></div></div><div className="jt-container jt-footer-bottom"><p>© 2026 Jorge Telles. Consultoria e soluções em negócios.</p><span>Estratégia, dados e tecnologia.</span></div></footer>
}

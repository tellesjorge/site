import { Outlet } from 'react-router-dom'
import { useEffect } from 'react'
import { CommercialHeader, CommercialFooter } from './CommercialChrome'
import PrivacyBanner from '../PrivacyBanner'
import PrivacyPolicy from '../PrivacyPolicy'

export default function AppLayout() {
  useEffect(() => {
    document.body.classList.add('jt-site', 'jt-commercial-pages')
    return () => { document.body.classList.remove('jt-site', 'jt-commercial-pages') }
  }, [])
  return (
    <div className="jt-commercial-app">
      <a className="jt-skip" href="#conteudo">Pular para o conteúdo</a>
      <div className="jt-commercial-shell">
        <PrivacyBanner />
        <CommercialHeader />
        <main id="conteudo" className="jt-commercial-content">
          <Outlet />
        </main>
        <PrivacyPolicy />
        <CommercialFooter />
      </div>
    </div>
  )
}

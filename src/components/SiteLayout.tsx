import { Outlet } from 'react-router-dom'
import Header from './Header'
import PrivacyBanner from './PrivacyBanner'
import PrivacyPolicy from './PrivacyPolicy'
import Footer from './Footer'

function SiteLayout() {
  return (
    <div className="min-h-screen px-3 py-3 text-[#1d1d1f] sm:px-4 sm:py-4 lg:px-6 lg:py-6">
      <div className="apple-shell mx-auto max-w-7xl overflow-hidden rounded-[40px] border border-black/5 bg-white/80 backdrop-blur-xl">
        <PrivacyBanner />
        <Header />
        <main className="relative">
          <Outlet />
        </main>
        <PrivacyPolicy />
        <Footer />
      </div>
    </div>
  )
}

export default SiteLayout

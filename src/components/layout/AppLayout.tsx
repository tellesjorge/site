import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import PrivacyBanner from '../PrivacyBanner'
import PrivacyPolicy from '../PrivacyPolicy'

export default function AppLayout() {
  return (
    <div className="min-h-screen px-3 py-3 text-[#1d1d1f] sm:px-4 sm:py-4 lg:px-6 lg:py-6 bg-slate-900/5">
      <div className="apple-shell mx-auto max-w-7xl overflow-hidden rounded-[40px] border border-black/5 bg-white/80 backdrop-blur-xl shadow-2xl flex flex-col min-h-[calc(100vh-2rem)]">
        <PrivacyBanner />
        <Header />
        <main className="relative flex-1 pt-24 pb-12">
          <Outlet />
        </main>
        <PrivacyPolicy />
        <Footer />
      </div>
    </div>
  )
}

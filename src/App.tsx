import { Suspense, lazy } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import About from './components/About'
import Expertise from './components/Expertise'
import Experience from './components/Experience'
import Projects from './components/Projects'
import Skills from './components/Skills'
import TechStack from './components/TechStack'
import ResumeDownload from './components/ResumeDownload'
import Footer from './components/Footer'
import PrivacyBanner from './components/PrivacyBanner'

// Lazy-loaded components
const DashboardPreview = lazy(() => import('./components/DashboardPreview'))
const FinancialDiagnostic = lazy(() => import('./components/FinancialDiagnostic'))
const ControladoriaSystem = lazy(() => import('./components/ControladoriaSystem'))
const AIFinanceSection = lazy(() => import('./components/AIFinanceSection'))
const Contact = lazy(() => import('./components/Contact'))
const PrivacyPolicy = lazy(() => import('./components/PrivacyPolicy'))

// Elegant fallback skeleton loader matching the app's dark/light segments
const SectionSkeleton = () => (
  <div className="my-12 h-64 w-full animate-pulse rounded-[32px] bg-slate-100/50 dark:bg-slate-900/10 border border-black/5" />
)

function App() {
  return (
    <div className="min-h-screen px-3 py-3 text-[#1d1d1f] sm:px-4 sm:py-4 lg:px-6 lg:py-6">
      <div className="apple-shell mx-auto max-w-7xl overflow-hidden rounded-[40px] border border-black/5 bg-white/80 backdrop-blur-xl">
        <PrivacyBanner />
        <Header />
        <main className="relative">
          <Hero />
          <section className="mx-auto max-w-7xl px-6 pb-24 pt-16 sm:px-8 lg:px-10">
            <About />
            <Expertise />
            <Experience />
            <Projects />
            <Suspense fallback={<SectionSkeleton />}>
              <DashboardPreview />
            </Suspense>
            <Suspense fallback={<SectionSkeleton />}>
              <FinancialDiagnostic />
            </Suspense>
            <Suspense fallback={<SectionSkeleton />}>
              <ControladoriaSystem />
            </Suspense>
            <Suspense fallback={<SectionSkeleton />}>
              <AIFinanceSection />
            </Suspense>
            <Skills />
            <TechStack />
            <ResumeDownload />
            <Suspense fallback={<SectionSkeleton />}>
              <Contact />
            </Suspense>
          </section>
        </main>
        <Suspense fallback={null}>
          <PrivacyPolicy />
        </Suspense>
        <Footer />
      </div>
    </div>
  )
}

export default App


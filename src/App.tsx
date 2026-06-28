import Header from './components/Header'
import Hero from './components/Hero'
import About from './components/About'
import Expertise from './components/Expertise'
import Experience from './components/Experience'
import Projects from './components/Projects'
import DashboardPreview from './components/DashboardPreview'
import FinancialDiagnostic from './components/FinancialDiagnostic'
import ControladoriaSystem from './components/ControladoriaSystem'
import AIFinanceSection from './components/AIFinanceSection'
import Skills from './components/Skills'
import TechStack from './components/TechStack'
import ResumeDownload from './components/ResumeDownload'
import Contact from './components/Contact'
import Footer from './components/Footer'
import PrivacyBanner from './components/PrivacyBanner'
import PrivacyPolicy from './components/PrivacyPolicy'

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
            <DashboardPreview />
            <FinancialDiagnostic />
            <ControladoriaSystem />
            <AIFinanceSection />
            <Skills />
            <TechStack />
            <ResumeDownload />
            <Contact />
          </section>
        </main>
        <PrivacyPolicy />
        <Footer />
      </div>
    </div>
  )
}

export default App

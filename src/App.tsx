import { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout'

// Lazy-loaded pages
const HomePage = lazy(() => import('./pages/HomePage'))
const ExecutiveProfilePage = lazy(() => import('./pages/ExecutiveProfilePage'))
const ExperiencePage = lazy(() => import('./pages/ExperiencePage'))
const AIDashboardsPage = lazy(() => import('./pages/AIDashboardsPage'))
const ConsultingPage = lazy(() => import('./pages/ConsultingPage'))
const ResumePage = lazy(() => import('./pages/ResumePage'))
const ContactPage = lazy(() => import('./pages/ContactPage'))
const ArticlesPage = lazy(() => import('./pages/ArticlesPage'))
const ArticleDetailPage = lazy(() => import('./pages/ArticleDetailPage'))

// Elegant fallback screen for chunk transitions
const PageLoader = () => (
  <div className="mx-auto max-w-7xl px-6 py-24 sm:px-8 lg:px-10 flex flex-col gap-6 animate-pulse">
    <div className="h-8 bg-slate-200/60 rounded-lg w-1/3" />
    <div className="h-4 bg-slate-200/60 rounded-lg w-full" />
    <div className="h-64 bg-slate-100/50 rounded-3xl w-full border border-black/5" />
  </div>
)

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<HomePage />} />
            <Route path="perfil" element={<ExecutiveProfilePage />} />
            <Route path="experiencia" element={<ExperiencePage />} />
            <Route path="ia-dashboards" element={<AIDashboardsPage />} />
            <Route path="consultoria" element={<ConsultingPage />} />
            <Route path="artigos" element={<ArticlesPage />} />
            <Route path="artigos/:slug" element={<ArticleDetailPage />} />
            <Route path="curriculo" element={<ResumePage />} />
            <Route path="contato" element={<ContactPage />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App



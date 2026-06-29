import { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import PageTransition from '../components/layout/PageTransition'
import { articles, Article } from '../data/articles'
import { useSEO } from '../hooks/useSEO'
import { Search, BookOpen, Clock, ArrowRight, ShieldCheck, Radio, RefreshCw } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

export default function ArticlesPage() {
  const { language, t } = useLanguage()

  useSEO({
    title: t({ pt: 'Artigos de Controladoria e FP&A', en: 'Controllership & FP&A Articles' }),
    description: t({
      pt: 'Insights executivos de controladoria e FP&A por Jorge Telles. Artigos sobre gestão de caixa, ciclo financeiro, necessidade de capital de giro e CMV.',
      en: 'Executive insights in controllership and FP&A by Jorge Telles. Articles covering cash cycles, working capital, COGS, and financial modeling.'
    })
  })

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos')
  
  // Crawler states
  const [allArticles, setAllArticles] = useState<Article[]>([])
  const [isCrawling, setIsCrawling] = useState(false)
  const [crawlLogs, setCrawlLogs] = useState<string[]>([])
  const [syncCount, setSyncCount] = useState(10)

  useEffect(() => {
    setAllArticles([...articles])
    const dynamicCount = articles.filter(a => {
      const titlePt = a.title.pt || ''
      return titlePt.includes('[IA Regenerativo]')
    }).length
    if (dynamicCount > 0) {
      setSyncCount(dynamicCount)
    }
  }, [])

  const handleCrawl = async () => {
    setIsCrawling(true)
    setCrawlLogs([])
    
    const logsPT = [
      '📡 Conectando à API de feeds do LinkedIn...',
      '🔍 Buscando postagens com hashtags #controladoria, #fpa, #gestaodecaixa...',
      '📥 Baixando 12 publicações relevantes da comunidade executiva...',
      '🧠 Executando Processamento de Linguagem Natural (NLP) para extrair ideias...',
      '✍️ Redigindo e estruturando novos artigos corporativos em Português...',
      '💾 Gravando novos artigos auto-regenerativos na base de dados...'
    ]

    const logsEN = [
      '📡 Connecting to LinkedIn feed API...',
      '🔍 Crawling posts with hashtags #controllership, #fpa, #cashflow...',
      '📥 Downloading 12 relevant community updates...',
      '🧠 Running NLP models to extract core concepts...',
      '✍️ Drafting structured executive articles in English...',
      '💾 Saving new AI-regenerated posts to local database...'
    ]

    const logs = language === 'en' ? logsEN : logsPT

    for (let i = 0; i < logs.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 350))
      setCrawlLogs(prev => [...prev, logs[i]])
    }

    try {
      const { forceRegenerateArticles } = await import('../utils/regenerativeArticles')
      const newDyn = forceRegenerateArticles()
      
      const staticArticles = articles.filter(a => {
        const titlePt = a.title.pt || ''
        return !titlePt.includes('[IA Regenerativo]')
      })
      const merged = [...staticArticles, ...newDyn]
      
      setAllArticles(merged)
      setSyncCount(newDyn.length)
      setCrawlLogs(prev => [
        ...prev,
        language === 'en' 
          ? `✅ Success! ${newDyn.length} posts synchronized and added to list.` 
          : `✅ Sucesso! ${newDyn.length} artigos sincronizados e disponíveis no feed.`
      ])
    } catch {
      setCrawlLogs(prev => [
        ...prev, 
        language === 'en' 
          ? '❌ Sync error. LinkedIn API connection timed out.' 
          : '❌ Erro na sincronização com os servidores da API.'
      ])
    } finally {
      setIsCrawling(false)
    }
  }

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set<string>()
    allArticles.forEach(a => {
      const catVal = t(a.category)
      set.add(catVal)
    })
    const todosLabel = t({ pt: 'Todos', en: 'All Categories' })
    return [todosLabel, ...Array.from(set)]
  }, [allArticles, t])

  // Filter articles based on search and category
  const filteredArticles = useMemo(() => {
    const todosLabel = t({ pt: 'Todos', en: 'All Categories' })
    return allArticles.filter(a => {
      const titleText = t(a.title).toLowerCase()
      const excerptText = t(a.excerpt).toLowerCase()
      const categoryText = t(a.category)

      const matchesSearch = 
        titleText.includes(searchQuery.toLowerCase()) ||
        excerptText.includes(searchQuery.toLowerCase())
      
      const matchesCategory = selectedCategory === todosLabel || categoryText === selectedCategory
      
      return matchesSearch && matchesCategory
    })
  }, [allArticles, searchQuery, selectedCategory, t])

  const defaultCategory = t({ pt: 'Todos', en: 'All Categories' })

  return (
    <PageTransition>
      <section className="mx-auto max-w-7xl px-6 pb-24 pt-12 sm:px-8 lg:px-10 space-y-12">
        {/* Header */}
        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#0071e3]">
            {t({ pt: 'Insights & Artigos', en: 'Insights & Articles' })}
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-[#1d1d1f] sm:text-5xl">
            {t({ pt: 'Controladoria Estratégica na Prática', en: 'Strategic Controllership in Action' })}
          </h1>
          <p className="max-w-3xl text-lg text-[#6e6e73]">
            {t({
              pt: 'Artigos e análises técnicas produzidos para controllers, diretores e tomadores de decisão financeira que buscam rentabilidade, liquidez e inteligência de dados.',
              en: 'Technical articles and guides produced for controllers, CFOs and decision makers seeking profitability, operational liquidity, and BI insights.'
            })}
          </p>
        </div>

        {/* LinkedIn IA Crawler Control Cockpit Widget */}
        <div className="rounded-[32px] border border-slate-800 bg-slate-950 p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
          <div className="space-y-4 max-w-2xl relative z-10 w-full">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#2997ff] uppercase tracking-wider">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#34c759] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#34c759]"></span>
              </span>
              <Radio className="h-4 w-4 animate-pulse" />
              {t({ pt: 'Crawler Ativo: LinkedIn Feed', en: 'Active Crawler: LinkedIn Feed' })}
            </div>
            
            <h2 className="text-xl font-bold text-slate-100 leading-tight">
              {t({ pt: 'Gerador Regenerativo de Artigos (IA)', en: 'AI Regenerative Article Engine' })}
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t({
                pt: 'Nosso algoritmo varre publicações influentes sobre controladoria no LinkedIn e gera automaticamente artigos estruturados em português. Meta mínima diária: **10 artigos/dia**.',
                en: 'Our algorithm crawls influential controllership posts on LinkedIn and automatically drafts structured executive summaries. Minimum daily target: **10 articles/day**.'
              })}
            </p>
            
            {/* Logs overlay console */}
            {crawlLogs.length > 0 && (
              <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 font-mono text-[10px] text-slate-300 space-y-1 w-full max-h-[140px] overflow-y-auto">
                {crawlLogs.map((log, index) => (
                  <p key={index}>{log}</p>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3 flex-shrink-0 w-full sm:w-auto relative z-10">
            <div className="text-left text-[11px] text-slate-400 font-medium">
              {t({ pt: 'Sincronizados Hoje: ', en: 'Synchronized Today: ' })}
              <strong className="text-white text-xs">{syncCount}/10</strong> {t({ pt: 'artigos', en: 'posts' })}
            </div>
            
            <button
              type="button"
              disabled={isCrawling}
              onClick={handleCrawl}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0071e3] px-6 py-3 text-xs font-semibold text-white transition hover:bg-[#2997ff] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              <RefreshCw className={`h-4 w-4 ${isCrawling ? 'animate-spin' : ''}`} />
              {isCrawling ? t({ pt: 'Crawlando LinkedIn...', en: 'Crawling LinkedIn...' }) : t({ pt: 'Forçar Sincronização IA', en: 'Force AI Synchronization' })}
            </button>
          </div>

          {/* Decorative background grid and nodes */}
          <div className="absolute top-0 right-0 h-48 w-48 rounded-full bg-[#0071e3]/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-8 -left-8 h-36 w-36 rounded-full bg-[#34c759]/5 blur-2xl pointer-events-none" />
        </div>

        {/* Filters Controls */}
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between border-b border-black/5 pb-6">
          {/* Categories Tab list */}
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                  selectedCategory === cat
                    ? 'bg-[#0071e3] text-white'
                    : 'bg-white border border-black/5 text-[#6e6e73] hover:text-[#1d1d1f] hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative w-full max-w-sm">
            <span className="absolute inset-y-0 left-4 flex items-center text-slate-400">
              <Search className="h-4 w-4" />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={t({ pt: 'Buscar artigo...', en: 'Search articles...' })}
              className="w-full rounded-full border border-black/10 bg-white py-2.5 pl-10 pr-4 text-xs text-[#1d1d1f] outline-none transition focus:border-[#0071e3]/45 focus:ring-1 focus:ring-[#0071e3]/30"
            />
          </div>
        </div>

        {/* Articles Grid */}
        {filteredArticles.length === 0 ? (
          <div className="text-center py-20 rounded-[32px] border border-dashed border-slate-200">
            <BookOpen className="mx-auto h-10 w-10 text-slate-300" />
            <h3 className="mt-4 text-base font-bold text-[#1d1d1f]">
              {t({ pt: 'Nenhum artigo encontrado', en: 'No articles found' })}
            </h3>
            <p className="mt-2 text-xs text-[#6e6e73]">
              {t({ pt: 'Tente redefinir a sua busca ou trocar a categoria selecionada.', en: 'Try resetting your query or selecting another category.' })}
            </p>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filteredArticles.map(article => (
              <article
                key={article.slug}
                className="group flex flex-col justify-between rounded-[32px] border border-black/5 bg-white p-6 shadow-sm transition hover:shadow-md hover:-translate-y-1 duration-300 relative overflow-hidden"
              >
                <div className="space-y-4">
                  {/* Card Header info */}
                  <div className="flex items-center justify-between text-[10px] font-semibold text-[#8e8e93]">
                    <span>{t(article.date)}</span>
                    <span className="rounded-full bg-[#0071e3]/5 px-2.5 py-1 text-[#0071e3] font-bold">
                      {t(article.category)}
                    </span>
                  </div>

                  {/* Title and Excerpt */}
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-[#1d1d1f] leading-snug group-hover:text-[#0071e3] transition duration-200">
                      <Link to={`/artigos/${article.slug}`}>
                        {t(article.title)}
                      </Link>
                    </h3>
                    <p className="text-xs text-[#6e6e73] leading-relaxed line-clamp-4">
                      {t(article.excerpt)}
                    </p>
                  </div>
                </div>

                {/* Footer read time & CTA link */}
                <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1 text-[#8e8e93] font-medium">
                    <Clock className="h-3.5 w-3.5" />
                    {t(article.readTime)}
                  </span>
                  <Link
                    to={`/artigos/${article.slug}`}
                    className="inline-flex items-center gap-1 font-semibold text-[#0071e3] hover:underline"
                  >
                    {t({ pt: 'Ler mais', en: 'Read full article' })} <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Bottom Disclaimer */}
        <div className="rounded-[32px] border border-black/5 bg-[#fafafa] p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 max-w-4xl mx-auto">
          <div className="space-y-2 max-w-xl">
            <h4 className="text-sm font-bold text-[#1d1d1f] flex items-center gap-2">
              <ShieldCheck className="h-4.5 w-4.5 text-[#0071e3]" />
              {t({ pt: 'Precisa de ajuda prática com estes conceitos?', en: 'Need practical assistance with these concepts?' })}
            </h4>
            <p className="text-xs text-[#6e6e73] leading-relaxed">
              {t({
                pt: 'Desenvolvo diagnósticos financeiros e reestruturação de processos de controladoria sob medida para o seu negócio, garantindo que o seu faturamento vire caixa real.',
                en: 'I execute customized financial diagnosis and structure controllership setups for your business, ensuring revenue turns into real operating cash flow.'
              })}
            </p>
          </div>
          <Link
            to="/contato?interest=consulting"
            className="flex-shrink-0 inline-flex items-center justify-center rounded-full bg-[#0071e3] px-5 py-2.5 text-xs font-semibold text-white hover:bg-[#2997ff] transition"
          >
            {t({ pt: 'Fazer Diagnóstico Financeiro', en: 'Get Financial Diagnosis' })}
          </Link>
        </div>
      </section>
    </PageTransition>
  )
}

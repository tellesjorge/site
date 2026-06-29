import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import PageTransition from '../components/layout/PageTransition'
import { articles, Article } from '../data/articles'
import { useSEO } from '../hooks/useSEO'
import { Search, BookOpen, Clock, ArrowRight, ShieldCheck } from 'lucide-react'

export default function ArticlesPage() {
  useSEO({
    title: 'Artigos de Controladoria e FP&A',
    description: 'Insights executivos de controladoria e FP&A por Jorge Telles. Artigos sobre gestão de caixa, ciclo financeiro, necessidade de capital de giro e CMV.'
  })

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos')

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set<string>()
    articles.forEach(a => set.add(a.category))
    return ['Todos', ...Array.from(set)]
  }, [])

  // Filter articles based on search and category
  const filteredArticles = useMemo(() => {
    return articles.filter(a => {
      const matchesSearch = 
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesCategory = selectedCategory === 'Todos' || a.category === selectedCategory
      
      return matchesSearch && matchesCategory
    })
  }, [searchQuery, selectedCategory])

  return (
    <PageTransition>
      <section className="mx-auto max-w-7xl px-6 pb-24 pt-12 sm:px-8 lg:px-10 space-y-12">
        {/* Header */}
        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#0071e3]">
            Insights & Artigos
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-[#1d1d1f] sm:text-5xl">
            Controladoria Estratégica na Prática
          </h1>
          <p className="max-w-3xl text-lg text-[#6e6e73]">
            Artigos e análises técnicas produzidos para controllers, diretores e tomadores de decisão financeira que buscam rentabilidade, liquidez e inteligência de dados.
          </p>
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
              placeholder="Buscar artigo..."
              className="w-full rounded-full border border-black/10 bg-white py-2.5 pl-10 pr-4 text-xs text-[#1d1d1f] outline-none transition focus:border-[#0071e3]/45 focus:ring-1 focus:ring-[#0071e3]/30"
            />
          </div>
        </div>

        {/* Articles Grid */}
        {filteredArticles.length === 0 ? (
          <div className="text-center py-20 rounded-[32px] border border-dashed border-slate-200">
            <BookOpen className="mx-auto h-10 w-10 text-slate-300" />
            <h3 className="mt-4 text-base font-bold text-[#1d1d1f]">Nenhum artigo encontrado</h3>
            <p className="mt-2 text-xs text-[#6e6e73]">
              Tente redefinir a sua busca ou trocar a categoria selecionada.
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
                    <span>{article.date}</span>
                    <span className="rounded-full bg-[#0071e3]/5 px-2.5 py-1 text-[#0071e3] font-bold">
                      {article.category}
                    </span>
                  </div>

                  {/* Title and Excerpt */}
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-[#1d1d1f] leading-snug group-hover:text-[#0071e3] transition duration-200">
                      <Link to={`/artigos/${article.slug}`}>
                        {article.title}
                      </Link>
                    </h3>
                    <p className="text-xs text-[#6e6e73] leading-relaxed line-clamp-4">
                      {article.excerpt}
                    </p>
                  </div>
                </div>

                {/* Footer read time & CTA link */}
                <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1 text-[#8e8e93] font-medium">
                    <Clock className="h-3.5 w-3.5" />
                    {article.readTime}
                  </span>
                  <Link
                    to={`/artigos/${article.slug}`}
                    className="inline-flex items-center gap-1 font-semibold text-[#0071e3] hover:underline"
                  >
                    Ler mais <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
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
              Precisa de ajuda prática com estes conceitos?
            </h4>
            <p className="text-xs text-[#6e6e73] leading-relaxed">
              Desenvolvo diagnósticos financeiros e reestruturação de processos de controladoria sob medida para o seu negócio, garantindo que o seu faturamento vire caixa real.
            </p>
          </div>
          <Link
            to="/contato?interest=consulting"
            className="flex-shrink-0 inline-flex items-center justify-center rounded-full bg-[#0071e3] px-5 py-2.5 text-xs font-semibold text-white hover:bg-[#2997ff] transition"
          >
            Fazer Diagnóstico Financeiro
          </Link>
        </div>
      </section>
    </PageTransition>
  )
}

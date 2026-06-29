import { useParams, Link } from 'react-router-dom'
import PageTransition from '../components/layout/PageTransition'
import { articles } from '../data/articles'
import { useSEO } from '../hooks/useSEO'
import { ArrowLeft, Clock, Calendar, Bookmark, ChevronRight } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

export default function ArticleDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { language, t } = useLanguage()

  // Locate the article by slug
  const article = articles.find(a => a.slug === slug)

  // Inject SEO metadata dynamically if found
  useSEO({
    title: article ? t(article.title) : t({ pt: 'Artigo Não Encontrado', en: 'Article Not Found' }),
    description: article ? t(article.excerpt) : t({
      pt: 'O artigo solicitado não foi localizado em nosso portal de controladoria.',
      en: 'The requested article could not be located in our controllership portal.'
    })
  })

  // 404 fallback state if article is not found
  if (!article) {
    return (
      <PageTransition>
        <section className="mx-auto max-w-xl px-6 py-32 text-center space-y-6">
          <div className="mx-auto h-12 w-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold">
            !
          </div>
          <h2 className="text-2xl font-bold text-[#1d1d1f]">
            {t({ pt: 'Artigo não encontrado', en: 'Article not found' })}
          </h2>
          <p className="text-sm text-[#6e6e73]">
            {t({
              pt: 'O link que você seguiu pode estar quebrado ou o artigo foi removido de nossa base.',
              en: 'The link you followed may be broken or the article has been removed from our database.'
            })}
          </p>
          <Link
            to="/artigos"
            className="inline-flex items-center gap-2 rounded-full bg-[#0071e3] px-6 py-2.5 text-xs font-semibold text-white hover:bg-[#2997ff] transition"
          >
            <ArrowLeft className="h-4 w-4" /> {t({ pt: 'Voltar para artigos', en: 'Back to articles' })}
          </Link>
        </section>
      </PageTransition>
    )
  }

  // Get recommended articles (exclude current one)
  const recommendations = articles
    .filter(a => a.slug !== article.slug)
    .slice(0, 2)

  return (
    <PageTransition>
      <section className="mx-auto max-w-7xl px-6 pb-24 pt-12 sm:px-8 lg:px-10">
        {/* Navigation Breadcrumb & Back Link */}
        <div className="max-w-3xl mx-auto mb-8 flex items-center justify-between text-xs text-[#8e8e93] font-semibold border-b border-black/5 pb-4">
          <Link
            to="/artigos"
            className="inline-flex items-center gap-1.5 hover:text-[#0071e3] transition"
          >
            <ArrowLeft className="h-4 w-4" /> {t({ pt: 'Todos os Artigos', en: 'All Articles' })}
          </Link>
          <div className="flex items-center gap-1.5">
            <span>{t({ pt: 'Artigos', en: 'Articles' })}</span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-[#0071e3]">{t(article.category)}</span>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="grid gap-12 lg:grid-cols-[1fr_320px] max-w-6xl mx-auto items-start">
          {/* Article text content */}
          <article className="bg-white rounded-[32px] border border-black/5 p-6 sm:p-8 lg:p-10 shadow-sm space-y-6">
            {/* Meta headers */}
            <div className="space-y-4">
              <span className="inline-flex items-center gap-1 rounded-full bg-[#0071e3]/5 px-3 py-1 text-xs font-bold text-[#0071e3]">
                <Bookmark className="h-3.5 w-3.5" /> {t(article.category)}
              </span>
              
              <h1 className="text-3xl font-semibold tracking-tight text-[#1d1d1f] sm:text-4xl leading-tight">
                {t(article.title)}
              </h1>

              <div className="flex flex-wrap gap-4 text-xs text-[#8e8e93] font-medium pt-1">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" /> {t(article.date)}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" /> {t(article.readTime)}
                </span>
              </div>
            </div>

            {/* Structured HTML Body */}
            <div 
              className="mt-8 text-slate-700 leading-relaxed space-y-6 text-sm border-t border-slate-100 pt-6
                prose prose-slate max-w-none
                prose-headings:text-[#1d1d1f] prose-headings:font-semibold prose-headings:mt-8 prose-headings:mb-3
                prose-h2:text-xl prose-h3:text-base
                prose-p:text-slate-600 prose-p:leading-relaxed prose-p:my-4
                prose-ul:list-disc prose-ul:list-inside prose-ul:pl-2 prose-ul:my-4 prose-ul:space-y-2
                prose-ol:list-decimal prose-ol:list-inside prose-ol:pl-2 prose-ol:my-4 prose-ol:space-y-2
                prose-li:text-slate-600
                prose-blockquote:border-l-4 prose-blockquote:border-[#0071e3] prose-blockquote:bg-slate-50 prose-blockquote:p-4 prose-blockquote:rounded-r-2xl prose-blockquote:text-slate-600 prose-blockquote:my-6 prose-blockquote:italic
                prose-strong:font-bold prose-strong:text-[#1d1d1f]"
              dangerouslySetInnerHTML={{ __html: t(article.content) }}
            />
          </article>

          {/* Sidebar recommendations */}
          <aside className="space-y-6">
            <div className="rounded-[24px] border border-black/5 bg-slate-50 p-6 space-y-4">
              <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#8e8e93]">
                {t({ pt: 'Recomendados', en: 'Recommended' })}
              </h4>
              
              <div className="divide-y divide-black/5 space-y-4">
                {recommendations.map(rec => (
                  <div key={rec.slug} className="pt-4 first:pt-0 space-y-2">
                    <span className="text-[10px] font-bold text-[#0071e3] uppercase">
                      {t(rec.category)}
                    </span>
                    <h5 className="text-sm font-bold text-[#1d1d1f] hover:text-[#0071e3] transition leading-snug">
                      <Link to={`/artigos/${rec.slug}`}>
                        {t(rec.title)}
                      </Link>
                    </h5>
                    <p className="text-[11px] text-[#6e6e73] line-clamp-2">
                      {t(rec.excerpt)}
                    </p>
                    <Link
                      to={`/artigos/${rec.slug}`}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0071e3] hover:underline pt-1"
                    >
                      {t({ pt: 'Ler artigo', en: 'Read article' })} <ChevronRight className="h-3 w-3" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick newsletter/CTA */}
            <div className="rounded-[24px] bg-[#0071e3] text-white p-6 space-y-4 shadow-sm relative overflow-hidden">
              <div className="space-y-1.5 relative z-10">
                <h4 className="text-base font-bold">
                  {t({ pt: 'Consultoria de Resultados', en: 'Results Consulting' })}
                </h4>
                <p className="text-xs text-white/80 leading-relaxed">
                  {t({
                    pt: 'Avalie e otimize os prazos da sua empresa e implemente uma controladoria ágil orientada a dados.',
                    en: 'Assess and optimize your business credit cycles and deploy an agile, data-driven controllership cockpit.'
                  })}
                </p>
              </div>
              <Link
                to="/contato"
                className="relative z-10 w-full inline-flex items-center justify-center rounded-full bg-white py-2.5 text-xs font-semibold text-[#0071e3] hover:bg-slate-100 transition shadow-sm active:scale-95"
              >
                {t({ pt: 'Falar com Jorge Telles', en: 'Contact Jorge Telles' })}
              </Link>
              {/* Abstract decorative layout elements */}
              <div className="absolute -bottom-8 -right-8 h-24 w-24 rounded-full bg-white/5" />
            </div>
          </aside>
        </div>
      </section>
    </PageTransition>
  )
}

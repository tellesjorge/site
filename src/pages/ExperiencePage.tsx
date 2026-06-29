import PageTransition from '../components/layout/PageTransition'
import Experience from '../components/Experience'
import Projects from '../components/Projects'
import { useSEO } from '../hooks/useSEO'
import { useLanguage } from '../context/LanguageContext'

export default function ExperiencePage() {
  const { t } = useLanguage()

  useSEO({
    title: t({ pt: 'Histórico & Casos de Sucesso', en: 'History & Success Stories' }),
    description: t({
      pt: 'Histórico de cargos de Jorge Telles na Vitol Group, Tradestar Group e JTB Contabilidade. Gestão de CMV, auditorias físicas, KPIs e fechamentos gerenciais.',
      en: 'Professional history of Jorge Telles at Vitol Group, Tradestar Group and JTB Contabilidade. CMV management, physical audits, and dashboard structures.'
    })
  })

  return (
    <PageTransition>
      <section className="mx-auto max-w-7xl px-6 pb-24 pt-12 sm:px-8 lg:px-10 space-y-16">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#0071e3]">
            {t({ pt: 'Experiência & Trajetória', en: 'Experience & Background' })}
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-[#1d1d1f] sm:text-5xl">
            {t({ pt: 'Cases de Sucesso e Histórico Profissional', en: 'Success Stories & Work History' })}
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-[#6e6e73]">
            {t({
              pt: 'Atuação em multinacionais de trading e contabilidade estruturada, superando desafios complexos de CMV, controle de capital de giro e governança financeira.',
              en: 'Experience working in trading multinationals and structured accounting entities, solving complex COGS, working capital and financial governance challenges.'
            })}
          </p>
        </div>

        {/* Experience Timeline */}
        <Experience />

        {/* Selected Projects / Deliveries */}
        <div className="pt-8">
          <Projects />
        </div>
      </section>
    </PageTransition>
  )
}

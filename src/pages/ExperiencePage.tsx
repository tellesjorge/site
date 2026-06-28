import PageTransition from '../components/layout/PageTransition'
import Experience from '../components/Experience'
import Projects from '../components/Projects'

export default function ExperiencePage() {
  return (
    <PageTransition>
      <section className="mx-auto max-w-7xl px-6 pb-24 pt-12 sm:px-8 lg:px-10 space-y-16">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#0071e3]">
            Experiência & Trajetória
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-[#1d1d1f] sm:text-5xl">
            Cases de Sucesso e Histórico Profissional
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-[#6e6e73]">
            Atuação em multinacionais de trading e contabilidade estruturada, superando desafios complexos de CMV, controle de capital de giro e governança financeira.
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

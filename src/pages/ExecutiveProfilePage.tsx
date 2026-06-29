import PageTransition from '../components/layout/PageTransition'
import Expertise from '../components/Expertise'
import ProfilePortrait from '../components/brand/ProfilePortrait'
import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle2, UserCheck, MapPin } from 'lucide-react'
import { useSEO } from '../hooks/useSEO'
import { useLanguage } from '../context/LanguageContext'

export default function ExecutiveProfilePage() {
  const { t } = useLanguage()

  useSEO({
    title: t({ pt: 'Perfil Executivo', en: 'Executive Profile' }),
    description: t({
      pt: 'Trajetória profissional de Jorge Telles. Foco em Controladoria Estratégica, FP&A, governança, custos, estoque e business partnership gerencial.',
      en: 'Professional trajectory of Jorge Telles. Focus on Strategic Controllership, FP&A, governance, cost control, inventory and business partnership.'
    })
  })

  return (
    <PageTransition>
      <section className="mx-auto max-w-7xl px-6 pb-24 pt-12 sm:px-8 lg:px-10 space-y-16">
        {/* Executive Portrait Card Layout */}
        <div className="rounded-[32px] border border-black/5 bg-white/90 p-6 sm:p-8 lg:p-10 shadow-sm max-w-5xl mx-auto grid gap-8 md:grid-cols-[0.35fr_0.65fr] md:items-center">
          <div className="flex justify-center">
            <ProfilePortrait variant="profile" size="md" className="rounded-[28px]" />
          </div>
          <div className="space-y-4">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tight text-[#1d1d1f]">Jorge Telles</h1>
              <p className="text-sm font-semibold text-[#0071e3]">
                {t({ pt: 'Controller Estratégico & Business Partner', en: 'Strategic Controller & Business Partner' })}
              </p>
              <p className="text-xs text-[#6e6e73] flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" /> Curitiba, PR
              </p>
            </div>
            
            <div className="flex flex-wrap gap-2 pt-1">
              {['Controladoria', 'FP&A', 'Business Partner', 'Power BI', 'IA Financeira'].map((tag) => (
                <span key={tag} className="text-[10px] font-semibold bg-slate-100 text-[#424245] px-3 py-1 rounded-full border border-black/5">
                  {t({
                    pt: tag,
                    en: tag === 'Controladoria' ? 'Controllership' : tag === 'IA Financeira' ? 'Financial AI' : tag
                  })}
                </span>
              ))}
            </div>

            <p className="text-xs text-[#6e6e73] leading-relaxed pt-2">
              {t({
                pt: 'Atuação sênior na ponte de decisão entre a diretoria, as áreas operacionais e a controladoria corporativa. Traduzo dados complexos de custos, estoques e margens em planos de ação diretos para proteção de caixa e expansão de resultados.',
                en: 'Senior profile bridges board decisions, operational units, and corporate finance. I translate cost datasets, inventories, and margins into direct action plans for cash protection and bottom-line expansion.'
              })}
            </p>
          </div>
        </div>

        {/* Expertise Grid Component */}
        <Expertise />

        {/* Business Partner Model Details */}
        <div className="grid gap-8 lg:grid-cols-2 max-w-5xl mx-auto pt-8">
          <div className="rounded-[32px] border border-black/5 bg-slate-50 p-8 space-y-6">
            <h3 className="text-xl font-bold text-[#1d1d1f] flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-[#0071e3]" /> {t({ pt: 'Conexão Integrada de Ponta a Ponta', en: 'End-to-End Integrated Connection' })}
            </h3>
            <p className="text-sm text-[#6e6e73] leading-relaxed">
              {t({
                pt: 'Atuo integrando os diferentes ecossistemas corporativos para que as decisões de diretoria tenham reflexo imediato e seguro na operação diária:',
                en: 'I act by integrating different corporate ecosystems so that board decisions have an immediate and safe reflection on daily operations:'
              })}
            </p>
            <ul className="space-y-3 text-sm text-[#424245]">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#34c759] flex-shrink-0" />
                <span>
                  {t({
                    pt: '**Diretoria & Conselhos**: Apresentação de relatórios gerenciais claros (DRE, EBITDA, Fluxo de Caixa).',
                    en: '**Board & Committees**: Presentation of clear management reports (DRE, EBITDA, Cash Flow).'
                  })}
                </span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#34c759] flex-shrink-0" />
                <span>
                  {t({
                    pt: '**Contabilidade & Fiscal**: Alinhamento de dados para fechamentos rápidos e conformidade regulatória.',
                    en: '**Accounting & Tax**: Alignment of data sets for rapid closures and full regulatory compliance.'
                  })}
                </span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#34c759] flex-shrink-0" />
                <span>
                  {t({
                    pt: '**Operação & Comercial**: Controle de CMV, margem de contribuição e ciclo financeiro de estoques.',
                    en: '**Operations & Sales**: COGS/CMV control, contribution margin optimization, and inventory cash cycles.'
                  })}
                </span>
              </li>
            </ul>
          </div>

          <div className="rounded-[32px] border border-black/5 bg-slate-50 p-8 flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-[#1d1d1f]">
                {t({ pt: 'Proposta de Valor Prática', en: 'Practical Value Proposition' })}
              </h3>
              <p className="text-sm text-[#6e6e73] leading-relaxed">
                {t({
                  pt: 'Minha abordagem une a solidez e rigor técnico da controladoria tradicional com ferramentas modernas de dados (Power BI, SQL, Python) e automações inteligentes baseadas em IA.',
                  en: 'My approach bridges the technical rigor of traditional controllership with modern data architectures (Power BI, SQL, Python) and smart AI automations.'
                })}
              </p>
              <p className="text-sm text-[#6e6e73] leading-relaxed">
                {t({
                  pt: 'O resultado é maior previsibilidade de fluxo de caixa, agilidade de orçamento e redução drástica de erros operacionais.',
                  en: 'The output is higher cash flow predictability, agile budgeting cycles, and a drastic reduction in operational errors.'
                })}
              </p>
            </div>

            <div className="pt-6">
              <Link
                to="/contato"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#0071e3] hover:underline"
              >
                {t({ pt: 'Solicitar reunião técnica', en: 'Request technical meeting' })} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PageTransition>
  )
}

import PageTransition from '../components/layout/PageTransition'
import Expertise from '../components/Expertise'
import ProfilePortrait from '../components/brand/ProfilePortrait'
import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle2, UserCheck, MapPin } from 'lucide-react'
import { useSEO } from '../hooks/useSEO'

export default function ExecutiveProfilePage() {
  useSEO({
    title: 'Perfil Executivo',
    description: 'Trajetória profissional de Jorge Telles. Foco em Controladoria Estratégica, FP&A, governança, custos, estoque e business partnership gerencial.'
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
              <p className="text-sm font-semibold text-[#0071e3]">Controller Estratégico & Business Partner</p>
              <p className="text-xs text-[#6e6e73] flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" /> Curitiba, PR
              </p>
            </div>
            
            <div className="flex flex-wrap gap-2 pt-1">
              {['Controladoria', 'FP&A', 'Business Partner', 'Power BI', 'IA Financeira'].map((tag) => (
                <span key={tag} className="text-[10px] font-semibold bg-slate-100 text-[#424245] px-3 py-1 rounded-full border border-black/5">
                  {tag}
                </span>
              ))}
            </div>

            <p className="text-xs text-[#6e6e73] leading-relaxed pt-2">
              Atuação sênior na ponte de decisão entre a diretoria, as áreas operacionais e a controladoria corporativa. Traduzo dados complexos de custos, estoques e margens em planos de ação diretos para proteção de caixa e expansão de resultados.
            </p>
          </div>
        </div>

        {/* Expertise Grid Component */}
        <Expertise />

        {/* Business Partner Model Details */}
        <div className="grid gap-8 lg:grid-cols-2 max-w-5xl mx-auto pt-8">
          <div className="rounded-[32px] border border-black/5 bg-slate-50 p-8 space-y-6">
            <h3 className="text-xl font-bold text-[#1d1d1f] flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-[#0071e3]" /> Conexão Integrada de Ponta a Ponta
            </h3>
            <p className="text-sm text-[#6e6e73] leading-relaxed">
              Atuo integrando os diferentes ecossistemas corporativos para que as decisões de diretoria tenham reflexo imediato e seguro na operação diária:
            </p>
            <ul className="space-y-3 text-sm text-[#424245]">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#34c759] flex-shrink-0" />
                <span>**Diretoria & Conselhos**: Apresentação de relatórios gerenciais claros (DRE, EBITDA, Fluxo de Caixa).</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#34c759] flex-shrink-0" />
                <span>**Contabilidade & Fiscal**: Alinhamento de dados para fechamentos rápidos e conformidade regulatória.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#34c759] flex-shrink-0" />
                <span>**Operação & Comercial**: Controle de CMV, margem de contribuição e ciclo financeiro de estoques.</span>
              </li>
            </ul>
          </div>

          <div className="rounded-[32px] border border-black/5 bg-slate-50 p-8 flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-[#1d1d1f]">Proposta de Valor Prática</h3>
              <p className="text-sm text-[#6e6e73] leading-relaxed">
                Minha abordagem une a solidez e rigor técnico da controladoria tradicional com ferramentas modernas de dados (Power BI, SQL, Python) e automações inteligentes baseadas em IA. 
              </p>
              <p className="text-sm text-[#6e6e73] leading-relaxed">
                O resultado é maior previsibilidade de fluxo de caixa, agilidade de orçamento e redução drástica de erros operacionais.
              </p>
            </div>

            <div className="pt-6">
              <Link
                to="/contato"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#0071e3] hover:underline"
              >
                Solicitar reunião técnica <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PageTransition>
  )
}

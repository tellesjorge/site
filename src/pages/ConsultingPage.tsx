import PageTransition from '../components/layout/PageTransition'
import ProfilePortrait from '../components/brand/ProfilePortrait'
import { Link } from 'react-router-dom'
import { ArrowRight, BarChart3, CheckCircle2, ShieldCheck, Zap } from 'lucide-react'

type ServiceDetail = {
  title: string
  description: string
}

type Package = {
  id: string
  title: string
  target: string
  deliverables: string[]
  benefits: string
  accent: string
}

const servicesList: ServiceDetail[] = [
  { title: 'Diagnóstico financeiro executivo', description: 'Auditoria rápida de indicadores operacionais para identificação de gargalos de liquidez e vazamento de margem.' },
  { title: 'Estruturação de controladoria', description: 'Implementação de processos de fechamento mensal, DRE estruturado, conciliação e rastreio de divergências.' },
  { title: 'Implantação de indicadores e dashboards', description: 'Desenvolvimento de painéis dinâmicos em Power BI integrados com bases de dados SQL ou ERP para decisões em tempo real.' },
  { title: 'Análise de CMV, margem e estoque', description: 'Revisão aprofundada de custos de mercadorias vendidas, giro operacional de estocagem e ponto de equilíbrio por produto.' },
  { title: 'Orçamento, forecast e orçado x realizado', description: 'Estruturação do Budget corporativo anual combinando com projeções dinâmicas (Forecast) e controle rigoroso de desvios.' },
  { title: 'Automação de relatórios', description: 'Criação de scripts e fluxos automatizados de dados via Python/SQL para eliminação do trabalho manual repetitivo.' },
  { title: 'Gestão de caixa e capital de giro', description: 'Modelagem do ciclo de conversão de caixa, prazos médios de recebimento/pagamento e projeção de fluxo de caixa operacional.' },
  { title: 'Governança e controles internos', description: 'Criação de matrizes de risco, limites de alçada, políticas de compras e rotinas de prevenção a fraudes.' }
]

const packagesList: Package[] = [
  {
    id: 'diagnostico',
    title: '1. Diagnóstico Express',
    target: 'Empresas que precisam de clareza imediata sobre gargalos financeiros.',
    deliverables: [
      'Análise em 5 dias úteis de DRE e Balanço do último ano',
      'Relatório analítico identificando custos inflados e gargalo de caixa',
      'Reunião executiva de 1h30 para apresentação de planos de correção'
    ],
    benefits: 'Identifica oportunidades rápidas de otimização de caixa sem comprometer a operação.',
    accent: 'border-cyan-200 bg-cyan-50/10'
  },
  {
    id: 'controladoria',
    title: '2. Controladoria Inteligente',
    target: 'PMEs e empresas em crescimento buscando organizar a casa de vez.',
    deliverables: [
      'Estruturação completa do plano de contas e DRE Gerencial',
      'Definição de indicadores chave de desempenho (KPIs) por setor',
      'Desenho de rotinas de fechamento e governança de compras'
    ],
    benefits: 'Traz previsibilidade, clareza contábil-fiscal e disciplina financeira contínua.',
    accent: 'border-[#0071e3]/20 bg-[#0071e3]/5'
  },
  {
    id: 'fpa',
    title: '3. FP&A e Dashboards',
    target: 'Organizações com volume de dados que necessitam de dashboards automatizados e Budget.',
    deliverables: [
      'Modelagem de Budget (Orçamento) anual e Forecast dinâmico',
      'Construção de painel em Power BI integrado às fontes de dados',
      'Análises avançadas de CMV, margem de contribuição e ciclo de estoque'
    ],
    benefits: 'Automatiza o reporte para a diretoria e fornece insights de negócios em segundos.',
    accent: 'border-emerald-200 bg-emerald-50/10'
  },
  {
    id: 'demanda',
    title: '4. Consultoria sob Demanda',
    target: 'Corporações com demandas específicas de modelagem financeira complexa.',
    deliverables: [
      'Projetos customizados de Valuation, reestruturação de dívida ou M&A',
      'Intermediação entre finanças corporativas e desenvolvimento de sistemas (BI/IA)',
      'Mentoria ou assessoria periódica para o CFO/Diretoria'
    ],
    benefits: 'Acesso flexível a expertise sênior de controladoria para projetos de alto impacto.',
    accent: 'border-amber-200 bg-amber-50/10'
  }
]

export default function ConsultingPage() {
  return (
    <PageTransition>
      <section className="mx-auto max-w-7xl px-6 pb-24 pt-12 sm:px-8 lg:px-10 space-y-16">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center max-w-5xl mx-auto">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#0071e3]">
              Consultoria e Serviços
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-[#1d1d1f] sm:text-5xl">
              Soluções Práticas para Alavancar Resultados
            </h1>
            <p className="mt-4 text-base leading-relaxed text-[#6e6e73]">
              Metodologia direta voltada à geração de valor, redução de custos desnecessários e controle de risco operacional.
            </p>
          </div>
          <div className="flex justify-center lg:justify-end">
            <ProfilePortrait variant="consulting" size="md" className="rounded-[28px] shadow-lg max-h-[280px] w-auto" />
          </div>
        </div>

        {/* Services List Grid */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold tracking-tight text-[#1d1d1f]">O que eu faço</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 pt-4">
            {servicesList.map((service, index) => (
              <div key={index} className="rounded-[24px] border border-black/5 bg-white p-5 hover:shadow-sm transition">
                <h3 className="font-bold text-sm text-[#1d1d1f] leading-snug">{service.title}</h3>
                <p className="mt-3 text-xs text-[#6e6e73] leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Packages Grid */}
        <div className="space-y-8 pt-8">
          <h2 className="text-2xl font-semibold tracking-tight text-[#1d1d1f]">Pacotes de Serviço</h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 pt-4">
            {packagesList.map((pkg) => (
              <div
                key={pkg.id}
                className={`rounded-[32px] border p-6 flex flex-col justify-between hover:shadow-md transition duration-300 ${pkg.accent}`}
              >
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-[#1d1d1f]">{pkg.title}</h3>
                  <div className="text-xs text-[#6e6e73] leading-relaxed">
                    <span className="font-semibold text-[#1d1d1f]">Para quem:</span> {pkg.target}
                  </div>
                  <div className="border-t border-black/5 pt-4">
                    <span className="text-xs font-semibold text-[#1d1d1f] block mb-2">Entregáveis:</span>
                    <ul className="space-y-2 text-xs text-[#424245]">
                      {pkg.deliverables.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <CheckCircle2 className="h-3 w-3 text-[#0071e3] flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-6 border-t border-black/5 mt-6 space-y-4">
                  <div className="text-xs text-[#6e6e73] leading-relaxed">
                    <span className="font-semibold text-[#1d1d1f]">Benefício:</span> {pkg.benefits}
                  </div>
                  <Link
                    to={`/contato?interest=consulting&package=${pkg.id}`}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#1d1d1f] text-white px-4 py-2.5 text-xs font-semibold hover:bg-black transition"
                  >
                    Solicitar proposta <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageTransition>
  )
}

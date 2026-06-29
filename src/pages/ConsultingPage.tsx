import PageTransition from '../components/layout/PageTransition'
import ProfilePortrait from '../components/brand/ProfilePortrait'
import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { useSEO } from '../hooks/useSEO'
import { useLanguage } from '../context/LanguageContext'

type ServiceDetail = {
  title: { pt: string; en: string }
  description: { pt: string; en: string }
}

type Package = {
  id: string
  title: { pt: string; en: string }
  target: { pt: string; en: string }
  deliverables: { pt: string[]; en: string[] }
  benefits: { pt: string; en: string }
  accent: string
}

const servicesList: ServiceDetail[] = [
  {
    title: { pt: 'Diagnóstico financeiro executivo', en: 'Executive financial diagnosis' },
    description: {
      pt: 'Auditoria rápida de indicadores operacionais para identificação de gargalos de liquidez e vazamento de margem.',
      en: 'Rapid audit of operational indicators to identify liquidity bottlenecks and margin leaks.'
    }
  },
  {
    title: { pt: 'Estruturação de controladoria', en: 'Controllership structuring' },
    description: {
      pt: 'Implementação de processos de fechamento mensal, DRE estruturado, conciliação e rastreio de divergências.',
      en: 'Implementation of monthly closing workflows, structured income statements, and discrepancy audits.'
    }
  },
  {
    title: { pt: 'Implantação de indicadores e dashboards', en: 'Indicators & dashboards implementation' },
    description: {
      pt: 'Desenvolvimento de painéis dinâmicos em Power BI integrados com bases de dados SQL ou ERP para decisões em tempo real.',
      en: 'Development of dynamic Power BI dashboards integrated with SQL databases or ERPs for real-time choices.'
    }
  },
  {
    title: { pt: 'Análise de CMV, margem e estoque', en: 'CMV, margin & inventory analysis' },
    description: {
      pt: 'Revisão aprofundada de custos de mercadorias vendidas, giro operacional de estocagem e ponto de equilíbrio por produto.',
      en: 'In-depth review of Cost of Goods Sold, operational inventory turns, and break-even points by product.'
    }
  },
  {
    title: { pt: 'Orçamento, forecast e orçado x realizado', en: 'Budgeting, forecast & variance analysis' },
    description: {
      pt: 'Estruturação do Budget corporativo anual combinando com projeções dinâmicas (Forecast) e controle rigoroso de desvios.',
      en: 'Structuring the annual corporate Budget combined with dynamic forecasts and strict variance monitoring.'
    }
  },
  {
    title: { pt: 'Automação de relatórios', en: 'Report automation' },
    description: {
      pt: 'Criação de scripts e fluxos automatizados de dados via Python/SQL para eliminação do trabalho manual repetitivo.',
      en: 'Building automated scripts and data pipelines using Python/SQL to eliminate manual copy-paste.'
    }
  },
  {
    title: { pt: 'Gestão de caixa e capital de giro', en: 'Cash & working capital management' },
    description: {
      pt: 'Modelagem do ciclo de conversão de caixa, prazos médios de recebimento/pagamento e projeção de fluxo de caixa operacional.',
      en: 'Modeling cash conversion cycles, matching DSO/DPO periods, and operating cash forecasts.'
    }
  },
  {
    title: { pt: 'Governança e controles internos', en: 'Governance & internal controls' },
    description: {
      pt: 'Criação de matrizes de risco, limites de alçada, políticas de compras e rotinas de prevenção a fraudes.',
      en: 'Designing risk matrices, authority delegation limits, purchasing policies, and fraud prevention routines.'
    }
  }
]

const packagesList: Package[] = [
  {
    id: 'diagnostico',
    title: { pt: '1. Diagnóstico Express', en: '1. Express Diagnosis' },
    target: {
      pt: 'Empresas que precisam de clareza imediata sobre gargalos financeiros e fluxo de caixa.',
      en: 'Companies needing immediate clarity on financial bottlenecks and cash cycles.'
    },
    deliverables: {
      pt: [
        'Análise em 5 dias úteis de DRE e Balanço do último ano',
        'Relatório analítico identificando custos inflados e gargalo de caixa',
        'Reunião executiva de 1h30 para apresentação de planos de correção'
      ],
      en: [
        'Income statement and balance sheet audit of last fiscal year in 5 business days',
        'Analytical report identifying inflated costs and cash leakage points',
        '1.5-hour executive meeting to deliver correction plans'
      ]
    },
    benefits: {
      pt: 'Identifica oportunidades rápidas de otimização de caixa sem comprometer a operação.',
      en: 'Identifies rapid cash optimization opportunities without affecting day-to-day operations.'
    },
    accent: 'border-cyan-200 bg-cyan-50/10'
  },
  {
    id: 'controladoria',
    title: { pt: '2. Controladoria Inteligente', en: '2. Intelligent Controllership' },
    target: {
      pt: 'PMEs e empresas em crescimento buscando organizar a casa de vez.',
      en: 'SMEs and growing firms looking to organize and align accounting/finance workflows.'
    },
    deliverables: {
      pt: [
        'Estruturação completa do plano de contas e DRE Gerencial',
        'Definição de indicadores chave de desempenho (KPIs) por setor',
        'Desenho de rotinas de fechamento e governança de compras'
      ],
      en: [
        'Complete setup of chart of accounts and management DRE',
        'Defining key performance indicators (KPIs) for each business unit',
        'Designing month-end closing routines and purchasing governance workflows'
      ]
    },
    benefits: {
      pt: 'Traz previsibilidade, clareza contábil-fiscal e disciplina financeira contínua.',
      en: 'Delivers predictability, clear accounting-fiscal lines, and continuous financial discipline.'
    },
    accent: 'border-[#0071e3]/20 bg-[#0071e3]/5'
  },
  {
    id: 'fpa',
    title: { pt: '3. FP&A e Dashboards', en: '3. FP&A & Dashboards' },
    target: {
      pt: 'Organizações com volume de dados que necessitam de dashboards automatizados e Budget.',
      en: 'Organizations with high data volume requiring automated dashboards and annual budgets.'
    },
    deliverables: {
      pt: [
        'Modelagem de Budget (Orçamento) anual e Forecast dinâmico',
        'Construção de painel em Power BI integrado às fontes de dados',
        'Análises avançadas de CMV, margem de contribuição e ciclo de estoque'
      ],
      en: [
        'Yearly corporate Budget setup and dynamic Rolling Forecasts',
        'Building a custom Power BI dashboard connected to data sources',
        'Advanced analysis of COGS, contribution margin, and DIO inventory turns'
      ]
    },
    benefits: {
      pt: 'Automatiza o reporte para a diretoria e fornece insights de negócios em segundos.',
      en: 'Automates reporting to the board and supplies business insights in seconds.'
    },
    accent: 'border-emerald-200 bg-emerald-50/10'
  },
  {
    id: 'demanda',
    title: { pt: '4. Consultoria sob Demanda', en: '4. On-Demand Consulting' },
    target: {
      pt: 'Corporações com demandas específicas de modelagem financeira complexa.',
      en: 'Corporations with specific requirements for complex financial modeling.'
    },
    deliverables: {
      pt: [
        'Projetos customizados de Valuation, reestruturação de dívida ou M&A',
        'Intermediação entre finanças corporativas e desenvolvimento de sistemas (BI/IA)',
        'Mentoria ou assessoria periódica para o CFO/Diretoria'
      ],
      en: [
        'Custom projects for Valuation, debt restructuring, or M&A support',
        'Coordination between corporate finance and systems development (BI/AI)',
        'Mentorship and periodic advisory sessions for the CFO or board'
      ]
    },
    benefits: {
      pt: 'Acesso flexível a expertise sênior de controladoria para projetos de alto impacto.',
      en: 'Flexible access to senior controllership expertise for high-impact projects.'
    },
    accent: 'border-amber-200 bg-amber-50/10'
  }
]

export default function ConsultingPage() {
  const { language, t } = useLanguage()

  useSEO({
    title: t({ pt: 'Consultoria Financeira', en: 'Financial Consulting' }),
    description: t({
      pt: 'Serviços de consultoria em controladoria e FP&A por Jorge Telles: estruturação contábil, auditoria física de estoques, CMV gerencial e dashboards em Power BI.',
      en: 'Consulting services in controllership and FP&A by Jorge Telles: cost structure, inventory audits, management CMV and Power BI dashboards.'
    })
  })

  return (
    <PageTransition>
      <section className="mx-auto max-w-7xl px-6 pb-24 pt-12 sm:px-8 lg:px-10 space-y-16">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center max-w-5xl mx-auto">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#0071e3]">
              {t({ pt: 'Consultoria e Serviços', en: 'Consulting & Services' })}
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-[#1d1d1f] sm:text-5xl">
              {t({ pt: 'Soluções Práticas para Alavancar Resultados', en: 'Practical Solutions to Leverage Profits' })}
            </h1>
            <p className="mt-4 text-base leading-relaxed text-[#6e6e73]">
              {t({
                pt: 'Metodologia direta voltada à geração de valor, redução de custos desnecessários e controle de risco operacional.',
                en: 'Direct methodology aimed at value generation, unnecessary cost reductions, and operational risk mitigation.'
              })}
            </p>
          </div>
          <div className="flex justify-center lg:justify-end">
            <ProfilePortrait variant="consulting" size="md" className="rounded-[28px] shadow-lg max-h-[280px] w-auto animate-fade-in" />
          </div>
        </div>

        {/* Services List Grid */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold tracking-tight text-[#1d1d1f]">
            {t({ pt: 'O que eu faço', en: 'Areas of Operations' })}
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 pt-4">
            {servicesList.map((service, index) => (
              <div key={index} className="rounded-[24px] border border-black/5 bg-white p-5 hover:shadow-sm transition">
                <h3 className="font-bold text-sm text-[#1d1d1f] leading-snug">{t(service.title)}</h3>
                <p className="mt-3 text-xs text-[#6e6e73] leading-relaxed">{t(service.description)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Packages Grid */}
        <div className="space-y-8 pt-8">
          <h2 className="text-2xl font-semibold tracking-tight text-[#1d1d1f]">
            {t({ pt: 'Pacotes de Serviço', en: 'Service Packages' })}
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 pt-4">
            {packagesList.map((pkg) => {
              const deliverablesList = pkg.deliverables[language] || pkg.deliverables['pt'] || []
              return (
                <div
                  key={pkg.id}
                  className={`rounded-[32px] border p-6 flex flex-col justify-between hover:shadow-md transition duration-300 ${pkg.accent}`}
                >
                  <div className="space-y-4">
                    <h3 className="text-base font-bold text-[#1d1d1f]">{t(pkg.title)}</h3>
                    <div className="text-xs text-[#6e6e73] leading-relaxed">
                      <span className="font-semibold text-[#1d1d1f]">{t({ pt: 'Para quem:', en: 'Target:' })}</span> {t(pkg.target)}
                    </div>
                    <div className="border-t border-black/5 pt-4">
                      <span className="text-xs font-semibold text-[#1d1d1f] block mb-2">
                        {t({ pt: 'Entregáveis:', en: 'Deliverables:' })}
                      </span>
                      <ul className="space-y-2 text-xs text-[#424245]">
                        {deliverablesList.map((item, idx) => (
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
                      <span className="font-semibold text-[#1d1d1f]">{t({ pt: 'Benefício:', en: 'Benefit:' })}</span> {t(pkg.benefits)}
                    </div>
                    <Link
                      to={`/contato?interest=consulting&package=${pkg.id}`}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#1d1d1f] text-white px-4 py-2.5 text-xs font-semibold hover:bg-black transition"
                    >
                      {t({ pt: 'Solicitar proposta', en: 'Request proposal' })} <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </PageTransition>
  )
}

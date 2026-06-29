import PageTransition from '../components/layout/PageTransition'
import Hero from '../components/home/ImmersiveHero'
import About from '../components/About'
import { Link } from 'react-router-dom'
import { useSEO } from '../hooks/useSEO'
import { useLanguage } from '../context/LanguageContext'
import {
  ArrowRight,
  Landmark,
  Cpu,
  TrendingUp,
  Percent,
  Coins,
  Briefcase,
  Activity
} from 'lucide-react'

export default function HomePage() {
  const { t } = useLanguage()

  useSEO({
    title: t({ pt: 'Controller Estratégico & FP&A', en: 'Strategic Controller & FP&A' }),
    description: t({
      pt: 'Portfólio executivo de Jorge Telles, profissional sênior de Controladoria e FP&A. Conectando controladoria moderna, Power BI e Inteligência Artificial.',
      en: 'Executive portfolio of Jorge Telles, senior Controllership & FP&A expert. Bridging modern financial control, Power BI and Artificial Intelligence.'
    })
  })

  return (
    <PageTransition>
      <Hero />
      
      <section className="mx-auto max-w-7xl px-6 pb-24 pt-12 sm:px-8 lg:px-10 space-y-20">
        
        {/* 1. Preview do Painel Financeiro (SaaS Product Preview) */}
        <div className="rounded-[32px] border border-black/5 bg-white/70 backdrop-blur-md p-6 sm:p-8 lg:p-10 shadow-sm max-w-5xl mx-auto space-y-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-black/5 pb-5">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/10 px-3 py-1 text-[10px] font-semibold text-[#0071e3]">
                <Activity className="h-3.5 w-3.5 animate-pulse" /> {t({ pt: 'Visualização Dinâmica', en: 'Dynamic Viewport' })}
              </span>
              <h2 className="mt-2 text-xl font-bold text-[#1d1d1f]">
                {t({ pt: 'Preview do Painel Executivo', en: 'Executive Dashboard Preview' })}
              </h2>
              <p className="text-xs text-[#6e6e73]">
                {t({ pt: 'Valores simulados baseados em fechamento gerencial padrão', en: 'Simulated figures based on standard management reports' })}
              </p>
            </div>
            <Link
              to="/ia-dashboards"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0071e3] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#2997ff]"
            >
              {t({ pt: 'Acessar IA & Dashboards', en: 'Access AI & Dashboards' })} <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {/* EBITDA Card */}
            <div className="rounded-[24px] border border-black/5 bg-slate-50 p-5 space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#6e6e73]">
                  {t({ pt: 'EBITDA Acumulado', en: 'Accumulated EBITDA' })}
                </span>
                <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">+12.4%</span>
              </div>
              <p className="text-2xl font-extrabold text-[#1d1d1f]">R$ 2.450.000</p>
              <div className="flex items-end justify-between text-[10px] text-[#8e8e93] pt-1">
                <span>{t({ pt: 'vs Orçado (YTD)', en: 'vs Budgeted (YTD)' })}</span>
                <span className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span> 
                  {t({ pt: 'Dentro da meta', en: 'On Target' })}
                </span>
              </div>
            </div>

            {/* CMV Card */}
            <div className="rounded-[24px] border border-black/5 bg-slate-50 p-5 space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#6e6e73]">
                  {t({ pt: 'CMV Médio', en: 'Average COGS' })}
                </span>
                <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">-2.1%</span>
              </div>
              <p className="text-2xl font-extrabold text-[#1d1d1f]">32.4%</p>
              <div className="flex items-end justify-between text-[10px] text-[#8e8e93] pt-1">
                <span>{t({ pt: 'Meta: < 34.5%', en: 'Target: < 34.5%' })}</span>
                <span className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span> 
                  {t({ pt: 'Otimizado', en: 'Optimized' })}
                </span>
              </div>
            </div>

            {/* CCC Card */}
            <div className="rounded-[24px] border border-black/5 bg-slate-50 p-5 space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#6e6e73]">
                  {t({ pt: 'Conversão de Caixa', en: 'Cash Cycle' })}
                </span>
                <span className="text-[10px] font-semibold text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-full">-5 dias</span>
              </div>
              <p className="text-2xl font-extrabold text-[#1d1d1f]">42 {t({ pt: 'dias', en: 'days' })}</p>
              <div className="flex items-end justify-between text-[10px] text-[#8e8e93] pt-1">
                <span>{t({ pt: 'Prazo Médio Líquido', en: 'Net Operating Period' })}</span>
                <span className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span> 
                  {t({ pt: 'Atenção', en: 'Attention' })}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Dois Caminhos Prominentes (Dual CTA Actions) */}
        <div className="max-w-5xl mx-auto grid gap-6 md:grid-cols-2">
          {/* Path 1: Hire */}
          <div className="rounded-[32px] border border-black/5 bg-white p-8 shadow-sm flex flex-col justify-between hover:shadow-md hover:scale-[1.01] transition duration-300">
            <div className="space-y-4">
              <span className="inline-flex rounded-2xl bg-[#0071e3]/10 p-3 text-[#0071e3]">
                <Briefcase className="h-5 w-5" />
              </span>
              <h3 className="text-lg font-bold text-[#1d1d1f]">
                {t({ pt: 'Recrutamento & Liderança', en: 'Recruitment & Leadership' })}
              </h3>
              <p className="text-xs text-[#6e6e73] leading-relaxed">
                {t({
                  pt: 'Busca um Controller corporativo sênior para estruturar a área financeira de sua empresa? Tenho foco em inteligência de dados, CMV, governança e orçado x realizado.',
                  en: 'Looking for a senior corporate controller to structure your finance department? I focus on data intelligence, cost control, tax compliance and budget monitoring.'
                })}
              </p>
            </div>
            <div className="pt-6">
              <Link
                to="/contato?interest=hire"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0071e3] px-5 py-3 text-xs font-semibold text-white transition hover:bg-[#2997ff]"
              >
                {t({ pt: 'Quero contratar Jorge como Controller', en: 'Hire Jorge as Controller' })} <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Path 2: Consulting */}
          <div className="rounded-[32px] border border-black/5 bg-white p-8 shadow-sm flex flex-col justify-between hover:shadow-md hover:scale-[1.01] transition duration-300">
            <div className="space-y-4">
              <span className="inline-flex rounded-2xl bg-cyan-500/10 p-3 text-cyan-600">
                <Landmark className="h-5 w-5" />
              </span>
              <h3 className="text-lg font-bold text-[#1d1d1f]">
                {t({ pt: 'Consultoria & Diagnóstico', en: 'Consulting & Diagnosis' })}
              </h3>
              <p className="text-xs text-[#6e6e73] leading-relaxed">
                {t({
                  pt: 'Precisa de um diagnóstico financeiro rápido de CMV elevado, vazamento de margem, modelagem de forecast ou implantação ágil de dashboards Power BI?',
                  en: 'Need a rapid financial diagnosis of high COGS, margin leaks, forecast modeling, or agile Power BI dashboard implementations?'
                })}
              </p>
            </div>
            <div className="pt-6">
              <Link
                to="/contato?interest=consulting"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-black/10 bg-white px-5 py-3 text-xs font-semibold text-[#1d1d1f] transition hover:bg-[#f5f5f7]"
              >
                {t({ pt: 'Solicitar Diagnóstico Financeiro', en: 'Request Financial Diagnosis' })} <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* 3. 6 Cards de Capacidades (SaaS Capabilities) */}
        <div className="space-y-6 max-w-5xl mx-auto">
          <div className="text-center space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#0071e3]">
              {t({ pt: 'Soluções Práticas', en: 'Practical Solutions' })}
            </span>
            <h2 className="text-xl font-semibold tracking-tight text-[#1d1d1f]">
              {t({ pt: 'Pilares da Decisão Executiva', en: 'Pillars of Executive Decision' })}
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 pt-4">
            {/* 1. Controle */}
            <div className="rounded-[28px] border border-black/5 bg-white p-6 hover:shadow-sm transition">
              <div className="inline-flex rounded-2xl bg-slate-100 p-2.5 text-[#1d1d1f] mb-4">
                <Briefcase className="h-4.5 w-4.5" />
              </div>
              <h3 className="text-sm font-bold text-[#1d1d1f]">{t({ pt: 'Controle', en: 'Control' })}</h3>
              <p className="mt-2 text-xs text-[#6e6e73] leading-relaxed">
                {t({
                  pt: 'Visão clara de fluxo de caixa, custos e mitigação rigorosa de riscos de estoque e despesas.',
                  en: 'Clear visibility of cash flow, operating costs, and strict inventory/expense risk mitigation.'
                })}
              </p>
            </div>

            {/* 2. Planejamento */}
            <div className="rounded-[28px] border border-black/5 bg-white p-6 hover:shadow-sm transition">
              <div className="inline-flex rounded-2xl bg-slate-100 p-2.5 text-[#1d1d1f] mb-4">
                <TrendingUp className="h-4.5 w-4.5" />
              </div>
              <h3 className="text-sm font-bold text-[#1d1d1f]">{t({ pt: 'Planejamento', en: 'Planning' })}</h3>
              <p className="mt-2 text-xs text-[#6e6e73] leading-relaxed">
                {t({
                  pt: 'Projeção orçamentária dinâmica (Forecast) estruturada combinando metas YTD estruturadas.',
                  en: 'Dynamic budgeting forecasts structured to balance YTD targets with market factors.'
                })}
              </p>
            </div>

            {/* 3. Margem */}
            <div className="rounded-[28px] border border-black/5 bg-white p-6 hover:shadow-sm transition">
              <div className="inline-flex rounded-2xl bg-slate-100 p-2.5 text-[#1d1d1f] mb-4">
                <Percent className="h-4.5 w-4.5" />
              </div>
              <h3 className="text-sm font-bold text-[#1d1d1f]">{t({ pt: 'Margem', en: 'Margin' })}</h3>
              <p className="mt-2 text-xs text-[#6e6e73] leading-relaxed">
                {t({
                  pt: 'Rastreamento profundo de CMV por produto, margem de contribuição e ponto de equilíbrio.',
                  en: 'Deep COGS tracking by SKU, contribution margin modeling, and break-even point analysis.'
                })}
              </p>
            </div>

            {/* 4. Caixa */}
            <div className="rounded-[28px] border border-black/5 bg-white p-6 hover:shadow-sm transition">
              <div className="inline-flex rounded-2xl bg-slate-100 p-2.5 text-[#1d1d1f] mb-4">
                <Coins className="h-4.5 w-4.5" />
              </div>
              <h3 className="text-sm font-bold text-[#1d1d1f]">{t({ pt: 'Caixa', en: 'Cash' })}</h3>
              <p className="mt-2 text-xs text-[#6e6e73] leading-relaxed">
                {t({
                  pt: 'Otimização do ciclo de conversão de caixa, prazos médios e gestão ativa do capital de giro.',
                  en: 'Cash conversion cycle optimization, terms matching (DSO/DPO), and working capital control.'
                })}
              </p>
            </div>

            {/* 5. IA */}
            <div className="rounded-[28px] border border-black/5 bg-white p-6 hover:shadow-sm transition">
              <div className="inline-flex rounded-2xl bg-slate-100 p-2.5 text-[#1d1d1f] mb-4">
                <Cpu className="h-4.5 w-4.5" />
              </div>
              <h3 className="text-sm font-bold text-[#1d1d1f]">{t({ pt: 'IA', en: 'AI' })}</h3>
              <p className="mt-2 text-xs text-[#6e6e73] leading-relaxed">
                {t({
                  pt: 'Uso prático de inteligência de dados para previsões financeiras e automação operacional.',
                  en: 'Practical use of data science and AI algorithms for financial forecasts and process automation.'
                })}
              </p>
            </div>

            {/* 6. Dashboards */}
            <div className="rounded-[28px] border border-black/5 bg-white p-6 hover:shadow-sm transition">
              <div className="inline-flex rounded-2xl bg-slate-100 p-2.5 text-[#1d1d1f] mb-4">
                <Activity className="h-4.5 w-4.5" />
              </div>
              <h3 className="text-sm font-bold text-[#1d1d1f]">{t({ pt: 'Dashboards', en: 'Dashboards' })}</h3>
              <p className="mt-2 text-xs text-[#6e6e73] leading-relaxed">
                {t({
                  pt: 'Painéis gerenciais automatizados e integrados em Power BI a partir de SQL ou planilhas.',
                  en: 'Automated executive dashboards integrated with Power BI directly from ERP/SQL servers.'
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Short About Segment */}
        <About />

      </section>
    </PageTransition>
  )
}

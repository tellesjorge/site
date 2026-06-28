import PageTransition from '../components/layout/PageTransition'
import Hero from '../components/home/ImmersiveHero'
import About from '../components/About'
import { Link } from 'react-router-dom'
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
  return (
    <PageTransition>
      <Hero />
      
      <section className="mx-auto max-w-7xl px-6 pb-24 pt-12 sm:px-8 lg:px-10 space-y-20">
        
        {/* 1. Preview do Painel Financeiro (SaaS Product Preview) */}
        <div className="rounded-[32px] border border-black/5 bg-white/70 backdrop-blur-md p-6 sm:p-8 lg:p-10 shadow-sm max-w-5xl mx-auto space-y-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-black/5 pb-5">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/10 px-3 py-1 text-[10px] font-semibold text-[#0071e3]">
                <Activity className="h-3.5 w-3.5 animate-pulse" /> Live SaaS Preview
              </span>
              <h2 className="mt-2 text-xl font-bold text-[#1d1d1f]">Preview do Painel Executivo</h2>
              <p className="text-xs text-[#6e6e73]">Valores simulados baseados em fechamento gerencial padrão</p>
            </div>
            <Link
              to="/ia-dashboards"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0071e3] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#2997ff]"
            >
              Acessar IA & Dashboards <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {/* EBITDA Card */}
            <div className="rounded-[24px] border border-black/5 bg-slate-50 p-5 space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#6e6e73]">EBITDA Acumulado</span>
                <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">+12.4%</span>
              </div>
              <p className="text-2xl font-extrabold text-[#1d1d1f]">R$ 2.450.000</p>
              <div className="flex items-end justify-between text-[10px] text-[#8e8e93] pt-1">
                <span>vs Orçado (YTD)</span>
                <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span> Dentro da meta</span>
              </div>
            </div>

            {/* CMV Card */}
            <div className="rounded-[24px] border border-black/5 bg-slate-50 p-5 space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#6e6e73]">CMV Médio</span>
                <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">-2.1%</span>
              </div>
              <p className="text-2xl font-extrabold text-[#1d1d1f]">32.4%</p>
              <div className="flex items-end justify-between text-[10px] text-[#8e8e93] pt-1">
                <span>Meta: &lt; 34.5%</span>
                <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span> Otimizado</span>
              </div>
            </div>

            {/* CCC Card */}
            <div className="rounded-[24px] border border-black/5 bg-slate-50 p-5 space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#6e6e73]">Conversão de Caixa</span>
                <span className="text-[10px] font-semibold text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-full">-5 dias</span>
              </div>
              <p className="text-2xl font-extrabold text-[#1d1d1f]">42 dias</p>
              <div className="flex items-end justify-between text-[10px] text-[#8e8e93] pt-1">
                <span>Prazo Médio Líquido</span>
                <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span> Atenção</span>
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
              <h3 className="text-lg font-bold text-[#1d1d1f]">Recrutamento & Liderança</h3>
              <p className="text-xs text-[#6e6e73] leading-relaxed">
                Busca um Controller corporativo sênior para estruturar a área financeira de sua empresa? Tenho foco em inteligência de dados, CMV, governança e orçado x realizado.
              </p>
            </div>
            <div className="pt-6">
              <Link
                to="/contato?interest=hire"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0071e3] px-5 py-3 text-xs font-semibold text-white transition hover:bg-[#2997ff]"
              >
                Quero contratar Jorge como Controller <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Path 2: Consulting */}
          <div className="rounded-[32px] border border-black/5 bg-white p-8 shadow-sm flex flex-col justify-between hover:shadow-md hover:scale-[1.01] transition duration-300">
            <div className="space-y-4">
              <span className="inline-flex rounded-2xl bg-cyan-500/10 p-3 text-cyan-600">
                <Landmark className="h-5 w-5" />
              </span>
              <h3 className="text-lg font-bold text-[#1d1d1f]">Consultoria & Diagnóstico</h3>
              <p className="text-xs text-[#6e6e73] leading-relaxed">
                Precisa de um diagnóstico financeiro rápido de CMV elevado, vazamento de margem, modelagem de forecast ou implantação ágil de dashboards Power BI?
              </p>
            </div>
            <div className="pt-6">
              <Link
                to="/contato?interest=consulting"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-black/10 bg-white px-5 py-3 text-xs font-semibold text-[#1d1d1f] transition hover:bg-[#f5f5f7]"
              >
                Solicitar Diagnóstico Financeiro <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* 3. 6 Cards de Capacidades (SaaS Capabilities) */}
        <div className="space-y-6 max-w-5xl mx-auto">
          <div className="text-center space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#0071e3]">
              Soluções Práticas
            </span>
            <h2 className="text-xl font-semibold tracking-tight text-[#1d1d1f]">
              Pilares da Decisão Executiva
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 pt-4">
            {/* 1. Controle */}
            <div className="rounded-[28px] border border-black/5 bg-white p-6 hover:shadow-sm transition">
              <div className="inline-flex rounded-2xl bg-slate-100 p-2.5 text-[#1d1d1f] mb-4">
                <Briefcase className="h-4.5 w-4.5" />
              </div>
              <h3 className="text-sm font-bold text-[#1d1d1f]">Controle</h3>
              <p className="mt-2 text-xs text-[#6e6e73] leading-relaxed">
                Visão clara de fluxo de caixa, custos e mitigação rigorosa de riscos de estoque e despesas.
              </p>
            </div>

            {/* 2. Planejamento */}
            <div className="rounded-[28px] border border-black/5 bg-white p-6 hover:shadow-sm transition">
              <div className="inline-flex rounded-2xl bg-slate-100 p-2.5 text-[#1d1d1f] mb-4">
                <TrendingUp className="h-4.5 w-4.5" />
              </div>
              <h3 className="text-sm font-bold text-[#1d1d1f]">Planejamento</h3>
              <p className="mt-2 text-xs text-[#6e6e73] leading-relaxed">
                Projeção orçamentária dinâmica (Forecast) estruturada combinando metas YTD estruturadas.
              </p>
            </div>

            {/* 3. Margem */}
            <div className="rounded-[28px] border border-black/5 bg-white p-6 hover:shadow-sm transition">
              <div className="inline-flex rounded-2xl bg-slate-100 p-2.5 text-[#1d1d1f] mb-4">
                <Percent className="h-4.5 w-4.5" />
              </div>
              <h3 className="text-sm font-bold text-[#1d1d1f]">Margem</h3>
              <p className="mt-2 text-xs text-[#6e6e73] leading-relaxed">
                Rastreamento profundo de CMV por produto, margem de contribuição e ponto de equilíbrio.
              </p>
            </div>

            {/* 4. Caixa */}
            <div className="rounded-[28px] border border-black/5 bg-white p-6 hover:shadow-sm transition">
              <div className="inline-flex rounded-2xl bg-slate-100 p-2.5 text-[#1d1d1f] mb-4">
                <Coins className="h-4.5 w-4.5" />
              </div>
              <h3 className="text-sm font-bold text-[#1d1d1f]">Caixa</h3>
              <p className="mt-2 text-xs text-[#6e6e73] leading-relaxed">
                Otimização do ciclo de conversão de caixa, prazos médios e gestão ativa do capital de giro.
              </p>
            </div>

            {/* 5. IA */}
            <div className="rounded-[28px] border border-black/5 bg-white p-6 hover:shadow-sm transition">
              <div className="inline-flex rounded-2xl bg-slate-100 p-2.5 text-[#1d1d1f] mb-4">
                <Cpu className="h-4.5 w-4.5" />
              </div>
              <h3 className="text-sm font-bold text-[#1d1d1f]">IA</h3>
              <p className="mt-2 text-xs text-[#6e6e73] leading-relaxed">
                Uso prático de inteligência de dados para previsões financeiras e automação operacional.
              </p>
            </div>

            {/* 6. Dashboards */}
            <div className="rounded-[28px] border border-black/5 bg-white p-6 hover:shadow-sm transition">
              <div className="inline-flex rounded-2xl bg-slate-100 p-2.5 text-[#1d1d1f] mb-4">
                <Activity className="h-4.5 w-4.5" />
              </div>
              <h3 className="text-sm font-bold text-[#1d1d1f]">Dashboards</h3>
              <p className="mt-2 text-xs text-[#6e6e73] leading-relaxed">
                Painéis gerenciais automatizados e integrados em Power BI a partir de SQL ou planilhas.
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

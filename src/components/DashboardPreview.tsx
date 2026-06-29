import { motion } from 'framer-motion'
import { useState } from 'react'
import { profile } from '../data/profile'
import { useLanguage } from '../context/LanguageContext'

type PeriodKey = '30d' | '90d' | '12m'
type FocusKey = 'receita' | 'margem' | 'caixa' | 'risco'

const dashboardData: Record<PeriodKey, Record<FocusKey, { 
  title: { pt: string; en: string }; 
  value: { pt: string; en: string }; 
  delta: string; 
  insight: { pt: string; en: string }; 
  points: number[]; 
  highlight: { pt: string; en: string } 
}>> = {
  '30d': {
    receita: { 
      title: { pt: 'Receita recorrente', en: 'Recurring revenue' }, 
      value: { pt: 'R$ 24,8M', en: '$4.9M' }, 
      delta: '+12%', 
      insight: { pt: 'O ritmo comercial está acima da meta mensal.', en: 'Sales pace is exceeding the monthly target.' }, 
      points: [72, 84, 79, 91, 88, 95], 
      highlight: { pt: 'Revenda e serviços com forte aderência.', en: 'Strong traction in resale and services.' } 
    },
    margem: { 
      title: { pt: 'Margem líquida', en: 'Net margin' }, 
      value: { pt: '38,6%', en: '38.6%' }, 
      delta: '+3,2%', 
      insight: { pt: 'O mix de vendas reforçou a rentabilidade.', en: 'Product mix strengthened overall profitability.' }, 
      points: [58, 66, 71, 74, 76, 81], 
      highlight: { pt: 'Desempenho acima do benchmark do trimestre.', en: 'Performance above quarterly benchmark.' } 
    },
    caixa: { 
      title: { pt: 'Fluxo de caixa', en: 'Cash flow' }, 
      value: { pt: 'R$ 3,1M', en: '$620k' }, 
      delta: '+8,4%', 
      insight: { pt: 'Liquidez saudável com folga para investimento.', en: 'Healthy liquidity with space for capital expenditure.' }, 
      points: [62, 67, 70, 74, 79, 83], 
      highlight: { pt: 'Cobertura superior ao mínimo operacional.', en: 'Cash coverage above minimum operating baseline.' } 
    },
    risco: { 
      title: { pt: 'Risco financeiro', en: 'Financial risk' }, 
      value: { pt: 'Moderado', en: 'Moderate' }, 
      delta: 'Estável', 
      insight: { pt: 'Vigilância contínua em crédito e custo de capital.', en: 'Continuous vigilance on credit and cost of capital.' }, 
      points: [40, 45, 48, 50, 47, 52], 
      highlight: { pt: 'Mitigação com controles de cobrança e estoque.', en: 'Mitigation through collection and stock audits.' } 
    },
  },
  '90d': {
    receita: { 
      title: { pt: 'Receita consolidada', en: 'Consolidated revenue' }, 
      value: { pt: 'R$ 71,4M', en: '$14.2M' }, 
      delta: '+9,6%', 
      insight: { pt: 'O ciclo comercial mostrou aceleração sustentada.', en: 'Commercial cycle showed sustained acceleration.' }, 
      points: [64, 72, 78, 85, 88, 93], 
      highlight: { pt: 'Tendência positiva em receita recorrente.', en: 'Positive trend in recurring billing.' } 
    },
    margem: { 
      title: { pt: 'Margem operacional', en: 'Operating margin' }, 
      value: { pt: '41,2%', en: '41.2%' }, 
      delta: '+4,1%', 
      insight: { pt: 'Redução de despesas e melhor gestão de custos.', en: 'Opex reductions and optimized cost controls.' }, 
      points: [56, 63, 69, 77, 82, 86], 
      highlight: { pt: 'Margem em expansão com disciplina.', en: 'Expanding profit margins through strict discipline.' } 
    },
    caixa: { 
      title: { pt: 'Saldo disponível', en: 'Available cash' }, 
      value: { pt: 'R$ 8,9M', en: '$1.78M' }, 
      delta: '+11,3%', 
      insight: { pt: 'O caixa se fortaleceu graças ao ciclo de recebimentos.', en: 'Cash strengthened thanks to collection cycles.' }, 
      points: [60, 66, 72, 78, 82, 87], 
      highlight: { pt: 'Capacidade de suporte a projetos estratégicos.', en: 'Strong capacity to back strategic investments.' } 
    },
    risco: { 
      title: { pt: 'Exposição de risco', en: 'Risk exposure' }, 
      value: { pt: 'Baixo', en: 'Low' }, 
      delta: 'Em queda', 
      insight: { pt: 'Ações de governança reduziram volatilidade.', en: 'Governance actions successfully reduced volatility.' }, 
      points: [35, 40, 43, 46, 42, 39], 
      highlight: { pt: 'Indicadores sob controle com menor exposição.', en: 'Indicators under control with lowered exposure.' } 
    },
  },
  '12m': {
    receita: { 
      title: { pt: 'Receita anual', en: 'Annual revenue' }, 
      value: { pt: 'R$ 284M', en: '$56.8M' }, 
      delta: '+14,1%', 
      insight: { pt: 'Crescimento consistentemente acima da média do setor.', en: 'Growth consistently above industry averages.' }, 
      points: [54, 61, 68, 74, 81, 90], 
      highlight: { pt: 'Expansão apoiada por eficiência operacional.', en: 'Expansion backed by operational efficiencies.' } 
    },
    margem: { 
      title: { pt: 'Margem média anual', en: 'Average annual margin' }, 
      value: { pt: '39,8%', en: '39.8%' }, 
      delta: '+5,7%', 
      insight: { pt: 'Melhoria estrutural de rentabilidade no portfólio.', en: 'Structural profitability improvement in product portfolio.' }, 
      points: [52, 58, 64, 71, 78, 84], 
      highlight: { pt: 'Otimização de mix e processo em curso.', en: 'Ongoing product mix and workflow optimizations.' } 
    },
    caixa: { 
      title: { pt: 'Caixa acumulado', en: 'Accumulated cash' }, 
      value: { pt: 'R$ 31,2M', en: '$6.24M' }, 
      delta: '+16,8%', 
      insight: { pt: 'Capacidade de investimento acima da média histórica.', en: 'Capital expenditure capacity above historical average.' }, 
      points: [49, 56, 63, 71, 78, 87], 
      highlight: { pt: 'Fluxo robusto com preservação de liquidez.', en: 'Robust cash flows with strict preservation of liquidity.' } 
    },
    risco: { 
      title: { pt: 'Nível de risco', en: 'Risk level' }, 
      value: { pt: 'Controlado', en: 'Controlled' }, 
      delta: 'Melhorando', 
      insight: { pt: 'Governança e previsibilidade reforçam a resiliência.', en: 'Governance and predictability reinforce corporate resilience.' }, 
      points: [44, 47, 46, 42, 40, 38], 
      highlight: { pt: 'Acompanhamento proativo de variáveis críticas.', en: 'Proactive monitoring of critical variables.' } 
    },
  },
}

function DashboardPreview() {
  const { t } = useLanguage()
  const [period, setPeriod] = useState<PeriodKey>('90d')
  const [focus, setFocus] = useState<FocusKey>('receita')

  const periodOptions: Array<{ key: PeriodKey; label: string }> = [
    { key: '30d', label: t({ pt: 'Últimos 30 dias', en: 'Last 30 days' }) },
    { key: '90d', label: t({ pt: 'Últimos 90 dias', en: 'Last 90 days' }) },
    { key: '12m', label: t({ pt: '12 meses', en: '12 months' }) },
  ]

  const focusOptions: Array<{ key: FocusKey; label: string }> = [
    { key: 'receita', label: t({ pt: 'Receita', en: 'Revenue' }) },
    { key: 'margem', label: t({ pt: 'Margem', en: 'Margin' }) },
    { key: 'caixa', label: t({ pt: 'Caixa', en: 'Cash' }) },
    { key: 'risco', label: t({ pt: 'Risco', en: 'Risk' }) },
  ]

  const currentView = dashboardData[period][focus]

  return (
    <motion.section
      id="dashboard"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7 }}
      className="mb-16 rounded-[32px] border border-white/10 bg-surface2/90 p-8 shadow-glass"
    >
      <div className="mb-10 flex flex-col gap-4">
        <p className="text-sm uppercase tracking-[0.28em] text-cyan-300">
          {t({ pt: 'Dashboard interativo', en: 'Interactive Dashboard' })}
        </p>
        <h2 className="text-3xl font-semibold text-white sm:text-4xl">
          {t({ pt: 'Painel financeiro em tempo real', en: 'Real-Time Financial Dashboard' })}
        </h2>
        <p className="max-w-2xl text-slate-400">
          {t({
            pt: 'Explore indicadores financeiros por período e por objetivo de gestão com uma visão executiva e dinâmica.',
            en: 'Explore financial indicators by period and management objective with a dynamic executive layout.'
          })}
        </p>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {periodOptions.map((option) => (
          <button
            key={option.key}
            type="button"
            onClick={() => setPeriod(option.key)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${period === option.key ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'}`}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        {focusOptions.map((option) => (
          <button
            key={option.key}
            type="button"
            onClick={() => setFocus(option.key)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${focus === option.key ? 'bg-emerald-500/20 text-emerald-200 ring-1 ring-emerald-400/30' : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'}`}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[28px] border border-white/10 bg-slate-950/90 p-6 shadow-glass">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-slate-400">
                {t({ pt: 'Métrica selecionada', en: 'Selected metric' })}
              </p>
              <p className="mt-3 text-4xl font-semibold text-cyan-300">{t(currentView.value)}</p>
            </div>
            <div className="rounded-3xl bg-emerald-500/10 px-4 py-2 text-sm text-emerald-200">{currentView.delta}</div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {profile.dashboard.slice(0, 4).map((item) => {
              const labelStr = t(item.label)
              return (
                <div key={labelStr} className="rounded-3xl bg-surface2/95 p-4">
                  <p className="text-sm text-slate-400">{labelStr}</p>
                  <p className="mt-2 text-xl font-semibold text-white">{t(item.value)}</p>
                  <p className="mt-2 text-sm text-emerald-300">{t(item.trend)}</p>
                </div>
              )
            })}
          </div>

          <div className="mt-6 rounded-3xl border border-slate-700/60 bg-slate-900/90 p-5">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-400">
              {t({ pt: 'Insight atual', en: 'Current insight' })}
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-300">{t(currentView.insight)}</p>
          </div>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-slate-950/90 p-6 shadow-glass">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-slate-400">{t(currentView.title)}</p>
              <p className="mt-2 text-2xl font-semibold text-white">{t(currentView.value)}</p>
            </div>
            <div className="rounded-3xl border border-cyan-400/30 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-200">
              {periodOptions.find((option) => option.key === period)?.label}
            </div>
          </div>

          <div className="mt-8 flex h-48 items-end gap-3 rounded-[24px] border border-slate-800/70 bg-slate-900/70 p-4">
            {currentView.points.map((point, index) => (
              <motion.div
                key={`${t(currentView.title)}-${index}`}
                initial={{ height: 0 }}
                animate={{ height: `${point}%` }}
                transition={{ duration: 0.45, delay: index * 0.05 }}
                className="flex-1 rounded-t-2xl bg-gradient-to-t from-cyan-500 to-emerald-400"
              />
            ))}
          </div>

          <div className="mt-6 rounded-3xl border border-slate-700/60 bg-slate-900/90 p-5">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-400">
              {t({ pt: 'Resumo executivo', en: 'Executive summary' })}
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-300">{t(currentView.highlight)}</p>
          </div>
        </div>
      </div>
    </motion.section>
  )
}

export default DashboardPreview

import { motion } from 'framer-motion'
import { useState } from 'react'
import { profile } from '../data/profile'

type PeriodKey = '30d' | '90d' | '12m'
type FocusKey = 'receita' | 'margem' | 'caixa' | 'risco'

const periodOptions: Array<{ key: PeriodKey; label: string }> = [
  { key: '30d', label: 'Últimos 30 dias' },
  { key: '90d', label: 'Últimos 90 dias' },
  { key: '12m', label: '12 meses' },
]

const focusOptions: Array<{ key: FocusKey; label: string }> = [
  { key: 'receita', label: 'Receita' },
  { key: 'margem', label: 'Margem' },
  { key: 'caixa', label: 'Caixa' },
  { key: 'risco', label: 'Risco' },
]

const dashboardData: Record<PeriodKey, Record<FocusKey, { title: string; value: string; delta: string; insight: string; points: number[]; highlight: string }>> = {
  '30d': {
    receita: { title: 'Receita recorrente', value: 'R$ 24,8M', delta: '+12%', insight: 'O ritmo comercial está acima da meta mensal.', points: [72, 84, 79, 91, 88, 95], highlight: 'Revenda e serviços com forte aderência.' },
    margem: { title: 'Margem líquida', value: '38,6%', delta: '+3,2%', insight: 'O mix de vendas reforçou a rentabilidade.', points: [58, 66, 71, 74, 76, 81], highlight: 'Desempenho acima do benchmark do trimestre.' },
    caixa: { title: 'Fluxo de caixa', value: 'R$ 3,1M', delta: '+8,4%', insight: 'Liquidez saudável com folga para investimento.', points: [62, 67, 70, 74, 79, 83], highlight: 'Cobertura superior ao mínimo operacional.' },
    risco: { title: 'Risco financeiro', value: 'Moderado', delta: 'Estável', insight: 'Vigilância contínua em crédito e custo de capital.', points: [40, 45, 48, 50, 47, 52], highlight: 'Mitigação com controles de cobrança e estoque.' },
  },
  '90d': {
    receita: { title: 'Receita consolidada', value: 'R$ 71,4M', delta: '+9,6%', insight: 'O ciclo comercial mostrou aceleração sustentada.', points: [64, 72, 78, 85, 88, 93], highlight: 'Tendência positiva em receita recorrente.' },
    margem: { title: 'Margem operacional', value: '41,2%', delta: '+4,1%', insight: 'Redução de despesas e melhor gestão de custos.', points: [56, 63, 69, 77, 82, 86], highlight: 'Margem em expansão com disciplina.' },
    caixa: { title: 'Saldo disponível', value: 'R$ 8,9M', delta: '+11,3%', insight: 'O caixa se fortaleceu graças ao ciclo de recebimentos.', points: [60, 66, 72, 78, 82, 87], highlight: 'Capacidade de suporte a projetos estratégicos.' },
    risco: { title: 'Exposição de risco', value: 'Baixo', delta: 'Em queda', insight: 'Ações de governança reduziram volatilidade.', points: [35, 40, 43, 46, 42, 39], highlight: 'Indicadores sob controle com menor exposição.' },
  },
  '12m': {
    receita: { title: 'Receita anual', value: 'R$ 284M', delta: '+14,1%', insight: 'Crescimento consistentemente acima da média do setor.', points: [54, 61, 68, 74, 81, 90], highlight: 'Expansão apoiada por eficiência operacional.' },
    margem: { title: 'Margem média anual', value: '39,8%', delta: '+5,7%', insight: 'Melhoria estrutural de rentabilidade no portfólio.', points: [52, 58, 64, 71, 78, 84], highlight: 'Otimização de mix e processo em curso.' },
    caixa: { title: 'Caixa acumulado', value: 'R$ 31,2M', delta: '+16,8%', insight: 'Capacidade de investimento acima da média histórica.', points: [49, 56, 63, 71, 78, 87], highlight: 'Fluxo robusto com preservação de liquidez.' },
    risco: { title: 'Nível de risco', value: 'Controlado', delta: 'Melhorando', insight: 'Governança e previsibilidade reforçam a resiliência.', points: [44, 47, 46, 42, 40, 38], highlight: 'Acompanhamento proativo de variáveis críticas.' },
  },
}

function DashboardPreview() {
  const [period, setPeriod] = useState<PeriodKey>('90d')
  const [focus, setFocus] = useState<FocusKey>('receita')

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
        <p className="text-sm uppercase tracking-[0.28em] text-cyan-300">Dashboard interativo</p>
        <h2 className="text-3xl font-semibold text-white sm:text-4xl">Painel financeiro em tempo real</h2>
        <p className="max-w-2xl text-slate-400">
          Explore indicadores financeiros por período e por objetivo de gestão com uma visão executiva e dinâmica.
        </p>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {periodOptions.map((option) => (
          <button
            key={option.key}
            type="button"
            onClick={() => setPeriod(option.key)}
            className={`rounded-full px-4 py-2 text-sm transition ${period === option.key ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'}`}
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
            className={`rounded-full px-4 py-2 text-sm transition ${focus === option.key ? 'bg-emerald-500/20 text-emerald-200 ring-1 ring-emerald-400/30' : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'}`}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[28px] border border-white/10 bg-slate-950/90 p-6 shadow-glass">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Métrica selecionada</p>
              <p className="mt-3 text-4xl font-semibold text-cyan-300">{currentView.value}</p>
            </div>
            <div className="rounded-3xl bg-emerald-500/10 px-4 py-2 text-sm text-emerald-200">{currentView.delta}</div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {profile.dashboard.slice(0, 4).map((item) => (
              <div key={item.label} className="rounded-3xl bg-surface2/95 p-4">
                <p className="text-sm text-slate-400">{item.label}</p>
                <p className="mt-2 text-xl font-semibold text-white">{item.value}</p>
                <p className="mt-2 text-sm text-emerald-300">{item.trend}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-3xl border border-slate-700/60 bg-slate-900/90 p-5">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Insight atual</p>
            <p className="mt-3 text-sm leading-6 text-slate-300">{currentView.insight}</p>
          </div>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-slate-950/90 p-6 shadow-glass">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-slate-400">{currentView.title}</p>
              <p className="mt-2 text-2xl font-semibold text-white">{currentView.value}</p>
            </div>
            <div className="rounded-3xl border border-cyan-400/30 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-200">
              {periodOptions.find((option) => option.key === period)?.label}
            </div>
          </div>

          <div className="mt-8 flex h-48 items-end gap-3 rounded-[24px] border border-slate-800/70 bg-slate-900/70 p-4">
            {currentView.points.map((point, index) => (
              <motion.div
                key={`${currentView.title}-${index}`}
                initial={{ height: 0 }}
                animate={{ height: `${point}%` }}
                transition={{ duration: 0.45, delay: index * 0.05 }}
                className="flex-1 rounded-t-2xl bg-gradient-to-t from-cyan-500 to-emerald-400"
              />
            ))}
          </div>

          <div className="mt-6 rounded-3xl border border-slate-700/60 bg-slate-900/90 p-5">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Resumo executivo</p>
            <p className="mt-3 text-sm leading-6 text-slate-300">{currentView.highlight}</p>
          </div>
        </div>
      </div>
    </motion.section>
  )
}

export default DashboardPreview

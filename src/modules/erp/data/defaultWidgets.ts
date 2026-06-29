import { ERPWidget } from '../types/erp.types'

export const defaultWidgets: ERPWidget[] = [
  {
    id: 'kpi-revenue',
    title: 'Receita Operacional',
    metric: 'R$ 24,80M',
    delta: '+12.4%',
    status: 'positive',
    text: 'Aceleração comercial acima do forecast.',
    icon: 'TrendingUp',
    type: 'kpi'
  },
  {
    id: 'kpi-margin',
    title: 'Margem Líquida',
    metric: '38,60%',
    delta: '+3.2%',
    status: 'positive',
    text: 'Mix de vendas gerou maior rentabilidade.',
    icon: 'Percent',
    type: 'kpi'
  },
  {
    id: 'kpi-cmv',
    title: 'CMV Consolidado',
    metric: '61,29%',
    delta: '+1.8%',
    status: 'warning',
    text: 'Custo de insumos em Curitiba sob vigilância.',
    icon: 'Activity',
    type: 'kpi'
  },
  {
    id: 'kpi-opex',
    title: 'OPEX / Despesas',
    metric: 'R$ 4,10M',
    delta: '-2.1%',
    status: 'positive',
    text: 'Disciplina fiscal manteve OPEX sob controle.',
    icon: 'ArrowDownRight',
    type: 'kpi'
  },
  {
    id: 'kpi-cash',
    title: 'Fluxo de Caixa',
    metric: 'R$ 3,10M',
    delta: '+8.4%',
    status: 'positive',
    text: 'Ciclo de conversão saudável no período.',
    icon: 'DollarSign',
    type: 'kpi'
  },
  {
    id: 'kpi-aging',
    title: 'Aging / PDD',
    metric: '12,50%',
    delta: '+4.5%',
    status: 'critical',
    text: 'Atrasos de pagamento requerem cobrança ativa.',
    icon: 'Clock',
    type: 'kpi'
  },
  {
    id: 'chart-budget',
    title: 'Orçado vs Realizado',
    metric: 'R$ 24,8M / R$ 24,0M',
    delta: '103.3% Atingido',
    status: 'positive',
    text: 'Visão comparativa da meta mensal e custos.',
    icon: 'BarChart2',
    type: 'chart',
    chartType: 'bar'
  },
  {
    id: 'chart-trend',
    title: 'Tendência de Margem e CMV',
    metric: 'Receita x Custos Recorrentes',
    delta: 'Consistente',
    status: 'positive',
    text: 'Análise de fluxo histórico semestral.',
    icon: 'LineChart',
    type: 'chart',
    chartType: 'area'
  }
]

export const defaultGridLayouts = {
  lg: [
    { i: 'kpi-revenue', x: 0, y: 0, w: 3, h: 2, minW: 2, minH: 2 },
    { i: 'kpi-margin', x: 3, y: 0, w: 3, h: 2, minW: 2, minH: 2 },
    { i: 'kpi-cmv', x: 6, y: 0, w: 3, h: 2, minW: 2, minH: 2 },
    { i: 'kpi-opex', x: 9, y: 0, w: 3, h: 2, minW: 2, minH: 2 },
    { i: 'kpi-cash', x: 0, y: 2, w: 3, h: 2, minW: 2, minH: 2 },
    { i: 'kpi-aging', x: 3, y: 2, w: 3, h: 2, minW: 2, minH: 2 },
    { i: 'chart-budget', x: 6, y: 2, w: 6, h: 4, minW: 4, minH: 3 },
    { i: 'chart-trend', x: 0, y: 4, w: 6, h: 4, minW: 4, minH: 3 }
  ],
  md: [
    { i: 'kpi-revenue', x: 0, y: 0, w: 5, h: 2 },
    { i: 'kpi-margin', x: 5, y: 0, w: 5, h: 2 },
    { i: 'kpi-cmv', x: 0, y: 2, w: 5, h: 2 },
    { i: 'kpi-opex', x: 5, y: 2, w: 5, h: 2 },
    { i: 'kpi-cash', x: 0, y: 4, w: 5, h: 2 },
    { i: 'kpi-aging', x: 5, y: 4, w: 5, h: 2 },
    { i: 'chart-budget', x: 0, y: 6, w: 10, h: 4 },
    { i: 'chart-trend', x: 0, y: 10, w: 10, h: 4 }
  ],
  sm: [
    { i: 'kpi-revenue', x: 0, y: 0, w: 6, h: 2 },
    { i: 'kpi-margin', x: 0, y: 2, w: 6, h: 2 },
    { i: 'kpi-cmv', x: 0, y: 4, w: 6, h: 2 },
    { i: 'kpi-opex', x: 0, y: 6, w: 6, h: 2 },
    { i: 'kpi-cash', x: 0, y: 8, w: 6, h: 2 },
    { i: 'kpi-aging', x: 0, y: 10, w: 6, h: 2 },
    { i: 'chart-budget', x: 0, y: 12, w: 6, h: 3 },
    { i: 'chart-trend', x: 0, y: 15, w: 6, h: 3 }
  ]
}

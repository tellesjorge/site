import React, { useState, useEffect } from 'react'
import { Responsive, WidthProvider, Layout } from 'react-grid-layout/legacy'
import {
  TrendingUp,
  Percent,
  Activity,
  ArrowDownRight,
  DollarSign,
  Clock,
  BarChart2,
  LineChart,
  Save,
  RotateCcw,
  AlertTriangle
} from 'lucide-react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  AreaChart,
  Area,
  CartesianGrid,
  Legend
} from 'recharts'
import { ERPWidget } from '../types/erp.types'
import { defaultGridLayouts } from '../data/defaultWidgets'
import { sampleFinancialTrend } from '../data/sampleFinancialData'

// Grid layout styles
import 'react-grid-layout/css/styles.css'

export type Layouts = any

const ResponsiveReactGridLayout = WidthProvider(Responsive)

interface ERPDashboardGridProps {
  widgets: ERPWidget[]
  onLayoutSaved?: () => void
}

const getIconComponent = (icon: string) => {
  switch (icon) {
    case 'TrendingUp': return <TrendingUp className="h-5 w-5" />
    case 'Percent': return <Percent className="h-5 w-5" />
    case 'Activity': return <Activity className="h-5 w-5" />
    case 'ArrowDownRight': return <ArrowDownRight className="h-5 w-5" />
    case 'DollarSign': return <DollarSign className="h-5 w-5" />
    case 'Clock': return <Clock className="h-5 w-5" />
    case 'BarChart2': return <BarChart2 className="h-5 w-5" />
    case 'LineChart': return <LineChart className="h-5 w-5" />
    default: return <Activity className="h-5 w-5" />
  }
}

const getStatusClasses = (status: 'positive' | 'warning' | 'critical') => {
  switch (status) {
    case 'positive':
      return {
        border: 'border-emerald-100 bg-emerald-50/15',
        iconBg: 'bg-emerald-50 text-emerald-600',
        text: 'text-emerald-700'
      }
    case 'warning':
      return {
        border: 'border-amber-100 bg-amber-50/15',
        iconBg: 'bg-amber-50 text-amber-600',
        text: 'text-amber-700'
      }
    case 'critical':
      return {
        border: 'border-red-100 bg-red-50/15',
        iconBg: 'bg-red-50 text-red-600',
        text: 'text-red-700'
      }
  }
}

export default function ERPDashboardGrid({ widgets, onLayoutSaved }: ERPDashboardGridProps) {
  const [layouts, setLayouts] = useState<Layouts>(defaultGridLayouts)
  const [saveSuccess, setSaveSuccess] = useState(false)

  // Load layout from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('site_jt_erp_layout_v1')
    if (saved) {
      try {
        setLayouts(JSON.parse(saved))
      } catch (e) {
        console.warn('Failed to parse layout, using default')
      }
    }
  }, [])

  const handleLayoutChange = (currentLayout: any, allLayouts: Layouts) => {
    setLayouts(allLayouts)
  }

  const saveLayout = () => {
    localStorage.setItem('site_jt_erp_layout_v1', JSON.stringify(layouts))
    setSaveSuccess(true)
    if (onLayoutSaved) onLayoutSaved()
    setTimeout(() => setSaveSuccess(false), 2000)
  }

  const resetLayout = () => {
    setLayouts(defaultGridLayouts)
    localStorage.removeItem('site_jt_erp_layout_v1')
  }

  return (
    <div className="space-y-4">
      {/* Grid Controls */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-100 bg-white/60 p-3.5 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-xs font-semibold text-slate-700">Workspace Customizável (Arraste ou Redimensione)</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={resetLayout}
            className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Restaurar Padrão
          </button>
          <button
            type="button"
            onClick={saveLayout}
            className={`inline-flex items-center gap-1 rounded-full px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition ${
              saveSuccess ? 'bg-emerald-600' : 'bg-slate-900 hover:bg-slate-800'
            }`}
          >
            <Save className="h-3.5 w-3.5" /> {saveSuccess ? 'Layout Salvo!' : 'Salvar Layout'}
          </button>
        </div>
      </div>

      <div className="bg-slate-50/20 rounded-[32px] p-2 border border-slate-100/50 min-h-[500px]">
        <ResponsiveReactGridLayout
          className="layout"
          layouts={layouts}
          breakpoints={{ lg: 1200, md: 996, sm: 768 }}
          cols={{ lg: 12, md: 10, sm: 6 }}
          rowHeight={80}
          isDraggable={true}
          isResizable={true}
          onLayoutChange={handleLayoutChange}
          draggableHandle=".drag-handle"
          margin={[16, 16]}
        >
          {widgets.map((w) => {
            const styles = getStatusClasses(w.status)
            
            return (
              <div
                key={w.id}
                className={`flex flex-col rounded-3xl border border-slate-100 bg-white shadow-[0_8px_32px_rgba(15,23,42,0.02)] overflow-hidden`}
              >
                {/* Header / Drag Handle */}
                <div className="drag-handle flex cursor-grab items-center justify-between px-5 py-3.5 border-b border-slate-50 select-none bg-slate-50/40">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className={`rounded-lg p-1 ${styles.iconBg} flex-shrink-0`}>
                      {getIconComponent(w.icon)}
                    </div>
                    <h4 className="text-xs font-bold text-slate-800 truncate">{w.title}</h4>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 p-5 flex flex-col justify-between overflow-hidden">
                  {w.type === 'kpi' ? (
                    <div className="space-y-2">
                      <div className="flex items-baseline justify-between">
                        <span className="text-2xl font-bold tracking-tight text-slate-900">{w.metric}</span>
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${styles.border} ${styles.text}`}>
                          {w.delta}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed truncate-2-lines">{w.text}</p>
                    </div>
                  ) : (
                    <div className="flex-1 w-full h-full min-h-[140px] pt-1">
                      {w.chartType === 'bar' ? (
                        <ResponsiveContainer width="100%" height="100%" debounce={150}>
                          <BarChart data={sampleFinancialTrend} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="month" tick={{ fontSize: 9 }} stroke="#94a3b8" />
                            <YAxis tick={{ fontSize: 9 }} stroke="#94a3b8" />
                            <Tooltip wrapperStyle={{ fontSize: 10 }} />
                            <Legend wrapperStyle={{ fontSize: 9 }} />
                            <Bar dataKey="orcado" name="Orçado (M$)" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="realizado" name="Realizado (M$)" fill="#0071e3" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      ) : (
                        <ResponsiveContainer width="100%" height="100%" debounce={150}>
                          <AreaChart data={sampleFinancialTrend} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                            <defs>
                              <linearGradient id="colorRec" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#00c7be" stopOpacity={0.25} />
                                <stop offset="95%" stopColor="#00c7be" stopOpacity={0.0} />
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="month" tick={{ fontSize: 9 }} stroke="#94a3b8" />
                            <YAxis tick={{ fontSize: 9 }} stroke="#94a3b8" />
                            <Tooltip wrapperStyle={{ fontSize: 10 }} />
                            <Legend wrapperStyle={{ fontSize: 9 }} />
                            <Area type="monotone" dataKey="receita" name="Faturamento (M$)" stroke="#0071e3" fillOpacity={1} fill="url(#colorRec)" strokeWidth={2} />
                            <Area type="monotone" dataKey="custos" name="Custos / CMV (M$)" stroke="#00c7be" fillOpacity={0} strokeWidth={2} />
                          </AreaChart>
                        </ResponsiveContainer>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </ResponsiveReactGridLayout>
      </div>
    </div>
  )
}

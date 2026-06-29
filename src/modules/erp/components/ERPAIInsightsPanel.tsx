import React from 'react'
import { Sparkles, AlertTriangle, ShieldAlert, Award, Lightbulb } from 'lucide-react'
import { AIInsight } from '../types/erp.types'

interface ERPAIInsightsPanelProps {
  insights: AIInsight[]
  summary: string
}

export default function ERPAIInsightsPanel({ insights, summary }: ERPAIInsightsPanelProps) {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'bottleneck':
        return <AlertTriangle className="h-4.5 w-4.5 text-amber-500" />
      case 'risk':
        return <ShieldAlert className="h-4.5 w-4.5 text-red-500" />
      case 'opportunity':
        return <Award className="h-4.5 w-4.5 text-emerald-500" />
      default:
        return <Lightbulb className="h-4.5 w-4.5 text-blue-500" />
    }
  }

  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-50 text-red-700 border-red-200/50'
      case 'medium':
        return 'bg-amber-50 text-amber-700 border-amber-200/50'
      default:
        return 'bg-slate-50 text-slate-600 border-slate-200/50'
    }
  }

  return (
    <div className="rounded-3xl border border-slate-100 bg-white/70 p-6 shadow-sm backdrop-blur-xl space-y-6 h-full flex flex-col">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
          <Sparkles className="h-4.5 w-4.5" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-800">Insights de IA & Recomendações</h3>
          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Controller Virtual Ativo</p>
        </div>
      </div>

      <div className="rounded-2xl border border-cyan-100/40 bg-cyan-50/20 p-4 text-xs text-slate-700 leading-relaxed shadow-sm">
        <p className="font-semibold text-cyan-900 mb-1 flex items-center gap-1">
          📊 Diagnóstico Financeiro Consolidado
        </p>
        <p className="text-slate-600">{summary}</p>
      </div>

      <div className="space-y-3 overflow-y-auto flex-1 max-h-[480px] pr-1">
        {insights.length === 0 ? (
          <div className="flex h-32 items-center justify-center text-xs text-slate-400">
            Nenhum insight gerado. Carregue uma planilha para analisar indicadores.
          </div>
        ) : (
          insights.map((insight) => (
            <div
              key={insight.id}
              className="group rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition hover:shadow-md hover:border-slate-200"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="mt-0.5 rounded-xl bg-slate-50 p-1.5 transition group-hover:bg-slate-100">
                    {getCategoryIcon(insight.category)}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-800 truncate">
                      {insight.title}
                    </h4>
                    <p className="mt-1 text-[11px] leading-relaxed text-slate-500">
                      {insight.description}
                    </p>
                  </div>
                </div>

                <span
                  className={`inline-block rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide flex-shrink-0 ${getPriorityClass(
                    insight.priority
                  )}`}
                >
                  {insight.priority === 'high' ? 'Alta' : insight.priority === 'medium' ? 'Média' : 'Baixa'}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="text-[10px] text-center text-slate-400 bg-slate-50 p-2.5 rounded-xl border border-slate-100/50">
        💡 **Nota**: Esta é uma demonstração baseada em regras de controladoria. A estrutura está pronta para integração com modelos Gemini / GPT reais.
      </div>
    </div>
  )
}

import React, { useState } from 'react'
import { FileText, Sparkles, BookOpen } from 'lucide-react'
import { summarizeDocument } from '../services/aiAnalysisService'

interface ERPDocumentReaderProps {
  fileName: string
  pageCount: number
  text: string
}

export default function ERPDocumentReader({ fileName, pageCount, text }: ERPDocumentReaderProps) {
  const [showSummary, setShowSummary] = useState(false)
  const [summary, setSummary] = useState('')

  const handleGenerateSummary = () => {
    const docSummary = summarizeDocument(text)
    setSummary(docSummary)
    setShowSummary(true)
  }

  const isTextEmpty = !text || text.trim() === '' || text.includes('Falha ao processar')

  return (
    <div className="rounded-3xl border border-slate-100 bg-white/70 p-6 shadow-sm backdrop-blur-xl space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-red-50 text-red-500">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-800 truncate max-w-[280px] sm:max-w-md">
              {fileName}
            </h3>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
              Leitor de PDF Mapeado • {pageCount} {pageCount === 1 ? 'Página' : 'Páginas'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGenerateSummary}
          className="inline-flex items-center justify-center gap-1.5 rounded-full bg-cyan-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-cyan-500 transition-colors"
        >
          <Sparkles className="h-3.5 w-3.5" /> Analisar com IA
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2">
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1">
            <BookOpen className="h-3 w-3" /> Conteúdo Extraído
          </h4>
          <div className="h-60 overflow-y-auto rounded-2xl border border-slate-100 bg-slate-50/50 p-4 text-xs text-slate-600 leading-relaxed font-mono">
            {isTextEmpty ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-slate-400 space-y-2">
                <p>⚠️ Este PDF parece não conter texto extraível.</p>
                <p className="text-[10px] max-w-[320px]">Para realizar leitura por imagem (OCR), será necessário acoplar um módulo adicional em futura atualização de nuvem.</p>
              </div>
            ) : (
              <pre className="whitespace-pre-wrap break-words font-sans">{text}</pre>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-cyan-600" /> Resumo do Analista Virtual
          </h4>
          <div className="h-60 overflow-y-auto rounded-2xl border border-cyan-100/30 bg-cyan-50/15 p-4 text-xs text-slate-700 leading-relaxed">
            {showSummary ? (
              <div className="space-y-3">
                <div className="whitespace-pre-wrap font-sans">{summary}</div>
                <div className="rounded-xl border border-cyan-200/30 bg-cyan-100/30 p-2 text-[10px] text-cyan-800">
                  ⚡ **Simulação Ativa**: Este resumo foi gerado localmente analisando padrões lexicais. O workspace está preparado para integração com Gemini / OpenAI.
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center text-slate-400">
                <p>Clique em "Analisar com IA" para processar o relatório financeiro.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

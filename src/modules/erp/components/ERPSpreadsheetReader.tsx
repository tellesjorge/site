import React, { useState } from 'react'
import { FileSpreadsheet, Check, HelpCircle } from 'lucide-react'
import { mapFinancialColumns } from '../services/spreadsheetService'

interface ERPSpreadsheetReaderProps {
  fileName: string
  sheets: string[]
  sheetData: Record<string, any[]>
  onSheetChanged?: (sheetName: string) => void
}

export default function ERPSpreadsheetReader({
  fileName,
  sheets,
  sheetData,
  onSheetChanged
}: ERPSpreadsheetReaderProps) {
  const [currentSheet, setCurrentSheet] = useState(sheets[0] || '')
  
  const data = sheetData[currentSheet] || []
  const headers = data.length > 0 ? Object.keys(data[0]) : []
  const mappings = mapFinancialColumns(data)

  const handleSheetChange = (name: string) => {
    setCurrentSheet(name)
    if (onSheetChanged) onSheetChanged(name)
  }

  // Find if a header key is mapped to standard financial KPI fields
  const getHeaderMappingLabel = (key: string): string | null => {
    const k = key.toLowerCase()
    if (mappings.revenue && key === mappings.revenue) return 'Receita'
    if (mappings.cmv && key === mappings.cmv) return 'CMV'
    if (mappings.opex && key === mappings.opex) return 'OPEX'
    if (mappings.margin && key === mappings.margin) return 'Margem'
    if (mappings.date && key === mappings.date) return 'Data'
    if (mappings.category && key === mappings.category) return 'Categoria'
    if (mappings.value && key === mappings.value) return 'Valor'
    return null
  }

  return (
    <div className="rounded-3xl border border-slate-100 bg-white/70 p-6 shadow-sm backdrop-blur-xl space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-500">
            <FileSpreadsheet className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-800 truncate max-w-[280px] sm:max-w-md">
              {fileName}
            </h3>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
              Visualizador de Planilhas • {data.length} Linhas Mapeadas
            </p>
          </div>
        </div>

        {sheets.length > 1 && (
          <div className="flex flex-wrap gap-1.5">
            {sheets.map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => handleSheetChange(name)}
                className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition ${
                  currentSheet === name
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Mapped Columns Indicator Banner */}
      <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-3">
        <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
          Colunas Mapeadas pelo Controller Virtual
        </h4>
        <div className="flex flex-wrap gap-2">
          {Object.entries(mappings).map(([field, headerName]) => (
            <div
              key={field}
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium border ${
                headerName
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-700'
                  : 'bg-slate-100 border-slate-200 text-slate-400'
              }`}
            >
              {headerName ? <Check className="h-2.5 w-2.5" /> : <HelpCircle className="h-2.5 w-2.5" />}
              <span className="capitalize font-bold">{field}:</span>
              <span>{headerName || 'Não Encontrada'}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="max-h-72 overflow-auto rounded-2xl border border-slate-100 bg-white shadow-sm">
        {data.length === 0 ? (
          <div className="flex h-32 items-center justify-center text-xs text-slate-400">
            Nenhuma linha disponível nesta aba.
          </div>
        ) : (
          <table className="w-full text-left text-xs border-collapse">
            <thead className="sticky top-0 bg-slate-50 text-slate-500 uppercase text-[9px] tracking-wider border-b border-slate-100">
              <tr>
                {headers.map((h) => {
                  const label = getHeaderMappingLabel(h)
                  return (
                    <th key={h} className="px-4 py-3 font-bold whitespace-nowrap">
                      <div>{h}</div>
                      {label && (
                        <span className="inline-block mt-0.5 text-[8px] font-extrabold px-1 rounded bg-emerald-500/10 text-emerald-700 uppercase tracking-normal">
                          {label}
                        </span>
                      )}
                    </th>
                  )
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {data.slice(0, 50).map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50">
                  {headers.map((h) => (
                    <td key={h} className="px-4 py-2.5 whitespace-nowrap max-w-[200px] truncate">
                      {String(row[h])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {data.length > 50 && (
        <p className="text-[10px] text-center text-slate-400">
          * Exibindo apenas as primeiras 50 linhas para otimização de renderização.
        </p>
      )}
    </div>
  )
}

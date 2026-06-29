import * as XLSX from 'xlsx'

export interface ParsedSpreadsheet {
  sheets: string[]
  sheetData: Record<string, any[]>
  workbook: XLSX.WorkBook
}

export function readSpreadsheetFile(arrayBuffer: ArrayBuffer): ParsedSpreadsheet {
  const workbook = XLSX.read(arrayBuffer, { type: 'array' })
  const sheets = workbook.SheetNames
  const sheetData: Record<string, any[]> = {}

  // Parse all sheets to JSON
  sheets.forEach((name) => {
    const worksheet = workbook.Sheets[name]
    // Raw format header: 1 to get row matrices, or object format
    const rows = XLSX.utils.sheet_to_json(worksheet, { defval: '' })
    sheetData[name] = rows
  })

  return { sheets, sheetData, workbook }
}

// Maps standard financial fields by looking at the row keys
export function mapFinancialColumns(rows: any[]): Record<string, string | null> {
  const mapping: Record<string, string | null> = {
    revenue: null,
    cmv: null,
    opex: null,
    margin: null,
    date: null,
    category: null,
    value: null
  }

  if (rows.length === 0) return mapping

  const firstRow = rows[0]
  const keys = Object.keys(firstRow)

  const findKey = (keywords: string[]) => {
    return keys.find((key) => {
      const lowerKey = key.toLowerCase()
      return keywords.some((kw) => lowerKey.includes(kw))
    }) || null
  }

  mapping.revenue = findKey(['receita', 'faturamento', 'revenue', 'venda'])
  mapping.cmv = findKey(['cmv', 'custo', 'cost', 'insumos', 'compra'])
  mapping.opex = findKey(['opex', 'despesa', 'administrativo', 'gastos'])
  mapping.margin = findKey(['margem', 'margin', 'lucratividade'])
  mapping.date = findKey(['data', 'date', 'competencia', 'periodo'])
  mapping.category = findKey(['categoria', 'category', 'conta', 'descricao', 'item'])
  mapping.value = findKey(['valor', 'value', 'total', 'montante', 'saldo'])

  return mapping
}

export function extractFinancialKPIs(rows: any[], mappings: Record<string, string | null>) {
  let revenue = 0
  let cmv = 0
  let opex = 0
  let count = 0

  const parseNum = (val: any): number => {
    if (typeof val === 'number') return val
    if (typeof val === 'string') {
      const clean = val.replace(/[^\d.,-]/g, '').replace(',', '.')
      const num = parseFloat(clean)
      return isNaN(num) ? 0 : num
    }
    return 0
  }

  rows.forEach((row) => {
    if (mappings.revenue && row[mappings.revenue]) revenue += parseNum(row[mappings.revenue])
    if (mappings.cmv && row[mappings.cmv]) cmv += parseNum(row[mappings.cmv])
    if (mappings.opex && row[mappings.opex]) opex += parseNum(row[mappings.opex])
    count++
  })

  // If specific value mapping is available and no direct KPI columns matched, use value + category filters
  if (revenue === 0 && cmv === 0 && opex === 0 && mappings.value && mappings.category) {
    rows.forEach((row) => {
      const category = String(row[mappings.category || '']).toLowerCase()
      const val = parseNum(row[mappings.value || ''])
      if (category.includes('receita') || category.includes('venda') || category.includes('faturamento')) {
        revenue += val
      } else if (category.includes('custo') || category.includes('cmv')) {
        cmv += val
      } else if (category.includes('despesa') || category.includes('opex') || category.includes('administrativa')) {
        opex += val
      }
    })
  }

  const margin = revenue > 0 ? ((revenue - cmv) / revenue) * 100 : 0

  return {
    revenue,
    cmv,
    opex,
    margin,
    count
  }
}

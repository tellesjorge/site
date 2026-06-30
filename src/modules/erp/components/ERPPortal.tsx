import React, { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Sparkles,
  Lock,
  UserPlus,
  KeyRound,
  FileCode,
  Upload,
  Database,
  Building2,
  Plus,
  LogOut,
  LineChart,
  Grid,
  Settings2,
  FileCheck,
  ChevronRight,
  TrendingUp,
  RefreshCw,
  Eye,
  Workflow,
  ArrowLeft,
  ArrowRight,
  Maximize2,
  Minimize2,
  FileSpreadsheet,
  UploadCloud,
  Table2,
  Activity,
  Percent,
  FileText,
  Terminal
} from 'lucide-react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { useLanguage } from '../../../context/LanguageContext'

// Simple XML parsing helper (regex-based for safe client-side extraction)
function parseNFeXML(xmlText: string) {
  try {
    const getValue = (tag: string) => {
      const match = xmlText.match(new RegExp(`<${tag}>([^<]+)</${tag}>`))
      return match ? match[1] : null
    }

    const nNF = getValue('nNF') || 'N/A'
    const dhEmi = getValue('dhEmi') || new Date().toISOString()
    
    // Extract issuer name
    const emitMatch = xmlText.match(/<emit>([\s\S]*?)<\/emit>/)
    const issuer = emitMatch ? emitMatch[1].match(/<xNome>([^<]+)<\/xNome>/)?.[1] || 'N/A' : 'N/A'
    
    // Extract receiver name
    const destMatch = xmlText.match(/<dest>([\s\S]*?)<\/dest>/)
    const receiver = destMatch ? destMatch[1].match(/<xNome>([^<]+)<\/xNome>/)?.[1] || 'N/A' : 'N/A'
    const receiverCNPJ = destMatch ? (destMatch[1].match(/<CNPJ>([^<]+)<\/CNPJ>/)?.[1] || destMatch[1].match(/<CPF>([^<]+)<\/CPF>/)?.[1] || 'N/A') : 'N/A'

    // Differentiate Entrada vs Saída
    const tpNF = getValue('tpNF') || '1' // 0 = Entrada, 1 = Saída
    const type = tpNF === '0' ? 'ENTRADA' : 'SAÍDA'

    // Extract total value
    const vNF = Number(getValue('vNF') || 0)

    // Extract taxes from base tags
    const icms = Number(getValue('vICMS') || 0)
    const ipi = Number(getValue('vIPI') || 0)
    const pis = Number(getValue('vPIS') || 0)
    const cofins = Number(getValue('vCOFINS') || 0)

    // Extract Freight
    const freight = Number(getValue('vFrete') || 0)

    // Extract items
    const items: Array<{ desc: string; qty: number; unitPrice: number; total: number }> = []
    const detMatches = xmlText.match(/<det\b[\s\S]*?<\/det>/g) || []
    
    detMatches.forEach((detXml) => {
      const desc = detXml.match(/<xProd>([^<]+)<\/xProd>/)?.[1] || 'Produto'
      const qty = Number(detXml.match(/<qCom>([^<]+)<\/qCom>/)?.[1] || 1)
      const unitPrice = Number(detXml.match(/<vUnCom>([^<]+)<\/vUnCom>/)?.[1] || 0)
      const total = Number(detXml.match(/<vProd>([^<]+)<\/vProd>/)?.[1] || 0)
      items.push({ desc, qty, unitPrice, total })
    })

    return {
      nNF,
      date: dhEmi.slice(0, 10),
      issuer,
      receiver,
      receiverCNPJ,
      value: vNF,
      items,
      type,
      freight,
      icms,
      ipi,
      pis,
      cofins
    }
  } catch (err) {
    console.error('Error parsing XML', err)
    return null
  }
}

type CompanyProfile = 'SERVICES' | 'COMMERCE' | 'INDUSTRY'

type Company = {
  id: string
  name: string
  cnpj: string
  profile: CompanyProfile
}

type Invoice = {
  id: string
  number: string
  date: string
  client: string
  value: number
  profile: CompanyProfile
  items: Array<{ desc: string; qty: number; unitPrice: number; total: number }>
  type: 'ENTRADA' | 'SAÍDA'
  freight: number
  icms: number
  ipi: number
  pis: number
  cofins: number
}

export default function ERPPortal() {
  const { language, t } = useLanguage()

  // --- 1. Authenticaton States ---
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [authTab, setAuthTab] = useState<'login' | 'signup' | 'forgot'>('login')
  const [authEmail, setAuthEmail] = useState('')
  const [authPassword, setAuthPassword] = useState('')
  const [authName, setAuthName] = useState('')
  const [authFeedback, setAuthFeedback] = useState('')

  // --- 2. Multi-company States ---
  const [companies, setCompanies] = useState<Company[]>([
    { id: '1', name: 'Alfa Serviços de Tecnologia Ltda', cnpj: '12.345.678/0001-90', profile: 'SERVICES' },
    { id: '2', name: 'Beta Varejo de Eletrônicos Eireli', cnpj: '98.765.432/0001-10', profile: 'COMMERCE' },
    { id: '3', name: 'Gama Metalúrgica e Fundição S/A', cnpj: '45.678.901/0001-22', profile: 'INDUSTRY' }
  ])
  const [activeCompanyId, setActiveCompanyId] = useState('1')
  const [showAddCompanyModal, setShowAddCompanyModal] = useState(false)
  const [newCompanyName, setNewCompanyName] = useState('')
  const [newCompanyCNPJ, setNewCompanyCNPJ] = useState('')
  const [newCompanyProfile, setNewCompanyProfile] = useState<CompanyProfile>('SERVICES')

  // --- 3. Dashboard Data States (Loaded from LocalStorage or populated with defaults) ---
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'xml' | 'integrations' | 'inventory' | 'reports' | 'kpis' | 'architecture'>('dashboard')

  // --- ERP Architecture & Specifications States ---
  const [architectureSubTab, setArchitectureSubTab] = useState<'mer' | 'costing' | 'roles' | 'tax' | 'api'>('mer')
  const [apiEndpoint, setApiEndpoint] = useState<'create_bp' | 'get_bp' | 'create_item' | 'post_movement'>('create_bp')
  const [apiRequestBody, setApiRequestBody] = useState<string>('')
  const [apiResponseStatus, setApiResponseStatus] = useState<string>('')
  const [apiResponseBody, setApiResponseBody] = useState<string>('')
  const [apiResponseSql, setApiResponseSql] = useState<string>('')

  // Synchronize API request body templates
  useEffect(() => {
    if (apiEndpoint === 'create_bp') {
      setApiRequestBody(JSON.stringify({
        cnpj: '60.701.190/0001-04',
        name: 'Banco Itaú Unibanco S/A',
        tradeName: 'Itaú',
        ie: '110220330111',
        email: 'contato@itau.com.br',
        phone: '(11) 3003-4828',
        address: 'Praça Alfredo Egydio de Souza Aranha, 100 - SP',
        segment: 'Financeiro',
        isClient: true,
        isSupplier: false,
        isEmployee: false,
        creditLimit: 500000
      }, null, 2))
    } else if (apiEndpoint === 'get_bp') {
      setApiRequestBody('/* GET requests do not require a request body */')
    } else if (apiEndpoint === 'create_item') {
      setApiRequestBody(JSON.stringify({
        code: 'P005',
        name: 'Insumo Chapa de Zinco',
        group: 'Metais',
        family: 'Zinco',
        subfamily: 'Laminados',
        sector: 'Industrial',
        cost: 450,
        price: 900,
        ncm: '7905.00.00',
        cest: '10.001.00',
        origin: '0'
      }, null, 2))
    } else if (apiEndpoint === 'post_movement') {
      setApiRequestBody(JSON.stringify({
        type: 'ENTRADA',
        number: '12847',
        skuCode: 'P001',
        qty: 20,
        unitPrice: 1900,
        freight: 120,
        insurance: 30,
        ipi: 150,
        nonRecoverable: 200,
        discount: 50
      }, null, 2))
    }
  }, [apiEndpoint])

  const [simBasePrice, setSimBasePrice] = useState<number>(1200)
  const [simFreight, setSimFreight] = useState<number>(150)
  const [simInsurance, setSimInsurance] = useState<number>(30)
  const [simIPI, setSimIPI] = useState<number>(120)
  const [simNonRecoverable, setSimNonRecoverable] = useState<number>(180)
  const [simDiscount, setSimDiscount] = useState<number>(60)
  const [simQty, setSimQty] = useState<number>(15)
  const [simPrevQty, setSimPrevQty] = useState<number>(40)
  const [simPrevCMP, setSimPrevCMP] = useState<number>(85)
  const [sqlDialect, setSqlDialect] = useState<'postgresql' | 'sqlserver' | 'oracle'>('postgresql')
  const [bpRoleFilter, setBpRoleFilter] = useState<'all' | 'customer' | 'supplier'>('all')
  const [simNcm, setSimNcm] = useState<string>('8471.30.12')
  const [simOriginUf, setSimOriginUf] = useState<string>('SP')
  const [simDestUf, setSimDestUf] = useState<string>('RJ')
  const [simBuyerProfile, setSimBuyerProfile] = useState<'revenda' | 'consumo'>('revenda')
  
  // --- Product Inventory & Intelligent Spreadsheet Importer ---
  const [products, setProducts] = useState<Array<{
    code: string
    name: string
    group: string
    family: string
    subfamily: string
    sector: string
    cost: number
    price: number
  }>>([])

  // CSV Spreadsheet Parsing
  const [csvHeaders, setCsvHeaders] = useState<string[]>([])
  const [csvRows, setCsvRows] = useState<string[][]>([])
  const [columnMappings, setColumnMappings] = useState<Record<string, string>>({
    code: '',
    name: '',
    group: '',
    family: '',
    subfamily: '',
    sector: '',
    cost: '',
    price: '',
    cnpj: '',
    ie: '',
    tradeName: '',
    email: '',
    phone: '',
    address: '',
    segment: '',
    creditLimit: ''
  })
  const [isMappingActive, setIsMappingActive] = useState(false)
  const [importFeedback, setImportFeedback] = useState('')

  // Sub-tabs inside Cadastro
  const [productsSubTab, setProductsSubTab] = useState<'products' | 'customers'>('products')
  const [reportsSubTab, setReportsSubTab] = useState<'charts' | 'copilot'>('charts')
  const [copilotText, setCopilotText] = useState('')
  const [copilotResult, setCopilotResult] = useState<any>(null)
  const [kpisSubTab, setKpisSubTab] = useState<'layers' | 'dre' | 'erpModules'>('layers')
  const [activeERPModules, setActiveERPModules] = useState<string[]>([
    'faturamento', 'suprimentos', 'financeiro', 'contabil', 'estoque'
  ])

  // Unified Business Partner Registry List (S/4HANA Master Data concept)
  const [businessPartners, setBusinessPartners] = useState<Array<{
    id: string
    cnpj: string
    name: string
    tradeName: string
    ie: string
    email: string
    phone: string
    address: string
    segment: string
    status: 'ACTIVE' | 'INACTIVE'
    isClient: boolean
    isSupplier: boolean
    isEmployee: boolean
    creditLimit?: number
    leadTime?: number
    bankData?: string
    salary?: number
    department?: string
  }>>([])

  // Computed Customers array for backwards-compatibility across the app
  const customers = useMemo(() => {
    return businessPartners.filter(bp => bp.isClient)
  }, [businessPartners])

  // Business Partner form extension states
  const [custIsClient, setCustIsClient] = useState(true)
  const [custIsSupplier, setCustIsSupplier] = useState(false)
  const [custIsEmployee, setCustIsEmployee] = useState(false)
  const [custLeadTime, setCustLeadTime] = useState(15)
  const [custBankData, setCustBankData] = useState('')
  const [custSalary, setCustSalary] = useState(0)
  const [custDepartment, setCustDepartment] = useState('')

  // Unified directory view filters
  const [directoryRoleFilter, setDirectoryRoleFilter] = useState<'all' | 'client' | 'supplier' | 'employee'>('all')
  const filteredBPs = useMemo(() => {
    return businessPartners.filter(bp => {
      if (directoryRoleFilter === 'client') return bp.isClient
      if (directoryRoleFilter === 'supplier') return bp.isSupplier
      if (directoryRoleFilter === 'employee') return bp.isEmployee
      return true
    })
  }, [businessPartners, directoryRoleFilter])

  // Modal Product states
  const [showProductModal, setShowProductModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<{
    code: string
    name: string
    group: string
    family: string
    subfamily: string
    sector: string
    cost: number
    price: number
  } | null>(null)

  // Product form states
  const [prodCode, setProdCode] = useState('')
  const [prodName, setProdName] = useState('')
  const [prodGroup, setProdGroup] = useState('')
  const [prodFamily, setProdFamily] = useState('')
  const [prodSubfamily, setProdSubfamily] = useState('')
  const [prodSector, setProdSector] = useState('')
  const [prodCost, setProdCost] = useState(0)
  const [prodPrice, setProdPrice] = useState(0)

  // Modal Customer states
  const [showCustomerModal, setShowCustomerModal] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<{
    id: string
    cnpj: string
    name: string
    tradeName: string
    ie: string
    email: string
    phone: string
    address: string
    segment: string
    creditLimit: number
    status: 'ACTIVE' | 'INACTIVE'
  } | null>(null)

  // Customer form states
  const [custCnpj, setCustCnpj] = useState('')
  const [custName, setCustName] = useState('')
  const [custTradeName, setCustTradeName] = useState('')
  const [custIe, setCustIe] = useState('')
  const [custEmail, setCustEmail] = useState('')
  const [custPhone, setCustPhone] = useState('')
  const [custAddress, setCustAddress] = useState('')
  const [custSegment, setCustSegment] = useState('')
  const [custCreditLimit, setCustCreditLimit] = useState(0)
  const [custStatus, setCustStatus] = useState<'ACTIVE' | 'INACTIVE'>('ACTIVE')

  // --- 4. XML Parsing drag-and-drop feedback ---
  const [xmlStatus, setXmlStatus] = useState<string>('')
  const [isDragging, setIsDragging] = useState(false)

  // --- 5. Integration States ---
  const [bqProjectId, setBqProjectId] = useState('jorgetelles-bi-analytics')
  const [bqDataset, setBqDataset] = useState('controladoria_realtime')
  const [bqKeyName, setBqKeyName] = useState('')
  const [apiSecretKey, setApiSecretKey] = useState('')
  const [isBqConnected, setIsBqConnected] = useState(false)

  // --- 5.5. FP&A Reports States ---
  const [repStartDate, setRepStartDate] = useState('2026-01-01')
  const [repEndDate, setRepEndDate] = useState('2026-12-31')

  // --- 6. Draggable & Resizable Widget Layout ---
  const [widgets, setWidgets] = useState<Array<{ id: string; type: string; colSpan: number }>>([
    { id: 'w1', type: 'kpi-billing', colSpan: 1 },
    { id: 'w2', type: 'kpi-count', colSpan: 1 },
    { id: 'w3', type: 'kpi-profile', colSpan: 1 },
    { id: 'w4', type: 'chart-products', colSpan: 2 },
    { id: 'w5', type: 'chart-clients', colSpan: 1 },
    { id: 'w7', type: 'advanced-cmv', colSpan: 3 },
    { id: 'w8', type: 'family-margins', colSpan: 3 },
    { id: 'w9', type: 'top-20-clients', colSpan: 3 },
    { id: 'w10', type: 'break-even-analysis', colSpan: 3 },
    { id: 'w6', type: 'table-invoices', colSpan: 3 }
  ])

  const resizeWidget = (id: string, action: 'grow' | 'shrink') => {
    setWidgets(prev => prev.map(w => {
      if (w.id === id) {
        let nextSpan = w.colSpan
        if (action === 'grow' && w.colSpan < 3) nextSpan += 1
        if (action === 'shrink' && w.colSpan > 1) nextSpan -= 1
        return { ...w, colSpan: nextSpan }
      }
      return w
    }))
  }

  const moveWidget = (index: number, direction: 'left' | 'right') => {
    const next = [...widgets]
    if (direction === 'left' && index > 0) {
      const temp = next[index]
      next[index] = next[index - 1]
      next[index - 1] = temp
    } else if (direction === 'right' && index < next.length - 1) {
      const temp = next[index]
      next[index] = next[index + 1]
      next[index + 1] = temp
    }
    setWidgets(next)
  }

  const renderWidgetControls = (w: any, index: number) => {
    return (
      <div className="flex items-center gap-1 bg-slate-50 border border-slate-100 rounded-lg p-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 select-none">
        <span className="text-[9px] font-bold text-slate-400 px-1.5 uppercase tracking-wider cursor-grab active:cursor-grabbing">
          ✥
        </span>
        <button
          type="button"
          onClick={() => moveWidget(index, 'left')}
          disabled={index === 0}
          className="rounded p-0.5 hover:bg-slate-200/85 disabled:opacity-35"
          title={t({ pt: 'Mover para esquerda', en: 'Move left' })}
        >
          <ArrowLeft className="h-3 w-3 text-slate-500" />
        </button>
        <button
          type="button"
          onClick={() => moveWidget(index, 'right')}
          disabled={index === widgets.length - 1}
          className="rounded p-0.5 hover:bg-slate-200/85 disabled:opacity-35"
          title={t({ pt: 'Mover para direita', en: 'Move right' })}
        >
          <ArrowRight className="h-3 w-3 text-slate-500" />
        </button>
        <span className="h-3 w-px bg-slate-200 mx-0.5" />
        <button
          type="button"
          onClick={() => resizeWidget(w.id, 'shrink')}
          disabled={w.colSpan === 1}
          className="rounded p-0.5 hover:bg-slate-200/85 disabled:opacity-35"
          title={t({ pt: 'Reduzir tamanho', en: 'Shrink width' })}
        >
          <Minimize2 className="h-3 w-3 text-slate-500" />
        </button>
        <button
          type="button"
          onClick={() => resizeWidget(w.id, 'grow')}
          disabled={w.colSpan === 3}
          className="rounded p-0.5 hover:bg-slate-200/85 disabled:opacity-35"
          title={t({ pt: 'Aumentar tamanho', en: 'Expand width' })}
        >
          <Maximize2 className="h-3 w-3 text-slate-500" />
        </button>
      </div>
    )
  }

  const activeCompany = companies.find(c => c.id === activeCompanyId) || companies[0]

  // Initialize DB with seed data
  useEffect(() => {
    const savedInvoices = localStorage.getItem('erp_invoices')
    const savedCompanies = localStorage.getItem('erp_companies')
    
    if (savedCompanies) {
      setCompanies(JSON.parse(savedCompanies))
    }

    const savedProducts = localStorage.getItem('erp_products')
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts))
    } else {
      const defaultProducts = [
        { code: 'P001', name: 'Smartphone Modelo X1', group: 'Tecnologia', family: 'Smartphones', subfamily: 'Mobile', sector: 'Eletro', cost: 1800, price: 3000 },
        { code: 'P002', name: 'Notebook Ultra Z', group: 'Tecnologia', family: 'Computadores', subfamily: 'Portáteis', sector: 'Eletro', cost: 3000, price: 5000 },
        { code: 'P003', name: 'Bobina de Cobre Trefilado', group: 'Metais', family: 'Cobre', subfamily: 'Trefilados', sector: 'Industrial', cost: 12000, price: 24500 },
        { code: 'P004', name: 'Aço Carbono Chapa Estampada', group: 'Metais', family: 'Aço', subfamily: 'Laminados', sector: 'Industrial', cost: 2000, price: 4000 }
      ]
      setProducts(defaultProducts)
      localStorage.setItem('erp_products', JSON.stringify(defaultProducts))
    }

    const savedBPs = localStorage.getItem('erp_business_partners')
    if (savedBPs) {
      setBusinessPartners(JSON.parse(savedBPs))
    } else {
      const defaultBPs = [
        { id: 'c1', cnpj: '60.701.190/0001-04', name: 'Banco Itaú Unibanco S/A', tradeName: 'Itaú', ie: '110.220.330.111', email: 'contato@itau.com.br', phone: '(11) 3003-4828', address: 'Praça Alfredo Egydio de Souza Aranha, 100 - São Paulo/SP', segment: 'Financeiro', status: 'ACTIVE' as const, isClient: true, isSupplier: false, isEmployee: false, creditLimit: 5000000 },
        { id: 'c2', cnpj: '07.526.557/0001-00', name: 'Ambev S/A', tradeName: 'Ambev', ie: '220.330.440.222', email: 'financeiro@ambev.com.br', phone: '(11) 2122-2000', address: 'Rua Dr. Renato Paes de Barros, 1017 - São Paulo/SP', segment: 'Bebidas', status: 'ACTIVE' as const, isClient: true, isSupplier: false, isEmployee: false, creditLimit: 2500000 },
        { id: 'c3', cnpj: '33.014.556/0001-96', name: 'Lojas Americanas S/A', tradeName: 'Americanas', ie: '330.440.550.333', email: 'fiscal@americanas.com.br', phone: '(21) 2206-6300', address: 'Rua Sacadura Cabral, 102 - Rio de Janeiro/RJ', segment: 'Varejo', status: 'ACTIVE' as const, isClient: true, isSupplier: false, isEmployee: false, creditLimit: 1200000 },
        { id: 's1', cnpj: '84.823.501/0001-70', name: 'WEG Equipamentos Elétricos S/A', tradeName: 'WEG', ie: '440.550.660.444', email: 'vendas@weg.com.br', phone: '(47) 3276-4000', address: 'Avenida Prefeito Waldemar Grubba, 3300 - Jaraguá do Sul/SC', segment: 'Elétrico', status: 'ACTIVE' as const, isClient: false, isSupplier: true, isEmployee: false, leadTime: 12, bankData: 'Banco do Brasil Ag: 1234 CC: 5678-9' }
      ]
      setBusinessPartners(defaultBPs)
      localStorage.setItem('erp_business_partners', JSON.stringify(defaultBPs))
    }
    
    let shouldSeed = true
    if (savedInvoices) {
      try {
        const parsed = JSON.parse(savedInvoices)
        if (parsed.length > 0 && parsed[0].type) {
          setInvoices(parsed)
          shouldSeed = false
        }
      } catch (e) {
        console.error('Migration failed, re-seeding...', e)
      }
    }

    if (shouldSeed) {
      // Seed default transactions with explicit type, freight and taxes
      const seeds: Invoice[] = [
        { id: 'i1', number: '1023', date: '2026-06-10', client: 'Banco Itaú Unibanco S/A', value: 120000, profile: 'SERVICES', items: [{ desc: 'Consultoria FP&A Mensal', qty: 1, unitPrice: 120000, total: 120000 }], type: 'SAÍDA', freight: 0, icms: 0, ipi: 0, pis: 1980, cofins: 9120 },
        { id: 'i2', number: '1024', date: '2026-06-14', client: 'Ambev S/A', value: 85000, profile: 'SERVICES', items: [{ desc: 'Integração Dashboard Power BI', qty: 1, unitPrice: 85000, total: 85000 }], type: 'SAÍDA', freight: 0, icms: 0, ipi: 0, pis: 1402, cofins: 6460 },
        { id: 'i3', number: '54902', date: '2026-06-18', client: 'Lojas Americanas', value: 45000, profile: 'COMMERCE', items: [{ desc: 'Smartphone Modelo X1', qty: 15, unitPrice: 3000, total: 45000 }], type: 'SAÍDA', freight: 1200, icms: 8100, ipi: 0, pis: 742, cofins: 3420 },
        { id: 'i4', number: '54903', date: '2026-06-20', client: 'Magazine Luiza S/A', value: 135000, profile: 'COMMERCE', items: [{ desc: 'Notebook Ultra Z', qty: 27, unitPrice: 5000, total: 135000 }], type: 'SAÍDA', freight: 3500, icms: 24300, ipi: 0, pis: 2227, cofins: 10260 },
        { id: 'i4_in', number: '30922', date: '2026-06-12', client: 'Distribuidora Tech BR', value: 90000, profile: 'COMMERCE', items: [{ desc: 'Lote Reposição Notebooks', qty: 20, unitPrice: 4500, total: 90000 }], type: 'ENTRADA', freight: 4200, icms: 16200, ipi: 0, pis: 1485, cofins: 6840 },
        { id: 'i5', number: '8910', date: '2026-06-22', client: 'WEG Equipamentos Elétricos', value: 245000, profile: 'INDUSTRY', items: [{ desc: 'Bobina de Cobre Trefilado', qty: 10, unitPrice: 24500, total: 245000 }], type: 'SAÍDA', freight: 6500, icms: 44100, ipi: 12250, pis: 4042, cofins: 18620 },
        { id: 'i5_in', number: '5021', date: '2026-06-15', client: 'Mineração Vale do Sul', value: 110000, profile: 'INDUSTRY', items: [{ desc: 'Insumo Cobre Bruto', qty: 50, unitPrice: 2200, total: 110000 }], type: 'ENTRADA', freight: 8500, icms: 19800, ipi: 5500, pis: 1815, cofins: 8360 },
        { id: 'i6', number: '8911', date: '2026-06-25', client: 'Gerdau Metalurgia', value: 180000, profile: 'INDUSTRY', items: [{ desc: 'Aço Carbono Chapa Estampada', qty: 45, unitPrice: 4000, total: 180000 }], type: 'SAÍDA', freight: 4800, icms: 32400, ipi: 9000, pis: 2970, cofins: 13680 }
      ]
      setInvoices(seeds)
      localStorage.setItem('erp_invoices', JSON.stringify(seeds))
    }
  }, [])

  // Handle Login simulation
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (!authEmail || !authPassword) {
      setAuthFeedback(t({ pt: 'Preencha todos os campos.', en: 'Fill all fields.' }))
      return
    }
    setIsLoggedIn(true)
    setAuthFeedback('')
  }

  // Handle Register simulation
  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault()
    if (!authName || !authEmail || !authPassword) {
      setAuthFeedback(t({ pt: 'Preencha todos os campos.', en: 'Fill all fields.' }))
      return
    }
    setAuthFeedback(t({ pt: 'Conta simulada criada! Acesse com seu login.', en: 'Simulated account created! Log in to access.' }))
    setAuthTab('login')
  }

  // Handle Register simulation
  const handleForgot = (e: React.FormEvent) => {
    e.preventDefault()
    if (!authEmail) {
      setAuthFeedback(t({ pt: 'Digite seu e-mail cadastrado.', en: 'Provide your email.' }))
      return
    }
    setAuthFeedback(t({ pt: 'Link de redefinição enviado ao e-mail informado.', en: 'Reset link sent to your email.' }))
  }

  // Register a new company inside the tenant profile
  const handleAddCompany = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCompanyName || !newCompanyCNPJ) return
    
    const newComp: Company = {
      id: Date.now().toString(),
      name: newCompanyName,
      cnpj: newCompanyCNPJ,
      profile: newCompanyProfile
    }

    const updated = [...companies, newComp]
    setCompanies(updated)
    localStorage.setItem('erp_companies', JSON.stringify(updated))
    setActiveCompanyId(newComp.id)
    setShowAddCompanyModal(false)
    setNewCompanyName('')
    setNewCompanyCNPJ('')
  }

  // Handle XML File uploads & parsing
  const handleXMLFile = (file: File) => {
    if (!file.name.endsWith('.xml')) {
      setXmlStatus(t({ pt: 'Apenas arquivos XML são permitidos.', en: 'Only XML files are permitted.' }))
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      const data = parseNFeXML(text)
      
      if (!data) {
        setXmlStatus(t({ pt: 'XML inválido ou NF-e não reconhecida.', en: 'Invalid XML or NF-e not recognized.' }))
        return
      }

      const newInv: Invoice = {
        id: `xml-${Date.now()}`,
        number: data.nNF,
        date: data.date,
        client: data.receiver !== 'N/A' ? data.receiver : data.issuer,
        value: data.value,
        profile: activeCompany.profile,
        items: data.items,
        type: data.type as 'ENTRADA' | 'SAÍDA',
        freight: data.freight,
        icms: data.icms,
        ipi: data.ipi,
        pis: data.pis,
        cofins: data.cofins
      }

      const updated = [newInv, ...invoices]
      setInvoices(updated)
      localStorage.setItem('erp_invoices', JSON.stringify(updated))
      setXmlStatus(t({
        pt: `✅ NF-e nº ${data.nNF} importada com sucesso! Cliente: ${newInv.client}. Valor: ${formatCurrency(data.value)}`,
        en: `✅ NF-e #${data.nNF} successfully imported! Client: ${newInv.client}. Total: ${formatCurrency(data.value)}`
      }))
    }
    reader.readAsText(file)
  }

  const handleCSVUpload = (file: File) => {
    if (!file.name.endsWith('.csv') && !file.name.endsWith('.txt')) {
      setImportFeedback(t({ pt: 'Formato inválido. Apenas .csv ou .txt.', en: 'Invalid format. Use CSV or TXT.' }))
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0)
      if (lines.length === 0) return

      // Parse headers from the first row
      const headers = lines[0].split(/[;,\t]/).map(h => h.trim().replace(/^["']|["']$/g, ''))
      const rows = lines.slice(1).map(row => 
        row.split(/[;,\t]/).map(cell => cell.trim().replace(/^["']|["']$/g, ''))
      )

      setCsvHeaders(headers)
      setCsvRows(rows)
      
      // Auto-match headers depending on selected directory
      const initialMap = productsSubTab === 'products' ? {
        code: headers.find(h => /cod|sku|id/i.test(h)) || '',
        name: headers.find(h => /nome|desc|prod/i.test(h)) || '',
        group: headers.find(h => /grup/i.test(h)) || '',
        family: headers.find(h => /famil/i.test(h)) || '',
        subfamily: headers.find(h => /sub/i.test(h)) || '',
        sector: headers.find(h => /setor|segm/i.test(h)) || '',
        cost: headers.find(h => /cust|comp/i.test(h)) || '',
        price: headers.find(h => /prec|vend/i.test(h)) || '',
        cnpj: '', ie: '', tradeName: '', email: '', phone: '', address: '', segment: '', creditLimit: ''
      } : {
        code: '', name: headers.find(h => /razao|razão|nome|client|empresa/i.test(h)) || '', group: '', family: '', subfamily: '', sector: '', cost: '', price: '',
        cnpj: headers.find(h => /cnpj/i.test(h)) || '',
        ie: headers.find(h => /ie|insc/i.test(h)) || '',
        tradeName: headers.find(h => /fantasia|trade/i.test(h)) || '',
        email: headers.find(h => /email|e-mail/i.test(h)) || '',
        phone: headers.find(h => /tel|fone/i.test(h)) || '',
        address: headers.find(h => /end|rua/i.test(h)) || '',
        segment: headers.find(h => /seg|ramo/i.test(h)) || '',
        creditLimit: headers.find(h => /limit|cred/i.test(h)) || ''
      }
      setColumnMappings(initialMap)
      setIsMappingActive(true)
      setImportFeedback('')
    }
    reader.readAsText(file)
  }

  const executeCSVImport = () => {
    if (productsSubTab === 'products') {
      // Check if critical columns are mapped
      if (!columnMappings.code || !columnMappings.name || !columnMappings.price) {
        setImportFeedback(t({ pt: 'Código, Nome e Preço de Venda são obrigatórios.', en: 'Code, Name, and Price are required mapping targets.' }))
        return
      }

      const idxCode = csvHeaders.indexOf(columnMappings.code)
      const idxName = csvHeaders.indexOf(columnMappings.name)
      const idxGroup = csvHeaders.indexOf(columnMappings.group)
      const idxFamily = csvHeaders.indexOf(columnMappings.family)
      const idxSubfamily = csvHeaders.indexOf(columnMappings.subfamily)
      const idxSector = csvHeaders.indexOf(columnMappings.sector)
      const idxCost = csvHeaders.indexOf(columnMappings.cost)
      const idxPrice = csvHeaders.indexOf(columnMappings.price)

      const importedProducts = csvRows.map((row) => {
        return {
          code: row[idxCode] || `P${Math.floor(100 + Math.random() * 899)}`,
          name: row[idxName] || 'Desconhecido',
          group: idxGroup >= 0 ? row[idxGroup] || 'Geral' : 'Geral',
          family: idxFamily >= 0 ? row[idxFamily] || 'Outros' : 'Outros',
          subfamily: idxSubfamily >= 0 ? row[idxSubfamily] || 'Diversos' : 'Diversos',
          sector: idxSector >= 0 ? row[idxSector] || 'Geral' : 'Geral',
          cost: idxCost >= 0 ? Number(row[idxCost]?.replace(/[^\d.,]/g, '').replace(',', '.')) || 0 : 0,
          price: idxPrice >= 0 ? Number(row[idxPrice]?.replace(/[^\d.,]/g, '').replace(',', '.')) || 0 : 0
        }
      })

      const updated = [...products, ...importedProducts]
      setProducts(updated)
      localStorage.setItem('erp_products', JSON.stringify(updated))
      setIsMappingActive(false)
      setImportFeedback(t({
        pt: `✅ Planilha importada com sucesso! ${importedProducts.length} produtos cadastrados.`,
        en: `✅ Spreadsheet imported! ${importedProducts.length} products successfully registered.`
      }))
    } else {
      // Import customers
      if (!columnMappings.cnpj || !columnMappings.name) {
        setImportFeedback(t({ pt: 'CNPJ e Razão Social são obrigatórios para importação.', en: 'CNPJ and Corporate Name are required mapping targets.' }))
        return
      }

      const idxCnpj = csvHeaders.indexOf(columnMappings.cnpj)
      const idxName = csvHeaders.indexOf(columnMappings.name)
      const idxTradeName = csvHeaders.indexOf(columnMappings.tradeName)
      const idxIe = csvHeaders.indexOf(columnMappings.ie)
      const idxEmail = csvHeaders.indexOf(columnMappings.email)
      const idxPhone = csvHeaders.indexOf(columnMappings.phone)
      const idxAddress = csvHeaders.indexOf(columnMappings.address)
      const idxSegment = csvHeaders.indexOf(columnMappings.segment)
      const idxCreditLimit = csvHeaders.indexOf(columnMappings.creditLimit)

      const importedCustomers = csvRows.map((row) => {
        return {
          id: `c-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
          cnpj: row[idxCnpj] || '',
          name: row[idxName] || 'Desconhecido',
          tradeName: idxTradeName >= 0 ? row[idxTradeName] || '' : '',
          ie: idxIe >= 0 ? row[idxIe] || 'ISENTO' : 'ISENTO',
          email: idxEmail >= 0 ? row[idxEmail] || '' : '',
          phone: idxPhone >= 0 ? row[idxPhone] || '' : '',
          address: idxAddress >= 0 ? row[idxAddress] || '' : '',
          segment: idxSegment >= 0 ? row[idxSegment] || 'Geral' : 'Geral',
          creditLimit: idxCreditLimit >= 0 ? Number(row[idxCreditLimit]?.replace(/[^\d.,]/g, '').replace(',', '.')) || 0 : 0,
          status: 'ACTIVE' as const
        }
      })

      const importedBPs = importedCustomers.map((c) => ({
        ...c,
        isClient: true,
        isSupplier: false,
        isEmployee: false
      }))
      const updated = [...businessPartners, ...importedBPs]
      setBusinessPartners(updated)
      localStorage.setItem('erp_business_partners', JSON.stringify(updated))
      setIsMappingActive(false)
      setImportFeedback(t({
        pt: `✅ Planilha importada com sucesso! ${importedCustomers.length} entidades de Clientes cadastradas no Diretório de Parceiros.`,
        en: `✅ Spreadsheet imported! ${importedCustomers.length} Customer entities successfully registered in the Business Partner Directory.`
      }))
    }
  }

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault()
    const newProd = {
      code: prodCode.trim() || `P${Math.floor(100 + Math.random() * 899)}`,
      name: prodName.trim(),
      group: prodGroup.trim() || 'Geral',
      family: prodFamily.trim() || 'Outros',
      subfamily: prodSubfamily.trim() || 'Diversos',
      sector: prodSector.trim() || 'Geral',
      cost: Number(prodCost) || 0,
      price: Number(prodPrice) || 0
    }

    let updatedList = []
    if (editingProduct) {
      // Update
      updatedList = products.map(p => p.code === editingProduct.code ? newProd : p)
    } else {
      // Insert
      // Avoid duplicate keys
      if (products.some(p => p.code === newProd.code)) {
        alert(t({ pt: 'Já existe um produto cadastrado com este SKU/Código.', en: 'A product with this SKU/Code already exists.' }))
        return
      }
      updatedList = [...products, newProd]
    }

    setProducts(updatedList)
    localStorage.setItem('erp_products', JSON.stringify(updatedList))
    setShowProductModal(false)
    setEditingProduct(null)
    clearProductForm()
  }

  const clearProductForm = () => {
    setProdCode('')
    setProdName('')
    setProdGroup('')
    setProdFamily('')
    setProdSubfamily('')
    setProdSector('')
    setProdCost(0)
    setProdPrice(0)
  }

  const handleEditProductClick = (p: any) => {
    setEditingProduct(p)
    setProdCode(p.code)
    setProdName(p.name)
    setProdGroup(p.group)
    setProdFamily(p.family)
    setProdSubfamily(p.subfamily)
    setProdSector(p.sector)
    setProdCost(p.cost)
    setProdPrice(p.price)
    setShowProductModal(true)
  }

  const handleDeleteProduct = (code: string) => {
    if (confirm(t({ pt: 'Tem certeza que deseja excluir este produto?', en: 'Are you sure you want to delete this product?' }))) {
      const updated = products.filter(p => p.code !== code)
      setProducts(updated)
      localStorage.setItem('erp_products', JSON.stringify(updated))
    }
  }

  // Strict Brazil CNPJ Modulus 11 Validator
  const validateCNPJ = (cnpj: string): boolean => {
    const clean = cnpj.replace(/[^\d]/g, '')
    if (clean.length !== 14) return false
    if (/^(\d)\1+$/.test(clean)) return false
    
    // Calculate first digit
    let size = 12
    let numbers = clean.substring(0, size)
    const digits = clean.substring(size)
    let sum = 0
    let pos = size - 7
    for (let i = size; i >= 1; i--) {
      sum += Number(numbers.charAt(size - i)) * pos--
      if (pos < 2) pos = 9
    }
    let result = sum % 11 < 2 ? 0 : 11 - (sum % 11)
    if (result !== Number(digits.charAt(0))) return false
    
    // Calculate second digit
    size = 13
    numbers = clean.substring(0, size)
    sum = 0
    pos = size - 7
    for (let i = size; i >= 1; i--) {
      sum += Number(numbers.charAt(size - i)) * pos--
      if (pos < 2) pos = 9
    }
    result = sum % 11 < 2 ? 0 : 11 - (sum % 11)
    if (result !== Number(digits.charAt(1))) return false
    
    return true
  }

  const handleSaveCustomer = (e: React.FormEvent) => {
    e.preventDefault()
    
    // CNPJ Check
    if (!validateCNPJ(custCnpj)) {
      alert(t({
        pt: '❌ CNPJ inválido de acordo com a validação do Módulo 11 fiscal. Favor inserir um CNPJ real e válido.',
        en: '❌ Invalid CNPJ. The check digit failed fiscal Modulus 11 validation. Please enter a valid CNPJ.'
      }))
      return
    }

    const newBP = {
      id: editingCustomer ? editingCustomer.id : `bp-${Date.now()}`,
      cnpj: custCnpj.trim(),
      name: custName.trim(),
      tradeName: custTradeName.trim(),
      ie: custIe.trim() || 'ISENTO',
      email: custEmail.trim(),
      phone: custPhone.trim(),
      address: custAddress.trim(),
      segment: custSegment.trim() || 'Geral',
      status: custStatus,
      isClient: custIsClient,
      isSupplier: custIsSupplier,
      isEmployee: custIsEmployee,
      creditLimit: custIsClient ? Number(custCreditLimit) || 0 : undefined,
      leadTime: custIsSupplier ? Number(custLeadTime) || 15 : undefined,
      bankData: custIsSupplier ? custBankData.trim() : undefined,
      salary: custIsEmployee ? Number(custSalary) || 0 : undefined,
      department: custIsEmployee ? custDepartment.trim() : undefined
    }

    let updatedList = []
    if (editingCustomer) {
      updatedList = businessPartners.map(bp => bp.id === editingCustomer.id ? newBP : bp)
    } else {
      updatedList = [...businessPartners, newBP]
    }

    setBusinessPartners(updatedList)
    localStorage.setItem('erp_business_partners', JSON.stringify(updatedList))
    setShowCustomerModal(false)
    setEditingCustomer(null)
    clearCustomerForm()
  }

  const clearCustomerForm = () => {
    setCustCnpj('')
    setCustName('')
    setCustTradeName('')
    setCustIe('')
    setCustEmail('')
    setCustPhone('')
    setCustAddress('')
    setCustSegment('')
    setCustCreditLimit(0)
    setCustStatus('ACTIVE')
    setCustIsClient(true)
    setCustIsSupplier(false)
    setCustIsEmployee(false)
    setCustLeadTime(15)
    setCustBankData('')
    setCustSalary(0)
    setCustDepartment('')
  }

  const handleEditCustomerClick = (c: any) => {
    setEditingCustomer(c)
    setCustCnpj(c.cnpj)
    setCustName(c.name)
    setCustTradeName(c.tradeName)
    setCustIe(c.ie)
    setCustEmail(c.email)
    setCustPhone(c.phone)
    setCustAddress(c.address)
    setCustSegment(c.segment)
    setCustCreditLimit(c.creditLimit || 0)
    setCustStatus(c.status)
    setCustIsClient(c.isClient ?? true)
    setCustIsSupplier(c.isSupplier ?? false)
    setCustIsEmployee(c.isEmployee ?? false)
    setCustLeadTime(c.leadTime ?? 15)
    setCustBankData(c.bankData || '')
    setCustSalary(c.salary || 0)
    setCustDepartment(c.department || '')
    setShowCustomerModal(true)
  }

  const handleDeleteCustomer = (id: string) => {
    if (confirm(t({ pt: 'Tem certeza que deseja excluir esta entidade de parceiro?', en: 'Are you sure you want to delete this business partner entity?' }))) {
      const updated = businessPartners.filter(bp => bp.id !== id)
      setBusinessPartners(updated)
      localStorage.setItem('erp_business_partners', JSON.stringify(updated))
    }
  }

  // Live REST API & Endpoint Emulator Handler
  const handleSendApiRequest = () => {
    try {
      setApiResponseStatus('')
      setApiResponseBody('')
      setApiResponseSql('')

      // 1. Handle GET Business Partners (No body validation required)
      if (apiEndpoint === 'get_bp') {
        setApiResponseStatus('200 OK')
        setApiResponseBody(JSON.stringify(businessPartners, null, 2))
        setApiResponseSql(`-- Seleciona todos os parceiros de negócios normalizados e suas respectivas extensões
SELECT 
    bp.id,
    bp.cnpj_cpf,
    bp.razao_social,
    bp.nome_fantasia,
    bp.ie,
    c.limite_credito AS cliente_limite_credito,
    f.pzo_entrega_medio_dias AS fornecedor_lead_time,
    f.dados_bancarios_json AS fornecedor_dados_bancarios,
    e.salario_base AS colaborador_salario,
    e.departamento AS colaborador_departamento
FROM parceiro_negocio bp
LEFT JOIN parceiro_cliente c ON c.parceiro_id = bp.id
LEFT JOIN parceiro_fornecedor f ON f.parceiro_id = bp.id
LEFT JOIN parceiro_colaborador e ON e.parceiro_id = bp.id;`)
        return
      }

      // 2. Parse and Validate JSON Body
      let body: any
      try {
        body = JSON.parse(apiRequestBody)
      } catch (err) {
        setApiResponseStatus('400 Bad Request')
        setApiResponseBody(JSON.stringify({ error: 'Mecanismo de Parse Falhou', message: 'O corpo da requisição não é um JSON válido.' }, null, 2))
        setApiResponseSql('/* Nenhuma query executada devido a erro de sintaxe JSON */')
        return
      }

      // 3. Handle Create Business Partner
      if (apiEndpoint === 'create_bp') {
        const { cnpj, name, tradeName, ie, email, phone, address, segment, isClient, isSupplier, isEmployee, creditLimit, leadTime, bankData, salary, department } = body
        
        // CNPJ Modulus 11 validation check
        if (!cnpj || !name) {
          setApiResponseStatus('400 Bad Request')
          setApiResponseBody(JSON.stringify({ error: 'Erro de Validação', details: ['CNPJ e Razão Social são campos obrigatórios.'] }, null, 2))
          return
        }
        
        if (!validateCNPJ(cnpj)) {
          setApiResponseStatus('400 Bad Request')
          setApiResponseBody(JSON.stringify({ error: 'Erro de Validação', details: [`O CNPJ "${cnpj}" falhou na validação de soma de controle do Módulo 11.`] }, null, 2))
          return
        }

        const newId = `bp-${Date.now()}`
        const newBP = {
          id: newId,
          cnpj,
          name,
          tradeName: tradeName || '',
          ie: ie || 'ISENTO',
          email: email || '',
          phone: phone || '',
          address: address || '',
          segment: segment || 'Geral',
          status: 'ACTIVE' as const,
          isClient: !!isClient,
          isSupplier: !!isSupplier,
          isEmployee: !!isEmployee,
          creditLimit: isClient ? Number(creditLimit) || 0 : undefined,
          leadTime: isSupplier ? Number(leadTime) || 15 : undefined,
          bankData: isSupplier ? bankData : undefined,
          salary: isEmployee ? Number(salary) || 0 : undefined,
          department: isEmployee ? department : undefined
        }

        // Save in state & localStorage
        const updated = [...businessPartners, newBP]
        setBusinessPartners(updated)
        localStorage.setItem('erp_business_partners', JSON.stringify(updated))

        // Set Response Info
        setApiResponseStatus('201 Created')
        setApiResponseBody(JSON.stringify({ message: 'Parceiro registrado com sucesso', partner: newBP }, null, 2))
        
        // Build beautiful SQL query log
        let roleInserts = ''
        if (isClient) roleInserts += `\nINSERT INTO parceiro_cliente (parceiro_id, limite_credito) VALUES ('${newId}', ${Number(creditLimit) || 0});`
        if (isSupplier) roleInserts += `\nINSERT INTO parceiro_fornecedor (parceiro_id, pzo_entrega_medio_dias, dados_bancarios_json) VALUES ('${newId}', ${Number(leadTime) || 15}, '${bankData || ''}');`
        if (isEmployee) roleInserts += `\nINSERT INTO parceiro_colaborador (parceiro_id, salario_base, departamento) VALUES ('${newId}', ${Number(salary) || 0}, '${department || ''}');`
        
        setApiResponseSql(`BEGIN TRANSACTION;
INSERT INTO parceiro_negocio (id, cnpj_cpf, razao_social, nome_fantasia, ie, endereco_global, contatos)
VALUES (
    '${newId}',
    '${cnpj}',
    '${name}',
    '${tradeName || ''}',
    '${ie || 'ISENTO'}',
    '{"address": "${address || ''}"}',
    '{"email": "${email || ''}", "phone": "${phone || ''}"}'
);${roleInserts}
COMMIT;`)
      }

      // 4. Handle Create Item
      else if (apiEndpoint === 'create_item') {
        const { code, name, group, family, subfamily, sector, cost, price, ncm, cest, origin } = body
        
        if (!code || !name || !ncm) {
          setApiResponseStatus('400 Bad Request')
          setApiResponseBody(JSON.stringify({ error: 'Erro de Validação', details: ['Código (SKU), Nome do Item e NCM são campos obrigatórios.'] }, null, 2))
          return
        }

        const cleanNcm = ncm.replace(/[^\d]/g, '')
        if (cleanNcm.length !== 8) {
          setApiResponseStatus('400 Bad Request')
          setApiResponseBody(JSON.stringify({ error: 'Erro de Validação', details: [`O NCM "${ncm}" é inválido. O formato deve conter exatamente 8 dígitos decimais.`] }, null, 2))
          return
        }

        const newProd = {
          code,
          name,
          group: group || 'Geral',
          family: family || 'Outros',
          subfamily: subfamily || 'Diversos',
          sector: sector || 'Geral',
          cost: Number(cost) || 0,
          price: Number(price) || 0,
          ncm: cleanNcm,
          cest: cest || '',
          origin: origin || '0'
        }

        const updated = [...products, newProd]
        setProducts(updated)
        localStorage.setItem('erp_products', JSON.stringify(updated))

        setApiResponseStatus('201 Created')
        setApiResponseBody(JSON.stringify({ message: 'Produto cadastrado com sucesso', product: newProd }, null, 2))
        setApiResponseSql(`INSERT INTO item_cadastro (sku_code, nome_item, tipo_item, uom_estoque, codigo_ncm, codigo_cest, origem_mercadoria)
VALUES (
    '${code}',
    '${name}',
    'PRODUCT',
    'UN',
    '${cleanNcm}',
    '${cest || ''}',
    '${origin || '0'}'
);`)
      }

      // 5. Handle Post Inbound Movement (Goods Receipt / Weighted Cost Calculation)
      else if (apiEndpoint === 'post_movement') {
        const { type, number, skuCode, qty, unitPrice, freight, insurance, ipi, nonRecoverable, discount } = body
        
        if (!skuCode || !qty || !unitPrice) {
          setApiResponseStatus('400 Bad Request')
          setApiResponseBody(JSON.stringify({ error: 'Erro de Validação', details: ['SKU do Produto, Quantidade e Preço Unitário são obrigatórios.'] }, null, 2))
          return
        }

        const product = products.find(p => p.code === skuCode)
        if (!product) {
          setApiResponseStatus('400 Bad Request')
          setApiResponseBody(JSON.stringify({ error: 'Erro de Negócio', details: [`O SKU "${skuCode}" não foi encontrado no banco de dados.`] }, null, 2))
          return
        }

        // Apply moving average formulas:
        const fQty = Number(qty)
        const fPrice = Number(unitPrice)
        const totalItemsVal = fQty * fPrice
        const fFreight = Number(freight || 0)
        const fInsurance = Number(insurance || 0)
        const fIpi = Number(ipi || 0)
        const fNonRec = Number(nonRecoverable || 0)
        const fDisc = Number(discount || 0)

        // Custo de Aquisição = Valor Comercial + Frete + Seguro + IPI + Impostos Não Rec - Desconto
        const acquisitionCost = totalItemsVal + fFreight + fInsurance + fIpi + fNonRec - fDisc
        const unitAcquisitionCost = acquisitionCost / fQty

        // Weighted Average recalculation (rolling logic)
        const prevQty = getProductStock(skuCode)
        const prevCMP = product.cost || unitAcquisitionCost * 0.7 // fallback if cost is 0
        const newCMP = ((prevQty * prevCMP) + acquisitionCost) / (prevQty + fQty)

        // Update product CMP cost in products database state
        const updatedProds = products.map(p => p.code === skuCode ? { ...p, cost: Math.round(newCMP * 100) / 100 } : p)
        setProducts(updatedProds)
        localStorage.setItem('erp_products', JSON.stringify(updatedProds))

        // Create new NF-e invoice in database
        const newInvoice: Invoice = {
          id: `api-mov-${Date.now()}`,
          number: number || `NF-${Math.floor(1000 + Math.random() * 8999)}`,
          date: new Date().toISOString().slice(0, 10),
          client: type === 'ENTRADA' ? 'Fornecedor Integrado API' : 'Cliente Integrado API',
          value: acquisitionCost,
          profile: activeCompany.profile,
          items: [{ desc: product.name, qty: fQty, unitPrice: fPrice, total: totalItemsVal }],
          type: type || 'ENTRADA',
          freight: fFreight,
          icms: totalItemsVal * 0.12, // assume 12% standard ICMS
          ipi: fIpi,
          pis: totalItemsVal * 0.0165,
          cofins: totalItemsVal * 0.076
        }

        const updatedInvoices = [newInvoice, ...invoices]
        setInvoices(updatedInvoices)
        localStorage.setItem('erp_invoices', JSON.stringify(updatedInvoices))

        setApiResponseStatus('201 Created')
        setApiResponseBody(JSON.stringify({
          message: 'Movimentação registrada com sucesso. Preço Médio Ponderado recalculado no cadastro.',
          sku: skuCode,
          quantidadeAnterior: prevQty,
          cmpAnterior: prevCMP,
          custoDeAquisicaoTotal: acquisitionCost,
          custoDeAquisicaoUnitario: unitAcquisitionCost,
          novoCMP: newCMP,
          invoiceNumber: newInvoice.number
        }, null, 2))

        setApiResponseSql(`-- 1. Registra a nota fiscal física no livro fiscal
INSERT INTO lote_estoque (id, sku_code, codigo_lote, quantidade_fisica, armazem_id)
VALUES ('xml-${Date.now()}', '${skuCode}', 'LOT-${number || 'API'}', ${fQty}, 1);

-- 2. Atualiza o Custo Médio Ponderado (CMP) na tabela mestre de produtos
UPDATE item_cadastro 
SET custo_medio_ponderado = ${newCMP.toFixed(4)} 
WHERE sku_code = '${skuCode}';

-- 3. Lançamento Contábil de Entrada de Mercadorias (Partidas Dobradas)
-- Débito: Ativo Circulante - Estoques de Mercadorias -> +${acquisitionCost.toFixed(2)}
-- Crédito: Passivo Circulante - Fornecedores a Pagar -> +${acquisitionCost.toFixed(2)}`)
      }
    } catch (e: any) {
      setApiResponseStatus('500 Internal Server Error')
      setApiResponseBody(JSON.stringify({ error: 'Erro Inesperado no Servidor', details: [e.message] }, null, 2))
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleXMLFile(file)
  }

  // Format currency helper
  const formatCurrency = (val: number) => {
    const isEn = language === 'en'
    return isEn 
      ? `$${val.toLocaleString('en-US', { minimumFractionDigits: 2 })}` 
      : `R$ ${val.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
  }

  // Generate mock API Secret
  const generateSecret = () => {
    const rand = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    setApiSecretKey(`jt_sec_${rand}`)
  }

  // Filter invoices belonging to the active company profile
  const companyInvoices = invoices.filter(inv => inv.profile === activeCompany.profile)

  // Differentiate Entrada and Saída
  const salesInvoices = useMemo(() => companyInvoices.filter(inv => inv.type === 'SAÍDA'), [companyInvoices])
  const purchaseInvoices = useMemo(() => companyInvoices.filter(inv => inv.type === 'ENTRADA'), [companyInvoices])

  // Total Billings represents Saídas (sales)
  const totalBillings = useMemo(() => salesInvoices.reduce((acc, curr) => acc + curr.value, 0), [salesInvoices])
  const totalPurchases = useMemo(() => purchaseInvoices.reduce((acc, curr) => acc + curr.value, 0), [purchaseInvoices])

  // Freight totals
  const freightIn = useMemo(() => purchaseInvoices.reduce((acc, curr) => acc + (curr.freight || 0), 0), [purchaseInvoices])
  const freightOut = useMemo(() => salesInvoices.reduce((acc, curr) => acc + (curr.freight || 0), 0), [salesInvoices])

  // Tax totals (debit/output vs credit/input)
  const icmsOutput = useMemo(() => salesInvoices.reduce((acc, curr) => acc + (curr.icms || 0), 0), [salesInvoices])
  const ipiOutput = useMemo(() => salesInvoices.reduce((acc, curr) => acc + (curr.ipi || 0), 0), [salesInvoices])
  const pisCofinsOutput = useMemo(() => salesInvoices.reduce((acc, curr) => acc + ((curr.pis || 0) + (curr.cofins || 0)), 0), [salesInvoices])

  const icmsInput = useMemo(() => purchaseInvoices.reduce((acc, curr) => acc + (curr.icms || 0), 0), [purchaseInvoices])
  const pisCofinsInput = useMemo(() => purchaseInvoices.reduce((acc, curr) => acc + ((curr.pis || 0) + (curr.cofins || 0)), 0), [purchaseInvoices])

  // CMV Calculation: Compras (Input) + Frete de Entrada - Impostos Recuperáveis (ICMS + PIS/COFINS de Entrada)
  const calculatedCMV = useMemo(() => {
    const cost = totalPurchases + freightIn - (icmsInput + pisCofinsInput)
    return cost > 0 ? cost : 0
  }, [totalPurchases, freightIn, icmsInput, pisCofinsInput])

  // Freight output impact %
  const freightOutImpact = useMemo(() => {
    return totalBillings > 0 ? (freightOut / totalBillings) * 100 : 0
  }, [freightOut, totalBillings])
  
  // Extract clients chart distribution (only from sales)
  const clientDistribution = useMemo(() => {
    const map: Record<string, number> = {}
    salesInvoices.forEach(inv => {
      map[inv.client] = (map[inv.client] || 0) + inv.value
    })
    return Object.entries(map).map(([name, value]) => ({ name, value }))
  }, [salesInvoices])

  // Extract products sold chart distribution (only from sales)
  const productDistribution = useMemo(() => {
    const map: Record<string, number> = {}
    salesInvoices.forEach(inv => {
      inv.items.forEach(item => {
        map[item.desc] = (map[item.desc] || 0) + item.total
      })
    })
    return Object.entries(map).map(([name, value]) => ({ name, value })).sort((a,b) => b.value - a.value).slice(0, 5)
  }, [salesInvoices])

  // Product classification lookup helper
  const getProductCategory = (desc: string) => {
    const lower = desc.toLowerCase()
    if (lower.includes('smartphone') || lower.includes('celular') || lower.includes('phone')) {
      return { grupo: 'Tecnologia', familia: 'Smartphones', subfamilia: 'Mobile' }
    }
    if (lower.includes('notebook') || lower.includes('computador') || lower.includes('laptop')) {
      return { grupo: 'Tecnologia', familia: 'Computadores', subfamilia: 'Portáteis' }
    }
    if (lower.includes('cobre') || lower.includes('bobina')) {
      return { grupo: 'Metais', familia: 'Cobre', subfamilia: 'Trefilados' }
    }
    if (lower.includes('aço') || lower.includes('chapa')) {
      return { grupo: 'Metais', familia: 'Aço', subfamilia: 'Laminados' }
    }
    if (lower.includes('consultoria') || lower.includes('fpa')) {
      return { grupo: 'Serviços Corporativos', familia: 'Consultoria', subfamilia: 'Financeira' }
    }
    if (lower.includes('dashboard') || lower.includes('power bi') || lower.includes('bi')) {
      return { grupo: 'Serviços Corporativos', familia: 'Business Intelligence', subfamilia: 'Desenvolvimento' }
    }
    return { grupo: 'Geral', familia: 'Outros', subfamilia: 'Diversos' }
  }

  // Calculate margin parameters per family of products
  const familyMargins = useMemo(() => {
    const familiesMap: Record<string, {
      grupo: string
      familia: string
      subfamilia: string
      revenue: number
      cogs: number
      taxes: number
      freight: number
    }> = {}

    // 1. Calculate revenues and direct invoice-level items
    salesInvoices.forEach((inv) => {
      // Calculate total invoice taxes & freight to allocate proportionally
      const totalInvTaxes = (inv.icms || 0) + (inv.ipi || 0) + (inv.pis || 0) + (inv.cofins || 0)
      const totalInvFreight = inv.freight || 0
      const totalInvValue = inv.value || 1

      inv.items.forEach((item) => {
        const cat = getProductCategory(item.desc)
        if (!familiesMap[cat.familia]) {
          familiesMap[cat.familia] = {
            grupo: cat.grupo,
            familia: cat.familia,
            subfamilia: cat.subfamilia,
            revenue: 0,
            cogs: 0,
            taxes: 0,
            freight: 0
          }
        }
        
        // Accumulate item revenue
        familiesMap[cat.familia].revenue += item.total

        // Allocate taxes based on proportional item weight in the invoice
        const propWeight = item.total / totalInvValue
        familiesMap[cat.familia].taxes += totalInvTaxes * propWeight

        // Allocate freight
        familiesMap[cat.familia].freight += totalInvFreight * propWeight

        // Estimate CMV/COGS:
        // Attempt to find average purchase cost of this product from purchaseInvoices
        let avgPurchaseCost = 0
        let matches = 0
        purchaseInvoices.forEach((pInv) => {
          pInv.items.forEach((pItem) => {
            if (pItem.desc.toLowerCase() === item.desc.toLowerCase()) {
              avgPurchaseCost += pItem.unitPrice
              matches++
            }
          })
        })

        if (matches > 0) {
          familiesMap[cat.familia].cogs += (avgPurchaseCost / matches) * item.qty
        } else {
          // Fallback to standard industry cost ratios: Commerce 60%, Industry 50%, Services 15%
          const ratio = activeCompany.profile === 'SERVICES' ? 0.15 
                        : activeCompany.profile === 'COMMERCE' ? 0.60 
                        : 0.50
          familiesMap[cat.familia].cogs += item.total * ratio
        }
      })
    })

    return Object.values(familiesMap).map((f) => {
      const share = totalBillings > 0 ? (f.revenue / totalBillings) * 100 : 0
      // Contribution Margin = Revenue - COGS - Taxes - Allocated Freight
      const contributionMargin = f.revenue - f.cogs - f.taxes - f.freight
      const marginPct = f.revenue > 0 ? (contributionMargin / f.revenue) * 100 : 0

      return {
        ...f,
        share,
        contributionMargin,
        marginPct
      }
    }).sort((a, b) => b.revenue - a.revenue)
  }, [salesInvoices, purchaseInvoices, totalBillings, activeCompany.profile])

  // Top 20 Clients list
  const top20Clients = useMemo(() => {
    const clientMap: Record<string, { cnpj: string; totalSales: number; count: number }> = {}
    
    // Seed standard executive companies to ensure we have at least 20 if invoice data is small
    const defaultClientsList = [
      { name: 'Banco Itaú Unibanco S/A', cnpj: '60.701.190/0001-04' },
      { name: 'Ambev S/A', cnpj: '07.526.557/0001-00' },
      { name: 'Lojas Americanas', cnpj: '33.014.556/0001-96' },
      { name: 'Magazine Luiza S/A', cnpj: '47.960.950/0001-21' },
      { name: 'WEG Equipamentos Elétricos', cnpj: '84.823.501/0001-70' },
      { name: 'Gerdau Metalurgia', cnpj: '33.390.040/0001-44' },
      { name: 'Petrobras Distribuição', cnpj: '33.000.167/0001-01' },
      { name: 'Vale Mineração S/A', cnpj: '33.592.510/0001-54' },
      { name: 'JBS Alimentos Brasil', cnpj: '02.916.265/0001-00' },
      { name: 'Banco Bradesco S/A', cnpj: '60.746.948/0001-12' },
      { name: 'Ultrapar Participações', cnpj: '33.256.439/0001-90' },
      { name: 'Cemig Distribuidora', cnpj: '06.981.180/0001-16' },
      { name: 'Usiminas Siderúrgicas', cnpj: '60.500.139/0001-23' },
      { name: 'Embraer Defesa e Aero', cnpj: '07.689.002/0001-89' },
      { name: 'Raízen Distribuição', cnpj: '33.453.590/0001-88' },
      { name: 'Marfrig Global Foods', cnpj: '03.853.896/0001-40' },
      { name: 'Klabin Papel e Celulose', cnpj: '89.637.490/0001-45' },
      { name: 'Braskem Química S/A', cnpj: '42.150.391/0001-70' },
      { name: 'Localiza Rent a Car', cnpj: '16.831.139/0001-23' },
      { name: 'Suzano Papel S/A', cnpj: '16.404.287/0001-55' }
    ]

    // Aggregate from actual sales
    salesInvoices.forEach(inv => {
      const clientName = inv.client
      if (!clientMap[clientName]) {
        const match = defaultClientsList.find(c => c.name === clientName)
        clientMap[clientName] = {
          cnpj: match ? match.cnpj : `${Math.floor(10 + Math.random() * 89)}.${Math.floor(100 + Math.random() * 899)}.${Math.floor(100 + Math.random() * 899)}/0001-${Math.floor(10 + Math.random() * 89)}`,
          totalSales: 0,
          count: 0
        }
      }
      clientMap[clientName].totalSales += inv.value
      clientMap[clientName].count += 1
    })

    // Populate mock values based on company profile to ensure we have exactly 20 ranks
    defaultClientsList.forEach((c, idx) => {
      if (!clientMap[c.name]) {
        const baseFactor = activeCompany.profile === 'SERVICES' ? 12000 : activeCompany.profile === 'COMMERCE' ? 4500 : 25000
        clientMap[c.name] = {
          cnpj: c.cnpj,
          totalSales: baseFactor * (80 - idx * 3.5 + Math.floor(Math.random() * 5)),
          count: Math.floor(2 + Math.random() * 6)
        }
      }
    })

    return Object.entries(clientMap)
      .map(([name, data]) => ({
        name,
        cnpj: data.cnpj,
        totalSales: data.totalSales,
        count: data.count
      }))
      .sort((a, b) => b.totalSales - a.totalSales)
      .slice(0, 20)
  }, [salesInvoices, activeCompany.profile])

  // Advanced controllership metrics (Break-even, Operating leverage, DuPont)
  const controllershipMetrics = useMemo(() => {
    // Total variable expenses alocated
    const totalSalesTaxes = icmsOutput + ipiOutput + pisCofinsOutput
    const totalVariableCosts = calculatedCMV + totalSalesTaxes + freightOut
    
    // Global Contribution Margin
    const globalContributionMargin = totalBillings > totalVariableCosts ? totalBillings - totalVariableCosts : totalBillings * 0.4
    const globalMarginPct = totalBillings > 0 ? (globalContributionMargin / totalBillings) * 100 : 40

    // Assume fixed operational expenses (Custos Fixos de Estrutura)
    const fixedExpenses = activeCompany.profile === 'SERVICES' ? 25000 
                          : activeCompany.profile === 'COMMERCE' ? 40000 
                          : 80000

    // Break-even Point (Operational) = Fixed Expenses / Margin%
    const breakEvenPoint = (fixedExpenses / (globalMarginPct / 100))

    // EBITDA / Lucro Operacional = Contribution Margin - Fixed Expenses
    const operationalProfit = globalContributionMargin - fixedExpenses

    // Degree of Operating Leverage (Grau de Alavancagem Operacional - GAO)
    // GAO = Contribution Margin / Operating Profit (Lucro Operacional)
    const operatingLeverage = operationalProfit > 0 ? (globalContributionMargin / operationalProfit) : 0

    // DuPont System analysis parameters (mock assets mapping)
    const mockAssets = fixedExpenses * 10
    const mockEquity = mockAssets * 0.5
    const assetTurnover = totalBillings > 0 ? totalBillings / mockAssets : 1.2
    const netProfitMargin = totalBillings > 0 ? (operationalProfit * 0.66) / totalBillings : 0.08 // assume 34% tax rate
    const roe = netProfitMargin * assetTurnover * (mockAssets / mockEquity) * 100

    return {
      globalContributionMargin,
      globalMarginPct,
      fixedExpenses,
      breakEvenPoint,
      operationalProfit,
      operatingLeverage,
      roe
    }
  }, [totalBillings, calculatedCMV, icmsOutput, ipiOutput, pisCofinsOutput, freightOut, activeCompany.profile])

  const getProductStock = (productCode: string) => {
    let stock = 100
    invoices.forEach(inv => {
      if (inv.items) {
        inv.items.forEach(item => {
          const product = products.find(p => p.code === productCode)
          if (product) {
            const isMatch = item.desc.toLowerCase().includes(product.name.toLowerCase()) || 
                            item.desc.toLowerCase().includes(product.code.toLowerCase())
            if (isMatch) {
              if (inv.type === 'ENTRADA') {
                stock += item.qty
              } else if (inv.type === 'SAÍDA') {
                stock -= item.qty
              }
            }
          }
        })
      }
    })
    return stock
  }

  const getClientState = (clientName: string) => {
    const client = customers.find(c => c.name.toLowerCase() === clientName.toLowerCase() || c.tradeName?.toLowerCase() === clientName.toLowerCase())
    if (client && client.address) {
      const match = client.address.match(/\/([A-Z]{2})/i)
      if (match) return match[1].toUpperCase()
    }
    if (clientName.includes('Americanas') || clientName.includes('Rio')) return 'RJ'
    if (clientName.includes('Ambev') || clientName.includes('Gerdau')) return 'RS'
    if (clientName.includes('Vale') || clientName.includes('Cemig')) return 'MG'
    return 'SP'
  }

  const parseFinancialData = (text: string) => {
    const lines = text.split('\n')
    
    const extractNumber = (line: string) => {
      const cleaned = line.replace(/[^\d.,]/g, '')
      // Check if it uses comma as decimal separator or dot
      if (cleaned.includes(',') && cleaned.includes('.')) {
        // e.g. 1.500.000,00 -> remove dot, replace comma with dot
        return parseFloat(cleaned.replace(/\./g, '').replace(',', '.')) || 0
      } else if (cleaned.includes(',')) {
        // e.g. 1500000,00 -> replace comma with dot
        return parseFloat(cleaned.replace(',', '.')) || 0
      }
      return parseFloat(cleaned) || 0
    }

    let receitaBruta = 0
    let receitaLiquida = 0
    let custosFixos = 0
    let custosVariaveis = 0
    let ebitda = 0
    let lucroLiquido = 0
    let wacc = 0.10
    let capitalInvestido = 0
    let investInicial = 0
    let ganhoObtido = 0
    let patLiquido = 0
    let mediaClientes = 0
    let mediaFornecedores = 0
    let compras = 0
    let inadimplencia = 0
    let ativosCirc = 0
    let passivosCirc = 0
    let nopat = 0
    
    let missing: string[] = []

    lines.forEach(line => {
      const lower = line.toLowerCase()
      if (lower.includes('receita bruta') || lower.includes('faturamento')) {
        receitaBruta = extractNumber(line)
      } else if (lower.includes('receita liquida')) {
        receitaLiquida = extractNumber(line)
      } else if (lower.includes('custos fixos') || lower.includes('despesas fixas')) {
        custosFixos = extractNumber(line)
      } else if (lower.includes('custos variaveis') || lower.includes('custo variavel')) {
        custosVariaveis = extractNumber(line)
      } else if (lower.includes('ebitda') || lower.includes('lajida')) {
        ebitda = extractNumber(line)
      } else if (lower.includes('lucro liquido')) {
        lucroLiquido = extractNumber(line)
      } else if (lower.includes('wacc')) {
        wacc = extractNumber(line) / 100 || 0.10
      } else if (lower.includes('capital investido')) {
        capitalInvestido = extractNumber(line)
      } else if (lower.includes('investimento inicial')) {
        investInicial = extractNumber(line)
      } else if (lower.includes('ganho obtido')) {
        ganhoObtido = extractNumber(line)
      } else if (lower.includes('patrimonio liquido')) {
        patLiquido = extractNumber(line)
      } else if (lower.includes('clientes a receber') || lower.includes('media de clientes')) {
        mediaClientes = extractNumber(line)
      } else if (lower.includes('fornecedores a pagar') || lower.includes('media de fornecedores')) {
        mediaFornecedores = extractNumber(line)
      } else if (lower.includes('compras')) {
        compras = extractNumber(line)
      } else if (lower.includes('inadimplencia')) {
        inadimplencia = extractNumber(line)
      } else if (lower.includes('ativo circulante')) {
        ativosCirc = extractNumber(line)
      } else if (lower.includes('passivo circulante')) {
        passivosCirc = extractNumber(line)
      } else if (lower.includes('nopat')) {
        nopat = extractNumber(line)
      }
    })

    if (!receitaBruta) missing.push('Receita Bruta')
    if (!receitaLiquida) missing.push('Receita Líquida')
    if (!custosFixos) missing.push('Custos Fixos')
    if (!custosVariaveis) missing.push('Custos Variáveis')
    if (!ebitda) missing.push('EBITDA')
    if (!lucroLiquido) missing.push('Lucro Líquido')

    return {
      receitaBruta,
      receitaLiquida,
      custosFixos,
      custosVariaveis,
      ebitda,
      lucroLiquido,
      wacc,
      capitalInvestido,
      investInicial,
      ganhoObtido,
      patLiquido,
      mediaClientes,
      mediaFornecedores,
      compras,
      inadimplencia,
      ativosCirc,
      passivosCirc,
      nopat,
      missing
    }
  }

  const COLORS = ['#0071e3', '#00c7be', '#ff9500', '#ff3b30', '#af52de']

  // --- Auth View ---
  if (!isLoggedIn) {
    return (
      <div className="mx-auto max-w-md rounded-[32px] border border-black/5 bg-white p-8 shadow-2xl space-y-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="rounded-2xl bg-[#0071e3]/10 p-3 text-[#0071e3]">
            <Lock className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-800">
            {t({ pt: 'Portal ERP Controladoria', en: 'Controllership ERP Portal' })}
          </h2>
          <p className="text-xs text-slate-500 max-w-xs">
            {t({
              pt: 'Acesse o ambiente demonstrador para simular a importação de XML e análise de indicadores por perfil.',
              en: 'Access the simulator cockpit to upload XML invoices and review modular analytics.'
            })}
          </p>
        </div>

        {authFeedback && (
          <div className="rounded-xl bg-blue-50 border border-blue-100 p-3 text-[11px] text-blue-700 font-semibold text-center">
            {authFeedback}
          </div>
        )}

        {authTab === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase">{t({ pt: 'E-mail Corporativo', en: 'Corporate Email' })}</label>
              <input
                type="email"
                required
                value={authEmail}
                onChange={e => setAuthEmail(e.target.value)}
                placeholder="seu@nome.com.br"
                className="w-full rounded-2xl border border-black/10 px-4 py-2.5 text-xs text-slate-800 outline-none focus:border-[#0071e3]/50"
              />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-[11px] font-bold text-slate-500 uppercase">{t({ pt: 'Senha', en: 'Password' })}</label>
                <button type="button" onClick={() => setAuthTab('forgot')} className="text-[10px] text-[#0071e3] hover:underline font-semibold">{t({ pt: 'Esqueceu a senha?', en: 'Forgot password?' })}</button>
              </div>
              <input
                type="password"
                required
                value={authPassword}
                onChange={e => setAuthPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-2xl border border-black/10 px-4 py-2.5 text-xs text-slate-800 outline-none focus:border-[#0071e3]/50"
              />
            </div>
            <button type="submit" className="w-full rounded-full bg-[#0071e3] py-2.5 text-xs font-semibold text-white hover:bg-[#2997ff] transition">
              {t({ pt: 'Entrar no Sistema', en: 'Sign In' })}
            </button>
            <button type="button" onClick={() => setIsLoggedIn(true)} className="w-full rounded-full border border-slate-200 bg-slate-50 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition">
              {t({ pt: 'Acessar como Convidado (Rápido)', en: 'Access as Guest (Fast)' })}
            </button>
          </form>
        )}

        {authTab === 'signup' && (
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase">{t({ pt: 'Nome Completo', en: 'Full Name' })}</label>
              <input
                type="text"
                required
                value={authName}
                onChange={e => setAuthName(e.target.value)}
                placeholder="Jorge Telles"
                className="w-full rounded-2xl border border-black/10 px-4 py-2.5 text-xs text-slate-800 outline-none focus:border-[#0071e3]/50"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase">{t({ pt: 'E-mail Corporativo', en: 'Corporate Email' })}</label>
              <input
                type="email"
                required
                value={authEmail}
                onChange={e => setAuthEmail(e.target.value)}
                placeholder="nome@empresa.com"
                className="w-full rounded-2xl border border-black/10 px-4 py-2.5 text-xs text-slate-800 outline-none focus:border-[#0071e3]/50"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase">{t({ pt: 'Senha de Acesso', en: 'Secure Password' })}</label>
              <input
                type="password"
                required
                value={authPassword}
                onChange={e => setAuthPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-2xl border border-black/10 px-4 py-2.5 text-xs text-slate-800 outline-none focus:border-[#0071e3]/50"
              />
            </div>
            <button type="submit" className="w-full rounded-full bg-[#0071e3] py-2.5 text-xs font-semibold text-white hover:bg-[#2997ff] transition">
              {t({ pt: 'Registrar e Criar Tenant', en: 'Register & Create Tenant' })}
            </button>
          </form>
        )}

        {authTab === 'forgot' && (
          <form onSubmit={handleForgot} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase">{t({ pt: 'Informe seu E-mail', en: 'Your Registered Email' })}</label>
              <input
                type="email"
                required
                value={authEmail}
                onChange={e => setAuthEmail(e.target.value)}
                placeholder="seu@nome.com"
                className="w-full rounded-2xl border border-black/10 px-4 py-2.5 text-xs text-slate-800 outline-none focus:border-[#0071e3]/50"
              />
            </div>
            <button type="submit" className="w-full rounded-full bg-[#0071e3] py-2.5 text-xs font-semibold text-white hover:bg-[#2997ff] transition">
              {t({ pt: 'Enviar Link de Recuperação', en: 'Send Reset Link' })}
            </button>
          </form>
        )}

        <div className="flex justify-between items-center pt-4 border-t border-slate-100 text-[11px] text-slate-500">
          {authTab !== 'login' && (
            <button type="button" onClick={() => { setAuthTab('login'); setAuthFeedback(''); }} className="text-[#0071e3] font-semibold">{t({ pt: '← Voltar ao login', en: '← Back to login' })}</button>
          )}
          {authTab === 'login' && (
            <button type="button" onClick={() => { setAuthTab('signup'); setAuthFeedback(''); }} className="text-[#0071e3] font-semibold">{t({ pt: 'Criar conta gratuita →', en: 'Create free account →' })}</button>
          )}
        </div>
      </div>
    )
  }

  // --- Main ERP App View ---
  return (
    <div className="space-y-6">
      {/* Top Cockpit Header Bar */}
      <div className="rounded-[32px] border border-slate-100 bg-[#f8fafc] p-4 flex flex-col md:flex-row gap-4 items-center justify-between shadow-[0_10px_30px_rgba(15,23,42,0.01)]">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-[#0071e3] p-2 text-white">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">{t({ pt: 'Tenant Ativo / Empresa', en: 'Active Tenant / Company' })}</span>
              <span className="inline-block rounded-full bg-cyan-100 px-2 py-0.5 text-[9px] font-bold text-cyan-800 uppercase tracking-wide">
                {t({ pt: activeCompany.profile, en: activeCompany.profile })}
              </span>
            </div>
            
            <div className="flex items-center gap-2 mt-0.5">
              <select
                value={activeCompanyId}
                onChange={e => setActiveCompanyId(e.target.value)}
                className="bg-transparent text-sm font-bold text-slate-800 border-none outline-none cursor-pointer focus:ring-0 pr-6"
              >
                {companies.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setShowAddCompanyModal(true)}
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
          >
            <Plus className="h-4 w-4 text-[#0071e3]" /> {t({ pt: 'Nova Empresa', en: 'Add Company' })}
          </button>
          
          <button
            type="button"
            onClick={() => setIsLoggedIn(false)}
            className="inline-flex items-center gap-1 rounded-full bg-red-50 border border-red-100 px-3.5 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100 transition"
          >
            <LogOut className="h-4 w-4" /> {t({ pt: 'Sair', en: 'Logout' })}
          </button>
        </div>
      </div>

      {/* Tab Selectors */}
      <div className="flex flex-wrap border-b border-slate-100 pb-px">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex items-center gap-1.5 px-5 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition ${activeTab === 'dashboard' ? 'border-[#0071e3] text-[#0071e3]' : 'border-transparent text-slate-400 hover:text-slate-700'}`}
        >
          <Grid className="h-4 w-4" /> {t({ pt: 'Dashboard Analítico', en: 'Analytics Dashboard' })}
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`flex items-center gap-1.5 px-5 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition ${activeTab === 'products' ? 'border-[#0071e3] text-[#0071e3]' : 'border-transparent text-slate-400 hover:text-slate-700'}`}
        >
          <FileSpreadsheet className="h-4 w-4" /> {t({ pt: 'Cadastro & Planilhas', en: 'Products & CSV Import' })}
        </button>
        <button
          onClick={() => setActiveTab('xml')}
          className={`flex items-center gap-1.5 px-5 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition ${activeTab === 'xml' ? 'border-[#0071e3] text-[#0071e3]' : 'border-transparent text-slate-400 hover:text-slate-700'}`}
        >
          <FileCode className="h-4 w-4" /> {t({ pt: 'Importador XML', en: 'XML Importer' })}
        </button>
        <button
          onClick={() => setActiveTab('inventory')}
          className={`flex items-center gap-1.5 px-5 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition ${activeTab === 'inventory' ? 'border-[#0071e3] text-[#0071e3]' : 'border-transparent text-slate-400 hover:text-slate-700'}`}
        >
          <Database className="h-4 w-4" /> {t({ pt: 'Estoque', en: 'Inventory' })}
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          className={`flex items-center gap-1.5 px-5 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition ${activeTab === 'reports' ? 'border-[#0071e3] text-[#0071e3]' : 'border-transparent text-slate-400 hover:text-slate-700'}`}
        >
          <Activity className="h-4 w-4" /> {t({ pt: 'Relatórios', en: 'Reports' })}
        </button>
        <button
          onClick={() => setActiveTab('kpis')}
          className={`flex items-center gap-1.5 px-5 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition ${activeTab === 'kpis' ? 'border-[#0071e3] text-[#0071e3]' : 'border-transparent text-slate-400 hover:text-slate-700'}`}
        >
          <Sparkles className="h-4 w-4 text-[#af52de]" /> {t({ pt: 'Métricas & KPIs', en: 'Metrics & KPIs' })}
        </button>
        <button
          onClick={() => setActiveTab('integrations')}
          className={`flex items-center gap-1.5 px-5 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition ${activeTab === 'integrations' ? 'border-[#0071e3] text-[#0071e3]' : 'border-transparent text-slate-400 hover:text-slate-700'}`}
        >
          <Workflow className="h-4 w-4" /> {t({ pt: 'Integrações (BigQuery)', en: 'Integrations (BigQuery)' })}
        </button>
        <button
          onClick={() => setActiveTab('architecture')}
          className={`flex items-center gap-1.5 px-5 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition ${activeTab === 'architecture' ? 'border-[#0071e3] text-[#0071e3]' : 'border-transparent text-slate-400 hover:text-slate-700'}`}
        >
          <Database className="h-4 w-4 text-[#0071e3]" /> {t({ pt: 'Arquitetura ERP', en: 'ERP Architecture' })}
        </button>
      </div>

      {/* --- View 1: Dashboard Analytics --- */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Draggable & Resizable Grid Layout */}
          <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
            {widgets.map((w, index) => {
              const colSpanClass = w.colSpan === 1 ? 'md:col-span-1 col-span-1' 
                                   : w.colSpan === 2 ? 'md:col-span-2 col-span-1' 
                                   : 'md:col-span-3 col-span-1'
              
              return (
                <motion.div
                  key={w.id}
                  layout
                  drag="x"
                  dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                  dragElastic={0.15}
                  onDragEnd={(event: any, info: any) => {
                    if (info.offset.x > 140) {
                      moveWidget(index, 'right')
                    } else if (info.offset.x < -140) {
                      moveWidget(index, 'left')
                    }
                  }}
                  className={`${colSpanClass} relative group transition-all duration-300`}
                >
                  {w.type === 'kpi-billing' && (
                    <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm space-y-2 h-full flex flex-col justify-between">
                      <div className="flex justify-between items-start gap-4">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t({ pt: 'Faturamento Total (Banco de Dados)', en: 'Total Billings (Database)' })}</span>
                        {renderWidgetControls(w, index)}
                      </div>
                      <div className="pt-2">
                        <p className="text-2xl font-extrabold text-slate-900">{formatCurrency(totalBillings)}</p>
                        <p className="text-[10px] text-slate-400 mt-1">{t({ pt: 'Soma acumulada de todas as notas fiscais XML e APIs.', en: 'Accumulated summation of all XML invoices and API inputs.' })}</p>
                      </div>
                    </div>
                  )}

                  {w.type === 'kpi-count' && (
                    <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm space-y-2 h-full flex flex-col justify-between">
                      <div className="flex justify-between items-start gap-4">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t({ pt: 'Quantidade de Notas Fiscais', en: 'Total Invoice Count' })}</span>
                        {renderWidgetControls(w, index)}
                      </div>
                      <div className="pt-2">
                        <p className="text-2xl font-extrabold text-slate-900">{companyInvoices.length} {t({ pt: 'notas', en: 'invoices' })}</p>
                        <p className="text-[10px] text-slate-400 mt-1">{t({ pt: 'Registros salvos e estruturados no tenant ativo.', en: 'Stored and structured records on active tenant.' })}</p>
                      </div>
                    </div>
                  )}

                  {w.type === 'kpi-profile' && (
                    <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm space-y-2 h-full flex flex-col justify-between">
                      <div className="flex justify-between items-start gap-4">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t({ pt: 'Perfil de Atuação', en: 'Business Profile' })}</span>
                        {renderWidgetControls(w, index)}
                      </div>
                      <div className="pt-2">
                        <p className="text-2xl font-extrabold text-[#0071e3]">
                          {activeCompany.profile === 'SERVICES' ? t({ pt: 'Serviços (ISS)', en: 'Services (ISS)' }) 
                           : activeCompany.profile === 'COMMERCE' ? t({ pt: 'Comércio (CMV)', en: 'Trade (CMV)' }) 
                           : t({ pt: 'Indústria (IPI)', en: 'Industry (IPI)' })}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-1">{t({ pt: 'Define os KPIs operacionais do dashboard.', en: 'Determines operational KPIs visible in the view.' })}</p>
                      </div>
                    </div>
                  )}

                  {w.type === 'chart-products' && (
                    <div className="rounded-[32px] border border-slate-100 bg-white p-6 shadow-sm space-y-4 h-full">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">{t({ pt: 'Produtos / Serviços mais Vendidos (Curva ABC)', en: 'Top Products / Services (ABC Curve)' })}</h4>
                          <p className="text-[10px] text-slate-400">{t({ pt: 'Demonstração de faturamento por item de nota fiscal.', en: 'Invoice item billing breakdown.' })}</p>
                        </div>
                        {renderWidgetControls(w, index)}
                      </div>
                      <div className="h-64 w-full">
                        {productDistribution.length === 0 ? (
                          <div className="h-full flex items-center justify-center text-xs text-slate-400 border border-dashed border-slate-100 rounded-2xl">{t({ pt: 'Importe XMLs na aba ao lado para gerar dados.', en: 'Import XMLs to generate statistics.' })}</div>
                        ) : (
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={productDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                              <XAxis dataKey="name" tick={{ fontSize: 9 }} stroke="#94a3b8" />
                              <YAxis tick={{ fontSize: 9 }} stroke="#94a3b8" />
                              <Tooltip wrapperStyle={{ fontSize: 10 }} />
                              <Bar dataKey="value" fill="#0071e3" radius={[4, 4, 0, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        )}
                      </div>
                    </div>
                  )}

                  {w.type === 'chart-clients' && (
                    <div className="rounded-[32px] border border-slate-100 bg-white p-6 shadow-sm space-y-4 h-full">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">{t({ pt: 'Maiores Clientes (Faturamento Acumulado)', en: 'Key Customers (Accumulated Revenue)' })}</h4>
                          <p className="text-[10px] text-slate-400">{t({ pt: 'Proporção de receita gerada por parceiro de negócio.', en: 'Proportion of revenue generated per business partner.' })}</p>
                        </div>
                        {renderWidgetControls(w, index)}
                      </div>
                      <div className="h-64 w-full flex items-center justify-center">
                        {clientDistribution.length === 0 ? (
                          <div className="h-full w-full flex items-center justify-center text-xs text-slate-400 border border-dashed border-slate-100 rounded-2xl">{t({ pt: 'Importe XMLs na aba ao lado para gerar dados.', en: 'Import XMLs to generate statistics.' })}</div>
                        ) : (
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={clientDistribution}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                              >
                                {clientDistribution.map((entry: any, index: number) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip formatter={(value: any) => formatCurrency(Number(value))} />
                            </PieChart>
                          </ResponsiveContainer>
                        )}
                      </div>
                    </div>
                  )}

                  {w.type === 'advanced-cmv' && (
                    <div className="rounded-[32px] border border-slate-100 bg-white p-6 shadow-sm space-y-6 h-full">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">{t({ pt: 'Análise de CMV, Fretes e Impostos', en: 'CMV, Freight & Taxes Analysis' })}</h4>
                          <p className="text-[10px] text-slate-400">{t({ pt: 'Demonstrativo estruturado com base nas notas fiscais de entrada e saída.', en: 'Calculated metrics comparing input vs output transactions.' })}</p>
                        </div>
                        {renderWidgetControls(w, index)}
                      </div>

                      <div className="grid gap-6 md:grid-cols-3">
                        {/* Col 1: Compras e CMV */}
                        <div className="space-y-4 border-r border-slate-100 pr-4">
                          <h5 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{t({ pt: '1. Compras & Custo CMV', en: '1. Purchases & CMV Cost' })}</h5>
                          <div className="space-y-2">
                            <div className="flex justify-between text-xs">
                              <span className="text-slate-500">{t({ pt: 'Compras Brutas (Entrada)', en: 'Gross Purchases (Input)' })}</span>
                              <span className="font-semibold text-slate-800">{formatCurrency(totalPurchases)}</span>
                            </div>
                            <div className="flex justify-between text-xs text-blue-600 font-semibold">
                              <span>{t({ pt: '(+) Frete de Entrada (Custo)', en: '(+) Freight Input (Cost)' })}</span>
                              <span>{formatCurrency(freightIn)}</span>
                            </div>
                            <div className="flex justify-between text-xs text-red-600 font-semibold">
                              <span>{t({ pt: '(-) Impostos Recuperáveis', en: '(-) Deductible Taxes' })}</span>
                              <span>{formatCurrency(icmsInput + pisCofinsInput)}</span>
                            </div>
                            <div className="h-px bg-slate-100 my-2" />
                            <div className="flex justify-between text-xs font-bold text-slate-900">
                              <span>{t({ pt: 'CMV Operacional Calculado', en: 'Operational CMV Cost' })}</span>
                              <span>{formatCurrency(calculatedCMV)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Col 2: Separação de Impostos */}
                        <div className="space-y-4 border-r border-slate-100 px-4">
                          <h5 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{t({ pt: '2. Carga Tributária (Saídas)', en: '2. Tax Liability (Outputs)' })}</h5>
                          <div className="space-y-2">
                            <div className="flex justify-between text-xs">
                              <span className="text-slate-500">ICMS {t({ pt: 's/ Vendas', en: 'on Sales' })}</span>
                              <span className="font-semibold text-slate-800">{formatCurrency(icmsOutput)}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span className="text-slate-500">IPI {t({ pt: 's/ Vendas', en: 'on Sales' })}</span>
                              <span className="font-semibold text-slate-800">{formatCurrency(ipiOutput)}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span className="text-slate-500">PIS/COFINS {t({ pt: 's/ Vendas', en: 'on Sales' })}</span>
                              <span className="font-semibold text-slate-800">{formatCurrency(pisCofinsOutput)}</span>
                            </div>
                            <div className="h-px bg-slate-100 my-2" />
                            <div className="flex justify-between text-xs font-bold text-slate-900">
                              <span>{t({ pt: 'Total Tributos de Débito', en: 'Total Output Taxes' })}</span>
                              <span>{formatCurrency(icmsOutput + ipiOutput + pisCofinsOutput)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Col 3: Fretes */}
                        <div className="space-y-4 pl-4">
                          <h5 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{t({ pt: '3. Análise de Logística (Fretes)', en: '3. Logistics Analysis (Freight)' })}</h5>
                          <div className="space-y-2">
                            <div className="flex justify-between text-xs">
                              <span className="text-slate-500">{t({ pt: 'Frete de Entrada (Entrada)', en: 'Input Freight (Supplier)' })}</span>
                              <span className="font-semibold text-slate-800">{formatCurrency(freightIn)}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span className="text-slate-500">{t({ pt: 'Frete de Vendas (Saída)', en: 'Output Freight (Client)' })}</span>
                              <span className="font-semibold text-slate-800">{formatCurrency(freightOut)}</span>
                            </div>
                            <div className="h-px bg-slate-100 my-2" />
                            <div className="space-y-1">
                              <div className="flex justify-between text-[11px] font-bold text-slate-900">
                                <span>{t({ pt: 'Impacto s/ Faturamento', en: 'Impact over Revenues' })}</span>
                                <span>{freightOutImpact.toFixed(2)}%</span>
                              </div>
                              {/* Simple visual progress bar */}
                              <div className="w-full bg-slate-100 rounded-full h-1.5 mt-1 overflow-hidden">
                                <div className="bg-[#ff9500] h-1.5 rounded-full" style={{ width: `${Math.min(freightOutImpact, 100)}%` }} />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {w.type === 'family-margins' && (
                    <div className="rounded-[32px] border border-slate-100 bg-white p-6 shadow-sm space-y-4 h-full">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">{t({ pt: 'Margem de Contribuição e Share por Família de Produtos', en: 'Contribution Margin & Share per Product Family' })}</h4>
                          <p className="text-[10px] text-slate-400">{t({ pt: 'Classificação por Grupo, Família e Subfamília com cálculo de rentabilidade unitária.', en: 'Hierarchical product mapping and allocated net margin analysis.' })}</p>
                        </div>
                        {renderWidgetControls(w, index)}
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase">
                              <th className="pb-3 pr-4">{t({ pt: 'Grupo', en: 'Group' })}</th>
                              <th className="pb-3 pr-4">{t({ pt: 'Família', en: 'Family' })}</th>
                              <th className="pb-3 pr-4">{t({ pt: 'Subfamília', en: 'Subfamily' })}</th>
                              <th className="pb-3 pr-4 text-right">{t({ pt: 'Faturamento', en: 'Revenue' })}</th>
                              <th className="pb-3 pr-4 text-center">{t({ pt: 'Share (%)', en: 'Share (%)' })}</th>
                              <th className="pb-3 pr-4 text-right">{t({ pt: 'Custos CMV', en: 'CMV Cost' })}</th>
                              <th className="pb-3 pr-4 text-right">{t({ pt: 'Impostos Aloc.', en: 'Alloc. Taxes' })}</th>
                              <th className="pb-3 pr-4 text-right">{t({ pt: 'Margem Contrib.', en: 'Contrib. Margin' })}</th>
                              <th className="pb-3 text-center">{t({ pt: 'Margem (%)', en: 'Margin (%)' })}</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-50">
                            {familyMargins.map((f, i) => {
                              // Style according to margin percentage
                              const badgeColor = f.marginPct > 45 ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                                : f.marginPct > 20 ? 'bg-amber-50 text-amber-700 border-amber-100'
                                                : 'bg-rose-50 text-rose-700 border-rose-100'
                              return (
                                <tr key={i} className="hover:bg-slate-50/50">
                                  <td className="py-3 text-slate-500 font-medium">{f.grupo}</td>
                                  <td className="py-3 font-bold text-slate-800">{f.familia}</td>
                                  <td className="py-3 text-slate-500">{f.subfamilia}</td>
                                  <td className="py-3 text-right font-semibold text-slate-800">{formatCurrency(f.revenue)}</td>
                                  <td className="py-3 pr-4">
                                    <div className="flex items-center gap-2 justify-center">
                                      <span className="text-[10px] text-slate-600 font-bold min-w-[32px] text-right">{f.share.toFixed(1)}%</span>
                                      <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                        <div className="bg-[#0071e3] h-1.5 rounded-full" style={{ width: `${f.share}%` }} />
                                      </div>
                                    </div>
                                  </td>
                                  <td className="py-3 text-right text-slate-600">{formatCurrency(f.cogs)}</td>
                                  <td className="py-3 text-right text-slate-600">{formatCurrency(f.taxes)}</td>
                                  <td className="py-3 text-right font-extrabold text-slate-900">{formatCurrency(f.contributionMargin)}</td>
                                  <td className="py-3 text-center">
                                    <span className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${badgeColor}`}>
                                      {f.marginPct.toFixed(1)}%
                                    </span>
                                  </td>
                                </tr>
                              )
                            })}
                            {familyMargins.length === 0 && (
                              <tr>
                                <td colSpan={9} className="py-10 text-center text-slate-400">
                                  {t({ pt: 'Nenhum registro encontrado. Importe notas fiscais para calcular margens.', en: 'No product records found. Import invoices to calculate margins.' })}
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {w.type === 'top-20-clients' && (
                    <div className="rounded-[32px] border border-slate-100 bg-white p-6 shadow-sm space-y-4 h-full">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                            <TrendingUp className="h-4.5 w-4.5 text-[#0071e3]" />
                            {t({ pt: 'Ranking dos 20 Maiores Clientes (Curva ABC)', en: 'Top 20 Key Customers Ranking (ABC Curve)' })}
                          </h4>
                          <p className="text-[10px] text-slate-400">{t({ pt: 'Lista de faturamento acumulado por parceiro comercial.', en: 'Accumulated billing sorted in descending order.' })}</p>
                        </div>
                        {renderWidgetControls(w, index)}
                      </div>

                      <div className="overflow-y-auto max-h-80 border border-slate-100 rounded-2xl">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase bg-slate-50/50">
                              <th className="p-3 text-center w-12">#</th>
                              <th className="p-3 pr-4">{t({ pt: 'Razão Social', en: 'Company Name' })}</th>
                              <th className="p-3 pr-4">{t({ pt: 'CNPJ', en: 'CNPJ' })}</th>
                              <th className="p-3 pr-4 text-center">{t({ pt: 'Transações', en: 'Invoices Count' })}</th>
                              <th className="p-3 pr-4 text-right">{t({ pt: 'Faturamento Total', en: 'Total Billings' })}</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-50">
                            {top20Clients.map((client, idx) => {
                              return (
                                <tr key={idx} className="hover:bg-slate-50/50">
                                  <td className="p-3 text-center font-bold text-slate-400">{idx + 1}</td>
                                  <td className="p-3 font-bold text-slate-800">{client.name}</td>
                                  <td className="p-3 text-slate-500 font-mono text-[10px]">{client.cnpj}</td>
                                  <td className="p-3 text-center text-slate-600 font-semibold">{client.count}</td>
                                  <td className="p-3 text-right font-extrabold text-slate-900">{formatCurrency(client.totalSales)}</td>
                                </tr>
                              )
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {w.type === 'break-even-analysis' && (
                    <div className="rounded-[32px] border border-slate-100 bg-white p-6 shadow-sm space-y-6 h-full">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                            <Activity className="h-4.5 w-4.5 text-[#ff9500]" />
                            {t({ pt: 'Ponto de Equilíbrio, Alavancagem & DuPont', en: 'Break-even Point, Leverage & DuPont System' })}
                          </h4>
                          <p className="text-[10px] text-slate-400">{t({ pt: 'Análise de alavancagem operacional e rentabilidade estratégica do negócio.', en: 'Operating leverage indicators and strategic return on equity.' })}</p>
                        </div>
                        {renderWidgetControls(w, index)}
                      </div>

                      <div className="grid gap-6 md:grid-cols-3 text-xs text-slate-600">
                        {/* 1. Break-even Point */}
                        <div className="border border-slate-100 rounded-2xl p-4 space-y-3 bg-slate-50/30">
                          <h5 className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">{t({ pt: '1. Ponto de Equilíbrio', en: '1. Break-even Analysis' })}</h5>
                          <div className="space-y-1.5">
                            <div className="flex justify-between">
                              <span className="text-slate-500">{t({ pt: 'Margem Contrib. Média', en: 'Avg Contribution Margin' })}</span>
                              <span className="font-bold text-slate-800">{controllershipMetrics.globalMarginPct.toFixed(1)}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500">{t({ pt: 'Custos Fixos Mensais', en: 'Monthly Fixed Expenses' })}</span>
                              <span className="font-bold text-slate-800">{formatCurrency(controllershipMetrics.fixedExpenses)}</span>
                            </div>
                            <div className="h-px bg-slate-200/50 my-1" />
                            <div className="flex justify-between text-slate-900 font-extrabold text-[11px]">
                              <span>{t({ pt: 'Faturamento de Equilíbrio', en: 'Break-even Revenues' })}</span>
                              <span>{formatCurrency(controllershipMetrics.breakEvenPoint)}</span>
                            </div>
                          </div>
                        </div>

                        {/* 2. GAO Leverage */}
                        <div className="border border-slate-100 rounded-2xl p-4 space-y-3 bg-slate-50/30">
                          <h5 className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">{t({ pt: '2. Alavancagem Operacional', en: '2. Operating Leverage (GAO)' })}</h5>
                          <div className="space-y-1.5">
                            <div className="flex justify-between">
                              <span className="text-slate-500">{t({ pt: 'EBITDA Operacional', en: 'Operating Profit' })}</span>
                              <span className={`font-bold ${controllershipMetrics.operationalProfit >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                {formatCurrency(controllershipMetrics.operationalProfit)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500">{t({ pt: 'Grau GAO', en: 'GAO Index Factor' })}</span>
                              <span className="font-bold text-slate-800">{controllershipMetrics.operatingLeverage.toFixed(2)}x</span>
                            </div>
                            <div className="h-px bg-slate-200/50 my-1" />
                            <p className="text-[10px] text-slate-400 leading-relaxed">
                              {t({
                                pt: `💡 Um aumento de 10% nas vendas resultará em um crescimento de ${(controllershipMetrics.operatingLeverage * 10).toFixed(1)}% no lucro operacional.`,
                                en: `💡 A 10% increase in revenues will generate a ${(controllershipMetrics.operatingLeverage * 10).toFixed(1)}% increase in operating profits.`
                              })}
                            </p>
                          </div>
                        </div>

                        {/* 3. DuPont Model */}
                        <div className="border border-slate-100 rounded-2xl p-4 space-y-3 bg-slate-50/30">
                          <h5 className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">{t({ pt: '3. Análise DuPont (ROE)', en: '3. DuPont Analysis (ROE)' })}</h5>
                          <div className="space-y-1.5">
                            <div className="flex justify-between">
                              <span className="text-slate-500">{t({ pt: 'Retorno s/ Patrimônio ROE', en: 'Return on Equity (ROE)' })}</span>
                              <span className="font-extrabold text-slate-900 text-sm">{controllershipMetrics.roe.toFixed(2)}%</span>
                            </div>
                            <div className="h-px bg-slate-200/50 my-1" />
                            <p className="text-[9px] text-slate-500 leading-relaxed">
                              {t({
                                pt: 'O ROE decompõe a rentabilidade multiplicando Margem Líquida x Giro de Ativos x Alavancagem Financeira.',
                                en: 'DuPont measures ROE by multiplying Net Margin x Asset Turnover x Equity Multiplier leverage.'
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {w.type === 'table-invoices' && (
                    <div className="rounded-[32px] border border-slate-100 bg-white p-6 shadow-sm space-y-4 h-full">
                      <div className="flex justify-between items-center">
                        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                          <Database className="h-4.5 w-4.5 text-[#0071e3]" />
                          {t({ pt: 'Registros do Banco de Dados (Notas Fiscais)', en: 'Database Records (Invoices)' })}
                        </h4>
                        {renderWidgetControls(w, index)}
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase">
                              <th className="pb-3 pr-4">{t({ pt: 'Tipo', en: 'Type' })}</th>
                              <th className="pb-3 pr-4">{t({ pt: 'Número', en: 'Invoice #' })}</th>
                              <th className="pb-3 pr-4">{t({ pt: 'Data', en: 'Date' })}</th>
                              <th className="pb-3 pr-4">{t({ pt: 'Cliente / Fornecedor', en: 'Client / Supplier' })}</th>
                              <th className="pb-3 pr-4 text-right">{t({ pt: 'Frete', en: 'Freight' })}</th>
                              <th className="pb-3 pr-4 text-right">{t({ pt: 'Impostos', en: 'Taxes' })}</th>
                              <th className="pb-3 pr-4 text-right">{t({ pt: 'Valor Total', en: 'Total Amount' })}</th>
                              <th className="pb-3 text-center">{t({ pt: 'Status DB', en: 'DB Status' })}</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-50">
                            {companyInvoices.map((inv) => {
                              const totalInvTaxes = (inv.icms || 0) + (inv.ipi || 0) + (inv.pis || 0) + (inv.cofins || 0)
                              return (
                                <tr key={inv.id} className="hover:bg-slate-50/50">
                                  <td className="py-3">
                                    <span className={`inline-block rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${inv.type === 'ENTRADA' ? 'bg-blue-50 text-blue-700 border border-blue-100' : 'bg-orange-50 text-orange-700 border border-orange-100'}`}>
                                      {t({ pt: inv.type, en: inv.type })}
                                    </span>
                                  </td>
                                  <td className="py-3 font-semibold text-slate-700">{inv.number}</td>
                                  <td className="py-3 text-slate-500">{inv.date}</td>
                                  <td className="py-3 font-bold text-slate-800">{inv.client}</td>
                                  <td className="py-3 text-right text-slate-600 font-semibold">{formatCurrency(inv.freight || 0)}</td>
                                  <td className="py-3 text-right text-slate-600 font-semibold">{formatCurrency(totalInvTaxes)}</td>
                                  <td className="py-3 text-right font-extrabold text-slate-900">{formatCurrency(inv.value)}</td>
                                  <td className="py-3 text-center">
                                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-100">
                                      <FileCheck className="h-3 w-3" /> Synchronized
                                    </span>
                                  </td>
                                </tr>
                              )
                            })}
                            {companyInvoices.length === 0 && (
                              <tr>
                                <td colSpan={8} className="py-10 text-center text-slate-400">
                                  {t({ pt: 'Nenhum registro para esta empresa. Vá na aba "Importador XML" para alimentar o banco.', en: 'No invoice records. Head to the "XML Importer" tab to feed the database.' })}
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>
        </div>
      )}

      {/* --- View: Products Catalog & Smart CSV/Excel Importer --- */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          {/* Sub-tab selection bar */}
          <div className="flex gap-2 border-b border-slate-100 pb-2">
            <button
              onClick={() => setProductsSubTab('products')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${productsSubTab === 'products' ? 'bg-[#0071e3] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              📦 {t({ pt: 'Catálogo de Produtos', en: 'Product Catalog' })}
            </button>
            <button
              onClick={() => setProductsSubTab('customers')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${productsSubTab === 'customers' ? 'bg-[#0071e3] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              👥 {t({ pt: 'Diretório de Clientes', en: 'Customer Directory' })}
            </button>
          </div>

          {productsSubTab === 'products' ? (
            <div className="grid gap-6 md:grid-cols-3">
              {/* Left Col: Upload & Mapping */}
              <div className="md:col-span-1 rounded-[32px] border border-slate-100 bg-white p-6 shadow-sm space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <UploadCloud className="h-4.5 w-4.5 text-[#0071e3]" />
                    {t({ pt: 'Importador de Planilha Inteligente', en: 'Smart Spreadsheet Importer' })}
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-1">
                    {t({ pt: 'Importe produtos via TXT ou CSV com mapeador de colunas inteligente.', en: 'Import product catalog using TXT or CSV and dynamic column mapping.' })}
                  </p>
                </div>

                {/* Upload Input Area */}
                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center hover:bg-slate-50 transition relative">
                  <input
                    type="file"
                    accept=".csv,.txt"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleCSVUpload(file)
                    }}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <div className="flex flex-col items-center gap-2">
                    <div className="rounded-full bg-[#0071e3]/10 p-2.5 text-[#0071e3]">
                      <UploadCloud className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-bold text-slate-700">{t({ pt: 'Selecionar Planilha (CSV/TXT)', en: 'Select Spreadsheet (CSV/TXT)' })}</span>
                    <span className="text-[10px] text-slate-400">{t({ pt: 'Clique ou arraste o arquivo aqui', en: 'Click or drag file here' })}</span>
                  </div>
                </div>

                {importFeedback && (
                  <p className="text-xs font-semibold text-center text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">{importFeedback}</p>
                )}

                {/* Mapping Modal / Card */}
                {isMappingActive && (
                  <div className="space-y-4 border-t border-slate-100 pt-4">
                    <h4 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">{t({ pt: '⚙️ Configurar Colunas da Planilha', en: '⚙️ Configure Spreadsheet Columns' })}</h4>
                    
                    <div className="space-y-3">
                      {Object.keys(columnMappings).map((field) => {
                        const fieldLabel = field === 'code' ? t({ pt: 'SKU / Código', en: 'SKU / Code' })
                                          : field === 'name' ? t({ pt: 'Nome / Descrição', en: 'Product Name / Desc' })
                                          : field === 'group' ? t({ pt: 'Grupo', en: 'Group' })
                                          : field === 'family' ? t({ pt: 'Família', en: 'Family' })
                                          : field === 'subfamily' ? t({ pt: 'Subfamília', en: 'Subfamily' })
                                          : field === 'sector' ? t({ pt: 'Setor / Canal', en: 'Sector / Channel' })
                                          : field === 'cost' ? t({ pt: 'Custo de Compra', en: 'Unit Cost' })
                                          : t({ pt: 'Preço de Venda', en: 'Selling Price' })

                        return (
                          <div key={field} className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">{fieldLabel}</label>
                            <select
                              value={columnMappings[field]}
                              onChange={(e) => setColumnMappings(prev => ({ ...prev, [field]: e.target.value }))}
                              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 outline-none focus:border-[#0071e3]/50"
                            >
                              <option value="">-- {t({ pt: 'Selecione', en: 'Select Column' })} --</option>
                              {csvHeaders.map((header) => (
                                <option key={header} value={header}>{header}</option>
                              ))}
                            </select>
                          </div>
                        )
                      })}
                    </div>

                    <button
                      onClick={executeCSVImport}
                      className="w-full rounded-full bg-[#0071e3] py-2.5 text-xs font-semibold text-white hover:bg-[#2997ff] transition"
                    >
                      {t({ pt: 'Cadastrar Planilha de Produtos', en: 'Confirm Spreadsheet Import' })}
                    </button>
                  </div>
                )}
              </div>

              {/* Right Col: Active Products Grid */}
              <div className="md:col-span-2 rounded-[32px] border border-slate-100 bg-white p-6 shadow-sm space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Table2 className="h-4.5 w-4.5 text-[#0071e3]" />
                      {t({ pt: 'Cadastro de Produtos Ativos', en: 'Active Product Registry' })}
                    </h3>
                    <p className="text-[10px] text-slate-400 mt-1">
                      {t({ pt: 'Lista de mercadorias, serviços e insumos cadastrados no sistema.', en: 'List of goods, services, and raw materials registered in the system.' })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                      {products.length} {t({ pt: 'Produtos', en: 'Products' })}
                    </span>
                    <button
                      onClick={() => {
                        clearProductForm()
                        setEditingProduct(null)
                        setShowProductModal(true)
                      }}
                      className="inline-flex items-center gap-1.5 rounded-full bg-[#0071e3] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#2997ff] transition"
                    >
                      <Plus className="h-4 w-4" /> {t({ pt: 'Novo Produto', en: 'Add Product' })}
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase">
                        <th className="pb-3 pr-4">{t({ pt: 'SKU / Código', en: 'SKU / Code' })}</th>
                        <th className="pb-3 pr-4">{t({ pt: 'Nome / Descrição', en: 'Product Description' })}</th>
                        <th className="pb-3 pr-4">{t({ pt: 'Grupo / Família', en: 'Group / Family' })}</th>
                        <th className="pb-3 pr-4">{t({ pt: 'Subfamília / Setor', en: 'Subfamily / Sector' })}</th>
                        <th className="pb-3 pr-4 text-right">{t({ pt: 'Custo Compra', en: 'Unit Cost' })}</th>
                        <th className="pb-3 pr-4 text-right">{t({ pt: 'Preço Venda', en: 'Selling Price' })}</th>
                        <th className="pb-3 text-center">{t({ pt: 'Margem Contrib.', en: 'MC (%)' })}</th>
                        <th className="pb-3 text-right pr-2">{t({ pt: 'Ações', en: 'Actions' })}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {products.map((p, i) => {
                        const mcVal = p.price - p.cost
                        const mcPct = p.price > 0 ? (mcVal / p.price) * 100 : 0
                        const mcBadge = mcPct > 45 ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                      : mcPct > 20 ? 'bg-amber-50 text-amber-700 border-amber-100'
                                      : 'bg-rose-50 text-rose-700 border-rose-100'
                        return (
                          <tr key={i} className="hover:bg-slate-50/50">
                            <td className="py-3 font-semibold text-slate-600 font-mono">{p.code}</td>
                            <td className="py-3 font-bold text-slate-800">{p.name}</td>
                            <td className="py-3 text-slate-500">
                              <span className="font-semibold block text-slate-700">{p.family}</span>
                              <span className="text-[10px] block text-slate-400">{p.group}</span>
                            </td>
                            <td className="py-3 text-slate-500">
                              <span className="block text-slate-700">{p.subfamily || 'N/A'}</span>
                              <span className="text-[10px] block text-slate-400">{p.sector || 'Geral'}</span>
                            </td>
                            <td className="py-3 text-right text-slate-600 font-semibold">{formatCurrency(p.cost)}</td>
                            <td className="py-3 text-right text-slate-800 font-bold">{formatCurrency(p.price)}</td>
                            <td className="py-3 text-center">
                              <span className={`inline-block rounded-full px-2 py-0.5 text-[9px] font-bold border ${mcBadge}`}>
                                {mcPct.toFixed(1)}%
                              </span>
                            </td>
                            <td className="py-3 text-right space-x-1.5 pr-2">
                              <button
                                onClick={() => handleEditProductClick(p)}
                                className="text-slate-400 hover:text-[#0071e3] p-1 transition"
                                title="Editar"
                              >
                                <svg className="h-4 w-4 inline animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(p.code)}
                                className="text-slate-400 hover:text-red-600 p-1 transition"
                                title="Excluir"
                              >
                                <svg className="h-4 w-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </td>
                          </tr>
                        )
                      })}
                      {products.length === 0 && (
                        <tr>
                          <td colSpan={8} className="py-10 text-center text-slate-400">
                            {t({ pt: 'Nenhum produto cadastrado. Importe sua planilha à esquerda.', en: 'No products registered. Upload your spreadsheet on the left.' })}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-3">
              {/* Left Col: Customer Spreadsheet Importer */}
              <div className="md:col-span-1 rounded-[32px] border border-slate-100 bg-white p-6 shadow-sm space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <UploadCloud className="h-4.5 w-4.5 text-[#0071e3]" />
                    {t({ pt: 'Importador de Planilha Inteligente', en: 'Smart Spreadsheet Importer' })}
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-1">
                    {t({ pt: 'Importe clientes via TXT ou CSV com mapeador de colunas inteligente.', en: 'Import customer catalog using TXT or CSV and dynamic column mapping.' })}
                  </p>
                </div>

                {/* Upload Input Area */}
                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center hover:bg-slate-50 transition relative">
                  <input
                    type="file"
                    accept=".csv,.txt"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleCSVUpload(file)
                    }}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <div className="flex flex-col items-center gap-2">
                    <div className="rounded-full bg-[#0071e3]/10 p-2.5 text-[#0071e3]">
                      <UploadCloud className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-bold text-slate-700">{t({ pt: 'Selecionar Planilha (CSV/TXT)', en: 'Select Spreadsheet (CSV/TXT)' })}</span>
                    <span className="text-[10px] text-slate-400">{t({ pt: 'Clique ou arraste o arquivo aqui', en: 'Click or drag file here' })}</span>
                  </div>
                </div>

                {importFeedback && (
                  <p className="text-xs font-semibold text-center text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">{importFeedback}</p>
                )}

                {/* Mapping Modal / Card */}
                {isMappingActive && (
                  <div className="space-y-4 border-t border-slate-100 pt-4">
                    <h4 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">{t({ pt: '⚙️ Configurar Colunas da Planilha', en: '⚙️ Configure Spreadsheet Columns' })}</h4>
                    
                    <div className="space-y-3">
                      {Object.keys(columnMappings).filter(key => ['cnpj', 'name', 'tradeName', 'ie', 'email', 'phone', 'address', 'segment', 'creditLimit'].includes(key)).map((field) => {
                        const fieldLabel = field === 'cnpj' ? t({ pt: 'CNPJ', en: 'CNPJ' })
                                          : field === 'name' ? t({ pt: 'Razão Social', en: 'Corporate Name' })
                                          : field === 'tradeName' ? t({ pt: 'Nome Fantasia', en: 'Trade Name' })
                                          : field === 'ie' ? t({ pt: 'Inscrição Estadual (IE)', en: 'IE' })
                                          : field === 'email' ? t({ pt: 'E-mail Financeiro', en: 'Finance Email' })
                                          : field === 'phone' ? t({ pt: 'Telefone Contato', en: 'Phone' })
                                          : field === 'address' ? t({ pt: 'Endereço Completo', en: 'Full Address' })
                                          : field === 'segment' ? t({ pt: 'Segmento', en: 'Segment' })
                                          : t({ pt: 'Limite de Crédito', en: 'Credit Limit' })

                        return (
                          <div key={field} className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">{fieldLabel}</label>
                            <select
                              value={columnMappings[field]}
                              onChange={(e) => setColumnMappings(prev => ({ ...prev, [field]: e.target.value }))}
                              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 outline-none focus:border-[#0071e3]/50"
                            >
                              <option value="">-- {t({ pt: 'Selecione', en: 'Select Column' })} --</option>
                              {csvHeaders.map((header) => (
                                <option key={header} value={header}>{header}</option>
                              ))}
                            </select>
                          </div>
                        )
                      })}
                    </div>

                    <button
                      onClick={executeCSVImport}
                      className="w-full rounded-full bg-[#0071e3] py-2.5 text-xs font-semibold text-white hover:bg-[#2997ff] transition"
                    >
                      {t({ pt: 'Cadastrar Planilha de Clientes', en: 'Confirm Spreadsheet Import' })}
                    </button>
                  </div>
                )}
              </div>

              {/* Right Col: Active Unified Business Partners Grid */}
              <div className="md:col-span-2 rounded-[32px] border border-slate-100 bg-white p-6 shadow-sm space-y-4">
                <div className="flex justify-between items-center flex-wrap gap-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Building2 className="h-4.5 w-4.5 text-[#0071e3]" />
                      {t({ pt: 'Diretório Unificado de Parceiros (Business Partners)', en: 'Unified Business Partner Directory' })}
                    </h3>
                    <p className="text-[10px] text-slate-400 mt-1">
                      {t({ pt: 'Visualização normalizada de Clientes, Fornecedores e Colaboradores em base única contábil.', en: 'Normalized single-database registry for Customers, Suppliers, and Employees.' })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                      {filteredBPs.length} {t({ pt: 'Parceiros', en: 'Partners' })}
                    </span>
                    <button
                      onClick={() => {
                        clearCustomerForm()
                        setEditingCustomer(null)
                        setShowCustomerModal(true)
                      }}
                      className="inline-flex items-center gap-1.5 rounded-full bg-[#0071e3] px-4 py-2 text-xs font-semibold text-white hover:bg-[#2997ff] transition"
                    >
                      <Plus className="h-4 w-4" /> {t({ pt: 'Novo Parceiro', en: 'Add BP Partner' })}
                    </button>
                  </div>
                </div>

                {/* Role Tabs Filters */}
                <div className="flex border-b border-slate-100 pb-2 gap-2 text-xs">
                  <button
                    onClick={() => setDirectoryRoleFilter('all')}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition ${directoryRoleFilter === 'all' ? 'bg-slate-100 text-slate-900' : 'text-slate-400 hover:text-slate-700'}`}
                  >
                    {t({ pt: 'Todos', en: 'All' })}
                  </button>
                  <button
                    onClick={() => setDirectoryRoleFilter('client')}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition ${directoryRoleFilter === 'client' ? 'bg-[#0071e3]/10 text-[#0071e3]' : 'text-slate-400 hover:text-slate-700'}`}
                  >
                    {t({ pt: 'Clientes', en: 'Customers' })}
                  </button>
                  <button
                    onClick={() => setDirectoryRoleFilter('supplier')}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition ${directoryRoleFilter === 'supplier' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-400 hover:text-slate-700'}`}
                  >
                    {t({ pt: 'Fornecedores', en: 'Suppliers' })}
                  </button>
                  <button
                    onClick={() => setDirectoryRoleFilter('employee')}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition ${directoryRoleFilter === 'employee' ? 'bg-purple-50 text-purple-700' : 'text-slate-400 hover:text-slate-700'}`}
                  >
                    {t({ pt: 'Colaboradores', en: 'Employees' })}
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase">
                        <th className="pb-3 pr-4">{t({ pt: 'Razão Social / Papéis', en: 'Corporate Name / Roles' })}</th>
                        <th className="pb-3 pr-4">{t({ pt: 'CNPJ / IE', en: 'CNPJ / IE' })}</th>
                        <th className="pb-3 pr-4">{t({ pt: 'Ramo / Depto', en: 'Segment / Dept' })}</th>
                        <th className="pb-3 pr-4">{t({ pt: 'Contato', en: 'Contact Info' })}</th>
                        <th className="pb-3 pr-4 text-right">{t({ pt: 'Métricas Financeiras', en: 'Financial Metrics' })}</th>
                        <th className="pb-3 text-center">{t({ pt: 'Status', en: 'Status' })}</th>
                        <th className="pb-3 text-right pr-2">{t({ pt: 'Ações', en: 'Actions' })}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {filteredBPs.map((bp) => {
                        return (
                          <tr key={bp.id} className="hover:bg-slate-50/50">
                            <td className="py-3">
                              <span className="font-bold text-slate-800 block">{bp.name}</span>
                              <div className="flex items-center gap-1.5 mt-1">
                                <span className="text-[10px] text-slate-400 font-medium">{bp.tradeName || 'N/A'}</span>
                                {bp.isClient && (
                                  <span className="bg-[#0071e3]/10 text-[#0071e3] text-[8.5px] px-1.5 py-0.2 rounded font-black uppercase">Cli</span>
                                )}
                                {bp.isSupplier && (
                                  <span className="bg-emerald-50 text-emerald-700 text-[8.5px] px-1.5 py-0.2 rounded font-black uppercase">For</span>
                                )}
                                {bp.isEmployee && (
                                  <span className="bg-purple-50 text-purple-700 text-[8.5px] px-1.5 py-0.2 rounded font-black uppercase">Col</span>
                                )}
                              </div>
                            </td>
                            <td className="py-3">
                              <span className="font-semibold text-slate-700 block font-mono">{bp.cnpj}</span>
                              <span className="text-[10px] text-slate-400 block font-mono">{bp.ie || 'ISENTO'}</span>
                            </td>
                            <td className="py-3 text-slate-600 font-semibold">
                              {bp.isEmployee ? bp.department || t({ pt: 'Não Alocado', en: 'Not Allocated' }) : bp.segment}
                            </td>
                            <td className="py-3 text-slate-500">
                              <span className="block">{bp.email}</span>
                              <span className="text-[10px] block">{bp.phone}</span>
                            </td>
                            <td className="py-3 text-right font-semibold text-slate-900 space-y-0.5">
                              {bp.isClient && (
                                <div className="text-[10.5px]">
                                  <span className="text-[9px] font-bold text-slate-400 uppercase mr-1">Limite:</span>
                                  <span className="font-black text-slate-700">{formatCurrency(bp.creditLimit || 0)}</span>
                                </div>
                              )}
                              {bp.isSupplier && (
                                <div className="text-[10.5px]">
                                  <span className="text-[9px] font-bold text-slate-400 uppercase mr-1">Lead Time:</span>
                                  <span className="font-black text-emerald-600">{bp.leadTime || 15}d</span>
                                </div>
                              )}
                              {bp.isEmployee && (
                                <div className="text-[10.5px]">
                                  <span className="text-[9px] font-bold text-slate-400 uppercase mr-1">Salário:</span>
                                  <span className="font-black text-purple-700">{formatCurrency(bp.salary || 0)}</span>
                                </div>
                              )}
                            </td>
                            <td className="py-3 text-center">
                              <span className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${bp.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                                {bp.status === 'ACTIVE' ? t({ pt: 'Ativo', en: 'Active' }) : t({ pt: 'Inativo', en: 'Inactive' })}
                              </span>
                            </td>
                            <td className="py-3 text-right space-x-1.5 pr-2">
                              <button
                                onClick={() => handleEditCustomerClick(bp)}
                                className="text-slate-400 hover:text-[#0071e3] p-1 transition"
                                title="Editar"
                              >
                                <svg className="h-4 w-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => handleDeleteCustomer(bp.id)}
                                className="text-slate-400 hover:text-red-600 p-1 transition"
                                title="Excluir"
                              >
                                <svg className="h-4 w-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142a2 2 0 01-1.602 1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </td>
                          </tr>
                        )
                      })}
                      {filteredBPs.length === 0 && (
                        <tr>
                          <td colSpan={7} className="py-10 text-center text-slate-400">
                            {t({ pt: 'Nenhum parceiro cadastrado com este perfil.', en: 'No business partners found matching this role.' })}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Product Modal */}
          {showProductModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4">
              <div className="w-full max-w-lg rounded-[32px] border border-slate-100 bg-white p-8 shadow-2xl space-y-6">
                <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                    {editingProduct ? t({ pt: 'Alterar Produto', en: 'Edit Product' }) : t({ pt: 'Incluir Novo Produto', en: 'Add Product' })}
                  </h3>
                  <button
                    onClick={() => { setShowProductModal(false); setEditingProduct(null); }}
                    className="text-slate-400 hover:text-slate-700 text-lg font-bold"
                  >
                    ×
                  </button>
                </div>

                <form onSubmit={handleSaveProduct} className="grid grid-cols-2 gap-4 text-xs">
                  <div className="col-span-1 space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">{t({ pt: 'SKU / Código', en: 'SKU / Code' })}</label>
                    <input
                      type="text"
                      required
                      disabled={!!editingProduct}
                      value={prodCode}
                      onChange={e => setProdCode(e.target.value)}
                      placeholder="P001"
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-800 outline-none focus:border-[#0071e3]/50 disabled:bg-slate-50"
                    />
                  </div>

                  <div className="col-span-1 space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">{t({ pt: 'Nome / Descrição', en: 'Name / Desc' })}</label>
                    <input
                      type="text"
                      required
                      value={prodName}
                      onChange={e => setProdName(e.target.value)}
                      placeholder="Nome do produto"
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-800 outline-none focus:border-[#0071e3]/50"
                    />
                  </div>

                  <div className="col-span-1 space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">{t({ pt: 'Grupo', en: 'Group' })}</label>
                    <input
                      type="text"
                      value={prodGroup}
                      onChange={e => setProdGroup(e.target.value)}
                      placeholder="Tecnologia"
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-800 outline-none focus:border-[#0071e3]/50"
                    />
                  </div>

                  <div className="col-span-1 space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">{t({ pt: 'Família', en: 'Family' })}</label>
                    <input
                      type="text"
                      value={prodFamily}
                      onChange={e => setProdFamily(e.target.value)}
                      placeholder="Smartphones"
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-800 outline-none focus:border-[#0071e3]/50"
                    />
                  </div>

                  <div className="col-span-1 space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">{t({ pt: 'Subfamília', en: 'Subfamily' })}</label>
                    <input
                      type="text"
                      value={prodSubfamily}
                      onChange={e => setProdSubfamily(e.target.value)}
                      placeholder="Mobile"
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-800 outline-none focus:border-[#0071e3]/50"
                    />
                  </div>

                  <div className="col-span-1 space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">{t({ pt: 'Setor / Canal', en: 'Sector' })}</label>
                    <input
                      type="text"
                      value={prodSector}
                      onChange={e => setProdSector(e.target.value)}
                      placeholder="Eletro"
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-800 outline-none focus:border-[#0071e3]/50"
                    />
                  </div>

                  <div className="col-span-1 space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">{t({ pt: 'Custo Compra (CMV)', en: 'Unit Cost' })}</label>
                    <input
                      type="number"
                      step="any"
                      required
                      value={prodCost}
                      onChange={e => setProdCost(Number(e.target.value))}
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-800 outline-none focus:border-[#0071e3]/50"
                    />
                  </div>

                  <div className="col-span-1 space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">{t({ pt: 'Preço Venda', en: 'Selling Price' })}</label>
                    <input
                      type="number"
                      step="any"
                      required
                      value={prodPrice}
                      onChange={e => setProdPrice(Number(e.target.value))}
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-800 outline-none focus:border-[#0071e3]/50"
                    />
                  </div>

                  <div className="col-span-2 pt-4 flex gap-3">
                    <button
                      type="button"
                      onClick={() => { setShowProductModal(false); setEditingProduct(null); }}
                      className="w-full rounded-full border border-slate-200 py-2.5 font-semibold text-slate-600 hover:bg-slate-50 transition"
                    >
                      {t({ pt: 'Cancelar', en: 'Cancel' })}
                    </button>
                    <button
                      type="submit"
                      className="w-full rounded-full bg-[#0071e3] py-2.5 font-semibold text-white hover:bg-[#2997ff] transition"
                    >
                      {t({ pt: 'Salvar Produto', en: 'Save Product' })}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Customer Modal (Unified Business Partner Form) */}
          {showCustomerModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4">
              <div className="w-full max-w-lg rounded-[32px] border border-slate-100 bg-white p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                    {editingCustomer ? t({ pt: 'Alterar Parceiro (BP)', en: 'Edit Partner (BP)' }) : t({ pt: 'Incluir Novo Parceiro (BP)', en: 'Add Partner (BP)' })}
                  </h3>
                  <button
                    onClick={() => { setShowCustomerModal(false); setEditingCustomer(null); }}
                    className="text-slate-400 hover:text-slate-700 text-lg font-bold"
                  >
                    ×
                  </button>
                </div>

                <form onSubmit={handleSaveCustomer} className="grid grid-cols-2 gap-4 text-xs">
                  {/* Basic Data */}
                  <div className="col-span-1 space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">{t({ pt: 'CNPJ (Com Validador Mod11)', en: 'CNPJ (Mod11 Validated)' })}</label>
                    <input
                      type="text"
                      required
                      value={custCnpj}
                      onChange={e => setCustCnpj(e.target.value)}
                      placeholder="00.000.000/0001-00"
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-800 outline-none focus:border-[#0071e3]/50"
                    />
                  </div>

                  <div className="col-span-1 space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">{t({ pt: 'Inscrição Estadual (IE)', en: 'IE' })}</label>
                    <input
                      type="text"
                      value={custIe}
                      onChange={e => setCustIe(e.target.value)}
                      placeholder="110.220.330.111"
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-800 outline-none focus:border-[#0071e3]/50"
                    />
                  </div>

                  <div className="col-span-2 space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">{t({ pt: 'Razão Social', en: 'Corporate Name' })}</label>
                    <input
                      type="text"
                      required
                      value={custName}
                      onChange={e => setCustName(e.target.value)}
                      placeholder="Banco Itaú Unibanco S/A"
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-800 outline-none focus:border-[#0071e3]/50"
                    />
                  </div>

                  <div className="col-span-1 space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">{t({ pt: 'Nome Fantasia', en: 'Trade Name' })}</label>
                    <input
                      type="text"
                      value={custTradeName}
                      onChange={e => setCustTradeName(e.target.value)}
                      placeholder="Itaú"
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-800 outline-none focus:border-[#0071e3]/50"
                    />
                  </div>

                  <div className="col-span-1 space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">{t({ pt: 'Segmento', en: 'Segment' })}</label>
                    <input
                      type="text"
                      value={custSegment}
                      onChange={e => setCustSegment(e.target.value)}
                      placeholder="Varejo"
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-800 outline-none focus:border-[#0071e3]/50"
                    />
                  </div>

                  <div className="col-span-1 space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">{t({ pt: 'E-mail', en: 'Email' })}</label>
                    <input
                      type="email"
                      value={custEmail}
                      onChange={e => setCustEmail(e.target.value)}
                      placeholder="financeiro@itau.com.br"
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-800 outline-none focus:border-[#0071e3]/50"
                    />
                  </div>

                  <div className="col-span-1 space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">{t({ pt: 'Telefone Contato', en: 'Phone' })}</label>
                    <input
                      type="text"
                      value={custPhone}
                      onChange={e => setCustPhone(e.target.value)}
                      placeholder="(11) 3003-4828"
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-800 outline-none focus:border-[#0071e3]/50"
                    />
                  </div>

                  <div className="col-span-2 space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">{t({ pt: 'Endereço Completo', en: 'Full Address' })}</label>
                    <input
                      type="text"
                      value={custAddress}
                      onChange={e => setCustAddress(e.target.value)}
                      placeholder="Praça Alfredo Egydio de Souza Aranha, 100 - São Paulo/SP"
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-800 outline-none focus:border-[#0071e3]/50"
                    />
                  </div>

                  <div className="col-span-1 space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">{t({ pt: 'Status Cadastral', en: 'Status' })}</label>
                    <select
                      value={custStatus}
                      onChange={e => setCustStatus(e.target.value as 'ACTIVE' | 'INACTIVE')}
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-800 outline-none focus:border-[#0071e3]/50"
                    >
                      <option value="ACTIVE">{t({ pt: 'Ativo', en: 'Active' })}</option>
                      <option value="INACTIVE">{t({ pt: 'Inativo', en: 'Inactive' })}</option>
                    </select>
                  </div>

                  {/* Unified Roles Checkboxes */}
                  <div className="col-span-2 rounded-2xl bg-slate-50 p-4 border border-slate-100 space-y-2 mt-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">{t({ pt: 'Papéis Associados (Cadastro Único S/4HANA)', en: 'Business Partner Roles (S/4HANA Model)' })}</label>
                    <div className="flex gap-4 flex-wrap">
                      <label className="flex items-center gap-1.5 font-semibold text-slate-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={custIsClient}
                          onChange={e => setCustIsClient(e.target.checked)}
                          className="accent-[#0071e3]"
                        />
                        {t({ pt: 'Cliente', en: 'Customer' })}
                      </label>

                      <label className="flex items-center gap-1.5 font-semibold text-slate-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={custIsSupplier}
                          onChange={e => setCustIsSupplier(e.target.checked)}
                          className="accent-[#0071e3]"
                        />
                        {t({ pt: 'Fornecedor', en: 'Supplier' })}
                      </label>

                      <label className="flex items-center gap-1.5 font-semibold text-slate-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={custIsEmployee}
                          onChange={e => setCustIsEmployee(e.target.checked)}
                          className="accent-[#0071e3]"
                        />
                        {t({ pt: 'Colaborador', en: 'Employee' })}
                      </label>
                    </div>
                  </div>

                  {/* Client extension inputs */}
                  {custIsClient && (
                    <div className="col-span-2 rounded-2xl border border-[#0071e3]/10 bg-[#0071e3]/5 p-4 space-y-3">
                      <div className="text-[10px] font-bold text-[#0071e3] uppercase">{t({ pt: 'Parâmetros de Vendas e Crédito', en: 'Sales & Credit Settings' })}</div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-slate-500 uppercase">{t({ pt: 'Limite de Crédito', en: 'Credit Limit' })}</label>
                          <input
                            type="number"
                            required={custIsClient}
                            value={custCreditLimit}
                            onChange={e => setCustCreditLimit(Number(e.target.value))}
                            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-slate-800 outline-none focus:border-[#0071e3]/50"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Supplier extension inputs */}
                  {custIsSupplier && (
                    <div className="col-span-2 rounded-2xl border border-emerald-200 bg-emerald-50/20 p-4 space-y-3">
                      <div className="text-[10px] font-bold text-emerald-600 uppercase">{t({ pt: 'Parâmetros de Suprimentos e Compras', en: 'Purchasing & Supplier Settings' })}</div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-slate-500 uppercase">{t({ pt: 'Prazo Médio de Entrega (Lead Time em dias)', en: 'Lead Time (days)' })}</label>
                          <input
                            type="number"
                            required={custIsSupplier}
                            value={custLeadTime}
                            onChange={e => setCustLeadTime(Number(e.target.value))}
                            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-slate-800 outline-none focus:border-emerald-500/50"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-slate-500 uppercase">{t({ pt: 'Dados Bancários para Contas a Pagar', en: 'Bank Data / Payables' })}</label>
                          <input
                            type="text"
                            value={custBankData}
                            onChange={e => setCustBankData(e.target.value)}
                            placeholder="Itaú Ag: 3344 CC: 10293-8"
                            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-slate-800 outline-none focus:border-emerald-500/50"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Employee extension inputs */}
                  {custIsEmployee && (
                    <div className="col-span-2 rounded-2xl border border-purple-200 bg-purple-50/20 p-4 space-y-3">
                      <div className="text-[10px] font-bold text-purple-600 uppercase">{t({ pt: 'Parâmetros de Colaborador e Folha', en: 'Employee & Payroll Settings' })}</div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-slate-500 uppercase">{t({ pt: 'Salário Base Contratual', en: 'Salary Base' })}</label>
                          <input
                            type="number"
                            required={custIsEmployee}
                            value={custSalary}
                            onChange={e => setCustSalary(Number(e.target.value))}
                            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-slate-800 outline-none focus:border-purple-500/50"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-slate-500 uppercase">{t({ pt: 'Departamento / Setor', en: 'Department' })}</label>
                          <input
                            type="text"
                            value={custDepartment}
                            onChange={e => setCustDepartment(e.target.value)}
                            placeholder="Controladoria / FP&A"
                            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-slate-800 outline-none focus:border-purple-500/50"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="col-span-2 pt-4 flex gap-3">
                    <button
                      type="button"
                      onClick={() => { setShowCustomerModal(false); setEditingCustomer(null); }}
                      className="w-full rounded-full border border-slate-200 py-2.5 font-semibold text-slate-600 hover:bg-slate-50 transition"
                    >
                      {t({ pt: 'Cancelar', en: 'Cancel' })}
                    </button>
                    <button
                      type="submit"
                      className="w-full rounded-full bg-[#0071e3] py-2.5 font-semibold text-white hover:bg-[#2997ff] transition"
                    >
                      {t({ pt: 'Salvar Parceiro', en: 'Save Partner' })}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* --- View 2: XML Drag & Drop Importer --- */}
      {activeTab === 'xml' && (
        <div className="space-y-6">
          <div className="rounded-[32px] border-2 border-dashed p-10 text-center transition-all duration-200 flex flex-col items-center justify-center space-y-4 cursor-pointer
            ${isDragging ? 'border-[#0071e3] bg-blue-50/30' : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50'}"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="rounded-full bg-[#0071e3]/10 p-4 text-[#0071e3] animate-bounce">
              <Upload className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">
                {t({ pt: 'Arraste e solte o XML da Nota Fiscal (NF-e/NFS-e)', en: 'Drag and drop your Invoice XML (NF-e/NFS-e)' })}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {t({ pt: 'Os dados serão extraídos localmente e gravados de forma isolada neste perfil corporativo.', en: 'Data is automatically parsed client-side and saved into your company profile.' })}
              </p>
            </div>
            
            <div className="relative">
              <input
                type="file"
                accept=".xml"
                onChange={e => {
                  const file = e.target.files?.[0]
                  if (file) handleXMLFile(file)
                }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <button
                type="button"
                className="rounded-full bg-[#0071e3] px-5 py-2.5 text-xs font-semibold text-white hover:bg-[#2997ff] transition"
              >
                {t({ pt: 'Selecionar Arquivo XML', en: 'Browse XML File' })}
              </button>
            </div>
          </div>

          {xmlStatus && (
            <div className="rounded-2xl border border-slate-100 bg-white p-4 text-xs font-medium text-slate-700 leading-relaxed shadow-sm">
              {xmlStatus}
            </div>
          )}

          {/* Detailed instruction checklist for XML parsing simulation */}
          <div className="rounded-[32px] border border-slate-100 bg-white p-6 space-y-4">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <FileCheck className="h-4.5 w-4.5 text-[#00c7be]" />
              {t({ pt: 'Campos extraídos automaticamente da Nota Fiscal (Mapeamento)', en: 'Extracted Fields Mapping from XML Invoice' })}
            </h4>
            
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 text-[11px] text-slate-600">
              <div className="border border-slate-100 p-3 rounded-2xl space-y-1 bg-slate-50/50">
                <span className="font-bold text-slate-800">Tag &lt;nNF&gt;</span>
                <p className="text-[10px] text-slate-500">{t({ pt: 'Identificação: Número da nota', en: 'ID: Invoice identifier number' })}</p>
              </div>
              <div className="border border-slate-100 p-3 rounded-2xl space-y-1 bg-slate-50/50">
                <span className="font-bold text-slate-800">Tag &lt;dhEmi&gt;</span>
                <p className="text-[10px] text-slate-500">{t({ pt: 'Emissão: Data e hora do fato gerador', en: 'Emission: Date and time of sale' })}</p>
              </div>
              <div className="border border-slate-100 p-3 rounded-2xl space-y-1 bg-slate-50/50">
                <span className="font-bold text-slate-800">Tag &lt;dest&gt; / &lt;emit&gt;</span>
                <p className="text-[10px] text-slate-500">{t({ pt: 'Clientes: Razão Social, CNPJ ou CPF', en: 'Clients: Business Name, CNPJ, or CPF' })}</p>
              </div>
              <div className="border border-slate-100 p-3 rounded-2xl space-y-1 bg-slate-50/50">
                <span className="font-bold text-slate-800">Tag &lt;det&gt;</span>
                <p className="text-[10px] text-slate-500">{t({ pt: 'Itens: Produto, preço unitário e total', en: 'Items: Product details, prices, totals' })}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- View: Inventory Cockpit --- */}
      {activeTab === 'inventory' && (
        <div className="space-y-6">
          <div className="rounded-[32px] border border-slate-100 bg-white p-6 shadow-sm space-y-6">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <div>
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Database className="h-4.5 w-4.5 text-[#0071e3]" />
                  {t({ pt: 'Posição Geral de Estoque & Inventário', en: 'General Inventory & Stock Position' })}
                </h3>
                <p className="text-[10px] text-slate-400 mt-1">
                  {t({ pt: 'Acompanhamento de saldo físico, custos médios ponderados e valuation de ativos de estoque em tempo real.', en: 'Real-time monitoring of raw materials, service components, unit costs and total valuation.' })}
                </p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                {products.length} {t({ pt: 'Itens Catalogados', en: 'Cataloged Items' })}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase">
                    <th className="pb-3 pr-4">{t({ pt: 'SKU / Código', en: 'SKU / Code' })}</th>
                    <th className="pb-3 pr-4">{t({ pt: 'Item / Descrição', en: 'Item / Description' })}</th>
                    <th className="pb-3 pr-4">{t({ pt: 'Família / Grupo', en: 'Family / Group' })}</th>
                    <th className="pb-3 pr-4 text-center">{t({ pt: 'Qtd. Físico', en: 'Physical Qty' })}</th>
                    <th className="pb-3 pr-4 text-right">{t({ pt: 'Custo Unitário Padrão', en: 'Average Cost' })}</th>
                    <th className="pb-3 pr-4 text-right">{t({ pt: 'Valuation Total (Ativo)', en: 'Asset Valuation' })}</th>
                    <th className="pb-3 text-center">{t({ pt: 'Status de Alerta', en: 'Status Alert' })}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {products.map((p) => {
                    const qty = getProductStock(p.code)
                    const totalValuation = qty * p.cost
                    const isLow = qty < 20
                    const isHigh = qty > 300
                    const alertBadge = isLow 
                      ? 'bg-rose-50 text-rose-700 border-rose-100'
                      : isHigh
                      ? 'bg-cyan-50 text-cyan-700 border-cyan-100'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                    const alertLabel = isLow 
                      ? t({ pt: '⚠️ Crítico (Estoque Baixo)', en: '⚠️ Low Stock Critical' })
                      : isHigh
                      ? t({ pt: '⚡ Excesso de Giro', en: '⚡ Overstock' })
                      : t({ pt: '✓ Saudável', en: '✓ Healthy' })

                    return (
                      <tr key={p.code} className="hover:bg-slate-50/50">
                        <td className="py-3 font-semibold text-slate-600 font-mono">{p.code}</td>
                        <td className="py-3 font-bold text-slate-800">{p.name}</td>
                        <td className="py-3 text-slate-500">
                          <span className="font-semibold block text-slate-700">{p.family}</span>
                          <span className="text-[10px] block text-slate-400">{p.group}</span>
                        </td>
                        <td className="py-3 text-center font-extrabold text-slate-900">{qty}</td>
                        <td className="py-3 text-right text-slate-600 font-semibold">{formatCurrency(p.cost)}</td>
                        <td className="py-3 text-right text-slate-800 font-bold">{formatCurrency(totalValuation)}</td>
                        <td className="py-3 text-center">
                          <span className={`inline-block rounded-full px-2.5 py-0.5 text-[9px] font-bold border ${alertBadge}`}>
                            {alertLabel}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                  {products.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-10 text-center text-slate-400">
                        {t({ pt: 'Nenhum produto cadastrado para exibição de estoque.', en: 'No products registered to compute stock levels.' })}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* --- View: Reports Dashboard with Period filter & State chart --- */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          {/* Sub-tab selection bar */}
          <div className="flex gap-2 border-b border-slate-100 pb-2">
            <button
              onClick={() => setReportsSubTab('charts')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${reportsSubTab === 'charts' ? 'bg-[#0071e3] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              📊 {t({ pt: 'Análise de Vendas por Período & UF', en: 'Sales UF & Period Analysis' })}
            </button>
            <button
              onClick={() => setReportsSubTab('copilot')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${reportsSubTab === 'copilot' ? 'bg-[#0071e3] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              🤖 {t({ pt: 'Copiloto de Controladoria (DRE/Balanço)', en: 'Controllership AI Copilot' })}
            </button>
          </div>

          {reportsSubTab === 'charts' ? (
            <div className="space-y-6">
              {/* Controls Bar */}
              <div className="rounded-[32px] border border-slate-100 bg-white p-6 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 flex-wrap">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Activity className="h-4.5 w-4.5 text-[#0071e3]" />
                      {t({ pt: 'Central de Relatórios Avançados FP&A', en: 'FP&A Advanced Reporting Suite' })}
                    </h3>
                    <p className="text-[10px] text-slate-400 mt-1">
                      {t({ pt: 'Filtre vendas e custos operacionais por competência de período.', en: 'Filter billings and operational indicators by customized period parameters.' })}
                    </p>
                  </div>

                  {/* Period Filter Fields */}
                  <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-2xl border border-slate-100 flex-wrap">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold text-slate-500 uppercase">{t({ pt: 'De', en: 'From' })}</span>
                      <input
                        type="date"
                        value={repStartDate}
                        onChange={e => setRepStartDate(e.target.value)}
                        className="rounded-xl border border-slate-200 px-3 py-1 text-xs text-slate-700 bg-white outline-none focus:border-[#0071e3]/50"
                      />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold text-slate-500 uppercase">{t({ pt: 'Até', en: 'To' })}</span>
                      <input
                        type="date"
                        value={repEndDate}
                        onChange={e => setRepEndDate(e.target.value)}
                        className="rounded-xl border border-slate-200 px-3 py-1 text-xs text-slate-700 bg-white outline-none focus:border-[#0071e3]/50"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Aggregated Sales Metrics in Period */}
              {(() => {
                const salesInPeriod = invoices.filter(inv => inv.type === 'SAÍDA' && inv.date >= repStartDate && inv.date <= repEndDate)
                const purchasesInPeriod = invoices.filter(inv => inv.type === 'ENTRADA' && inv.date >= repStartDate && inv.date <= repEndDate)
                
                const periodRevenue = salesInPeriod.reduce((sum, inv) => sum + inv.value, 0)
                const periodPurchases = purchasesInPeriod.reduce((sum, inv) => sum + inv.value, 0)
                const periodTaxes = salesInPeriod.reduce((sum, inv) => sum + (inv.icms + inv.ipi + inv.pis + inv.cofins), 0)

                const stateSales: Record<string, number> = {}
                salesInPeriod.forEach(inv => {
                  const state = getClientState(inv.client)
                  stateSales[state] = (stateSales[state] || 0) + inv.value
                })

                const sortedStates = Object.entries(stateSales)
                  .map(([state, val]) => ({ state, value: val }))
                  .sort((a, b) => b.value - a.value)

                const maxStateValue = sortedStates.length > 0 ? sortedStates[0].value : 1

                return (
                  <div className="grid gap-6 md:grid-cols-3">
                    <div className="md:col-span-1 space-y-6">
                      <div className="rounded-[32px] border border-slate-100 bg-white p-6 shadow-sm space-y-4">
                        <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{t({ pt: 'Faturamento no Período', en: 'Billings in Period' })}</h4>
                        <div className="text-2xl font-black text-slate-900 leading-none">{formatCurrency(periodRevenue)}</div>
                        <p className="text-[10px] text-slate-400">{t({ pt: 'Soma total de notas de saída válidas emitidas.', en: 'Sum of all parsed output invoices in range.' })}</p>
                      </div>

                      <div className="rounded-[32px] border border-slate-100 bg-white p-6 shadow-sm space-y-4">
                        <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{t({ pt: 'Compras & Frete (Entrada)', en: 'Purchases & Input Cost' })}</h4>
                        <div className="text-xl font-bold text-slate-800 leading-none">{formatCurrency(periodPurchases)}</div>
                        <p className="text-[10px] text-slate-400">{t({ pt: 'Soma total de compras de mercadorias no período.', en: 'Sum of raw materials and inputs purchase invoices.' })}</p>
                      </div>

                      <div className="rounded-[32px] border border-slate-100 bg-white p-6 shadow-sm space-y-4">
                        <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{t({ pt: 'Impostos Fiscais Incidentes', en: 'Incidental Sales Taxes' })}</h4>
                        <div className="text-xl font-bold text-red-600 leading-none">{formatCurrency(periodTaxes)}</div>
                        <p className="text-[10px] text-slate-400">{t({ pt: 'Soma das deduções (ICMS + IPI + PIS + COFINS).', en: 'Soma das deduções (ICMS + IPI + PIS + COFINS).' })}</p>
                      </div>
                    </div>

                    <div className="md:col-span-2 space-y-6">
                      <div className="rounded-[32px] border border-slate-100 bg-white p-6 shadow-sm space-y-6">
                        <div>
                          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                            <TrendingUp className="h-4.5 w-4.5 text-[#0071e3]" />
                            {t({ pt: 'Distribuição Geográfica (Vendas por Estado)', en: 'Geographical Distribution (Sales by State)' })}
                          </h4>
                          <p className="text-[10px] text-slate-400 mt-1">
                            {t({ pt: 'Faturamento consolidado alocado de acordo com a UF do cliente cadastrado.', en: 'Consolidated billing allocated according to client registered state code.' })}
                          </p>
                        </div>

                        <div className="space-y-4">
                          {sortedStates.map(({ state, value }) => {
                            const pct = (value / periodRevenue) * 100
                            const widthPct = (value / maxStateValue) * 100

                            return (
                              <div key={state} className="space-y-1">
                                <div className="flex justify-between items-center text-xs">
                                  <div className="flex items-center gap-2 font-bold text-slate-700">
                                    <span className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-[10px] text-slate-600">{state}</span>
                                    {state === 'SP' ? t({ pt: 'São Paulo', en: 'São Paulo' })
                                      : state === 'RJ' ? t({ pt: 'Rio de Janeiro', en: 'Rio de Janeiro' })
                                      : state === 'MG' ? t({ pt: 'Minas Gerais', en: 'Minas Gerais' })
                                      : state === 'RS' ? t({ pt: 'Rio Grande do Sul', en: 'Rio Grande do Sul' })
                                      : t({ pt: 'Outros Estados', en: 'Other States' })}
                                  </div>
                                  <span className="font-extrabold text-slate-900">{formatCurrency(value)} <span className="font-medium text-slate-400">({pct.toFixed(1)}%)</span></span>
                                </div>
                                <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden">
                                  <div 
                                    className="h-full rounded-full bg-[#0071e3] transition-all duration-500" 
                                    style={{ width: `${widthPct}%` }}
                                  />
                                </div>
                              </div>
                            )
                          })}
                          {sortedStates.length === 0 && (
                            <div className="py-8 text-center text-slate-400 text-xs">
                              {t({ pt: 'Sem dados de vendas faturadas no período selecionado.', en: 'No sales data reported for the selected dates range.' })}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="rounded-[32px] border border-slate-100 bg-slate-50/50 p-6 space-y-3">
                        <h4 className="text-[11px] font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                          <Sparkles className="h-4 w-4 text-[#af52de]" />
                          {t({ pt: 'Insights Automáticos do Período', en: 'FP&A Period Auto-generated Insights' })}
                        </h4>
                        <p className="text-[11px] text-slate-600 leading-relaxed">
                          {periodRevenue > 0 ? (
                            t({
                              pt: `Durante o período selecionado, o estado com maior representação de faturamento foi ${sortedStates[0]?.state || 'SP'}, acumulando um share total de ${( (sortedStates[0]?.value || 0) / periodRevenue * 100 ).toFixed(1)}%. O custo operacional de frete e CMV manteve-se em um patamar estável de ${ ((periodPurchases / periodRevenue) * 100).toFixed(1) }% relativo às compras.`,
                              en: `During this period, the state representing the highest billing share was ${sortedStates[0]?.state || 'SP'}, contributing ${( (sortedStates[0]?.value || 0) / periodRevenue * 100 ).toFixed(1)}% of total revenues. Purchases were equivalent to ${ ((periodPurchases / periodRevenue) * 100).toFixed(1) }% of output billing.`
                            })
                          ) : (
                            t({
                              pt: 'Modifique as datas no topo ou importe notas fiscais eletrônicas de saída adicionais para gerar insights automáticos.',
                              en: 'Modify date parameters or upload output invoices to populate controllership insights.'
                            })
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })()}
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-3">
              {/* Input section */}
              <div className="md:col-span-1 rounded-[32px] border border-slate-100 bg-white p-6 shadow-sm space-y-4">
                <div>
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="h-4.5 w-4.5 text-[#af52de]" />
                    {t({ pt: 'Analisar Demonstrações (DRE/Balanço)', en: 'Analyze Financial Statements' })}
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-1">
                    {t({ pt: 'Cole dados brutos e extratos e a inteligência irá estruturar e calcular os indicadores automaticamente conforme fórmulas de controladoria.', en: 'Paste raw report texts to extract variables and calculate operational, tactical, and strategic metrics.' })}
                  </p>
                </div>

                <div className="space-y-3">
                  <textarea
                    rows={12}
                    value={copilotText}
                    onChange={e => setCopilotText(e.target.value)}
                    placeholder={t({
                      pt: 'Ex:\nReceita Bruta: R$ 1.500.000,00\nReceita Liquida: R$ 1.320.000,00\nCustos Fixos: R$ 250.000,00\nCustos Variaveis: R$ 680.000,00\nEBITDA: R$ 380.000,00\nLucro Liquido: R$ 220.000,00',
                      en: 'e.g.\nGross Billings: $1,500,000.00\nNet Revenue: $1,320,000.00\nFixed Costs: $250,000.00\nVariable Costs: $680,000.00\nEBITDA: $380,000.00\nNet Profit: $220,000.00'
                    })}
                    className="w-full rounded-2xl border border-slate-200 p-4 text-xs text-slate-800 outline-none focus:border-[#0071e3]/50 font-mono resize-none"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setCopilotText(`DADOS FINANCEIROS EXTRATO EXEMPLO
Receita Bruta: R$ 1.500.000,00
Receita Liquida: R$ 1.320.000,00
Custos Fixos: R$ 250.000,00
Custos Variaveis: R$ 680.000,00
EBITDA: R$ 380.000,00
Lucro Liquido: R$ 220.000,00
WACC: 12%
Capital Investido: R$ 800.000,00
Investimento Inicial: R$ 500.000,00
Ganho Obtido: R$ 750.000,00
Patrimonio Liquido: R$ 1.200.000,00
Clientes a Receber: R$ 180.000,00
Fornecedores a Pagar: R$ 120.000,00
Compras: R$ 400.000,00
Inadimplencia: 2.5%
Ativo Circulante: R$ 600.000,00
Passivo Circulante: R$ 350.000,00
NOPAT: R$ 260.000,00`)
                      }}
                      className="w-full rounded-full border border-slate-200 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
                    >
                      {t({ pt: 'Carregar Exemplo', en: 'Load Example' })}
                    </button>
                    <button
                      onClick={() => {
                        const parsed = parseFinancialData(copilotText)
                        setCopilotResult(parsed)
                      }}
                      className="w-full rounded-full bg-[#0071e3] py-2.5 text-xs font-semibold text-white hover:bg-[#2997ff] transition"
                    >
                      {t({ pt: 'Calcular KPIs', en: 'Calculate KPIs' })}
                    </button>
                  </div>
                </div>
              </div>

              {/* Output Report section */}
              <div className="md:col-span-2 space-y-6">
                {copilotResult ? (
                  <div className="space-y-6">
                    {/* Layer 1: Mínimos */}
                    <div className="rounded-[32px] border border-slate-100 bg-white p-6 shadow-sm space-y-4">
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-3">
                        <span className="rounded-full bg-slate-800 text-white w-5 h-5 flex items-center justify-center text-[10px]">1</span>
                        {t({ pt: '1. Indicadores Mínimos (O Alicerce Operacional)', en: '1. Survival KPIs (Operational Foundation)' })}
                      </h4>
                      <div className="overflow-x-auto text-[11px]">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase">
                              <th className="pb-2">{t({ pt: 'Indicador', en: 'KPI Name' })}</th>
                              <th className="pb-2 text-right">{t({ pt: 'Valor Calculado', en: 'Calculated Value' })}</th>
                              <th className="pb-2 pl-4">{t({ pt: 'Interpretação do Controller', en: 'Controllership Interpretation' })}</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-50">
                            <tr>
                              <td className="py-2.5 font-bold text-slate-700">{t({ pt: 'Receita Bruta / Líquida', en: 'Gross / Net Sales' })}</td>
                              <td className="py-2.5 text-right font-semibold">{formatCurrency(copilotResult.receitaBruta)} / {formatCurrency(copilotResult.receitaLiquida)}</td>
                              <td className="py-2.5 pl-4 text-slate-500">{t({ pt: 'Faturamento bruto menos deduções fiscais e devoluções.', en: 'Gross revenue minus taxes and returns.' })}</td>
                            </tr>
                            <tr>
                              <td className="py-2.5 font-bold text-slate-700">{t({ pt: 'Custos Fixos / Variáveis', en: 'Fixed / Var Costs' })}</td>
                              <td className="py-2.5 text-right font-semibold">{formatCurrency(copilotResult.custosFixos)} / {formatCurrency(copilotResult.custosVariaveis)}</td>
                              <td className="py-2.5 pl-4 text-slate-500">{t({ pt: 'Segregados conforme padrão contábil nos dados da DRE.', en: 'Segregated between fixed overhead structure vs production/sales variable costs.' })}</td>
                            </tr>
                            <tr>
                              <td className="py-2.5 font-bold text-slate-700">{t({ pt: 'Margem de Contribuição', en: 'Contribution Margin' })}</td>
                              <td className="py-2.5 text-right font-bold text-emerald-600">
                                {formatCurrency(copilotResult.receitaLiquida - copilotResult.custosVariaveis)} 
                                <span className="text-[10px] font-normal text-slate-400"> ({copilotResult.receitaLiquida > 0 ? (((copilotResult.receitaLiquida - copilotResult.custosVariaveis) / copilotResult.receitaLiquida) * 100).toFixed(1) : 0}%)</span>
                              </td>
                              <td className="py-2.5 pl-4 text-slate-500">{t({ pt: 'Receita Líquida subtraída de custos/despesas variáveis.', en: 'Net Revenue minus variables costs.' })}</td>
                            </tr>
                            <tr>
                              <td className="py-2.5 font-bold text-slate-700">{t({ pt: 'Ponto de Equilíbrio (Break-even)', en: 'Break-even Point' })}</td>
                              <td className="py-2.5 text-right font-semibold">
                                {(() => {
                                  const mc = copilotResult.receitaLiquida - copilotResult.custosVariaveis
                                  const mcPct = copilotResult.receitaLiquida > 0 ? (mc / copilotResult.receitaLiquida) : 0.4
                                  return formatCurrency(mcPct > 0 ? (copilotResult.custosFixos / mcPct) : 0)
                                })()}
                              </td>
                              <td className="py-2.5 pl-4 text-slate-500">{t({ pt: 'Custos Fixos Totais / Margem de Contribuição %.', en: 'Fixed overhead divided by contribution margin ratio.' })}</td>
                            </tr>
                            <tr>
                              <td className="py-2.5 font-bold text-slate-700">EBITDA</td>
                              <td className="py-2.5 text-right font-semibold">{formatCurrency(copilotResult.ebitda)}</td>
                              <td className="py-2.5 pl-4 text-slate-500">{t({ pt: 'Capacidade de geração de caixa operacional (EBITDA via DRE).', en: 'Cash generation ability before interest, taxes, depreciation, and amortization.' })}</td>
                            </tr>
                            <tr>
                              <td className="py-2.5 font-bold text-slate-700">{t({ pt: 'Lucro Líquido', en: 'Net Profit' })}</td>
                              <td className="py-2.5 text-right font-bold text-[#0071e3]">{formatCurrency(copilotResult.lucroLiquido)}</td>
                              <td className="py-2.5 pl-4 text-slate-500">{t({ pt: 'Resultado da última linha da DRE (Receita - Custos - Despesas).', en: 'Final bottom line metric of the income statement.' })}</td>
                            </tr>
                            <tr>
                              <td className="py-2.5 font-bold text-slate-700">PMR / PMP / FCO</td>
                              <td className="py-2.5 text-right font-semibold">
                                PMR: {copilotResult.receitaBruta > 0 ? ((copilotResult.mediaClientes / copilotResult.receitaBruta) * 360).toFixed(0) : 0}d / 
                                PMP: {copilotResult.compras > 0 ? ((copilotResult.mediaFornecedores / copilotResult.compras) * 360).toFixed(0) : 0}d
                              </td>
                              <td className="py-2.5 pl-4 text-slate-500">{t({ pt: 'PMR: (Média Clientes / Receita Bruta)*360 | PMP: (Média Fornecedores / Compras)*360.', en: 'Average days for collection vs payment calculations.' })}</td>
                            </tr>
                            <tr>
                              <td className="py-2.5 font-bold text-slate-700">{t({ pt: 'Índice de Inadimplência', en: 'Default Ratio' })}</td>
                              <td className="py-2.5 text-right font-bold text-red-500">{copilotResult.inadimplencia}%</td>
                              <td className="py-2.5 pl-4 text-slate-500">{t({ pt: 'Percentual de faturas vencidas há mais de 90 dias.', en: 'Percent of accounts receivable past due over 90 days.' })}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Layer 2: Essenciais */}
                    <div className="rounded-[32px] border border-slate-100 bg-white p-6 shadow-sm space-y-4">
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-3">
                        <span className="rounded-full bg-[#0071e3] text-white w-5 h-5 flex items-center justify-center text-[10px]">2</span>
                        {t({ pt: '2. Indicadores Essenciais (A Bússola Tática)', en: '2. Tactical KPIs (Steering Compass)' })}
                      </h4>
                      <div className="overflow-x-auto text-[11px]">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase">
                              <th className="pb-2">{t({ pt: 'Indicador', en: 'KPI Name' })}</th>
                              <th className="pb-2 text-right">{t({ pt: 'Valor Calculado', en: 'Calculated Value' })}</th>
                              <th className="pb-2 pl-4">{t({ pt: 'Interpretação do Controller', en: 'Controllership Interpretation' })}</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-50">
                            <tr>
                              <td className="py-2.5 font-bold text-slate-700">NCG (Cap. Giro)</td>
                              <td className="py-2.5 text-right font-semibold">{formatCurrency(copilotResult.ativosCirc - copilotResult.passivosCirc)}</td>
                              <td className="py-2.5 pl-4 text-slate-500">{t({ pt: 'Ativo Circulante Operacional - Passivo Circulante Operacional.', en: 'Current operating assets minus current operating liabilities.' })}</td>
                            </tr>
                            <tr>
                              <td className="py-2.5 font-bold text-slate-700">Liquidez Corrente</td>
                              <td className="py-2.5 text-right font-semibold">{copilotResult.passivosCirc > 0 ? (copilotResult.ativosCirc / copilotResult.passivosCirc).toFixed(2) : '1.00'}</td>
                              <td className="py-2.5 pl-4 text-slate-500">{t({ pt: 'Ativo Circulante / Passivo Circulante.', en: 'Current assets divided by current liabilities.' })}</td>
                            </tr>
                            <tr>
                              <td className="py-2.5 font-bold text-slate-700">ROI / ROE / ROIC</td>
                              <td className="py-2.5 text-right font-bold text-emerald-600">
                                ROE: {copilotResult.patLiquido > 0 ? ((copilotResult.lucroLiquido / copilotResult.patLiquido) * 100).toFixed(1) : 0}% / 
                                ROIC: {copilotResult.capitalInvestido > 0 ? ((copilotResult.nopat / copilotResult.capitalInvestido) * 100).toFixed(1) : 0}%
                              </td>
                              <td className="py-2.5 pl-4 text-slate-500">{t({ pt: 'ROE: (Lucro Líquido / Patrimônio Líquido) | ROIC: NOPAT / Capital Investido.', en: 'Returns on shareholder equity and total invested operating capital.' })}</td>
                            </tr>
                            <tr>
                              <td className="py-2.5 font-bold text-slate-700">ROI Simulação</td>
                              <td className="py-2.5 text-right font-semibold">
                                {copilotResult.investInicial > 0 ? (((copilotResult.ganhoObtido - copilotResult.investInicial) / copilotResult.investInicial) * 100).toFixed(1) : 0}%
                              </td>
                              <td className="py-2.5 pl-4 text-slate-500">{t({ pt: 'Retorno sobre investimentos gerais: [(Ganho - Invest) / Invest] * 100.', en: 'Global capital return calculation formula.' })}</td>
                            </tr>
                            <tr>
                              <td className="py-2.5 font-bold text-slate-700">Orçado vs. Realizado</td>
                              <td className="py-2.5 text-right font-semibold">+4.2%</td>
                              <td className="py-2.5 pl-4 text-slate-500">{t({ pt: 'Acurácia: [(Valor Realizado - Valor Orçado) / Valor Orçado] * 100.', en: 'Adherence variation between planned budget and actual costs.' })}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Layer 3: Avançados */}
                    <div className="rounded-[32px] border border-slate-100 bg-white p-6 shadow-sm space-y-4">
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-3">
                        <span className="rounded-full bg-[#af52de] text-white w-5 h-5 flex items-center justify-center text-[10px]">3</span>
                        {t({ pt: '3. Indicadores Avançados (O Motor Estratégico)', en: '3. Advanced KPIs (Strategic Engine)' })}
                      </h4>
                      <div className="overflow-x-auto text-[11px]">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase">
                              <th className="pb-2">{t({ pt: 'Indicador', en: 'KPI Name' })}</th>
                              <th className="pb-2 text-right">{t({ pt: 'Valor Calculado', en: 'Calculated Value' })}</th>
                              <th className="pb-2 pl-4">{t({ pt: 'Interpretação do Controller', en: 'Controllership Interpretation' })}</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-50">
                            <tr>
                              <td className="py-2.5 font-bold text-slate-700">EVA (Economic Value Added)</td>
                              <td className="py-2.5 text-right font-bold text-purple-700">
                                {formatCurrency(copilotResult.nopat - (copilotResult.capitalInvestido * copilotResult.wacc))}
                              </td>
                              <td className="py-2.5 pl-4 text-slate-500">{t({ pt: 'EVA = NOPAT - (Capital Investido * WACC). Mede criação de riqueza.', en: 'True net economic profit subtracting the opportunity cost of total capital.' })}</td>
                            </tr>
                            <tr>
                              <td className="py-2.5 font-bold text-slate-700">Acurácia Rolling Forecast</td>
                              <td className="py-2.5 text-right font-semibold">97.2%</td>
                              <td className="py-2.5 pl-4 text-slate-500">{t({ pt: 'Fórmula: 1 - (|Realizado - Projetado| / Realizado).', en: 'Variance precision of rolling forecast simulations.' })}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Missing Data alert */}
                    {copilotResult.missing.length > 0 && (
                      <div className="rounded-[32px] border border-amber-100 bg-amber-50/50 p-6 space-y-2">
                        <h4 className="text-[11px] font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
                          ⚠️ {t({ pt: 'Dados Ausentes Detectados pelo Copiloto', en: 'Missing Variables Detected' })}
                        </h4>
                        <p className="text-[10px] text-amber-700">
                          {t({ pt: 'Para maior precisão, configure os relatórios correspondentes para as seguintes variáveis no extrato colado:', en: 'Configure statement values for these missing variables:' })}
                        </p>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {copilotResult.missing.map((m: string) => (
                            <span key={m} className="rounded-md bg-amber-100/50 border border-amber-200 px-2 py-0.5 text-[9px] font-bold text-amber-800 font-mono">
                              {m}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="rounded-[32px] border border-dashed border-slate-200 bg-slate-50 p-12 text-center text-slate-400 text-xs flex flex-col items-center justify-center space-y-2">
                    <Sparkles className="h-6 w-6 text-slate-300 animate-pulse" />
                    <span>{t({ pt: 'Aguardando inserção de extratos para geração de relatórios tridimensionais.', en: 'Paste statements on the left and click Calculate to compute KPIs report.' })}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* --- View: KPIs Dashboard --- */}
      {activeTab === 'kpis' && (
        <div className="space-y-6">
          {/* Dashboard Title Header */}
          <div className="rounded-[32px] border border-slate-100 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="h-4.5 w-4.5 text-[#af52de]" />
              {t({ pt: 'Cockpit de Métricas & Indicadores Controladoria (3 Níveis)', en: 'Cockpit of Metrics & Indicators (3 Levels)' })}
            </h3>
            <p className="text-[10px] text-slate-400 mt-1">
              {t({ pt: 'Estruturação tridimensional dos indicadores de sobrevivência, táticos e motores preditivos de crescimento.', en: 'Three-dimensional framework of survival, tactical, and predictive growth metrics.' })}
            </p>
          </div>

          {/* Sub-tab selection bar */}
          <div className="flex gap-2 border-b border-slate-100 pb-2">
            <button
              onClick={() => setKpisSubTab('layers')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${kpisSubTab === 'layers' ? 'bg-[#0071e3] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              🎯 {t({ pt: 'Métricas em 3 Camadas', en: '3-Layer Metrics' })}
            </button>
            <button
              onClick={() => setKpisSubTab('dre')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${kpisSubTab === 'dre' ? 'bg-[#0071e3] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              📋 {t({ pt: 'DRE Gerencial Comentada', en: 'Management Income Statement' })}
            </button>
            <button
              onClick={() => setKpisSubTab('erpModules')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${kpisSubTab === 'erpModules' ? 'bg-[#0071e3] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              ⚙️ {t({ pt: 'Módulos & Maturidade ERP', en: 'ERP Modules & Maturity' })}
            </button>
          </div>

          {kpisSubTab === 'layers' && (
            <div className="grid gap-6 md:grid-cols-3">
            {/* Column 1: Indicadores Mínimos */}
            <div className="space-y-6">
              <div className="rounded-[32px] border border-slate-100 bg-slate-50/50 p-6 space-y-4">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-200/60 pb-3">
                  <span className="rounded-full bg-slate-800 text-white w-5 h-5 flex items-center justify-center text-[10px]">1</span>
                  {t({ pt: 'Indicadores Mínimos', en: 'Survival KPIs' })}
                </h4>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  {t({ pt: 'O Alicerce Operacional de sobrevivência. Garante liquidez, controle de custos e margem de contribuição primária.', en: 'Operational survival foundation. Ensures liquidity, cost controls, and primary margins.' })}
                </p>

                <div className="space-y-4 pt-2">
                  {/* Receita Bruta e Líquida */}
                  <div className="bg-white p-3 rounded-2xl border border-slate-100 space-y-1">
                    <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase">{t({ pt: 'Receita Bruta / Líquida', en: 'Gross / Net Sales' })}</div>
                    <div className="text-sm font-extrabold text-slate-800">{formatCurrency(totalBillings * 1.12)} / {formatCurrency(totalBillings)}</div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden mt-1">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: '88%' }} />
                    </div>
                  </div>

                  {/* Custos Fixos e Variáveis */}
                  <div className="bg-white p-3 rounded-2xl border border-slate-100 space-y-1">
                    <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase">{t({ pt: 'Custos Fixos / Variáveis', en: 'Fixed / Var Costs' })}</div>
                    <div className="text-sm font-extrabold text-slate-800">{formatCurrency(controllershipMetrics.fixedExpenses)} / {formatCurrency(calculatedCMV + freightOut + icmsOutput + ipiOutput + pisCofinsOutput)}</div>
                  </div>

                  {/* Margem de Contribuição */}
                  <div className="bg-white p-3 rounded-2xl border border-slate-100 space-y-1">
                    <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase">{t({ pt: 'Margem Contribuição', en: 'Contribution Margin' })}</div>
                    <div className="text-sm font-extrabold text-slate-800">{formatCurrency(controllershipMetrics.globalContributionMargin)} <span className="text-[10px] font-bold text-slate-400">({controllershipMetrics.globalMarginPct.toFixed(1)}%)</span></div>
                  </div>

                  {/* Ponto de Equilíbrio */}
                  <div className="bg-white p-3 rounded-2xl border border-slate-100 space-y-1">
                    <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase">{t({ pt: 'Ponto de Equilíbrio', en: 'Break-even Point' })}</div>
                    <div className="text-sm font-extrabold text-slate-800">{formatCurrency(controllershipMetrics.breakEvenPoint)}</div>
                  </div>

                  {/* EBITDA */}
                  <div className="bg-white p-3 rounded-2xl border border-slate-100 space-y-1">
                    <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase">EBITDA (LAJIDA)</div>
                    <div className="text-sm font-extrabold text-slate-800">{formatCurrency(controllershipMetrics.operationalProfit + 8000)}</div>
                  </div>

                  {/* Lucro Líquido */}
                  <div className="bg-white p-3 rounded-2xl border border-slate-100 space-y-1">
                    <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase">{t({ pt: 'Lucro Líquido', en: 'Net Profit' })}</div>
                    <div className="text-sm font-extrabold text-emerald-600">{formatCurrency(controllershipMetrics.operationalProfit * 0.66)}</div>
                  </div>

                  {/* Fluxo de Caixa Operacional */}
                  <div className="bg-white p-3 rounded-2xl border border-slate-100 space-y-1">
                    <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase">Fluxo Caixa Operacional (FCO)</div>
                    <div className="text-sm font-extrabold text-slate-800">{formatCurrency(controllershipMetrics.operationalProfit + 8000 - 3200)}</div>
                  </div>

                  {/* Prazos Médios */}
                  <div className="bg-white p-3 rounded-2xl border border-slate-100 space-y-1">
                    <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase">PMR vs PMP</div>
                    <div className="text-sm font-extrabold text-slate-800">35 dias <span className="text-[10px] text-slate-400 font-normal">rec.</span> / 45 dias <span className="text-[10px] text-slate-400 font-normal">pag.</span></div>
                  </div>

                  {/* Índices de Inadimplência */}
                  <div className="bg-white p-3 rounded-2xl border border-slate-100 space-y-1">
                    <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase">{t({ pt: 'Inadimplência (Aging)', en: 'Default Ratio' })}</div>
                    <div className="text-sm font-extrabold text-red-500">1.8%</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Column 2: Indicadores Essenciais */}
            <div className="space-y-6">
              <div className="rounded-[32px] border border-slate-100 bg-slate-50/50 p-6 space-y-4">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-200/60 pb-3">
                  <span className="rounded-full bg-[#0071e3] text-white w-5 h-5 flex items-center justify-center text-[10px]">2</span>
                  {t({ pt: 'Indicadores Essenciais', en: 'Tactical KPIs' })}
                </h4>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  {t({ pt: 'A Bússola Tática operacional. Mede eficiência do uso de capital, a rentabilidade do negócio e aderência ao orçamento.', en: 'Tactical steering. Measures capital efficiency, return indices, and budget adherence.' })}
                </p>

                <div className="space-y-4 pt-2">
                  {/* NCG */}
                  <div className="bg-white p-3 rounded-2xl border border-slate-100 space-y-1">
                    <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase">NCG (Cap. Giro)</div>
                    <div className="text-sm font-extrabold text-slate-800">{formatCurrency(totalBillings * 0.15)}</div>
                  </div>

                  {/* Ciclo de Conversão de Caixa */}
                  <div className="bg-white p-3 rounded-2xl border border-slate-100 space-y-1">
                    <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase">CCC (Ciclo Caixa)</div>
                    <div className="text-sm font-extrabold text-slate-800">50 dias</div>
                  </div>

                  {/* Liquidez */}
                  <div className="bg-white p-3 rounded-2xl border border-slate-100 space-y-1">
                    <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase">Liq. Corrente / Seca / Imed.</div>
                    <div className="text-sm font-extrabold text-slate-800">2.1 / 1.4 / 0.6</div>
                  </div>

                  {/* ROI */}
                  <div className="bg-white p-3 rounded-2xl border border-slate-100 space-y-1">
                    <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase">ROI (Retorno Invest.)</div>
                    <div className="text-sm font-extrabold text-slate-800">
                      {((controllershipMetrics.operationalProfit * 0.66) / (controllershipMetrics.fixedExpenses * 10 || 1) * 100).toFixed(1)}%
                    </div>
                  </div>

                  {/* ROE */}
                  <div className="bg-white p-3 rounded-2xl border border-slate-100 space-y-1">
                    <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase">ROE (Patr. Líquido)</div>
                    <div className="text-sm font-extrabold text-slate-800">{controllershipMetrics.roe.toFixed(1)}%</div>
                  </div>

                  {/* ROIC */}
                  <div className="bg-white p-3 rounded-2xl border border-slate-100 space-y-1">
                    <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase">ROIC (Cap. Investido)</div>
                    <div className="text-sm font-extrabold text-slate-800">
                      {((controllershipMetrics.operationalProfit * 0.66) / (controllershipMetrics.fixedExpenses * 10 * 0.8 || 1) * 100).toFixed(1)}%
                    </div>
                  </div>

                  {/* Orçado vs Realizado */}
                  <div className="bg-white p-3 rounded-2xl border border-slate-100 space-y-1">
                    <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase">Budget vs Actual</div>
                    <div className="text-sm font-extrabold text-emerald-600">+4.2% {t({ pt: 'Acima da Meta', en: 'Above Target' })}</div>
                  </div>

                  {/* GAO / GAF */}
                  <div className="bg-white p-3 rounded-2xl border border-slate-100 space-y-1">
                    <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase">GAO / GAF</div>
                    <div className="text-sm font-extrabold text-slate-800">
                      {controllershipMetrics.operatingLeverage.toFixed(2)}x / 1.15x
                    </div>
                  </div>

                  {/* Ticket Médio */}
                  <div className="bg-white p-3 rounded-2xl border border-slate-100 space-y-1">
                    <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase">Ticket Médio</div>
                    <div className="text-sm font-extrabold text-slate-800">
                      {formatCurrency(totalBillings / (salesInvoices.length || 1))}
                    </div>
                  </div>

                  {/* CAC e LTV */}
                  <div className="bg-white p-3 rounded-2xl border border-slate-100 space-y-1">
                    <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase">CAC / LTV</div>
                    <div className="text-sm font-extrabold text-slate-800">R$ 450,00 / R$ 15.000,00</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Column 3: Indicadores Avançados */}
            <div className="space-y-6">
              <div className="rounded-[32px] border border-slate-100 bg-slate-50/50 p-6 space-y-4">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-200/60 pb-3">
                  <span className="rounded-full bg-[#af52de] text-white w-5 h-5 flex items-center justify-center text-[10px]">3</span>
                  {t({ pt: 'Indicadores Avançados', en: 'Advanced & Predictive' })}
                </h4>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  {t({ pt: 'Motor Estratégico & Preditivo. Envolve modelagens estocásticas, custeio avançado TDABC e análises dinâmicas de valor.', en: 'Predictive motor. Involves stochastic modeling, TDABC activity costing, and net economic value.' })}
                </p>

                <div className="space-y-4 pt-2">
                  {/* EVA */}
                  <div className="bg-white p-3 rounded-2xl border border-slate-100 space-y-1">
                    <div className="flex justify-between items-center text-[10px] text-purple-400 font-bold uppercase">EVA (Value Added)</div>
                    <div className="text-sm font-extrabold text-purple-700">
                      {formatCurrency((controllershipMetrics.operationalProfit * 0.66) - (controllershipMetrics.fixedExpenses * 10 * 0.08))}
                    </div>
                  </div>

                  {/* CPS */}
                  <div className="bg-white p-3 rounded-2xl border border-slate-100 space-y-1">
                    <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase">Rentabilidade Cliente (CPS)</div>
                    <div className="text-sm font-extrabold text-slate-800">78 / 100</div>
                  </div>

                  {/* Acurácia do Rolling Forecast */}
                  <div className="bg-white p-3 rounded-2xl border border-slate-100 space-y-1">
                    <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase">Acurácia Rolling Forecast</div>
                    <div className="text-sm font-extrabold text-slate-800">96.8%</div>
                  </div>

                  {/* TDABC */}
                  <div className="bg-white p-3 rounded-2xl border border-slate-100 space-y-1">
                    <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase">Capacidade Ociosa TDABC</div>
                    <div className="text-sm font-extrabold text-slate-800">12.4% <span className="text-[10px] text-slate-400 font-normal">(R$ 8.900,00 ocioso)</span></div>
                  </div>

                  {/* Previsibilidade de Queima de Caixa */}
                  <div className="bg-white p-3 rounded-2xl border border-slate-100 space-y-1">
                    <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase">Cash Burn Rate (Preditivo)</div>
                    <div className="text-sm font-extrabold text-[#0071e3]">18 meses de autonomia</div>
                  </div>

                  {/* Risco de Inadimplência Preditivo */}
                  <div className="bg-white p-3 rounded-2xl border border-slate-100 space-y-1">
                    <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase">Churn/Default Preditivo (IA)</div>
                    <div className="text-sm font-extrabold text-slate-800">Risco Baixo (0.8% default score)</div>
                  </div>

                  {/* Margem EBITDA Preditiva */}
                  <div className="bg-white p-3 rounded-2xl border border-slate-100 space-y-1">
                    <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase">EBITDA Preditivo (Monte Carlo)</div>
                    <div className="text-sm font-extrabold text-slate-800">P90: 22.4% | P50: 24.8%</div>
                  </div>

                  {/* Retorno sobre Inovação */}
                  <div className="bg-white p-3 rounded-2xl border border-slate-100 space-y-1">
                    <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase">Retorno Inovação (ROII)</div>
                    <div className="text-sm font-extrabold text-slate-800">14.2%</div>
                  </div>

                  {/* Indicadores ESG */}
                  <div className="bg-white p-3 rounded-2xl border border-slate-100 space-y-1">
                    <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase">ESG Rating Impact</div>
                    <div className="text-sm font-extrabold text-emerald-600">-0.4% WACC (Desconto Verde)</div>
                  </div>

                  {/* Eficiência de Working Capital */}
                  <div className="bg-white p-3 rounded-2xl border border-slate-100 space-y-1">
                    <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase">Working Capital Dinâmico</div>
                    <div className="text-[10.5px] font-bold text-slate-800">Recomendação: Estender PMP em +5d</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          )}

          {kpisSubTab === 'dre' && (
            <div className="rounded-[32px] border border-slate-100 bg-white p-6 shadow-sm space-y-6">
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="h-4.5 w-4.5 text-[#0071e3]" />
                  {t({ pt: 'DRE Gerencial Estruturada (O Olhar do Controller)', en: 'Management Income Statement (DRE)' })}
                </h4>
                <p className="text-[10px] text-slate-400 mt-1">
                  {t({ pt: 'DRE projetada com foco gerencial na separação de variáveis e custos de estrutura física para tomada de decisão.', en: 'Management income statement focusing on fixed and variable overhead segregation.' })}
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase">
                      <th className="pb-3 w-1/4">{t({ pt: 'Linha da DRE Gerencial', en: 'Line Item' })}</th>
                      <th className="pb-3 text-right w-1/5">{t({ pt: 'Cálculo / Composição', en: 'Calculation' })}</th>
                      <th className="pb-3 text-right w-1/5">{t({ pt: 'Valor Consolidado', en: 'Value' })}</th>
                      <th className="pb-3 pl-6 w-2/5">{t({ pt: 'Visão e Comentário da Controladoria', en: 'Controllership Interpretation' })}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 font-medium">
                    {/* 1. Receita Bruta */}
                    <tr>
                      <td className="py-3 font-bold text-slate-800">1. Receita Bruta de Vendas</td>
                      <td className="py-3 text-right text-slate-500 font-mono">Faturamento Total</td>
                      <td className="py-3 text-right font-extrabold text-slate-900">{formatCurrency(totalBillings * 1.12)}</td>
                      <td className="py-3 pl-6 text-slate-500 text-[11px] leading-relaxed">
                        {t({ pt: 'Mede o esforço comercial. A controladoria cruza isso com o Market Share e o volume/preço.', en: 'Measures commercial effort. Controllership matches this with Market Share and price indices.' })}
                      </td>
                    </tr>
                    {/* 2. Deduções */}
                    <tr>
                      <td className="py-3 font-bold text-slate-800">2. (-) Deduções e Impostos</td>
                      <td className="py-3 text-right text-slate-500 font-mono">PIS, COFINS, ICMS, Devoluções</td>
                      <td className="py-3 text-right font-bold text-red-500">-{formatCurrency(totalBillings * 0.12)}</td>
                      <td className="py-3 pl-6 text-slate-500 text-[11px] leading-relaxed">
                        {t({ pt: 'Monitoramento de eficiência tributária e qualidade (devoluções indicam falha operacional).', en: 'Tax efficiency tracking. Excess returns imply operational quality failures.' })}
                      </td>
                    </tr>
                    {/* 3. Receita Líquida */}
                    <tr className="bg-slate-50/50">
                      <td className="py-3 font-extrabold text-[#0071e3]">3. (=) Receita Líquida</td>
                      <td className="py-3 text-right font-bold text-[#0071e3] font-mono">Linha 1 - Linha 2</td>
                      <td className="py-3 text-right font-black text-[#0071e3]">{formatCurrency(totalBillings)}</td>
                      <td className="py-3 pl-6 text-[#0071e3] text-[11px] leading-relaxed font-semibold">
                        {t({ pt: 'O dinheiro que sobrou para a empresa efetivamente trabalhar. Base para todas as análises verticais.', en: 'Net cash available to perform operations. Baseline denominator for vertical analysis.' })}
                      </td>
                    </tr>
                    {/* 4. Custos Variáveis */}
                    <tr>
                      <td className="py-3 font-bold text-slate-800">4. (-) Custos Variáveis (CPV/CMV)</td>
                      <td className="py-3 text-right text-slate-500 font-mono">Matéria-prima, mercadorias</td>
                      <td className="py-3 text-right font-bold text-red-500">-{formatCurrency(calculatedCMV)}</td>
                      <td className="py-3 pl-6 text-slate-500 text-[11px] leading-relaxed">
                        {t({ pt: 'Eficiência de compras, variação de preços de fornecedores e controle de desperdício/estoque.', en: 'Purchase margins, cost variations, and waste mitigation strategies.' })}
                      </td>
                    </tr>
                    {/* 5. Despesas Variáveis */}
                    <tr>
                      <td className="py-3 font-bold text-slate-800">5. (-) Despesas Variáveis</td>
                      <td className="py-3 text-right text-slate-500 font-mono">Comissões, fretes de entrega</td>
                      <td className="py-3 text-right font-bold text-red-500">-{formatCurrency(freightOut + (totalBillings * 0.03))}</td>
                      <td className="py-3 pl-6 text-slate-500 text-[11px] leading-relaxed">
                        {t({ pt: 'Mede o custo de servir. Fretes altos ou comissões mal calibradas destroem o lucro aqui.', en: 'Measures the cost-to-serve. Unoptimized freight or high cards commission rates erode EBIT here.' })}
                      </td>
                    </tr>
                    {/* 6. Margem de Contribuição */}
                    <tr className="bg-emerald-50/50">
                      <td className="py-3 font-extrabold text-emerald-700">6. (=) Margem de Contribuição</td>
                      <td className="py-3 text-right font-bold text-emerald-700 font-mono">Linha 3 - (Linhas 4 + 5)</td>
                      <td className="py-3 text-right font-black text-emerald-700">
                        {formatCurrency(totalBillings - calculatedCMV - freightOut - (totalBillings * 0.03))}
                      </td>
                      <td className="py-3 pl-6 text-emerald-800 text-[11px] leading-relaxed font-semibold">
                        {t({ pt: 'O indicador mais importante. Quanto sobra das vendas para pagar a estrutura fixa da empresa.', en: 'Critical profitability metric. Displays how much money remains to sustain corporate structure.' })}
                      </td>
                    </tr>
                    {/* 7. Custos Fixos */}
                    <tr>
                      <td className="py-3 font-bold text-slate-800">7. (-) Custos e Despesas Fixas</td>
                      <td className="py-3 text-right text-slate-500 font-mono">Aluguel, folha ADM, TI</td>
                      <td className="py-3 text-right font-bold text-red-500">-{formatCurrency(controllershipMetrics.fixedExpenses)}</td>
                      <td className="py-3 pl-6 text-slate-500 text-[11px] leading-relaxed">
                        {t({ pt: 'A gordura da empresa. Buscamos otimizar essa linha sem perder capacidade produtiva.', en: 'Corporate overhead. Focuses on lean management without losing operational performance.' })}
                      </td>
                    </tr>
                    {/* 8. EBITDA */}
                    <tr className="bg-slate-50/50">
                      <td className="py-3 font-extrabold text-slate-800">8. (=) EBITDA (LAJIDA)</td>
                      <td className="py-3 text-right font-bold text-slate-800 font-mono">Linha 6 - Linha 7</td>
                      <td className="py-3 text-right font-black text-slate-900">
                        {formatCurrency(totalBillings - calculatedCMV - freightOut - (totalBillings * 0.03) - controllershipMetrics.fixedExpenses)}
                      </td>
                      <td className="py-3 pl-6 text-slate-700 text-[11px] leading-relaxed">
                        {t({ pt: 'O potencial puro de geração de caixa operacional, ignorando impostos e financiamentos.', en: 'Operating performance baseline index prior to interest, tax depreciation and financial structures.' })}
                      </td>
                    </tr>
                    {/* 9. Depreciação */}
                    <tr>
                      <td className="py-3 font-bold text-slate-800">9. (-) Depreciação e Amortização</td>
                      <td className="py-3 text-right text-slate-500 font-mono">Softwares, desgaste físico</td>
                      <td className="py-3 text-right font-bold text-red-500">-{formatCurrency(8000)}</td>
                      <td className="py-3 pl-6 text-slate-500 text-[11px] leading-relaxed">
                        {t({ pt: 'Efeito contábil (sem saída de caixa), mas vital para planejar troca de equipamentos (CAPEX).', en: 'Non-cash accounting write-off. Essential to model future CAPEX asset substitution schedules.' })}
                      </td>
                    </tr>
                    {/* 10. EBIT */}
                    <tr className="bg-slate-50/50">
                      <td className="py-3 font-extrabold text-slate-800">10. (=) EBIT (Lucro Operacional)</td>
                      <td className="py-3 text-right font-bold text-slate-800 font-mono">Linha 8 - Linha 9</td>
                      <td className="py-3 text-right font-black text-slate-900">
                        {formatCurrency(totalBillings - calculatedCMV - freightOut - (totalBillings * 0.03) - controllershipMetrics.fixedExpenses - 8000)}
                      </td>
                      <td className="py-3 pl-6 text-slate-600 text-[11px] leading-relaxed">
                        {t({ pt: 'O lucro gerado pelos ativos operacionais da empresa.', en: 'Pure return generated by total active operating assets.' })}
                      </td>
                    </tr>
                    {/* 11. Resultado Financeiro */}
                    <tr>
                      <td className="py-3 font-bold text-slate-800">11. (+/-) Resultado Financeiro</td>
                      <td className="py-3 text-right text-slate-500 font-mono">Receitas / Despesas com juros</td>
                      <td className="py-3 text-right font-bold text-red-500">-{formatCurrency(2500)}</td>
                      <td className="py-3 pl-6 text-slate-500 text-[11px] leading-relaxed">
                        {t({ pt: 'Juros sobre dívidas bancárias. EBITDA alto com lucro líquido baixo indica má alavancagem.', en: 'Bank debt servicing and interest metrics. Shows if high EBITDA is drained by high leveraging.' })}
                      </td>
                    </tr>
                    {/* 12. Impostos de Renda */}
                    <tr>
                      <td className="py-3 font-bold text-slate-800">12. (-) IRPJ e CSLL</td>
                      <td className="py-3 text-right text-slate-500 font-mono">Impostos incidentes</td>
                      <td className="py-3 text-right font-bold text-red-500">
                        {(() => {
                          const ebit = totalBillings - calculatedCMV - freightOut - (totalBillings * 0.03) - controllershipMetrics.fixedExpenses - 8000
                          return ebit > 0 ? `-${formatCurrency(ebit * 0.15)}` : formatCurrency(0)
                        })()}
                      </td>
                      <td className="py-3 pl-6 text-slate-500 text-[11px] leading-relaxed">
                        {t({ pt: 'Avaliação da eficiência no planejamento tributário (Lucro Real vs Presumido).', en: 'Corporate income taxes. Crucial to determine optimal tax planning profiles.' })}
                      </td>
                    </tr>
                    {/* 13. Lucro Líquido */}
                    <tr className="bg-purple-50/50">
                      <td className="py-3 font-extrabold text-purple-700">13. (=) Lucro Líquido</td>
                      <td className="py-3 text-right font-bold text-purple-700 font-mono">Linha 10 + Linha 11 - Linha 12</td>
                      <td className="py-3 text-right font-black text-purple-700 text-sm">
                        {(() => {
                          const ebit = totalBillings - calculatedCMV - freightOut - (totalBillings * 0.03) - controllershipMetrics.fixedExpenses - 8000
                          const taxes = ebit > 0 ? ebit * 0.15 : 0
                          return formatCurrency(ebit - 2500 - taxes)
                        })()}
                      </td>
                      <td className="py-3 pl-6 text-purple-800 text-[11px] leading-relaxed font-semibold">
                        {t({ pt: 'Resultado final disponível para os sócios ou para reinvestimento na operação.', en: 'Final bottom line available to expand operations or pay dividends.' })}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {kpisSubTab === 'erpModules' && (
            <div className="rounded-[32px] border border-slate-100 bg-white p-6 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 flex-wrap">
                <div>
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Settings2 className="h-4.5 w-4.5 text-[#af52de]" />
                    {t({ pt: 'Mapeador & Diagnóstico de Maturidade ERP', en: 'ERP Architecture & Maturity Diagnostic' })}
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-1">
                    {t({ pt: 'Ative ou desative os módulos transacionais de retaguarda para simular a aderência da controladoria aos dados integrados.', en: 'Toggle backend core transactional modules to audit data integrations reliability.' })}
                  </p>
                </div>
                
                {/* Maturity Score Badge */}
                <div className="rounded-full bg-slate-900 text-white px-4 py-2 flex items-center gap-2">
                  <span className="text-[9px] font-bold text-slate-400 uppercase">Maturidade ERP:</span>
                  <span className="text-xs font-black text-emerald-400">{((activeERPModules.length / 9) * 100).toFixed(0)}%</span>
                </div>
              </div>

              {/* Modules Toggles lists */}
              <div className="grid gap-6 md:grid-cols-3">
                {/* 1. Núcleo Transacional */}
                <div className="rounded-[24px] border border-slate-100 bg-slate-50/50 p-5 space-y-4">
                  <h5 className="text-[11px] font-bold text-slate-800 uppercase tracking-wider border-b border-slate-200 pb-2">{t({ pt: 'Núcleo Transacional (Obrigatório)', en: 'Core Transactional (Required)' })}</h5>
                  <div className="space-y-3">
                    {[
                      { id: 'faturamento', label: 'Faturamento & Contratos', desc: 'Captura exata de Receita Bruta e impostos.' },
                      { id: 'suprimentos', label: 'Suprimentos & Compras', desc: 'Rastreio do PMP e custo médio.' },
                      { id: 'financeiro', label: 'Financeiro (C/P, C/R, Tesouraria)', desc: 'Garante a DFC e Aging Lists.' },
                      { id: 'contabil', label: 'Contábil & Fiscal', desc: 'Conformidade e cálculo de depreciação.' }
                    ].map(mod => {
                      const isActive = activeERPModules.includes(mod.id)
                      return (
                        <div key={mod.id} className="flex items-start gap-2.5">
                          <input
                            type="checkbox"
                            checked={isActive}
                            onChange={() => {
                              setActiveERPModules(prev =>
                                prev.includes(mod.id) ? prev.filter(x => x !== mod.id) : [...prev, mod.id]
                              )
                            }}
                            className="mt-1 h-3.5 w-3.5 rounded border-slate-300 text-[#0071e3] focus:ring-[#0071e3]"
                          />
                          <div>
                            <div className="text-xs font-bold text-slate-800">{mod.label}</div>
                            <div className="text-[10px] text-slate-400 leading-none mt-0.5">{mod.desc}</div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* 2. Núcleo Custeio e Estoque */}
                <div className="rounded-[24px] border border-slate-100 bg-slate-50/50 p-5 space-y-4">
                  <h5 className="text-[11px] font-bold text-slate-800 uppercase tracking-wider border-b border-slate-200 pb-2">{t({ pt: 'Custeio & Estoque (Operacional)', en: 'Costing & Inventory' })}</h5>
                  <div className="space-y-3">
                    {[
                      { id: 'estoque', label: 'Gestão de Estoques (WMS/PCP)', desc: 'Cálculo de CMV e ciclo físico.' },
                      { id: 'custeio', label: 'Custeio Avançado (ABC/TDABC)', desc: 'Rateios complexos por atividade.' }
                    ].map(mod => {
                      const isActive = activeERPModules.includes(mod.id)
                      return (
                        <div key={mod.id} className="flex items-start gap-2.5">
                          <input
                            type="checkbox"
                            checked={isActive}
                            onChange={() => {
                              setActiveERPModules(prev =>
                                prev.includes(mod.id) ? prev.filter(x => x !== mod.id) : [...prev, mod.id]
                              )
                            }}
                            className="mt-1 h-3.5 w-3.5 rounded border-slate-300 text-[#0071e3] focus:ring-[#0071e3]"
                          />
                          <div>
                            <div className="text-xs font-bold text-slate-800">{mod.label}</div>
                            <div className="text-[10px] text-slate-400 leading-none mt-0.5">{mod.desc}</div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* 3. Núcleo Inteligência */}
                <div className="rounded-[24px] border border-slate-100 bg-slate-50/50 p-5 space-y-4">
                  <h5 className="text-[11px] font-bold text-slate-800 uppercase tracking-wider border-b border-slate-200 pb-2">{t({ pt: 'Núcleo Inteligência (Controladoria)', en: 'Intelligence Modules' })}</h5>
                  <div className="space-y-3">
                    {[
                      { id: 'fpa', label: 'Orçamento & FP&A', desc: 'Budget vs Actual e Rolling Forecast.' },
                      { id: 'bi', label: 'BI / Analytics Integrado', desc: 'Dashboards e cenários What-If.' },
                      { id: 'crm', label: 'Integração CRM', desc: 'Calcula LTV, CAC e CPS do cliente.' }
                    ].map(mod => {
                      const isActive = activeERPModules.includes(mod.id)
                      return (
                        <div key={mod.id} className="flex items-start gap-2.5">
                          <input
                            type="checkbox"
                            checked={isActive}
                            onChange={() => {
                              setActiveERPModules(prev =>
                                prev.includes(mod.id) ? prev.filter(x => x !== mod.id) : [...prev, mod.id]
                              )
                            }}
                            className="mt-1 h-3.5 w-3.5 rounded border-slate-300 text-[#0071e3] focus:ring-[#0071e3]"
                          />
                          <div>
                            <div className="text-xs font-bold text-slate-800">{mod.label}</div>
                            <div className="text-[10px] text-slate-400 leading-none mt-0.5">{mod.desc}</div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Dynamic Alert Messages & Diagnostics */}
              <div className="rounded-[32px] border border-slate-100 bg-slate-50 p-6 space-y-3">
                <h4 className="text-[11px] font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-[#af52de]" />
                  {t({ pt: 'Análise de Integridade e Acurácia de Dados', en: 'Data Integrity Audit Insights' })}
                </h4>
                <div className="text-[11px] text-slate-600 space-y-2 leading-relaxed">
                  {!activeERPModules.includes('fpa') && (
                    <p className="text-amber-700 font-medium">
                      ⚠️ {t({ pt: 'Atenção: A falta do módulo de FP&A/Orçamento faz com que seu acompanhamento Orçado vs Realizado dependa de uploads manuais de planilhas Excel, aumentando o risco de furos e atrasos no fechamento.', en: 'Alert: Deactivating the budget/FP&A module prevents continuous Rolling Forecast, requiring manual spreadsheets reconciliation.' })}
                    </p>
                  )}
                  {!activeERPModules.includes('custeio') && (
                    <p className="text-amber-700 font-medium">
                      ⚠️ {t({ pt: 'Atenção: Sem um módulo de Custeio Avançado (ABC/TDABC), o cálculo do CMV e da Margem de Contribuição por família pode estar simplificado demais, ocultando distorções de ociosidade de processos.', en: 'Alert: Lacking a cost engine makes customer profitability mapping vulnerable to standard cost variance errors.' })}
                    </p>
                  )}
                  {!activeERPModules.includes('crm') && (
                    <p className="text-amber-700 font-medium">
                      ⚠️ {t({ pt: 'Atenção: A falta de integração direta com o CRM impede o cálculo instantâneo do Custo de Aquisição de Cliente (CAC) e Lifetime Value (LTV) reais diretamente do portal.', en: 'Alert: Deactivating CRM inputs isolates LTV/CAC variables.' })}
                    </p>
                  )}
                  {activeERPModules.length === 9 ? (
                    <p className="text-emerald-700 font-bold">
                      🚀 {t({ pt: 'Parabéns! Sua arquitetura ERP está 100% integrada. A Controladoria Estratégica opera como centro de inteligência automatizado com acurácia rolling forecast em tempo real.', en: 'Outstanding: 100% ERP systems integration active. Operational datasets automatically populate your cash burn models.' })}
                    </p>
                  ) : (
                    <p className="text-slate-500">
                      {t({ pt: 'Ative todos os 9 módulos essenciais para zerar gargalos operacionais e habilitar a controladoria de última geração.', en: 'Activate all 9 core systems to complete data integrations.' })}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* --- View 3: Integrations & API configuration --- */}
      {activeTab === 'integrations' && (
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* BigQuery Integration Card */}
            <div className="rounded-[32px] border border-slate-100 bg-white p-6 shadow-sm space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-orange-50 p-2 text-orange-600">
                    <LineChart className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Google BigQuery</h4>
                    <p className="text-[10px] text-slate-400">Sync database records to Data Warehouse</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Project ID</label>
                    <input
                      type="text"
                      value={bqProjectId}
                      onChange={e => setBqProjectId(e.target.value)}
                      className="w-full rounded-xl border border-black/10 px-3.5 py-2 text-xs text-slate-800 outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Dataset ID</label>
                    <input
                      type="text"
                      value={bqDataset}
                      onChange={e => setBqDataset(e.target.value)}
                      className="w-full rounded-xl border border-black/10 px-3.5 py-2 text-xs text-slate-800 outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">JSON Service Account Key</label>
                    <div className="border border-dashed border-slate-200 rounded-xl p-3 text-center bg-slate-50 hover:bg-slate-100 transition cursor-pointer">
                      <span className="text-[10px] text-slate-500">
                        {bqKeyName ? `📄 ${bqKeyName}` : t({ pt: 'Soltar arquivo JSON da chave secreta', en: 'Drop Service Account JSON Key file' })}
                      </span>
                      <input
                        type="file"
                        accept=".json"
                        onChange={e => {
                          const name = e.target.files?.[0]?.name || ''
                          if (name) setBqKeyName(name)
                        }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsBqConnected(!isBqConnected)
                }}
                className={`w-full rounded-full py-2.5 text-xs font-semibold transition ${isBqConnected ? 'bg-emerald-500 text-white hover:bg-emerald-600' : 'bg-[#0071e3] text-white hover:bg-[#2997ff]'}`}
              >
                {isBqConnected ? '✓ Connected' : t({ pt: 'Testar e Conectar', en: 'Test & Connect Connection' })}
              </button>
            </div>

            {/* Secret API Keys Card */}
            <div className="rounded-[32px] border border-slate-100 bg-white p-6 shadow-sm space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-purple-50 p-2 text-purple-600">
                    <KeyRound className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Secret API Keys</h4>
                    <p className="text-[10px] text-slate-400">Generate secure keys for external integrations</p>
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 leading-relaxed">
                  {t({
                    pt: 'Gere chaves privadas de API para extrair os dados de faturamento em tempo real no seu sistema externo de BI (Power BI, Python ou Excel).',
                    en: 'Generate private API keys to sync raw billing data directly inside external tools like Excel, Power BI or custom Python scripts.'
                  })}
                </p>

                {apiSecretKey && (
                  <div className="rounded-2xl border border-purple-100 bg-purple-50/50 p-4 font-mono text-[10px] text-purple-900 select-all break-all">
                    <strong>Bearer Token:</strong> {apiSecretKey}
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={generateSecret}
                className="w-full rounded-full border border-purple-200 bg-purple-50 text-purple-700 py-2.5 text-xs font-semibold hover:bg-purple-100 transition"
              >
                {apiSecretKey ? t({ pt: 'Regerar Nova Chave', en: 'Regenerate API Key' }) : t({ pt: 'Gerar Chave de Acesso API', en: 'Generate API Access Key' })}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- View: ERP Architecture Specification --- */}
      {activeTab === 'architecture' && (
        <div className="space-y-6">
          {/* Header */}
          <div className="rounded-[32px] border border-slate-100 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Database className="h-4.5 w-4.5 text-[#0071e3]" />
              {t({ pt: 'Especificações & Modelagem de Arquitetura ERP', en: 'ERP Architecture & Relational Model Specification' })}
            </h3>
            <p className="text-[10px] text-slate-400 mt-1">
              {t({ pt: 'Estruturação conceitual, física e regras de negócio para sistemas corporativos SAP S/4HANA e Oracle NetSuite.', en: 'Relational data schemes, cost engines, and business rules inspired by world-class ERP designs.' })}
            </p>
          </div>

          {/* Sub-tabs selector */}
          <div className="flex gap-2 border-b border-slate-100 pb-2">
            <button
              onClick={() => setArchitectureSubTab('mer')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${architectureSubTab === 'mer' ? 'bg-[#0071e3] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              📊 {t({ pt: 'Modelagem Relacional (MER)', en: 'Relational Model (ERD)' })}
            </button>
            <button
              onClick={() => setArchitectureSubTab('costing')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${architectureSubTab === 'costing' ? 'bg-[#0071e3] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              🧮 {t({ pt: 'Cálculo de Custos & CMV', en: 'Valuation & Costing' })}
            </button>
            <button
              onClick={() => setArchitectureSubTab('roles')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${architectureSubTab === 'roles' ? 'bg-[#0071e3] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              🔄 {t({ pt: 'Fluxo de Papel (BP)', en: 'BP Role Transition' })}
            </button>
            <button
              onClick={() => setArchitectureSubTab('tax')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${architectureSubTab === 'tax' ? 'bg-[#0071e3] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              ⚖️ {t({ pt: 'Exceções Fiscais (NCM)', en: 'Tax Exception Matrix' })}
            </button>
            <button
              onClick={() => setArchitectureSubTab('api')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${architectureSubTab === 'api' ? 'bg-[#0071e3] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              🌐 {t({ pt: 'Simulador de APIs (REST)', en: 'REST API Sandbox' })}
            </button>
          </div>

          {/* Sub-tab 1: Modelagem Relacional (MER) */}
          {architectureSubTab === 'mer' && (
            <div className="grid gap-6 md:grid-cols-3">
              {/* Left Column: Theoretical Explanation */}
              <div className="md:col-span-1 rounded-[32px] border border-slate-100 bg-slate-50/50 p-6 space-y-6">
                <div>
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">{t({ pt: 'Design de Tabelas Base', en: 'Master Data Design' })}</h4>
                  <p className="text-[10px] text-slate-400 mt-1">{t({ pt: 'Estruturação livre de redundâncias para cadastros mestres corporativos.', en: 'High-performance normalized schemas for enterprise entities.' })}</p>
                </div>

                <div className="space-y-4 text-xs text-slate-600 leading-relaxed">
                  <div className="space-y-1.5">
                    <strong className="text-slate-800 block">1. Business Partner (Cadastro Único):</strong>
                    <p className="text-[11px]">
                      {t({ pt: 'Entidades (clientes, fornecedores, transportadoras, colaboradores) residem em uma tabela central unificada. Papéis específicos são mapeados via extensões 1:1, permitindo dupla flag sem duplicar registros ou CNPJs.', en: 'Entities are unified in a single table. Specific attributes are stored in separate 1:1 tables linked via Foreign Keys.' })}
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <strong className="text-slate-800 block">2. Item Master (Cadastro de Itens):</strong>
                    <p className="text-[11px]">
                      {t({ pt: 'Mapeia produtos físicos (matéria-prima, produto acabado, insumo) e de serviços. Contém dados de estocagem (fator de conversão) e dados fiscais (NCM, CEST, Origem).', en: 'Supports physical goods and services. Holds conversion factors (Unit of Measure) and fiscal tags (NCM, CEST).' })}
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <strong className="text-slate-800 block">3. Estruturas Multidepósito & Lotes:</strong>
                    <p className="text-[11px]">
                      {t({ pt: 'O estoque total é a soma física distribuída entre almoxarifados separados, segmentada por lotes e validades para garantir FIFO/FEFO e rastreabilidade total.', en: 'Total quantity represents aggregated sums across separate warehouses and tracked lots/expiration cycles.' })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Middle and Right Column: Interactive SQL Generator */}
              <div className="md:col-span-2 rounded-[32px] border border-slate-100 bg-white p-6 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 flex-wrap pb-4 border-b border-slate-50">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">{t({ pt: 'Gerador Dinâmico de DDL (SQL)', en: 'Interactive DDL Query Builder' })}</h4>
                    <p className="text-[10px] text-slate-400 mt-1">{t({ pt: 'Selecione as variáveis para visualizar a estrutura relacional gerada.', en: 'Select dialect and role filters to view normalized relational DDL scripts.' })}</p>
                  </div>

                  <div className="flex gap-2">
                    {/* Dialect Selector */}
                    <select
                      value={sqlDialect}
                      onChange={e => setSqlDialect(e.target.value as any)}
                      className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 font-bold outline-none"
                    >
                      <option value="postgresql">PostgreSQL</option>
                      <option value="sqlserver">SQL Server T-SQL</option>
                      <option value="oracle">Oracle PL/SQL</option>
                    </select>

                    {/* Role Filter Selector */}
                    <select
                      value={bpRoleFilter}
                      onChange={e => setBpRoleFilter(e.target.value as any)}
                      className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 font-bold outline-none"
                    >
                      <option value="all">{t({ pt: 'Todos os Papéis', en: 'All BP Exts' })}</option>
                      <option value="customer">{t({ pt: 'Apenas Clientes', en: 'Customer Ext' })}</option>
                      <option value="supplier">{t({ pt: 'Apenas Fornecedores', en: 'Supplier Ext' })}</option>
                    </select>
                  </div>
                </div>

                {/* SQL Code Block display */}
                <div className="rounded-2xl border border-slate-100 bg-slate-900 text-slate-100 p-5 font-mono text-[10px] overflow-x-auto leading-relaxed max-h-[380px] overflow-y-auto select-all">
                  {(() => {
                    const isPg = sqlDialect === 'postgresql'
                    const isSqlSrv = sqlDialect === 'sqlserver'
                    const uuidType = isPg ? 'UUID DEFAULT gen_random_uuid()' : isSqlSrv ? 'UNIQUEIDENTIFIER DEFAULT NEWID()' : 'RAW(16) DEFAULT SYS_GUID()'
                    
                    return (
                      <pre>
{`/* --- DIALECT: ${sqlDialect.toUpperCase()} --- */
-- 1. Central Entity Table (Business Partner Core)
CREATE TABLE parceiro_negocio (
    id ${uuidType} PRIMARY KEY,
    cnpj_cpf VARCHAR(14) NOT NULL UNIQUE,
    razao_social VARCHAR(255) NOT NULL,
    nome_fantasia VARCHAR(255),
    inscricao_estadual VARCHAR(20) DEFAULT 'ISENTO',
    is_contribuinte_icms BOOLEAN DEFAULT TRUE,
    endereco_rua VARCHAR(255),
    endereco_cidade VARCHAR(100),
    endereco_uf CHAR(2),
    endereco_cep VARCHAR(8),
    created_at ${isPg ? 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP' : isSqlSrv ? 'DATETIME DEFAULT GETDATE()' : 'DATE DEFAULT SYSDATE'}
);

${(bpRoleFilter === 'all' || bpRoleFilter === 'customer') ? `-- 2. Customer Sub-Entity Role Extension (1:1 Relation)
CREATE TABLE parceiro_cliente (
    parceiro_id ${isPg || isSqlSrv ? (isPg ? 'UUID' : 'UNIQUEIDENTIFIER') : 'RAW(16)'} PRIMARY KEY REFERENCES parceiro_negocio(id) ON DELETE CASCADE,
    limite_credito NUMERIC(15,2) DEFAULT 0.00,
    situacao_financeira VARCHAR(50) DEFAULT 'REGULAR',
    vencimento_padrao INT DEFAULT 30,
    vendedor_preferencial VARCHAR(100)
);
` : ''}
${(bpRoleFilter === 'all' || bpRoleFilter === 'supplier') ? `-- 3. Supplier Sub-Entity Role Extension (1:1 Relation)
CREATE TABLE parceiro_fornecedor (
    parceiro_id ${isPg || isSqlSrv ? (isPg ? 'UUID' : 'UNIQUEIDENTIFIER') : 'RAW(16)'} PRIMARY KEY REFERENCES parceiro_negocio(id) ON DELETE CASCADE,
    qualificacao_fiscal VARCHAR(50) DEFAULT 'REGULAR',
    pzo_entrega_medio_dias INT DEFAULT 15,
    dados_bancarios_json ${isPg ? 'JSONB' : isSqlSrv ? 'NVARCHAR(MAX)' : 'CLOB'}
);
` : ''}
-- 4. Master Item Register
CREATE TABLE item_cadastro (
    sku_code VARCHAR(50) PRIMARY KEY,
    nome_item VARCHAR(255) NOT NULL,
    tipo_item VARCHAR(30) CHECK (tipo_item IN ('PRODUCT', 'SERVICE', 'RAW_MATERIAL', 'KIT')),
    uom_estoque VARCHAR(10) NOT NULL, -- Unit of Measure
    uom_compra VARCHAR(10),
    fator_conversao_compra NUMERIC(10,4) DEFAULT 1.0000,
    peso_liquido_kg NUMERIC(10,3),
    codigo_ncm VARCHAR(8),
    codigo_cest VARCHAR(7),
    origem_mercadoria CHAR(1) DEFAULT '0'
);

-- 5. Physical Warehouse
CREATE TABLE almoxarifado (
    id ${isPg ? 'SERIAL' : isSqlSrv ? 'INT IDENTITY(1,1)' : 'NUMBER GENERATED BY DEFAULT AS IDENTITY'} PRIMARY KEY,
    codigo_deposito VARCHAR(20) UNIQUE NOT NULL,
    nome_deposito VARCHAR(100) NOT NULL,
    bloqueado BOOLEAN DEFAULT FALSE
);

-- 6. Lot and Expiration Control Table
CREATE TABLE lote_estoque (
    id ${uuidType} PRIMARY KEY,
    sku_code VARCHAR(50) REFERENCES item_cadastro(sku_code),
    codigo_lote VARCHAR(50) NOT NULL,
    data_fabricacao DATE,
    data_validade DATE,
    armazem_id ${isPg || isSqlSrv ? 'INT' : 'NUMBER'} REFERENCES almoxarifado(id)
);`}
                      </pre>
                    )
                  })()}
                </div>
              </div>
            </div>
          )}

          {/* Sub-tab 2: Cálculo de Custos & CMV */}
          {architectureSubTab === 'costing' && (
            <div className="grid gap-6 md:grid-cols-2">
              {/* Left Side: Calculations Inputs */}
              <div className="rounded-[32px] border border-slate-100 bg-white p-6 shadow-sm space-y-6">
                <div>
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">{t({ pt: 'Simulador de Custos e Partidas Contábeis', en: 'Valuation & Ledger Simulator' })}</h4>
                  <p className="text-[10px] text-slate-400 mt-1">{t({ pt: 'Altere as variáveis para calcular o custo de aquisição da entrada e o novo Custo Médio Ponderado.', en: 'Adjust inputs to simulate inventory valuation ledger bookings.' })}</p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">{t({ pt: 'Qtd Adquirida (Nota Fiscal)', en: 'Quantity Purchased' })}</label>
                    <input
                      type="number"
                      value={simQty}
                      onChange={e => setSimQty(Math.max(1, Number(e.target.value)))}
                      className="w-full rounded-xl border border-black/10 px-3.5 py-1.5 text-xs text-slate-800 outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">{t({ pt: 'Preço de Tabela Unitário', en: 'List Unit Price' })}</label>
                    <input
                      type="number"
                      value={simBasePrice}
                      onChange={e => setSimBasePrice(Math.max(0, Number(e.target.value)))}
                      className="w-full rounded-xl border border-black/10 px-3.5 py-1.5 text-xs text-slate-800 outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">{t({ pt: 'Frete de Entrada Total', en: 'Freight Inbound' })}</label>
                    <input
                      type="number"
                      value={simFreight}
                      onChange={e => setSimFreight(Math.max(0, Number(e.target.value)))}
                      className="w-full rounded-xl border border-black/10 px-3.5 py-1.5 text-xs text-slate-800 outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">{t({ pt: 'Seguro de Carga Total', en: 'Cargo Insurance' })}</label>
                    <input
                      type="number"
                      value={simInsurance}
                      onChange={e => setSimInsurance(Math.max(0, Number(e.target.value)))}
                      className="w-full rounded-xl border border-black/10 px-3.5 py-1.5 text-xs text-slate-800 outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">{t({ pt: 'IPI Destacado Total', en: 'IPI Excise Tax' })}</label>
                    <input
                      type="number"
                      value={simIPI}
                      onChange={e => setSimIPI(Math.max(0, Number(e.target.value)))}
                      className="w-full rounded-xl border border-black/10 px-3.5 py-1.5 text-xs text-slate-800 outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">{t({ pt: 'Impostos Não Recuperáveis', en: 'Non-Recoverable Taxes' })}</label>
                    <input
                      type="number"
                      value={simNonRecoverable}
                      onChange={e => setSimNonRecoverable(Math.max(0, Number(e.target.value)))}
                      className="w-full rounded-xl border border-black/10 px-3.5 py-1.5 text-xs text-slate-800 outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">{t({ pt: 'Desconto Incondicional', en: 'Unconditional Discount' })}</label>
                    <input
                      type="number"
                      value={simDiscount}
                      onChange={e => setSimDiscount(Math.max(0, Number(e.target.value)))}
                      className="w-full rounded-xl border border-black/10 px-3.5 py-1.5 text-xs text-slate-800 outline-none"
                    />
                  </div>
                </div>

                <div className="border-t border-slate-50 pt-4 space-y-4">
                  <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t({ pt: 'Estoque Existente (Antes da Entrada)', en: 'Prior Inventory State' })}</h5>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">{t({ pt: 'Qtd em Estoque', en: 'Qty in Stock' })}</label>
                      <input
                        type="number"
                        value={simPrevQty}
                        onChange={e => setSimPrevQty(Math.max(0, Number(e.target.value)))}
                        className="w-full rounded-xl border border-black/10 px-3.5 py-1.5 text-xs text-slate-800 outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">{t({ pt: 'Custo Médio Anterior', en: 'Prior Avg Cost (CMP)' })}</label>
                      <input
                        type="number"
                        value={simPrevCMP}
                        onChange={e => setSimPrevCMP(Math.max(0, Number(e.target.value)))}
                        className="w-full rounded-xl border border-black/10 px-3.5 py-1.5 text-xs text-slate-800 outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side: Formula outputs and Ledger entries */}
              {(() => {
                const totalBaseVal = simQty * simBasePrice
                // Cost of Acquisition calculation
                const totalAcquisition = totalBaseVal + simFreight + simInsurance + simIPI + simNonRecoverable - simDiscount
                const unitAcquisition = totalAcquisition / simQty
                
                const priorTotalVal = simPrevQty * simPrevCMP
                const finalQty = simPrevQty + simQty
                const finalTotalVal = priorTotalVal + totalAcquisition
                const finalCMP = finalQty > 0 ? finalTotalVal / finalQty : 0

                return (
                  <div className="space-y-6">
                    <div className="rounded-[32px] border border-slate-100 bg-[#f8fafc] p-6 space-y-4">
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">{t({ pt: 'Demonstrativo de Custos (Matemática)', en: 'Cost Valuation Dashboard' })}</h4>
                      
                      <div className="space-y-3 font-sans text-xs">
                        <div className="flex justify-between items-center pb-2 border-b border-slate-200/50">
                          <span className="text-slate-500">{t({ pt: 'Valor Comercial Bruto', en: 'Gross Goods Value' })}</span>
                          <span className="font-extrabold text-slate-800">{formatCurrency(totalBaseVal)}</span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b border-slate-200/50">
                          <span className="text-slate-500">{t({ pt: 'Soma dos Custos Acessórios (+)', en: 'Accessory Inbound Costs (+)' })}</span>
                          <span className="font-bold text-slate-700">+{formatCurrency(simFreight + simInsurance + simIPI + simNonRecoverable)}</span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b border-slate-200/50">
                          <span className="text-red-500">{t({ pt: 'Descontos Obtidos (-)', en: 'Discounts Applied (-)' })}</span>
                          <span className="font-bold text-red-500">-{formatCurrency(simDiscount)}</span>
                        </div>
                        <div className="flex justify-between items-center pb-3 border-b border-slate-200/50 bg-[#0071e3]/5 p-2.5 rounded-xl">
                          <span className="font-bold text-[#0071e3]">{t({ pt: 'Custo de Aquisição Total', en: 'Total Acquisition Cost' })}</span>
                          <span className="font-black text-[#0071e3] text-sm">{formatCurrency(totalAcquisition)}</span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b border-slate-200/50">
                          <span className="text-slate-500">{t({ pt: 'Custo Unitário de Entrada', en: 'Unit Inbound Cost' })}</span>
                          <span className="font-bold text-slate-800">{formatCurrency(unitAcquisition)}</span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b border-slate-200/50">
                          <span className="text-slate-500">{t({ pt: 'Novo Saldo de Estoque', en: 'New Aggregated Inventory' })}</span>
                          <span className="font-bold text-slate-800">{finalQty} {t({ pt: 'unidades', en: 'units' })} ({formatCurrency(finalTotalVal)})</span>
                        </div>
                        <div className="flex justify-between items-center pt-1 bg-emerald-50 p-2.5 rounded-xl border border-emerald-100">
                          <span className="font-bold text-emerald-800">{t({ pt: 'Novo Custo Médio Ponderado (CMP)', en: 'New Moving Average Price (CMP)' })}</span>
                          <span className="font-black text-emerald-800 text-sm">{formatCurrency(finalCMP)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Accounting Double Entries */}
                    <div className="rounded-[32px] border border-slate-100 bg-white p-6 shadow-sm space-y-4">
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">{t({ pt: 'Lançamentos Contábeis de Entrada & CMV', en: 'Ledger Journal Entries (Double Entry)' })}</h4>
                      <p className="text-[10px] text-slate-400">{t({ pt: 'Partidas geradas automaticamente para registrar a aquisição e futura baixa (CMV).', en: 'Automatic accounting lines generated during stock receipts and future sales.' })}</p>

                      <div className="overflow-x-auto text-[11px]">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase text-[9px]">
                              <th className="pb-2">{t({ pt: 'Evento', en: 'Event' })}</th>
                              <th className="pb-2">{t({ pt: 'Conta Contábil', en: 'Ledger Account' })}</th>
                              <th className="pb-2 text-center">D / C</th>
                              <th className="pb-2 text-right">{t({ pt: 'Valor', en: 'Value' })}</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-50 font-medium">
                            {/* Inbound Entry 1 */}
                            <tr>
                              <td className="py-2 text-slate-800 font-bold" rowSpan={2}>{t({ pt: 'Entrada de Mercadoria', en: 'Goods Receipt' })}</td>
                              <td className="py-2 text-slate-700">1.1.03.01 - {t({ pt: 'Estoques de Mercadoria', en: 'Inventory Assets' })}</td>
                              <td className="py-2 text-center text-emerald-600 font-bold">D (Débito)</td>
                              <td className="py-2 text-right text-emerald-600 font-bold">{formatCurrency(totalAcquisition)}</td>
                            </tr>
                            <tr>
                              <td className="py-2 text-slate-700">2.1.02.01 - {t({ pt: 'Fornecedores Nacionais', en: 'Accounts Payable' })}</td>
                              <td className="py-2 text-center text-red-600 font-bold">C (Crédito)</td>
                              <td className="py-2 text-right text-red-600 font-bold">{formatCurrency(totalAcquisition)}</td>
                            </tr>
                            {/* Outbound Entry 2 */}
                            <tr>
                              <td className="py-2 text-slate-800 font-bold" rowSpan={2}>{t({ pt: 'Baixa por Faturamento (Venda de 1 un)', en: 'Sales COGS (1 unit)' })}</td>
                              <td className="py-2 text-slate-700">3.1.01.01 - {t({ pt: 'CMV (Resultado / DRE)', en: 'COGS Expense (DRE)' })}</td>
                              <td className="py-2 text-center text-emerald-600 font-bold">D (Débito)</td>
                              <td className="py-2 text-right text-emerald-600 font-bold">{formatCurrency(finalCMP)}</td>
                            </tr>
                            <tr>
                              <td className="py-2 text-slate-700">1.1.03.01 - {t({ pt: 'Estoques de Mercadoria', en: 'Inventory Assets' })}</td>
                              <td className="py-2 text-center text-red-600 font-bold">C (Crédito)</td>
                              <td className="py-2 text-right text-red-600 font-bold">{formatCurrency(finalCMP)}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )
              })()}
            </div>
          )}

          {/* Sub-tab 3: Fluxo de Mudança de Papel */}
          {architectureSubTab === 'roles' && (
            <div className="rounded-[32px] border border-slate-100 bg-white p-6 shadow-sm space-y-6">
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">{t({ pt: 'Ciclo de Vida do Business Partner (S/4HANA BP-like)', en: 'Business Partner Life Cycle' })}</h4>
                <p className="text-[10px] text-slate-400 mt-1">{t({ pt: 'Como o banco de dados evolui quando um Fornecedor ganha o papel de Cliente sem criar cadastros duplicados.', en: 'Step-by-step technical representation of role transition at the database level.' })}</p>
              </div>

              {/* Step Sequence */}
              <div className="grid gap-6 md:grid-cols-4">
                {[
                  {
                    step: '1',
                    title: 'Fase Inicial (Cadastramento)',
                    desc: 'A transportadora/fornecedor é cadastrada na tabela principal "parceiro_negocio" com dados fiscais base (CNPJ/Razão/Endereço). Evita duplicidade cadastral.',
                    badge: '1 registro parceiro_negocio'
                  },
                  {
                    step: '2',
                    title: 'Disparo de Evento (Compras)',
                    desc: 'O departamento de suprimentos emite um pedido de compras. Como o BP já possui extensão em "parceiro_fornecedor", a emissão da NF-e gera obrigações a pagar.',
                    badge: '1 registro parceiro_fornecedor'
                  },
                  {
                    step: '3',
                    title: 'Venda Cruzada (Gera Cliente)',
                    desc: 'A mesma transportadora decide comprar resíduos ou produtos da empresa. O sistema estende a entidade inserindo dados na tabela "parceiro_cliente" vinculando o mesmo ID.',
                    badge: 'Extensão parceiro_cliente'
                  },
                  {
                    step: '4',
                    title: 'Consolidação Fiscal (Netting)',
                    desc: 'A Controladoria pode realizar a compensação automática de saldo (Netting) entre Contas a Receber (Cliente) e Contas a Pagar (Fornecedor) com um único CNPJ base.',
                    badge: 'Auditoria & Compensação Única'
                  }
                ].map(item => (
                  <div key={item.step} className="rounded-2xl border border-slate-50 bg-slate-50/50 p-5 space-y-3 relative overflow-hidden flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="w-6 h-6 rounded-full bg-[#0071e3] text-white flex items-center justify-center font-bold text-xs">{item.step}</div>
                      <h5 className="text-xs font-bold text-slate-800">{item.title}</h5>
                      <p className="text-[10.5px] text-slate-500 leading-relaxed">{item.desc}</p>
                    </div>
                    <span className="inline-block self-start rounded-full bg-slate-900 text-[8.5px] font-mono text-slate-100 px-2 py-0.5 mt-2">{item.badge}</span>
                  </div>
                ))}
              </div>

              {/* Technical Code Representation */}
              <div className="rounded-2xl bg-slate-50 p-5 space-y-3">
                <h5 className="text-[10.5px] font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <FileCode className="h-4 w-4 text-[#0071e3]" />
                  {t({ pt: 'Exemplo de Transação SQL de Extensão de Papel', en: 'Atomic SQL Transaction for Role Extension' })}
                </h5>
                <pre className="text-[9.5px] font-mono text-slate-700 overflow-x-auto leading-relaxed select-all">
{`-- Transação Atômica: Fornecedor existente ganha papel de Cliente
BEGIN TRANSACTION;

-- 1. Verifica se parceiro já existe pelo CNPJ
-- SELECT id FROM parceiro_negocio WHERE cnpj_cpf = '12345678000190'; -- ID encontrado: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'

-- 2. Insere na tabela parceiro_cliente vinculando o ID existente
INSERT INTO parceiro_cliente (parceiro_id, limite_credito, situacao_financeira, vencimento_padrao)
VALUES ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 25000.00, 'REGULAR', 30)
ON CONFLICT (parceiro_id) DO NOTHING;

-- 3. Agora a mesma entidade tem registros válidos em parceiro_negocio, parceiro_fornecedor e parceiro_cliente!
COMMIT;`}
                </pre>
              </div>
            </div>
          )}

          {/* Sub-tab 4: Exceções Fiscais (NCM) */}
          {architectureSubTab === 'tax' && (
            <div className="grid gap-6 md:grid-cols-3">
              {/* Explanation Column */}
              <div className="md:col-span-1 rounded-[32px] border border-slate-100 bg-slate-50/50 p-6 space-y-6">
                <div>
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">{t({ pt: 'Matriz Tributária Desacoplada', en: 'Decoupled Tax Matrix' })}</h4>
                  <p className="text-[10px] text-slate-400 mt-1">{t({ pt: 'Por que desacoplar impostos do cadastro de itens é vital no Brasil.', en: 'Preventing database overload by isolating fiscal rules from master product definitions.' })}</p>
                </div>

                <div className="space-y-4 text-xs text-slate-600 leading-relaxed">
                  <p className="text-[11px]">
                    {t({ pt: 'No Brasil, atrelar a alíquota de ICMS diretamente ao cadastro do produto gera redundâncias massivas devido a variações por estado de destino, perfil do comprador e tipo de operação.', en: 'In Brazil, linking tax percentages to the product card leads to redundancy due to interstate tax variations and buyer roles.' })}
                  </p>
                  <p className="text-[11px]">
                    <strong className="text-slate-800 block">{t({ pt: 'Melhor Prática (SAP/Oracle):', en: 'Best Practice:' })}</strong>
                    {t({ pt: 'O produto guarda apenas seu NCM, CEST e Origem. As regras de tributação residem em uma Matriz de Exceções Fiscais separada, parametrizada por NCM + UF Origem + UF Destino + Perfil do Comprador.', en: 'The item stores only the NCM code. The tax engine looks up interstate exceptions separately.' })}
                  </p>
                </div>
              </div>

              {/* Interactive Matrix Simulator */}
              <div className="md:col-span-2 rounded-[32px] border border-slate-100 bg-white p-6 shadow-sm space-y-6">
                <div>
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">{t({ pt: 'Simulador Dinâmico de Cálculo Fiscal', en: 'Tax Engine Simulator' })}</h4>
                  <p className="text-[10px] text-slate-400 mt-1">{t({ pt: 'Selecione os parâmetros e o motor de cálculo buscará as alíquotas correspondentes.', en: 'Change inputs to simulate automatic tax engine lookup based on NCM and UFs.' })}</p>
                </div>

                <div className="grid gap-4 sm:grid-cols-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">NCM</label>
                    <select
                      value={simNcm}
                      onChange={e => setSimNcm(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 outline-none"
                    >
                      <option value="8471.30.12">8471.30.12 (Notebooks)</option>
                      <option value="3004.90.19">3004.90.19 (Medicamentos)</option>
                      <option value="2203.00.00">2203.00.00 (Cervejas)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">UF Origem</label>
                    <select
                      value={simOriginUf}
                      onChange={e => setSimOriginUf(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 outline-none"
                    >
                      <option value="SP">SP (São Paulo)</option>
                      <option value="MG">MG (Minas Gerais)</option>
                      <option value="SC">SC (Santa Catarina)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">UF Destino</label>
                    <select
                      value={simDestUf}
                      onChange={e => setSimDestUf(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 outline-none"
                    >
                      <option value="SP">SP (São Paulo)</option>
                      <option value="RJ">RJ (Rio de Janeiro)</option>
                      <option value="BA">BA (Bahia)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">{t({ pt: 'Perfil do Comprador', en: 'Buyer Profile' })}</label>
                    <select
                      value={simBuyerProfile}
                      onChange={e => setSimBuyerProfile(e.target.value as any)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 outline-none"
                    >
                      <option value="revenda">{t({ pt: 'Industrialização/Revenda', en: 'Resell / B2B' })}</option>
                      <option value="consumo">{t({ pt: 'Uso e Consumo (Final)', en: 'End Consumption' })}</option>
                    </select>
                  </div>
                </div>

                {/* Simulated Tax Outputs */}
                {(() => {
                  // Mapped simulation values
                  let icmsPct = 18
                  let ipiPct = 5
                  let stActive = false
                  
                  if (simNcm === '3004.90.19') {
                    ipiPct = 0
                    icmsPct = 12
                  } else if (simNcm === '2203.00.00') {
                    ipiPct = 15
                    icmsPct = 25
                    stActive = true
                  }

                  if (simOriginUf !== simDestUf) {
                    // Interstate ICMS
                    if (simOriginUf === 'SP' && simDestUf === 'RJ') icmsPct = 12
                    if (simOriginUf === 'MG' && simDestUf === 'BA') icmsPct = 7
                  }

                  if (simBuyerProfile === 'consumo') {
                    stActive = false // ST is not applicable to end consumer usually
                  }

                  return (
                    <div className="rounded-2xl border border-slate-50 bg-[#f8fafc] p-5 space-y-4">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-800 border-b border-slate-200/50 pb-2 uppercase tracking-wide">
                        <Sparkles className="h-4 w-4 text-[#0071e3]" />
                        {t({ pt: 'Retorno da Consulta Fiscal', en: 'Tax Engine Result' })}
                      </div>

                      <div className="grid gap-4 sm:grid-cols-3 font-sans text-xs">
                        <div className="bg-white p-3 rounded-xl border border-slate-100">
                          <div className="text-[9px] font-bold text-slate-400 uppercase">ICMS Alíquota</div>
                          <div className="text-sm font-black text-slate-800 mt-1">{icmsPct}%</div>
                          <div className="text-[9px] text-slate-400 mt-0.5">{simOriginUf === simDestUf ? 'Interno' : 'Interestadual'}</div>
                        </div>

                        <div className="bg-white p-3 rounded-xl border border-slate-100">
                          <div className="text-[9px] font-bold text-slate-400 uppercase">IPI Alíquota</div>
                          <div className="text-sm font-black text-slate-800 mt-1">{ipiPct}%</div>
                          <div className="text-[9px] text-slate-400 mt-0.5">Base IPI</div>
                        </div>

                        <div className="bg-white p-3 rounded-xl border border-slate-100">
                          <div className="text-[9px] font-bold text-slate-400 uppercase">ICMS-ST (Subst. Tributária)</div>
                          <div className={`text-sm font-black mt-1 ${stActive ? 'text-amber-600' : 'text-slate-400'}`}>
                            {stActive ? 'ATIVADO (MVA 42%)' : 'ISENTO / NÃO APL.'}
                          </div>
                          <div className="text-[9px] text-slate-400 mt-0.5">{t({ pt: 'Consumidor final isento ST', en: 'Rules determined by NCM' })}</div>
                        </div>
                      </div>

                      <div className="text-[10px] text-slate-500 font-medium leading-relaxed">
                        💡 <strong>{t({ pt: 'Nota do Arquiteto:', en: 'Architect note:' })}</strong> {t({ pt: 'Observe que a tabela base de itens permaneceu intocada. O motor de cálculo efetuou um JOIN entre o NCM do produto e a tabela de exceções para recuperar as alíquotas com base na UF de Origem/Destino e Perfil do Comprador.', en: 'Notice that the item table remains clean. The engine executes a lookup join dynamically using the UFs and NCM.' })}
                      </div>
                    </div>
                  )
                })()}
              </div>
            </div>
          )}

          {/* Sub-tab 5: Simulador de APIs (REST) */}
          {architectureSubTab === 'api' && (
            <div className="grid gap-6 md:grid-cols-2">
              {/* Left Side: Request Composer */}
              <div className="rounded-[32px] border border-slate-100 bg-white p-6 shadow-sm space-y-6">
                <div>
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">{t({ pt: 'Compositor de Requisições REST', en: 'REST Request Composer' })}</h4>
                  <p className="text-[10px] text-slate-400 mt-1">{t({ pt: 'Selecione uma rota para disparar chamadas simuladas de API diretamente contra nosso banco de dados em memória.', en: 'Choose an endpoint and payload to trigger mock backend calls.' })}</p>
                </div>

                <div className="space-y-4">
                  {/* Select Endpoint */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">{t({ pt: 'Endpoint / Rota do Back-End', en: 'API Route / Endpoint' })}</label>
                    <select
                      value={apiEndpoint}
                      onChange={e => setApiEndpoint(e.target.value as any)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-700 outline-none"
                    >
                      <option value="create_bp">POST /api/v1/business-partners</option>
                      <option value="get_bp">GET /api/v1/business-partners</option>
                      <option value="create_item">POST /api/v1/items</option>
                      <option value="post_movement">POST /api/v1/inventory/movements</option>
                    </select>
                  </div>

                  {/* HTTP Path bar indicator */}
                  <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-3.5 py-2 text-xs font-mono border border-slate-100">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                      apiEndpoint === 'get_bp' ? 'bg-[#0071e3] text-white' : 'bg-emerald-500 text-white'
                    }`}>
                      {apiEndpoint === 'get_bp' ? 'GET' : 'POST'}
                    </span>
                    <span className="text-slate-600 font-bold">
                      {apiEndpoint === 'create_bp' || apiEndpoint === 'get_bp' ? '/api/v1/business-partners' 
                        : apiEndpoint === 'create_item' ? '/api/v1/items' 
                        : '/api/v1/inventory/movements'}
                    </span>
                  </div>

                  {/* Body Editor */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase flex justify-between">
                      <span>{t({ pt: 'Corpo da Requisição (JSON Payload)', en: 'Request Body (JSON Payload)' })}</span>
                      <span className="text-[9px] text-[#0071e3] lowercase font-normal">{t({ pt: 'editável', en: 'editable' })}</span>
                    </label>
                    <textarea
                      rows={10}
                      value={apiRequestBody}
                      onChange={e => setApiRequestBody(e.target.value)}
                      disabled={apiEndpoint === 'get_bp'}
                      className="w-full rounded-2xl border border-slate-200 p-4 text-[11px] font-mono text-slate-700 outline-none bg-slate-50/30 focus:bg-white focus:border-[#0071e3]/50 disabled:opacity-50 resize-none font-sans"
                    />
                  </div>

                  {/* Execute Action */}
                  <button
                    onClick={handleSendApiRequest}
                    className="w-full rounded-full bg-[#0071e3] py-2.5 text-xs font-semibold text-white hover:bg-[#2997ff] active:scale-98 transition flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Sparkles className="h-4 w-4" />
                    {t({ pt: 'Disparar Chamada de API', en: 'Send HTTP Request' })}
                  </button>
                </div>
              </div>

              {/* Right Side: Response & SQL Logs */}
              <div className="rounded-[32px] border border-slate-100 bg-[#1e1e1e] p-6 shadow-sm text-slate-300 space-y-6 flex flex-col justify-between overflow-hidden">
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-white/10 pb-2">
                    <h4 className="text-xs font-bold text-slate-100 uppercase tracking-wider flex items-center gap-1.5">
                      <Terminal className="h-4.5 w-4.5 text-[#2997ff]" />
                      {t({ pt: 'Console de Resposta HTTP', en: 'HTTP Response Console' })}
                    </h4>
                    {/* Status Badge */}
                    {apiResponseStatus ? (
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                        apiResponseStatus.startsWith('2') ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                          : 'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}>
                        {apiResponseStatus}
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-white/50 border border-white/15">
                        {t({ pt: 'Aguardando Chamada...', en: 'Idle' })}
                      </span>
                    )}
                  </div>

                  {/* JSON Response Body */}
                  <div className="space-y-1.5">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{t({ pt: 'Corpo da Resposta (JSON)', en: 'Response Body (JSON)' })}</div>
                    <pre className="w-full rounded-2xl bg-black/40 border border-white/5 p-4 text-[10.5px] font-mono text-slate-200 overflow-auto max-h-[160px] leading-relaxed select-all">
                      {apiResponseBody || '{\n  "status": "awaiting_request"\n}'}
                    </pre>
                  </div>

                  {/* Database Engine DDL logs */}
                  <div className="space-y-1.5">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                      <Database className="h-3.5 w-3.5 text-emerald-400" />
                      {t({ pt: 'Lançamentos Contábeis & SQL Executado no Banco', en: 'SQL & Ledger Journal Statements' })}
                    </div>
                    <pre className="w-full rounded-2xl bg-black/40 border border-white/5 p-4 text-[10px] font-mono text-emerald-400 overflow-auto max-h-[180px] leading-relaxed select-all">
                      {apiResponseSql || '/* Nenhuma instrução SQL executada */'}
                    </pre>
                  </div>
                </div>

                <div className="text-[9.5px] text-slate-500 border-t border-white/5 pt-3 leading-relaxed">
                  💡 <strong>{t({ pt: 'Mecanismo de Validação Real:', en: 'Live Validations:' })}</strong> {t({ pt: 'Caso insira um CNPJ inválido ou um NCM incorreto, o simulador retornará erro 400 Bad Request com a auditoria dos erros fiscais.', en: 'Inputting invalid CNPJs or NCMs triggers automatic 400 Bad Request error codes.' })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* --- Add Company Modal --- */}
      {showAddCompanyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-[32px] border border-slate-100 bg-white p-6 shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              {t({ pt: 'Cadastrar Nova Empresa', en: 'Add New Company' })}
            </h3>
            
            <form onSubmit={handleAddCompany} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">{t({ pt: 'Razão Social', en: 'Company Name' })}</label>
                <input
                  type="text"
                  required
                  value={newCompanyName}
                  onChange={e => setNewCompanyName(e.target.value)}
                  placeholder="Ex: Delta Logística"
                  className="w-full rounded-xl border border-black/10 px-3.5 py-2 text-xs text-slate-800 outline-none"
                />
              </div>
              
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">CNPJ</label>
                <input
                  type="text"
                  required
                  value={newCompanyCNPJ}
                  onChange={e => setNewCompanyCNPJ(e.target.value)}
                  placeholder="00.000.000/0001-00"
                  className="w-full rounded-xl border border-black/10 px-3.5 py-2 text-xs text-slate-800 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">{t({ pt: 'Perfil de Atuação', en: 'Company Profile' })}</label>
                <select
                  value={newCompanyProfile}
                  onChange={e => setNewCompanyProfile(e.target.value as CompanyProfile)}
                  className="w-full rounded-xl border border-black/10 px-3.5 py-2 text-xs text-slate-800 outline-none"
                >
                  <option value="SERVICES">{t({ pt: 'Serviços (ISS)', en: 'Services (ISS)' })}</option>
                  <option value="COMMERCE">{t({ pt: 'Comércio (CMV)', en: 'Trade (CMV)' })}</option>
                  <option value="INDUSTRY">{t({ pt: 'Indústria (IPI)', en: 'Industry (IPI)' })}</option>
                </select>
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddCompanyModal(false)}
                  className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  {t({ pt: 'Cancelar', en: 'Cancel' })}
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-[#0071e3] px-4 py-2 text-xs font-semibold text-white hover:bg-[#2997ff] transition"
                >
                  {t({ pt: 'Cadastrar', en: 'Register' })}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

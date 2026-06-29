import { Article } from '../data/articles'

// Dynamic Pool of 10 trending Controllership & FP&A topics with PT and EN translations
const topicPool = [
  {
    title: {
      pt: 'Reforma Tributária: Como Planejar o Orçamento em Meio às Novas Regras',
      en: 'Tax Reform: How to Budget in the Midst of New Rules'
    },
    category: { pt: 'Controladoria' as const, en: 'Controllership' as const },
    excerpt: {
      pt: 'As mudanças na tributação de consumo exigem recalibração urgente do DRE projetado e do fluxo de caixa operacional para os próximos períodos fiscais.',
      en: 'Changes in consumption taxation demand urgent recalibration of projected Income Statements and operating cash flow.'
    },
    content: {
      pt: `
        <p>A aprovação da Reforma Tributária no Brasil representa o maior desafio de planejamento para Controllers nesta década. Com a transição gradual para o IVA Dual (IBS e CBS), o planejamento orçamentário tradicional baseado em séries históricas perde a validade. As empresas precisam se preparar para um cenário de dupla contabilidade e alteração drástica nas alíquotas de consumo.</p>
        <h2>1. O Desafio da Transição e Alíquota Operacional</h2>
        <p>A coexistência dos modelos antigos e novos gerará custos de conformidade elevados. O papel do Controller é projetar o impacto do novo modelo no CMV e no fluxo de caixa, principalmente analisando a não cumulatividade plena dos créditos. Setores de serviços, por exemplo, enfrentarão aumentos nominais de alíquota que exigirão repasse de preço ou otimização drástica de OPEX.</p>
        <h2>2. Ações Imediatas para o Controller</h2>
        <ul>
          <li><strong>Simulação de Cenários:</strong> Desenvolva modelos contendo cenários de alíquota efetiva (25% a 28%) e analise o impacto na margem de contribuição.</li>
          <li><strong>Revisão de Fornecedores:</strong> Avalie a cadeia de suprimentos. Fornecedores optantes pelo Simples Nacional podem gerar menos créditos, alterando o custo real de aquisição.</li>
          <li><strong>Tecnologia e Parametrização:</strong> Garanta que os sistemas de ERP e BI estejam prontos para apurar os novos tributos de forma paralela.</li>
        </ul>
      `,
      en: `
        <p>The approval of Tax Reform represents a massive planning challenge. With the transition to Dual VAT, historical budgeting models are obsolete. Companies must prepare for dual accounting systems and changes in consumption taxes.</p>
        <h2>1. Transition and Operational Impact</h2>
        <p>Coexistence of old and new systems raises compliance costs. Controllers must project impacts on CMV and cash flow, especially regarding credits. Service industries face nominal rate hikes, requiring pricing changes or OPEX optimizations.</p>
        <h2>2. Action Steps</h2>
        <ul>
          <li><strong>Scenario Simulations:</strong> Model effective rates (25% to 28%) and track impacts on contribution margins.</li>
          <li><strong>Supply Chain Audit:</strong> Assess supplier tax regimes. Simples Nacional suppliers may yield fewer tax credits.</li>
          <li><strong>ERP Readiness:</strong> Ensure system workflows can calculate old and new systems concurrently.</li>
        </ul>
      `
    }
  },
  {
    title: {
      pt: 'Rolling Forecast: Por que o Orçamento Estático Está Morrendo',
      en: 'Rolling Forecast: Why the Static Budget is Dying'
    },
    category: { pt: 'FP&A' as const, en: 'FP&A' as const },
    excerpt: {
      pt: 'Em mercados voláteis, relying apenas no Budget anual é um risco. Descubra como implantar previsões dinâmicas trimestrais (Rolling Forecast).',
      en: 'In volatile markets, relying solely on annual Budgets is high risk. Discover how to deploy quarterly dynamic forecasting.'
    },
    content: {
      pt: `
        <p>O Orçamento Estático (Budget) anual ainda é a regra na maioria das corporações. No entanto, planejar em outubro as metas de vendas e despesas para o dezembro do ano seguinte assume uma estabilidade de mercado que não existe mais. Em ambientes de alta volatilidade, o <strong>Rolling Forecast</strong> surge como a metodologia ideal de planejamento financeiro dinâmico.</p>
        <h2>1. O que é o Rolling Forecast?</h2>
        <p>Diferente do forecast tradicional, o Rolling Forecast trabalha com um horizonte móvel contínuo (geralmente de 4 a 6 trimestres). Ao final de cada trimestre, os dados reais são consolidados e um novo trimestre é adicionado ao modelo de projeção.</p>
        <h2>2. Vantagens da Projeção Móvel</h2>
        <ul>
          <li><strong>Agilidade de Decisão:</strong> Permite desviar recursos de projetos pouco rentáveis para oportunidades emergentes no curto prazo.</li>
          <li><strong>Metas Realistas:</strong> Evita metas de vendas defasadas pela macroeconomia ou cortes excessivos de OPEX baseados em premissas desatualizadas.</li>
        </ul>
      `,
      en: `
        <p>Annual Static Budgets assume a market stability that no longer exists. In volatile corporate landscapes, <strong>Rolling Forecasts</strong> deliver dynamic planning.</p>
        <h2>1. What is a Rolling Forecast?</h2>
        <p>Unlike traditional updates, the Rolling Forecast employs a continuous horizon (e.g., 4 to 6 quarters). Every quarter, closures are logged and a future quarter is added.</p>
        <h2>2. Core Advantages</h2>
        <ul>
          <li><strong>Agile Resource Allocation:</strong> Quickly shift capital from low-performing projects to growth opportunities.</li>
          <li><strong>Dynamic Metrics:</strong> Keep sales targets realistic and aligned with macroeconomic factors.</li>
        </ul>
      `
    }
  },
  {
    title: {
      pt: 'EBITDA Ajustado: O que os Investidores Realmente Olham na sua Empresa',
      en: 'Adjusted EBITDA: What Investors Really Look For in Your Business'
    },
    category: { pt: 'Controladoria' as const, en: 'Controllership' as const },
    excerpt: {
      pt: 'Desvende as conciliações e ajustes de EBITDA exigidos em auditorias e rodadas de captação de recursos para calcular a real capacidade de geração de caixa.',
      en: 'Unveil the reconciliations and EBITDA adjustments required in audits and funding rounds to find true cash generation.'
    },
    content: {
      pt: `
        <p>O EBITDA contábil é uma métrica universal de avaliação de valor de mercado. No entanto, investidores experientes raramente tomam decisões olhando apenas para ele. Eles exigem a conciliação do <strong>EBITDA Ajustado</strong>.</p>
        <h2>1. Por que Ajustar o EBITDA?</h2>
        <p>O objetivo do EBITDA é refletir a capacidade de geração de caixa da atividade-fim. Despesas não recorrentes ou lançamentos puramente contábeis precisam ser depurados pelo Controller para apresentar uma visão limpa da operação.</p>
        <h2>2. Principais Ajustes Efetuados</h2>
        <ul>
          <li><strong>Provisões Não Caixa:</strong> Provisões trabalhistas estimadas, perdas com PDD e equivalência patrimonial.</li>
          <li><strong>Eventos Não Recorrentes:</strong> Custos de reestruturação organizacional, rescisões em massa e baixas de imobilizado.</li>
        </ul>
      `,
      en: `
        <p>EBITDA is a key valuation tool, but savvy investors demand an **Adjusted EBITDA** report to filter out noise.</p>
        <h2>1. Why Adjust?</h2>
        <p>A corporate Controller must clean non-recurring items and non-cash provisions to showcase raw operational power.</p>
        <h2>2. Typical Adjustments</h2>
        <ul>
          <li><strong>Non-cash Provisions:</strong> PDD allowances, estimated labor contingencies, write-offs.</li>
          <li><strong>One-off events:</strong> Layoffs, organizational restructuring costs, asset disposals.</li>
        </ul>
      `
    }
  },
  {
    title: {
      pt: 'Cultura de Custos: Como Engajar Equipes no Controle de Gastos Operacionais',
      en: 'Cost Culture: How to Engage Teams in Controlling Operating Expenses'
    },
    category: { pt: 'Controladoria' as const, en: 'Controllership' as const },
    excerpt: {
      pt: 'Reduzir custos exige mais do que canetadas da diretoria. Saiba como estruturar relatórios simples e engajar gerentes no controle do OPEX.',
      en: 'Reducing costs takes more than board mandates. Learn how to draft simple reports and engage department heads in OPEX control.'
    },
    content: {
      pt: `
        <p>Toda empresa quer reduzir custos, mas a maioria falha porque tenta fazer isso de cima para baixo. O segredo de uma redução sustentável de OPEX está na criação de uma verdadeira <strong>Cultura de Custos</strong>, liderada pela controladoria.</p>
        <h2>1. O Papel do Controller como Facilitador</h2>
        <p>Em vez de agir como o "policial dos custos", o Controller deve atuar como um parceiro de negócios das áreas operacionais. Os gerentes de departamento precisam entender o impacto de suas decisões.</p>
        <h2>2. Como Estruturar o Engajamento</h2>
        <ul>
          <li><strong>Responsabilidade por Centro de Custos:</strong> Cada linha de OPEX deve ter um gerente dono associado.</li>
          <li><strong>Relatórios Amigáveis:</strong> Substitua planilhas complexas por dashboards simples em Power BI com faróis de performance.</li>
        </ul>
      `,
      en: `
        <p>Arbitrary top-down budget cuts demoralize teams and miss the root cause. Developing a **Cost Culture** is the sustainable solution.</p>
        <h2>1. Controller as a Partner</h2>
        <p>Instead of playing cost police, serve as a business partner so department managers see the financial footprints of their decisions.</p>
        <h2>2. Action Plan</h2>
        <ul>
          <li><strong>Cost Center Ownership:</strong> Assign a manager to every line item. If they sign the invoice, they track the budget.</li>
          <li><strong>Visual Dashboards:</strong> Replace raw sheets with visual Power BI traffic-light indicators.</li>
        </ul>
      `
    }
  },
  {
    title: {
      pt: 'Preço de Transferência (Transfer Pricing) sob o Padrão da OCDE',
      en: 'Transfer Pricing under the OECD Standard'
    },
    category: { pt: 'Controladoria' as const, en: 'Controllership' as const },
    excerpt: {
      pt: 'Analise as novas diretrizes brasileiras de preços de transferência e saiba como evitar autuações e dupla tributação em holdings.',
      en: 'Analyze the new transfer pricing guidelines and learn how to avoid tax fines and double taxation in holdings.'
    },
    content: {
      pt: `
        <p>A convergência às regras de Preço de Transferência da OCDE alterou a governança de holdings nacionais. O foco agora é o <strong>Princípio Arm\'s Length</strong>: transações entre partes relacionadas devem ser precificadas como se fossem realizadas com partes independentes.</p>
        <h2>1. O Fim do Modelo de Margens Fixas</h2>
        <p>As antigas fórmulas baseadas em margens pré-estabelecidas foram extintas. Agora, a controladoria deve realizar análises de comparabilidade detalhadas, avaliando ativos, funções e riscos.</p>
      `,
      en: `
        <p>The adoption of OECD Transfer Pricing models changes intercompany flows. The **Arm\'s Length Principle** is now law.</p>
        <h2>1. Comparability Analysis</h2>
        <p>Static margin limits are gone. Controllers must execute detailed comparability analysis based on functions, assets and risks.</p>
      `
    }
  },
  {
    title: {
      pt: 'KPIs de Tesouraria: O Mínimo que o CFO Precisa Olhar Diariamente',
      en: 'Treasury KPIs: The Minimum a CFO Needs to Monitor Daily'
    },
    category: { pt: 'Gestão de Caixa' as const, en: 'Cash Management' as const },
    excerpt: {
      pt: 'Conheça os indicadores chave de desempenho essenciais para evitar surpresas de liquidez no fechamento de caixa.',
      en: 'Discover the essential key performance indicators to prevent liquidity surprises during cash closing.'
    },
    content: {
      pt: `
        <p>A gestão de caixa é de alta velocidade. Enquanto a controladoria analisa o fechamento anterior, a tesouraria precisa garantir que haja saldo hoje, amanhã e na próxima semana.</p>
        <h2>1. Os Indicadores Críticos de Liquidez</h2>
        <ul>
          <li><strong>Saldo de Caixa Disponível vs. Mínimo:</strong> Visibilidade em tempo real do caixa disponível contra a reserva de segurança.</li>
          <li><strong>Aging List de Recebíveis:</strong> Monitoramento dos vencimentos por faixas de atraso (0-30, 31-60, >60 dias) para direcionamento de cobranças.</li>
        </ul>
      `,
      en: `
        <p>Cash is speed. While accounting closes last month, treasury needs liquidity today and next week.</p>
        <h2>1. Critical KPIs</h2>
        <ul>
          <li><strong>Cash Position vs. Operating Minimum:</strong> Real-time liquid cash vs safety margin.</li>
          <li><strong>Aging Schedule:</strong> Track customer invoice delays by buckets (0-30, 31-60, >60 days) to coordinate collections.</li>
        </ul>
      `
    }
  },
  {
    title: {
      pt: 'Planejamento Orçamentário com Base Zero (OBZ) na Prática',
      en: 'Zero-Based Budgeting (ZBB) in Practice'
    },
    category: { pt: 'FP&A' as const, en: 'FP&A' as const },
    excerpt: {
      pt: 'Descubra como estruturar o Orçamento Base Zero, eliminando reajustes históricos automáticos e questionando cada linha de despesa.',
      en: 'Learn how to structure Zero-Based Budgeting, eliminating automatic historical adjustments and questioning every expense.'
    },
    content: {
      pt: `
        <p>No modelo tradicional, o Budget do próximo ano repete as despesas do anterior com reajustes inflacionários. O <strong>Orçamento Base Zero (OBZ)</strong> rompe com isso ao exigir que cada despesa seja justificada do zero.</p>
        <h2>1. As Fases de Implantação do OBZ</h2>
        <ul>
          <li><strong>Identificação de Pacotes de Decisão:</strong> Agrupar as despesas por pacotes específicos (logística, marketing, TI).</li>
          <li><strong>Justificativa e Priorização:</strong> Cada gestor deve justificar a necessidade daquela linha de gasto.</li>
        </ul>
      `,
      en: `
        <p>Traditional budgeting carries forward historical waste. **Zero-Based Budgeting (ZBB)** wipes the slate clean, requiring managers to build budgets from scratch.</p>
        <h2>1. Core ZBB Steps</h2>
        <ul>
          <li><strong>Decision Packages:</strong> Classify and bundle items into logical buckets (IT, logistics, marketing).</li>
          <li><strong>Justification:</strong> Defend the operational necessity of every single spend line.</li>
        </ul>
      `
    }
  },
  {
    title: {
      pt: 'Acuracidade de Inventário: O Impacto Contábil de Estoques Divergentes',
      en: 'Inventory Accuracy: The Accounting Impact of Stock Discrepancies'
    },
    category: { pt: 'Estoques' as const, en: 'Inventory' as const },
    excerpt: {
      pt: 'Diferenças físicas de estoque geram distorções no custo do produto vendido e impactam diretamente o lucro operacional.',
      en: 'Physical stock discrepancies distort cost of goods sold and directly impact operational net profits.'
    },
    content: {
      pt: `
        <p>Uma divergência de inventário física afeta a apuração do Custo das Mercadorias Vendidas (CMV) e a margem de lucro exibida no fechamento contábil.</p>
        <h2>1. A Equação do CMV</h2>
        <p>CMV = Estoque Inicial + Compras - Estoque Final. Se o estoque final físico é menor do que o sistema registra (perdas ou desvios), o CMV aumenta automaticamente, reduzindo a lucratividade operacional.</p>
      `,
      en: `
        <p>A physical inventory variance distorts the Cost of Goods Sold (COGS) calculations and ruins balance sheet credibility.</p>
        <h2>1. The COGS Equation</h2>
        <p>COGS = Starting Stock + Purchases - Ending Stock. If ending stock is overstated due to shrinkage, COGS is understated, leading to phantom profits.</p>
      `
    }
  },
  {
    title: {
      pt: 'Como Automatizar Relatórios de Controladoria Utilizando Python e SQL',
      en: 'How to Automate Controllership Reports Using Python and SQL'
    },
    category: { pt: 'FP&A' as const, en: 'FP&A' as const },
    excerpt: {
      pt: 'Substitua o trabalho manual de copiar e colar planilhas por scripts automatizados de importação e transformação de dados ERP.',
      en: 'Replace manual spreadsheet tasks with automated scripts that import and transform raw ERP database records.'
    },
    content: {
      pt: `
        <p>Muitos controllers passam a maior parte do tempo organizando planilhas, restando pouco tempo para análises estratégicas. Automações com <strong>Python</strong> e <strong>SQL</strong> resolvem isso.</p>
        <h2>1. Acesso à Base de Dados Direta</h2>
        <p>Puxar faturamentos e custos operacionais direto do banco de dados (ERP, SQL) agiliza o fechamento e garante a integridade da informação.</p>
      `,
      en: `
        <p>Stop copy-pasting tables. Code automation using **Python** and **SQL** shifts focus from building sheets to analyzing plans.</p>
        <h2>1. Direct Querying</h2>
        <p>Pull invoices and OPEX structures directly from ERP database backends, accelerating closure timelines.</p>
      `
    }
  },
  {
    title: {
      pt: 'Valuation por Fluxo de Caixa Descontado (FCD) na Prática do Controller',
      en: 'Valuation via Discounted Cash Flow (DCF) in the Controller\'s Practice'
    },
    category: { pt: 'FP&A' as const, en: 'FP&A' as const },
    excerpt: {
      pt: 'Veja como estruturar projeções de caixa livre, estimar a taxa WACC e calcular o valor intrínseco da operação para investidores.',
      en: 'Learn how to structure free cash flow projections, compute WACC rates and find intrinsic enterprise valuation.'
    },
    content: {
      pt: `
        <p>Calcular o valor de mercado de uma empresa é estratégico. O método de <strong>Fluxo de Caixa Descontado (FCD)</strong> é a abordagem de mercado mais robusta e respeitada.</p>
        <h2>1. Projeção de Fluxo Livre</h2>
        <p>Projete o fluxo de caixa operacional ajustado por investimentos em ativos (CAPEX) e variações da Necessidade de Capital de Giro (NCG) trazidos a valor presente pela taxa de desconto (WACC).</p>
      `,
      en: `
        <p>Calculating enterprise value is a cornerstone task. **Discounted Cash Flow (DCF)** represents the gold standard methodology.</p>
        <h2>1. Horizon Modeling</h2>
        <p>Model free cash flow projections adjusted for CAPEX and Working Capital Requirements (WCR), discounted back to present value using WACC ratios.</p>
      `
    }
  }
]

const REGEN_STORAGE_KEY = 'jorge-regenerated-articles-v1'
const LAST_REGEN_DATE_KEY = 'jorge-last-regen-date-v1'

/**
 * Generates dynamic articles for the current date or on-demand simulation
 * and stores them in localStorage.
 */
export function getRegeneratedArticles(): Article[] {
  try {
    const saved = localStorage.getItem(REGEN_STORAGE_KEY)
    const lastDate = localStorage.getItem(LAST_REGEN_DATE_KEY)
    const todayStr = new Date().toDateString()

    if (saved && lastDate === todayStr) {
      return JSON.parse(saved)
    }

    const generated = generateTenArticles(new Date())
    localStorage.setItem(REGEN_STORAGE_KEY, JSON.stringify(generated))
    localStorage.setItem(LAST_REGEN_DATE_KEY, todayStr)
    return generated
  } catch {
    return generateTenArticles(new Date())
  }
}

/**
 * Simulates a crawl on LinkedIn and force regenerates a fresh batch of 10 articles,
 * saving them to localStorage and returning them.
 */
export function forceRegenerateArticles(): Article[] {
  const generated = generateTenArticles(new Date())
  try {
    localStorage.setItem(REGEN_STORAGE_KEY, JSON.stringify(generated))
    localStorage.setItem(LAST_REGEN_DATE_KEY, new Date().toDateString())
  } catch {
    // ignore
  }
  return generated
}

/**
 * Helper to build 10 distinct articles with custom slugs and dates
 */
function generateTenArticles(baseDate: Date): Article[] {
  const pool = [...topicPool]
  const result: Article[] = []

  for (let i = 0; i < 10; i++) {
    const topic = pool[i % pool.length]
    
    const dateObj = new Date(baseDate.getTime() - i * 24 * 60 * 60 * 1000)
    const formattedDate = dateObj.toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })

    const indexSuffix = i > 0 ? `-${i}` : ''
    const slug = `${topic.title.pt.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')}${indexSuffix}`

    result.push({
      slug,
      title: {
        pt: `${topic.title.pt} [IA Regenerativo]`,
        en: `${topic.title.en} [AI Regenerative]`
      },
      date: formattedDate,
      excerpt: {
        pt: `[LinkedIn Insights] ${topic.excerpt.pt}`,
        en: `[LinkedIn Insights] ${topic.excerpt.en}`
      },
      content: {
        pt: `
          <div class="p-4 mb-6 rounded-2xl bg-blue-50/50 border border-blue-100 text-xs text-slate-600 flex items-start gap-2.5">
            <span class="text-base">🤖</span>
            <div>
              <strong>Artigo Auto-Regenerativo:</strong> Este conteúdo foi gerado e estruturado automaticamente por nosso robô de Inteligência Artificial após ler, analisar e consolidar ideias de postagens influentes sobre Controladoria e FP&A no <strong>LinkedIn Feed</strong>.
            </div>
          </div>
          ${topic.content.pt}
        `,
        en: `
          <div class="p-4 mb-6 rounded-2xl bg-blue-50/50 border border-blue-100 text-xs text-slate-600 flex items-start gap-2.5">
            <span class="text-base">🤖</span>
            <div>
              <strong>Regenerative AI Post:</strong> This content was automatically drafted and structured by our Artificial Intelligence crawler after parsing and summarizing controllership trends from <strong>LinkedIn feeds</strong>.
            </div>
          </div>
          ${topic.content.en}
        `
      },
      category: {
        pt: topic.category.pt,
        en: topic.category.en
      },
      readTime: {
        pt: `${Math.round(4 + i % 4)} min de leitura`,
        en: `${Math.round(4 + i % 4)} min read`
      }
    })
  }

  return result
}

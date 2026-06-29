import { Article } from '../data/articles'

// Dynamic Pool of 20 trending Controllership & FP&A topics inspired by LinkedIn feeds
const topicPool = [
  {
    title: 'Reforma Tributária: Como Planejar o Orçamento em Meio às Novas Regras',
    category: 'Controladoria' as const,
    excerpt: 'As mudanças na tributação de consumo exigem recalibração urgente do DRE projetado e do fluxo de caixa operacional para os próximos períodos fiscais.',
    content: `
      <p>A aprovação da Reforma Tributária no Brasil representa o maior desafio de planejamento para Controllers nesta década. Com a transição gradual para o IVA Dual (IBS e CBS), o planejamento orçamentário tradicional baseado em séries históricas perde a validade. As empresas precisam se preparar para um cenário de dupla contabilidade e alteração drástica nas alíquotas de consumo.</p>
      <h2>1. O Desafio da Transição e Alíquota Operacional</h2>
      <p>A coexistência dos modelos antigos e novos gerará custos de conformidade elevados. O papel do Controller é projetar o impacto do novo modelo no CMV e no fluxo de caixa, principalmente analisando a não cumulatividade plena dos créditos. Setores de serviços, por exemplo, enfrentarão aumentos nominais de alíquota que exigirão repasse de preço ou otimização drástica de OPEX.</p>
      <h2>2. Ações Imediatas para o Controller</h2>
      <ul>
        <li><strong>Simulação de Cenários:</strong> Desenvolva modelos contendo cenários de alíquota efetiva (25% a 28%) e analise o impacto na margem de contribuição.</li>
        <li><strong>Revisão de Fornecedores:</strong> Avalie a cadeia de suprimentos. Fornecedores optantes pelo Simples Nacional podem gerar menos créditos, alterando o custo real de aquisição.</li>
        <li><strong>Tecnologia e Parametrização:</strong> Garanta que os sistemas de ERP e BI estejam prontos para apurar os novos tributos de forma paralela.</li>
      </ul>
      <blockquote>
        <strong>Insight da IA:</strong> A reforma não é apenas um desafio fiscal, mas estratégico. Empresas que simularem seus impactos primeiro conseguirão renegociar contratos e redefinir preços antes da concorrência.
      </blockquote>
    `
  },
  {
    title: 'Rolling Forecast: Por que o Orçamento Estático Está Morrendo',
    category: 'FP&A' as const,
    excerpt: 'Em mercados voláteis, relying apenas no Budget anual é um risco. Descubra como implantar previsões dinâmicas trimestrais (Rolling Forecast).',
    content: `
      <p>O Orçamento Estático (Budget) anual ainda é a regra na maioria das corporações. No entanto, planejar em outubro as metas de vendas e despesas para o dezembro do ano seguinte assume uma estabilidade de mercado que não existe mais. Em ambientes de alta volatilidade, o <strong>Rolling Forecast</strong> surge como a metodologia ideal de planejamento financeiro dinâmico.</p>
      <h2>1. O que é o Rolling Forecast?</h2>
      <p>Diferente do forecast tradicional (que apenas atualiza os meses restantes até o fim do ano fiscal), o Rolling Forecast trabalha com um horizonte móvel contínuo (geralmente de 4 a 6 trimestres). Ao final de cada trimestre, os dados reais são consolidados e um novo trimestre é adicionado ao modelo de projeção.</p>
      <h2>2. Vantagens da Projeção Móvel</h2>
      <ul>
        <li><strong>Agilidade de Decisão:</strong> Permite desviar recursos de projetos pouco rentáveis para oportunidades emergentes no curto prazo.</li>
        <li><strong>Metas Realistas:</strong> Evita metas de vendas defasadas pela macroeconomia ou cortes excessivos de OPEX baseados em premissas desatualizadas.</li>
        <li><strong>Cultura de Planejamento:</strong> Transforma o planejamento financeiro em um processo contínuo e integrado ao invés de um ritual anual burocrático.</li>
      </ul>
      <blockquote>
        <strong>Insight da IA:</strong> Implementar o Rolling Forecast exige desapego da precisão centesimal do Budget. O foco deve ser a direção estratégica do fluxo de caixa e a reatividade operacional.
      </blockquote>
    `
  },
  {
    title: 'EBITDA Ajustado: O que os Investidores Realmente Olham na sua Empresa',
    category: 'Controladoria' as const,
    excerpt: 'Desvende as conciliações e ajustes de EBITDA exigidos em auditorias e rodadas de captação de recursos para calcular a real capacidade de geração de caixa.',
    content: `
      <p>O EBITDA (Lucro antes de Juros, Impostos, Depreciação e Amortização) tornou-se a métrica universal de avaliação de valor de mercado (Valuation). No entanto, investidores experientes raramente tomam decisões olhando apenas para o EBITDA contábil. Eles exigem a conciliação do <strong>EBITDA Ajustado</strong>.</p>
      <h2>1. Por que Ajustar o EBITDA?</h2>
      <p>O objetivo do EBITDA é refletir a capacidade intrínseca de geração de caixa operacional da atividade-fim. Por isso, despesas e receitas não recorrentes, ou lançamentos puramente contábeis sem impacto de caixa, precisam ser depurados pelo Controller para apresentar uma visão limpa da operação.</p>
      <h2>2. Principais Ajustes Efetuados</h2>
      <ul>
        <li><strong>Provisões Não Caixa:</strong> Lançamentos como contingências cíveis/trabalhistas estimadas, perdas com PDD e equivalência patrimonial.</li>
        <li><strong>Eventos Não Recorrentes:</strong> Custos de reestruturação organizacional, rescisões em massa, baixas de ativos imobilizados ou indenizações recebidas.</li>
        <li><strong>Remuneração em Ações (Stock Options):</strong> Despesa contábil que não afeta a conta bancária operacional direta da empresa.</li>
      </ul>
      <blockquote>
        <strong>Insight da IA:</strong> Manter um histórico documentado de conciliação de EBITDA Ajustado é obrigatório para qualquer processo de M&A ou auditoria de governança.
      </blockquote>
    `
  },
  {
    title: 'Cultura de Custos: Como Engajar Equipes no Controle de Gastos Operacionais',
    category: 'Controladoria' as const,
    excerpt: 'Reduzir custos exige mais do que canetadas da diretoria. Saiba como estruturar relatórios simples e engajar gerentes no controle do OPEX.',
    content: `
      <p>Toda empresa quer reduzir custos, mas a maioria falha porque tenta fazer isso de cima para baixo. Canetadas da diretoria geram desmotivação e não atacam a raiz do desperdício. O segredo de uma redução sustentável de OPEX está na criação de uma verdadeira <strong>Cultura de Custos</strong>, liderada pela controladoria.</p>
      <h2>1. O Papel do Controller como Facilitador</h2>
      <p>Em vez de agir como o "policial dos custos", o Controller deve atuar como um parceiro de negócios das áreas operacionais. Os gerentes de departamento precisam entender o impacto financeiro de suas decisões operacionais diárias.</p>
      <h2>2. Como Estruturar o Engajamento</h2>
      <ul>
        <li><strong>Responsabilização por Centro de Custos:</strong> Cada linha de OPEX deve ter um gerente responsável associado. Se o gerente assina o gasto, ele deve acompanhar o real x orçado.</li>
        <li><strong>Relatórios Amigáveis:</strong> Substitua planilhas contábeis complexas por dashboards de Power BI simples, exibindo os desvios em formato gráfico (faróis verde, amarelo e vermelho).</li>
        <li><strong>Reuniões de Governança Mensais:</strong> Realize reuniões curtas de "GPD" (Gestão de Diretrizes) para analisar os desvios significativos e traçar planos de ação imediatos.</li>
      </ul>
      <blockquote>
        <strong>Insight da IA:</strong> Custos são como unhas: precisam ser cortados constantemente. Mas o corte só é saudável quando quem opera a tesoura compreende o processo.
      </blockquote>
    `
  },
  {
    title: 'Preço de Transferência (Transfer Pricing) sob o Padrão da OCDE',
    category: 'Controladoria' as const,
    excerpt: 'Analise as novas diretrizes brasileiras de preços de transferência e saiba como evitar autuações e dupla tributação em holdings.',
    content: `
      <p>A convergência do Brasil às regras de Preço de Transferência da OCDE (Lei nº 14.596/23) alterou profundamente a governança de multinacionais e holdings nacionais com transações intercompany. O foco agora é o <strong>Princípio Arm\'s Length</strong>: transações entre partes relacionadas devem ser precificadas como se fossem realizadas com partes independentes.</p>
      <h2>1. O Fim do Modelo de Margens Fixas</h2>
      <p>As antigas fórmulas brasileiras baseadas em margens pré-estabelecidas foram extintas. Agora, a controladoria deve realizar análises de comparabilidade detalhadas, avaliando ativos utilizados, funções desempenhadas e riscos assumidos por cada entidade do grupo.</p>
      <h2>2. A Importância da Documentação</h2>
      <ul>
        <li><strong>Dossie Local e Global:</strong> A elaboração anual do Local File e Master File contendo análises econômicas de comparabilidade é obrigatória para evitar multas elevadas.</li>
        <li><strong>Escolha do Método Correto:</strong> Avalie se o método de Margem Líquida da Transação (MLT) ou Preço Independente Comparável (PIC) é o ideal para a transação.</li>
      </ul>
      <blockquote>
        <strong>Insight da IA:</strong> A nova legislação exige uma integração sem precedentes entre os times de Finanças, Controladoria e Jurídico Tributário das holdings.
      </blockquote>
    `
  },
  {
    title: 'KPIs de Tesouraria: O Mínimo que o CFO Precisa Olhar Diariamente',
    category: 'Gestão de Caixa' as const,
    excerpt: 'Conheça os indicadores chave de desempenho essenciais para evitar surpresas de liquidez no fechamento de caixa.',
    content: `
      <p>A gestão de caixa é uma atividade de alta velocidade. Enquanto a controladoria analisa o fechamento do mês anterior, a tesouraria precisa garantir que haja saldo hoje, amanhã e na próxima semana. Para apoiar o CFO, o Controller deve projetar um cockpit de indicadores operacionais imediatos.</p>
      <h2>1. Os Indicadores Críticos de Liquidez</h2>
      <ul>
        <li><strong>Saldo de Caixa Disponível vs. Mínimo Operacional:</strong> Visibilidade em tempo real do caixa disponível contra a reserva de segurança projetada.</li>
        <li><strong>Índice de Liquidez Corrente Real:</strong> Razão entre ativos realizáveis no curto prazo e passivos de curto prazo ajustados por prazos de recebimento reais.</li>
        <li><strong>Aging List de Recebíveis:</strong> Monitoramento dos vencimentos por faixas de atraso (0-30, 31-60, >60 dias) para direcionamento ágil das cobranças.</li>
      </ul>
      <h2>2. Projeção de Fluxo de Caixa (Direct vs. Indirect)</h2>
      <p>Garantir que a projeção de fluxo de caixa direto de 13 semanas (13-Week Cash Flow Forecast) seja alimentada e atualizada todas as sextas-feiras pelas áreas de compras e faturamento corporativo.</p>
      <blockquote>
        <strong>Insight da IA:</strong> Um caixa operacional bem monitorado é o melhor seguro contra turbulências macroeconômicas inesperadas.
      </blockquote>
    `
  },
  {
    title: 'Planejamento Orçamentário com Base Zero (OBZ) na Prática',
    category: 'FP&A' as const,
    excerpt: 'Descubra como estruturar o Orçamento Base Zero, eliminando reajustes históricos automáticos e questionando cada linha de despesa do negócio.',
    content: `
      <p>No modelo de orçamento tradicional, o Budget do próximo ano é desenhado pegando as despesas do ano anterior e aplicando reajustes inflacionários ou acréscimos percentuais de crescimento. Essa abordagem consolida desperdícios históricos. O <strong>Orçamento Base Zero (OBZ)</strong> rompe com isso ao exigir que cada despesa seja justificada do zero.</p>
      <h2>1. As Fases de Implantação do OBZ</h2>
      <p>O OBZ parte de uma folha em branco. Suas etapas envolvem:</p>
      <ul>
        <li><strong>Identificação das Unidades de Decisão:</strong> Agrupar as despesas por pacotes de decisão específicos (ex: logística, marketing, TI).</li>
        <li><strong>Desdobramento e Justificativa:</strong> Cada gestor deve justificar a necessidade daquela linha de gasto operacional e estimar o impacto de não realizá-lo.</li>
        <li><strong>Priorização de Pacotes:</strong> A diretoria executiva avalia os pacotes e aprova as despesas até o limite da projeção de receita líquida.</li>
      </ul>
      <blockquote>
        <strong>Insight da IA:</strong> O OBZ exige tempo e dedicação organizacional intensos. Para evitar fadiga corporativa, muitas empresas aplicam a metodologia em ciclos rotativos a cada 2 ou 3 anos.
      </blockquote>
    `
  },
  {
    title: 'Acuracidade de Inventário: O Impacto Contábil de Estoques Divergentes',
    category: 'Estoques' as const,
    excerpt: 'Diferenças físicas de estoque geram distorções no custo do produto vendido e impactam diretamente o lucro operacional.',
    content: `
      <p>Uma acuracidade de inventário de 90% parece aceitável para um gerente de logística. Contudo, para a controladoria contábil, uma divergência de 10% pode significar distorções catastróficas na apuração do Custo das Mercadorias Vendidas (CMV) e, consequentemente, na margem de lucro líquido exibida ao conselho de administração.</p>
      <h2>1. A Equação do CMV e o Estoque Final</h2>
      <p>Lembre-se da fórmula contábil clássica: CMV = Estoque Inicial + Compras - Estoque Final. Se o inventário físico apura que o estoque final real é menor do que o sistema registra (devido a perdas, furtos ou erros de cadastro), o CMV aumenta automaticamente, encolhendo o lucro operacional.</p>
      <h2>2. Como Sanar Divergências Contábeis</h2>
      <ul>
        <li><strong>Inventários Rotativos:</strong> Abandone o modelo de parar a fábrica uma vez por ano para fazer inventário geral. Adote contagens físicas diárias dos itens com maior giro.</li>
        <li><strong>Auditoria no Recebimento:</strong> Garanta que as notas fiscais de entrada (XML) batam exatamente com o peso e quantidade física conferidos nas docas.</li>
      </ul>
      <blockquote>
        <strong>Insight da IA:</strong> Estoque é dinheiro físico empilhado em prateleiras. Controlar sua acuracidade é tão crítico quanto conciliar a conta bancária da empresa.
      </blockquote>
    `
  },
  {
    title: 'Como Automatizar Relatórios de Controladoria Utilizando Python e SQL',
    category: 'FP&A' as const,
    excerpt: 'Substitua o trabalho manual de copiar e colar planilhas por scripts automatizados de importação e transformação de dados ERP.',
    content: `
      <p>Muitos controllers qualificados passam 80% do seu tempo de trabalho copiando, colando e formatando planilhas de Excel para gerar relatórios mensais, restando apenas 20% do tempo para análises estratégicas. A automação com **Python** e **SQL** permite inverter essa balança.</p>
      <h2>1. A Importância de Acessar a Base de Dados Direta</h2>
      <p>Em vez de extrair relatórios TXT ou CSV do ERP do sistema, a controladoria moderna aprende a construir queries SQL otimizadas para puxar dados agregados diretamente do banco de dados (ERP, CRM, BigQuery).</p>
      <h2>2. O Script de Automação (ETL)</h2>
      <p>Utilizando scripts em Python (com bibliotecas como Pandas e SQLAlchemy), o Controller pode extrair faturamentos e custos operacionais históricos, processar as regras de conversão e exportar diretamente para um dashboard reativo em Power BI.</p>
      <blockquote>
        <strong>Insight da IA:</strong> A automação de rotinas não elimina o trabalho do Controller; ela o eleva à condição de consultor analítico estratégico.
      </blockquote>
    `
  },
  {
    title: 'Valuation por Fluxo de Caixa Descontado (FCD) na Prática do Controller',
    category: 'FP&A' as const,
    excerpt: 'Veja como estruturar projeções de caixa livre, estimar a taxa WACC e calcular o valor intrínseco da operação para investidores.',
    content: `
      <p>Calcular o valor intrínseco de uma organização (Valuation) é um dos marcos de carreira mais prestigiados para um profissional de FP&A. O método de <strong>Fluxo de Caixa Descontado (FCD)</strong> é a abordagem de mercado mais respeitada para medir o valor operacional da empresa.</p>
      <h2>1. Estrutura de Projeção Financeira</h2>
      <p>O FCD exige a projeção detalhada do fluxo de caixa livre da empresa (FCFE ou FCFF) para um horizonte futuro (normalmente de 5 a 10 anos) ajustado por investimentos em ativos (CAPEX) e variações da Necessidade de Capital de Giro (NCG).</p>
      <h2>2. Determinação da Taxa de Desconto (WACC)</h2>
      <p>O custo médio ponderado de capital (WACC) representa a taxa mínima de retorno exigida pelos credores e acionistas do negócio. Todos os fluxos projetados são trazidos a valor presente utilizando essa taxa.</p>
      <blockquote>
        <strong>Insight da IA:</strong> O valor gerado pela modelagem do FCD reside nas premissas operacionais adotadas (taxa de crescimento sustentável e prêmio de risco). O Controller deve dominar a sensibilidade destas variáveis.
      </blockquote>
    `
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
    const todayStr = new Date().toDateString() // e.g. "Mon Jun 29 2026"

    // If already generated today and has saved data, return it
    if (saved && lastDate === todayStr) {
      return JSON.parse(saved)
    }

    // Auto-generate 10 articles by mixing topics and dates
    const generated = generateTenArticles(new Date())
    localStorage.setItem(REGEN_STORAGE_KEY, JSON.stringify(generated))
    localStorage.setItem(LAST_REGEN_DATE_KEY, todayStr)
    return generated
  } catch {
    // Fallback if localstorage throws error
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
  // Shuffle or slice the topics pool to get 10 items
  const pool = [...topicPool]
  const result: Article[] = []

  // Ensure we get exactly 10 items.
  for (let i = 0; i < 10; i++) {
    const topic = pool[i % pool.length]
    
    // Calculate a simulated date (e.g. subtracting i days to make them look historically created)
    const dateObj = new Date(baseDate.getTime() - i * 24 * 60 * 60 * 1000)
    const formattedDate = dateObj.toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })

    const indexSuffix = i > 0 ? `-${i}` : ''
    const slug = `${topic.title.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // remove accents
      .replace(/[^a-z0-9]+/g, '-') // replace non-alphanumeric with dash
      .replace(/(^-|-$)/g, '')}${indexSuffix}` // clean trailing dashes

    result.push({
      slug,
      title: `${topic.title} [IA Regenerativo]`,
      date: formattedDate,
      excerpt: `[LinkedIn Feed Insights] ${topic.excerpt}`,
      content: `
        <div class="p-4 mb-6 rounded-2xl bg-blue-50/50 border border-blue-100 text-xs text-slate-600 flex items-start gap-2.5">
          <span class="text-base">🤖</span>
          <div>
            <strong>Artigo Auto-Regenerativo:</strong> Este conteúdo foi gerado e estruturado automaticamente por nosso robô de Inteligência Artificial após ler, analisar e consolidar ideias de postagens influentes sobre Controladoria e FP&A no <strong>LinkedIn Feed</strong>.
          </div>
        </div>
        ${topic.content}
      `,
      category: topic.category,
      readTime: `${Math.round(4 + i % 4)} min de leitura`
    })
  }

  return result;
}

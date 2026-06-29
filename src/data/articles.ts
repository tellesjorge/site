import { getRegeneratedArticles } from '../utils/regenerativeArticles'

export type TranslatedString = {
  pt: string
  en: string
}

export type Article = {
  slug: string
  title: TranslatedString
  date: string // date formatting is standard or local
  excerpt: TranslatedString
  content: TranslatedString // HTML strings
  category: TranslatedString
  readTime: TranslatedString
  coverImage?: string
}

const staticArticles: Article[] = [
  {
    slug: 'lucro-nao-paga-boleto',
    title: {
      pt: 'Lucro não Paga Boleto: A Diferença Vital entre Competência e Caixa',
      en: 'Profit Does Not Pay Bills: The Vital Difference Between Accrual and Cash'
    },
    date: '29 de Junho de 2026',
    category: { pt: 'Gestão de Caixa', en: 'Cash Management' },
    readTime: { pt: '6 min de leitura', en: '6 min read' },
    excerpt: {
      pt: 'Entenda por que muitas empresas que apresentam lucros contábeis robustos no DRE acabam enfrentando crises de liquidez e dificuldades para honrar seus compromissos imediatos.',
      en: 'Understand why many companies showing robust accounting profits in their income statements end up facing liquidity crises and trouble paying their bills.'
    },
    content: {
      pt: `
        <p>No ambiente corporativo, é comum ouvir a máxima: <em>"Faturamento é vaidade, lucro é sanidade, mas caixa é realidade"</em>. No entanto, muitos gestores ainda se surpreendem ao ver um Demonstrativo de Resultados do Exercício (DRE) exibindo um lucro líquido confortável, enquanto a conta bancária da empresa está no vermelho. Por que isso acontece? A resposta está na diferença fundamental entre o <strong>Regime de Competência</strong> e o <strong>Regime de Caixa</strong>.</p>
        
        <h2>1. O Regime de Competência vs. Regime de Caixa</h2>
        <p>O <strong>Regime de Competência</strong> (base do DRE) registra as receitas e despesas no momento em que elas acontecem, independentemente de quando o dinheiro efetivamente entra ou sai. Se você realiza uma venda parcelada em 10 vezes hoje, o valor total entra no seu DRE como receita este mês.</p>
        <p>Por outro lado, o <strong>Regime de Caixa</strong> (base do Fluxo de Caixa) registra as transações apenas quando há a movimentação física do dinheiro. Naquela mesma venda em 10 parcelas, apenas 1/10 do valor constará no caixa deste mês.</p>
        
        <h2>2. O Descompasso Temporal dos Prazos</h2>
        <p>O lucro contábil é uma promessa de caixa futuro, mas as contas do dia a dia (aluguel, salários, impostos, fornecedores) exigem liquidez imediata. Três prazos operacionais gerenciam esse descompasso:</p>
        <ul>
          <li><strong>Prazo Médio de Recebimento (PMR):</strong> Quanto tempo seus clientes demoram para te pagar.</li>
          <li><strong>Prazo Médio de Estocagem (PME):</strong> Quanto tempo seus insumos ou produtos ficam parados no estoque antes da venda.</li>
          <li><strong>Prazo Médio de Pagamento (PMP):</strong> Quanto tempo seus fornecedores te concedem para pagar pelas compras.</li>
        </ul>
        <p>Se o seu PMR e PME somados forem maiores que o seu PMP, você terá que financiar a sua operação com capital próprio ou empréstimos bankários. A empresa pode ser extremamente rentável, mas falirá por falta de caixa operacional.</p>
        
        <h2>3. Como Evitar a "Armadilha do Lucro Sem Caixa"</h2>
        <p>Para alinhar a rentabilidade com a saúde financeira:</p>
        <ol>
          <li><strong>Controle o Ciclo Financeiro:</strong> Monitore o Ciclo de Conversão de Caixa (CCC = PMR + PME - PMP) de perto. Seu objetivo deve ser encurtá-lo ao máximo.</li>
          <li><strong>Negocie Prazos Estrategicamente:</strong> Tente estender os prazos com fornecedores (PMP) e encurtar os prazos de recebimento de clientes (PMR), estimulando pagamentos à vista ou PIX.</li>
          <li><strong>Projete o Fluxo de Caixa (Forecast):</strong> Não gerencie a empresa olhando apenas para o DRE. Tenha uma projeção semanal e mensal rigorosa de entradas e saídas de caixa.</li>
        </ol>
        
        <blockquote>
          <strong>Conclusão:</strong> O lucro é um indicador de eficiência econômica de longo prazo, mas é o caixa que mantém a operação de pé diariamente. Lembre-se sempre: lucro é uma métrica de papel; boletos exigem dinheiro real.
        </blockquote>
      `,
      en: `
        <p>In the corporate environment, it is common to hear the maxim: <em>"Revenue is vanity, profit is sanity, but cash is reality"</em>. However, many managers are still surprised when they see an Income Statement showing a comfortable net profit while the company\'s bank account is in the red. Why does this happen? The answer lies in the fundamental difference between the <strong>Accrual Basis</strong> and the <strong>Cash Basis</strong>.</p>
        
        <h2>1. Accrual Basis vs. Cash Basis</h2>
        <p>The <strong>Accrual Basis</strong> records revenues and expenses when they occur, regardless of when the cash actually enters or leaves. If you make a sale split into 10 installments today, the total value enters your Income Statement as revenue this month.</p>
        <p>On the other hand, the <strong>Cash Basis</strong> records transactions only when physical movement of money takes place. In that same installment sale, only 1/10 of the value will appear in this month\'s cash flow statement.</p>
        
        <h2>2. Temporal Mismatches in Operating Terms</h2>
        <p>Accounting profit is a promise of future cash, but day-to-day bills require immediate liquidity. Three operating terms manage this mismatch:</p>
        <ul>
          <li><strong>Days Sales Outstanding (DSO / PMR):</strong> How long your customers take to pay you.</li>
          <li><strong>Days Inventory Outstanding (DIO / PME):</strong> How long your raw materials or products sit in stock before sale.</li>
          <li><strong>Days Payable Outstanding (DPO / PMP):</strong> How long your suppliers give you to pay for purchases.</li>
        </ul>
        <p>If your DSO and DIO combined are greater than your DPO, you must finance operations with equity or bank debt. A company can be highly profitable, yet fail due to lack of operating cash.</p>
        
        <h2>3. How to Avoid the "Profit Without Cash Trap"</h2>
        <p>To align profitability with financial health:</p>
        <ol>
          <li><strong>Control the Cash Conversion Cycle (CCC):</strong> Monitor (CCC = DSO + DIO - DPO) closely. Your goal should be to shorten it.</li>
          <li><strong>Negotiate Terms Strategically:</strong> Try to extend terms with suppliers (DPO) and shorten collection terms from customers (DSO), encouraging upfront payments.</li>
          <li><strong>Project Cash Flow (Forecast):</strong> Do not manage the business looking only at the DRE. Maintain a weekly and monthly cash flow forecast.</li>
        </ol>
        
        <blockquote>
          <strong>Conclusion:</strong> Profit is a long-term economic efficiency indicator, but cash is what keeps operations standing day by day. Remember: profit is a paper metric; bills require real cash.
        </blockquote>
      `
    }
  },
  {
    slug: 'estoque-parado-custo-invisivel',
    title: {
      pt: 'Estoque Parado: O Custo Invisível que Trava o Crescimento da Empresa',
      en: 'Stagnant Inventory: The Invisible Cost Halting Business Growth'
    },
    date: '28 de Junho de 2026',
    category: { pt: 'Estoques', en: 'Inventory' },
    readTime: { pt: '5 min de leitura', en: '5 min read' },
    excerpt: {
      pt: 'Mercadoria estocada além do necessário drena a liquidez corporativa. Analise os custos ocultos de armazenagem, obsolescência e o impacto direto no capital de giro.',
      en: 'Excess merchandise drains corporate liquidity. Analyze the hidden costs of storage, obsolescence, and the direct impact on working capital.'
    },
    content: {
      pt: `
        <p>Para muitos empresários, ter um estoque cheio é sinônimo de segurança e capacidade de atendimento. No entanto, sob a ótica da controladoria financeira, estoque excessivo ou parado é um dos maiores ralos de dinheiro de uma empresa. Trata-se de capital de giro "congelado" que deixa de gerar retorno e acumula custos silenciosos.</p>
        
        <h2>1. Os Custos Ocultos do Estoque</h2>
        <p>Manter produtos armazenados custa muito mais do que o valor pago na nota fiscal de compra. Os custos associados dividem-se em:</p>
        <ul>
          <li><strong>Custo de Oportunidade do Capital:</strong> Se você tem R$ 500 mil parados em estoque, esse dinheiro não está rendendo em caixa, não está sendo usado para negociar compras melhores e nem investido na expansão comercial.</li>
          <li><strong>Custos de Armazenagem:</strong> Espaço físico (aluguel de galpões), energia, seguros, vigilância e mão de obra de manuseio.</li>
          <li><strong>Obsolescência e Deterioração:</strong> Produtos vencidos, modelos defasados ou danificados que precisam ser descartados ou vendidos com margem negativa (descontos agressivos).</li>
        </ul>
        <p>Estudos indicam que o custo anual de manutenção de estoque pode variar entre <strong>18% e 25%</strong> do valor do próprio estoque.</p>
        
        <h2>2. O Impacto na Necessidade de Capital de Giro (NCG)</h2>
        <p>Quanto maior o seu Prazo Médio de Estocagem (PME), maior será o seu ciclo financeiro. Isso significa que você precisa de mais capital guardado apenas para manter o negócio funcionando (Necessidade de Capital de Giro). Se o estoque não gira, a empresa se vê obrigada a recorrer a linhas de crédito caras para cobrir o caixa operacional imediato.</p>
        
        <h2>3. Práticas de Controle para Otimizar o Giro</h2>
        <p>Um Controller estratégico utiliza metodologias ágeis para ajustar o estoque:</p>
        <ol>
          <li><strong>Classificação Curva ABC:</strong> Foque os controles nos produtos da categoria A (maior valor de demanda e margem), reduzindo os níveis de estoque dos itens C (baixo giro e baixo valor).</li>
          <li><strong>Acuracidade de Inventário (Kardex):</strong> Realize inventários rotativos mensais para identificar desvios entre o estoque físico e o sistema de ERP, evitando compras desnecessárias.</li>
          <li><strong>Just-in-Time e Parcerias:</strong> Alinhe os prazos de entrega com fornecedores chave para comprar lotes menores e mais frequentes, casando a entrada de insumos com a demanda de vendas.</li>
        </ol>
        
        <blockquote>
          <strong>Conclusão:</strong> O estoque ideal não é o maior, mas sim o mais rápido. Reduzir o PME libera caixa retido diretamente para a conta da empresa, fortalecendo a liquidez para investimentos em expansão.
        </blockquote>
      `,
      en: `
        <p>For many entrepreneurs, a full stock is synonymous with security. However, under controllership filters, excess or stagnant inventory is one of the biggest cash drains of a company. It is working capital "frozen" in space, yielding no returns and accumulating hidden costs.</p>
        
        <h2>1. The Hidden Costs of Inventory</h2>
        <p>Storing products costs far more than the nominal purchase price. Associated costs include:</p>
        <ul>
          <li><strong>Capital Opportunity Cost:</strong> If you have $100k stuck in inventory, that cash is not yielding interest or being used to negotiate supplier bulk discounts.</li>
          <li><strong>Storage Costs:</strong> Real estate lease, utilities, insurance policies, security personnel and labor.</li>
          <li><strong>Obsolescence & Spoilage:</strong> Expired goods, outdated models or damaged items that must be written off or sold with negative margins.</li>
        </ul>
        <p>Studies suggest that the annual carrying cost of inventory ranges from <strong>18% to 25%</strong> of the inventory value.</p>
        
        <h2>2. Direct Impact on Working Capital Requirements (WCR / NCG)</h2>
        <p>The longer your Days Inventory Outstanding (DIO), the wider your cash cycle. This means you need more cash reserved just to keep the business running (WCR). If inventory does not turn, the company is forced to seek expensive bank loans to bridge operational gaps.</p>
        
        <h2>3. Controls to Optimize Inventory Turns</h2>
        <p>A strategic Controller uses agile methods to optimize inventory:</p>
        <ol>
          <li><strong>ABC Analysis Classifications:</strong> Focus strict controls on Category A products (high value/margin) and reduce safety stock margins for Category C items.</li>
          <li><strong>Inventory Accuracy (Kardex):</strong> Run cycle counts monthly to catch differences between physical assets and ERP records early.</li>
          <li><strong>Just-in-Time Partnerships:</strong> Partner with key suppliers for smaller, frequent deliveries, tying inventory arrivals directly to customer orders.</li>
        </ol>
        
        <blockquote>
          <strong>Conclusion:</strong> The ideal inventory is not the largest, but the fastest-turning. Shortening your DIO releases locked cash directly into the bank accounts, bolstering investment capacity.
        </blockquote>
      `
    }
  },
  {
    slug: 'empresa-com-lucro-sem-caixa',
    title: {
      pt: 'Quando a Empresa Tem Lucro, Mas Vive Sem Caixa: Como Diagnosticar a NCG',
      en: 'When the Company is Profitable, but Lives Without Cash: How to Diagnose WCR'
    },
    date: '25 de Junho de 2026',
    category: { pt: 'Controladoria', en: 'Controllership' },
    readTime: { pt: '7 min de leitura', en: '7 min read' },
    excerpt: {
      pt: 'Entenda como a Necessidade de Capital de Giro (NCG) cresce proporcionalmente à operação e descubra os mecanismos para reverter o sufocamento financeiro.',
      en: 'Understand how the Working Capital Requirement (WCR) grows proportionally to operations and discover how to avoid financial suffocation.'
    },
    content: {
      pt: `
        <p>O crescimento acelerado de uma empresa pode ser o seu maior perigo se não for acompanhado por um controle rígido de tesouraria. É o paradoxo do crescimento: quanto mais a empresa vende, mais ela precisa comprar insumos, contratar pessoas e financiar clientes. Se a <strong>Necessidade de Capital de Giro (NCG)</strong> não for devidamente planejada, a expansão comercial resultará em asfixia de caixa.</p>
        
        <h2>1. Entendendo a Necessidade de Capital de Giro (NCG)</h2>
        <p>A NCG é o montante financeiro mínimo que a empresa precisa manter disponível para sustentar suas contas operacionais diárias (financiamento de clientes e estocagem) enquanto aguarda a liquidez de suas vendas. A fórmula clássica de NCG é:</p>
        <p style="text-align: center; font-weight: bold; font-size: 1.1em; color: #0071e3; margin: 15px 0;">
          NCG = Contas a Receber + Estoques - Contas a Pagar
        </p>
        <p>Se o resultado for positivo, a empresa precisa captar recursos para financiar o ciclo. Se for negativo, significa que a empresa se financia pelas compras com fornecedores (Superávit de Caixa).</p>
        
        <h2>2. O Sintoma do Lucro Virtual</h2>
        <p>Quando a empresa vende R$ 100 mil com margem de 30% (lucro de R$ 30 mil no DRE), mas concede prazo de 90 dias para os clientes pagarem, ela gerou um lucro virtual temporário. Ela terá que recolher impostos, pagar a comissão do vendedor e repor o estoque de imediato. A conta bancária ficará negativa mesmo com a operação operando de forma rentável.</p>
        
        <h2>3. Como Diagnosticar e Reverter o Cenário</h2>
        <p>Para restabelecer o equilíbrio financeiro, o Controller deve atuar em três frentes:</p>
        <ol>
          <li><strong>Reduzir o Prazo de Recebimento (PMR):</strong> Ofereça pequenos descontos para pagamentos à vista, antecipe recebíveis de cartões com taxas controladas e profissionalize o processo de cobrança para reduzir a inadimplência (PDD).</li>
          <li><strong>Girar o Estoque Rapidamente (PME):</strong> Evite estoques redundantes e faça promoções de itens obsoletos para liberar capital preso.</li>
          <li><strong>Alongar o Prazo de Pagamento (PMP):</strong> Negocie prazos maiores com seus fornecedores, usando o histórico de compras e bom relacionamento como moeda de troca.</li>
        </ol>
        
        <blockquote>
          <strong>Conclusão:</strong> Lucratividade mede a saúde econômica (eficiência operacional), enquanto a liquidez mede a saúde financeira (capacidade de sobrevivência). Ajustar o ciclo operacional e manter a NCG equilibrada é a única garantia de crescimento sustentável.
        </blockquote>
      `,
      en: `
        <p>Fast sales growth can become a company\'s greatest danger if it is not supported by strict treasury control. It is the growth paradox: the more you sell, the more you must spend on raw materials, payroll, and customer credit. Without planning the <strong>Working Capital Requirement (WCR / NCG)</strong>, commercial expansion leads directly to cash flow suffocation.</p>
        
        <h2>1. Demystifying Working Capital Requirements (WCR)</h2>
        <p>WCR is the minimum amount of cash needed to sustain daily operations (customer finance and stock cycles) before receiving cash from sales. The classical WCR formula is:</p>
        <p style="text-align: center; font-weight: bold; font-size: 1.1em; color: #0071e3; margin: 15px 0;">
          WCR = Accounts Receivable + Inventory - Accounts Payable
        </p>
        <p>If positive, the company requires external cash to run. If negative, it means suppliers are financing the company\'s operational footprint (Cash Surplus).</p>
        
        <h2>2. The Virtual Profit Symptom</h2>
        <p>If you sell $100k with a 30% margin ($30k profit on your Income Statement) but offer 90-day credit terms, you have created virtual profit. You must pay taxes, sales commissions and replace inventory immediately. Your bank account goes negative despite a highly profitable operation on paper.</p>
        
        <h2>3. How to Diagnose and Reverse the Cash Squeeze</h2>
        <p>To restore financial equilibrium, the Controller must act on three fronts:</p>
        <ol>
          <li><strong>Shorten Days Sales Outstanding (DSO / PMR):</strong> Offer early-payment discounts, convert card receivables, and implement robust collections to reduce default rates.</li>
          <li><strong>Speed up Inventory Turns (DIO / PME):</strong> Avoid excess buffer stocks and clear obsolete goods to free locked cash.</li>
          <li><strong>Extend Days Payable Outstanding (DPO / PMP):</strong> Renegotiate payment terms with suppliers, using purchase volume leverage and good relationships.</li>
        </ol>
        
        <blockquote>
          <strong>Conclusion:</strong> Profitability measures economic health (operational efficiency), while liquidity measures financial health (survival capability). Balancing the cash cycle is the only way to grow sustainably.
        </blockquote>
      `
    }
  }
]

export const articles: Article[] = [...staticArticles]

// Self-running initialization to load regenerated articles from local storage on load
try {
  const dynArticles = getRegeneratedArticles()
  articles.push(...dynArticles)
} catch {
  // ignore
}

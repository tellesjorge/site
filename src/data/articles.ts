export type Article = {
  slug: string
  title: string
  date: string
  excerpt: string
  content: string // HTML string
  category: 'Controladoria' | 'FP&A' | 'Gestão de Caixa' | 'Estoques'
  readTime: string
  coverImage?: string
}

export const articles: Article[] = [
  {
    slug: 'lucro-nao-paga-boleto',
    title: 'Lucro não Paga Boleto: A Diferença Vital entre Competência e Caixa',
    date: '29 de Junho de 2026',
    excerpt: 'Entenda por que muitas empresas que apresentam lucros contábeis robustos no DRE acabam enfrentando crises de liquidez e dificuldades para honrar seus compromissos imediatos.',
    category: 'Gestão de Caixa',
    readTime: '6 min de leitura',
    content: `
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
    `
  },
  {
    slug: 'estoque-parado-custo-invisivel',
    title: 'Estoque Parado: O Custo Invisível que Trava o Crescimento da Empresa',
    date: '28 de Junho de 2026',
    excerpt: 'Mercadoria estocada além do necessário drena a liquidez corporativa. Analise os custos ocultos de armazenagem, obsolescência e o impacto direto no capital de giro.',
    category: 'Estoques',
    readTime: '5 min de leitura',
    content: `
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
    `
  },
  {
    slug: 'empresa-com-lucro-sem-caixa',
    title: 'Quando a Empresa Tem Lucro, Mas Vive Sem Caixa: Como Diagnosticar a NCG',
    date: '25 de Junho de 2026',
    excerpt: 'Entenda como a Necessidade de Capital de Giro (NCG) cresce proporcionalmente à operação e descubra os mecanismos para reverter o sufocamento financeiro.',
    category: 'Controladoria',
    readTime: '7 min de leitura',
    content: `
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
    `
  }
]

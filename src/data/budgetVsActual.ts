export const budgetVsActual = {
  items: [
    {
      label: 'Receita',
      budget: 'R$ 1.200.000',
      actual: 'R$ 1.150.000',
      variance: '-4,2%',
      status: 'atencao',
      analysis:
        'A receita ficou abaixo do orçamento. Recomenda-se avaliar volume vendido, preço médio, mix de produtos e performance comercial.',
    },
    {
      label: 'Margem',
      budget: '35,0%',
      actual: '32,8%',
      variance: '-2,2 p.p.',
      status: 'atencao',
      analysis:
        'Margem menor que o previsto requer revisão dos custos diretos e operações de pricing.',
    },
    {
      label: 'Fluxo de caixa',
      budget: 'R$ 3,500.000',
      actual: 'R$ 3,150.000',
      variance: '-10,0%',
      status: 'atencao',
      analysis:
        'Fluxo abaixo do esperado pode impactar capital de giro. Verificar recebíveis e pagamentos estratégicos.',
    },
    {
      label: 'OPEX',
      budget: 'R$ 2.600.000',
      actual: 'R$ 2.650.000',
      variance: '+1,9%',
      status: 'atencao',
      analysis:
        'Despesas operacionais levemente acima do orçamento. Atenção em custos administrativos e de TI.',
    },
  ],
}

import {readFileSync} from 'node:fs';
import {renderEditorialMarkdown} from '../../tools/editorial-markdown.mjs';
const source=readFileSync(new URL('./impacto-descontos-margem-lucro.md',import.meta.url),'utf8');
const text=source.slice(source.indexOf('Imagine a seguinte situação.')).split('## Sobre o autor')[0];
const rendered=renderEditorialMarkdown(text);
export default {
 slug:'impacto-descontos-margem-lucro',path:'/artigos/impacto-descontos-margem-lucro',
 aliases:['/blog/impacto-descontos-margem-lucro','/blog/impacto-descontos-margem-lucro/'],
 title:'O desconto que destrói seu lucro: como 5% de desconto podem consumir 25% da margem',
 seoTitle:'Impacto dos Descontos na Margem de Lucro | Jorge Telles',
 description:'Um desconto de 5% pode reduzir sua margem em 25%. Aprenda a calcular o impacto dos descontos, proteger a rentabilidade e negociar melhor.',
 primaryKeyword:'impacto do desconto na margem',
 keywords:['desconto comercial','margem de contribuição','como calcular desconto','política de descontos','formação de preços','rentabilidade das vendas','desconto e lucro','gestão comercial'],
 category:'Preços e descontos',series:'O Lucro Invisível',episode:'04',published:'2026-10-27',cover:'5% no preço. 25% na contribuição.',
 summary:'Um desconto pequeno no preço pode consumir uma parcela expressiva da contribuição. Veja como calcular o impacto e avaliar o volume necessário para compensá-lo.',
 sections:rendered.sections,
 body:'<aside class="ed-callout"><strong>Atenção às bases do cálculo</strong><p>A redução de 25% se refere à margem de contribuição em reais do primeiro exemplo, com gastos variáveis constantes por unidade. Não é uma queda de 25 pontos percentuais nem uma regra universal para o lucro líquido. Valores e alíquotas são hipotéticos.</p></aside>'+rendered.html+'<aside class="ed-callout"><strong>Volume teórico e unidades inteiras</strong><p>No exemplo de 100 unidades, a compensação teórica exige 33,33% a mais. Ao arredondar para 134 unidades inteiras, o aumento efetivo é de 34%, gerando R$ 20.100 de contribuição. O cálculo pressupõe contribuição unitária positiva, demanda e capacidade disponíveis, sem aumento dos custos fixos.</p></aside><p class="ed-disclaimer">Conteúdo educativo. Exemplos hipotéticos, sem dados de clientes ou promessa de resultado. Tratamentos contábeis, tributários e decisões comerciais devem considerar as condições reais de cada operação.</p>',
 ctaTitle:'Sua empresa conhece o custo dos descontos que concede?',
 ctaText:'Uma análise de margem de contribuição, formação de preços e políticas comerciais pode ajudar a identificar riscos e oportunidades de melhoria.',
 ctaLabel:'Conversar sobre preços e margens →',
 references:'<li><a href="https://www.sebraepr.com.br/comunidade/artigo/voce-sabe-calcular-o-valor-de-venda-de-seus-produtos-ou-servicos-2" target="_blank" rel="noopener noreferrer">Sebrae — Você sabe calcular o valor de venda de seus produtos ou serviços?</a>: leitura complementar sobre contribuição e formação de preços.</li>'
};

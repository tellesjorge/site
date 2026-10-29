import {readFileSync} from 'node:fs';
import {renderEditorialMarkdown} from '../../tools/editorial-markdown.mjs';
const source=readFileSync(new URL('./custos-invisiveis-empresas.md',import.meta.url),'utf8');
const text=source.slice(source.indexOf('Sua empresa pode estar perdendo')).split('## Sobre o autor')[0];
const rendered=renderEditorialMarkdown(text);
export default {
 slug:'custos-invisiveis-empresas',path:'/artigos/custos-invisiveis-empresas',
 aliases:['/blog/custos-invisiveis-empresas','/blog/custos-invisiveis-empresas/','/blog/custos-invisiveis-empresas/index.html'],
 title:'Custos invisíveis: como sua empresa pode estar perdendo dinheiro sem perceber',
 seoTitle:'Custos Invisíveis: Onde Sua Empresa Perde Dinheiro',
 description:'Descubra os custos invisíveis que reduzem o lucro da sua empresa. Veja exemplos, cálculos e como identificar desperdícios e melhorar resultados.',
 primaryKeyword:'custos invisíveis',
 keywords:['custos ocultos nas empresas','desperdícios operacionais','redução de custos empresariais','custo do retrabalho','custo da não qualidade','controle de despesas','eficiência operacional','rentabilidade empresarial','controladoria e gestão de custos'],
 category:'Custos e eficiência operacional',series:'O Lucro Invisível',episode:'05',published:'2026-10-28',referencesDate:'2026-10-28',
 cover:'Pequenas perdas. Grandes impactos.',
 summary:'Fretes extras, retrabalho e perdas recorrentes podem consumir o resultado sem aparecer de forma clara nos relatórios. Aprenda a medir as causas e priorizar melhorias.',
 sections:rendered.sections,
 body:'<aside class="ed-callout"><strong>Desperdício, capacidade e caixa não são a mesma coisa</strong><p>Os valores são hipotéticos. Evite somar duas vezes a mesma ocorrência: se uma hora extra já integra o custo do retrabalho, ela não deve ser novamente incluída em outra categoria. O exemplo mensal e o cálculo detalhado de retrabalho são situações independentes.</p></aside>'+rendered.html+'<aside class="ed-callout"><strong>Exemplo complementar: da oportunidade ao ganho efetivo</strong><p>Uma empresa identifica R$ 10.000 mensais de gastos potencialmente evitáveis. Um projeto reduz efetivamente 40% desse valor: R$ 4.000 por mês. Se o novo controle custa R$ 1.000 por mês, a melhoria recorrente é de R$ 3.000 mensais, ou R$ 36.000 em doze meses completos, antes dos efeitos tributários.</p><p>Com um desembolso inicial adicional de R$ 6.000 para implantação, o saldo acumulado do primeiro ano seria R$ 30.000. A recuperação simples desse investimento seria de dois meses (R$ 6.000 ÷ R$ 3.000), supondo ganhos imediatos e constantes. A classificação contábil do investimento depende de sua natureza; esse cálculo gerencial não é uma previsão de lucro líquido nem uma garantia de economia.</p></aside><p class="ed-disclaimer">Conteúdo educativo, sem dados de clientes ou promessa de resultado. Diagnósticos e decisões devem considerar demanda, qualidade, capacidade, custos de implantação e condições reais da operação.</p>',
 ctaTitle:'Sua empresa sabe onde os custos invisíveis estão concentrados?',
 ctaText:'Uma análise integrada de processos, indicadores, custos e resultados pode ajudar a identificar desperdícios e priorizar oportunidades de melhoria.',
 ctaLabel:'Conversar sobre custos e eficiência →',
 references:'<li><a href="https://asq.org/quality-resources/cost-of-quality" target="_blank" rel="noopener noreferrer">ASQ — Cost of Quality</a>: prevenção, avaliação e custos de falhas internas e externas.</li><li><a href="/artigos/estoque-parado-capital-de-giro">O Lucro Invisível — Episódio 02: estoque e capital de giro</a>.</li><li><a href="/artigos/empresa-vende-muito-e-lucra-pouco">O Lucro Invisível — Episódio 03: margem e rentabilidade</a>.</li>',
};

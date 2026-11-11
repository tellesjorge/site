import {readFileSync} from 'node:fs';
import {renderEditorialMarkdown} from '../../tools/editorial-markdown.mjs';
const source=readFileSync(new URL('./tendencias-gestao-financeira-2027.md',import.meta.url),'utf8');
const title=source.split('\n')[0].replace(/^# /,'').trim();
const body=source.slice(source.indexOf('O ano de 2027')).split('## Sobre o autor')[0];
const rendered=renderEditorialMarkdown(body);
export default {
 slug:'tendencias-gestao-financeira-2027',path:'/tendencias-gestao-financeira-2027',aliases:[],title,
 seoTitle:'10 Tendências de Gestão Financeira para 2027',
 description:'Descubra as 10 tendências de gestão financeira para 2027 e como IA, controladoria, fluxo de caixa e reforma tributária impactarão as empresas.',
 primaryKeyword:'tendências de gestão financeira 2027',keywords:[],
 category:'Gestão Financeira e Controladoria',published:'2026-11-03',referencesDate:'2026-11-03',minutes:'12–15',
 cover:'Gestão financeira em 2027',summary:'Dez tendências e um plano de ação de 90 dias para preparar a gestão financeira da sua empresa.',
 sections:rendered.sections,body:rendered.html,
 ctaTitle:'Como preparar sua gestão financeira para 2027?',
 ctaText:'Um diagnóstico dos processos, indicadores e riscos ajuda a definir por onde começar.',
 ctaLabel:'Conversar sobre gestão financeira →',
 references:'<li><a href="https://www.deloitte.com/us/en/what-we-do/capabilities/finance-transformation/articles/cfo-survey-finance-trends-report.html">Deloitte — Finance Trends 2027</a></li><li><a href="https://www.pwc.com/us/en/services/consulting/finance-accounting-transformation/library/future-of-finance.html">PwC — Future of Finance</a></li><li><a href="https://www.gov.br/receitafederal/pt-br/acesso-a-informacao/acoes-e-programas/reforma-tributaria-do-consumo/entenda/entenda-a-reforma-tributaria-do-consumo/">Receita Federal — Reforma Tributária do Consumo</a></li>',
};

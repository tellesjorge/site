import {readFileSync} from 'node:fs';
import {renderEditorialMarkdown} from '../../tools/editorial-markdown.mjs';
const source=readFileSync(new URL('./mei-mudancas-2026-2027-2028.md',import.meta.url),'utf8');
const rendered=renderEditorialMarkdown(source.slice(source.indexOf('\n')+1));
export default {
 slug:'mei-mudancas-2026-2027-2028',title:'MEI em 2026, 2027 e 2028: novos limites e como preparar seu negócio',
 seoTitle:'MEI: o que muda em 2026, 2027 e 2028',
 description:'Entenda os novos limites do MEI para 2027 e 2028, a contratação de empregados, o perdão de dívidas e os cuidados para crescer com segurança.',
 primaryKeyword:'mudanças MEI 2027',keywords:['limite MEI 2028','faturamento MEI','DAS','gestão financeira'],
 category:'MEI e Gestão Financeira',published:'2026-11-12',referencesDate:'2026-11-12',
 cover:'MEI: planeje o crescimento',summary:'Novos limites, contratação, remissão de dívidas e os cuidados financeiros para preparar seu negócio.',
 sections:rendered.sections,body:rendered.html,
 ctaTitle:'Como preparar seu negócio para crescer?',ctaText:'Organize os números e planeje os próximos passos com a consultoria de gestão financeira e rentabilidade de Jorge Telles.',ctaLabel:'Conversar sobre meu negócio →',
 references:'<li><a href="https://www2.camara.leg.br/legin/fed/leicom/2026/leicomplementar-238-21-outubro-2026-800071-publicacaooriginal-181678-pl.html">LC nº 238/2026 — limites, empregados, remissão e produção de efeitos</a></li><li><a href="https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp123.htm">LC nº 123/2006 — regime do MEI, arts. 18-A e 18-C</a></li><li><a href="https://legis.senado.gov.br/norma/40180341/publicacao/40181135">LC nº 214/2025 — Anexo XXIII, valores fixos do MEI</a></li><li><a href="https://www.gov.br/pgfn/pt-br/servicos/perguntas-frequentes/perguntas-frequentes-perdao-do-mei">PGFN — remissão e Portaria Conjunta RFB/PGFN nº 740/2026</a></li><li><a href="https://www.gov.br/memp/pt-br/prospera-mei/teto-do-mei">Ministério do Empreendedorismo — Teto do MEI</a></li>'
};

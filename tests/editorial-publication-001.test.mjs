import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {toPublicArticle,assertUniqueEditorialPaths} from '../tools/editorial-contract.mjs';
const manifest=JSON.parse(readFileSync(new URL('../content/articles/quanto-custa-contratar-equipe-capacidade-caixa-pme.json',import.meta.url),'utf8'));
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
test('approved article renders exact financial example, cover and metadata',()=>{
 const article=toPublicArticle(manifest),html=read('dist/artigos/'+article.slug+'/index.html');
 assert.equal((html.match(/<h1>/g)||[]).length,1);
 for(const value of ['R$ 60.000','840','R$ 71,43','680','R$ 88,24','não alíquotas legais','Referências de discussão'])assert.ok(html.includes(value),value);
 assert.ok(html.includes(manifest.cover_path));assert.ok(html.includes(manifest.content_hash));
 assert.ok(html.includes('Artigo independente'));assert.ok(!html.includes('Artigo independente · EPISÓDIO'));
 assert.ok(html.includes('rel="canonical" href="https://www.jorgetelles.com.br/artigos/'+article.slug+'"'));
 assert.equal((html.match(/<table>/g)||[]).length,2);
 assert.ok(existsSync(new URL('../dist'+manifest.cover_path,import.meta.url)));
 assert.throws(()=>assertUniqueEditorialPaths([article,article]));
});
test('catalog preserves seven prior articles and adds only approved article',()=>{
 const library=read('dist/artigos/index.html');assert.ok(library.includes('8 artigos publicados'));
 for(const path of ['/tendencias-gestao-financeira-2027','/artigos/ponto-de-equilibrio-empresa','/artigos/custos-invisiveis-empresas','/artigos/impacto-descontos-margem-lucro','/artigos/empresa-vende-muito-e-lucra-pouco','/artigos/estoque-parado-capital-de-giro','/artigos/lucro-sem-dinheiro-em-caixa/'])assert.ok(library.includes('href="'+path+'"'),path);
 for(let i=1;i<=6;i++)assert.ok(existsSync(new URL('../dist/static/editorial/artigo-001-instagram-v1/slide-0'+i+'.png',import.meta.url)));
});

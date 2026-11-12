import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import article from '../content/articles/mei-mudancas-2026-2027-2028.mjs';
test('MEI article is independent, dated and legally sourced',()=>{
 assert.equal(article.series,undefined);
 assert.equal(article.published,'2026-11-12');
 for(const text of ['81.000','110.000','140.000','Fundamentos legais','não amplia retroativamente','PGFN'])assert.ok(article.body.includes(text),text);
 assert.ok(article.references.includes('camara.leg.br'));
});
test('MEI generated page and sitemap include canonical article',()=>{
 const path='/artigos/mei-mudancas-2026-2027-2028/';
 const html=readFileSync(new URL('../public'+path+'index.html',import.meta.url),'utf8');
 assert.ok(html.includes('rel="canonical" href="https://www.jorgetelles.com.br'+path+'"'));
 assert.ok(readFileSync(new URL('../public/sitemap-editorial.xml',import.meta.url),'utf8').includes(path));
 assert.ok(html.includes('Fundamentos legais e fontes oficiais'));
 assert.ok(html.includes('BlogPosting'));
 assert.ok(!html.includes('isPartOf'));
});

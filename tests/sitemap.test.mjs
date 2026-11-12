import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
const root=new URL('../public/',import.meta.url);
const read=name=>readFileSync(new URL(name,root),'utf8');
const locations=xml=>[...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match=>match[1]);
test('principal sitemap discovers institutional and automatically generated editorial maps',()=>{
 const xml=read('sitemap.xml');
 assert.match(xml,/<sitemapindex xmlns="http:\/\/www.sitemaps.org\/schemas\/sitemap\/0.9">/);
 assert.deepEqual(locations(xml),['https://www.jorgetelles.com.br/sitemap-pages.xml','https://www.jorgetelles.com.br/sitemap-editorial.xml']);
 for(const url of locations(xml))assert.ok(existsSync(new URL(new URL(url).pathname.slice(1),root)));
});
test('maps advertise only current public URLs, without private endpoints or legacy articles',()=>{
 const urls=['sitemap-pages.xml','sitemap-editorial.xml'].flatMap(name=>locations(read(name)));
 assert.equal(new Set(urls).size,urls.length);
 for(const value of urls){const url=new URL(value);assert.equal(url.origin,'https://www.jorgetelles.com.br');assert.equal(url.search,'');assert.equal(url.hash,'');
  assert.doesNotMatch(url.pathname,/^\/(?:api|login|cadastro|apresentacao|app|sistema-em-breve)(?:\/|$)/);
  assert.doesNotMatch(url.pathname,/lucro-nao-paga-boleto|estoque-parado-custo-invisivel|empresa-com-lucro-sem-caixa/);
 }
 assert.ok(urls.includes('https://www.jorgetelles.com.br/privacidade/'));
});
test('robots advertises canonical sitemap and permits crawling public pages',()=>{
 const robots=read('robots.txt');assert.match(robots,/User-agent: \*\s+Allow: \//);
 assert.deepEqual(robots.split(/\r?\n/).filter(line=>line.startsWith('Sitemap:')),['Sitemap: https://www.jorgetelles.com.br/sitemap.xml']);
});

import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {Script} from 'node:vm';
import article from '../content/articles/lucro-sem-dinheiro-em-caixa.mjs';
const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');

test('article is complete, indexable and attributed to the actual author',()=>{
 const html=read('public/artigos/'+article.slug+'/index.html');
 assert.equal((html.match(/<h1>/g)||[]).length,1);assert.ok(html.includes(article.title));
 const structured=JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
 assert.equal(structured.author.name,'Jorge Telles');assert.equal(structured.datePublished,'2026-10-27');
 assert.equal(structured.mainEntityOfPage,'https://www.jorgetelles.com.br/artigos/'+article.slug+'/');
 for(const [id]of article.sections){assert.ok(html.includes('id="'+id+'"'));assert.ok(html.includes('href="#'+id+'"'));}
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(match=>match[1]);assert.equal(new Set(ids).size,ids.length);
 assert.ok(html.includes('hipotéticos'));assert.ok(html.includes('CPC 03'));assert.ok(html.includes('16 min de leitura'));
});

test('educational financial examples reconcile in reais and days',()=>{
 const profit=100000-60000-25000-5000,operatingCash=profit+3000-20000-8000+5000;
 assert.equal(profit,10000);assert.equal(operatingCash,-10000);assert.equal(25000+operatingCash-12000-10000,-7000);
 const before=100000/30*60+60000/30*45-60000/30*30,after=100000/30*45+60000/30*30-60000/30*40;
 assert.equal(before,230000);assert.equal(after,130000);assert.equal(before-after,100000);
 assert.equal(45+60-30,75);assert.equal(30+45-40,35);
 assert.equal(130000/30*60+78000/30*45-78000/30*30,299000);
 for(const value of ['R$ 230.000','R$ 130.000','R$ 100.000','R$ 299.000','R$ 69.000','− R$ 7.000'])assert.ok(article.body.includes(value));
});

test('new library and homepage links preserve active client access',()=>{
 const home=read('index.html'),library=read('public/artigos/index.html'),redirects=read('public/_redirects');
 assert.ok(home.includes('href="/artigos/"'));assert.ok(home.includes('/artigos/'+article.slug+'/'));
 assert.ok(home.includes('https://app.jorgetelles.com.br/login'));assert.ok(redirects.includes('/login https://app.jorgetelles.com.br/login 302'));
 assert.ok(library.includes('1 artigo publicado'));assert.ok(!library.includes('IA Regenerativo'));assert.ok(!library.includes('API de feeds'));
 assert.ok(read('public/sitemap-editorial.xml').includes('/artigos/'+article.slug+'/'));
 assert.ok(read('public/robots.txt').includes('sitemap-editorial.xml'));
});

test('editorial behavior adds no trackers or persistent visitor storage',()=>{
 const script=read('public/static/jorge-telles-editorial.js');new Script(script);
 assert.doesNotMatch(script,/localStorage|sessionStorage|document\.cookie|gtag\(|fetch\(/);
 assert.ok(script.includes('navigator.share'));assert.ok(script.includes('window.print'));
});

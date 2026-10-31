import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import article from '../content/articles/ponto-de-equilibrio-empresa.mjs';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const script=read('public/static/jorge-telles-break-even.js'),context={};runInNewContext(script,context);
const calc=context.calculateBreakEven;
test('break-even calculator reconciles examples, losses, zero sales and zero margin',()=>{
 const r=calc(80000,20,500000);assert.equal(r.point,400000);assert.equal(r.result,20000);assert.equal(r.safety,20);
 assert.equal(calc(80000,20,300000).result,-20000);assert.equal(calc(80000,20,400000).safety,0);
 assert.equal(calc(80000,16,500000).point,500000);assert.equal(calc(120000,24,500000).point,500000);
 assert.equal(calc(80000,0,500000).point,null);assert.equal(calc(80000,20,0).safety,null);
 assert.equal(calc(0,20,500000).safety,100);
 for(const values of [[-1,20,10],[1,101,10],[1,20,-1],[NaN,20,1],[1,Infinity,1],[1e10,20,1]])assert.throws(()=>calc(...values));
 assert.ok(!/fetch\(|localStorage|sessionStorage|sendBeacon|innerHTML/.test(script));
});
test('episode 06 has complete original content, SEO, local calculator and article redirects',()=>{
 const html=read('public'+article.path+'/index.html');assert.equal(article.sections.length,15);
 assert.ok(html.includes('<title>'+article.seoTitle+'</title>'));assert.ok(html.includes('content="'+article.description+'"'));
 assert.ok(html.includes('rel="canonical" href="https://www.jorgetelles.com.br'+article.path+'"'));
 for(const phrase of ['R$ 425.000','R$ 550.000','R$ 600.000','24%','Calculadora de ponto de equilíbrio','be-copy','be-form'])assert.ok(html.includes(phrase),phrase);
 assert.equal((html.match(/<h1>/g)||[]).length,1);assert.ok(!html.includes('<iframe'));
 for(const [id]of article.sections){assert.ok(html.includes('id="'+id+'"'));assert.ok(html.includes('href="#'+id+'"'))}
 for(const alias of article.aliases)assert.ok(read('public/_redirects').includes(alias+' '+article.path+' 301'));
 assert.ok(read('index.html').includes(article.path));assert.ok(read('public/sitemap-editorial.xml').includes(article.path));
});

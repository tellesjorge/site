import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {Script} from 'node:vm';
import article from '../content/articles/lucro-sem-dinheiro-em-caixa.mjs';
import stock from '../content/articles/estoque-parado-consome-caixa.mjs';
import margin from '../content/articles/vende-muito-lucra-pouco.mjs';
import discount from '../content/articles/impacto-descontos-margem-lucro.mjs';
import {renderEditorialMarkdown} from '../tools/editorial-markdown.mjs';
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
 assert.ok(home.includes('href="/artigos/"'));assert.ok(home.includes(margin.path));assert.ok(library.includes('/artigos/'+article.slug+'/'));
 assert.ok(home.includes('https://app.jorgetelles.com.br/login'));assert.ok(redirects.includes('/login https://app.jorgetelles.com.br/login 302'));
 assert.ok(home.includes('href="/perfil?origem=site"'));assert.ok(redirects.includes('/perfil /app 200'));assert.ok(!redirects.includes('/perfil /app.html'));
 assert.ok(library.includes('4 artigos publicados'));assert.ok(!library.includes('IA Regenerativo'));assert.ok(!library.includes('API de feeds'));
 assert.ok(read('public/sitemap-editorial.xml').includes('/artigos/'+article.slug+'/'));
 assert.ok(read('public/robots.txt').includes('sitemap-editorial.xml'));
});

test('stock article has correct metadata, section links, examples and contextual references',()=>{
 const html=read('public'+stock.path+'/index.html');
 assert.ok(html.includes(stock.title));assert.equal((html.match(/<h1>/g)||[]).length,1);
 const data=JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
 assert.equal(data.headline,stock.title);assert.equal(data.author.name,'Jorge Telles');
 for(const [id]of stock.sections){assert.ok(html.includes('id="'+id+'"'));assert.ok(html.includes('href="#'+id+'"'));}
 assert.ok(html.includes('CPC 16'));assert.ok(html.includes(stock.ctaTitle));assert.ok(!html.includes('CPC 03 (R2)'));
 assert.equal(900000/300000*30,90);assert.equal(300000*60/30,600000);assert.equal(900000-600000,300000);
 assert.equal(3600000/900000,4);assert.equal(Math.round(365/4),91);
 assert.equal(400000+250000+150000+120000+80000,1000000);assert.equal(150000+120000+80000,350000);
 assert.equal(1000*100-1000*90,10000);assert.equal((45000-5000)*.02*10,8000);assert.equal((45000-5000)*.03*10,12000);
 assert.ok(html.includes('R$ 8.000'));assert.ok(html.includes('R$ 12 mil'));assert.ok(html.includes('R$ 16 mil'));
 assert.ok(html.includes('/artigos/'+article.slug+'/'));assert.ok(read('public/artigos/'+article.slug+'/index.html').includes(stock.path));
 assert.ok(read('public/artigos/index.html').indexOf(stock.title)<read('public/artigos/index.html').indexOf(article.title));
 assert.ok(read('public/sitemap-editorial.xml').includes(stock.path));
 assert.ok(html.includes('<title>'+stock.seoTitle+'</title>'));assert.ok(html.includes('<meta name="description" content="'+stock.description+'">'));
 assert.equal(data.mainEntityOfPage,'https://www.jorgetelles.com.br'+stock.path);
 assert.deepEqual(data.keywords,[stock.primaryKeyword,...stock.keywords]);
 assert.ok(html.includes('rel="canonical" href="https://www.jorgetelles.com.br'+stock.path+'"'));
 assert.ok(read('public/_redirects').includes('/artigos/'+stock.slug+'/ '+stock.path+' 301'));
});

test('editorial behavior adds no trackers or persistent visitor storage',()=>{
 const script=read('public/static/jorge-telles-editorial.js');new Script(script);
 assert.doesNotMatch(script,/localStorage|sessionStorage|document\.cookie|gtag\(|fetch\(/);
 assert.ok(script.includes('navigator.share'));assert.ok(script.includes('window.print'));
});

test('episode 03 is complete and its contribution examples reconcile',()=>{
 const html=read('public'+margin.path+'/index.html');
 assert.equal((html.match(/<h1>/g)||[]).length,1);assert.ok(html.includes(margin.title));
 assert.ok(html.includes('<title>'+margin.seoTitle+'</title>'));
 for(const [id]of margin.sections){assert.ok(html.includes('id="'+id+'"'));assert.ok(html.includes('href="#'+id+'"'));}
 const data=JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
 assert.equal(data.mainEntityOfPage,'https://www.jorgetelles.com.br'+margin.path);
 assert.ok(html.includes('<meta name="description" content="'+margin.description+'">'));
 assert.deepEqual(data.keywords,[margin.primaryKeyword,...margin.keywords]);
 for(const alias of margin.aliases)assert.ok(read('public/_redirects').includes(alias+' '+margin.path+' 301'));
 assert.equal(1000000-100000-600000-50000-180000,70000);
 assert.equal(1000000-100000-700000-70000-180000,-50000);
 assert.equal(150000*.30+50000*.08,49000);assert.equal(100000*.30+150000*.08,42000);
 assert.equal(95-80,15);assert.equal(95-60-95*.20,16);assert.equal(80000/.20,400000);
 assert.ok(html.includes('R$ 49.000'));assert.ok(html.includes('R$ 42.000'));assert.ok(html.includes('15,79%'));
 assert.ok(read('public/sitemap-editorial.xml').includes(margin.path));
 const library=read('public/artigos/index.html');assert.ok(library.indexOf(margin.title)<library.indexOf(stock.title));
});

test('all four articles use artigos and discount examples and SEO are correct',()=>{
 for(const item of [article,stock,margin,discount])assert.ok((item.path||'/artigos/'+item.slug+'/').startsWith('/artigos/'));
 const html=read('public'+discount.path+'/index.html');
 assert.equal((html.match(/<h1>/g)||[]).length,1);assert.ok(html.includes('<title>'+discount.seoTitle+'</title>'));
 assert.ok(html.includes('<meta name="description" content="'+discount.description+'">'));
 assert.equal(discount.sections.length,13);for(const [id]of discount.sections)assert.ok(html.includes('href="#'+id+'"'));
 assert.equal((200-150)/200,0.25);assert.equal(950-650-95-47.5,157.5);assert.equal((200-157.5)/200,.2125);
 assert.equal(Math.ceil(20000/150),134);assert.equal(134*150,20100);
 assert.ok(html.includes('21,25%'));assert.ok(html.includes('R$ 157,50'));assert.ok(html.includes('34%'));
 assert.ok(!read('public/sitemap-editorial.xml').includes('/blog/'));
 const redirects=read('public/_redirects');for(const item of [stock,margin,discount])for(const alias of item.aliases)assert.ok(redirects.includes(alias+' '+item.path+' 301'));
 assert.ok(!redirects.includes(discount.path+' '+discount.path+' 301'));
 assert.ok(renderEditorialMarkdown('<script>alert(1)</script>').html.includes('&lt;script&gt;'));
 assert.ok(read('index.html').includes(discount.path));
});

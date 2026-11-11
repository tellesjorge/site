import {toPublicArticle,assertUniqueEditorialPaths} from './editorial-contract.mjs';
import {createEditorialRenderer} from './editorial-template.mjs';
import {readFile,writeFile,mkdir,readdir} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {meiBody} from '../content/mei.mjs';
import {privacyBody} from '../content/privacy.mjs';
const root=new URL('../',import.meta.url),origin='https://www.jorgetelles.com.br';
const escape=value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const files=(await readdir(new URL('content/articles/',root))).filter(name=>name.endsWith('.mjs')||name.endsWith('.json'));
const articles=await Promise.all(files.map(async file=>file.endsWith('.json')?toPublicArticle(JSON.parse(await readFile(new URL('content/articles/'+file,root),'utf8'))):(await import(new URL('content/articles/'+file,root))).default));
assertUniqueEditorialPaths(articles);
articles.sort((a,b)=>b.published.localeCompare(a.published)||(b.episode??'').localeCompare(a.episode??''));
for(const article of articles){if(!/^[a-z0-9-]+$/.test(article.slug)||!/^\d{4}-\d{2}-\d{2}$/.test(article.published))throw Error('Invalid article metadata');article.minutes??=Math.max(1,Math.ceil(article.body.replace(/<[^>]*>/g,' ').split(/\s+/).filter(Boolean).length/200));}
let homepage=await readFile(new URL('index.html',root),'utf8');
if(!homepage.includes('jorge-telles-privacy.js'))homepage=homepage.replace('</head>','<link rel="stylesheet" href="/static/jorge-telles-privacy.css"></head>').replace('</body>','<script src="/static/jorge-telles-privacy.js" defer></script></body>');
if(!homepage.includes('data-privacy-manage'))homepage=homepage.replace('</footer>','<div class="jt-container" style="padding-bottom:24px"><a href="/privacidade/">Privacidade e uso de dados</a> · <button type="button" data-privacy-manage>Gerenciar privacidade</button></div></footer>');
const header=homepage.match(/<header\b[\s\S]*?<\/header>/)[0].replaceAll('href="#','href="/#');
const footer=homepage.match(/<footer\b[\s\S]*?<\/footer>/)[0].replaceAll('href="#','href="/#');
const formatDate=value=>new Intl.DateTimeFormat('pt-BR',{dateStyle:'long',timeZone:'America/Sao_Paulo'}).format(new Date(value+'T12:00:00Z'));
const pathFor=article=>article.path||'/artigos/'+article.slug+'/';
const redirectsPath=new URL('public/_redirects',root),redirects=await readFile(redirectsPath,'utf8');
const marker=/# BEGIN EDITORIAL ROUTES[\s\S]*?# END EDITORIAL ROUTES/;
if(!marker.test(redirects))throw Error('Missing editorial routing markers');
const routes=['# Published articles use native Pages directory/index.html routing.'];
for(const article of articles){if(article.path){if(article.path!=='/'+article.slug&&!/^\/artigos\/[a-z0-9-]+$/.test(article.path))throw Error('Invalid article path');if(article.path!=='/artigos/'+article.slug)for(const old of ['/artigos/'+article.slug,'/artigos/'+article.slug+'/','/artigos/'+article.slug+'/index.html'])routes.push(old+' '+article.path+' 301');}}
for(const article of articles){for(const alias of article.aliases||[]){if(!/^\/(?:blog|artigos)\/[a-z0-9-]+(?:\/|\/index\.html)?$/.test(alias)||alias===pathFor(article))throw Error('Invalid article alias');routes.push(alias+' '+pathFor(article)+' 301');}}
await writeFile(redirectsPath,redirects.replace(marker,'# BEGIN EDITORIAL ROUTES\n'+routes.join('\n')+'\n# END EDITORIAL ROUTES'));
const {shell,renderArticle}=createEditorialRenderer({homepage,origin});
const meiDirectory=new URL('public/mei/',root);await mkdir(meiDirectory,{recursive:true});
await writeFile(new URL('index.html',meiDirectory),shell({title:'Espaço MEI — orientações e acessos úteis',description:'Área MEI de Jorge Telles: primeiros passos, organização da rotina e acessos oficiais, separada dos artigos de controladoria e gestão financeira.',path:'/mei/',body:meiBody}));
const privacyDirectory=new URL('public/privacidade/',root);await mkdir(privacyDirectory,{recursive:true});
await writeFile(new URL('index.html',privacyDirectory),shell({title:'Privacidade e uso de dados',description:'Aviso de privacidade do site Jorge Telles, armazenamento, finalidades e canal para solicitações dos titulares.',path:'/privacidade/',body:privacyBody}));
function card(article){return `<article class="ed-story" data-story data-search="${escape([article.title,article.description,article.series,article.category].join(' '))}"><div class="ed-story-art" aria-hidden="true"><span>${escape(article.series||'Artigo independente')}</span><strong>${article.cover?escape(article.cover):'Lucro<br>não é caixa.'}</strong><small>${article.episode?'EPISÓDIO '+escape(article.episode):'GESTÃO FINANCEIRA'}</small></div><div class="ed-story-copy"><p class="ed-kicker">${escape(article.category)}${article.series?' · '+escape(article.series):''}</p><h2><a href="${pathFor(article)}">${escape(article.title)}</a></h2><p>${escape(article.summary)}</p><div class="ed-meta"><span>Por Jorge Telles</span><span>${article.minutes} min de leitura</span></div><a class="jt-inline-link" href="${pathFor(article)}">Ler artigo completo →</a></div></article>`;}
const library=`<section class="ed-hero"><div class="jt-container"><nav class="ed-breadcrumb" aria-label="Caminho da página"><a href="/">Início</a><span aria-hidden="true">/</span><span>Artigos</span></nav><p class="ed-kicker">IDEIAS QUE AJUDAM A DECIDIR</p><h1>Conhecimento financeiro.<br><em>Aplicação no seu negócio.</em></h1><p class="ed-standfirst">Artigos aprofundados de controladoria e gestão financeira, com exemplos, números e perguntas para levar à rotina da sua empresa.</p><div class="ed-series-note"><strong>O Lucro Invisível</strong><span>Uma série de Jorge Telles sobre o que os números revelam — e o que uma leitura isolada pode esconder.</span></div></div></section><section class="jt-container ed-library"><div class="ed-library-heading"><div><p class="ed-kicker">LEITURAS PUBLICADAS</p><h2>Artigos para ir além do saldo bancário.</h2></div><div class="ed-search"><label for="ed-search">Buscar nos artigos</label><input id="ed-search" type="search" placeholder="Tema, palavra ou série" autocomplete="off" maxlength="160"></div></div><p id="ed-result-count" class="ed-meta" role="status" aria-live="polite">${articles.length} ${articles.length===1?'artigo publicado':'artigos publicados'}</p><div class="ed-stories">${articles.map(card).join('')}</div><p id="ed-empty" class="ed-empty" hidden>Nenhum artigo encontrado. Experimente outra palavra.</p><aside class="ed-next"><p class="ed-kicker">A SÉRIE CONTINUA</p><h2>Estoque, preços, margens e custos.</h2><p>Novos temas serão incluídos conforme os artigos forem publicados. Enquanto isso, comece pelo primeiro episódio e conheça os exemplos completos.</p></aside></section>`;
const output=new URL('public/artigos/',root);await mkdir(output,{recursive:true});await writeFile(new URL('index.html',output),shell({title:'Artigos de controladoria e gestão financeira',description:'Artigos de Jorge Telles sobre lucro, fluxo de caixa, capital de giro e decisões de gestão. Conheça a série O Lucro Invisível.',path:'/artigos/',body:library}));
const homeFeature='<section id="artigos" class="jt-container ed-home-feature" aria-labelledby="ed-home-title"><div class="jt-section-top"><div><p class="jt-eyebrow">CONHECIMENTO PARA A SUA GESTÃO</p><h2 id="ed-home-title">Artigos para enxergar<br> além dos números.</h2></div><p>Conceitos de controladoria e gestão financeira com exemplos práticos para decisões mais conscientes.</p></div><div class="ed-stories">'+articles.slice(0,3).map(card).join('')+'</div><p style="margin-top:24px"><a class="jt-inline-link" href="/artigos/">Conhecer todos os artigos →</a></p></section>';
if(!/<section id="artigos"[\s\S]*?<\/section>/.test(homepage))throw Error('Missing homepage editorial section');
await writeFile(new URL('index.html',root),homepage.replace(/<section id="artigos"[\s\S]*?<\/section>/,homeFeature).replaceAll('href="/perfil"','href="/perfil?origem=site"').replaceAll('href="/contato?interest=','href="/contato?origem=site&amp;interest=').replaceAll('href="/contato"','href="/contato?origem=site"'));
await writeFile(new URL('public/sitemap-editorial.xml',root),'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n<url><loc>'+origin+'/mei/</loc></url>\n<url><loc>'+origin+'/artigos/</loc></url>\n'+articles.map(article=>'<url><loc>'+origin+pathFor(article)+'</loc><lastmod>'+article.published+'</lastmod></url>').join('\n')+'\n</urlset>\n');
for(const article of articles){
 const directory=new URL('public'+pathFor(article).replace(/\/$/,'')+'/',root);
 await mkdir(directory,{recursive:true});
 await writeFile(new URL('index.html',directory),renderArticle(article,articles));
}

console.log('Editorial: '+articles.length+' artigo(s) gerado(s) em '+fileURLToPath(output));

import {renderEditorialMarkdown} from './editorial-markdown.mjs';
export const EDITORIAL_PIPELINE_VERSION=1;
const escape=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export async function sha256(value){const bytes=typeof value==='string'?new TextEncoder().encode(value):value;return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes)),b=>b.toString(16).padStart(2,'0')).join('');}
export function validateEditorialArticle(d){
 if(!d||!/^[a-z0-9][a-z0-9-]{0,119}$/.test(d.slug))throw Error('Slug editorial inválido.');
 for(const [field,max] of [['title',300],['body',45000],['seo_title',150],['description',300],['image_alt',500]])if(typeof d[field]!=='string'||!d[field].trim()||d[field].length>max)throw Error('Campo editorial obrigatório: '+field);
 if(!Array.isArray(d.keywords)||!d.keywords.length||d.keywords.length>30||d.keywords.some(v=>typeof v!=='string'||v.length>120))throw Error('Palavras-chave inválidas.');
 if(!Array.isArray(d.sources)||!d.sources.length||d.sources.length>50)throw Error('Fontes obrigatórias.');
 for(const source of d.sources){const u=new URL(source.url);if(u.protocol!=='https:'||u.username||u.password||typeof source.title!=='string'||!source.title.trim())throw Error('Fonte inválida.');}
 if(!Array.isArray(d.internal_links)||d.internal_links.some(value=>{const u=new URL(value);return u.protocol!=='https:'||!['www.jorgetelles.com.br','jorgetelles.com.br'].includes(u.hostname)||u.username||u.password}))throw Error('Links internos inválidos.');
 if(!/^\/intelligence-media\/[-a-zA-Z0-9_.]+$/.test(d.image))throw Error('Capa protegida obrigatória.');
 renderEditorialMarkdown(d.body);
 return d;
}
export function toPublicArticle({article,content_hash,cover_path,published}){
 validateEditorialArticle(article);
 if(!/^[a-f0-9]{64}$/.test(content_hash)||!/^\/static\/editorial\/[a-f0-9]{64}\.(png|jpg|webp)$/.test(cover_path)||!/^\d{4}-\d{2}-\d{2}$/.test(published))throw Error('Manifesto editorial inválido.');
 const {html,sections}=renderEditorialMarkdown(article.body);
 return {slug:article.slug,path:'/artigos/'+article.slug,title:article.title,seoTitle:article.seo_title,description:article.description,summary:article.description,primaryKeyword:article.keywords[0],keywords:article.keywords,category:article.category||'Controladoria e Gestão Financeira',published,minutes:Math.max(1,Math.ceil(article.body.split(/\s+/).length/200)),body:html,sections,coverImage:cover_path,coverAlt:article.image_alt,contentHash:content_hash,references:article.sources.map(s=>'<li><a href="'+escape(s.url)+'" target="_blank" rel="noopener noreferrer">'+escape(s.title)+'</a></li>').join(''),referencesDate:published,internalLinks:article.internal_links};
}
export function publicEditorialManifest(manifest){
 // The public repository receives only fields shown in the editorial review, never workflow/private metadata.
 const allowed=['title','slug','body','image_alt','seo_title','description','keywords','internal_links','sources','category','test_record'];
 const article=Object.fromEntries(allowed.filter(key=>manifest.article[key]!==undefined).map(key=>[key,manifest.article[key]]));
 article.image='/intelligence-media/'+manifest.cover_path.split('/').pop();
 const result={article,content_hash:manifest.content_hash,cover_path:manifest.cover_path,published:manifest.published};
 toPublicArticle(result);
 return result;
}
export function assertUniqueEditorialPaths(articles){
 const paths=new Map(),slugs=new Set(),normalize=value=>value.replace(/\/+$/,'');
 for(const article of articles){const path=normalize(article.path||'/artigos/'+article.slug);if(paths.has(path)||slugs.has(article.slug))throw Error('Duplicate editorial path or slug: '+path);paths.set(path,article.slug);slugs.add(article.slug);}
 for(const article of articles)for(const alias of article.aliases||[]){const owner=paths.get(normalize(alias));if(owner&&owner!==article.slug)throw Error('Editorial alias conflicts with another article: '+alias);}
}

import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
test('MEI and Articles are separate sections across static and React headers',()=>{
 for(const path of ['index.html','public/artigos/index.html','public/privacidade/index.html','public/mei/index.html']){const html=read(path),header=html.match(/<header\b[\s\S]*?<\/header>/)[0];for(const part of ['jt-resources','Conteúdos','Espaço MEI','Biblioteca de artigos','/mei/','/artigos/'])assert.ok(header.includes(part),path+': '+part);assert.ok(html.includes('jorge-telles-navigation.js'));assert.ok(html.includes('jorge-telles-resources.css'));assert.ok(header.includes('Sou cliente'))}
 const react=read('src/components/layout/CommercialChrome.tsx');assert.ok(react.includes('jtInitializeNavigation'));assert.ok(react.includes('Espaço MEI'));assert.ok(react.includes('Biblioteca de artigos'));
 const mei=read('public/mei/index.html');assert.ok(mei.includes('rel="canonical" href="https://www.jorgetelles.com.br/mei/"'));assert.ok(mei.includes('www.gov.br/empresas-e-negocios/pt-br/empreendedor'));assert.ok(!mei.includes('81 mil'));assert.ok(!mei.includes('iob.com.br'));assert.ok(mei.includes('jorge-telles-chat.js'));
});
test('content disclosure supports fine-pointer hover, Escape, outside click and touch-native toggle',()=>{
 function target(){const handlers={};return {handlers,addEventListener(t,f){(handlers[t]??=[]).push(f)},removeEventListener(){},emit(t,event={}){for(const f of handlers[t]||[])f(event)}}}
 const doc=target(),summary=Object.assign(target(),{focus(){summary.focused=true}}),item=Object.assign(target(),{dataset:{},open:false,classList:{contains:x=>x==='jt-resources'},contains:x=>x===item||x===summary,querySelector:()=>summary});doc.querySelectorAll=()=>[item];doc.activeElement=null;const window=Object.assign(target(),{matchMedia:()=>({matches:true}),dispatchEvent(){}});let timer;runInNewContext(read('public/static/jorge-telles-navigation.js'),{document:doc,window,Event:class{},setTimeout:fn=>{timer=fn;return 1},clearTimeout(){}});
 item.emit('mouseenter');assert.equal(item.open,true);let prevented=false;summary.emit('click',{preventDefault(){prevented=true}});assert.equal(prevented,true);doc.emit('keydown',{key:'Escape'});assert.equal(item.open,false);assert.equal(summary.focused,true);item.emit('mouseenter');doc.emit('click',{target:{}});assert.equal(item.open,false);item.emit('mouseenter');item.emit('mouseleave');timer();assert.equal(item.open,false);item.open=true;item.emit('focusout',{relatedTarget:{}});assert.equal(item.open,false);
});

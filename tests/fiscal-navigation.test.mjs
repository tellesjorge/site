import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
test('Sou cliente exposes Fiscal separately from N Fiscal without scripts',()=>{
 const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
 const menu=html.match(/<details class="jt-platforms">[\s\S]*?<\/details>/)?.[0];
 assert.ok(menu);assert.equal((menu.match(/href="https:\/\/app.jorgetelles.com.br\/fiscal"/g)||[]).length,1);
 assert.ok(menu.includes('Módulo Fiscal'));assert.ok(menu.includes('https://app.jorgetelles.com.br/login'));
 assert.ok(menu.includes('acesso administrativo'));
});
test('shared navigation enhancement has valid syntax and guards duplicate links',()=>{
 const script=readFileSync(new URL('../public/static/jorge-telles-navigation.js',import.meta.url),'utf8');
 assert.doesNotThrow(()=>new Function(script));
 assert.ok(script.includes("menu.querySelector('a[href=\"https://app.jorgetelles.com.br/fiscal\"]')"));
});

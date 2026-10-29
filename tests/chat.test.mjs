import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {Script} from 'node:vm';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
test('commercial pages include same-origin branded chat without external tracking or compulsory registration',()=>{
 for(const path of ['index.html','app.html','public/artigos/index.html','public/privacidade/index.html']){const html=read(path);assert.ok(html.includes('/static/jorge-telles-chat.js'),path);assert.ok(html.includes('/static/jorge-telles-chat.css'),path)}
 const script=read('public/static/jorge-telles-chat.js');new Script(script);assert.doesNotMatch(script,/localStorage|sessionStorage|document\.cookie|https:\/\//);assert.ok(script.includes('text.textContent=m.body'));assert.ok(script.includes('sem informar nome, telefone ou e-mail'));assert.ok(script.includes('Anexos em preparação'));assert.ok(script.includes('Disponibilidade não confirmada'));assert.ok(script.includes('document.hidden'));assert.ok(script.includes('crypto.randomUUID()'));
 const policy=read('public/privacidade/index.html');assert.ok(policy.includes('__Host-jt_conversation'));assert.ok(policy.includes('rotina diária de exclusão'));assert.ok(policy.includes('Não há IA respondendo nesta versão'));
});

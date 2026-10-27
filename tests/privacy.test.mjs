import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {Script,runInNewContext} from 'node:vm';
const read=name=>readFileSync(new URL('../'+name,import.meta.url),'utf8');
test('privacy notice is informative and does not enable optional tracking',()=>{
 const script=read('public/static/jorge-telles-privacy.js');new Script(script);
 assert.ok(script.includes('Continuar somente com necessários'));assert.ok(script.includes('/privacidade/'));
 assert.doesNotMatch(script,/fetch\(|document\.cookie|localStorage\.clear\(|createElement\(['"]script/);
 assert.ok(script.includes('180*24*60*60*1000'));assert.ok(script.includes('state.seenAt<=Date.now()'));
 assert.ok(script.includes("localStorage.removeItem(old)"));assert.ok(!script.includes("setItem('jorge-privacy-consent'"));
});
test('public pages share policy and contact data does not persist or post to FormSubmit',()=>{
 for(const path of ['index.html','app.html','public/artigos/index.html','public/artigos/impacto-descontos-margem-lucro/index.html','public/privacidade/index.html']){
  const html=read(path);assert.ok(html.includes('jorge-telles-privacy.js'),path);assert.ok(html.includes('jorge-telles-privacy.css'),path);
 }
 const contact=read('src/pages/ContactPage.tsx');assert.doesNotMatch(contact,/formsubmit|localStorage|fetch\(/i);
 assert.ok(contact.includes('getMailtoFallbackLink()'));assert.ok(contact.includes('Nada foi enviado automaticamente'));
 assert.ok(contact.includes('/privacidade/'));assert.ok(!contact.includes('Mensagem enviada com sucesso!'));
 const policy=read('public/privacidade/index.html');assert.ok(policy.includes('telles.jorge@gmail.com'));assert.ok(policy.includes('não existe um prazo universal'));
 assert.ok(!policy.includes('Encarregado (DPO):'));assert.ok(!read('src/index.css').includes('fonts.googleapis.com'));
});
test('security headers block external trackers and unintended submissions',()=>{
 const headers=read('public/_headers');
 for(const rule of ["script-src 'self'","connect-src 'self'","object-src 'none'","frame-ancestors 'none'",'Referrer-Policy: strict-origin-when-cross-origin'])assert.ok(headers.includes(rule));
 assert.ok(!headers.includes("script-src 'self' 'unsafe-inline'"));
});
test('notice dismissal expires and reading policy never records consent',()=>{
 const storage=new Map(),handlers={},controls={};let shown=0;
 const localStorage={getItem:key=>storage.get(key)||null,setItem:(key,value)=>storage.set(key,value),removeItem:key=>storage.delete(key)};
 const node={setAttribute(){},remove(){},querySelector:selector=>controls[selector]??=( {textContent:'',focus(){},addEventListener:(type,handler)=>{handlers[selector]=handler}} )};
 const document={createElement:()=>node,body:{append(){shown++}},addEventListener:(type,handler)=>{handlers.document=handler}};
 const script=read('public/static/jorge-telles-privacy.js');
 storage.set('jorge-contact-leads','legacy test');storage.set('fiscal-session','preserve');
 runInNewContext(script,{document,localStorage,Date});assert.equal(shown,1);assert.ok(!storage.has('jorge-contact-leads'));assert.equal(storage.get('fiscal-session'),'preserve');
 handlers.document({target:{closest:()=>null}});assert.ok(!storage.has('jt-privacy-notice-v1'));
 handlers['[data-close]']();assert.equal(JSON.parse(storage.get('jt-privacy-notice-v1')).version,1);
 runInNewContext(script,{document,localStorage,Date});assert.equal(shown,1);
 storage.set('jt-privacy-notice-v1',JSON.stringify({version:1,seenAt:Date.now()-181*86400000}));
 runInNewContext(script,{document,localStorage,Date});assert.equal(shown,2);
 handlers['[data-clear]']();assert.ok(!storage.has('jt-privacy-notice-v1'));assert.equal(storage.get('fiscal-session'),'preserve');
});

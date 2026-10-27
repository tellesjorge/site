(()=>{
 const key='jt-privacy-notice-v1',ttl=180*24*60*60*1000;
 try{for(const old of ['jorge-privacy-consent','jorge-contact-leads'])localStorage.removeItem(old)}catch{}
 let banner;
 const save=()=>{try{localStorage.setItem(key,JSON.stringify({version:1,seenAt:Date.now()}))}catch{}banner?.remove()};
 const show=()=>{banner?.remove();banner=document.createElement('section');banner.className='jt-privacy-notice';banner.setAttribute('aria-label','Privacidade e armazenamento');
 banner.innerHTML='<div><h2>Privacidade, com transparência</h2><p>Usamos recursos necessários de segurança e preferências. Não ativamos rastreadores opcionais nesta configuração. Você pode navegar sem aceitar publicidade.</p><a href="/privacidade/">Ler aviso de privacidade</a><p role="status" aria-live="polite"></p></div><div class="jt-privacy-actions"><button type="button" data-close>Continuar somente com necessários</button><button type="button" data-clear>Apagar preferências deste site</button></div>';
 banner.querySelector('[data-close]').addEventListener('click',save);
 banner.querySelector('[data-clear]').addEventListener('click',()=>{try{for(const name of [key,'jorge-telles-language'])localStorage.removeItem(name);banner.querySelector('[role=status]').textContent='Preferências removidas. Mensagens enviadas e dados da conta fiscal não foram apagados.'}catch{banner.querySelector('[role=status]').textContent='O navegador impediu a alteração. Use suas configurações de privacidade.'}});document.body.append(banner)};
 document.addEventListener('click',event=>{if(event.target.closest('[data-privacy-manage]')){show();banner.querySelector('button').focus()}});
 let valid=false;try{const state=JSON.parse(localStorage.getItem(key)||'null');valid=state?.version===1&&Number.isFinite(state.seenAt)&&state.seenAt<=Date.now()&&Date.now()-state.seenAt<ttl}catch{}
 if(!valid)show();
})();

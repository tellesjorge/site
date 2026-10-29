(()=>{
 const platforms=document.querySelector('.jt-platforms');if(platforms){document.addEventListener('click',event=>{if(!platforms.contains(event.target))platforms.open=false;});document.addEventListener('keydown',event=>{if(event.key==='Escape'&&platforms.open){platforms.open=false;platforms.querySelector('summary').focus();}});platforms.addEventListener('click',event=>{if(event.target.closest('a'))platforms.open=false;});}
 const menu=document.getElementById('jt-navigation'),toggle=document.getElementById('jt-menu-toggle');
 const close=()=>{menu.classList.remove('is-open');toggle.setAttribute('aria-expanded','false')};
 toggle.onclick=()=>{const open=menu.classList.toggle('is-open');toggle.setAttribute('aria-expanded',String(open))};
 menu.addEventListener('click',event=>{if(event.target.closest('a'))close()});
 document.addEventListener('click',event=>{if(!event.target.closest('.jt-header'))close()});
 document.addEventListener('keydown',event=>{if(event.key==='Escape'&&menu.classList.contains('is-open')){close();toggle.focus()}});
 const examples={
  result:{title:'Resultado e margem',a:'Receita',b:'Custos e despesas',lineA:'M28 150L106 120L184 130L262 85L340 100L418 55L496 35',lineB:'M28 160L106 140L184 151L262 124L340 136L418 100L496 115',insight:'Compare a evolução da receita com os custos e despesas para identificar pontos de investigação.'},
  cash:{title:'Movimentação de caixa',a:'Entradas',b:'Saídas',lineA:'M28 120L106 55L184 140L262 85L340 65L418 100L496 40',lineB:'M28 145L106 135L184 80L262 145L340 100L418 115L496 120',insight:'Observe entradas e saídas em conjunto para compreender a movimentação e preparar perguntas sobre o caixa.'},
  budget:{title:'Orçado versus realizado',a:'Realizado',b:'Orçado',lineA:'M28 150L106 125L184 145L262 100L340 110L418 60L496 48',lineB:'M28 160L106 135L184 115L262 95L340 75L418 55L496 35',insight:'Coloque planejamento e realização lado a lado para localizar diferenças e orientar a análise.'}
 };
 const tabs=[...document.querySelectorAll('[data-chart]')];
 function select(tab){
  const example=examples[tab.dataset.chart];
  tabs.forEach(button=>{const active=button===tab;button.setAttribute('aria-selected',String(active));button.tabIndex=active?0:-1});
  document.getElementById('jt-chart-title').textContent=example.title;
  document.getElementById('jt-chart-legend-a').textContent=example.a;document.getElementById('jt-chart-legend-b').textContent=example.b;
  document.getElementById('jt-chart-line-a').setAttribute('d',example.lineA);document.getElementById('jt-chart-line-b').setAttribute('d',example.lineB);
  document.getElementById('jt-demo-insight').textContent=example.insight;
  document.getElementById('jt-chart-description').textContent='Ilustração: '+example.title+'. Dados fictícios, sem representar resultados reais.';
  document.getElementById('jt-chart-panel').setAttribute('aria-labelledby',tab.id);
 }
 tabs.forEach((tab,index)=>{tab.onclick=()=>select(tab);tab.onkeydown=event=>{const next=event.key==='ArrowRight'?(index+1)%tabs.length:event.key==='ArrowLeft'?(index+tabs.length-1)%tabs.length:event.key==='Home'?0:event.key==='End'?tabs.length-1:null;if(next!==null){event.preventDefault();tabs[next].focus();select(tabs[next])}}});
})();

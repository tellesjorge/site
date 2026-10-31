/* Local-only managerial simulation. No network, analytics or persistent storage. */
function calculateBreakEven(fixed,margin,sales){
 if(![fixed,margin,sales].every(Number.isFinite)||fixed<0||fixed>1e9||sales<0||sales>1e9||margin<0||margin>100)throw Error('Valores inválidos');
 const contribution=sales*margin/100;
 if(margin===0)return {point:null,result:-fixed,safety:null};
 const point=fixed/(margin/100);
 return {point,result:contribution-fixed,safety:sales>0?(sales-point)/sales*100:null};
}
(()=>{
 if(typeof document==='undefined')return;
 const form=document.getElementById('be-form');if(!form)return;
 const $=id=>document.getElementById(id),money=n=>n.toLocaleString('pt-BR',{style:'currency',currency:'BRL'}),percent=n=>n.toLocaleString('pt-BR',{minimumFractionDigits:1,maximumFractionDigits:1})+'%';
 let copyText='';
 function update(){
  $('be-copy-status').textContent='';const margin=Number($('be-margin').value);$('be-margin-value').textContent=percent(margin);
  const valid=form.checkValidity();$('be-copy').disabled=!valid;
  if(!valid){copyText='';for(const id of ['be-point','be-result','be-safety'])$(id).textContent='—';$('be-explanation').textContent='Informe valores válidos entre zero e R$ 1 bilhão, com até duas casas decimais.';return;}
  const fixed=Number($('be-fixed').value),sales=Number($('be-sales').value),r=calculateBreakEven(fixed,margin,sales);
  $('be-point').textContent=r.point===null?'Não calculável':money(r.point);$('be-result').textContent=money(r.result);$('be-safety').textContent=r.safety===null?'Não calculável':percent(r.safety);
  $('be-explanation').textContent=margin===0?'Com margem zero, as vendas não contribuem para cobrir os gastos fixos. Não há ponto de equilíbrio único calculável.':sales===0?'Sem faturamento previsto, a margem de segurança percentual não é calculável.':r.result<0?'Nas premissas informadas, o faturamento está abaixo do ponto de equilíbrio e o resultado operacional é negativo.':r.result===0?'Nas premissas informadas, a operação está no ponto de equilíbrio.':'Nas premissas informadas, o faturamento está acima do ponto de equilíbrio.';
  copyText=['Simulação de ponto de equilíbrio — Jorge Telles','Gastos fixos: '+money(fixed),'Margem de contribuição: '+percent(margin),'Faturamento previsto: '+money(sales),'Ponto de equilíbrio: '+$('be-point').textContent,'Resultado operacional: '+$('be-result').textContent,'Margem de segurança: '+$('be-safety').textContent,'Estimativa gerencial; não é lucro líquido nem projeção de caixa.'].join('\n');
 }
 form.addEventListener('submit',event=>event.preventDefault());form.addEventListener('input',update);
 $('be-copy').addEventListener('click',async()=>{if(!copyText)return;try{await navigator.clipboard.writeText(copyText);$('be-copy-status').textContent='Resultado copiado.';}catch{$('be-copy-status').textContent='Não foi possível copiar automaticamente. Selecione os resultados na tela para copiá-los.';}});
 update();
})();

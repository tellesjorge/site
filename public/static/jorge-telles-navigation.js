(()=>{'use strict';
 function initialize(root=document){const dropdowns=Array.from(root.querySelectorAll('.jt-platforms,.jt-resources')),cleanups=[];for(const item of dropdowns){if(item.dataset.navigationReady)continue;item.dataset.navigationReady='1';let timer,hoverOpened=false;const summary=item.querySelector('summary');const on=(target,type,fn)=>{target.addEventListener(type,fn);cleanups.push(()=>target.removeEventListener(type,fn))};
  const close=()=>{clearTimeout(timer);hoverOpened=false;item.open=false};
  on(item,'mouseenter',()=>{if(item.classList.contains('jt-resources')&&window.matchMedia('(hover: hover) and (pointer: fine)').matches){clearTimeout(timer);hoverOpened=!item.open;item.open=true}});
  if(summary)on(summary,'click',event=>{if(hoverOpened&&item.open){event.preventDefault();hoverOpened=false}});
  on(item,'mouseleave',()=>{if(item.classList.contains('jt-resources')&&!item.contains(document.activeElement))timer=setTimeout(close,180)});
  on(item,'toggle',()=>{if(item.open)for(const other of dropdowns)if(other!==item)other.open=false});
  on(document,'click',event=>{if(!item.contains(event.target))close()});
  on(item,'click',event=>{if(event.target.closest('a'))close()});
  on(document,'keydown',event=>{if(event.key==='Escape'&&item.open){close();summary?.focus()}});
  on(item,'focusout',event=>{if(event.relatedTarget&&!item.contains(event.relatedTarget))close()});
  cleanups.push(()=>{clearTimeout(timer);delete item.dataset.navigationReady});
 }return ()=>cleanups.forEach(fn=>fn())}
 window.jtInitializeNavigation=initialize;initialize();window.dispatchEvent(new Event('jt-navigation-ready'));
})();

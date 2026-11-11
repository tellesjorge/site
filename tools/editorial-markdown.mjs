const escape=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function inline(value){
 const links=[];
 const source=value.replace(/\[([^\]\n]+)\]\(([^)\s]+)\)/g,(_,label,url)=>{
  let safe=false;try{const u=new URL(url,'https://www.jorgetelles.com.br');safe=(u.protocol==='https:'&&(!url.startsWith('/')||url.startsWith('/')&&!url.startsWith('//')))||url.startsWith('#');}catch{}
  if(!safe)return label;
  const index=links.push('<a href="'+escape(url)+'"'+(url.startsWith('https:')?' target="_blank" rel="noopener noreferrer"':'')+'>'+escape(label)+'</a>')-1;
  return '\u0000LINK'+index+'\u0000';
 });
 return escape(source).replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>').replace(/\*([^*]+)\*/g,'<em>$1</em>').replace(/\u0000LINK(\d+)\u0000/g,(_,index)=>links[Number(index)]);
}
// Escaped Markdown subset shared by the Pages generator and panel preview.
export function renderEditorialMarkdown(markdown){
 const blocks=markdown.replace(/\r/g,'').trim().split(/\n\s*\n/),sections=[];
 let html='',opened=false;
 for(const block of blocks){
  if(block==='---')continue;
  if(block.startsWith('## ')||block.startsWith('# ')){if(opened)html+='</section>';const title=block.replace(/^#{1,2} /,''),id='secao-'+(sections.length+1);sections.push([id,title]);html+='<section id="'+id+'"><h2>'+inline(title)+'</h2>';opened=true;}
  else if(block.startsWith('### '))html+='<h3>'+inline(block.slice(4))+'</h3>';
  else if(block.startsWith('|')){
   const rows=block.split('\n').map(row=>row.trim().replace(/^\||\|$/g,'').split('|').map(cell=>cell.trim()));
   if(rows.length<3||!rows[1].every(cell=>/^:?-+:?$/.test(cell))||rows.some(row=>row.length!==rows[0].length))throw Error('Invalid editorial table');
   html+='<div class="ed-table-wrap" tabindex="0" role="region" aria-label="Tabela do artigo"><table><thead><tr>'+rows[0].map(cell=>'<th scope="col">'+inline(cell)+'</th>').join('')+'</tr></thead><tbody>'+rows.slice(2).map(row=>'<tr>'+row.map(cell=>'<td>'+inline(cell)+'</td>').join('')+'</tr>').join('')+'</tbody></table></div>';
  }else if(block.startsWith('- '))html+='<ul>'+block.split('\n').map(line=>'<li>'+inline(line.replace(/^- /,''))+'</li>').join('')+'</ul>';
  else html+='<p>'+inline(block.replace(/\n/g,' '))+'</p>';
 }
 if(opened)html+='</section>';
 return {html,sections};
}

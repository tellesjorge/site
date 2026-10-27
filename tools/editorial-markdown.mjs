// Small, escaped Markdown subset for authored editorial text; no raw HTML or scripts.
export function renderEditorialMarkdown(markdown){
 const escape=value=>value.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const inline=value=>escape(value).replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>').replace(/\*([^*]+)\*/g,'<em>$1</em>');
 const blocks=markdown.replace(/\r/g,'').trim().split(/\n\s*\n/),sections=[];
 let html='',opened=false;
 for(const block of blocks){
  if(block==='---')continue;
  if(block.startsWith('## ')){if(opened)html+='</section>';const title=block.slice(3),id='secao-'+(sections.length+1);sections.push([id,title]);html+='<section id="'+id+'"><h2>'+inline(title)+'</h2>';opened=true;}
  else if(block.startsWith('### '))html+='<h3>'+inline(block.slice(4))+'</h3>';
  else if(block.startsWith('|')){const rows=block.split('\n').map(row=>row.trim().replace(/^\||\|$/g,'').split('|').map(cell=>cell.trim()));if(rows.length<3||!rows[1].every(cell=>/^:?-+:?$/.test(cell)))throw Error('Invalid editorial table');html+='<div class="ed-table-wrap"><table><thead><tr>'+rows[0].map(cell=>'<th scope="col">'+inline(cell)+'</th>').join('')+'</tr></thead><tbody>'+rows.slice(2).map(row=>'<tr>'+row.map(cell=>'<td>'+inline(cell)+'</td>').join('')+'</tr>').join('')+'</tbody></table></div>';}
  else if(block.startsWith('- '))html+='<ul>'+block.split('\n').map(line=>'<li>'+inline(line.replace(/^- /,''))+'</li>').join('')+'</ul>';
  else html+='<p>'+inline(block.replace(/\n/g,' '))+'</p>';
 }
 if(opened)html+='</section>';
 return {html,sections};
}

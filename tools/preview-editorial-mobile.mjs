// Local visual test only. No account, tracking, forms or production writes.
import {createServer} from 'node:http';
createServer((request,response)=>{
 if(request.method!=='GET'||request.url!=='/mobile'){response.writeHead(404);response.end();return;}
 response.setHeader('Content-Type','text/html;charset=utf-8');response.setHeader('Cache-Control','no-store');
 response.end('<!doctype html><html lang="pt-BR"><meta charset="utf-8"><title>Artigo — simulação de celular</title><style>body{margin:0;background:#eee;font:14px Arial;padding:12px}p{margin:0 0 12px}iframe{display:block;border:1px solid #ccc;background:white;width:390px;height:1100px}</style><p>Conferência de leitura em 390 pixels</p><iframe src="http://127.0.0.1:8798/artigos/lucro-sem-dinheiro-em-caixa/" title="Artigo em largura de celular"></iframe></html>');
}).listen(8797,'127.0.0.1',()=>console.log('Conferência móvel: http://127.0.0.1:8797/mobile'));

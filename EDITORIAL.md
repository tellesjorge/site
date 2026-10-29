# Seção Artigos

Os cinco episódios usam URLs canônicas em `/artigos/`. Os endereços anteriores em `/blog/` permanecem como redirecionamentos permanentes 301 para evitar perda de acessos. Os episódios 04 e 05 conservam o texto fornecido em Markdown, convertido por um renderizador limitado que escapa HTML; título, autoria e apresentação são compartilhados pelo modelo editorial.

O episódio 05, publicado em 28/10/2026, usa o título SEO e a descrição fornecidos pelo autor, com canonical em /artigos/custos-invisiveis-empresas. Inclui ressalvas sobre dupla contagem, capacidade versus caixa e comparação ilustrativa por margem líquida, além de exemplo complementar de economia líquida dos custos de implantação. Os cálculos e metadados têm testes; a referência ASQ sobre custo da qualidade foi consultada nessa data.

O menu e o destaque da página inicial levam à biblioteca editorial em `/artigos/`. A seção segue a identidade comercial roxa e rosa e não modifica o aplicativo fiscal.

## Conteúdo e publicação

Cada artigo fica em `content/articles/`, em um arquivo `.mjs` com título, descrição, categoria, série, episódio, data, sumário e corpo HTML revisado. `tools/build-editorial.mjs` descobre os arquivos e gera páginas completas antes de `npm run build` e `npm run dev`.

As páginas em `public/artigos/` e o mapa `public/sitemap-editorial.xml` são produtos de geração, ignorados pelo Git. Não editar essas saídas à mão. O bloco identificado em `public/_redirects` é regenerado para dar prioridade às páginas editoriais, mantendo os caminhos antigos da aplicação abaixo dele.

Para publicar outro artigo: adicionar um arquivo com outro identificador, revisar conteúdo e premissas, executar `npm run test:editorial` e `npm run build`, conferir a leitura no computador e no celular e publicar pela integração Git existente do Cloudflare Pages. A página inicial destaca automaticamente os dois artigos mais recentes; em datas iguais, o episódio mais recente aparece primeiro. As páginas usam o roteamento estático nativo do Pages; os caminhos legados são preservados explicitamente, sem uma regra curinga que intercepte os artigos novos.

## Primeiro artigo

“Sua empresa dá lucro, mas não tem dinheiro em caixa? Entenda por quê”, série O Lucro Invisível, episódio 01. Texto de Jorge Telles expandido com exemplos hipotéticos: conciliação de lucro e caixa, linha do tempo do ciclo, necessidade simplificada de capital de giro e crescimento.

Os cálculos estão cobertos por testes. As premissas são explícitas; não há promessa de liberação imediata de caixa ou de resultado financeiro. Referências primárias: CPC 03 (R2), itens 18–20, e orientação do CFC sobre competência, consultadas em 27/10/2026. Não foi reproduzido texto normativo integral.

## Recursos

Sumário com âncoras, pesquisa na biblioteca, autoria e data, estimativa de leitura, compartilhamento acionado pelo leitor, impressão/PDF pelo navegador, metadados e dados estruturados do artigo. Sem comentários, formulários, rastreadores, cookies ou armazenamento persistente adicionados nesta seção.

O catálogo antigo com simulação de atualização automática foi substituído por uma entrada para a biblioteca editorial. Fontes e links de artigos antigos permanecem preservados; não se apresenta uma simulação como busca real de notícias.

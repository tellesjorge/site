# Publicação comercial aprovada

A página inicial aprovada foi integrada como entrada estática do Vite. `npm run build` continua gerando `dist`, compatível com o projeto Cloudflare Pages existente.

- `index.html`: página comercial aprovada, sem importação de dados operacionais.
- `app.html`: entrada React preservada para as páginas internas existentes.
- `public/_redirects`: rotas internas preservadas e caminhos do sistema fiscal direcionados à página de implantação.
- `public/static`: CSS, JavaScript e retrato aprovados.
- `/login`, `/cadastro`, `/apresentacao`: aviso explícito de indisponibilidade. Sem formulário, autenticação ou transmissão fiscal.

Não há backend fiscal, banco de dados, certificado, chave privada ou variável de ambiente deste projeto NFSE neste commit. O sistema local continua independente. O cadastro e a emissão públicos NÃO foram liberados.

## Verificação desta versão

- `npm run build`: PASS (TypeScript + Vite, duas entradas HTML).
- Teste de navegador: PASS em cinco larguras; menu, gráfico demonstrativo, links fiscais pendentes, contato/perfil existentes e retorno da SPA à nova home.
- DOMPurify atualizado de 3.4.11 para 3.4.17 no lockfile para corrigir alerta crítico herdado. Auditoria restante: 18 alertas (10 altos, 7 moderados e 1 baixo) nas dependências do projeto antigo; revisão posterior pendente, sem alegação de sistema auditado ou segurança integral.
- Nenhum formulário de contato foi submetido durante os testes.

## Retorno

A versão anterior de main era `1c9c4f8a00c626fd0d324810031af99824aa133b`. O histórico está preservado. Preferir reverter o commit desta publicação ou utilizar o rollback da implantação Cloudflare, sem apagar histórico nem usar force push.

## Pendências posteriores

- Migrar e validar o backend fiscal e a persistência no Cloudflare.
- Validar custódia de certificados, assinatura XML e comunicação fiscal.
- Revisar autenticação, cadastro externo, recuperação de conta e proteção contra abuso.
- Atualizar os links de implantação somente depois da disponibilização real do sistema.

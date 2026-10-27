# Adequação técnica do site público — 27/10/2026

Não é certificação de conformidade integral ou parecer jurídico. O escopo foi o site comercial, artigos, perfil e contato. O aplicativo fiscal não foi auditado nesta alteração.

## Implementado

- Aviso único e política acessível em /privacidade/, também na página inicial e nos artigos.
- Leitura da política não representa consentimento. Sem categorias fictícias ou consentimento compulsório para publicidade.
- Nenhum rastreador opcional habilitado nesta configuração. CSP permite scripts/conexões somente da mesma origem; bloqueia inclusive beacon de medição injetado pela hospedagem. As opções de analytics da conta Cloudflare não foram alteradas.
- Fontes externas Google removidas; fontes do sistema utilizadas.
- Removidos envio automático ao FormSubmit e cópias locais de contatos. O botão comercial prepara e-mail para revisão no aplicativo do visitante, que deve realizar o envio. Não se afirma recebimento.
- Migração apaga apenas as chaves antigas `jorge-contact-leads` e `jorge-privacy-consent` no navegador ao abrir o site. Não toca certificados, contas, sessões ou históricos fiscais. Mensagens já enviadas não são excluídas.
- Preferência informativa versionada, validade de 180 dias, tolerância a armazenamento indisponível e opção de apagar preferências específicas.
- Canal provisório Gmail autorizado pelo usuário. Não se afirma designação formal de DPO, nem prazo universal de 15 dias úteis.
- HTTPS existente, CSP, bloqueio de incorporação, restrição de permissões e política de referenciador.

## Inventário inicial

| Tratamento | Dados / local | Finalidade / situação |
|---|---|---|
| Hospedagem e segurança Cloudflare | IP e registros técnicos na infraestrutura | Prestação e proteção do serviço; inventariar configurações efetivas e retenção com o fornecedor |
| Contato comercial | Campos em memória durante a página; e-mail somente se enviado pelo visitante | Responder a pedido / proposta; avaliar formalmente a base legal adequada |
| Mensagens externas | Provedor do visitante e Gmail do responsável | Atendimento; definir acesso, retenção e exclusão |
| Preferência do aviso | jt-privacy-notice-v1 no navegador | Lembrar fechamento do aviso por até 180 dias |
| Idioma | jorge-telles-language no navegador | Preferência funcional; removível |
| FormSubmit anterior | Mensagens eventualmente submetidas antes da alteração | Solicitar inventário, retenção e eventual exclusão ao fornecedor; não foi acessado ou apagado remotamente |
| Módulos legados de diagnóstico/ERP | Código não exposto pelas rotas públicas atuais | Não auditado: revisar antes de qualquer futura publicação |

## Pendências do responsável — não presumir resolvidas

1. Identificação fornecida em 27/10/2026: Jorge Telles, CNPJ 24.146.741/0001-43, sem endereço comercial informado. Política atualizada com canal digital, sem endereço residencial. Confirmar em documentação empresarial a razão social exata e avaliar com assessoria se outro dado de identificação é necessário; não se presumiu validação cadastral externa.
2. Confirmar se cabe designar encarregado ou alguma regra diferenciada de pequeno porte; validar juridicamente, sem presumir dispensa.
3. Revisar contratos e papéis de Cloudflare, Google/Gmail e demais fornecedores; avaliar garantias e transferências internacionais segundo as normas aplicáveis. Revisar dados históricos do FormSubmit.
4. Definir e executar tabela de retenção e descarte por finalidade, inclusive e-mails, logs e backups. O código não implementa exclusão de e-mail ou dos dados de fornecedores.
5. Manter registro dos tratamentos, bases legais e avaliações de interesse legítimo quando utilizadas. Este inventário inicial não é o registro completo de toda a empresa.
6. Implantar rotina de atendimento a titulares: protocolo, verificação proporcional, busca nos sistemas, prazos aplicáveis e registro das respostas. Testar recebimento do Gmail com envio humano autorizado.
7. Revisar MFA, acessos mínimos, backups, recuperação, treinamento e plano de incidentes. Em caso de incidente, avaliar comunicação conforme as regras vigentes da ANPD; não há comunicação automática por este site.
8. Auditar separadamente app.jorgetelles.com.br, segregação entre clientes, certificados, dados fiscais e eventuais dados de saúde. Não usar o aviso do site como substituto.
9. Confirmar no painel Cloudflare os recursos de medição/segurança e as durações de cookies efetivos. Reauditar antes de inserir marketing, vídeos incorporados ou rastreadores novos.
10. Submeter os textos e decisões acima à validação jurídica. Não usar selo de “100% conforme LGPD” com base neste trabalho.

## Fontes oficiais

- Lei nº 13.709/2018: https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709compilado.htm
- Guia ANPD de cookies: https://www.gov.br/anpd/pt-br/centrais-de-conteudo/materiais-educativos-e-publicacoes/guia-orientativo-cookies-e-protecao-de-dados-pessoais.pdf
- Resolução CD/ANPD nº 2/2022 (ver requisitos, não presumir enquadramento): https://www.gov.br/anpd/pt-br/acesso-a-informacao/institucional/atos-normativos/regulamentacoes_anpd/resolucao-cd-anpd-no-2-de-27-de-janeiro-de-2022

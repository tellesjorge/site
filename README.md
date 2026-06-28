# Portfólio Profissional - Jorge Telles

Site profissional em React + Vite + TypeScript para apresentar o perfil executivo de Jorge Telles em Controladoria, FP&A e Finanças Corporativas.

## Tecnologias

- React
- Vite
- TypeScript
- Tailwind CSS
- Framer Motion
- Lucide React

## Instalação

1. Abra o terminal na pasta do projeto.
2. Execute:

```bash
npm install
```

## Executar localmente

```bash
npm run dev
```

Depois, abra o endereço exibido no terminal (por padrão, `http://localhost:5173`).

## Alterar dados pessoais

Os dados do site estão centralizados em `src/data/profile.ts`.

Edite:

- `name`
- `headline`
- `subtitle`
- `about`
- `specialties`
- `experience`
- `projects`
- `skills`
- `technologies`
- `dashboard`
- `contact`
- `actions` (links de currículo, WhatsApp e LinkedIn)

## Dados de Inteligência Artificial e dashboards

Os dados simulados da nova seção de IA estão em:

- `src/data/aiDashboard.ts`
- `src/data/aiInsights.ts`
- `src/data/aiRecommendations.ts`
- `src/data/forecast.ts`
- `src/data/budgetVsActual.ts`
- `src/data/automationDataAI.ts`

Para alterar insights, recomendações ou projeções, edite esses arquivos e mantenha a estrutura de objetos.

## Integração futura com API de IA

O projeto está preparado para futura conexão com APIs de IA e endpoints de backend.

Não há chave de API exposta no front-end.

Use `src/components/AIFinanceSection.tsx` como ponto de entrada para chamadas futuras de IA.

### Exemplo de configuração de ambiente

Edite `.env.example` e crie um `.env` com:

```env
VITE_AI_API_URL=
VITE_CONTACT_ENDPOINT=
```

## Trocar o currículo em PDF

Substitua o arquivo `curriculo-jorge-telles.pdf` na raiz do projeto ou altere o caminho em `src/data/profile.ts` no campo `actions.resume`.

## Publicar

### Vercel

1. Conecte o repositório no Vercel.
2. Configure o framework como `Vite`.
3. Use os comandos padrão `npm install` e `npm run build`.
4. O diretório de saída é `dist`.

### Netlify

1. Conecte o repositório no Netlify.
2. Configure o build command como `npm run build`.
3. Configure o publish directory como `dist`.

## Como trocar dados mockados por dados reais

1. Substitua o conteúdo de `src/data/*.ts` pelos dados reais.
2. Para integrações em tempo real, crie um backend que consuma APIs de dados ou IA.
3. Atualize `src/components/AIFinanceSection.tsx` para buscar dados via `fetch` ou `axios`.
4. Mantenha o arquivo `.env` com variáveis como `VITE_AI_API_URL` e `VITE_CONTACT_ENDPOINT`.

## Como extrair dados do LinkedIn automaticamente

A forma mais confiável de automatizar a extração de perfil do LinkedIn é usando um navegador automatizado (por exemplo, Playwright ou Puppeteer) para carregar a página, rolar o conteúdo e ler o DOM.

O fluxo geral é:

- Acesse `https://www.linkedin.com/in/jorgetelles/` em uma sessão que tenha permissão para visualizar o perfil.
- Espere a página carregar e, se necessário, role para baixo para forçar carregamento de seções adicionais.
- Use `document.body.innerText` ou seletores específicos para extrair:
  - headline
  - seção "Sobre"
  - educação (MBA, Bacharelado)
  - competências e experiências expostas
- Mapeie esses valores para `src/data/profile.ts`.

Importante:

- LinkedIn pode limitar o acesso automático e exige login para alguns perfis.
- Este repositório mantém os dados reais em `src/data/profile.ts`, então a extração serve para gerar o conteúdo e não para exibir direto em produção.

## Observações

- O layout é responsivo e planejado para aparência premium.
- A estrutura do site está pronta para receber ajustes de conteúdo e identidade visual.

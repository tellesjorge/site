# AGENTS.md — Projeto SITE_JT

## Visão geral do projeto

Este projeto é o site profissional de Jorge Telles, desenvolvido em React + Vite + TypeScript + Tailwind CSS.

O objetivo do site é posicionar Jorge Telles como:

* Controller Estratégico
* Profissional sênior de Controladoria e FP&A
* Especialista em Gestão Financeira Estratégica
* Business Partner para diretoria
* Profissional orientado por dados, Power BI, dashboards e Inteligência Artificial aplicada à Controladoria
* Consultor para diagnóstico financeiro, controladoria, indicadores, margem, CMV, estoque, caixa, forecast e governança

O site não deve parecer uma landing page comum.
Deve parecer uma experiência de produto digital premium, viva, navegável e executiva.

## Comandos principais

Antes e depois de alterações relevantes, use:

```bash
npm run build
```

Para desenvolvimento local:

```bash
npm run dev
```

URL local esperada:

```text
http://localhost:5173/
```

## Estrutura relevante

Arquivos principais do Hero:

```text
src/pages/HomePage.tsx
src/components/home/ImmersiveHero.tsx
src/components/brand/HeroImageAtmosphere.tsx
src/components/brand/ProfilePortrait.tsx
src/components/ui/InteractiveAuroraBackground.tsx
src/components/widgets/LiveContextWidget.tsx
```

Foto principal do Hero:

```text
src/assets/profile/jorge-telles-hero.png
```

Se existir versão WebP correta, preferir:

```text
src/assets/profile/jorge-telles-hero.webp
```

## Direção visual

O visual deve ser premium, limpo, moderno e inspirado em interfaces de produto digital, como iCloud, Antigravity e experiências Apple-like.

Não copiar marcas, logos, ícones, assets, layout proprietário ou textos de Apple, Google, iCloud ou Antigravity.

Usar apenas princípios visuais:

* fundo vivo
* spotlight seguindo o mouse
* gradientes suaves
* profundidade
* glassmorphism discreto
* cards integrados
* tipografia moderna
* experiência responsiva
* interface amigável
* sensação de sistema financeiro inteligente

## Regras críticas de design

1. A foto do Hero não pode parecer um card isolado.
2. A foto deve parecer integrada ao ambiente visual do Hero.
3. O fundo do Hero deve seguir o mouse de forma perceptível.
4. O efeito do mouse deve ser elegante, não neon, não gamer.
5. O Hero deve parecer uma composição única entre texto, foto, widgets e fundo.
6. O título deve ser forte, mas elegante.
7. O site deve funcionar bem em desktop, notebook, tablet, iPad, iPhone e Android.
8. Não pode haver overflow horizontal.
9. Não pode aparecer fundo quadriculado/checkerboard.
10. Não usar transparência mal exportada na foto do Hero.

## Regras da foto do Hero

Usar a foto corporativa de Jorge Telles mantendo o fundo escuro original.

Não fazer:

* não remover fundo
* não usar fundo transparente
* não usar checkerboard
* não distorcer a foto
* não cortar o rosto
* não criar moldura pesada
* não deixar a imagem parecendo colada no layout

Fazer:

* aplicar glow ambiental suave
* aplicar sombra difusa
* usar gradiente de integração
* suavizar bordas visualmente
* integrar a foto com o fundo do Hero
* usar composição cinematográfica/premium
* manter aparência executiva e natural

## Fundo interativo

O componente `InteractiveAuroraBackground.tsx` deve realmente seguir o mouse.

Requisitos técnicos:

* capturar movimento do mouse dentro da área do Hero
* atualizar CSS variables `--mouse-x` e `--mouse-y`
* usar essas variáveis em `radial-gradient`
* não usar `setState` a cada movimento do mouse
* usar `ref.style.setProperty`
* respeitar `prefers-reduced-motion`
* no mobile, usar fallback estático ou animação sutil
* o efeito precisa ser visível ao mover o mouse

Critério de aceite:
se o usuário mover o mouse sobre o Hero e não perceber deslocamento de luz, a tarefa não está concluída.

## Hero da HomePage

O Hero deve conter:

Badge:

```text
Controladoria + FP&A + IA + Dados
```

Label:

```text
JORGE TELLES
```

Título recomendado:

```text
Controller Estratégico | FP&A
IA aplicada à Controladoria
```

Texto:

```text
Transformo dados financeiros, custos, estoques, orçamento e indicadores em decisões executivas com apoio de dashboards, automação e inteligência artificial.
```

Botões:

```text
Contratar como Controller
Solicitar Diagnóstico Financeiro
```

## Tipografia

Usar aparência moderna e premium.

Preferência:

```css
font-family: Inter, "Geist", -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif;
```

Títulos:

* usar `clamp()`
* evitar peso visual exagerado
* line-height entre 1.02 e 1.08
* letter-spacing negativo sutil
* manter legibilidade

## Proibições gerais

Não recriar o projeto do zero.

Não apagar:

* dashboard interativo
* diagnóstico financeiro
* páginas internas
* rotas
* formulários
* recursos existentes de PDF, resumo ou diagnóstico

Não alterar arquivos fora de `C:\SITE_JT`.

Não instalar dependências novas sem necessidade.

Não mudar todo o layout quando a tarefa pedir apenas ajuste localizado.

## Fluxo de trabalho

Antes de alterar:

1. analisar arquivos relevantes
2. explicar plano curto
3. alterar apenas o necessário

Depois de alterar:

1. rodar `npm run build`
2. corrigir erros
3. informar arquivos alterados
4. explicar como testar visualmente
5. informar resultado do build

## Critério de trabalho concluído

Uma tarefa visual do Hero só está concluída se:

1. o build passa
2. o fundo segue o mouse de forma perceptível
3. a foto não parece card isolado
4. o Hero parece uma cena única
5. não há fundo quadriculado
6. não há overflow horizontal
7. o visual está premium, executivo e responsivo

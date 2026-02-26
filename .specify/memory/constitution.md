<!--
## Sync Impact Report

**Version change**: N/A (inicial) → 1.0.0
**Type**: MINOR (primeira ratificação; todos os princípios e seções são novos)

### Added Sections
- Core Principles (I a VI): Arquitetura, Estado, Qualidade, Acessibilidade, Assets, Escopo
- Stack Tecnológico
- Fluxo de Desenvolvimento
- Governance

### Modified Principles
- N/A (primeira ratificação)

### Removed Sections
- N/A (primeira ratificação)

### Templates Status
- ✅ `.specify/memory/constitution.md` — ratificado (este arquivo)
- ✅ `.specify/templates/tasks-template.md` — nota de testes atualizada para refletir Princípio III
- ✅ `.specify/templates/plan-template.md` — Constitution Check usa placeholder dinâmico; sem alteração necessária
- ✅ `.specify/templates/spec-template.md` — agnóstico de tecnologia; sem alteração necessária
- ✅ `.specify/templates/agent-file-template.md` — sem alteração necessária

### Deferred TODOs
- Nenhum
-->

# SDD SpecKit Constitution

## Core Principles

### I. Arquitetura e Responsabilidades

Componentes DEVEM ser standalone por padrão; o atributo `standalone: true` NÃO DEVE ser declarado
explicitamente (o Angular 19+ o torna implícito). Arquivos `.ts`, `.html` e `.css` DEVEM ser
mantidos separados — templates e estilos inline são proibidos.

A arquitetura DEVE separar componentes de UI (dumb/presentational) de componentes de orquestração
(smart/container):

- **Dumb**: recebem dados via `input()`, emitem eventos via `output()`, sem lógica de negócio,
  services ou dependências externas; DEVEM usar `ChangeDetectionStrategy.OnPush`.
- **Smart**: injetam services via `inject()` e lidam com estado, efeitos e lógica de negócio.
- **Organização de pastas**: dumb em `<feature>/ui/`, smart em `<feature>/feature/`,
  services e modelos em `<feature>/data/`.

Componentes NÃO DEVEM fazer chamadas HTTP diretamente; todo acesso externo DEVE estar em services.

**Rationale**: Separação de responsabilidades facilita testes, reaproveitamento e revisão. OnPush
em componentes dumb elimina verificações desnecessárias de detecção de mudanças.

### II. Estado e Reatividade

Estado DEVE ser explícito e modelado com três estados distintos: `loading`, `error` e `success`.
Signals DEVEM ser priorizados para estado local, derivado e sincronização de UI. RxJS DEVE ser
usado para operações assíncronas (HTTP, timers, streams de eventos).

`effect()` com lógica complexa ou dependências ocultas NÃO DEVE ser introduzido sem justificativa
explícita — o fluxo de dados DEVE ser rastreável e compreensível.

**Rationale**: Estado implícito gera bugs difíceis de reproduzir. Signals reduzem boilerplate e
tornam o fluxo reativo mais legível; RxJS permanece a ferramenta certa para assincronicidade real.

### III. Qualidade e Verificabilidade

Toda feature que inclui lógica de dados DEVE ter testes mínimos cobrindo services e componentes
smart. Correções de bugs DEVEM incluir um teste de regressão: o teste DEVE falhar antes da
correção e passar depois.

O CI DEVE executar todos os testes em modo headless e DEVE falhar o pipeline quando qualquer
teste quebra.

**Rationale**: Testes em services e componentes smart garantem que a lógica de negócio funciona
independentemente da UI. Testes de regressão previnem recorrências silenciosas.

### IV. Acessibilidade e UX Básica

Estados de loading e erro DEVEM ser comunicados textualmente — não apenas por ícones ou variações
de cor. Mensagens de erro DEVEM ser claras e acionáveis: o usuário DEVE saber o que ocorreu e
qual ação tomar.

Botões e elementos interativos DEVEM ter:

- Rótulos de texto claros e descritivos;
- Contraste suficiente (mínimo WCAG AA);
- Suporte completo a teclado com indicador de foco visível.

**Rationale**: Acessibilidade não é opcional. UX básica de loading/erro evita que o usuário fique
sem feedback em operações assíncronas.

### V. Assets e UI Base

Assets públicos (imagens, fontes, ícones) DEVEM ficar em `/public`. Tipografia e estilos globais
DEVEM ser definidos em um único ponto (`index.html` ou arquivo de estilos globais — ex:
`styles.scss`). Novas fontes ou estilos globais NÃO DEVEM ser adicionados sem aprovação explícita
de um mantenedor.

**Rationale**: Um único ponto de controle para estilos globais evita inconsistências visuais e
proliferação de dependências de fontes externas.

### VI. Escopo e Manutenção

Quando o comportamento de uma feature muda, `spec.md` e `plan.md` correspondentes DEVEM ser
atualizados no mesmo PR. Quando apenas a implementação muda (sem alteração de comportamento
externo), `spec.md` DEVE ser mantido intacto; `plan.md` PODE ser atualizado se a abordagem
técnica mudou.

PRs DEVEM ser pequenos, rastreáveis e DEVEM incluir checklist de validação: `ng test` (testes),
`ng build` (compilação) e `ng serve` (execução local).

**Rationale**: Documentação desatualizada gera falsa confiança. PRs pequenos facilitam revisão e
reduzem o risco de regressões.

## Stack Tecnológico

| Camada | Tecnologia | Versão |
|---|---|---|
| Framework | Angular | ^21.1 |
| Linguagem | TypeScript | ~5.9 |
| Reatividade assíncrona | RxJS | ~7.8 |
| Build | Angular CLI / `@angular/build` (Vite) | ^21.1 |
| Testes | Vitest | ^4.0 |
| Gerenciador de pacotes | npm | ^11.6 |

Mudanças de versão major em qualquer dependência principal DEVEM ser documentadas e revisadas
por um mantenedor antes de serem aplicadas.

## Fluxo de Desenvolvimento

- Features DEVEM ser desenvolvidas em branches dedicadas a partir de `main`.
- Cada PR DEVE referenciar a feature/spec correspondente em `/specs/`.
- Checklist obrigatório antes de solicitar revisão:
  - [ ] `ng test` — todos os testes passam sem falhas
  - [ ] `ng build` — sem erros de compilação
  - [ ] `ng serve` — fluxo principal funciona localmente
- Mudanças em `spec.md` ou `plan.md` DEVEM ser incluídas no mesmo PR da implementação.
- PRs de correção de bug DEVEM incluir o teste de regressão como primeiro commit do branch.

## Governance

Esta constituição tem precedência sobre qualquer outra prática, convenção ou preferência individual
de desenvolvimento. Em caso de conflito entre a constituição e qualquer outra diretriz, a
constituição prevalece.

**Emendas**: qualquer alteração DEVE ser documentada neste arquivo com versão incrementada,
justificativa da mudança e atualização dos templates e documentos afetados. O Sync Impact Report
no cabeçalho DEVE ser atualizado a cada emenda.

**Política de versionamento**:

- **MAJOR**: remoção ou redefinição incompatível de princípio existente.
- **MINOR**: adição de novo princípio ou seção com impacto real no processo.
- **PATCH**: clarificações, correções de redação ou refinamentos não-semânticos.

**Conformidade**: todo PR DEVE verificar conformidade com os princípios aplicáveis. O revisor é
responsável por sinalizar violações antes do merge.

**Version**: 1.0.0 | **Ratified**: 2026-02-26 | **Last Amended**: 2026-02-26

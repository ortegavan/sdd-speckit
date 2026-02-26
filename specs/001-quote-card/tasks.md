---

description: "Lista de tarefas para implementação da feature Quote Card"
---

# Tasks: Quote Card

**Input**: Documentos de design em `specs/001-quote-card/`
**Prerequisites**: plan.md ✅, spec.md ✅, data-model.md ✅, contracts/quote-card.contract.md ✅, research.md ✅

**Testes**: OBRIGATÓRIOS — feature com lógica de dados (Constituição, Princípio III).
Cobrir `QuoteService` e `QuoteContainer`.

**Organização**: Tarefas agrupadas por user story para implementação e teste independentes.

## Formato: `[ID] [P?] [Story?] Descrição`

- **[P]**: Pode executar em paralelo (arquivos distintos, sem dependências)
- **[Story]**: User story correspondente (US1, US2, US3)
- Caminhos de arquivo incluídos em todas as tarefas

---

## Fase 1: Setup (Configuração do Projeto)

**Objetivo**: Preparar infraestrutura de desenvolvimento antes de qualquer código de feature.

- [ ] T001 Criar estrutura de pastas `src/app/quote/data/`, `src/app/quote/feature/quote-container/` e `src/app/quote/ui/quote-card/`
- [ ] T002 [P] Criar `proxy.conf.json` na raiz com configuração `"/api" → "https://zenquotes.io"` (changeOrigin: true, secure: true) para resolver CORS em dev
- [ ] T003 [P] Adicionar `"proxyConfig": "proxy.conf.json"` em `angular.json` na seção `architect.serve.options`
- [ ] T004 [P] Adicionar `provideHttpClient()` nos providers de `src/app/app.config.ts`
- [ ] T005 [P] Configurar estilos globais em `src/styles.scss`: importar fonte Outfit, aplicar `background: url('/background.jpg') center/cover no-repeat fixed` no body e centralizar com `display: flex; align-items: center; justify-content: center; min-height: 100vh`

---

## Fase 2: Fundacional (Pré-requisitos Bloqueantes)

**Objetivo**: Camada de dados completa — bloqueia todas as user stories.

⚠️ **CRÍTICO**: Nenhuma user story pode começar até esta fase estar completa.

- [ ] T006 Criar modelos de domínio em `src/app/quote/data/quote.model.ts`: interfaces `ZenQuoteDto`, `Quote`, tipo `QuoteErrorType` (`'no-connection' | 'timeout' | 'server-error'`) e tipo discriminado `QuoteState` (`loading | success | error`)
- [ ] T007 Criar `QuoteService` em `src/app/quote/data/quote.service.ts` injetando `HttpClient` via `inject()`, implementando `getRandomQuote(): Observable<Quote>` que chama `GET /api/random`, aplica `timeout(10_000)`, mapeia `ZenQuoteDto[]` para `Quote` (com fallback `'Autor desconhecido'` para autor vazio) e usa `catchError` para mapear erros para `QuoteErrorType` (`status === 0` → `'no-connection'`, `TimeoutError` → `'timeout'`, outros → `'server-error'`)
- [ ] T008 Criar testes de `QuoteService` em `src/app/quote/data/quote.service.spec.ts` usando `HttpTestingController`: (1) resposta OK mapeia para `Quote` correto, (2) autor vazio retorna `'Autor desconhecido'`, (3) `status 0` resulta em `'no-connection'`, (4) `TimeoutError` resulta em `'timeout'`, (5) `status 500` resulta em `'server-error'`

**Checkpoint**: `ng test` passa com 5 casos de `QuoteService` — camada de dados pronta.

---

## Fase 3: User Story 1 — Exibição Inicial da Citação (P1) 🎯 MVP

**Objetivo**: Ao abrir o app, exibir loading e depois a citação com texto e autor.

**Teste Independente**: Abrir `http://localhost:4200` → redirect para `/home` → loading aparece → citação exibida com texto e autor. Sem nenhuma interação do usuário.

- [ ] T009 [P] [US1] Criar `QuoteCard` em `src/app/quote/ui/quote-card/quote-card.ts` com `ChangeDetectionStrategy.OnPush`, inputs `isLoading = input.required<boolean>()`, `quote = input<Quote | null>(null)`, `errorType = input<QuoteErrorType | null>(null)` e output `refreshClicked = output<void>()`; importar `Quote` e `QuoteErrorType` de `quote.model.ts`
- [ ] T010 [P] [US1] Criar template em `src/app/quote/ui/quote-card/quote-card.html` com três blocos condicionais: (1) loading: texto "Carregando..." visível, (2) sucesso `(@if !isLoading() && quote())`: exibir `quote().text` e `quote().author`, (3) erro `(@if !isLoading() && errorType())`: bloco de mensagem de erro (conteúdo detalhado em US3); botão "Refresh" com `(click)="refreshClicked.emit()"` e `[disabled]="isLoading()"` presente nos estados sucesso e erro
- [ ] T011 [P] [US1] Criar estilos em `src/app/quote/ui/quote-card/quote-card.scss` conforme protótipo `specs/prototypes/quote-card.png`: card centralizado, hierarquia tipográfica (texto da citação em destaque, autor secundário), espaçamentos e estados visuais
- [ ] T012 [US1] Criar `QuoteContainer` em `src/app/quote/feature/quote-container/quote-container.ts` com `state = signal<QuoteState>({ status: 'loading' })`, signals computados `isLoading = computed(() => this.state().status === 'loading')`, `quote = computed(() => ...)` e `errorType = computed(() => ...)`, método `loadQuote()` que define `state` para loading, assina `QuoteService.getRandomQuote()` com `takeUntilDestroyed()`, atualiza state para `success` ou `error` conforme resultado; chamar `loadQuote()` no construtor
- [ ] T013 [US1] Criar template em `src/app/quote/feature/quote-container/quote-container.html` usando `<app-quote-card>` com bindings `[isLoading]="isLoading()"`, `[quote]="quote()"`, `[errorType]="errorType()"` e `(refreshClicked)="loadQuote()"`
- [ ] T014 [US1] Criar estilos em `src/app/quote/feature/quote-container/quote-container.scss`
- [ ] T015 [US1] Configurar rotas em `src/app/app.routes.ts`: adicionar `{ path: '', redirectTo: 'home', pathMatch: 'full' }` e `{ path: 'home', loadComponent: () => import('./quote/feature/quote-container/quote-container').then(m => m.QuoteContainer) }`
- [ ] T016 [US1] Criar testes de US1 em `src/app/quote/feature/quote-container/quote-container.spec.ts`: (1) estado inicial é `loading`, (2) após sucesso estado é `success` com `quote`, (3) `isLoading()` é `false` após sucesso (anti-loading-infinito)

**Checkpoint**: US1 completa e testável de forma independente — loading → citação exibida ✅

---

## Fase 4: User Story 2 — Atualização via Refresh (P2)

**Objetivo**: Botão Refresh carrega nova citação e fica desabilitado durante o loading.

**Teste Independente**: Com citação exibida, clicar em "Refresh" → loading aparece → botão desabilitado → nova citação exibida → botão reabilitado.

- [ ] T017 [US2] Adicionar testes de US2 em `src/app/quote/feature/quote-container/quote-container.spec.ts`: (1) clicar Refresh com citação exibida → estado volta para `loading`, (2) `isLoading()` é `true` imediatamente após Refresh, (3) após Refresh bem-sucedido nova citação é exibida e `isLoading()` é `false`

**Checkpoint**: US1 e US2 funcionam independentemente — Refresh troca citação, botão desabilita ✅

---

## Fase 5: User Story 3 — Tratamento de Erro e Recuperação (P3)

**Objetivo**: Erros exibem mensagens diferenciadas por tipo; Refresh continua funcionando após erro.

**Teste Independente**: Simular falha de rede → mensagem "Sem conexão..." aparece → clicar Refresh → loading → (sucesso ou novo erro). Repetir para timeout e erro de servidor.

- [ ] T018 [US3] Atualizar bloco de erro em `src/app/quote/ui/quote-card/quote-card.html` com mensagens diferenciadas por `errorType()`: `'no-connection'` → "Sem conexão com a internet. Verifique sua rede e tente novamente.", `'timeout'` → "O serviço demorou demais para responder. Tente novamente.", `'server-error'` → "O serviço está temporariamente indisponível. Tente mais tarde."
- [ ] T019 [US3] Adicionar testes de US3 em `src/app/quote/feature/quote-container/quote-container.spec.ts`: (1) erro `status 0` → `state.errorType === 'no-connection'`, (2) `TimeoutError` → `state.errorType === 'timeout'`, (3) `status 500` → `state.errorType === 'server-error'`, (4) clicar Refresh após qualquer erro → estado volta para `loading`

**Checkpoint**: Todas as US funcionam de forma independente — erros com mensagens corretas e retry ✅

---

## Fase Final: Polimento e Aspectos Transversais

**Objetivo**: Qualidade, acessibilidade e validação final.

- [ ] T020 Verificar acessibilidade em `src/app/quote/ui/quote-card/quote-card.html` e `quote-card.ts`: adicionar `aria-live="polite"` na região de conteúdo dinâmico, garantir que o botão "Refresh" tenha `aria-label` descritivo, e que o indicador de loading seja legível por leitores de tela
- [ ] T021 Executar checklist completo de `specs/001-quote-card/quickstart.md`: `ng test` (todos passam), `ng build` (sem erros), `ng serve` (fluxo principal: loading → citação → refresh → loading → citação)

---

## Dependências e Ordem de Execução

### Dependências entre Fases

- **Setup (Fase 1)**: Sem dependências — pode iniciar imediatamente
- **Fundacional (Fase 2)**: Depende do Setup (T001) — bloqueia todas as user stories
- **US1 (Fase 3)**: Depende da conclusão da Fase 2
- **US2 (Fase 4)**: Depende da US1 completa (T012 implementado)
- **US3 (Fase 5)**: Depende da US1 completa (T010/T012 com estado de erro base)
- **Polimento (Fase Final)**: Depende de todas as US desejadas concluídas

### Dependências Internas por User Story

**US1:**
- T006 (modelos) → T007 (service) → T008 (testes service)
- T006, T007 → T009, T010, T011 (QuoteCard — paralelos entre si)
- T009 → T012 (container importa QuoteCard)
- T012 → T013, T014 (template e estilos do container)
- T012 → T015 (rotas importam container)
- T012 → T016 (testes do container)

**US2:** Depende de T012 (container) — T017 adiciona testes ao spec existente

**US3:** Depende de T010 (template do QuoteCard) — T018 refina o bloco de erro

### Oportunidades de Paralelismo

- **Fase 1**: T002, T003, T004, T005 podem executar em paralelo após T001
- **US1**: T009, T010, T011 (QuoteCard) podem executar em paralelo após Fase 2
- **US1**: T013, T014 podem executar em paralelo após T012
- **US2 e US3**: Podem ser trabalhadas em paralelo por desenvolvedores diferentes após US1

---

## Exemplos de Paralelismo

```bash
# Fase 1 — após T001:
Task: "Criar proxy.conf.json"                    # T002
Task: "Configurar proxyConfig no angular.json"   # T003
Task: "Adicionar provideHttpClient()"            # T004
Task: "Configurar styles.scss"                   # T005

# US1 — após Fase 2:
Task: "Criar quote-card.ts"                      # T009
Task: "Criar quote-card.html"                    # T010
Task: "Criar quote-card.scss"                    # T011
```

---

## Estratégia de Implementação

### MVP Primeiro (Apenas US1)

1. Completar Fase 1: Setup
2. Completar Fase 2: Fundacional (CRÍTICO — bloqueia tudo)
3. Completar Fase 3: US1
4. **PARAR E VALIDAR**: `ng test` + `ng serve` → confirmar loading e citação exibida
5. Demonstrar MVP se aprovado

### Entrega Incremental

1. Setup + Fundacional → dados prontos
2. US1 → citação exibida (**MVP!**) → validar e demonstrar
3. US2 → Refresh funciona → validar
4. US3 → Erros com mensagens corretas → validar
5. Polimento → acessibilidade e checklist final

---

## Notas

- `[P]` = arquivos distintos, sem dependências entre si
- `[Story]` mapeia a tarefa para rastreabilidade com a spec
- Cada user story é completável e testável de forma independente
- `ng test` DEVE passar sem falhas antes de avançar de fase
- Committar após cada tarefa ou grupo lógico
- Parar em qualquer checkpoint para validar a story de forma independente

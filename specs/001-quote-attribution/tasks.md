# Tasks: Quote Card — Atribuição ZenQuotes

**Input**: Design documents from `/specs/001-quote-attribution/`
**Prerequisites**: plan.md ✅ | spec.md ✅ | research.md ✅ | data-model.md ✅

**Tests**: Feature puramente visual — sem lógica de dados. Por Princípio III da constituição,
testes NÃO são obrigatórios. T001 é incluído como boa prática de compliance
(evita remoção acidental do requisito em futuras refatorações).

**Organization**: 1 User Story (P1). Sem setup ou fundação — projeto Angular já configurado,
componente `QuoteCard` já existente.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Pode rodar em paralelo (arquivos diferentes, sem dependências)
- **[Story]**: User story à qual a task pertence (US1)

---

## Phase 1: User Story 1 — Visualização da Atribuição (Priority: P1) 🎯 MVP

**Goal**: Exibir o texto "Inspirational quotes provided by ZenQuotes API" como link clicável
para `https://zenquotes.io`, visível nos três estados da tela (loading, sucesso, erro),
atendendo ao requisito obrigatório dos termos de uso da ZenQuotes API.

**Independent Test**: Acessar a tela do Quote Card e verificar que o link de atribuição
está visível com o texto correto — no estado de sucesso (citação carregada), no estado de
erro (simular falha de rede) e no estado de loading (inspecionar DOM antes da resposta).

### Tests para User Story 1 (OPCIONAL — boa prática de compliance) ⚠️

> **NOTA: Escrever antes da implementação; verificar que FALHA antes de implementar T002 e T003**

- [x] T001 [P] [US1] Criar `src/app/quote/ui/quote-card/quote-card.spec.ts` com 7 cenários: (1) elemento `<a class="card__attribution">` renderiza; (2) texto é "Inspirational quotes provided by ZenQuotes API"; (3) `href` é "https://zenquotes.io"; (4) `target` é "_blank"; (5) `rel` é "noopener noreferrer"; (6) atribuição visível com `isLoading=true`; (7) atribuição visível com `errorType` definido

### Implementação para User Story 1

- [x] T002 [P] [US1] Adicionar `<a class="card__attribution" href="https://zenquotes.io" target="_blank" rel="noopener noreferrer">Inspirational quotes provided by ZenQuotes API</a>` ao final da div `.card` em `src/app/quote/ui/quote-card/quote-card.html`, após o bloco `@if (!isLoading())` do botão

- [x] T003 [P] [US1] Adicionar bloco `&__attribution` ao final do seletor `.card` em `src/app/quote/ui/quote-card/quote-card.scss`: `display: block`, `font-size: 0.7rem`, `color: #666`, `text-align: center`, `text-decoration: underline`, `text-underline-offset: 2px`; pseudo-classes `&:hover { color: #333 }` e `&:focus-visible { outline: 2px solid #1a1a1a; outline-offset: 2px; border-radius: 2px }`

**Checkpoint**: User Story 1 completa — atribuição visível nos 3 estados, link funcional, WCAG AA aprovado

---

## Phase 2: Polish & Validação

**Purpose**: Verificar conformidade com checklist do PR da constituição

- [x] T004 Executar `ng test` e confirmar que todos os testes passam (incluindo T001 se implementado)
- [x] T005 [P] Executar `ng build` e confirmar ausência de erros de compilação
- [ ] T006 [P] Executar `ng serve`, inspecionar a tela nos 3 estados e confirmar visibilidade e contraste da atribuição

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (US1)**: Pode iniciar imediatamente — sem bloqueios
- **Phase 2 (Polish)**: Depende da conclusão da Phase 1

### Within User Story 1

- T001 (test): Escrever ANTES de T002 e T003; verificar que FALHA
- T002 e T003: Independentes entre si — podem rodar em paralelo
- T002 + T003 concluídos → executar T001 novamente para confirmar que PASSA

### Parallel Opportunities

- T001, T002 e T003 são arquivos diferentes → paralelizáveis se não for TDD
- T005 e T006 são independentes entre si → paralelizáveis após T004

---

## Parallel Example: User Story 1

```bash
# (se não TDD) Implementar HTML, SCSS e Testes juntos:
Task: T002 — Adicionar link de atribuição em quote-card.html
Task: T003 — Adicionar estilos em quote-card.scss
Task: T001 — Criar quote-card.spec.ts

# Após T001, T002, T003 concluídos:
Task: T004 — ng test
```

---

## Implementation Strategy

### MVP (User Story 1 Only)

1. Completar Phase 1: T001 → T002 + T003
2. **PARAR e VALIDAR**: `ng test`, `ng build`, `ng serve`
3. Feature completa — pronta para PR

### Checklist de PR (Constituição, Princípio VI)

- [ ] `ng test` — todos os testes passam
- [ ] `ng build` — sem erros de compilação
- [ ] `ng serve` — atribuição visível nos 3 estados localmente
- [ ] `spec.md` e `plan.md` incluídos no mesmo PR

---

## Notes

- [P] = arquivos diferentes, sem dependências
- T001 é OPCIONAL mas recomendado — ver research.md decisão 5
- T002 e T003 são as únicas alterações funcionais; todo o restante é validação
- Sem alteração em services, modelos ou componentes smart

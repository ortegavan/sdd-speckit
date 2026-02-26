# Implementation Plan: Quote Card — Atribuição ZenQuotes

**Branch**: `001-quote-attribution` | **Date**: 2026-02-26 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-quote-attribution/spec.md`

## Summary

Adicionar o texto de atribuição "Inspirational quotes provided by ZenQuotes API" como link
clicável ao componente `QuoteCard`, visível nos três estados da tela (loading, sucesso, erro),
atendendo ao requisito obrigatório dos termos de uso da ZenQuotes API.

A implementação é puramente visual: modifica apenas o template HTML e o SCSS do componente
dumb existente, sem alterações de modelo, serviço ou lógica de estado.

## Technical Context

**Language/Version**: TypeScript ~5.9
**Primary Dependencies**: Angular ^21.1, RxJS ~7.8
**Storage**: N/A
**Testing**: Vitest ^4.0 (via `ng test`)
**Target Platform**: Web (SPA Angular, desktop e mobile)
**Project Type**: Web application
**Performance Goals**: N/A — elemento estático
**Constraints**: WCAG 2.1 AA (contraste mínimo 4.5:1 para texto normal)
**Scale/Scope**: 1 componente modificado, 1 arquivo de teste criado

## Constitution Check

| Princípio | Status | Observação |
|-----------|--------|------------|
| I — Arquitetura: dumb em `ui/`, sem dependências externas | PASS | Modificação exclusiva em `quote/ui/quote-card/` |
| I — Arquivos `.ts`, `.html`, `.scss` separados | PASS | Mantidos separados; sem inline |
| II — Estado explícito (loading / success / error) | PASS | Sem alteração de estado; elemento sempre visível |
| III — Testes para features com lógica de dados | PASS* | Sem lógica de dados; teste de existência criado como boa prática |
| IV — Contraste suficiente (WCAG AA) | PASS | `#666` sobre branco = 5.74:1 (min. 4.5:1) |
| IV — Link com suporte a teclado e foco visível | PASS | `<a>` nativo com estilo `:focus-visible` |
| V — Sem novos assets ou fontes globais | PASS | Sem novos assets |
| VI — `spec.md` e `plan.md` no mesmo PR | PASS | Ambos incluídos neste branch |

*Constituição exige testes para componentes smart e lógica de dados; componente é dumb e
sem lógica. Teste incluído por boas práticas de compliance.

## Project Structure

### Documentation (this feature)

```text
specs/001-quote-attribution/
├── plan.md              # Este arquivo
├── research.md          # Fase 0 — decisões de design
├── data-model.md        # Fase 1 — sem alteração de modelo
└── tasks.md             # Fase 2 — gerado por /speckit.tasks
```

### Source Code (repository root)

```text
src/app/quote/
└── ui/
    └── quote-card/
        ├── quote-card.html      # MODIFICAR — adicionar <a class="card__attribution">
        ├── quote-card.scss      # MODIFICAR — adicionar estilo &__attribution
        └── quote-card.spec.ts   # CRIAR — teste de existência da atribuição
```

**Structure Decision**: Modificação cirúrgica dentro do componente dumb existente.
Nenhum novo componente, serviço ou arquivo de modelo necessário.

---

## Phase 0: Research

Completa. Ver [research.md](research.md) para todas as decisões e justificativas.

Resumo das decisões:
1. Atribuição fora dos blocos `@if` — sempre visível nos três estados
2. `rel="noopener noreferrer"` no link externo
3. `color: #666` — aprovado WCAG AA (5.74:1)
4. Texto completo como link (`<a>` envolve toda a frase)
5. Teste de existência em `quote-card.spec.ts`

---

## Phase 1: Design & Contracts

### Contratos de Interface

Nenhum contrato de API público alterado. O componente `QuoteCard` não expõe novas entradas
(`input()`) ou saídas (`output()`): a atribuição é puramente interna ao template.

### Implementação HTML (`quote-card.html`)

Adicionar ao final da div `.card`, após o bloco `@if (!isLoading())` do botão:

```html
<a
  class="card__attribution"
  href="https://zenquotes.io"
  target="_blank"
  rel="noopener noreferrer"
>Inspirational quotes provided by ZenQuotes API</a>
```

**Posição final dentro de `.card`:**

```
.card
├── @if (isLoading()) { ... }
├── @else if (quote()) { ... }
├── @else if (errorType()) { ... }
├── @if (!isLoading()) { <button> }
└── <a class="card__attribution"> ← NOVO (sempre visível)
```

### Implementação SCSS (`quote-card.scss`)

Adicionar dentro do bloco `.card { ... }`:

```scss
&__attribution {
  display: block;
  font-size: 0.7rem;
  color: #666;
  text-align: center;
  text-decoration: underline;
  text-underline-offset: 2px;

  &:hover {
    color: #333;
  }

  &:focus-visible {
    outline: 2px solid #1a1a1a;
    outline-offset: 2px;
    border-radius: 2px;
  }
}
```

### Implementação de Teste (`quote-card.spec.ts`)

```text
Cenários a cobrir:
1. Atribuição renderiza com texto correto
2. Atribuição tem href="https://zenquotes.io"
3. Atribuição tem target="_blank"
4. Atribuição tem rel="noopener noreferrer"
5. Atribuição está visível no estado de loading
6. Atribuição está visível no estado de sucesso
7. Atribuição está visível no estado de erro
```

### Quickstart

Nenhum novo comando de setup necessário. Para testar a implementação:

```bash
ng serve     # Verificar visualmente nos 3 estados
ng test      # Executar testes headless
ng build     # Confirmar sem erros de compilação
```

Para verificar WCAG manualmente: inspecionar elemento `<a class="card__attribution">` e
confirmar contraste com ferramentas de acessibilidade do browser (DevTools → Accessibility).

# Research: Quote Card — Atribuição ZenQuotes

**Branch**: `001-quote-attribution` | **Date**: 2026-02-26

## Decisões de Design

---

### 1. Posicionamento da Atribuição

**Decision**: Adicionar o elemento de atribuição diretamente no template `quote-card.html`, dentro da div `.card`, fora de todos os blocos `@if` condicionais — ao final, após o botão Refresh.

**Rationale**: O requisito FR-003 exige visibilidade nos três estados (loading, sucesso, erro). Colocar o elemento fora dos blocos `@if` garante isso sem duplicar markup. O botão Refresh já usa esse padrão (`@if (!isLoading())`), mas a atribuição vai além — permanece visível também durante o loading.

**Alternatives considered**:
- Dentro de cada bloco `@if` separadamente: duplica markup, difícil de manter.
- No `quote-container.html`: rompe encapsulamento do componente dumb; a atribuição é parte visual do card.

---

### 2. Segurança do Link Externo

**Decision**: Usar `rel="noopener noreferrer"` no elemento `<a>` com `target="_blank"`.

**Rationale**: Links externos com `target="_blank"` sem `rel="noopener"` expõem a página original via `window.opener` (tab-napping). O atributo `noopener` elimina essa vulnerabilidade. `noreferrer` complementa ao não transmitir o referrer para o destino.

**Alternatives considered**:
- Omitir `rel`: risco de segurança documentado (OWASP).
- Usar apenas `noopener` sem `noreferrer`: funcional, mas `noreferrer` implica `noopener` em navegadores modernos e adiciona privacidade.

---

### 3. Cor e Contraste (WCAG AA)

**Decision**: Usar `color: #666666` para o texto de atribuição sobre o fundo do card.

**Rationale**: O fundo do card é `rgba(255, 255, 255, 0.82)` com `backdrop-filter: blur(12px)` — efetivamente branco para fins de contraste. A cor `#666666` sobre branco tem razão de contraste de **5.74:1**, aprovada no critério WCAG 2.1 AA para texto normal (exige mínimo 4.5:1). A cor é coerente com o tom geral da UI que usa `#555` e `#444` para textos secundários.

**Alternatives considered**:
- `#888888`: 3.54:1 — reprovada no WCAG AA para texto normal.
- `#555555`: 7.0:1 — aprovada, mas visualmente próxima ao texto do autor (`#444`).

---

### 4. Escopo do Link

**Decision**: O texto completo "Inspirational quotes provided by ZenQuotes API" é o conteúdo do link `<a>`.

**Rationale**: Interpretar FR-002 ("o texto de atribuição DEVE ser apresentado como um link clicável") como a totalidade do texto sendo o link. Isso maximiza a área clicável e evita ambiguidade sobre qual parte do texto é interativa.

**Alternatives considered**:
- Apenas "ZenQuotes API" como link, com o restante como texto plano: menor área clicável; exige elemento `<p>` com texto misto.

---

### 5. Testes

**Decision**: Criar `quote-card.spec.ts` com um teste de existência verificando que o link de atribuição renderiza com os atributos corretos (`href`, `target`, `rel`) e com o texto esperado.

**Rationale**: A constituição (Princípio III) exige testes para componentes smart e features com lógica de dados. Este componente é dumb e a feature não possui lógica de dados. Contudo, um teste de existência previne remoção acidental do elemento em futuras refatorações, tornando o requisito de compliance verificável automaticamente.

**Alternatives considered**:
- Sem testes: compatível com a letra da constituição para features puramente visuais, mas sem proteção automática do requisito de compliance.

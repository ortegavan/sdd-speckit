# Plano de Implementação: Quote Card

**Branch**: `001-quote-card` | **Data**: 2026-02-26 | **Spec**: [spec.md](spec.md)
**Input**: Especificação da feature em `specs/001-quote-card/spec.md`

## Resumo

Tela única que exibe uma citação aleatória obtida da API ZenQuotes (zenquotes.io). O usuário
pode solicitar nova citação via botão "Refresh". Os estados de loading, sucesso e erro são
explícitos e gerenciados por Signals. Mensagens de erro são diferenciadas por tipo de falha
(sem conexão, timeout, servidor) com timeout de 10 segundos.

## Contexto Técnico

**Linguagem/Versão**: TypeScript ~5.9 / Angular ^21.1
**Dependências Principais**: Angular HttpClient, RxJS ~7.8, Angular Router
**Storage**: N/A
**Testes**: Vitest ^4.0 (via `ng test`)
**Plataforma Alvo**: Web browser — SPA Angular
**Tipo de Projeto**: Web application (SPA)
**Performance**: Timeout de 10s na chamada à API ZenQuotes
**Constraints**: Sem libs adicionais; CORS resolvido via proxy dev; assets pré-existentes
**Escopo**: Feature isolada — 1 tela, 1 smart, 1 dumb, 1 service

## Constitution Check

*GATE: Deve passar antes da implementação. Reavaliado após design.*

| Princípio | Gate | Status |
|---|---|---|
| I. Arquitetura | `QuoteCard` dumb em `quote/ui/`; `QuoteContainer` smart em `quote/feature/`; `QuoteService` em `quote/data/`; arquivos `.ts`/`.html`/`.scss` separados; sem `standalone: true` explícito; sem HTTP em componentes | ✅ |
| II. Estado | `QuoteState` explícito (`loading`/`success`/`error`) via Signals; RxJS somente na chamada HTTP; sem `effect()` sem justificativa | ✅ |
| III. Qualidade | Testes obrigatórios: `QuoteService` (HTTP mock) e `QuoteContainer` (loading/sucesso/erro/retry/anti-loading-infinito) | ✅ |
| IV. Acessibilidade | Mensagens de erro textuais por tipo; botão "Refresh" com texto claro e `[disabled]` durante loading; contraste e foco a validar no PR | ✅ |
| V. Assets | `background.jpg` em `/public` (pré-existente, não substituir); fonte Outfit em `styles.scss` global; sem novos assets | ✅ |
| VI. Escopo | PR inclui spec + plan + implementação; checklist `ng test` / `ng build` / `ng serve` | ✅ |

> ⚠️ O arquivo `specs/prototypes/quote-card.png` não foi localizado no repositório.
> Confirme se o protótipo precisa ser adicionado antes da implementação da UI.
>
> ⚠️ A spec menciona `background.jpg`; o arquivo em `/public` é `background.jpg` (correto).
> O input do usuário mencionou `background.png` — usar `background.jpg` conforme o asset real.

## Estrutura do Projeto

### Documentação (esta feature)

```text
specs/001-quote-card/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── quote-card.contract.md
├── checklists/
│   └── requirements.md
└── tasks.md
```

### Código-fonte (raiz do repositório)

```text
src/app/
├── quote/
│   ├── data/
│   │   ├── quote.model.ts           # Quote, ZenQuoteDto, QuoteErrorType, QuoteState
│   │   └── quote.service.ts         # HttpClient, timeout 10s, mapeamento DTO → modelo
│   ├── feature/
│   │   └── quote-container/
│   │       ├── quote-container.ts
│   │       ├── quote-container.html
│   │       └── quote-container.scss
│   └── ui/
│       └── quote-card/
│           ├── quote-card.ts
│           ├── quote-card.html
│           └── quote-card.scss
├── app.config.ts                    # adicionar provideHttpClient()
├── app.routes.ts                    # lazy load QuoteContainer + redirect '' → 'home'
├── app.html
└── app.scss                         # background.jpg + centralização vertical

proxy.conf.json                      # /api → https://zenquotes.io (dev CORS)
```

**Decisão de estrutura**: SPA Angular com feature isolada em `src/app/quote/`, seguindo
a separação `data/` / `feature/` / `ui/` da Constituição (Princípio I).

## Decisões de Design

### Modelo de Estado (Signals)

`QuoteContainer` mantém um único `signal<QuoteState>` com três variantes discriminadas.
Signals computados (`isLoading`, `quote`, `errorType`) são passados como inputs ao `QuoteCard`.

```typescript
// Fluxo de estado
loading → success  (requisição OK)
loading → error    (falha: rede / timeout / servidor)
success → loading  (usuário clica Refresh)
error   → loading  (usuário clica Refresh)
```

### Integração ZenQuotes

- Endpoint (dev, via proxy): `GET /api/random`
- Proxy redireciona para `https://zenquotes.io/api/random`
- Resposta: `[{ q: string, a: string, h: string }]`
- Mapeamento: `q → text`, `a → author` (fallback `'Autor desconhecido'` se vazio)
- Timeout: `timeout(10_000)` do RxJS

### Detecção de Tipo de Erro

| Condição | `QuoteErrorType` |
|---|---|
| `HttpErrorResponse.status === 0` | `'no-connection'` |
| `TimeoutError` (RxJS) | `'timeout'` |
| Outros | `'server-error'` |

### Roteamento

```typescript
// app.routes.ts
{ path: '', redirectTo: 'home', pathMatch: 'full' },
{
  path: 'home',
  loadComponent: () =>
    import('./quote/feature/quote-container/quote-container')
      .then(m => m.QuoteContainer),
},
```

### Proxy de Desenvolvimento (CORS)

```json
// proxy.conf.json
{
  "/api": {
    "target": "https://zenquotes.io",
    "changeOrigin": true,
    "secure": true
  }
}
```

Referência no `angular.json` em `architect.serve.options`:
```json
"proxyConfig": "proxy.conf.json"
```

### Estilos Globais

`src/styles.scss` — adicionar:
```scss
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600&display=swap');

* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: 'Outfit', sans-serif;
  min-height: 100vh;
  background: url('/background.jpg') center/cover no-repeat fixed;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

> Outfit já é a fonte global do projeto — confirmar se o `@import` já existe em
> `styles.scss` antes de adicionar novamente.

### Testes

**QuoteService** (`quote.service.spec.ts`):
- Resposta OK → mapeia para `Quote` correto
- Autor vazio → retorna `'Autor desconhecido'`
- `status === 0` → `QuoteErrorType` `'no-connection'`
- `TimeoutError` → `QuoteErrorType` `'timeout'`
- `status 500` → `QuoteErrorType` `'server-error'`

**QuoteContainer** (`quote-container.spec.ts`):
- Estado inicial é `loading`
- Após sucesso: `status === 'success'`, `isLoading() === false` (anti-loading-infinito)
- Após erro de rede: `status === 'error'`, `errorType === 'no-connection'`
- Após erro de timeout: `status === 'error'`, `errorType === 'timeout'`
- Após erro de servidor: `status === 'error'`, `errorType === 'server-error'`
- Clique em Refresh após erro: volta para `loading`

## Complexity Tracking

> Nenhuma violação constitucional identificada. Seção não aplicável.

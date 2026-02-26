# Contrato de Componente: QuoteCard

**Branch**: `001-quote-card` | **Data**: 2026-02-26
**Tipo**: Contrato de UI — interface entre QuoteContainer (smart) e QuoteCard (dumb)

---

## QuoteCard (Dumb / Presentational)

**Localização**: `src/app/quote/ui/quote-card/quote-card.ts`
**Change Detection**: `OnPush`
**Standalone**: sim (implícito — sem `standalone: true` explícito)

### Inputs

| Input | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `isLoading` | `boolean` | Sim | Quando `true`, exibe indicador de loading e oculta citação/erro |
| `quote` | `Quote \| null` | Não | Citação a exibir; `null` quando loading ou em erro |
| `errorType` | `QuoteErrorType \| null` | Não | Tipo do erro para seleção da mensagem; `null` quando não há erro |

### Outputs

| Output | Tipo de payload | Descrição |
|---|---|---|
| `refreshClicked` | `void` | Emitido quando o usuário clica no botão "Refresh" |

### Estados de Exibição

| Condição | O que exibir |
|---|---|
| `isLoading === true` | Indicador de loading (texto + spinner ou equivalente); botão Refresh desabilitado |
| `isLoading === false` e `quote !== null` | Texto da citação + autor; botão Refresh habilitado |
| `isLoading === false` e `errorType !== null` | Mensagem de erro correspondente ao `errorType`; botão Refresh habilitado |

### Mensagens de erro por `errorType`

| `errorType` | Mensagem |
|---|---|
| `'no-connection'` | "Sem conexão com a internet. Verifique sua rede e tente novamente." |
| `'timeout'` | "O serviço demorou demais para responder. Tente novamente." |
| `'server-error'` | "O serviço está temporariamente indisponível. Tente mais tarde." |

### Restrições

- NÃO injetar nenhum service ou dependência externa.
- NÃO fazer chamadas HTTP ou manipular estado global.
- NÃO usar `ChangeDetectionStrategy.Default`.
- Todos os dados recebidos via `input()`; todos os eventos emitidos via `output()`.

---

## QuoteContainer (Smart / Container)

**Localização**: `src/app/quote/feature/quote-container/quote-container.ts`
**Rota**: `home` (lazy loaded)

### Responsabilidades

- Injetar `QuoteService` via `inject()`.
- Iniciar busca de citação no carregamento (`ngOnInit` ou constructor com `loadQuote()`).
- Manter o `signal<QuoteState>` e expor signals computados para o QuoteCard.
- Receber o evento `refreshClicked` do QuoteCard e chamar `loadQuote()`.
- Garantir que `isLoading` seja `false` após qualquer resolução (sucesso ou erro).

### Signals computados expostos ao template

| Signal | Derivado de | Uso |
|---|---|---|
| `isLoading` | `state().status === 'loading'` | Repassado para `[isLoading]` do QuoteCard |
| `quote` | `state().status === 'success' ? state().quote : null` | Repassado para `[quote]` do QuoteCard |
| `errorType` | `state().status === 'error' ? state().errorType : null` | Repassado para `[errorType]` do QuoteCard |

---

## QuoteService

**Localização**: `src/app/quote/data/quote.service.ts`

### Método público

```
getRandomQuote(): Observable<Quote>
```

- Chama `GET /api/random` (proxy redireciona para ZenQuotes em dev).
- Aplica `timeout(10_000)`.
- Mapeia DTO `ZenQuoteDto[]` para `Quote`.
- Lança erro tipado (`QuoteErrorType`) via `catchError` para o container decidir a mensagem.

> O container assina o Observable e atualiza o `QuoteState` conforme o resultado.

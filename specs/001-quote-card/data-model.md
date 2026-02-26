# Data Model: Quote Card

**Branch**: `001-quote-card` | **Data**: 2026-02-26

## Entidades do Domínio

### Quote

Representa uma citação exibida ao usuário.

| Campo | Tipo | Obrigatório | Regras |
|---|---|---|---|
| `text` | `string` | Sim | Não vazio; conteúdo da citação |
| `author` | `string` | Não | Se ausente ou vazio, exibir `"Autor desconhecido"` |

```typescript
// src/app/quote/data/quote.model.ts
export interface Quote {
  text: string;
  author: string;
}
```

---

### ZenQuoteDto

DTO da resposta bruta da API ZenQuotes. Não deve vazar além da camada `data/`.

| Campo | Tipo | Descrição |
|---|---|---|
| `q` | `string` | Texto da citação (mapeia para `Quote.text`) |
| `a` | `string` | Autor (mapeia para `Quote.author`) |
| `h` | `string` | HTML gerado — **ignorado** |

```typescript
export interface ZenQuoteDto {
  q: string;
  a: string;
  h: string;
}
```

**Mapeamento**:
```typescript
function mapDto(dto: ZenQuoteDto): Quote {
  return {
    text: dto.q,
    author: dto.a?.trim() || 'Autor desconhecido',
  };
}
```

---

### QuoteErrorType

Tipo discriminado dos erros possíveis na busca de citações.

```typescript
export type QuoteErrorType =
  | 'no-connection'   // sem rede (HttpErrorResponse status === 0)
  | 'timeout'         // TimeoutError RxJS (> 10s sem resposta)
  | 'server-error';   // HTTP >= 400 ou erro desconhecido
```

**Mensagens por tipo** (usadas pelo container ao construir o estado de erro):

| Tipo | Mensagem ao usuário |
|---|---|
| `no-connection` | "Sem conexão com a internet. Verifique sua rede e tente novamente." |
| `timeout` | "O serviço demorou demais para responder. Tente novamente." |
| `server-error` | "O serviço está temporariamente indisponível. Tente mais tarde." |

---

### QuoteState

União discriminada que representa o estado completo da tela.
Exatamente um estado ativo por vez.

```typescript
export type QuoteState =
  | { status: 'loading' }
  | { status: 'success'; quote: Quote }
  | { status: 'error'; errorType: QuoteErrorType; message: string };
```

**Transições de estado**:

```
[inicial] → loading
loading   → success  (requisição bem-sucedida)
loading   → error    (falha: rede / timeout / servidor)
success   → loading  (usuário clica em Refresh)
error     → loading  (usuário clica em Refresh)
```

---

## Localização dos Arquivos

```text
src/app/quote/data/
├── quote.model.ts    # Quote, ZenQuoteDto, QuoteErrorType, QuoteState
└── quote.service.ts  # QuoteService (HttpClient, timeout, mapeamento)
```

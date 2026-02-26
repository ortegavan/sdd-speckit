# Research: Quote Card

**Branch**: `001-quote-card` | **Data**: 2026-02-26

## 1. API ZenQuotes

**Decisão**: Usar `GET https://zenquotes.io/api/random`

**Formato de resposta**:
```json
[{ "q": "texto da citação", "a": "Autor", "h": "<blockquote>...</blockquote>" }]
```

- Sempre retorna um array de um elemento.
- `q` → texto da citação; `a` → autor; `h` → HTML ignorado.
- Sem autenticação; pública e gratuita.
- Campos `q` e `a` podem ser strings vazias em casos raros → tratar como autor desconhecido.

**CORS**: ZenQuotes não inclui cabeçalhos CORS — chamadas diretas do browser são bloqueadas.
Solução para dev: proxy reverso via `proxy.conf.json` do Angular CLI.
Alternativas consideradas: JSONP (não suportado pela API), servidor backend intermediário
(fora do escopo mínimo definido).

**Rate limiting**: A API pública limita requisições por IP. Excesso retorna HTTP 429.
Tratamento: mapeado como 'server-error' (sem distinção extra para não complexificar).

---

## 2. CORS em Desenvolvimento — Proxy Angular

**Decisão**: `proxy.conf.json` na raiz, referenciado no `angular.json`.

```json
{
  "/api": {
    "target": "https://zenquotes.io",
    "changeOrigin": true,
    "secure": true
  }
}
```

O serviço chama `/api/random` — o proxy o redireciona para
`https://zenquotes.io/api/random`. Sem path rewrite necessário.

**angular.json** — adicionar em `architect.serve.options`:
```json
"proxyConfig": "proxy.conf.json"
```

**Alternativas consideradas**: variável de ambiente com URL de produção (requereria backend
para CORS em prod — fora de escopo). O proxy resolve o problema no escopo de dev definido.

---

## 3. Timeout com RxJS

**Decisão**: operador `timeout(10_000)` do RxJS aplicado na chamada HTTP.

```typescript
import { timeout } from 'rxjs/operators';
// ...
this.http.get<ZenQuoteDto[]>('/api/random').pipe(timeout(10_000))
```

`TimeoutError` do RxJS é detectável no `catchError` via `instanceof TimeoutError`.

**Alternativas consideradas**: `AbortController` via `fetch` nativo (não integra com
RxJS/HttpClient naturalmente), `race` com `timer` (mais verboso sem ganho).

---

## 4. Detecção de Tipo de Erro no Angular HttpClient

| Condição | Tipo Angular | Identificação | Mensagem |
|---|---|---|---|
| Sem conexão | `HttpErrorResponse` com `status === 0` | `error.status === 0` | "Sem conexão com a internet..." |
| Timeout (> 10s) | `TimeoutError` (RxJS) | `error instanceof TimeoutError` | "O serviço demorou demais..." |
| Erro do servidor | `HttpErrorResponse` com `status >= 400` | fallback | "O serviço está indisponível..." |

---

## 5. Signals + RxJS no Angular 21

**Decisão**: `toSignal()` do `@angular/core/rxjs-interop` para integrar o Observable do
serviço com Signals no container.

Padrão adotado no container:
```typescript
state = signal<QuoteState>({ status: 'loading' });

loadQuote() {
  this.state.set({ status: 'loading' });
  this.quoteService.getRandomQuote().subscribe({
    next: quote  => this.state.set({ status: 'success', quote }),
    error: err   => this.state.set({ status: 'error', ...mapError(err) }),
  });
}
```

Subscriptions gerenciadas via `takeUntilDestroyed()` para evitar memory leaks.

---

## 6. Testes — Vitest + Angular TestBed

**Decisão**: `HttpTestingController` (do `@angular/common/http/testing`) para testes da
service; `TestBed` com `provideHttpClient` + `provideHttpClientTesting` para injeção.

Para o container: `TestBed` com service mockado via `jasmine.createSpyObj` ou mock manual
com `Subject`/`throwError`.

**Referência de padrão**:
```typescript
// Service test
const req = httpTesting.expectOne('/api/random');
req.flush([{ q: 'texto', a: 'Autor', h: '' }]);
```

```typescript
// Container test — garantia anti-loading-infinito
expect(component.state().status).toBe('loading');
mockService.getRandomQuote.and.returnValue(of(mockQuote));
component.loadQuote();
expect(component.state().status).toBe('success');
// loading DEVE ser false após sucesso
expect(component.isLoading()).toBe(false);
```

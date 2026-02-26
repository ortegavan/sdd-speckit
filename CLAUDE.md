# sdd-speckit Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-02-26

## Active Technologies

- Angular ^21.1 (standalone components, Signals, HttpClient, Router)
- TypeScript ~5.9
- RxJS ~7.8 (HTTP, timeout operator)
- Vitest ^4.0 (testes headless via `ng test`)
- npm ^11.6

## Project Structure

```text
src/app/
├── quote/
│   ├── data/        # models, service (HttpClient)
│   ├── feature/     # smart components (container)
│   └── ui/          # dumb components (presentational, OnPush)
├── app.config.ts    # providers globais (provideHttpClient, provideRouter)
├── app.routes.ts    # rotas lazy-loaded
└── styles.scss      # estilos e fonte globais (Outfit)

public/              # assets estáticos (background.jpg, favicon.ico)
proxy.conf.json      # proxy dev: /api → https://zenquotes.io
```

## Commands

```bash
ng serve    # dev server com proxy CORS (http://localhost:4200)
ng test     # testes headless via Vitest
ng build    # build de produção
```

## Code Style

- Componentes standalone implícitos (sem `standalone: true`)
- Arquivos `.ts`, `.html`, `.scss` separados (sem inline)
- Dumb: `input()` / `output()` / `OnPush` / sem dependências externas
- Smart: `inject()` / Signals para estado / RxJS para HTTP
- Estado explícito: `loading | success | error`
- Sem libs extras além das já instaladas

## Recent Changes

- **001-quote-card**: Quote Card — exibe citação aleatória (ZenQuotes), refresh, estados loading/erro/sucesso

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->

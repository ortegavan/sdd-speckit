# Quickstart: Quote Card

**Branch**: `001-quote-card`

## Pré-requisitos

- Node.js >= 22
- npm >= 11.6
- Angular CLI >= 21 (`npm i -g @angular/cli`)

## Instalação

```bash
npm install
```

## Desenvolvimento

```bash
ng serve
```

Acesse `http://localhost:4200`. O proxy (`proxy.conf.json`) redireciona
`/api/*` → `https://zenquotes.io/*` — resolvendo o CORS em dev.

> ⚠️ `proxy.conf.json` deve existir na raiz e estar referenciado em `angular.json`
> (`architect.serve.options.proxyConfig: "proxy.conf.json"`).

## Testes

```bash
ng test
```

Executa todos os testes via Vitest em modo headless. O CI deve falhar se qualquer
teste quebrar (conforme Princípio III da constituição).

Testes da feature `quote-card`:

| Arquivo | Cobertura |
|---|---|
| `quote.service.spec.ts` | HTTP mock, mapeamento DTO, timeout, erros de rede/servidor |
| `quote-container.spec.ts` | loading inicial, sucesso, erro por tipo, retry, loading → false após sucesso |

## Build

```bash
ng build
```

Artefatos em `dist/sdd-speckit/`. Para verificar o bundle sem servir:

```bash
ng build --configuration production
```

## Checklist de Validação (PR)

- [ ] `ng test` — todos os testes passam
- [ ] `ng build` — sem erros de compilação
- [ ] `ng serve` → `http://localhost:4200/home`
  - [ ] Loading aparece ao iniciar
  - [ ] Citação é exibida com texto e autor
  - [ ] Botão Refresh carrega nova citação
  - [ ] Botão fica desabilitado durante loading
  - [ ] Com rede desabilitada: mensagem de erro "Sem conexão..."
  - [ ] Background (`background.jpg`) e fonte Outfit visíveis

## Estrutura da Feature

```text
src/app/quote/
├── data/
│   ├── quote.model.ts        # interfaces e tipos de domínio
│   └── quote.service.ts      # integração ZenQuotes
├── feature/
│   └── quote-container/      # componente smart (orquestração)
└── ui/
    └── quote-card/           # componente dumb (apresentação)
```

# Data Model: Quote Card — Atribuição ZenQuotes

**Branch**: `001-quote-attribution` | **Date**: 2026-02-26

## Nenhuma alteração de modelo necessária

A feature de atribuição é puramente presentacional — consiste em um elemento HTML estático
com texto e link fixos. Não há novas entidades, campos, relações ou transições de estado.

## Elementos de UI adicionados

### `card__attribution` (elemento HTML estático)

| Atributo | Valor |
|----------|-------|
| Elemento | `<a>` |
| Texto | `Inspirational quotes provided by ZenQuotes API` |
| `href` | `https://zenquotes.io` |
| `target` | `_blank` |
| `rel` | `noopener noreferrer` |
| Visibilidade | Sempre (todos os estados: loading, sucesso, erro) |

## Modelos existentes — sem alteração

- `Quote` — inalterado
- `QuoteState` — inalterado
- `QuoteErrorType` — inalterado

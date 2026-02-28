# ✨ Inspirational Quotes

Uma aplicação Angular minimalista que exibe citações inspiradoras aleatórias, com suporte a refresh e tratamento de erros.

---

## 📖 Sobre

Este projeto foi criado para ilustrar conceitos de **SDD (Spec-Driven Development)** em um toolkit de referência. Ele serve como exemplo didático de como desenvolver guiado por especificações, com uma arquitetura clara e separação de responsabilidades.

### O que a aplicação faz

- **Exibe citações inspiradoras** vindas da ZenQuotes API
- **Permite atualizar** a citação com um clique
- **Trata erros** de forma elegante
- **Interface responsiva** e acessível

A estrutura do código segue uma organização por features (`data`, `ui`, `feature`), demonstrando na prática os benefícios de Spec-Driven Development em aplicações Angular.

---

## 🚀 Como rodar

### Pré-requisitos

- Node.js (v18+)
- npm

### Instalação e execução

```bash
# Instalar dependências
npm install

# Rodar em modo desenvolvimento
npm start
```

Acesse http://localhost:4200 no navegador.

---

## 🛠️ Comandos úteis

| Comando         | Descrição                          |
| --------------- | ---------------------------------- |
| `npm start`     | Sobe o servidor de desenvolvimento |
| `npm run build` | Gera o build de produção           |
| `npm test`      | Executa os testes unitários        |

---

## 📁 Stack

- **Angular 21** (standalone components, Signals, HttpClient, Router)
- **TypeScript ~5.9**
- **RxJS ~7.8** para HTTP e reatividade
- **Vitest ^4.0** para testes unitários headless
- **ZenQuotes API** como fonte de citações

---

## 🗂️ Estrutura do projeto

```text
src/app/
├── quote/
│   ├── data/        # models, service (HttpClient)
│   ├── feature/     # smart components (container)
│   └── ui/          # dumb components (presentational, OnPush)
├── app.config.ts    # providers globais (provideHttpClient, provideRouter)
├── app.routes.ts    # rotas lazy-loaded
└── styles.scss      # estilos e fonte globais (Outfit)

specs/               # especificações SDD por feature
public/              # assets estáticos (background.jpg, favicon.ico)
proxy.conf.json      # proxy dev: /api → https://zenquotes.io
```

---

## 📄 Medium

Este projeto acompanha um post no Medium sobre **Spec-Driven Development**. A aplicação serve como exemplo prático para os conceitos discutidos no artigo.

---

_Feito com 💜 para demonstrar Spec-Driven Development_

# Feature Specification: Quote Card

**Feature Branch**: `001-quote-card`
**Created**: 2026-02-26
**Status**: Draft
**Protótipo**: `specs/prototypes/quote-card.png`

## Clarifications

### Session 2026-02-26

- Q: Qual API pública de citações deve ser utilizada? → A: ZenQuotes (zenquotes.io)
- Q: O sistema deve fazer retry automático em caso de erro? → A: Não — retry somente manual via botão "Refresh"
- Q: Qual o tempo máximo de espera por uma resposta da API? → A: 10 segundos; após isso, exibir estado de erro
- Q: Mensagens de erro devem diferenciar o tipo de falha? → A: Sim — mensagens distintas para sem conexão, timeout e erro do servidor
- Q: Durante o refresh, a citação atual permanece visível ou é substituída pelo loading? → A: Substituída — a citação atual é ocultada e o loading ocupa seu lugar

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Exibição Inicial da Citação (Priority: P1)

Ao abrir o aplicativo, o usuário vê imediatamente um indicador de carregamento e, em seguida,
uma citação aleatória com texto e nome do autor é exibida sobre o background.

**Why this priority**: É o núcleo do produto — sem a exibição de uma citação, nenhuma outra
história tem valor. Representa o MVP mínimo demonstrável.

**Independent Test**: Pode ser testado abrindo a tela sem qualquer interação; se o loading
aparecer e a citação for exibida com texto e autor, a história está completa.

**Acceptance Scenarios**:

1. **Given** o usuário abre o aplicativo, **When** a tela carrega, **Then** um indicador de
   loading é exibido imediatamente.
2. **Given** o loading está ativo, **When** a citação é obtida com sucesso, **Then** o loading
   desaparece e o texto da citação junto ao nome do autor são exibidos.
3. **Given** a citação está exibida, **When** o usuário observa a tela, **Then** a hierarquia
   visual e o espaçamento correspondem ao protótipo.

---

### User Story 2 - Atualização de Citação via Refresh (Priority: P2)

O usuário pode solicitar uma nova citação clicando no botão "Refresh". Durante o carregamento,
o botão fica desabilitado para evitar requisições simultâneas.

**Why this priority**: Expande o valor da US1 adicionando interatividade. Sem refresh, o
conteúdo é estático e o usuário só obtém uma citação por sessão.

**Independent Test**: Com uma citação já exibida, clicar em "Refresh" e verificar que o loading
aparece, o botão fica desabilitado, e uma nova citação (possivelmente diferente) é exibida ao final.

**Acceptance Scenarios**:

1. **Given** uma citação está exibida, **When** o usuário clica em "Refresh", **Then** a citação
   atual é ocultada, o indicador de loading a substitui e o botão "Refresh" fica desabilitado.
2. **Given** o loading do refresh está ativo, **When** a nova citação é obtida com sucesso,
   **Then** a citação anterior é substituída pela nova e o botão é reabilitado.
3. **Given** o loading está ativo, **When** o usuário tenta clicar em "Refresh", **Then** o
   clique é ignorado (botão desabilitado).

---

### User Story 3 - Tratamento de Erro e Recuperação (Priority: P3)

Quando a busca falha (rede indisponível, serviço fora, etc.), o usuário vê uma mensagem de
erro clara e acionável, e pode tentar novamente usando o mesmo botão "Refresh".

**Why this priority**: Garante resiliência básica. Sem tratamento de erro, qualquer falha de
rede deixa a tela em loading eterno ou em branco — experiência inaceitável.

**Independent Test**: Simulando falha de rede, verificar que a mensagem de erro é exibida com
instrução de retry e que clicar em "Refresh" inicia uma nova tentativa.

**Acceptance Scenarios**:

1. **Given** a busca está em andamento, **When** ocorre um erro (rede, timeout, servidor),
   **Then** o loading desaparece e uma mensagem de erro clara e acionável é exibida.
2. **Given** o estado de erro está visível, **When** o usuário clica em "Refresh",
   **Then** o sistema tenta buscar uma nova citação (volta ao estado de loading).
3. **Given** o estado de erro está visível, **When** o usuário lê a mensagem,
   **Then** a mensagem corresponde ao tipo de falha (sem conexão / timeout / servidor) e
   orienta a ação específica a tomar.

---

### Edge Cases

- O que acontece quando a API retorna uma citação sem autor? → Exibir campo de autor vazio ou
  com valor padrão ("Autor desconhecido").
- O que acontece quando o usuário clica em "Refresh" repetidamente antes do carregamento
  terminar? → Ignorado: botão permanece desabilitado durante loading.
- O que acontece quando a segunda requisição (refresh) também falha? → Exibir estado de erro
  novamente, permitindo nova tentativa.
- O que acontece quando a API não responde em 10 segundos? → Cancelar a requisição e exibir
  estado de erro com mensagem de timeout, mantendo o botão "Refresh" disponível.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema DEVE buscar e exibir uma citação aleatória (texto + autor) ao carregar
  a tela, sem interação do usuário.
- **FR-002**: O sistema DEVE exibir um indicador de loading enquanto a citação está sendo
  buscada (na carga inicial e no refresh).
- **FR-003**: O sistema DEVE exibir o texto da citação e o nome do autor quando a busca
  for bem-sucedida.
- **FR-004**: O sistema DEVE exibir mensagens de erro diferenciadas por tipo de falha,
  cada uma indicando o que ocorreu e como proceder:
  - **Sem conexão**: informar que não há conexão com a internet e sugerir verificar a rede.
  - **Timeout** (> 10s sem resposta): informar que o serviço demorou demais e sugerir tentar novamente.
  - **Erro do servidor** (falha na API): informar que o serviço está indisponível e sugerir tentar mais tarde.
- **FR-005**: O sistema DEVE disponibilizar um botão "Refresh" que busca uma nova citação
  aleatória ao ser acionado.
- **FR-006**: O botão "Refresh" DEVE estar desabilitado durante qualquer estado de loading.
- **FR-007**: O sistema DEVE permitir nova tentativa de busca via botão "Refresh" mesmo após
  um erro. O retry é exclusivamente manual — o sistema não tenta novamente de forma automática.
- **FR-008**: A interface visual DEVE corresponder ao protótipo em termos de hierarquia,
  espaçamento e comportamento nos três estados (loading, sucesso, erro).

### Key Entities

- **Quote**: representa uma citação obtida externamente; possui texto (conteúdo da citação)
  e autor (nome de quem disse ou escreveu).
- **QuoteState**: estado atual da tela — `loading` (buscando), `success` (citação disponível)
  ou `error` (falha na busca). Apenas um estado ativo por vez.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Ao abrir o aplicativo, o usuário vê loading e depois uma citação completa
  (texto + autor) sem nenhuma interação — fluxo completo em condições normais de rede.
- **SC-002**: Ao clicar em "Refresh", o usuário obtém uma nova citação; o botão permanece
  inativo durante todo o carregamento e é reativado ao final.
- **SC-003**: Em caso de falha, 100% dos cenários de erro exibem mensagem textual explicativa
  com indicação de ação (não apenas ícone ou cor).
- **SC-004**: O botão "Refresh" funciona para retry após erro em 100% dos casos — o usuário
  nunca fica preso em um estado sem saída.
- **SC-005**: A interface em cada estado (loading, sucesso, erro) corresponde visualmente ao
  protótipo `specs/prototypes/quote-card.png`.

## Assumptions

- A API utilizada é a **ZenQuotes** (zenquotes.io) — pública, gratuita, sem autenticação.
- A fonte Outfit já está configurada globalmente no projeto (não requer setup nesta feature).
- A imagem de background `/public/background.jpg` já existe e não deve ser substituída.
- Uma citação por requisição é suficiente — não há necessidade de paginação ou cache local.
- Não há requisito de autenticação para acessar a API de citações.

# Feature Specification: Quote Card — Atribuição ZenQuotes

**Feature Branch**: `001-quote-attribution`
**Created**: 2026-02-26
**Status**: Draft
**Context**: Adição à feature `001-quote-card` já implementada.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Visualização da Atribuição (Priority: P1)

Ao visualizar a tela do Quote Card, o usuário vê uma linha de crédito indicando que as citações
são fornecidas pela ZenQuotes API, com um link clicável que leva ao site da ZenQuotes. A
atribuição é exibida sempre que o conteúdo da tela está visível — tanto no estado de sucesso
(com citação carregada) quanto no estado de erro.

**Why this priority**: Trata-se de um requisito obrigatório dos termos de uso da API ZenQuotes.
A ausência da atribuição viola o acordo com o provedor de dados, o que pode resultar no bloqueio
do serviço. É a única história desta feature.

**Independent Test**: Basta acessar a tela do Quote Card e verificar que o texto de atribuição
está visível com o link funcional — sem necessidade de nenhuma outra interação.

**Acceptance Scenarios**:

1. **Given** a tela do Quote Card está carregada em estado de sucesso, **When** o usuário
   observa a tela, **Then** o texto "Inspirational quotes provided by ZenQuotes API" está
   visível na tela.
2. **Given** o texto de atribuição está exibido, **When** o usuário clica no link da atribuição,
   **Then** o site da ZenQuotes abre em uma nova aba do navegador.
3. **Given** a tela do Quote Card está no estado de erro, **When** o usuário observa a tela,
   **Then** o texto de atribuição ainda está visível.
4. **Given** a tela do Quote Card está no estado de loading, **When** o usuário observa a tela,
   **Then** o texto de atribuição ainda está visível.

---

### Edge Cases

- O que acontece quando o usuário clica no link de atribuição em um dispositivo que não possui
  navegador padrão? → O comportamento é determinado pelo sistema operacional; a aplicação não
  precisa tratar esse caso.
- O que acontece se o link da ZenQuotes estiver inacessível? → A atribuição é um elemento
  estático de texto/link na interface; o estado do link externo não afeta a exibição.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: A aplicação DEVE exibir o texto "Inspirational quotes provided by ZenQuotes API"
  na tela do Quote Card.
- **FR-002**: O texto de atribuição DEVE ser apresentado como um link clicável que direciona
  o usuário ao site da ZenQuotes (zenquotes.io) em uma nova aba.
- **FR-003**: A atribuição DEVE permanecer visível nos três estados da tela: loading, sucesso
  e erro.
- **FR-004**: O texto e o link de atribuição DEVEM ser legíveis e acessíveis, com contraste
  suficiente sobre o background existente.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: O texto de atribuição está visível em 100% dos estados da tela (loading, sucesso
  e erro) — verificável inspecionando cada estado manualmente.
- **SC-002**: O link da atribuição abre o site da ZenQuotes em nova aba em 100% dos cliques
  em condições normais de uso.
- **SC-003**: A atribuição está presente e corretamente vinculada ao site da ZenQuotes em
  todas as resoluções de tela suportadas pelo projeto.

## Assumptions

- A URL do site da ZenQuotes é `https://zenquotes.io` — padrão do serviço.
- O texto exato da atribuição é "Inspirational quotes provided by ZenQuotes API", conforme
  exigido pelos termos de uso da API.
- O link deve abrir em nova aba para não interromper a experiência do usuário na aplicação.
- O estilo visual da atribuição (tamanho, cor, posição) será definido na fase de planejamento,
  respeitando a identidade visual existente do Quote Card.

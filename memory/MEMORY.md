# SDD SpecKit — Project Memory

## Project Overview
Angular 21 web application (`sdd-speckit`) — spec/feature management tool.
Tech stack: Angular 21, TypeScript 5.9, RxJS 7.8, Vitest 4.x, npm 11.6.

## Constitution
- Location: `.specify/memory/constitution.md`
- Version: 1.0.0 (ratified 2026-02-26)
- 6 principles in Portuguese; governance in Portuguese
- Principles: I. Arquitetura, II. Estado/Reatividade, III. Qualidade, IV. Acessibilidade, V. Assets, VI. Escopo

## Key Conventions (from Constitution)
- Standalone components; NO `standalone: true` explicit; separate .ts/.html/.css files
- Folder layout: `<feature>/ui/` (dumb), `<feature>/feature/` (smart), `<feature>/data/` (services/models)
- Signals for local state; RxJS for async (HTTP/timers)
- Tests MANDATORY for features with data logic (services + smart components)
- Bug fixes MUST include regression test (fail first, then pass)
- Assets in `/public`; global styles in single file (styles.scss or index.html)
- PRs: small, traceable, checklist: ng test / ng build / ng serve

## Spec System
- Templates in `.specify/templates/`
- Feature docs in `specs/<###-feature-name>/`
- Commands: /speckit.specify, /speckit.plan, /speckit.tasks, /speckit.implement, /speckit.clarify, /speckit.analyze, /speckit.checklist, /speckit.taskstoissues

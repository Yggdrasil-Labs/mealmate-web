# MealMate Harness Documentation And Entry Refactor Proposal

**Date:** 2026-04-13

**Goal:** Reorganize MealMate's repository entry points and documentation into a harness-friendly structure that helps humans and agents find the right source of truth quickly, without changing CI or automation in this phase.

## Background

MealMate already has strong repository guidance in `AGENTS.md`, domain knowledge in `docs/design-docs/`, component contracts in `docs/components/`, and historical plans in `docs/plans/`. The current issue is not lack of content; it is that too much of the repository's source-of-truth guidance is concentrated in `AGENTS.md`, while the rest of the docs are not arranged around a clear harness-oriented navigation model.

The target structure is based on the entry-and-document layout used in the reference repository and on the harness engineering principle from OpenAI's article: make the repository itself a reliable operating surface for contributors and agents. In this phase, the emphasis is on documentation architecture and entry points, not on adding scripts, CI checks, or autonomous repair loops.

## Design Principles

### 1. `AGENTS.md` becomes a navigation page

`AGENTS.md` should remain short and operational. It should tell contributors:

- what this repository is for
- which documents to read first
- which documents are the authoritative facts
- what the environment assumptions are
- which commands are commonly used

It should no longer be the only place that carries architecture, frontend implementation rules, business semantics, and planning workflow details.

### 2. Architectural truth moves to top-level docs

Repository-wide structure and dependency boundaries should live in `ARCHITECTURE.md`, not remain embedded inside agent instructions. This file becomes the stable place to explain:

- application layering
- routing and shell structure
- allowed dependency direction
- boundaries between pages, layouts, stores, composables, and utilities

### 3. Frontend implementation rules move to `docs/FRONTEND.md`

Rules that guide day-to-day frontend work should live in a dedicated frontend handbook. This includes:

- Vue 3 + TypeScript conventions
- naming rules
- component/composable/store/page boundaries
- async and validation expectations
- mobile baseline requirements

This keeps frontend practice separate from architecture truth and from agent-specific entry instructions.

### 4. Product and business semantics gain a single entry

MealMate's business language is already documented, but the repository lacks a single entry page that tells people where to look. `docs/PRODUCT_SENSE.md` should fill that role by explaining:

- the purpose of the MealMate web app
- the authoritative domain language
- which business documents to trust first

The detailed content remains in `docs/design-docs/`, which continues to be the source of truth.

### 5. Plans become lifecycle-based

The current `docs/plans/` directory mixes design and implementation history in a flat structure. The new `docs/exec-plans/` layout should organize work by status:

- `docs/exec-plans/active/`
- `docs/exec-plans/completed/`
- `docs/exec-plans/tech-debt-tracker.md`

The purpose is not to rewrite history, but to make active work, completed work, and backlog debt legible at a glance.

### 6. Existing domain and component docs stay where they are

This refactor should not force unnecessary moves for content that already has a natural home. In particular:

- `docs/design-docs/` remains the domain source-of-truth area
- `docs/components/` remains the public component contract area

The new handbook files should index these locations instead of duplicating them.

## Target Layout

```text
AGENTS.md
ARCHITECTURE.md
docs/
├── design-docs/
│   ├── index.md
│   └── core-beliefs.md
├── exec-plans/
│   ├── active/
│   ├── completed/
│   └── tech-debt-tracker.md
├── generated/
│   └── README.md
├── product-specs/
│   └── index.md
├── references/
│   └── README.md
├── DESIGN.md
├── FRONTEND.md
├── PLANS.md
├── PRODUCT_SENSE.md
├── QUALITY_SCORE.md
├── RELIABILITY.md
└── SECURITY.md
```

## Content Mapping

### Files to create

- `ARCHITECTURE.md`
- `docs/DESIGN.md`
- `docs/FRONTEND.md`
- `docs/PLANS.md`
- `docs/PRODUCT_SENSE.md`
- `docs/QUALITY_SCORE.md`
- `docs/RELIABILITY.md`
- `docs/SECURITY.md`
- `docs/design-docs/index.md`
- `docs/design-docs/core-beliefs.md`
- `docs/product-specs/index.md`
- `docs/exec-plans/tech-debt-tracker.md`
- `docs/generated/README.md`
- `docs/references/README.md`

### Files to move

- `docs/plans/2026-03-31-family-profile-design.md`
  -> `docs/exec-plans/completed/2026-03-31-family-profile-design.md`
- `docs/plans/2026-03-31-family-profile-implementation-plan.md`
  -> `docs/exec-plans/completed/2026-03-31-family-profile-implementation-plan.md`

### Files to keep in place but re-index

- `docs/design-docs/mealmate-business-model-design.md`
- `docs/design-docs/mealmate-domain-language-design.md`
- `docs/design-docs/mealmate-web-scope-design.md`
- `docs/components/*.md`

### Files to reshape

- `AGENTS.md`
  - reduce to navigation, reading order, source-of-truth priority, environment facts, common commands, and documentation maintenance rules
- `README.md`
  - keep install and repository overview responsibilities only

## Entry Responsibilities

### `AGENTS.md`

Use when entering the repository as a contributor or agent. It answers:

- what to read first
- where truth lives
- what to avoid

### `ARCHITECTURE.md`

Use when changing routing, shell behavior, layering, store boundaries, or dependency flow.

### `docs/FRONTEND.md`

Use when implementing or reviewing frontend changes.

### `docs/PRODUCT_SENSE.md`

Use when clarifying business language, user-facing purpose, and domain intent.

### `docs/PLANS.md`

Use when starting or updating active work. It explains how to record and move execution plans.

### `docs/DESIGN.md`

Use when adding long-lived design decisions, rather than one-off feature plans.

## Risks And Non-Goals

### Risks

- duplicated guidance if old content is copied instead of indexed
- stale links if document moves are not reflected in entry pages
- over-designed folder structure without enough content to justify it

### Non-goals in this phase

- no CI changes
- no lint or script automation
- no quality scoring implementation beyond documentation
- no security or reliability tooling changes

## Recommended Rollout

1. Create the new directory skeleton and entry files.
2. Rewrite `AGENTS.md` into a concise navigation page.
3. Move historical plan documents into `docs/exec-plans/completed/`.
4. Add cross-links from the new top-level handbooks to existing `docs/design-docs/` and `docs/components/`.
5. Update `README.md` only where repository entry explanations would otherwise conflict.

## Success Criteria

This refactor is successful when:

- a new contributor can find architecture, frontend rules, business context, and plan workflow without reading the entire repository
- `AGENTS.md` becomes shorter and more stable
- plan history is status-oriented instead of flat
- no major source-of-truth content is duplicated unnecessarily

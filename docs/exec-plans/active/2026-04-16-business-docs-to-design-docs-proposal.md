# MealMate Business Docs To Design Docs Proposal

**Date:** 2026-04-16

**Goal:** Move the current business knowledge from `docs/business/` into `docs/design-docs/` as long-lived design documents that better match the repository's documentation structure.

## Why This Change

The repository currently splits long-lived business knowledge across a dedicated `docs/business/` directory while `docs/design-docs/` is defined as the home for stable, cross-module design decisions. The user wants the business material moved under `docs/design-docs/` and no longer preserved in its original location.

To keep the directory semantics coherent, this should not be a raw file move. The business content needs to be reorganized into durable design documents that describe:

- the business model
- the domain language
- the web scope and boundaries

## Proposed Target Files

- `docs/design-docs/mealmate-business-model-design.md`
- `docs/design-docs/mealmate-domain-language-design.md`
- `docs/design-docs/mealmate-web-scope-design.md`

## Mapping

### `docs/business/mealmate-domain-context.md`

Split into:

- `mealmate-business-model-design.md`
  - system nature
  - core loop
  - business stages
  - bounded contexts
- `mealmate-domain-language-design.md`
  - unified terms
  - preferred and disallowed names
  - direct implications on frontend naming and expression

### `docs/business/mealmate-web-scope.md`

Move into:

- `mealmate-web-scope-design.md`
  - repository responsibility
  - target page scope
  - web-first-stage boundaries
  - photo capability boundaries
  - current implementation comparison

### `docs/business/README.md`

Absorb into:

- `docs/design-docs/index.md`
- `docs/PRODUCT_SENSE.md`

## Required Follow-Up Updates

The migration must also update references in:

- `AGENTS.md`
- `README.md`
- `docs/index.md`
- `docs/PRODUCT_SENSE.md`
- `docs/DESIGN.md`
- `docs/FRONTEND.md`

## Success Criteria

This migration is successful when:

- `docs/business/` is no longer needed
- business knowledge is available under `docs/design-docs/`
- entry pages point to the new locations
- the meaning of `docs/design-docs/` remains coherent

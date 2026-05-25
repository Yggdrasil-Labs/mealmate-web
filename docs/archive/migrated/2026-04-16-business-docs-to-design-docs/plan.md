# Business Docs To Design Docs Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Reorganize `docs/business/` into long-lived design documents under `docs/design-docs/`, update all repository entry points to the new locations, and remove the original business directory.

**Architecture:** Convert the current business background files into three durable design documents: business model, domain language, and web scope. Then update every navigation and handbook entry that currently points to `docs/business/` so the repository presents a single coherent path for business context.

**Tech Stack:** Markdown documentation, repository navigation structure

---

### Task 1: Add the new business design documents

**Files:**
- Create: `docs/design-docs/mealmate-business-model-design.md`
- Create: `docs/design-docs/mealmate-domain-language-design.md`
- Create: `docs/design-docs/mealmate-web-scope-design.md`

**Step 1: Write the three new design docs**

Split the current business material by concern:

- business model and bounded contexts
- domain language and naming impact
- web scope and implementation boundaries

**Step 2: Verify the files are discoverable**

Run: `find docs/design-docs -maxdepth 1 -type f | sort`
Expected: the three new business design docs appear alongside the existing index and core beliefs files.

### Task 2: Update design indexes and guidance

**Files:**
- Modify: `docs/design-docs/index.md`
- Modify: `docs/DESIGN.md`

**Step 1: Update `docs/design-docs/index.md`**

List the new business design docs and explain their roles.

**Step 2: Update `docs/DESIGN.md`**

Remove the assumption that business background should stay outside `docs/design-docs/` and clarify that stable business model and scope documents now live here.

### Task 3: Repoint product and docs entry pages

**Files:**
- Modify: `docs/PRODUCT_SENSE.md`
- Modify: `docs/index.md`
- Modify: `AGENTS.md`
- Modify: `docs/FRONTEND.md`

**Step 1: Update `docs/PRODUCT_SENSE.md`**

Point it to the three new design docs instead of `docs/business/`.

**Step 2: Update `docs/index.md` and `AGENTS.md`**

Replace `docs/business/` references with the new business design doc path.

**Step 3: Update `docs/FRONTEND.md`**

Ensure business-language references point to the new domain-language design doc.

### Task 4: Update README and remove the old business directory

**Files:**
- Modify: `README.md`
- Delete: `docs/business/README.md`
- Delete: `docs/business/mealmate-domain-context.md`
- Delete: `docs/business/mealmate-web-scope.md`

**Step 1: Update README references**

Point the documentation and repository-entry sections to `docs/design-docs/` and the new design docs.

**Step 2: Remove the old files**

Delete the original `docs/business/` files once all inbound links are updated.

**Step 3: Remove the directory if empty**

Run: `rmdir docs/business`
Expected: succeeds because all old files are gone.

### Task 5: Verify migration completeness

**Files:**
- Verify: `AGENTS.md`
- Verify: `README.md`
- Verify: `docs/**/*.md`

**Step 1: Search for stale references**

Run: `rg "docs/business" -n AGENTS.md README.md docs src tests`
Expected: no stale references remain.

**Step 2: Run lint**

Run: `source ~/.nvm/nvm.sh && pnpm lint`
Expected: lint passes.

**Step 3: Run type-check**

Run: `source ~/.nvm/nvm.sh && pnpm type-check`
Expected: type-check passes.

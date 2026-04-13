# Harness Documentation And Entry Refactor Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Reorganize repository entry documents and documentation structure so MealMate exposes a clear harness-oriented navigation surface for humans and agents.

**Architecture:** Keep existing domain and component documents as their source-of-truth locations, add top-level handbook and index files, and reduce `AGENTS.md` to a concise repository navigation page. Reorganize plan history into lifecycle-based folders under `docs/exec-plans/` instead of rewriting business or component content.

**Tech Stack:** Markdown, repository documentation structure, Vue frontend architecture conventions already present in this repo

---

### Task 1: Create the new documentation skeleton

**Files:**
- Create: `ARCHITECTURE.md`
- Create: `docs/design-docs/index.md`
- Create: `docs/design-docs/core-beliefs.md`
- Create: `docs/exec-plans/active/.gitkeep`
- Create: `docs/exec-plans/completed/.gitkeep`
- Create: `docs/exec-plans/tech-debt-tracker.md`
- Create: `docs/generated/README.md`
- Create: `docs/product-specs/index.md`
- Create: `docs/references/README.md`
- Create: `docs/DESIGN.md`
- Create: `docs/FRONTEND.md`
- Create: `docs/PLANS.md`
- Create: `docs/PRODUCT_SENSE.md`
- Create: `docs/QUALITY_SCORE.md`
- Create: `docs/RELIABILITY.md`
- Create: `docs/SECURITY.md`

**Step 1: Write the new directory and file skeleton**

Add the new files with short index-oriented content, not full essays.

**Step 2: Verify the tree exists**

Run: `find docs -maxdepth 3 | sort`
Expected: the new `design-docs`, `exec-plans`, `generated`, `product-specs`, and `references` structure appears.

**Step 3: Commit**

```bash
git add ARCHITECTURE.md docs
git commit -m "docs: add harness-oriented documentation skeleton"
```

### Task 2: Move architecture guidance out of `AGENTS.md`

**Files:**
- Modify: `AGENTS.md`
- Modify: `ARCHITECTURE.md`
- Reference: `docs/business/mealmate-domain-context.md`

**Step 1: Write `ARCHITECTURE.md` from the current repository facts**

Cover:
- layering and responsibility boundaries
- dependency direction
- schema routing and shell structure
- page, layout, store, composable, and utils boundaries

**Step 2: Rewrite `AGENTS.md` as a repository entry page**

Keep:
- mission
- suggested reading order
- source-of-truth priority
- environment facts
- common commands
- documentation maintenance rules

Remove deep implementation detail that now belongs in `ARCHITECTURE.md` and `docs/FRONTEND.md`.

**Step 3: Review for duplication**

Read both files and remove repeated paragraphs so each page has a clear purpose.

**Step 4: Commit**

```bash
git add AGENTS.md ARCHITECTURE.md
git commit -m "docs: turn agents file into harness navigation entry"
```

### Task 3: Create the frontend handbook

**Files:**
- Create: `docs/FRONTEND.md`
- Reference: `AGENTS.md`
- Reference: `src/router/app-route-schema.ts`
- Reference: `src/router/app-routes.ts`
- Reference: `src/router/route-normalizer.ts`

**Step 1: Extract frontend implementation conventions**

Document:
- Vue 3 + TypeScript conventions
- naming conventions
- component/composable/store/page boundaries
- async and validation expectations
- mobile baseline

**Step 2: Link to existing source-of-truth docs**

Add references to:
- `docs/components/`
- relevant router files
- domain context when terminology matters

**Step 3: Validate readability**

Read the file top-to-bottom and ensure it acts as a working handbook, not a duplicate dump of `AGENTS.md`.

**Step 4: Commit**

```bash
git add docs/FRONTEND.md
git commit -m "docs: add frontend implementation handbook"
```

### Task 4: Create product, design, and planning entry pages

**Files:**
- Create: `docs/PRODUCT_SENSE.md`
- Create: `docs/DESIGN.md`
- Create: `docs/PLANS.md`
- Create: `docs/design-docs/index.md`
- Create: `docs/design-docs/core-beliefs.md`
- Create: `docs/product-specs/index.md`

**Step 1: Write `docs/PRODUCT_SENSE.md`**

Point to:
- `docs/business/mealmate-web-scope.md`
- `docs/business/mealmate-domain-context.md`

Explain the repository's business language and document priority.

**Step 2: Write `docs/DESIGN.md`**

Explain what belongs in `docs/design-docs/` and what should stay in execution plans instead.

**Step 3: Write `docs/PLANS.md`**

Explain:
- active vs completed plans
- when to create a plan
- how to move plans through the lifecycle

**Step 4: Write directory index pages**

Make the index pages concise and link outward to the specific documents they introduce.

**Step 5: Commit**

```bash
git add docs/PRODUCT_SENSE.md docs/DESIGN.md docs/PLANS.md docs/design-docs docs/product-specs
git commit -m "docs: add product design and planning entry pages"
```

### Task 5: Move historical plans into lifecycle folders

**Files:**
- Move: `docs/plans/2026-03-31-family-profile-design.md`
- Move: `docs/plans/2026-03-31-family-profile-implementation-plan.md`
- Modify: `docs/PLANS.md`

**Step 1: Create completed plan records**

Move the two existing plan files into `docs/exec-plans/completed/`.

**Step 2: Update planning guidance**

Ensure `docs/PLANS.md` explains why historical records now live under `docs/exec-plans/completed/`.

**Step 3: Confirm old links are updated**

Run: `rg "docs/plans|family-profile-design|family-profile-implementation-plan" -n`
Expected: any outdated references are visible and can be updated.

**Step 4: Commit**

```bash
git add docs/PLANS.md docs/exec-plans
git commit -m "docs: reorganize execution plans by lifecycle"
```

### Task 6: Add quality, reliability, security, generated, and reference placeholders

**Files:**
- Create: `docs/QUALITY_SCORE.md`
- Create: `docs/RELIABILITY.md`
- Create: `docs/SECURITY.md`
- Create: `docs/generated/README.md`
- Create: `docs/references/README.md`
- Create: `docs/exec-plans/tech-debt-tracker.md`

**Step 1: Write thin but purposeful placeholder content**

Each file should define:
- what it is for
- what kind of content belongs there
- what is explicitly out of scope for now
- that it is still a placeholder rather than a primary source of truth

**Step 2: Link these files from the relevant entry pages**

Update:
- `AGENTS.md`
- `docs/DESIGN.md`
- `docs/PLANS.md`

**Step 3: Review for false precision**

Do not invent metrics or controls the repo does not yet have. State current intent clearly.

**Step 4: Commit**

```bash
git add docs/QUALITY_SCORE.md docs/RELIABILITY.md docs/SECURITY.md docs/generated docs/references docs/exec-plans/tech-debt-tracker.md
git commit -m "docs: add operational handbook placeholders"
```

### Task 7: Update README only where entry-point overlap exists

**Files:**
- Modify: `README.md`
- Reference: `AGENTS.md`
- Reference: `docs/PRODUCT_SENSE.md`

**Step 1: Compare repository entry responsibilities**

Keep `README.md` focused on:
- project overview
- setup
- common commands
- high-level repo structure

**Step 2: Add lightweight links**

Point readers toward:
- `AGENTS.md`
- `ARCHITECTURE.md`
- `docs/FRONTEND.md`

**Step 3: Verify no duplication explosion**

Check that `README.md` does not become another handbook.

**Step 4: Commit**

```bash
git add README.md
git commit -m "docs: align readme with new documentation entry points"
```

### Task 8: Run documentation verification

**Files:**
- Verify: `AGENTS.md`
- Verify: `ARCHITECTURE.md`
- Verify: `docs/**/*.md`

**Step 1: Run formatting and lint-friendly cleanup**

Run: `source ~/.nvm/nvm.sh && pnpm lint:fix`
Expected: markdown-related fixes and no broken repo-wide formatting issues from touched files.

**Step 2: Run repository-wide text checks**

Run: `rg "TODO|TBD" docs AGENTS.md ARCHITECTURE.md -n`
Expected: only intentional placeholders remain.

**Step 3: Review the final navigation flow manually**

Read in order:
- `AGENTS.md`
- `ARCHITECTURE.md`
- `docs/FRONTEND.md`
- `docs/PRODUCT_SENSE.md`
- `docs/PLANS.md`

Expected: each page has a distinct purpose and points to the right deeper references.

**Step 4: Commit**

```bash
git add AGENTS.md ARCHITECTURE.md docs README.md
git commit -m "docs: finalize harness-oriented repository entry flow"
```

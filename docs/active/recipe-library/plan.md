---
id: plan-recipe-library
status: in-progress
owner: codex
created: 2026-04-16
updated: 2026-04-25
---

# Recipe Library Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build the `/recipes` recipe-library page with filtering, detail viewing, create/edit/delete flows, ingredient ordering, step image upload, and mock-backed verification in the current MealMate web architecture.

**Architecture:** Follow the existing schema-driven page pattern already used by `family-profile`: keep `src/pages/recipe-library.vue` as a thin page shell, place business logic under `src/modules/recipe`, and centralize real/mock API adaptation in `src/modules/recipe/api.ts`. Reuse the existing `SearchBar`, drawer patterns, i18n structure, and route-shell integration so the new domain behaves like a first-class page inside the current app shell.

**Tech Stack:** Vue 3, TypeScript, Vue Router, Pinia, Element Plus, Vue I18n, Axios/http wrapper, Vitest, Playwright

---

### Task 1: Add the route and page shell

**Files:**
- Modify: `src/router/app-route-schema.ts`
- Modify: `src/components/icon/icon.types.ts`
- Modify: `src/components/icon/providers/iconify.ts`
- Create: `src/pages/recipe-library.vue`
- Test: `tests/unit/router/app-route-schema.spec.ts`
- Test: `tests/unit/router/app-routes.spec.ts`

**Step 1: Write the failing route tests**

Add assertions that:

- `RecipeLibrary` exists in the route schema
- its path is `/recipes`
- its title is `菜品库`
- its icon is `menu-recipe`
- the generated route resolves to `recipe-library`

**Step 2: Run the route tests to verify they fail**

Run: `source ~/.nvm/nvm.sh && pnpm vitest tests/unit/router/app-route-schema.spec.ts tests/unit/router/app-routes.spec.ts`
Expected: FAIL because the recipe route does not exist yet.

**Step 3: Add the route schema entry and page shell**

Create `src/pages/recipe-library.vue` as a thin shell with:

- page-level loading / error / retry surface
- placeholders for filter bar, grid, drawers, and delete dialog

Add the `RecipeLibrary` entry in `src/router/app-route-schema.ts`, and add the new semantic icon in:

- `src/components/icon/icon.types.ts`
- `src/components/icon/providers/iconify.ts`

**Step 4: Run the route tests to verify they pass**

Run: `source ~/.nvm/nvm.sh && pnpm vitest tests/unit/router/app-route-schema.spec.ts tests/unit/router/app-routes.spec.ts`
Expected: PASS.

### Task 2: Define recipe types, constants, and i18n skeleton

**Files:**
- Create: `src/modules/recipe/types.ts`
- Create: `src/modules/recipe/constants.ts`
- Create: `src/locales/zh-CN/recipe.json`
- Create: `src/locales/en-US/recipe.json`
- Test: `tests/unit/modules/recipe/types.spec.ts`

**Step 1: Write the failing type-focused tests**

Add tests that assert the recipe enums / labels / defaults align with the intended UI vocabulary:

- source type labels
- recipe type labels
- difficulty labels
- crowd-tag labels

**Step 2: Run the type tests to verify they fail**

Run: `source ~/.nvm/nvm.sh && pnpm vitest tests/unit/modules/recipe/types.spec.ts`
Expected: FAIL because the recipe module does not exist yet.

**Step 3: Add the types, constants, and locale files**

Define:

- `RecipeSummary`, `RecipeDetail`, `RecipeFilters`
- `RecipeIngredientItem`, `RecipeStepItem`, `RecipeNutrition`
- form payload types
- label helpers and filter defaults
- matching locale messages used by cards, drawers, actions, and validation

**Step 4: Run the type tests to verify they pass**

Run: `source ~/.nvm/nvm.sh && pnpm vitest tests/unit/modules/recipe/types.spec.ts`
Expected: PASS.

### Task 3: Add mock-backed API and store

**Files:**
- Create: `src/modules/recipe/mock.ts`
- Create: `src/modules/recipe/api.ts`
- Create: `src/modules/recipe/store.ts`
- Test: `tests/unit/modules/recipe/api.spec.ts`
- Test: `tests/unit/modules/recipe/store.spec.ts`

**Step 1: Write the failing API and store tests**

Cover:

- fetching filtered paged lists
- fetching detail
- creating a manual recipe
- updating ingredients, steps, and nutrition
- deleting a manual recipe
- blocking delete on `SYSTEM` and `AI_GENERATED` recipes
- allowing edit but not delete for `AI_GENERATED` recipes
- caching detail in the store

Also define the adapter rule for unresolved backend contracts:

- when `USE_MOCK = false`, only call confirmed real endpoints
- keep unresolved list/detail/step/upload integration behind explicit adapter assumptions until the backend contract is frozen

**Step 2: Run the API and store tests to verify they fail**

Run: `source ~/.nvm/nvm.sh && pnpm vitest tests/unit/modules/recipe/api.spec.ts tests/unit/modules/recipe/store.spec.ts`
Expected: FAIL because the recipe API/store do not exist yet.

**Step 3: Implement the mock-backed API and store**

Build:

- `env.USE_MOCK` switching
- front-end response mapping helpers
- `fetchRecipePage`, `fetchRecipeDetail`, `createRecipe`, `updateRecipe`, `updateRecipeIngredients`, `updateRecipeSteps`, `updateRecipeNutrition`, `deleteRecipe`, `uploadRecipeStepImage`
- a small recipe store for `activeRecipeId` and cached detail

**Step 4: Run the API and store tests to verify they pass**

Run: `source ~/.nvm/nvm.sh && pnpm vitest tests/unit/modules/recipe/api.spec.ts tests/unit/modules/recipe/store.spec.ts`
Expected: PASS.

### Task 4: Build the list composable and filter bar

**Files:**
- Create: `src/modules/recipe/composables/useRecipeList.ts`
- Create: `src/modules/recipe/components/RecipeFilterBar.vue`
- Test: `tests/unit/modules/recipe/use-recipe-list.spec.ts`
- Test: `tests/unit/modules/recipe/recipe-filter-bar.spec.ts`

**Step 1: Write the failing composable and filter-bar tests**

Cover:

- initial list load
- filter changes reset `pageNum` to 1
- debounced search emits a new query
- route-query backed values survive reload
- reset restores defaults

**Step 2: Run the tests to verify they fail**

Run: `source ~/.nvm/nvm.sh && pnpm vitest tests/unit/modules/recipe/use-recipe-list.spec.ts tests/unit/modules/recipe/recipe-filter-bar.spec.ts`
Expected: FAIL because the list composable and filter bar do not exist yet.

**Step 3: Implement the list composable and filter bar**

Reuse the existing `SearchBar` to define the schema and route-sync behavior. Keep debounce and pagination-reset rules inside `useRecipeList.ts`.

**Step 4: Run the tests to verify they pass**

Run: `source ~/.nvm/nvm.sh && pnpm vitest tests/unit/modules/recipe/use-recipe-list.spec.ts tests/unit/modules/recipe/recipe-filter-bar.spec.ts`
Expected: PASS.

### Task 5: Build the recipe card and grid

**Files:**
- Create: `src/modules/recipe/components/RecipeCard.vue`
- Create: `src/modules/recipe/components/RecipeGrid.vue`
- Test: `tests/unit/modules/recipe/recipe-card.spec.ts`
- Test: `tests/unit/modules/recipe/recipe-grid.spec.ts`

**Step 1: Write the failing card and grid tests**

Cover:

- rendering summary data
- rendering baby-friendly / weight-loss-friendly badges
- hiding edit/delete for `SYSTEM` recipes
- showing empty state and add-entry affordance
- emitting view/edit/delete actions

**Step 2: Run the tests to verify they fail**

Run: `source ~/.nvm/nvm.sh && pnpm vitest tests/unit/modules/recipe/recipe-card.spec.ts tests/unit/modules/recipe/recipe-grid.spec.ts`
Expected: FAIL because the components do not exist yet.

**Step 3: Implement the card and grid**

Keep the layout mobile-safe:

- 1 column on narrow mobile widths
- multiple columns on desktop
- no hover-only affordances

**Step 4: Run the tests to verify they pass**

Run: `source ~/.nvm/nvm.sh && pnpm vitest tests/unit/modules/recipe/recipe-card.spec.ts tests/unit/modules/recipe/recipe-grid.spec.ts`
Expected: PASS.

### Task 6: Build the detail drawer

**Files:**
- Create: `src/modules/recipe/components/RecipeDetailDrawer.vue`
- Test: `tests/unit/modules/recipe/recipe-detail-drawer.spec.ts`

**Step 1: Write the failing detail-drawer tests**

Cover:

- rendering base fields, ingredients, steps, and nutrition
- showing error and retry state
- using full-screen width on mobile
- closing cleanly when requested

**Step 2: Run the tests to verify they fail**

Run: `source ~/.nvm/nvm.sh && pnpm vitest tests/unit/modules/recipe/recipe-detail-drawer.spec.ts`
Expected: FAIL because the component does not exist yet.

**Step 3: Implement the detail drawer**

Keep it read-only and separate from editing. Reuse the drawer conventions already established by `family`.

**Step 4: Run the tests to verify they pass**

Run: `source ~/.nvm/nvm.sh && pnpm vitest tests/unit/modules/recipe/recipe-detail-drawer.spec.ts`
Expected: PASS.

### Task 7: Build the ingredient editor

**Files:**
- Create: `src/modules/recipe/components/IngredientEditor.vue`
- Test: `tests/unit/modules/recipe/ingredient-editor.spec.ts`

**Step 1: Write the failing ingredient-editor tests**

Cover:

- adding and deleting rows
- changing ingredient fields
- moving items up/down
- recomputing `sortNo` after reorder
- exposing drag and non-drag reorder paths

**Step 2: Run the tests to verify they fail**

Run: `source ~/.nvm/nvm.sh && pnpm vitest tests/unit/modules/recipe/ingredient-editor.spec.ts`
Expected: FAIL because the editor does not exist yet.

**Step 3: Implement the ingredient editor**

Use native HTML5 drag events for desktop reorder and keep accessible up/down controls as the source-of-truth fallback for touch devices. Do not add a third-party drag dependency in this phase.

**Step 4: Run the tests to verify they pass**

Run: `source ~/.nvm/nvm.sh && pnpm vitest tests/unit/modules/recipe/ingredient-editor.spec.ts`
Expected: PASS.

### Task 8: Build the step editor and upload flow

**Files:**
- Create: `src/modules/recipe/components/StepEditor.vue`
- Test: `tests/unit/modules/recipe/step-editor.spec.ts`
- Test: `tests/unit/modules/recipe/api-upload.spec.ts`

**Step 1: Write the failing step-editor and upload tests**

Cover:

- adding/removing/reordering steps
- auto-renumbering `stepNo`
- invoking the upload API for a selected image
- preserving other step fields on upload failure
- preserving the current form state while updating the persisted snapshot after a partial save failure

**Step 2: Run the tests to verify they fail**

Run: `source ~/.nvm/nvm.sh && pnpm vitest tests/unit/modules/recipe/step-editor.spec.ts tests/unit/modules/recipe/api-upload.spec.ts`
Expected: FAIL because the editor and upload behavior do not exist yet.

**Step 3: Implement the step editor and upload hook-up**

Wire image upload through `uploadRecipeStepImage(file)` only. Keep upload state local to the affected step, and keep step reorder aligned with Task 7: native desktop drag plus button-based fallback.

**Step 4: Run the tests to verify they pass**

Run: `source ~/.nvm/nvm.sh && pnpm vitest tests/unit/modules/recipe/step-editor.spec.ts tests/unit/modules/recipe/api-upload.spec.ts`
Expected: PASS.

### Task 9: Build the nutrition form and delete dialog

**Files:**
- Create: `src/modules/recipe/components/NutritionForm.vue`
- Create: `src/modules/recipe/components/RecipeDeleteDialog.vue`
- Test: `tests/unit/modules/recipe/nutrition-form.spec.ts`
- Test: `tests/unit/modules/recipe/recipe-delete-dialog.spec.ts`

**Step 1: Write the failing tests**

Cover:

- numeric field binding and validation
- empty optional fields
- delete confirmation copy
- emitting confirm/cancel actions

**Step 2: Run the tests to verify they fail**

Run: `source ~/.nvm/nvm.sh && pnpm vitest tests/unit/modules/recipe/nutrition-form.spec.ts tests/unit/modules/recipe/recipe-delete-dialog.spec.ts`
Expected: FAIL because the components do not exist yet.

**Step 3: Implement the nutrition form and delete dialog**

Keep them small, focused, and aligned with the existing test-id conventions.

**Step 4: Run the tests to verify they pass**

Run: `source ~/.nvm/nvm.sh && pnpm vitest tests/unit/modules/recipe/nutrition-form.spec.ts tests/unit/modules/recipe/recipe-delete-dialog.spec.ts`
Expected: PASS.

### Task 10: Build the form composable and form drawer

**Files:**
- Create: `src/modules/recipe/composables/useRecipeForm.ts`
- Create: `src/modules/recipe/components/RecipeFormDrawer.vue`
- Test: `tests/unit/modules/recipe/use-recipe-form.spec.ts`
- Test: `tests/unit/modules/recipe/recipe-form-drawer.spec.ts`

**Step 1: Write the failing tests**

Cover:

- add-mode defaults
- edit-mode detail hydration
- saving base recipe + ingredients + steps + nutrition
- preserving form state on save failure
- refetching latest detail after a partial-success save and updating the persisted snapshot
- blocking delete/edit actions for system recipes
- blocking delete for `AI_GENERATED` recipes while still allowing edit
- full-screen drawer behavior on mobile

**Step 2: Run the tests to verify they fail**

Run: `source ~/.nvm/nvm.sh && pnpm vitest tests/unit/modules/recipe/use-recipe-form.spec.ts tests/unit/modules/recipe/recipe-form-drawer.spec.ts`
Expected: FAIL because the composable and drawer do not exist yet.

**Step 3: Implement the form composable and drawer**

Keep one outward “save all” action while letting `useRecipeForm.ts` orchestrate the underlying API calls. If a later write fails after an earlier write succeeds, immediately refetch detail, refresh the persisted snapshot, keep the user's in-progress form values, and surface a partial-save warning instead of pretending nothing changed.

**Step 4: Run the tests to verify they pass**

Run: `source ~/.nvm/nvm.sh && pnpm vitest tests/unit/modules/recipe/use-recipe-form.spec.ts tests/unit/modules/recipe/recipe-form-drawer.spec.ts`
Expected: PASS.

### Task 11: Integrate the page shell

**Files:**
- Modify: `src/pages/recipe-library.vue`
- Test: `tests/unit/modules/recipe/recipe-library-page.spec.ts`

**Step 1: Write the failing page test**

Cover:

- initial load
- retry after load failure
- opening detail drawer
- opening add drawer
- opening edit drawer
- opening delete dialog

**Step 2: Run the page test to verify it fails**

Run: `source ~/.nvm/nvm.sh && pnpm vitest tests/unit/modules/recipe/recipe-library-page.spec.ts`
Expected: FAIL because the page shell is still placeholder-only.

**Step 3: Integrate the shell with recipe components and composables**

Connect:

- `RecipeFilterBar`
- `RecipeGrid`
- `RecipeDetailDrawer`
- `RecipeFormDrawer`
- `RecipeDeleteDialog`

**Step 4: Run the page test to verify it passes**

Run: `source ~/.nvm/nvm.sh && pnpm vitest tests/unit/modules/recipe/recipe-library-page.spec.ts`
Expected: PASS.

### Task 12: Add end-to-end verification

**Files:**
- Create: `tests/e2e/specs/recipe-library.spec.ts`

**Step 1: Write the E2E spec**

Cover:

- desktop: load page, filter, open detail, create recipe, see it in the list
- mobile: reload into narrow viewport, open edit drawer, verify full-screen behavior, upload a step image, reorder a list item using touch-friendly controls

**Step 2: Run the E2E spec to verify expected failures**

Run: `source ~/.nvm/nvm.sh && pnpm playwright test tests/e2e/specs/recipe-library.spec.ts`
Expected: initial failures until the remaining UI pieces are complete.

**Step 3: Adjust implementation until the E2E spec passes**

Fix selectors, responsive layout issues, upload timing, and drawer behavior as needed without broadening scope.

**Step 4: Run the E2E spec to verify it passes**

Run: `source ~/.nvm/nvm.sh && pnpm playwright test tests/e2e/specs/recipe-library.spec.ts`
Expected: PASS.

### Task 13: Run repository verification

**Files:**
- Verify: `src/router/app-route-schema.ts`
- Verify: `src/pages/recipe-library.vue`
- Verify: `src/modules/recipe/**/*`
- Verify: `src/locales/**/*`
- Verify: `tests/unit/modules/recipe/**/*`
- Verify: `tests/e2e/specs/recipe-library.spec.ts`

**Step 1: Run lint**

Run: `source ~/.nvm/nvm.sh && pnpm lint`
Expected: PASS.

**Step 2: Run type-check**

Run: `source ~/.nvm/nvm.sh && pnpm type-check`
Expected: PASS.

**Step 3: Run focused unit tests**

Run: `source ~/.nvm/nvm.sh && pnpm vitest tests/unit/router/app-route-schema.spec.ts tests/unit/router/app-routes.spec.ts tests/unit/modules/recipe`
Expected: PASS.

**Step 4: Run the focused E2E spec**

Run: `source ~/.nvm/nvm.sh && pnpm playwright test tests/e2e/specs/recipe-library.spec.ts`
Expected: PASS.

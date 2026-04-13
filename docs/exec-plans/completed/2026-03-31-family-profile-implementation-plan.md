# Family Profile Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build the `/family/profile` frontend for UC1 so users can view and maintain the Family profile, including member CRUD and preference editing, while using a local mock-backed API until backend endpoints are ready.

**Architecture:** Keep the page shell thin and place domain behavior inside `src/modules/family`. Use a lightweight Pinia store for shared Family summary and member list state, module-local composables for editor workflow, and an API layer that can switch between real requests and local mock implementations without changing component code.

**Tech Stack:** Vue 3, TypeScript, Pinia, Vue Router schema, Element Plus, SCSS, Vitest, Playwright

---

### Task 1: Add family route schema and thin page shell

**Files:**
- Create: `src/pages/family-profile.vue`
- Modify: `src/router/app-route-schema.ts`
- Test: `tests/unit/router/app-route-schema.spec.ts`
- Test: `tests/unit/router/app-routes.spec.ts`

**Step 1: Write the failing route tests**

Add assertions that:

- `FamilyProfile` exists in the route schema
- its path is `/family/profile`
- its title is `家庭画像`
- it resolves to `family-profile.vue`

**Step 2: Run test to verify it fails**

Run: `source ~/.nvm/nvm.sh && pnpm vitest tests/unit/router/app-route-schema.spec.ts tests/unit/router/app-routes.spec.ts`

Expected:

- route tests fail because `FamilyProfile` route does not exist yet

**Step 3: Write minimal implementation**

- Add `FamilyProfile` to `src/router/app-route-schema.ts`
- Create `src/pages/family-profile.vue` with a minimal thin-shell placeholder that can host the module content later

**Step 4: Run test to verify it passes**

Run: `source ~/.nvm/nvm.sh && pnpm vitest tests/unit/router/app-route-schema.spec.ts tests/unit/router/app-routes.spec.ts`

Expected:

- the new route assertions pass

### Task 2: Define family module types and constants

**Files:**
- Create: `src/modules/family/types.ts`
- Create: `src/modules/family/constants.ts`
- Test: `tests/unit/modules/family/types.spec.ts`

**Step 1: Write the failing type-oriented test**

Add a small spec that validates the exported enum option arrays / helper constants for:

- role types
- target types
- spicy / sweet / oil / salt levels

**Step 2: Run test to verify it fails**

Run: `source ~/.nvm/nvm.sh && pnpm vitest tests/unit/modules/family/types.spec.ts`

Expected:

- test fails because module files do not exist

**Step 3: Write minimal implementation**

- Define request / response / form types matching the agreed API contract
- Add option lists and display helpers in `constants.ts`

**Step 4: Run test to verify it passes**

Run: `source ~/.nvm/nvm.sh && pnpm vitest tests/unit/modules/family/types.spec.ts`

Expected:

- exported constants and helpers match expected values

### Task 3: Build mock-backed family API layer

**Files:**
- Create: `src/modules/family/api.ts`
- Create: `src/modules/family/mock.ts`
- Test: `tests/unit/modules/family/api.spec.ts`

**Step 1: Write the failing API tests**

Cover:

- fetch family summary
- fetch member list
- fetch member detail
- add member
- update member basic info
- update member preference
- delete member

**Step 2: Run test to verify it fails**

Run: `source ~/.nvm/nvm.sh && pnpm vitest tests/unit/modules/family/api.spec.ts`

Expected:

- API tests fail because the family API layer does not exist

**Step 3: Write minimal implementation**

- Implement mock data store in `mock.ts`
- Export real API-shaped functions from `api.ts`
- Add a simple switch for mock mode so implementation can later move to real HTTP without changing call sites

**Step 4: Run test to verify it passes**

Run: `source ~/.nvm/nvm.sh && pnpm vitest tests/unit/modules/family/api.spec.ts`

Expected:

- CRUD-like operations pass against the mock layer

### Task 4: Add family store for shared summary and member list state

**Files:**
- Create: `src/modules/family/store.ts`
- Test: `tests/unit/modules/family/store.spec.ts`

**Step 1: Write the failing store tests**

Cover:

- `fetchFamilySummary`
- `fetchFamilyMembers`
- `refreshFamilyProfile`
- store state updates after successful requests

**Step 2: Run test to verify it fails**

Run: `source ~/.nvm/nvm.sh && pnpm vitest tests/unit/modules/family/store.spec.ts`

Expected:

- store tests fail because the store does not exist

**Step 3: Write minimal implementation**

- Create `useFamilyStore`
- Keep only shared business state inside the store
- Delegate data fetching to `api.ts`

**Step 4: Run test to verify it passes**

Run: `source ~/.nvm/nvm.sh && pnpm vitest tests/unit/modules/family/store.spec.ts`

Expected:

- store correctly loads and refreshes Family data

### Task 5: Add page-level Family profile composable

**Files:**
- Create: `src/modules/family/composables/useFamilyProfile.ts`
- Test: `tests/unit/modules/family/use-family-profile.spec.ts`

**Step 1: Write the failing composable tests**

Cover:

- initial load triggers summary and member list fetches
- retry behavior after failure
- exposed empty / loading / error states

**Step 2: Run test to verify it fails**

Run: `source ~/.nvm/nvm.sh && pnpm vitest tests/unit/modules/family/use-family-profile.spec.ts`

Expected:

- composable tests fail because file does not exist

**Step 3: Write minimal implementation**

- Compose store actions into a page-facing API
- Provide page-friendly loading, error, retry, and refresh state

**Step 4: Run test to verify it passes**

Run: `source ~/.nvm/nvm.sh && pnpm vitest tests/unit/modules/family/use-family-profile.spec.ts`

Expected:

- load / retry / refresh behavior passes

### Task 6: Add member editor composable for drawer workflow

**Files:**
- Create: `src/modules/family/composables/useFamilyMemberEditor.ts`
- Test: `tests/unit/modules/family/use-family-member-editor.spec.ts`

**Step 1: Write the failing composable tests**

Cover:

- add mode default values
- edit mode loads detail data
- `BABY` role forces `spicyLevel = NONE` and `saltLevel = LIGHT`
- save-all flow only calls changed endpoints
- delete flow triggers refresh

**Step 2: Run test to verify it fails**

Run: `source ~/.nvm/nvm.sh && pnpm vitest tests/unit/modules/family/use-family-member-editor.spec.ts`

Expected:

- editor tests fail because composable does not exist

**Step 3: Write minimal implementation**

- Implement editor mode switching
- Load member detail on edit
- Manage basic-info form and preference form
- Implement save / delete orchestration

**Step 4: Run test to verify it passes**

Run: `source ~/.nvm/nvm.sh && pnpm vitest tests/unit/modules/family/use-family-member-editor.spec.ts`

Expected:

- editor workflow tests pass

### Task 7: Build Family profile header and member card components

**Files:**
- Create: `src/modules/family/components/FamilyProfileHeader.vue`
- Create: `src/modules/family/components/FamilyMemberCard.vue`
- Create: `src/modules/family/components/FamilyMemberGrid.vue`
- Test: `tests/unit/modules/family/family-profile-header.spec.ts`
- Test: `tests/unit/modules/family/family-member-card.spec.ts`

**Step 1: Write the failing component tests**

Cover:

- header displays family summary fields
- add button emits event
- card renders role, target type, preference summary
- card edit / delete actions emit expected events

**Step 2: Run test to verify it fails**

Run: `source ~/.nvm/nvm.sh && pnpm vitest tests/unit/modules/family/family-profile-header.spec.ts tests/unit/modules/family/family-member-card.spec.ts`

Expected:

- component tests fail because files do not exist

**Step 3: Write minimal implementation**

- Build presentational components with stable props and emits
- Keep styling responsive and mobile-safe

**Step 4: Run test to verify it passes**

Run: `source ~/.nvm/nvm.sh && pnpm vitest tests/unit/modules/family/family-profile-header.spec.ts tests/unit/modules/family/family-member-card.spec.ts`

Expected:

- components render correct content and events

### Task 8: Build member form and preference form components

**Files:**
- Create: `src/modules/family/components/FamilyMemberForm.vue`
- Create: `src/modules/family/components/MemberPreferenceForm.vue`
- Test: `tests/unit/modules/family/family-member-form.spec.ts`
- Test: `tests/unit/modules/family/member-preference-form.spec.ts`

**Step 1: Write the failing form tests**

Cover:

- base fields render and accept values
- tag-like inputs support enter / comma tokenization
- baby-role preference locking is reflected in UI

**Step 2: Run test to verify it fails**

Run: `source ~/.nvm/nvm.sh && pnpm vitest tests/unit/modules/family/family-member-form.spec.ts tests/unit/modules/family/member-preference-form.spec.ts`

Expected:

- form tests fail because components do not exist

**Step 3: Write minimal implementation**

- Create basic info form
- Create preference form
- Implement tag input behavior and disabled states

**Step 4: Run test to verify it passes**

Run: `source ~/.nvm/nvm.sh && pnpm vitest tests/unit/modules/family/family-member-form.spec.ts tests/unit/modules/family/member-preference-form.spec.ts`

Expected:

- form interactions pass

### Task 9: Build editor drawer and delete dialog containers

**Files:**
- Create: `src/modules/family/components/FamilyMemberDrawer.vue`
- Create: `src/modules/family/components/FamilyMemberDeleteDialog.vue`
- Test: `tests/unit/modules/family/family-member-drawer.spec.ts`
- Test: `tests/unit/modules/family/family-member-delete-dialog.spec.ts`

**Step 1: Write the failing container tests**

Cover:

- drawer opens in add and edit modes
- detail loading appears during edit fetch
- save-all emits or calls handler with expected payload
- delete dialog confirms and cancels correctly

**Step 2: Run test to verify it fails**

Run: `source ~/.nvm/nvm.sh && pnpm vitest tests/unit/modules/family/family-member-drawer.spec.ts tests/unit/modules/family/family-member-delete-dialog.spec.ts`

Expected:

- container tests fail because files do not exist

**Step 3: Write minimal implementation**

- Compose the two form components into the drawer
- Add full-screen mobile drawer behavior
- Add confirmation dialog container

**Step 4: Run test to verify it passes**

Run: `source ~/.nvm/nvm.sh && pnpm vitest tests/unit/modules/family/family-member-drawer.spec.ts tests/unit/modules/family/family-member-delete-dialog.spec.ts`

Expected:

- drawer and dialog interaction tests pass

### Task 10: Compose the Family profile page

**Files:**
- Modify: `src/pages/family-profile.vue`
- Test: `tests/unit/modules/family/family-profile-page.spec.ts`

**Step 1: Write the failing page test**

Cover:

- page loads summary and member grid
- clicking add opens drawer
- clicking edit opens drawer in edit mode
- clicking delete opens confirmation

**Step 2: Run test to verify it fails**

Run: `source ~/.nvm/nvm.sh && pnpm vitest tests/unit/modules/family/family-profile-page.spec.ts`

Expected:

- page test fails because shell is still minimal

**Step 3: Write minimal implementation**

- Wire `useFamilyProfile`
- Wire `useFamilyMemberEditor`
- Render header, grid, drawer, dialog

**Step 4: Run test to verify it passes**

Run: `source ~/.nvm/nvm.sh && pnpm vitest tests/unit/modules/family/family-profile-page.spec.ts`

Expected:

- page composition passes

### Task 11: Add mobile-responsive styling verification and shell checks

**Files:**
- Modify: `src/pages/family-profile.vue`
- Modify: `src/modules/family/components/FamilyMemberGrid.vue`
- Modify: `src/modules/family/components/FamilyMemberDrawer.vue`
- Test: `tests/e2e/specs/family-profile.spec.ts`

**Step 1: Write the failing responsive test**

Add or extend E2E coverage to validate:

- mobile viewport uses single-column member list
- drawer is full-screen on small screens
- core actions are visible without hover

**Step 2: Run test to verify it fails**

Run: `source ~/.nvm/nvm.sh && pnpm test:e2e --grep "family profile"`

Expected:

- E2E fails because page behavior is not fully implemented yet

**Step 3: Write minimal implementation**

- Finish responsive SCSS
- Ensure control sizes and visibility meet mobile requirements

**Step 4: Run test to verify it passes**

Run: `source ~/.nvm/nvm.sh && pnpm test:e2e --grep "family profile"`

Expected:

- mobile workflow passes

### Task 12: Run focused verification and cleanup

**Files:**
- Modify: any files touched during cleanup if required

**Step 1: Run focused unit tests**

Run:

```bash
source ~/.nvm/nvm.sh && pnpm vitest tests/unit/router/app-route-schema.spec.ts tests/unit/router/app-routes.spec.ts tests/unit/modules/family
```

Expected:

- targeted router and family module tests pass

**Step 2: Run type-check**

Run:

```bash
source ~/.nvm/nvm.sh && pnpm type-check
```

Expected:

- TypeScript and Vue type-check pass

**Step 3: Run lint**

Run:

```bash
source ~/.nvm/nvm.sh && pnpm lint
```

Expected:

- lint passes without new warnings or formatting regressions

**Step 4: Run targeted E2E**

Run:

```bash
source ~/.nvm/nvm.sh && pnpm test:e2e --grep "family profile"
```

Expected:

- the main family profile scenario passes

**Step 5: Record verification status**

- Summarize which focused tests, type-check, lint, and E2E commands passed
- Note any blockers or follow-up work
- Do not perform staging or commit workflow unless the user explicitly asks for it

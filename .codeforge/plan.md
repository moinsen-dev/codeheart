# CodeForge Plan: Build the Social Worker Dashboard & Beneficiary Management (GitHub Issue #1). The app already has: Dev Auth (login via /login?dev=socialWorker when NEXT_PUBLIC_DEV_AUTH=true), AuthGuard component, role-based navbar, Zustand store with Beneficiary model. Requirements: 1) STORE: Add getMyBeneficiaries(socialWorkerId), addBeneficiary(data) with auto-generated codeword, updateBeneficiary(id, data), removeBeneficiary(id) as soft-delete to src/lib/stores/mock-data.ts. 2) SOCIAL WORKER DASHBOARD (/[locale]/social-worker/page.tsx): Overview cards (active beneficiaries count, total donations, open needs), quick-action buttons, protected by AuthGuard with role=socialWorker. The page already exists as placeholder — replace with full dashboard. 3) BENEFICIARY LIST (/[locale]/social-worker/beneficiaries/page.tsx): Table of own beneficiaries with filters (location, verified, needs), inline status (codeword, funds, target). 4) ADD/EDIT FORM (/[locale]/social-worker/beneficiaries/[id]/page.tsx): Form with name, story, needs multi-select, location, target amount. Codeword auto-generated on add. Validation. 5) i18n: Add socialWorker keys to messages/de.json and messages/en.json. 6) TESTS: At least 10 new tests. All existing 155 tests must pass. Use existing patterns: shadcn/ui, next-intl, Zustand, CLAUDE.md conventions. Use @/i18n/routing for navigation.

Task ID: `cf-20260220-122041-69b2`
Created: 2026-02-20T12:22:51.973449+00:00

## Packages (6)

### 1. store-actions

Add social worker store actions to src/lib/stores/mock-data.ts. Implement four new actions on the Zustand store:

1. `getMyBeneficiaries(socialWorkerId: string)`: Returns filtered array of beneficiaries where `beneficiary.socialWorkerId === socialWorkerId` and beneficiary is not soft-deleted (add `deletedAt?: Date` field to Beneficiary interface).

2. `addBeneficiary(data: Omit<Beneficiary, 'id' | 'codeword' | 'createdAt' | 'currentFunds' | 'photoUrl' | 'deletedAt'>)`: Creates a new beneficiary with auto-generated UUID id, auto-generated codeword (use faker to generate a unique codeword like existing pattern in generateMockData), currentFunds=0, photoUrl from dicebear, createdAt=new Date(), and adds to store.

3. `updateBeneficiary(id: string, data: Partial<Pick<Beneficiary, 'name' | 'story' | 'needs' | 'location' | 'targetFunds' | 'verified'>>)`: Updates the matching beneficiary's fields in the store.

4. `removeBeneficiary(id: string)`: Soft-delete by setting `deletedAt: new Date()` on the beneficiary. Do NOT remove from array.

Also add the `deletedAt?: Date` optional field to the `Beneficiary` interface. Update `getMyBeneficiaries` and `getBeneficiaryByCodeword` to exclude soft-deleted records. Update existing `generateMockData` to ensure generated beneficiaries have no `deletedAt` field.

**Success Criteria:**

- Beneficiary interface has optional deletedAt field
- getMyBeneficiaries action exists and filters by socialWorkerId, excluding soft-deleted
- addBeneficiary action creates beneficiary with auto-generated codeword and id
- updateBeneficiary action updates specified fields
- removeBeneficiary action sets deletedAt timestamp (soft delete)
- getBeneficiaryByCodeword excludes soft-deleted beneficiaries
- Existing tests still pass (run npm run test:run)

### 2. i18n-messages

Add comprehensive socialWorker i18n keys to both messages/de.json and messages/en.json. Add keys under the existing `socialWorker` namespace. Required keys:

**Dashboard keys:** `socialWorker.welcome`, `socialWorker.activeBeneficiaries`, `socialWorker.totalDonations`, `socialWorker.openNeeds`, `socialWorker.quickActions`, `socialWorker.addBeneficiary`, `socialWorker.viewBeneficiaries`, `socialWorker.overview`

**Beneficiary list keys:** `socialWorker.beneficiaryList`, `socialWorker.filterByLocation`, `socialWorker.filterByStatus`, `socialWorker.filterByNeeds`, `socialWorker.allLocations`, `socialWorker.allStatuses`, `socialWorker.verified`, `socialWorker.unverified`, `socialWorker.codeword`, `socialWorker.funds`, `socialWorker.target`, `socialWorker.noBeneficiaries`, `socialWorker.edit`, `socialWorker.remove`, `socialWorker.confirmRemove`, `socialWorker.search`

**Add/Edit form keys:** `socialWorker.addNew`, `socialWorker.editBeneficiary`, `socialWorker.name`, `socialWorker.story`, `socialWorker.needs`, `socialWorker.location`, `socialWorker.targetAmount`, `socialWorker.save`, `socialWorker.cancel`, `socialWorker.codewordGenerated`, `socialWorker.formValidation`, `socialWorker.nameRequired`, `socialWorker.storyRequired`, `socialWorker.locationRequired`, `socialWorker.needsRequired`, `socialWorker.targetRequired`, `socialWorker.beneficiarySaved`, `socialWorker.beneficiaryRemoved`

Provide proper German translations in de.json and English translations in en.json. Keep existing keys intact.

**Success Criteria:**

- messages/de.json has all new socialWorker keys with German translations
- messages/en.json has all new socialWorker keys with English translations
- Existing keys in both files are unchanged
- JSON is valid and properly formatted
- npm run build succeeds

### 3. social-worker-dashboard

Replace the existing placeholder at src/app/[locale]/social-worker/page.tsx with a full social worker dashboard. The page must:

1. Be wrapped in `<AuthGuard allowedRoles={['socialWorker']}>` (already is).
2. Include Navbar at top.
3. Show a welcome message using currentUser name.
4. Display 3 overview stat cards using data from the store:
   - Active Beneficiaries count: count of getMyBeneficiaries(currentUser.id) results
   - Total Donations: sum of donations where beneficiaryId matches one of the social worker's beneficiaries
   - Open Needs: count of distinct unmet needs across the social worker's beneficiaries
5. Quick-action buttons:
   - 'Add Beneficiary' → links to `/social-worker/beneficiaries/new`
   - 'View Beneficiaries' → links to `/social-worker/beneficiaries`
6. Use Card, Button, Badge components from shadcn/ui.
7. Use lucide-react icons (Users, Heart, AlertCircle, Plus, List).
8. Use `useTranslations('socialWorker')` for all text.
9. Import Link from `@/i18n/routing`.
10. Be responsive (mobile-first) and support light/dark themes.
11. Call `generateMockData()` if beneficiaries array is empty (same pattern as beneficiaries browse page).

**Success Criteria:**

- Page is protected by AuthGuard with socialWorker role
- 3 stat cards display real computed data from store
- Quick action buttons link to correct routes using i18n Link
- All visible text uses useTranslations
- Page is responsive and works in light/dark mode
- Page renders without errors

### 4. beneficiary-list-page

Create src/app/[locale]/social-worker/beneficiaries/page.tsx — a table/list view of the social worker's beneficiaries.

1. Wrap in `<AuthGuard allowedRoles={['socialWorker']}`.
2. Include Navbar.
3. Fetch beneficiaries using `getMyBeneficiaries(currentUser.id)` from store.
4. Display as a responsive card-based list (or table on desktop) showing for each beneficiary:
   - Name and codeword (Badge)
   - Location
   - Verified status (Badge: green for verified, yellow for unverified)
   - Funds progress (currentFunds / targetFunds with Progress component)
   - Needs as Badge tags
   - Edit button → links to `/social-worker/beneficiaries/[id]`
   - Remove button → calls removeBeneficiary(id) with confirmation
5. Filter controls at top:
   - Search by name or codeword
   - Filter by location (dropdown or select from 5 cities + 'All')
   - Filter by verified status (All / Verified / Unverified)
   - Filter by needs (multi-select or checkboxes)
6. 'Add New' button at top linking to `/social-worker/beneficiaries/new`.
7. Empty state message when no beneficiaries found.
8. Use useTranslations('socialWorker') for all text.
9. Import Link from `@/i18n/routing`.
10. Call generateMockData() if beneficiaries empty.

**Success Criteria:**

- Page shows only the logged-in social worker's beneficiaries
- Search filter works for name and codeword
- Location filter works
- Verified status filter works
- Each beneficiary shows codeword, funds progress, needs badges
- Edit links navigate to correct beneficiary ID page
- Remove button soft-deletes with confirmation
- Empty state shown when no results
- All text uses i18n translations

### 5. beneficiary-form-page

Create src/app/[locale]/social-worker/beneficiaries/[id]/page.tsx — an add/edit form for beneficiaries.

1. Wrap in `<AuthGuard allowedRoles={['socialWorker']}`.
2. Include Navbar.
3. If `id` param is 'new', show add form. Otherwise, load existing beneficiary by id from store and pre-populate form.
4. Form fields:
   - Name (Input, required)
   - Story (textarea, required)
   - Needs (multi-select checkboxes from: Lebensmittel, Unterkunft, Medizinische Versorgung, Kleidung, Hygieneartikel — at least one required)
   - Location (select from: Hamburg, Berlin, München, Köln, Frankfurt — required)
   - Target Amount (number Input, required, min 1)
5. Client-side validation: show error messages for required fields using i18n keys.
6. On submit for 'new': call addBeneficiary() with socialWorkerId=currentUser.id, verified=false. Show the auto-generated codeword after save. Navigate back to list.
7. On submit for edit: call updateBeneficiary(id, data). Navigate back to list.
8. Cancel button navigates back to `/social-worker/beneficiaries`.
9. Use useTranslations('socialWorker') for all text.
10. Import Link, useRouter from `@/i18n/routing`.
11. Use Card, Input, Button components from shadcn/ui.

**Success Criteria:**

- 'new' route shows empty form for adding beneficiary
- Existing beneficiary id loads pre-populated form
- All 5 form fields present with proper labels
- Client-side validation shows errors for empty required fields
- Needs multi-select allows choosing multiple options
- Add submits via addBeneficiary with correct socialWorkerId
- Edit submits via updateBeneficiary
- Auto-generated codeword displayed after adding
- Cancel navigates back to beneficiary list
- All text uses i18n translations

### 6. tests

Add at least 10 new tests covering the social worker feature. Create test files:

1. `src/lib/__tests__/mock-data-social-worker.test.ts` — Test the new store actions:
   - getMyBeneficiaries returns only beneficiaries for given socialWorkerId
   - getMyBeneficiaries excludes soft-deleted beneficiaries
   - addBeneficiary creates beneficiary with auto-generated codeword and correct defaults
   - updateBeneficiary updates specified fields without affecting others
   - removeBeneficiary sets deletedAt (soft delete)
   - getBeneficiaryByCodeword excludes soft-deleted records

2. `src/app/[locale]/social-worker/__tests__/dashboard.test.tsx` — Test the dashboard page:
   - Renders stat cards with correct counts
   - Shows quick action buttons with correct links
   - Protected by AuthGuard

3. `src/app/[locale]/social-worker/beneficiaries/__tests__/beneficiaries-list.test.tsx` — Test the list page:
   - Renders beneficiary list
   - Filters work correctly

Follow existing test patterns: use vitest + React Testing Library, mock Zustand store with vi.mocked or useMockDataStore.setState, mock next-intl with useTranslations returning key as value. Ensure all 155 existing tests plus the new 10+ tests pass. Run `npm run test:run` to verify.

**Success Criteria:**

- At least 10 new test cases added
- Store action tests cover getMyBeneficiaries, addBeneficiary, updateBeneficiary, removeBeneficiary
- Dashboard page test verifies stat cards render
- Beneficiary list test verifies rendering
- All new tests pass
- All 155 existing tests still pass
- npm run test:run shows 165+ passing tests

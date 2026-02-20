# CodeForge Plan: Implement Auth Flow with Protected Routes, Role Guards & Dev Auth (GitHub Issue #5). Requirements: 1) Dev Auth System (src/lib/auth/dev-auth.ts): When NEXT_PUBLIC_DEV_AUTH=true, enable URL-based login via /login?dev=donor, /login?dev=socialWorker, /login?dev=admin. Add programmatic devLogin(role) for tests. Show visual Dev Mode banner when active. 2) AuthGuard Component (src/components/auth-guard.tsx): Wraps protected pages, redirects to /login if not logged in, redirects to own dashboard if wrong role, loading state. 3) Login Page: Role-specific redirects after login (donor→/dashboard, socialWorker→/social-worker, admin→/admin). In dev mode show Quick-Login buttons per role. Error messages. 4) Register Page: Role selection with descriptions, validation, success redirect. 5) Navbar update: Show role-appropriate navigation. 6) i18n: New keys in messages/de.json and messages/en.json for socialWorker and admin sections. 7) At least 10 new tests. All existing 25 tests must still pass. Follow CLAUDE.md patterns. Use @/i18n/routing for navigation.

Task ID: `cf-20260220-080428-f70f`
Created: 2026-02-20T08:06:25.182006+00:00

## Packages (5)

### 1. dev-auth-system

Create the dev auth system at src/lib/auth/dev-auth.ts. This module should: (1) Export a function `isDevAuthEnabled()` that checks if `process.env.NEXT_PUBLIC_DEV_AUTH === 'true'`. (2) Export a `devLogin(role: 'donor' | 'socialWorker' | 'admin')` function that calls the Zustand store's `login()` with a pre-configured email/name for each role (e.g., 'dev-donor@codeheart.dev'). (3) Export a `DevModeBanner` React component that renders a fixed banner (e.g., top of screen, yellow/orange background) showing 'Dev Mode Active' when dev auth is enabled - this should be added to the locale layout at src/app/[locale]/layout.tsx. (4) Add `NEXT_PUBLIC_DEV_AUTH` to .env.example with a comment. (5) Update .env.local or create it with NEXT_PUBLIC_DEV_AUTH=true for local development.

**Success Criteria:**

- File src/lib/auth/dev-auth.ts exists with isDevAuthEnabled(), devLogin(role), and DevModeBanner exports
- DevModeBanner renders a visible banner when NEXT_PUBLIC_DEV_AUTH=true and is hidden otherwise
- devLogin('donor') logs in as a donor user via the Zustand store
- devLogin('socialWorker') logs in as a social worker user
- devLogin('admin') logs in as an admin user
- NEXT_PUBLIC_DEV_AUTH is documented in .env.example
- DevModeBanner is rendered in src/app/[locale]/layout.tsx
- npm run build completes without errors

### 2. auth-guard-component

Create src/components/auth-guard.tsx - a reusable wrapper component for protected pages. Props: `children: React.ReactNode`, `allowedRoles: Array<'donor' | 'socialWorker' | 'investor' | 'admin'>`. Behavior: (1) Uses `useMockDataStore()` to check `currentUser`. (2) If no currentUser, redirect to `/{locale}/login` using `useRouter` from `@/i18n/routing`. (3) If currentUser exists but their role is not in `allowedRoles`, redirect to their role-appropriate dashboard: donor→/dashboard, socialWorker→/social-worker, admin→/admin. (4) While checking auth state (before store hydration), show a loading spinner/skeleton. (5) If authorized, render children. Also create placeholder pages for social worker and admin dashboards: src/app/[locale]/social-worker/page.tsx (simple page with title 'Social Worker Dashboard') and src/app/[locale]/admin/page.tsx (simple page with title 'Admin Dashboard'). Wrap all three dashboard pages (dashboard, social-worker, admin) with AuthGuard using appropriate allowedRoles.

**Success Criteria:**

- File src/components/auth-guard.tsx exists with AuthGuard component
- AuthGuard redirects unauthenticated users to /login
- AuthGuard redirects users with wrong role to their own dashboard
- AuthGuard shows loading state during hydration
- AuthGuard renders children when user is authorized
- src/app/[locale]/social-worker/page.tsx exists and is wrapped with AuthGuard allowedRoles=['socialWorker']
- src/app/[locale]/admin/page.tsx exists and is wrapped with AuthGuard allowedRoles=['admin']
- src/app/[locale]/dashboard/page.tsx is wrapped with AuthGuard allowedRoles=['donor']
- All imports use @/i18n/routing for navigation, not next/navigation
- npm run build completes without errors

### 3. login-register-pages

Update the login page at src/app/[locale]/login/page.tsx: (1) Add dev mode support - when NEXT_PUBLIC_DEV_AUTH=true, check URL for `?dev=donor|socialWorker|admin` query param and auto-login via devLogin(). (2) Show Quick-Login buttons (one per role: Donor, Social Worker, Admin) when dev auth is enabled, each calling devLogin(role) and redirecting. (3) Implement role-specific redirects after successful login: donor→/dashboard, socialWorker→/social-worker, admin→/admin. (4) Improve error message display using i18n keys. Update the register page at src/app/[locale]/register/page.tsx: (1) Add role selection with descriptions explaining each role (donor, socialWorker, admin). (2) After successful registration, redirect to the role-appropriate dashboard (same mapping as login). (3) Add validation feedback. Both pages must use useRouter from @/i18n/routing.

**Success Criteria:**

- Login page auto-logs in when ?dev=donor query param is present and dev auth is enabled
- Login page shows Quick-Login buttons for donor, socialWorker, admin when dev auth is enabled
- Quick-Login buttons are NOT shown when dev auth is disabled
- Login redirects donor to /dashboard, socialWorker to /social-worker, admin to /admin
- Register page shows role descriptions for each selectable role
- Register page redirects to role-appropriate dashboard after success
- Both pages use useRouter from @/i18n/routing
- Error messages use i18n translation keys
- npm run build completes without errors

### 4. navbar-and-i18n

Update src/components/navbar.tsx: (1) Show role-appropriate navigation links based on currentUser.role - donor sees 'Dashboard' linking to /dashboard, socialWorker sees 'Dashboard' linking to /social-worker, admin sees 'Admin Panel' linking to /admin. (2) Fix the import to use useRouter from @/i18n/routing instead of next/navigation (currently inconsistent). (3) Show role badge next to username when logged in. Update i18n message files messages/de.json and messages/en.json: (1) Add 'socialWorker' section with keys: dashboard, title, manageBeneficiaries. (2) Add 'admin' section with keys: dashboard, title, manageUsers, settings. (3) Add 'auth.devMode' section with keys: banner, quickLogin, loginAs. (4) Add 'authGuard' section with keys: loading, unauthorized. (5) Add role description keys under auth.register: roleDonor, roleSocialWorker, roleAdmin with description text.

**Success Criteria:**

- Navbar shows role-specific dashboard link based on currentUser.role
- Navbar uses useRouter from @/i18n/routing, not next/navigation
- Navbar shows role badge when user is logged in
- messages/de.json has socialWorker, admin, auth.devMode, and authGuard sections
- messages/en.json has socialWorker, admin, auth.devMode, and authGuard sections
- messages/de.json has role description keys under auth.register
- messages/en.json has role description keys under auth.register
- npm run build completes without errors

### 5. tests

Write at least 10 new tests covering the auth flow implementation. Tests should be placed in appropriate **tests** directories. Required tests: (1) src/lib/auth/**tests**/dev-auth.test.ts: test isDevAuthEnabled() returns true/false based on env var, test devLogin() for each role creates correct user in store. (2) src/components/**tests**/auth-guard.test.tsx: test redirects to /login when no user, test redirects to correct dashboard when wrong role, test renders children when authorized, test shows loading state initially. (3) src/app/[locale]/login/**tests**/login.test.tsx OR src/components/**tests**/login.test.tsx: test Quick-Login buttons appear when dev auth enabled, test Quick-Login buttons hidden when dev auth disabled, test role-specific redirect after login. Update vitest.setup.ts if needed to mock new dependencies (e.g., add useSearchParams mock if not present). Ensure all 25 existing tests still pass alongside the new tests. Run `npx vitest run` to verify.

**Success Criteria:**

- At least 10 new test cases are written
- Tests cover dev-auth utilities (isDevAuthEnabled, devLogin)
- Tests cover AuthGuard redirect behavior (no user, wrong role, authorized)
- Tests cover login page dev mode features
- All new tests pass when running npx vitest run
- All 25 existing tests still pass
- Total test count is at least 35

# CodeForge Plan: Implement Auth Flow with Protected Routes, Role Guards & Dev Auth (GitHub Issue #5). Requirements: 1) Dev Auth System (src/lib/auth/dev-auth.ts): When NEXT_PUBLIC_DEV_AUTH=true, enable URL-based login via /login?dev=donor, /login?dev=socialWorker, /login?dev=admin. Add programmatic devLogin(role) for tests. Show visual Dev Mode banner when active. 2) AuthGuard Component (src/components/auth-guard.tsx): Wraps protected pages, redirects to /login if not logged in, redirects to own dashboard if wrong role, loading state. 3) Login Page: Role-specific redirects after login (donor→/dashboard, socialWorker→/social-worker, admin→/admin). In dev mode show Quick-Login buttons per role. Error messages. 4) Register Page: Role selection with descriptions, validation, success redirect. 5) Navbar update: Show role-appropriate navigation. 6) i18n: New keys in messages/de.json and messages/en.json for socialWorker and admin sections. 7) At least 10 new tests. All existing 25 tests must still pass. Follow CLAUDE.md patterns. Use @/i18n/routing for navigation.

Task ID: `cf-20260220-061137-d13f`
Created: 2026-02-20T06:13:30.278654+00:00

## Packages (6)

### 1. dev-auth-system

Create the dev auth utility module and update environment configuration. Create src/lib/auth/dev-auth.ts with: (1) isDevAuthEnabled() function that checks process.env.NEXT_PUBLIC_DEV_AUTH === 'true', (2) devLogin(role) function that calls useMockDataStore.getState().login() with a preset email for the given role (e.g. 'dev-donor@codeheart.dev'), (3) DEV_ROLES constant mapping role names to their dashboard paths: donor→'/dashboard', socialWorker→'/social-worker', admin→'/admin', (4) getDevRoleDashboard(role) helper returning the correct redirect path. Also create src/components/dev-mode-banner.tsx - a fixed-position banner (e.g. bottom of screen) that shows 'Dev Mode' when NEXT_PUBLIC_DEV_AUTH=true, styled with a warning/orange color. Add NEXT_PUBLIC_DEV_AUTH=true to .env.example with a comment. The dev-auth module should be purely utility - no React hooks, just plain functions that interact with the Zustand store via getState().

**Success Criteria:**

- src/lib/auth/dev-auth.ts exists with isDevAuthEnabled(), devLogin(role), getDevRoleDashboard(role), and DEV_ROLES constant
- src/components/dev-mode-banner.tsx exists and renders a visible banner only when NEXT_PUBLIC_DEV_AUTH=true
- NEXT_PUBLIC_DEV_AUTH is added to .env.example
- devLogin('donor') creates a user with role 'donor' in the store
- devLogin('socialWorker') creates a user with role 'socialWorker' in the store
- devLogin('admin') creates a user with role 'admin' in the store
- getDevRoleDashboard returns '/dashboard' for donor, '/social-worker' for socialWorker, '/admin' for admin

### 2. auth-guard-component

Create src/components/auth-guard.tsx as a client component that wraps protected pages. Props: { children: ReactNode, allowedRoles?: User['role'][], redirectTo?: string }. Behavior: (1) Read currentUser from useMockDataStore(), (2) If no currentUser, redirect to /login using router from @/i18n/routing, (3) If allowedRoles is specified and currentUser.role is not in allowedRoles, redirect the user to their own role's dashboard (donor→/dashboard, socialWorker→/social-worker, admin→/admin) using getDevRoleDashboard from dev-auth, (4) While checking auth state, show a loading spinner/skeleton (a centered Card with a spinner or pulsing animation), (5) Once authenticated and authorized, render children. Import navigation from @/i18n/routing. The component must handle the case where the store is hydrating from localStorage (Zustand persist) by checking a hydration state.

**Success Criteria:**

- src/components/auth-guard.tsx exists as a 'use client' component
- Redirects to /login when no currentUser
- Redirects to role-appropriate dashboard when user has wrong role
- Shows loading state while checking authentication
- Renders children when user is authenticated and has correct role
- Uses @/i18n/routing for navigation (not next/navigation)

### 3. login-page-update

Update src/app/[locale]/login/page.tsx to support: (1) Dev auth mode - read ?dev=donor|socialWorker|admin from URL search params. When NEXT_PUBLIC_DEV_AUTH is true and a dev param is present, auto-login with that role using devLogin() and redirect to the role's dashboard. (2) Quick-Login buttons - when dev mode is active, show a section below the login form with 3 buttons: 'Login as Donor', 'Login as Social Worker', 'Login as Admin'. Each button calls devLogin(role) and redirects to the appropriate dashboard. (3) Role-specific redirects - change the existing login flow so after successful login, redirect based on the user's role (donor→/dashboard, socialWorker→/social-worker, admin→/admin) instead of always going to /dashboard. (4) Fix the import to use useRouter from @/i18n/routing instead of next/navigation. (5) Include the DevModeBanner component. Also update the register page (src/app/[locale]/register/page.tsx) similarly: fix useRouter import to use @/i18n/routing, add role-specific redirect after registration, and include DevModeBanner.

**Success Criteria:**

- Login page reads ?dev= query parameter and auto-logs in when dev mode enabled
- Login page shows Quick-Login buttons (donor, socialWorker, admin) when NEXT_PUBLIC_DEV_AUTH=true
- Login redirects donor to /dashboard, socialWorker to /social-worker, admin to /admin
- Register page redirects to role-appropriate dashboard after registration
- Both pages use useRouter from @/i18n/routing
- DevModeBanner is rendered on auth pages when dev mode is active
- Login page uses useRouter from @/i18n/routing not next/navigation

### 4. navbar-and-i18n-update

Update src/components/navbar.tsx to show role-appropriate navigation links: (1) For donors: Dashboard (/dashboard), Donate (/beneficiaries), (2) For socialWorkers: Social Worker Dashboard (/social-worker), Beneficiaries (/beneficiaries), (3) For admins: Admin Dashboard (/admin), Beneficiaries (/beneficiaries). Show the user's role as a Badge next to their name. Fix useRouter import to use @/i18n/routing. Add DevModeBanner to the locale layout (src/app/[locale]/layout.tsx). Update messages/de.json and messages/en.json with new i18n keys: (1) nav.socialWorker, nav.admin, nav.adminDashboard, nav.socialWorkerDashboard for new nav links, (2) auth.devMode.banner, auth.devMode.quickLogin, auth.devMode.loginAs for dev mode UI, (3) socialWorker section keys (socialWorker.dashboard.title, etc.) and admin section keys (admin.dashboard.title, etc.) as placeholders for future pages, (4) auth.register.roleDescription.donor, auth.register.roleDescription.socialWorker, etc. for role descriptions on registration. Create placeholder pages: src/app/[locale]/social-worker/page.tsx and src/app/[locale]/admin/page.tsx - simple pages wrapped with AuthGuard component restricting to the appropriate role, showing a basic dashboard title.

**Success Criteria:**

- Navbar shows different links based on currentUser.role
- Navbar shows user role as a badge
- Navbar uses useRouter from @/i18n/routing
- messages/de.json has new keys for socialWorker, admin, and devMode sections
- messages/en.json has new keys matching de.json structure
- src/app/[locale]/social-worker/page.tsx exists with AuthGuard allowing only socialWorker role
- src/app/[locale]/admin/page.tsx exists with AuthGuard allowing only admin role
- DevModeBanner is included in the locale layout

### 5. wrap-dashboard-with-authguard

Update src/app/[locale]/dashboard/page.tsx to use the AuthGuard component instead of its current manual redirect logic. Wrap the page content with <AuthGuard allowedRoles={['donor']}> so only donors can access it. Remove the existing manual redirect-to-login logic since AuthGuard handles it. Keep all existing dashboard functionality intact (welcome message, stats, quick actions, recent donations).

**Success Criteria:**

- Dashboard page uses AuthGuard component with allowedRoles=['donor']
- Previous manual redirect logic (if !currentUser redirect to /login) is removed
- All existing dashboard content and functionality is preserved
- Dashboard page still renders correctly for logged-in donor users

### 6. tests

Create comprehensive tests to cover the new auth flow. Add at minimum 10 new tests across these test files: (1) src/lib/auth/**tests**/dev-auth.test.ts - test isDevAuthEnabled() returns true/false based on env var, test devLogin() creates user with correct role, test getDevRoleDashboard() returns correct paths for each role. (2) src/components/**tests**/auth-guard.test.tsx - test renders children when user is authenticated with correct role, test redirects to /login when not authenticated, test redirects to correct dashboard when user has wrong role, test shows loading state initially. (3) src/components/**tests**/dev-mode-banner.test.tsx - test renders banner when dev mode enabled, test does not render when dev mode disabled. (4) src/components/**tests**/navbar-auth.test.tsx - test shows donor links for donor user, test shows social worker links for socialWorker user, test shows admin links for admin user. All 25 existing tests must still pass. Run the full test suite with npm test to verify.

**Success Criteria:**

- At least 10 new test cases are added
- All new tests pass
- All 25 existing tests still pass
- Tests cover dev-auth utility functions
- Tests cover AuthGuard redirect behavior
- Tests cover DevModeBanner conditional rendering
- Tests cover Navbar role-based navigation
- npm test runs successfully with 0 failures

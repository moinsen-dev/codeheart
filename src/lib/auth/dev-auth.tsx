'use client'

import { useMockDataStore } from '@/lib/stores/mock-data'

/**
 * Check if development authentication mode is enabled
 */
export function isDevAuthEnabled(): boolean {
  return process.env.NEXT_PUBLIC_DEV_AUTH === 'true'
}

/**
 * Pre-configured development users for each role
 */
const DEV_USERS = {
  donor: {
    email: 'dev-donor@codeheart.dev',
    name: 'Dev Donor',
    role: 'donor' as const,
  },
  socialWorker: {
    email: 'dev-socialworker@codeheart.dev',
    name: 'Dev Social Worker',
    role: 'socialWorker' as const,
  },
  admin: {
    email: 'dev-admin@codeheart.dev',
    name: 'Dev Admin',
    role: 'admin' as const,
  },
}

/**
 * Quick login function for development mode
 * Logs in with a pre-configured user based on role
 */
export function devLogin(role: 'donor' | 'socialWorker' | 'admin'): void {
  if (!isDevAuthEnabled()) {
    console.warn('Dev auth is not enabled. Set NEXT_PUBLIC_DEV_AUTH=true')
    return
  }

  const user = DEV_USERS[role]
  const { login } = useMockDataStore.getState()
  login(user.email, user.role)

  console.log(`Dev login successful: ${user.email} (${user.role})`)
}

/**
 * Development Mode Banner Component
 * Shows a visible banner when dev auth is enabled with login/logout controls
 */
export function DevModeBanner() {
  const currentUser = useMockDataStore((state) => state.currentUser)
  const logout = useMockDataStore((state) => state.logout)

  if (!isDevAuthEnabled()) {
    return null
  }

  return (
    <div className="fixed left-0 right-0 top-0 z-50 bg-gradient-to-r from-yellow-400 to-orange-400 px-4 py-2 text-center font-semibold text-black shadow-lg">
      <div className="flex items-center justify-center gap-3">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-black text-sm text-yellow-400">
          !
        </span>
        <span>Dev Mode Active</span>

        {currentUser ? (
          <div className="ml-4 flex items-center gap-2">
            <span className="text-sm">
              Logged in as: <strong>{currentUser.role}</strong>
            </span>
            <button
              onClick={logout}
              className="rounded bg-black px-3 py-1 text-sm text-yellow-400 transition-colors hover:bg-gray-800"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="ml-4 flex items-center gap-2">
            <button
              onClick={() => devLogin('donor')}
              className="rounded bg-black px-3 py-1 text-sm text-yellow-400 transition-colors hover:bg-gray-800"
            >
              Login as Donor
            </button>
            <button
              onClick={() => devLogin('socialWorker')}
              className="rounded bg-black px-3 py-1 text-sm text-yellow-400 transition-colors hover:bg-gray-800"
            >
              Login as Social Worker
            </button>
            <button
              onClick={() => devLogin('admin')}
              className="rounded bg-black px-3 py-1 text-sm text-yellow-400 transition-colors hover:bg-gray-800"
            >
              Login as Admin
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

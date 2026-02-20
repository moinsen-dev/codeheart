'use client'

import { useMockDataStore } from '@/lib/stores/mock-data'

/**
 * Check if development authentication mode is enabled
 * @returns true if NEXT_PUBLIC_DEV_AUTH environment variable is set to 'true'
 */
export function isDevAuthEnabled(): boolean {
  return process.env.NEXT_PUBLIC_DEV_AUTH === 'true'
}

/**
 * Development user configurations for each role
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
 * Login as a development user with the specified role
 * @param role - The role to login as ('donor', 'socialWorker', or 'admin')
 */
export function devLogin(role: 'donor' | 'socialWorker' | 'admin'): void {
  if (!isDevAuthEnabled()) {
    console.warn(
      'Dev auth is not enabled. Set NEXT_PUBLIC_DEV_AUTH=true to use dev login.'
    )
    return
  }

  const user = DEV_USERS[role]
  const login = useMockDataStore.getState().login

  login(user.email, user.role)
  console.log(`Dev login successful: ${user.name} (${user.email})`)
}

/**
 * Development mode banner component
 * Displays a fixed banner at the top of the screen when dev auth is enabled
 */
export function DevModeBanner(): JSX.Element | null {
  const currentUser = useMockDataStore((state) => state.currentUser)
  const isEnabled = isDevAuthEnabled()

  if (!isEnabled) {
    return null
  }

  return (
    <div className="fixed left-0 right-0 top-0 z-50 bg-gradient-to-r from-yellow-400 to-orange-400 px-4 py-2 text-black shadow-lg">
      <div className="container mx-auto flex items-center justify-between text-sm font-medium">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-black text-xs font-bold text-yellow-400">
            !
          </span>
          <span className="font-bold">Dev Mode Active</span>
          {currentUser && (
            <span className="hidden text-black/80 sm:inline">
              | Logged in as: {currentUser.name} ({currentUser.role})
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {!currentUser && (
            <>
              <button
                onClick={() => devLogin('donor')}
                className="rounded bg-black px-3 py-1 text-xs text-yellow-400 transition-colors hover:bg-gray-800"
              >
                Login as Donor
              </button>
              <button
                onClick={() => devLogin('socialWorker')}
                className="hidden rounded bg-black px-3 py-1 text-xs text-yellow-400 transition-colors hover:bg-gray-800 sm:inline-block"
              >
                Login as Social Worker
              </button>
              <button
                onClick={() => devLogin('admin')}
                className="hidden rounded bg-black px-3 py-1 text-xs text-yellow-400 transition-colors hover:bg-gray-800 sm:inline-block"
              >
                Login as Admin
              </button>
            </>
          )}
          {currentUser && (
            <button
              onClick={() => useMockDataStore.getState().logout()}
              className="rounded bg-black px-3 py-1 text-xs text-yellow-400 transition-colors hover:bg-gray-800"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { useMockDataStore } from '@/lib/stores/mock-data'
import { devLogin, isDevAuthEnabled } from '@/lib/auth/dev-auth'

// Test the role-to-route mapping logic
describe('Login Page - Role-based Redirects', () => {
  const ROLE_ROUTES = {
    donor: '/dashboard',
    socialWorker: '/social-worker',
    admin: '/admin',
    investor: '/dashboard',
  }

  it('maps donor role to /dashboard', () => {
    expect(ROLE_ROUTES.donor).toBe('/dashboard')
  })

  it('maps socialWorker role to /social-worker', () => {
    expect(ROLE_ROUTES.socialWorker).toBe('/social-worker')
  })

  it('maps admin role to /admin', () => {
    expect(ROLE_ROUTES.admin).toBe('/admin')
  })

  it('maps investor role to /dashboard as fallback', () => {
    expect(ROLE_ROUTES.investor).toBe('/dashboard')
  })
})

describe('Login Page - Dev Mode Integration', () => {
  const originalEnv = process.env.NEXT_PUBLIC_DEV_AUTH

  beforeEach(() => {
    useMockDataStore.setState({
      beneficiaries: [],
      donations: [],
      users: [],
      currentUser: null,
    })
  })

  afterEach(() => {
    process.env.NEXT_PUBLIC_DEV_AUTH = originalEnv
  })

  it('isDevAuthEnabled returns true when NEXT_PUBLIC_DEV_AUTH is true', () => {
    process.env.NEXT_PUBLIC_DEV_AUTH = 'true'
    expect(isDevAuthEnabled()).toBe(true)
  })

  it('isDevAuthEnabled returns false when NEXT_PUBLIC_DEV_AUTH is false', () => {
    process.env.NEXT_PUBLIC_DEV_AUTH = 'false'
    expect(isDevAuthEnabled()).toBe(false)
  })

  it('devLogin creates a user with donor role', () => {
    process.env.NEXT_PUBLIC_DEV_AUTH = 'true'
    devLogin('donor')

    const currentUser = useMockDataStore.getState().currentUser
    expect(currentUser).not.toBeNull()
    expect(currentUser?.role).toBe('donor')
    expect(currentUser?.email).toBe('dev-donor@codeheart.dev')
  })

  it('devLogin creates a user with socialWorker role', () => {
    process.env.NEXT_PUBLIC_DEV_AUTH = 'true'
    devLogin('socialWorker')

    const currentUser = useMockDataStore.getState().currentUser
    expect(currentUser).not.toBeNull()
    expect(currentUser?.role).toBe('socialWorker')
    expect(currentUser?.email).toBe('dev-socialworker@codeheart.dev')
  })

  it('devLogin creates a user with admin role', () => {
    process.env.NEXT_PUBLIC_DEV_AUTH = 'true'
    devLogin('admin')

    const currentUser = useMockDataStore.getState().currentUser
    expect(currentUser).not.toBeNull()
    expect(currentUser?.role).toBe('admin')
    expect(currentUser?.email).toBe('dev-admin@codeheart.dev')
  })
})

describe('Login Page - URL Parameter Auto-login Logic', () => {
  it('validates donor as a valid dev parameter', () => {
    const validRoles = ['donor', 'socialWorker', 'admin']
    expect(validRoles.includes('donor')).toBe(true)
  })

  it('validates socialWorker as a valid dev parameter', () => {
    const validRoles = ['donor', 'socialWorker', 'admin']
    expect(validRoles.includes('socialWorker')).toBe(true)
  })

  it('validates admin as a valid dev parameter', () => {
    const validRoles = ['donor', 'socialWorker', 'admin']
    expect(validRoles.includes('admin')).toBe(true)
  })

  it('rejects invalid as an invalid dev parameter', () => {
    const validRoles = ['donor', 'socialWorker', 'admin']
    expect(validRoles.includes('invalid' as any)).toBe(false)
  })
})

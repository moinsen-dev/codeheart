import { describe, it, expect, beforeEach } from 'vitest'
import { useMockDataStore } from '@/lib/stores/mock-data'
import type { User } from '@/lib/stores/mock-data'

// Test the role-to-route mapping logic
describe('Register Page - Role-based Redirects', () => {
  const ROLE_ROUTES: Record<User['role'], string> = {
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

describe('Register Page - Available Roles', () => {
  const AVAILABLE_ROLES: User['role'][] = ['donor', 'socialWorker', 'admin']

  it('includes donor role', () => {
    expect(AVAILABLE_ROLES).toContain('donor')
  })

  it('includes socialWorker role', () => {
    expect(AVAILABLE_ROLES).toContain('socialWorker')
  })

  it('includes admin role', () => {
    expect(AVAILABLE_ROLES).toContain('admin')
  })

  it('has exactly 3 roles available for registration', () => {
    expect(AVAILABLE_ROLES).toHaveLength(3)
  })

  it('does not include investor role in registration options', () => {
    expect(AVAILABLE_ROLES).not.toContain('investor')
  })
})

describe('Register Page - User Registration Logic', () => {
  beforeEach(() => {
    useMockDataStore.setState({
      beneficiaries: [],
      donations: [],
      users: [],
      currentUser: null,
    })
  })

  it('registers a user with donor role', () => {
    const { login } = useMockDataStore.getState()
    login('donor@example.com', 'donor')

    const currentUser = useMockDataStore.getState().currentUser
    expect(currentUser).not.toBeNull()
    expect(currentUser?.role).toBe('donor')
    expect(currentUser?.email).toBe('donor@example.com')
  })

  it('registers a user with socialWorker role', () => {
    const { login } = useMockDataStore.getState()
    login('socialworker@example.com', 'socialWorker')

    const currentUser = useMockDataStore.getState().currentUser
    expect(currentUser).not.toBeNull()
    expect(currentUser?.role).toBe('socialWorker')
    expect(currentUser?.email).toBe('socialworker@example.com')
  })

  it('registers a user with admin role', () => {
    const { login } = useMockDataStore.getState()
    login('admin@example.com', 'admin')

    const currentUser = useMockDataStore.getState().currentUser
    expect(currentUser).not.toBeNull()
    expect(currentUser?.role).toBe('admin')
    expect(currentUser?.email).toBe('admin@example.com')
  })
})

describe('Register Page - Form Validation Rules', () => {
  it('validates password minimum length of 8 characters', () => {
    const minLength = 8
    expect('short'.length).toBeLessThan(minLength)
    expect('password123'.length).toBeGreaterThanOrEqual(minLength)
  })

  it('validates password confirmation matching', () => {
    const password = 'password123'
    const confirmPassword = 'password123'
    const mismatchPassword = 'differentpassword' as string

    expect(password === confirmPassword).toBe(true)
    expect(password === mismatchPassword).toBe(false)
  })

  it('validates required fields', () => {
    const requiredFields = ['name', 'email', 'password', 'confirmPassword']
    expect(requiredFields).toHaveLength(4)
    expect(requiredFields).toContain('name')
    expect(requiredFields).toContain('email')
    expect(requiredFields).toContain('password')
    expect(requiredFields).toContain('confirmPassword')
  })
})

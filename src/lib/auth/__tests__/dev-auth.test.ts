import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { isDevAuthEnabled, devLogin } from '../dev-auth'
import { useMockDataStore } from '@/lib/stores/mock-data'

describe('Dev Auth', () => {
  // Save original env value
  const originalEnv = process.env.NEXT_PUBLIC_DEV_AUTH

  beforeEach(() => {
    // Reset store state before each test
    useMockDataStore.setState({
      beneficiaries: [],
      donations: [],
      users: [],
      currentUser: null,
    })

    // Reset console.log and console.warn mocks
    vi.clearAllMocks()
  })

  afterEach(() => {
    // Restore original env value
    process.env.NEXT_PUBLIC_DEV_AUTH = originalEnv
  })

  describe('isDevAuthEnabled', () => {
    it('returns true when NEXT_PUBLIC_DEV_AUTH is "true"', () => {
      process.env.NEXT_PUBLIC_DEV_AUTH = 'true'
      expect(isDevAuthEnabled()).toBe(true)
    })

    it('returns false when NEXT_PUBLIC_DEV_AUTH is "false"', () => {
      process.env.NEXT_PUBLIC_DEV_AUTH = 'false'
      expect(isDevAuthEnabled()).toBe(false)
    })

    it('returns false when NEXT_PUBLIC_DEV_AUTH is undefined', () => {
      process.env.NEXT_PUBLIC_DEV_AUTH = undefined
      expect(isDevAuthEnabled()).toBe(false)
    })

    it('returns false when NEXT_PUBLIC_DEV_AUTH is any other value', () => {
      process.env.NEXT_PUBLIC_DEV_AUTH = 'yes'
      expect(isDevAuthEnabled()).toBe(false)
    })
  })

  describe('devLogin', () => {
    describe('when dev auth is enabled', () => {
      beforeEach(() => {
        process.env.NEXT_PUBLIC_DEV_AUTH = 'true'
      })

      it('logs in as donor with correct credentials', () => {
        devLogin('donor')
        const { currentUser } = useMockDataStore.getState()

        expect(currentUser).not.toBeNull()
        expect(currentUser?.email).toBe('dev-donor@codeheart.dev')
        expect(currentUser?.role).toBe('donor')
      })

      it('logs in as social worker with correct credentials', () => {
        devLogin('socialWorker')
        const { currentUser } = useMockDataStore.getState()

        expect(currentUser).not.toBeNull()
        expect(currentUser?.email).toBe('dev-socialworker@codeheart.dev')
        expect(currentUser?.role).toBe('socialWorker')
      })

      it('logs in as admin with correct credentials', () => {
        devLogin('admin')
        const { currentUser } = useMockDataStore.getState()

        expect(currentUser).not.toBeNull()
        expect(currentUser?.email).toBe('dev-admin@codeheart.dev')
        expect(currentUser?.role).toBe('admin')
      })

      it('adds user to the users array', () => {
        devLogin('donor')
        const { users } = useMockDataStore.getState()

        expect(users).toHaveLength(1)
        expect(users[0].email).toBe('dev-donor@codeheart.dev')
      })

      it('replaces current user when logging in with different role', () => {
        devLogin('donor')
        expect(useMockDataStore.getState().currentUser?.role).toBe('donor')

        devLogin('admin')
        expect(useMockDataStore.getState().currentUser?.role).toBe('admin')
      })

      it('logs success message to console', () => {
        const consoleSpy = vi.spyOn(console, 'log')
        devLogin('donor')

        expect(consoleSpy).toHaveBeenCalledWith(
          expect.stringContaining('Dev login successful')
        )
        expect(consoleSpy).toHaveBeenCalledWith(
          expect.stringContaining('dev-donor@codeheart.dev')
        )
      })
    })

    describe('when dev auth is disabled', () => {
      beforeEach(() => {
        process.env.NEXT_PUBLIC_DEV_AUTH = 'false'
      })

      it('does not log in and shows warning', () => {
        const warnSpy = vi.spyOn(console, 'warn')
        devLogin('donor')
        const { currentUser } = useMockDataStore.getState()

        expect(currentUser).toBeNull()
        expect(warnSpy).toHaveBeenCalledWith(
          expect.stringContaining('Dev auth is not enabled')
        )
      })

      it('does not add user to users array', () => {
        devLogin('donor')
        const { users } = useMockDataStore.getState()

        expect(users).toHaveLength(0)
      })
    })
  })

  describe('Dev user configurations', () => {
    beforeEach(() => {
      process.env.NEXT_PUBLIC_DEV_AUTH = 'true'
    })

    it('uses consistent email format for all roles', () => {
      devLogin('donor')
      const donor = useMockDataStore.getState().currentUser
      expect(donor?.email).toMatch(/@codeheart\.dev$/)

      useMockDataStore.getState().logout()

      devLogin('socialWorker')
      const socialWorker = useMockDataStore.getState().currentUser
      expect(socialWorker?.email).toMatch(/@codeheart\.dev$/)

      useMockDataStore.getState().logout()

      devLogin('admin')
      const admin = useMockDataStore.getState().currentUser
      expect(admin?.email).toMatch(/@codeheart\.dev$/)
    })

    it('assigns unique emails for each role', () => {
      devLogin('donor')
      const donorEmail = useMockDataStore.getState().currentUser?.email
      useMockDataStore.getState().logout()

      devLogin('socialWorker')
      const socialWorkerEmail = useMockDataStore.getState().currentUser?.email
      useMockDataStore.getState().logout()

      devLogin('admin')
      const adminEmail = useMockDataStore.getState().currentUser?.email

      expect(donorEmail).not.toBe(socialWorkerEmail)
      expect(donorEmail).not.toBe(adminEmail)
      expect(socialWorkerEmail).not.toBe(adminEmail)
    })
  })
})

import { describe, it, expect, beforeEach } from 'vitest'
import { useMockDataStore } from '../stores/mock-data'

describe('MockDataStore', () => {
  beforeEach(() => {
    // Reset store state before each test using setState
    useMockDataStore.setState({
      beneficiaries: [],
      donations: [],
      users: [],
      currentUser: null,
    })
  })

  describe('generateMockData', () => {
    it('generates 20 beneficiaries', () => {
      useMockDataStore.getState().generateMockData()
      const { beneficiaries } = useMockDataStore.getState()
      expect(beneficiaries).toHaveLength(20)
    })

    it('each beneficiary has required fields', () => {
      useMockDataStore.getState().generateMockData()
      const { beneficiaries } = useMockDataStore.getState()

      const beneficiary = beneficiaries[0]
      expect(beneficiary).toHaveProperty('id')
      expect(beneficiary).toHaveProperty('codeword')
      expect(beneficiary).toHaveProperty('name')
      expect(beneficiary).toHaveProperty('story')
      expect(beneficiary).toHaveProperty('needs')
      expect(beneficiary).toHaveProperty('location')
      expect(beneficiary).toHaveProperty('verified')
      expect(beneficiary).toHaveProperty('currentFunds')
      expect(beneficiary).toHaveProperty('targetFunds')
    })

    it('beneficiaries have valid locations', () => {
      useMockDataStore.getState().generateMockData()
      const { beneficiaries } = useMockDataStore.getState()

      const validLocations = [
        'Hamburg',
        'Berlin',
        'München',
        'Köln',
        'Frankfurt',
      ]
      beneficiaries.forEach((b) => {
        expect(validLocations).toContain(b.location)
      })
    })
  })

  describe('login', () => {
    it('creates a new user and sets as current user', () => {
      useMockDataStore.getState().login('test@example.com', 'donor')
      const { currentUser } = useMockDataStore.getState()

      expect(currentUser).not.toBeNull()
      expect(currentUser?.email).toBe('test@example.com')
      expect(currentUser?.role).toBe('donor')
    })

    it('adds user to users array', () => {
      useMockDataStore.getState().login('test@example.com', 'donor')
      const { users } = useMockDataStore.getState()

      expect(users).toHaveLength(1)
      expect(users[0].email).toBe('test@example.com')
    })
  })

  describe('logout', () => {
    it('clears current user', () => {
      useMockDataStore.getState().login('test@example.com', 'donor')
      expect(useMockDataStore.getState().currentUser).not.toBeNull()

      useMockDataStore.getState().logout()
      expect(useMockDataStore.getState().currentUser).toBeNull()
    })
  })

  describe('getBeneficiaryByCodeword', () => {
    it('finds beneficiary by codeword', () => {
      useMockDataStore.getState().generateMockData()
      const { beneficiaries, getBeneficiaryByCodeword } =
        useMockDataStore.getState()

      const firstBeneficiary = beneficiaries[0]
      const found = getBeneficiaryByCodeword(firstBeneficiary.codeword)

      expect(found).toBeDefined()
      expect(found?.id).toBe(firstBeneficiary.id)
    })

    it('is case insensitive', () => {
      useMockDataStore.getState().generateMockData()
      const { beneficiaries, getBeneficiaryByCodeword } =
        useMockDataStore.getState()

      const firstBeneficiary = beneficiaries[0]
      const upperCase = getBeneficiaryByCodeword(
        firstBeneficiary.codeword.toUpperCase()
      )
      const lowerCase = getBeneficiaryByCodeword(
        firstBeneficiary.codeword.toLowerCase()
      )

      expect(upperCase?.id).toBe(firstBeneficiary.id)
      expect(lowerCase?.id).toBe(firstBeneficiary.id)
    })

    it('returns undefined for non-existent codeword', () => {
      useMockDataStore.getState().generateMockData()
      const { getBeneficiaryByCodeword } = useMockDataStore.getState()

      const found = getBeneficiaryByCodeword('NonExistentCode999')
      expect(found).toBeUndefined()
    })
  })
})

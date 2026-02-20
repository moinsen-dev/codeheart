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

    it('excludes soft-deleted beneficiaries', () => {
      useMockDataStore.getState().generateMockData()
      const { beneficiaries, removeBeneficiary, getBeneficiaryByCodeword } =
        useMockDataStore.getState()

      const firstBeneficiary = beneficiaries[0]
      const codeword = firstBeneficiary.codeword

      // Verify beneficiary exists before deletion
      expect(getBeneficiaryByCodeword(codeword)).toBeDefined()

      // Soft delete the beneficiary
      removeBeneficiary(firstBeneficiary.id)

      // Should not find soft-deleted beneficiary
      expect(getBeneficiaryByCodeword(codeword)).toBeUndefined()
    })
  })

  describe('Social Worker Actions', () => {
    describe('getMyBeneficiaries', () => {
      it('returns beneficiaries for a specific social worker', () => {
        useMockDataStore.getState().generateMockData()
        const { beneficiaries, getMyBeneficiaries } =
          useMockDataStore.getState()

        // Get a social worker ID from existing beneficiaries
        const socialWorkerId = beneficiaries[0].socialWorkerId
        const myBeneficiaries = getMyBeneficiaries(socialWorkerId)

        // Verify all returned beneficiaries belong to this social worker
        expect(myBeneficiaries.length).toBeGreaterThan(0)
        myBeneficiaries.forEach((b) => {
          expect(b.socialWorkerId).toBe(socialWorkerId)
        })
      })

      it('returns empty array for social worker with no beneficiaries', () => {
        useMockDataStore.getState().generateMockData()
        const { getMyBeneficiaries } = useMockDataStore.getState()

        const nonExistentSocialWorkerId = 'non-existent-id'
        const myBeneficiaries = getMyBeneficiaries(nonExistentSocialWorkerId)

        expect(myBeneficiaries).toEqual([])
      })

      it('excludes soft-deleted beneficiaries', () => {
        useMockDataStore.getState().generateMockData()
        const { beneficiaries, removeBeneficiary, getMyBeneficiaries } =
          useMockDataStore.getState()

        const socialWorkerId = beneficiaries[0].socialWorkerId
        const beneficiaryToDelete = beneficiaries[0]

        // Get count before deletion
        const beforeCount = getMyBeneficiaries(socialWorkerId).length

        // Soft delete one beneficiary
        removeBeneficiary(beneficiaryToDelete.id)

        // Count should decrease by 1
        const afterCount = getMyBeneficiaries(socialWorkerId).length
        expect(afterCount).toBe(beforeCount - 1)
      })
    })

    describe('addBeneficiary', () => {
      it('creates a new beneficiary with auto-generated fields', () => {
        const { addBeneficiary, beneficiaries } = useMockDataStore.getState()

        const newBeneficiaryData = {
          name: 'Test Beneficiary',
          story: 'Test story',
          needs: ['Food', 'Shelter'],
          location: 'Berlin',
          verified: false,
          socialWorkerId: 'social-worker-123',
          targetFunds: 1000,
        }

        addBeneficiary(newBeneficiaryData)
        const { beneficiaries: updatedBeneficiaries } =
          useMockDataStore.getState()

        expect(updatedBeneficiaries.length).toBe(beneficiaries.length + 1)

        const newBeneficiary =
          updatedBeneficiaries[updatedBeneficiaries.length - 1]
        expect(newBeneficiary.name).toBe(newBeneficiaryData.name)
        expect(newBeneficiary.story).toBe(newBeneficiaryData.story)
        expect(newBeneficiary.needs).toEqual(newBeneficiaryData.needs)
        expect(newBeneficiary.location).toBe(newBeneficiaryData.location)
        expect(newBeneficiary.verified).toBe(newBeneficiaryData.verified)
        expect(newBeneficiary.socialWorkerId).toBe(
          newBeneficiaryData.socialWorkerId
        )
        expect(newBeneficiary.targetFunds).toBe(newBeneficiaryData.targetFunds)

        // Verify auto-generated fields
        expect(newBeneficiary.id).toBeDefined()
        expect(newBeneficiary.codeword).toBeDefined()
        expect(newBeneficiary.currentFunds).toBe(0)
        expect(newBeneficiary.photoUrl).toContain('dicebear.com')
        expect(newBeneficiary.createdAt).toBeInstanceOf(Date)
        expect(newBeneficiary.deletedAt).toBeUndefined()
      })
    })

    describe('updateBeneficiary', () => {
      it('updates specified fields of a beneficiary', () => {
        useMockDataStore.getState().generateMockData()
        const { beneficiaries, updateBeneficiary } = useMockDataStore.getState()

        const beneficiaryToUpdate = beneficiaries[0]
        const updates = {
          name: 'Updated Name',
          story: 'Updated story',
          verified: true,
        }

        updateBeneficiary(beneficiaryToUpdate.id, updates)

        const { beneficiaries: updatedBeneficiaries } =
          useMockDataStore.getState()
        const updatedBeneficiary = updatedBeneficiaries.find(
          (b) => b.id === beneficiaryToUpdate.id
        )

        expect(updatedBeneficiary?.name).toBe(updates.name)
        expect(updatedBeneficiary?.story).toBe(updates.story)
        expect(updatedBeneficiary?.verified).toBe(updates.verified)

        // Verify other fields remain unchanged
        expect(updatedBeneficiary?.id).toBe(beneficiaryToUpdate.id)
        expect(updatedBeneficiary?.codeword).toBe(beneficiaryToUpdate.codeword)
      })

      it('allows partial updates', () => {
        useMockDataStore.getState().generateMockData()
        const { beneficiaries, updateBeneficiary } = useMockDataStore.getState()

        const beneficiaryToUpdate = beneficiaries[0]
        const originalName = beneficiaryToUpdate.name
        const updates = {
          verified: true,
        }

        updateBeneficiary(beneficiaryToUpdate.id, updates)

        const { beneficiaries: updatedBeneficiaries } =
          useMockDataStore.getState()
        const updatedBeneficiary = updatedBeneficiaries.find(
          (b) => b.id === beneficiaryToUpdate.id
        )

        expect(updatedBeneficiary?.verified).toBe(true)
        expect(updatedBeneficiary?.name).toBe(originalName)
      })
    })

    describe('removeBeneficiary', () => {
      it('soft deletes a beneficiary by setting deletedAt', () => {
        useMockDataStore.getState().generateMockData()
        const { beneficiaries, removeBeneficiary } = useMockDataStore.getState()

        const beneficiaryToDelete = beneficiaries[0]
        const beforeCount = beneficiaries.length

        removeBeneficiary(beneficiaryToDelete.id)

        const { beneficiaries: updatedBeneficiaries } =
          useMockDataStore.getState()

        // Verify array length remains the same (soft delete)
        expect(updatedBeneficiaries.length).toBe(beforeCount)

        // Verify deletedAt is set
        const deletedBeneficiary = updatedBeneficiaries.find(
          (b) => b.id === beneficiaryToDelete.id
        )
        expect(deletedBeneficiary?.deletedAt).toBeInstanceOf(Date)
      })

      it('does not affect other beneficiaries', () => {
        useMockDataStore.getState().generateMockData()
        const { beneficiaries, removeBeneficiary } = useMockDataStore.getState()

        const beneficiaryToDelete = beneficiaries[0]
        removeBeneficiary(beneficiaryToDelete.id)

        const { beneficiaries: updatedBeneficiaries } =
          useMockDataStore.getState()

        // Verify other beneficiaries don't have deletedAt
        const otherBeneficiaries = updatedBeneficiaries.filter(
          (b) => b.id !== beneficiaryToDelete.id
        )
        otherBeneficiaries.forEach((b) => {
          expect(b.deletedAt).toBeUndefined()
        })
      })
    })
  })
})

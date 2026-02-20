/**
 * Tests for social worker i18n message keys
 * Verifies that all required translation keys exist in both de.json and en.json
 */

import deMessages from '../../../messages/de.json'
import enMessages from '../../../messages/en.json'

describe('Social Worker i18n Messages', () => {
  // Required keys based on the task specification
  const requiredKeys = [
    // Dashboard keys
    'welcome',
    'activeBeneficiaries',
    'totalDonations',
    'openNeeds',
    'quickActions',
    'addBeneficiary',
    'viewBeneficiaries',
    'overview',

    // Beneficiary list keys
    'beneficiaryList',
    'filterByLocation',
    'filterByStatus',
    'filterByNeeds',
    'allLocations',
    'allStatuses',
    'verified',
    'unverified',
    'codeword',
    'funds',
    'target',
    'noBeneficiaries',
    'edit',
    'remove',
    'confirmRemove',
    'search',

    // Add/Edit form keys
    'addNew',
    'editBeneficiary',
    'name',
    'story',
    'needs',
    'location',
    'targetAmount',
    'save',
    'cancel',
    'codewordGenerated',
    'formValidation',
    'nameRequired',
    'storyRequired',
    'locationRequired',
    'needsRequired',
    'targetRequired',
    'beneficiarySaved',
    'beneficiaryRemoved',
  ]

  describe('German translations (de.json)', () => {
    it('should have socialWorker namespace', () => {
      expect(deMessages).toHaveProperty('socialWorker')
      expect(typeof deMessages.socialWorker).toBe('object')
    })

    it('should have all required keys in socialWorker namespace', () => {
      requiredKeys.forEach((key) => {
        expect(deMessages.socialWorker).toHaveProperty(key)
        expect(
          typeof deMessages.socialWorker[
            key as keyof typeof deMessages.socialWorker
          ]
        ).toBe('string')
        expect(
          (
            deMessages.socialWorker[
              key as keyof typeof deMessages.socialWorker
            ] as string
          ).length
        ).toBeGreaterThan(0)
      })
    })

    it('should have non-empty German translations', () => {
      requiredKeys.forEach((key) => {
        const value = deMessages.socialWorker[
          key as keyof typeof deMessages.socialWorker
        ] as string
        expect(value.trim()).not.toBe('')
      })
    })

    it('should preserve existing keys', () => {
      expect(deMessages.socialWorker).toHaveProperty('dashboard')
      expect(deMessages.socialWorker).toHaveProperty('title')
      expect(deMessages.socialWorker).toHaveProperty('manageBeneficiaries')
    })
  })

  describe('English translations (en.json)', () => {
    it('should have socialWorker namespace', () => {
      expect(enMessages).toHaveProperty('socialWorker')
      expect(typeof enMessages.socialWorker).toBe('object')
    })

    it('should have all required keys in socialWorker namespace', () => {
      requiredKeys.forEach((key) => {
        expect(enMessages.socialWorker).toHaveProperty(key)
        expect(
          typeof enMessages.socialWorker[
            key as keyof typeof enMessages.socialWorker
          ]
        ).toBe('string')
        expect(
          (
            enMessages.socialWorker[
              key as keyof typeof enMessages.socialWorker
            ] as string
          ).length
        ).toBeGreaterThan(0)
      })
    })

    it('should have non-empty English translations', () => {
      requiredKeys.forEach((key) => {
        const value = enMessages.socialWorker[
          key as keyof typeof enMessages.socialWorker
        ] as string
        expect(value.trim()).not.toBe('')
      })
    })

    it('should preserve existing keys', () => {
      expect(enMessages.socialWorker).toHaveProperty('dashboard')
      expect(enMessages.socialWorker).toHaveProperty('title')
      expect(enMessages.socialWorker).toHaveProperty('manageBeneficiaries')
    })
  })

  describe('Consistency between locales', () => {
    it('should have same keys in both German and English', () => {
      const deKeys = Object.keys(deMessages.socialWorker).sort()
      const enKeys = Object.keys(enMessages.socialWorker).sort()

      expect(deKeys).toEqual(enKeys)
    })

    it('should not have identical translations (no copy-paste)', () => {
      // Verify that German and English are actually different
      // (at least some keys should differ)
      let differentCount = 0
      requiredKeys.forEach((key) => {
        const deValue =
          deMessages.socialWorker[key as keyof typeof deMessages.socialWorker]
        const enValue =
          enMessages.socialWorker[key as keyof typeof enMessages.socialWorker]
        if (deValue !== enValue) {
          differentCount++
        }
      })

      // Most translations should be different (allowing some identical like proper nouns)
      expect(differentCount).toBeGreaterThan(requiredKeys.length * 0.8)
    })
  })

  describe('Translation quality checks', () => {
    it('should have appropriate German translations', () => {
      // Spot check a few key translations
      expect(deMessages.socialWorker.welcome).toBe('Willkommen zurück')
      expect(deMessages.socialWorker.activeBeneficiaries).toBe(
        'Aktive Empfänger'
      )
      expect(deMessages.socialWorker.save).toBe('Speichern')
      expect(deMessages.socialWorker.cancel).toBe('Abbrechen')
    })

    it('should have appropriate English translations', () => {
      // Spot check a few key translations
      expect(enMessages.socialWorker.welcome).toBe('Welcome back')
      expect(enMessages.socialWorker.activeBeneficiaries).toBe(
        'Active Beneficiaries'
      )
      expect(enMessages.socialWorker.save).toBe('Save')
      expect(enMessages.socialWorker.cancel).toBe('Cancel')
    })

    it('should use proper German capitalization for nouns', () => {
      // German nouns should be capitalized
      expect(deMessages.socialWorker.name).toMatch(/^[A-ZÄÖÜ]/)
      expect(deMessages.socialWorker.location).toMatch(/^[A-ZÄÖÜ]/)
      expect(deMessages.socialWorker.needs).toMatch(/^[A-ZÄÖÜ]/)
    })
  })

  describe('JSON structure validation', () => {
    it('should have valid JSON in de.json', () => {
      expect(() => JSON.stringify(deMessages)).not.toThrow()
    })

    it('should have valid JSON in en.json', () => {
      expect(() => JSON.stringify(enMessages)).not.toThrow()
    })
  })
})

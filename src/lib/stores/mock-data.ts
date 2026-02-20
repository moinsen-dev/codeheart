import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { faker } from '@faker-js/faker/locale/de'

export interface Beneficiary {
  id: string
  codeword: string
  name: string
  story: string
  needs: string[]
  location: string
  verified: boolean
  socialWorkerId: string
  photoUrl: string
  currentFunds: number
  targetFunds: number
  createdAt: Date
  deletedAt?: Date
}

export interface Donation {
  id: string
  donorId: string
  beneficiaryId: string
  amount: number
  status: 'pending' | 'completed' | 'failed'
  message?: string
  createdAt: Date
  processedAt?: Date
}

export interface User {
  id: string
  email: string
  role: 'donor' | 'socialWorker' | 'investor' | 'admin'
  name: string
  createdAt: Date
}

interface MockDataStore {
  beneficiaries: Beneficiary[]
  donations: Donation[]
  users: User[]
  currentUser: User | null

  // Actions
  generateMockData: () => void
  login: (email: string, role: User['role']) => void
  logout: () => void
  makeDonation: (
    beneficiaryId: string,
    amount: number,
    message?: string
  ) => void
  getBeneficiaryByCodeword: (codeword: string) => Beneficiary | undefined

  // Social Worker Actions
  getMyBeneficiaries: (socialWorkerId: string) => Beneficiary[]
  addBeneficiary: (
    data: Omit<
      Beneficiary,
      | 'id'
      | 'codeword'
      | 'createdAt'
      | 'currentFunds'
      | 'photoUrl'
      | 'deletedAt'
    >
  ) => void
  updateBeneficiary: (
    id: string,
    data: Partial<
      Pick<
        Beneficiary,
        'name' | 'story' | 'needs' | 'location' | 'targetFunds' | 'verified'
      >
    >
  ) => void
  removeBeneficiary: (id: string) => void
}

// Generate initial mock beneficiaries
const generateBeneficiaries = (count: number): Beneficiary[] => {
  return Array.from({ length: count }, () => ({
    id: faker.string.uuid(),
    codeword: `${faker.person.firstName()}${faker.number.int({ min: 10, max: 99 })}`,
    name: faker.person.firstName(),
    story: faker.lorem.paragraphs(2),
    needs: faker.helpers.arrayElements(
      [
        'Lebensmittel',
        'Unterkunft',
        'Medizinische Versorgung',
        'Kleidung',
        'Hygieneartikel',
      ],
      3
    ),
    location: faker.helpers.arrayElement([
      'Hamburg',
      'Berlin',
      'München',
      'Köln',
      'Frankfurt',
    ]),
    verified: true,
    socialWorkerId: faker.string.uuid(),
    photoUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${faker.string.uuid()}`,
    currentFunds: faker.number.int({ min: 0, max: 500 }),
    targetFunds: faker.number.int({ min: 500, max: 2000 }),
    createdAt: faker.date.recent({ days: 30 }),
  }))
}

export const useMockDataStore = create<MockDataStore>()(
  persist(
    (set, get) => ({
      beneficiaries: [],
      donations: [],
      users: [],
      currentUser: null,

      generateMockData: () => {
        const beneficiaries = generateBeneficiaries(20)
        set({ beneficiaries })
      },

      login: (email: string, role: User['role']) => {
        const user: User = {
          id: faker.string.uuid(),
          email,
          role,
          name: faker.person.fullName(),
          createdAt: new Date(),
        }
        set((state) => ({
          users: [...state.users, user],
          currentUser: user,
        }))
      },

      logout: () => {
        set({ currentUser: null })
      },

      makeDonation: (
        beneficiaryId: string,
        amount: number,
        message?: string
      ) => {
        const { currentUser } = get()
        if (!currentUser) return

        const donation: Donation = {
          id: faker.string.uuid(),
          donorId: currentUser.id,
          beneficiaryId,
          amount,
          status: 'pending',
          message,
          createdAt: new Date(),
        }

        set((state) => ({
          donations: [...state.donations, donation],
        }))

        // Simulate processing after 2 seconds
        setTimeout(() => {
          set((state) => ({
            donations: state.donations.map((d) =>
              d.id === donation.id
                ? {
                    ...d,
                    status: 'completed' as const,
                    processedAt: new Date(),
                  }
                : d
            ),
            beneficiaries: state.beneficiaries.map((b) =>
              b.id === beneficiaryId
                ? { ...b, currentFunds: b.currentFunds + amount }
                : b
            ),
          }))
        }, 2000)
      },

      getBeneficiaryByCodeword: (codeword: string) => {
        return get().beneficiaries.find(
          (b) =>
            b.codeword.toLowerCase() === codeword.toLowerCase() && !b.deletedAt
        )
      },

      // Social Worker Actions
      getMyBeneficiaries: (socialWorkerId: string) => {
        return get().beneficiaries.filter(
          (b) => b.socialWorkerId === socialWorkerId && !b.deletedAt
        )
      },

      addBeneficiary: (
        data: Omit<
          Beneficiary,
          | 'id'
          | 'codeword'
          | 'createdAt'
          | 'currentFunds'
          | 'photoUrl'
          | 'deletedAt'
        >
      ) => {
        const newBeneficiary: Beneficiary = {
          ...data,
          id: faker.string.uuid(),
          codeword: `${faker.person.firstName()}${faker.number.int({ min: 10, max: 99 })}`,
          currentFunds: 0,
          photoUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${faker.string.uuid()}`,
          createdAt: new Date(),
        }
        set((state) => ({
          beneficiaries: [...state.beneficiaries, newBeneficiary],
        }))
      },

      updateBeneficiary: (
        id: string,
        data: Partial<
          Pick<
            Beneficiary,
            'name' | 'story' | 'needs' | 'location' | 'targetFunds' | 'verified'
          >
        >
      ) => {
        set((state) => ({
          beneficiaries: state.beneficiaries.map((b) =>
            b.id === id ? { ...b, ...data } : b
          ),
        }))
      },

      removeBeneficiary: (id: string) => {
        set((state) => ({
          beneficiaries: state.beneficiaries.map((b) =>
            b.id === id ? { ...b, deletedAt: new Date() } : b
          ),
        }))
      },
    }),
    {
      name: 'codeheart-mock-data',
    }
  )
)

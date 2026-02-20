import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import SocialWorkerDashboardPage from '../page'
import { useMockDataStore } from '@/lib/stores/mock-data'
import type { Beneficiary, Donation } from '@/lib/stores/mock-data'

// Mock next-intl
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      title: 'Social Worker Dashboard',
      welcome: 'Welcome back',
      activeBeneficiaries: 'Active Beneficiaries',
      totalDonations: 'Total Donations',
      openNeeds: 'Open Needs',
      quickActions: 'Quick Actions',
      addBeneficiary: 'Add Beneficiary',
      viewBeneficiaries: 'View Beneficiaries',
      overview: 'Overview',
      funds: 'Funds',
      needs: 'Needs',
    }
    return translations[key] || key
  },
}))

// Mock i18n routing
vi.mock('@/i18n/routing', () => ({
  Link: ({ href, children, className }: any) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
  useRouter: () => ({
    push: vi.fn(),
  }),
  usePathname: () => '/social-worker',
}))

// Mock Navbar component
vi.mock('@/components/navbar', () => ({
  Navbar: () => <div data-testid="navbar">Navbar</div>,
}))

describe('Social Worker Dashboard Page', () => {
  const mockSocialWorkerId = 'social-worker-123'

  beforeEach(() => {
    // Reset store state before each test
    useMockDataStore.setState({
      beneficiaries: [],
      donations: [],
      users: [],
      currentUser: null,
    })

    vi.clearAllMocks()
  })

  describe('Authentication', () => {
    it('wraps content in AuthGuard with socialWorker role', async () => {
      // Login as social worker
      useMockDataStore.getState().login('sw@example.com', 'socialWorker')

      render(<SocialWorkerDashboardPage />)

      // Wait for loading to complete
      await waitFor(
        () => {
          expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
        },
        { timeout: 200 }
      )

      // Should show dashboard content for social worker
      expect(screen.getByText('Social Worker Dashboard')).toBeInTheDocument()
    })

    it('does not render for non-social workers', async () => {
      // Login as donor (wrong role)
      useMockDataStore.getState().login('donor@example.com', 'donor')

      const { container } = render(<SocialWorkerDashboardPage />)

      // Wait for loading to complete
      await waitFor(
        () => {
          expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
        },
        { timeout: 200 }
      )

      // Should not show dashboard content
      expect(
        screen.queryByText('Social Worker Dashboard')
      ).not.toBeInTheDocument()
      expect(container.querySelector('[data-testid="navbar"]')).toBeNull()
    })
  })

  describe('Layout and Structure', () => {
    beforeEach(async () => {
      useMockDataStore.getState().login('sw@example.com', 'socialWorker')
    })

    it('renders Navbar component', async () => {
      render(<SocialWorkerDashboardPage />)

      await waitFor(
        () => {
          expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
        },
        { timeout: 200 }
      )

      expect(screen.getByTestId('navbar')).toBeInTheDocument()
    })

    it('displays welcome message with user name', async () => {
      const { currentUser } = useMockDataStore.getState()

      render(<SocialWorkerDashboardPage />)

      await waitFor(
        () => {
          expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
        },
        { timeout: 200 }
      )

      expect(
        screen.getByText(`Welcome back, ${currentUser?.name}!`)
      ).toBeInTheDocument()
    })

    it('renders footer', async () => {
      render(<SocialWorkerDashboardPage />)

      await waitFor(
        () => {
          expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
        },
        { timeout: 200 }
      )

      expect(
        screen.getByText(/© 2024 CodeHeart. Made with ❤️ for those in need./)
      ).toBeInTheDocument()
    })
  })

  describe('Statistics Cards', () => {
    beforeEach(() => {
      useMockDataStore.getState().login('sw@example.com', 'socialWorker')
      const store = useMockDataStore.getState()
      const currentUser = store.currentUser!

      // Override currentUser ID to match mock data
      useMockDataStore.setState({
        currentUser: { ...currentUser, id: mockSocialWorkerId },
      })
    })

    it('displays zero stats when no beneficiaries exist', async () => {
      render(<SocialWorkerDashboardPage />)

      await waitFor(
        () => {
          expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
        },
        { timeout: 200 }
      )

      // All stats should show 0
      const statValues = screen.getAllByText('0')
      expect(statValues.length).toBeGreaterThanOrEqual(2) // At least active beneficiaries and open needs
    })

    it('displays correct active beneficiaries count', async () => {
      // Add beneficiaries for this social worker
      const beneficiaries: Beneficiary[] = [
        {
          id: '1',
          name: 'John',
          codeword: 'John123',
          story: 'Story 1',
          needs: ['Food', 'Shelter'],
          location: 'Berlin',
          verified: true,
          socialWorkerId: mockSocialWorkerId,
          photoUrl: 'https://example.com/photo.jpg',
          currentFunds: 100,
          targetFunds: 500,
          createdAt: new Date(),
        },
        {
          id: '2',
          name: 'Jane',
          codeword: 'Jane456',
          story: 'Story 2',
          needs: ['Clothing'],
          location: 'Hamburg',
          verified: false,
          socialWorkerId: mockSocialWorkerId,
          photoUrl: 'https://example.com/photo.jpg',
          currentFunds: 0,
          targetFunds: 1000,
          createdAt: new Date(),
        },
        {
          id: '3',
          name: 'Other',
          codeword: 'Other789',
          story: 'Story 3',
          needs: ['Food'],
          location: 'München',
          verified: true,
          socialWorkerId: 'different-social-worker',
          photoUrl: 'https://example.com/photo.jpg',
          currentFunds: 200,
          targetFunds: 800,
          createdAt: new Date(),
        },
      ]

      useMockDataStore.setState({ beneficiaries })

      render(<SocialWorkerDashboardPage />)

      await waitFor(
        () => {
          expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
        },
        { timeout: 200 }
      )

      // Should show 2 (only beneficiaries with matching socialWorkerId)
      expect(screen.getByText('Active Beneficiaries')).toBeInTheDocument()
      expect(screen.getByText('2')).toBeInTheDocument()
    })

    it('displays correct total donations amount', async () => {
      const beneficiaries: Beneficiary[] = [
        {
          id: 'b1',
          name: 'John',
          codeword: 'John123',
          story: 'Story 1',
          needs: ['Food'],
          location: 'Berlin',
          verified: true,
          socialWorkerId: mockSocialWorkerId,
          photoUrl: 'https://example.com/photo.jpg',
          currentFunds: 300,
          targetFunds: 500,
          createdAt: new Date(),
        },
      ]

      const donations: Donation[] = [
        {
          id: 'd1',
          donorId: 'donor1',
          beneficiaryId: 'b1',
          amount: 100,
          status: 'completed',
          createdAt: new Date(),
        },
        {
          id: 'd2',
          donorId: 'donor2',
          beneficiaryId: 'b1',
          amount: 200,
          status: 'completed',
          createdAt: new Date(),
        },
        {
          id: 'd3',
          donorId: 'donor3',
          beneficiaryId: 'b1',
          amount: 50,
          status: 'pending', // Should not be counted
          createdAt: new Date(),
        },
        {
          id: 'd4',
          donorId: 'donor4',
          beneficiaryId: 'other-beneficiary',
          amount: 500,
          status: 'completed', // Different beneficiary, should not count
          createdAt: new Date(),
        },
      ]

      useMockDataStore.setState({ beneficiaries, donations })

      render(<SocialWorkerDashboardPage />)

      await waitFor(
        () => {
          expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
        },
        { timeout: 200 }
      )

      // Should show €300 (100 + 200, excluding pending and other beneficiaries)
      expect(screen.getByText('Total Donations')).toBeInTheDocument()
      expect(screen.getByText('€300')).toBeInTheDocument()
    })

    it('displays correct open needs count', async () => {
      const beneficiaries: Beneficiary[] = [
        {
          id: 'b1',
          name: 'John',
          codeword: 'John123',
          story: 'Story 1',
          needs: ['Food', 'Shelter', 'Clothing'],
          location: 'Berlin',
          verified: true,
          socialWorkerId: mockSocialWorkerId,
          photoUrl: 'https://example.com/photo.jpg',
          currentFunds: 100,
          targetFunds: 500, // Unmet target
          createdAt: new Date(),
        },
        {
          id: 'b2',
          name: 'Jane',
          codeword: 'Jane456',
          story: 'Story 2',
          needs: ['Food', 'Medical'], // Food overlaps, Medical is new
          location: 'Hamburg',
          verified: false,
          socialWorkerId: mockSocialWorkerId,
          photoUrl: 'https://example.com/photo.jpg',
          currentFunds: 200,
          targetFunds: 1000, // Unmet target
          createdAt: new Date(),
        },
        {
          id: 'b3',
          name: 'Bob',
          codeword: 'Bob789',
          story: 'Story 3',
          needs: ['Housing'],
          location: 'München',
          verified: true,
          socialWorkerId: mockSocialWorkerId,
          photoUrl: 'https://example.com/photo.jpg',
          currentFunds: 500,
          targetFunds: 500, // Met target - should not count
          createdAt: new Date(),
        },
      ]

      useMockDataStore.setState({ beneficiaries })

      render(<SocialWorkerDashboardPage />)

      await waitFor(
        () => {
          expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
        },
        { timeout: 200 }
      )

      // Should show 4 distinct needs from unmet beneficiaries:
      // Food, Shelter, Clothing, Medical (Bob's Housing doesn't count as target is met)
      expect(screen.getByText('Open Needs')).toBeInTheDocument()
      expect(screen.getByText('4')).toBeInTheDocument()
    })

    it('excludes soft-deleted beneficiaries from stats', async () => {
      const beneficiaries: Beneficiary[] = [
        {
          id: 'b1',
          name: 'John',
          codeword: 'John123',
          story: 'Story 1',
          needs: ['Food', 'Shelter'], // 2 needs to make count distinct
          location: 'Berlin',
          verified: true,
          socialWorkerId: mockSocialWorkerId,
          photoUrl: 'https://example.com/photo.jpg',
          currentFunds: 100,
          targetFunds: 500,
          createdAt: new Date(),
        },
        {
          id: 'b2',
          name: 'Deleted',
          codeword: 'Deleted123',
          story: 'Story 2',
          needs: ['Medical'],
          location: 'Hamburg',
          verified: true,
          socialWorkerId: mockSocialWorkerId,
          photoUrl: 'https://example.com/photo.jpg',
          currentFunds: 0,
          targetFunds: 1000,
          createdAt: new Date(),
          deletedAt: new Date(), // Soft deleted
        },
      ]

      useMockDataStore.setState({ beneficiaries })

      render(<SocialWorkerDashboardPage />)

      await waitFor(
        () => {
          expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
        },
        { timeout: 200 }
      )

      // Should show 1 active beneficiary (deleted one excluded)
      expect(screen.getByText('Active Beneficiaries')).toBeInTheDocument()
      // Use getAllByText since '2' appears in both active beneficiaries and open needs
      const numbers = screen.getAllByText('1')
      expect(numbers.length).toBeGreaterThan(0)

      // Verify that the deleted beneficiary's needs are not counted
      // Should show 2 open needs (Food, Shelter from b1), not 3 (would include Medical from b2)
      const openNeedsElements = screen.getAllByText('2')
      expect(openNeedsElements.length).toBeGreaterThan(0)
    })
  })

  describe('Quick Action Buttons', () => {
    beforeEach(async () => {
      useMockDataStore.getState().login('sw@example.com', 'socialWorker')
    })

    it('renders Add Beneficiary button with correct link', async () => {
      render(<SocialWorkerDashboardPage />)

      await waitFor(
        () => {
          expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
        },
        { timeout: 200 }
      )

      const addButton = screen.getByText('Add Beneficiary')
      expect(addButton).toBeInTheDocument()
      expect(addButton.closest('a')).toHaveAttribute(
        'href',
        '/social-worker/beneficiaries/new'
      )
    })

    it('renders View Beneficiaries button with correct link', async () => {
      render(<SocialWorkerDashboardPage />)

      await waitFor(
        () => {
          expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
        },
        { timeout: 200 }
      )

      const viewButton = screen.getByText('View Beneficiaries')
      expect(viewButton).toBeInTheDocument()
      expect(viewButton.closest('a')).toHaveAttribute(
        'href',
        '/social-worker/beneficiaries'
      )
    })

    it('renders Quick Actions card title', async () => {
      render(<SocialWorkerDashboardPage />)

      await waitFor(
        () => {
          expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
        },
        { timeout: 200 }
      )

      expect(screen.getByText('Quick Actions')).toBeInTheDocument()
    })
  })

  describe('Mock Data Generation', () => {
    beforeEach(() => {
      useMockDataStore.getState().login('sw@example.com', 'socialWorker')
    })

    it('calls generateMockData when beneficiaries array is empty', async () => {
      const generateMockDataSpy = vi.spyOn(
        useMockDataStore.getState(),
        'generateMockData'
      )

      // Ensure beneficiaries array is empty
      useMockDataStore.setState({ beneficiaries: [] })

      render(<SocialWorkerDashboardPage />)

      await waitFor(
        () => {
          expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
        },
        { timeout: 200 }
      )

      // Should have called generateMockData
      expect(generateMockDataSpy).toHaveBeenCalled()
    })

    it('does not call generateMockData when beneficiaries exist', async () => {
      // Add some beneficiaries first
      useMockDataStore.setState({
        beneficiaries: [
          {
            id: 'b1',
            name: 'John',
            codeword: 'John123',
            story: 'Story',
            needs: ['Food'],
            location: 'Berlin',
            verified: true,
            socialWorkerId: 'sw-123',
            photoUrl: 'https://example.com/photo.jpg',
            currentFunds: 100,
            targetFunds: 500,
            createdAt: new Date(),
          },
        ],
      })

      const generateMockDataSpy = vi.spyOn(
        useMockDataStore.getState(),
        'generateMockData'
      )

      render(<SocialWorkerDashboardPage />)

      await waitFor(
        () => {
          expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
        },
        { timeout: 200 }
      )

      // Should NOT have called generateMockData
      expect(generateMockDataSpy).not.toHaveBeenCalled()
    })
  })

  describe('Internationalization', () => {
    beforeEach(() => {
      useMockDataStore.getState().login('sw@example.com', 'socialWorker')
    })

    it('uses translations from socialWorker namespace', async () => {
      render(<SocialWorkerDashboardPage />)

      await waitFor(
        () => {
          expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
        },
        { timeout: 200 }
      )

      // Check that translated strings are displayed
      expect(screen.getByText('Social Worker Dashboard')).toBeInTheDocument()
      expect(screen.getByText('Active Beneficiaries')).toBeInTheDocument()
      expect(screen.getByText('Total Donations')).toBeInTheDocument()
      expect(screen.getByText('Open Needs')).toBeInTheDocument()
      expect(screen.getByText('Quick Actions')).toBeInTheDocument()
      expect(screen.getByText('Add Beneficiary')).toBeInTheDocument()
      expect(screen.getByText('View Beneficiaries')).toBeInTheDocument()
    })
  })

  describe('Responsive Design', () => {
    beforeEach(() => {
      useMockDataStore.getState().login('sw@example.com', 'socialWorker')
    })

    it('renders all stat cards', async () => {
      render(<SocialWorkerDashboardPage />)

      await waitFor(
        () => {
          expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
        },
        { timeout: 200 }
      )

      // Should render exactly 3 stat cards
      expect(screen.getByText('Active Beneficiaries')).toBeInTheDocument()
      expect(screen.getByText('Total Donations')).toBeInTheDocument()
      expect(screen.getByText('Open Needs')).toBeInTheDocument()
    })

    it('renders both action buttons', async () => {
      render(<SocialWorkerDashboardPage />)

      await waitFor(
        () => {
          expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
        },
        { timeout: 200 }
      )

      // Should render both buttons
      expect(screen.getByText('Add Beneficiary')).toBeInTheDocument()
      expect(screen.getByText('View Beneficiaries')).toBeInTheDocument()
    })
  })
})

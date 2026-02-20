import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import BeneficiariesListPage from '../page'
import { useMockDataStore } from '@/lib/stores/mock-data'
import type { Beneficiary } from '@/lib/stores/mock-data'

// Mock next-intl
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      beneficiaryList: 'Beneficiary List',
      manageBeneficiaries: 'Manage Beneficiaries',
      addNew: 'Add New Beneficiary',
      search: 'Search',
      filterByLocation: 'Filter by Location',
      filterByStatus: 'Filter by Status',
      filterByNeeds: 'Filter by Needs',
      allLocations: 'All Locations',
      allStatuses: 'All Statuses',
      verified: 'Verified',
      unverified: 'Unverified',
      location: 'Location',
      funds: 'Funds Raised',
      needs: 'Needs',
      edit: 'Edit',
      remove: 'Remove',
      confirmRemove: 'Are you sure you want to remove this beneficiary?',
      noBeneficiaries: 'No beneficiaries found',
      codeword: 'Codeword',
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
  usePathname: () => '/social-worker/beneficiaries',
}))

// Mock Navbar component
vi.mock('@/components/navbar', () => ({
  Navbar: () => <div data-testid="navbar">Navbar</div>,
}))

// Mock window.confirm
const mockConfirm = vi.fn()
global.confirm = mockConfirm

describe('Beneficiaries List Page', () => {
  const mockSocialWorkerId = 'social-worker-123'
  const mockBeneficiaries: Beneficiary[] = [
    {
      id: 'b1',
      name: 'John Doe',
      codeword: 'John123',
      story: 'Story 1',
      needs: ['Lebensmittel', 'Unterkunft'],
      location: 'Berlin',
      verified: true,
      socialWorkerId: mockSocialWorkerId,
      photoUrl: 'https://example.com/photo.jpg',
      currentFunds: 200,
      targetFunds: 500,
      createdAt: new Date(),
    },
    {
      id: 'b2',
      name: 'Jane Smith',
      codeword: 'Jane456',
      story: 'Story 2',
      needs: ['Kleidung', 'Medizinische Versorgung'],
      location: 'Hamburg',
      verified: false,
      socialWorkerId: mockSocialWorkerId,
      photoUrl: 'https://example.com/photo.jpg',
      currentFunds: 0,
      targetFunds: 1000,
      createdAt: new Date(),
    },
    {
      id: 'b3',
      name: 'Bob Wilson',
      codeword: 'Bob789',
      story: 'Story 3',
      needs: ['Lebensmittel', 'Hygieneartikel'],
      location: 'Berlin',
      verified: true,
      socialWorkerId: mockSocialWorkerId,
      photoUrl: 'https://example.com/photo.jpg',
      currentFunds: 300,
      targetFunds: 800,
      createdAt: new Date(),
    },
    {
      id: 'b4',
      name: 'Other Person',
      codeword: 'Other999',
      story: 'Story 4',
      needs: ['Unterkunft'],
      location: 'München',
      verified: true,
      socialWorkerId: 'different-social-worker',
      photoUrl: 'https://example.com/photo.jpg',
      currentFunds: 100,
      targetFunds: 500,
      createdAt: new Date(),
    },
  ]

  beforeEach(() => {
    // Reset store state before each test
    useMockDataStore.setState({
      beneficiaries: [],
      donations: [],
      users: [],
      currentUser: null,
    })

    vi.clearAllMocks()
    mockConfirm.mockReturnValue(true)
  })

  describe('Authentication', () => {
    it('wraps content in AuthGuard with socialWorker role', async () => {
      useMockDataStore.getState().login('sw@example.com', 'socialWorker')

      render(<BeneficiariesListPage />)

      await waitFor(
        () => {
          expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
        },
        { timeout: 200 }
      )

      expect(screen.getByText('Beneficiary List')).toBeInTheDocument()
    })

    it('does not render for non-social workers', async () => {
      useMockDataStore.getState().login('donor@example.com', 'donor')

      const { container } = render(<BeneficiariesListPage />)

      await waitFor(
        () => {
          expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
        },
        { timeout: 200 }
      )

      expect(screen.queryByText('Beneficiary List')).not.toBeInTheDocument()
      expect(container.querySelector('[data-testid="navbar"]')).toBeNull()
    })
  })

  describe('Layout and Structure', () => {
    beforeEach(() => {
      useMockDataStore.getState().login('sw@example.com', 'socialWorker')
      const store = useMockDataStore.getState()
      const currentUser = store.currentUser!

      useMockDataStore.setState({
        currentUser: { ...currentUser, id: mockSocialWorkerId },
      })
    })

    it('renders Navbar component', async () => {
      render(<BeneficiariesListPage />)

      await waitFor(
        () => {
          expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
        },
        { timeout: 200 }
      )

      expect(screen.getByTestId('navbar')).toBeInTheDocument()
    })

    it('displays page title and subtitle', async () => {
      render(<BeneficiariesListPage />)

      await waitFor(
        () => {
          expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
        },
        { timeout: 200 }
      )

      expect(screen.getByText('Beneficiary List')).toBeInTheDocument()
      expect(screen.getByText('Manage Beneficiaries')).toBeInTheDocument()
    })

    it('renders Add New button with correct link', async () => {
      render(<BeneficiariesListPage />)

      await waitFor(
        () => {
          expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
        },
        { timeout: 200 }
      )

      const addButtons = screen.getAllByText('Add New Beneficiary')
      expect(addButtons.length).toBeGreaterThan(0)
      expect(addButtons[0].closest('a')).toHaveAttribute(
        'href',
        '/social-worker/beneficiaries/new'
      )
    })

    it('renders footer', async () => {
      render(<BeneficiariesListPage />)

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

  describe('Filter Controls', () => {
    beforeEach(() => {
      useMockDataStore.getState().login('sw@example.com', 'socialWorker')
      const store = useMockDataStore.getState()
      const currentUser = store.currentUser!

      useMockDataStore.setState({
        currentUser: { ...currentUser, id: mockSocialWorkerId },
        beneficiaries: mockBeneficiaries,
      })
    })

    it('renders search input', async () => {
      render(<BeneficiariesListPage />)

      await waitFor(
        () => {
          expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
        },
        { timeout: 200 }
      )

      const searchInputs = screen.getAllByPlaceholderText('Search')
      expect(searchInputs.length).toBeGreaterThan(0)
    })

    it('renders location filter dropdown', async () => {
      render(<BeneficiariesListPage />)

      await waitFor(
        () => {
          expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
        },
        { timeout: 200 }
      )

      expect(screen.getByText('Filter by Location')).toBeInTheDocument()
      const locationSelect = screen.getByDisplayValue('All Locations')
      expect(locationSelect).toBeInTheDocument()
    })

    it('renders verified status filter dropdown', async () => {
      render(<BeneficiariesListPage />)

      await waitFor(
        () => {
          expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
        },
        { timeout: 200 }
      )

      expect(screen.getByText('Filter by Status')).toBeInTheDocument()
      const statusSelect = screen.getByDisplayValue('All Statuses')
      expect(statusSelect).toBeInTheDocument()
    })

    it('renders needs filter badges', async () => {
      render(<BeneficiariesListPage />)

      await waitFor(
        () => {
          expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
        },
        { timeout: 200 }
      )

      expect(screen.getByText('Filter by Needs')).toBeInTheDocument()
    })
  })

  describe('Beneficiary Display', () => {
    beforeEach(() => {
      useMockDataStore.getState().login('sw@example.com', 'socialWorker')
      const store = useMockDataStore.getState()
      const currentUser = store.currentUser!

      useMockDataStore.setState({
        currentUser: { ...currentUser, id: mockSocialWorkerId },
        beneficiaries: mockBeneficiaries,
      })
    })

    it('displays only social worker own beneficiaries', async () => {
      render(<BeneficiariesListPage />)

      await waitFor(
        () => {
          expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
        },
        { timeout: 200 }
      )

      // Should show 3 beneficiaries (b1, b2, b3) but not b4
      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.getByText('Jane Smith')).toBeInTheDocument()
      expect(screen.getByText('Bob Wilson')).toBeInTheDocument()
      expect(screen.queryByText('Other Person')).not.toBeInTheDocument()
    })

    it('displays beneficiary name and codeword', async () => {
      render(<BeneficiariesListPage />)

      await waitFor(
        () => {
          expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
        },
        { timeout: 200 }
      )

      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.getByText('John123')).toBeInTheDocument()
    })

    it('displays verified status badge correctly', async () => {
      render(<BeneficiariesListPage />)

      await waitFor(
        () => {
          expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
        },
        { timeout: 200 }
      )

      const verifiedBadges = screen.getAllByText('Verified')
      const unverifiedBadges = screen.getAllByText('Unverified')

      // b1 and b3 are verified, b2 is not
      expect(verifiedBadges.length).toBeGreaterThanOrEqual(2)
      expect(unverifiedBadges.length).toBeGreaterThanOrEqual(1)
    })

    it('displays location', async () => {
      render(<BeneficiariesListPage />)

      await waitFor(
        () => {
          expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
        },
        { timeout: 200 }
      )

      // b1 and b3 are in Berlin, b2 is in Hamburg
      const berlinElements = screen.getAllByText('Berlin')
      const hamburgElements = screen.getAllByText('Hamburg')

      expect(berlinElements.length).toBeGreaterThanOrEqual(2)
      expect(hamburgElements.length).toBeGreaterThanOrEqual(1)
    })

    it('displays funds progress', async () => {
      render(<BeneficiariesListPage />)

      await waitFor(
        () => {
          expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
        },
        { timeout: 200 }
      )

      expect(screen.getByText('€200 / €500')).toBeInTheDocument()
      expect(screen.getByText('€0 / €1000')).toBeInTheDocument()
      expect(screen.getByText('€300 / €800')).toBeInTheDocument()
    })

    it('displays needs as badges', async () => {
      render(<BeneficiariesListPage />)

      await waitFor(
        () => {
          expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
        },
        { timeout: 200 }
      )

      // Check for needs from b1
      const lebensmittelBadges = screen.getAllByText('Lebensmittel')
      const unterkunftBadges = screen.getAllByText('Unterkunft')

      expect(lebensmittelBadges.length).toBeGreaterThan(0)
      expect(unterkunftBadges.length).toBeGreaterThan(0)
    })

    it('renders Edit button with correct link', async () => {
      render(<BeneficiariesListPage />)

      await waitFor(
        () => {
          expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
        },
        { timeout: 200 }
      )

      const editButtons = screen.getAllByText('Edit')
      expect(editButtons.length).toBe(3) // One for each beneficiary

      // Check that first edit button has correct href
      const firstEditLink = editButtons[0].closest('a')
      expect(firstEditLink).toHaveAttribute(
        'href',
        expect.stringContaining('/social-worker/beneficiaries/')
      )
    })

    it('renders Remove button for each beneficiary', async () => {
      render(<BeneficiariesListPage />)

      await waitFor(
        () => {
          expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
        },
        { timeout: 200 }
      )

      const removeButtons = screen.getAllByRole('button', { name: '' })
      // Filter for buttons with Trash2 icon
      const trashButtons = removeButtons.filter(
        (btn) => btn.querySelector('svg') !== null
      )
      expect(trashButtons.length).toBeGreaterThanOrEqual(3)
    })
  })

  describe('Search Functionality', () => {
    beforeEach(() => {
      useMockDataStore.getState().login('sw@example.com', 'socialWorker')
      const store = useMockDataStore.getState()
      const currentUser = store.currentUser!

      useMockDataStore.setState({
        currentUser: { ...currentUser, id: mockSocialWorkerId },
        beneficiaries: mockBeneficiaries,
      })
    })

    it('filters beneficiaries by name search', async () => {
      const user = userEvent.setup()
      render(<BeneficiariesListPage />)

      await waitFor(
        () => {
          expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
        },
        { timeout: 200 }
      )

      const searchInputs = screen.getAllByPlaceholderText('Search')
      await user.type(searchInputs[0], 'Jane')

      await waitFor(() => {
        expect(screen.getByText('Jane Smith')).toBeInTheDocument()
        expect(screen.queryByText('John Doe')).not.toBeInTheDocument()
        expect(screen.queryByText('Bob Wilson')).not.toBeInTheDocument()
      })
    })

    it('filters beneficiaries by codeword search', async () => {
      const user = userEvent.setup()
      render(<BeneficiariesListPage />)

      await waitFor(
        () => {
          expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
        },
        { timeout: 200 }
      )

      const searchInputs = screen.getAllByPlaceholderText('Search')
      await user.type(searchInputs[0], 'Bob789')

      await waitFor(() => {
        expect(screen.getByText('Bob Wilson')).toBeInTheDocument()
        expect(screen.queryByText('John Doe')).not.toBeInTheDocument()
        expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument()
      })
    })

    it('search is case insensitive', async () => {
      const user = userEvent.setup()
      render(<BeneficiariesListPage />)

      await waitFor(
        () => {
          expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
        },
        { timeout: 200 }
      )

      const searchInputs = screen.getAllByPlaceholderText('Search')
      await user.type(searchInputs[0], 'JOHN')

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument()
        expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument()
      })
    })

    it('shows all beneficiaries when search is cleared', async () => {
      const user = userEvent.setup()
      render(<BeneficiariesListPage />)

      await waitFor(
        () => {
          expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
        },
        { timeout: 200 }
      )

      const searchInputs = screen.getAllByPlaceholderText('Search')
      await user.type(searchInputs[0], 'Jane')

      await waitFor(() => {
        expect(screen.queryByText('John Doe')).not.toBeInTheDocument()
      })

      await user.clear(searchInputs[0])

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument()
        expect(screen.getByText('Jane Smith')).toBeInTheDocument()
        expect(screen.getByText('Bob Wilson')).toBeInTheDocument()
      })
    })
  })

  describe('Location Filter', () => {
    beforeEach(() => {
      useMockDataStore.getState().login('sw@example.com', 'socialWorker')
      const store = useMockDataStore.getState()
      const currentUser = store.currentUser!

      useMockDataStore.setState({
        currentUser: { ...currentUser, id: mockSocialWorkerId },
        beneficiaries: mockBeneficiaries,
      })
    })

    it('filters beneficiaries by location', async () => {
      const user = userEvent.setup()
      render(<BeneficiariesListPage />)

      await waitFor(
        () => {
          expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
        },
        { timeout: 200 }
      )

      const locationSelect = screen.getByDisplayValue('All Locations')
      await user.selectOptions(locationSelect, 'Hamburg')

      await waitFor(() => {
        expect(screen.getByText('Jane Smith')).toBeInTheDocument()
        expect(screen.queryByText('John Doe')).not.toBeInTheDocument()
        expect(screen.queryByText('Bob Wilson')).not.toBeInTheDocument()
      })
    })

    it('shows all locations in dropdown', async () => {
      render(<BeneficiariesListPage />)

      await waitFor(
        () => {
          expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
        },
        { timeout: 200 }
      )

      const locationSelect = screen.getByDisplayValue('All Locations')
      const options = within(locationSelect as HTMLSelectElement).getAllByRole(
        'option'
      )

      // Should have "All Locations", "Berlin", and "Hamburg"
      expect(options.length).toBe(3)
    })

    it('resets to all locations when All Locations is selected', async () => {
      const user = userEvent.setup()
      render(<BeneficiariesListPage />)

      await waitFor(
        () => {
          expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
        },
        { timeout: 200 }
      )

      const locationSelect = screen.getByDisplayValue('All Locations')
      await user.selectOptions(locationSelect, 'Berlin')

      await waitFor(() => {
        expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument()
      })

      await user.selectOptions(locationSelect, 'all')

      await waitFor(() => {
        expect(screen.getByText('Jane Smith')).toBeInTheDocument()
        expect(screen.getByText('John Doe')).toBeInTheDocument()
        expect(screen.getByText('Bob Wilson')).toBeInTheDocument()
      })
    })
  })

  describe('Verified Status Filter', () => {
    beforeEach(() => {
      useMockDataStore.getState().login('sw@example.com', 'socialWorker')
      const store = useMockDataStore.getState()
      const currentUser = store.currentUser!

      useMockDataStore.setState({
        currentUser: { ...currentUser, id: mockSocialWorkerId },
        beneficiaries: mockBeneficiaries,
      })
    })

    it('filters verified beneficiaries only', async () => {
      const user = userEvent.setup()
      render(<BeneficiariesListPage />)

      await waitFor(
        () => {
          expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
        },
        { timeout: 200 }
      )

      const statusSelect = screen.getByDisplayValue('All Statuses')
      await user.selectOptions(statusSelect, 'verified')

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument()
        expect(screen.getByText('Bob Wilson')).toBeInTheDocument()
        expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument()
      })
    })

    it('filters unverified beneficiaries only', async () => {
      const user = userEvent.setup()
      render(<BeneficiariesListPage />)

      await waitFor(
        () => {
          expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
        },
        { timeout: 200 }
      )

      const statusSelect = screen.getByDisplayValue('All Statuses')
      await user.selectOptions(statusSelect, 'unverified')

      await waitFor(() => {
        expect(screen.getByText('Jane Smith')).toBeInTheDocument()
        expect(screen.queryByText('John Doe')).not.toBeInTheDocument()
        expect(screen.queryByText('Bob Wilson')).not.toBeInTheDocument()
      })
    })

    it('resets to all statuses when All Statuses is selected', async () => {
      const user = userEvent.setup()
      render(<BeneficiariesListPage />)

      await waitFor(
        () => {
          expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
        },
        { timeout: 200 }
      )

      const statusSelect = screen.getByDisplayValue('All Statuses')
      await user.selectOptions(statusSelect, 'verified')

      await waitFor(() => {
        expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument()
      })

      await user.selectOptions(statusSelect, 'all')

      await waitFor(() => {
        expect(screen.getByText('Jane Smith')).toBeInTheDocument()
        expect(screen.getByText('John Doe')).toBeInTheDocument()
        expect(screen.getByText('Bob Wilson')).toBeInTheDocument()
      })
    })
  })

  describe('Needs Filter', () => {
    beforeEach(() => {
      useMockDataStore.getState().login('sw@example.com', 'socialWorker')
      const store = useMockDataStore.getState()
      const currentUser = store.currentUser!

      useMockDataStore.setState({
        currentUser: { ...currentUser, id: mockSocialWorkerId },
        beneficiaries: mockBeneficiaries,
      })
    })

    it('filters by single need', async () => {
      const user = userEvent.setup()
      render(<BeneficiariesListPage />)

      await waitFor(
        () => {
          expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
        },
        { timeout: 200 }
      )

      // Find and click the Kleidung badge in the filter section
      const needsBadges = screen.getAllByText('Kleidung')
      await user.click(needsBadges[0]) // Click the filter badge, not the beneficiary badge

      await waitFor(() => {
        expect(screen.getByText('Jane Smith')).toBeInTheDocument()
        expect(screen.queryByText('John Doe')).not.toBeInTheDocument()
        expect(screen.queryByText('Bob Wilson')).not.toBeInTheDocument()
      })
    })

    it('filters by multiple needs (OR logic)', async () => {
      const user = userEvent.setup()
      render(<BeneficiariesListPage />)

      await waitFor(
        () => {
          expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
        },
        { timeout: 200 }
      )

      // Click Lebensmittel - should show John and Bob
      const lebensmittelBadges = screen.getAllByText('Lebensmittel')
      await user.click(lebensmittelBadges[0])

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument()
        expect(screen.getByText('Bob Wilson')).toBeInTheDocument()
        expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument()
      })
    })

    it('deselects need filter when clicked again', async () => {
      const user = userEvent.setup()
      render(<BeneficiariesListPage />)

      await waitFor(
        () => {
          expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
        },
        { timeout: 200 }
      )

      const kleidungBadges = screen.getAllByText('Kleidung')
      await user.click(kleidungBadges[0])

      await waitFor(() => {
        expect(screen.queryByText('John Doe')).not.toBeInTheDocument()
      })

      // Click again to deselect
      await user.click(kleidungBadges[0])

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument()
        expect(screen.getByText('Jane Smith')).toBeInTheDocument()
        expect(screen.getByText('Bob Wilson')).toBeInTheDocument()
      })
    })
  })

  describe('Combined Filters', () => {
    beforeEach(() => {
      useMockDataStore.getState().login('sw@example.com', 'socialWorker')
      const store = useMockDataStore.getState()
      const currentUser = store.currentUser!

      useMockDataStore.setState({
        currentUser: { ...currentUser, id: mockSocialWorkerId },
        beneficiaries: mockBeneficiaries,
      })
    })

    it('applies search and location filter together', async () => {
      const user = userEvent.setup()
      render(<BeneficiariesListPage />)

      await waitFor(
        () => {
          expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
        },
        { timeout: 200 }
      )

      // Filter by Berlin (should show John and Bob)
      const locationSelect = screen.getByDisplayValue('All Locations')
      await user.selectOptions(locationSelect, 'Berlin')

      await waitFor(() => {
        expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument()
      })

      // Then search for John
      const searchInputs = screen.getAllByPlaceholderText('Search')
      await user.type(searchInputs[0], 'John')

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument()
        expect(screen.queryByText('Bob Wilson')).not.toBeInTheDocument()
      })
    })

    it('applies all filters together', async () => {
      const user = userEvent.setup()
      render(<BeneficiariesListPage />)

      await waitFor(
        () => {
          expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
        },
        { timeout: 200 }
      )

      // Location: Berlin
      const locationSelect = screen.getByDisplayValue('All Locations')
      await user.selectOptions(locationSelect, 'Berlin')

      // Status: Verified
      const statusSelect = screen.getByDisplayValue('All Statuses')
      await user.selectOptions(statusSelect, 'verified')

      // Need: Lebensmittel
      const lebensmittelBadges = screen.getAllByText('Lebensmittel')
      await user.click(lebensmittelBadges[0])

      await waitFor(() => {
        // Should show John and Bob (both in Berlin, verified, have Lebensmittel)
        expect(screen.getByText('John Doe')).toBeInTheDocument()
        expect(screen.getByText('Bob Wilson')).toBeInTheDocument()
        expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument()
      })
    })
  })

  describe('Remove Beneficiary', () => {
    beforeEach(() => {
      useMockDataStore.getState().login('sw@example.com', 'socialWorker')
      const store = useMockDataStore.getState()
      const currentUser = store.currentUser!

      useMockDataStore.setState({
        currentUser: { ...currentUser, id: mockSocialWorkerId },
        beneficiaries: mockBeneficiaries,
      })
    })

    it('shows confirmation dialog when remove button clicked', async () => {
      const user = userEvent.setup()
      render(<BeneficiariesListPage />)

      await waitFor(
        () => {
          expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
        },
        { timeout: 200 }
      )

      // Find remove buttons (buttons with trash icon)
      const removeButtons = screen.getAllByRole('button', { name: '' })
      const trashButtons = removeButtons.filter(
        (btn) => btn.querySelector('svg') !== null
      )

      await user.click(trashButtons[0])

      expect(mockConfirm).toHaveBeenCalledWith(
        'Are you sure you want to remove this beneficiary?'
      )
    })

    it('removes beneficiary when confirmed', async () => {
      const user = userEvent.setup()
      mockConfirm.mockReturnValue(true)

      render(<BeneficiariesListPage />)

      await waitFor(
        () => {
          expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
        },
        { timeout: 200 }
      )

      expect(screen.getByText('John Doe')).toBeInTheDocument()

      const removeButtons = screen.getAllByRole('button', { name: '' })
      const trashButtons = removeButtons.filter(
        (btn) => btn.querySelector('svg') !== null
      )

      await user.click(trashButtons[0])

      await waitFor(() => {
        expect(screen.queryByText('John Doe')).not.toBeInTheDocument()
      })
    })

    it('does not remove beneficiary when cancelled', async () => {
      const user = userEvent.setup()
      mockConfirm.mockReturnValue(false)

      render(<BeneficiariesListPage />)

      await waitFor(
        () => {
          expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
        },
        { timeout: 200 }
      )

      expect(screen.getByText('John Doe')).toBeInTheDocument()

      const removeButtons = screen.getAllByRole('button', { name: '' })
      const trashButtons = removeButtons.filter(
        (btn) => btn.querySelector('svg') !== null
      )

      await user.click(trashButtons[0])

      // Should still be present
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })
  })

  describe('Empty State', () => {
    beforeEach(() => {
      useMockDataStore.getState().login('sw@example.com', 'socialWorker')
      const store = useMockDataStore.getState()
      const currentUser = store.currentUser!

      useMockDataStore.setState({
        currentUser: { ...currentUser, id: mockSocialWorkerId },
        beneficiaries: [],
      })
    })

    it('shows empty state when no beneficiaries exist', async () => {
      render(<BeneficiariesListPage />)

      await waitFor(
        () => {
          expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
        },
        { timeout: 200 }
      )

      expect(screen.getByText('No beneficiaries found')).toBeInTheDocument()
    })

    it('shows empty state when filters return no results', async () => {
      const user = userEvent.setup()

      useMockDataStore.setState({
        beneficiaries: mockBeneficiaries,
      })

      render(<BeneficiariesListPage />)

      await waitFor(
        () => {
          expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
        },
        { timeout: 200 }
      )

      const searchInputs = screen.getAllByPlaceholderText('Search')
      await user.type(searchInputs[0], 'NonExistentName')

      await waitFor(() => {
        const noBeneficiariesText = screen.getAllByText(
          'No beneficiaries found'
        )
        expect(noBeneficiariesText.length).toBeGreaterThan(0)
      })
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

      useMockDataStore.setState({ beneficiaries: [] })

      render(<BeneficiariesListPage />)

      await waitFor(
        () => {
          expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
        },
        { timeout: 200 }
      )

      expect(generateMockDataSpy).toHaveBeenCalled()
    })

    it('does not call generateMockData when beneficiaries exist', async () => {
      useMockDataStore.setState({
        beneficiaries: mockBeneficiaries,
      })

      const generateMockDataSpy = vi.spyOn(
        useMockDataStore.getState(),
        'generateMockData'
      )

      render(<BeneficiariesListPage />)

      await waitFor(
        () => {
          expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
        },
        { timeout: 200 }
      )

      expect(generateMockDataSpy).not.toHaveBeenCalled()
    })
  })

  describe('Internationalization', () => {
    beforeEach(() => {
      useMockDataStore.getState().login('sw@example.com', 'socialWorker')
    })

    it('uses translations from socialWorker namespace', async () => {
      render(<BeneficiariesListPage />)

      await waitFor(
        () => {
          expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
        },
        { timeout: 200 }
      )

      expect(screen.getByText('Beneficiary List')).toBeInTheDocument()
      expect(screen.getByText('Manage Beneficiaries')).toBeInTheDocument()
      expect(screen.getByText('Filter by Location')).toBeInTheDocument()
      expect(screen.getByText('Filter by Status')).toBeInTheDocument()
      expect(screen.getByText('Filter by Needs')).toBeInTheDocument()
    })
  })
})

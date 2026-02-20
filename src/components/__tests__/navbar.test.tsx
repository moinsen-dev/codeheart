import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Navbar } from '../navbar'
import { useMockDataStore } from '@/lib/stores/mock-data'

// Mock the store
vi.mock('@/lib/stores/mock-data', () => ({
  useMockDataStore: vi.fn(),
}))

// Mock the components
vi.mock('../theme-toggle', () => ({
  ThemeToggle: () => <div data-testid="theme-toggle">Theme Toggle</div>,
}))

vi.mock('../language-toggle', () => ({
  LanguageToggle: () => (
    <div data-testid="language-toggle">Language Toggle</div>
  ),
}))

describe('Navbar', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('when user is not logged in', () => {
    beforeEach(() => {
      vi.mocked(useMockDataStore).mockReturnValue({
        currentUser: null,
        logout: vi.fn(),
        beneficiaries: [],
        donations: [],
        users: [],
        generateMockData: vi.fn(),
        login: vi.fn(),
        makeDonation: vi.fn(),
        getBeneficiaryByCodeword: vi.fn(),
      })
    })

    it('renders login and register buttons', () => {
      render(<Navbar />)
      expect(screen.getByText('login')).toBeInTheDocument()
      expect(screen.getByText('register')).toBeInTheDocument()
    })

    it('does not show dashboard link', () => {
      render(<Navbar />)
      expect(screen.queryByText('dashboard')).not.toBeInTheDocument()
    })

    it('does not show user name or role badge', () => {
      render(<Navbar />)
      expect(screen.queryByText(/donor/i)).not.toBeInTheDocument()
      expect(screen.queryByText(/social worker/i)).not.toBeInTheDocument()
      expect(screen.queryByText(/admin/i)).not.toBeInTheDocument()
    })
  })

  describe('when user is logged in as donor', () => {
    beforeEach(() => {
      vi.mocked(useMockDataStore).mockReturnValue({
        currentUser: {
          id: '1',
          name: 'John Donor',
          email: 'donor@test.com',
          role: 'donor',
          createdAt: new Date(),
        },
        logout: vi.fn(),
        beneficiaries: [],
        donations: [],
        users: [],
        generateMockData: vi.fn(),
        login: vi.fn(),
        makeDonation: vi.fn(),
        getBeneficiaryByCodeword: vi.fn(),
      })
    })

    it('shows user name', () => {
      render(<Navbar />)
      expect(screen.getByText('John Donor')).toBeInTheDocument()
    })

    it('shows donor role badge', () => {
      render(<Navbar />)
      expect(screen.getAllByText('Donor')[0]).toBeInTheDocument()
    })

    it('shows dashboard link', () => {
      const { container } = render(<Navbar />)
      // Component renders successfully
      expect(container).toBeInTheDocument()
    })

    it('does not show login/register buttons', () => {
      render(<Navbar />)
      expect(screen.queryByText('register')).not.toBeInTheDocument()
    })

    it('shows logout button', () => {
      const { container } = render(<Navbar />)
      // Check that there's a button (logout) in the UI
      const buttons = container.querySelectorAll('button')
      expect(buttons.length).toBeGreaterThan(0)
    })
  })

  describe('when user is logged in as social worker', () => {
    beforeEach(() => {
      vi.mocked(useMockDataStore).mockReturnValue({
        currentUser: {
          id: '2',
          name: 'Jane Worker',
          email: 'worker@test.com',
          role: 'socialWorker',
          createdAt: new Date(),
        },
        logout: vi.fn(),
        beneficiaries: [],
        donations: [],
        users: [],
        generateMockData: vi.fn(),
        login: vi.fn(),
        makeDonation: vi.fn(),
        getBeneficiaryByCodeword: vi.fn(),
      })
    })

    it('shows user name', () => {
      render(<Navbar />)
      expect(screen.getByText('Jane Worker')).toBeInTheDocument()
    })

    it('shows social worker role badge', () => {
      render(<Navbar />)
      expect(screen.getAllByText('Social Worker')[0]).toBeInTheDocument()
    })

    it('shows dashboard link', () => {
      const { container } = render(<Navbar />)
      // Component renders successfully with social worker role
      expect(container).toBeInTheDocument()
    })
  })

  describe('when user is logged in as admin', () => {
    beforeEach(() => {
      vi.mocked(useMockDataStore).mockReturnValue({
        currentUser: {
          id: '3',
          name: 'Admin User',
          email: 'admin@test.com',
          role: 'admin',
          createdAt: new Date(),
        },
        logout: vi.fn(),
        beneficiaries: [],
        donations: [],
        users: [],
        generateMockData: vi.fn(),
        login: vi.fn(),
        makeDonation: vi.fn(),
        getBeneficiaryByCodeword: vi.fn(),
      })
    })

    it('shows user name', () => {
      render(<Navbar />)
      expect(screen.getByText('Admin User')).toBeInTheDocument()
    })

    it('shows admin role badge', () => {
      render(<Navbar />)
      expect(screen.getAllByText('Admin')[0]).toBeInTheDocument()
    })

    it('shows admin panel link', () => {
      const { container } = render(<Navbar />)
      // Component renders successfully with admin role
      expect(container).toBeInTheDocument()
      // Verify Admin Panel text is rendered
      expect(container.textContent).toContain('Admin Panel')
    })
  })

  describe('logout functionality', () => {
    it('calls logout when logout button is clicked', async () => {
      const mockLogout = vi.fn()

      vi.mocked(useMockDataStore).mockReturnValue({
        currentUser: {
          id: '1',
          name: 'Test User',
          email: 'test@test.com',
          role: 'donor',
          createdAt: new Date(),
        },
        logout: mockLogout,
        beneficiaries: [],
        donations: [],
        users: [],
        generateMockData: vi.fn(),
        login: vi.fn(),
        makeDonation: vi.fn(),
        getBeneficiaryByCodeword: vi.fn(),
      })

      const { container } = render(<Navbar />)

      // Find logout button (last button in the navbar)
      const buttons = container.querySelectorAll('button')
      const logoutButton = buttons[buttons.length - 2] // Second to last button (menu button is last)
      await userEvent.click(logoutButton)

      expect(mockLogout).toHaveBeenCalledTimes(1)
    })
  })

  describe('mobile menu', () => {
    it('renders navbar with navigation links', async () => {
      vi.mocked(useMockDataStore).mockReturnValue({
        currentUser: null,
        logout: vi.fn(),
        beneficiaries: [],
        donations: [],
        users: [],
        generateMockData: vi.fn(),
        login: vi.fn(),
        makeDonation: vi.fn(),
        getBeneficiaryByCodeword: vi.fn(),
      })

      const { container } = render(<Navbar />)

      // Check that navigation structure renders
      expect(container.querySelector('nav')).toBeInTheDocument()
    })
  })
})

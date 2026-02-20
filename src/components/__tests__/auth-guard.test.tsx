import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { AuthGuard } from '../auth-guard'
import { useMockDataStore } from '@/lib/stores/mock-data'

// Mock the i18n routing module
vi.mock('@/i18n/routing', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
  usePathname: () => '/dashboard',
}))

describe('AuthGuard Component', () => {
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

  describe('Loading State', () => {
    it('shows loading spinner during hydration', () => {
      render(
        <AuthGuard allowedRoles={['donor']}>
          <div>Protected Content</div>
        </AuthGuard>
      )

      // Should show loading state
      expect(screen.getByText('Loading...')).toBeInTheDocument()
      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
    })
  })

  describe('Unauthenticated User', () => {
    it('does not render children when no user is logged in', async () => {
      const { container } = render(
        <AuthGuard allowedRoles={['donor']}>
          <div>Protected Content</div>
        </AuthGuard>
      )

      // Wait for loading to complete
      await waitFor(
        () => {
          expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
        },
        { timeout: 200 }
      )

      // Should not show protected content
      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
      expect(container.textContent).toBe('')
    })
  })

  describe('Authenticated User with Correct Role', () => {
    it('renders children for donor with donor role', async () => {
      // Login as donor
      useMockDataStore.getState().login('donor@example.com', 'donor')

      render(
        <AuthGuard allowedRoles={['donor']}>
          <div>Donor Dashboard Content</div>
        </AuthGuard>
      )

      // Wait for loading to complete
      await waitFor(
        () => {
          expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
        },
        { timeout: 200 }
      )

      // Should show protected content
      expect(screen.getByText('Donor Dashboard Content')).toBeInTheDocument()
    })

    it('renders children for social worker with socialWorker role', async () => {
      // Login as social worker
      useMockDataStore
        .getState()
        .login('socialworker@example.com', 'socialWorker')

      render(
        <AuthGuard allowedRoles={['socialWorker']}>
          <div>Social Worker Dashboard Content</div>
        </AuthGuard>
      )

      // Wait for loading to complete
      await waitFor(
        () => {
          expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
        },
        { timeout: 200 }
      )

      // Should show protected content
      expect(
        screen.getByText('Social Worker Dashboard Content')
      ).toBeInTheDocument()
    })

    it('renders children for admin with admin role', async () => {
      // Login as admin
      useMockDataStore.getState().login('admin@example.com', 'admin')

      render(
        <AuthGuard allowedRoles={['admin']}>
          <div>Admin Dashboard Content</div>
        </AuthGuard>
      )

      // Wait for loading to complete
      await waitFor(
        () => {
          expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
        },
        { timeout: 200 }
      )

      // Should show protected content
      expect(screen.getByText('Admin Dashboard Content')).toBeInTheDocument()
    })

    it('renders children for investor with investor role', async () => {
      // Login as investor
      useMockDataStore.getState().login('investor@example.com', 'investor')

      render(
        <AuthGuard allowedRoles={['investor']}>
          <div>Investor Content</div>
        </AuthGuard>
      )

      // Wait for loading to complete
      await waitFor(
        () => {
          expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
        },
        { timeout: 200 }
      )

      // Should show protected content
      expect(screen.getByText('Investor Content')).toBeInTheDocument()
    })
  })

  describe('Authenticated User with Multiple Allowed Roles', () => {
    it('renders children when user role is in allowed roles array', async () => {
      // Login as social worker
      useMockDataStore
        .getState()
        .login('socialworker@example.com', 'socialWorker')

      render(
        <AuthGuard allowedRoles={['donor', 'socialWorker', 'admin']}>
          <div>Multi-Role Content</div>
        </AuthGuard>
      )

      // Wait for loading to complete
      await waitFor(
        () => {
          expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
        },
        { timeout: 200 }
      )

      // Should show protected content
      expect(screen.getByText('Multi-Role Content')).toBeInTheDocument()
    })
  })

  describe('Authenticated User with Wrong Role', () => {
    it('does not render children when donor tries to access admin page', async () => {
      // Login as donor
      useMockDataStore.getState().login('donor@example.com', 'donor')

      const { container } = render(
        <AuthGuard allowedRoles={['admin']}>
          <div>Admin Only Content</div>
        </AuthGuard>
      )

      // Wait for loading to complete
      await waitFor(
        () => {
          expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
        },
        { timeout: 200 }
      )

      // Should not show protected content
      expect(screen.queryByText('Admin Only Content')).not.toBeInTheDocument()
      expect(container.textContent).toBe('')
    })

    it('does not render children when social worker tries to access donor page', async () => {
      // Login as social worker
      useMockDataStore
        .getState()
        .login('socialworker@example.com', 'socialWorker')

      const { container } = render(
        <AuthGuard allowedRoles={['donor']}>
          <div>Donor Only Content</div>
        </AuthGuard>
      )

      // Wait for loading to complete
      await waitFor(
        () => {
          expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
        },
        { timeout: 200 }
      )

      // Should not show protected content
      expect(screen.queryByText('Donor Only Content')).not.toBeInTheDocument()
      expect(container.textContent).toBe('')
    })

    it('does not render children when admin tries to access social worker page', async () => {
      // Login as admin
      useMockDataStore.getState().login('admin@example.com', 'admin')

      const { container } = render(
        <AuthGuard allowedRoles={['socialWorker']}>
          <div>Social Worker Only Content</div>
        </AuthGuard>
      )

      // Wait for loading to complete
      await waitFor(
        () => {
          expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
        },
        { timeout: 200 }
      )

      // Should not show protected content
      expect(
        screen.queryByText('Social Worker Only Content')
      ).not.toBeInTheDocument()
      expect(container.textContent).toBe('')
    })
  })

  describe('Router Navigation', () => {
    it('should use router from @/i18n/routing', async () => {
      const { useRouter } = await import('@/i18n/routing')
      const mockRouter = useRouter()

      // Login as donor trying to access admin page
      useMockDataStore.getState().login('donor@example.com', 'donor')

      render(
        <AuthGuard allowedRoles={['admin']}>
          <div>Admin Content</div>
        </AuthGuard>
      )

      // Wait for loading and redirect logic
      await waitFor(
        () => {
          expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
        },
        { timeout: 200 }
      )

      // The mock router's push should have been called
      expect(mockRouter.push).toBeDefined()
    })
  })

  describe('Edge Cases', () => {
    it('handles empty allowedRoles array', async () => {
      // Login as donor
      useMockDataStore.getState().login('donor@example.com', 'donor')

      const { container } = render(
        <AuthGuard allowedRoles={[]}>
          <div>No Roles Allowed</div>
        </AuthGuard>
      )

      // Wait for loading to complete
      await waitFor(
        () => {
          expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
        },
        { timeout: 200 }
      )

      // Should not show content since no roles are allowed
      expect(screen.queryByText('No Roles Allowed')).not.toBeInTheDocument()
      expect(container.textContent).toBe('')
    })

    it('renders complex children components', async () => {
      // Login as donor
      useMockDataStore.getState().login('donor@example.com', 'donor')

      render(
        <AuthGuard allowedRoles={['donor']}>
          <div>
            <h1>Dashboard</h1>
            <p>Welcome back!</p>
            <button>Click me</button>
          </div>
        </AuthGuard>
      )

      // Wait for loading to complete
      await waitFor(
        () => {
          expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
        },
        { timeout: 200 }
      )

      // Should show all children
      expect(screen.getByText('Dashboard')).toBeInTheDocument()
      expect(screen.getByText('Welcome back!')).toBeInTheDocument()
      expect(
        screen.getByRole('button', { name: 'Click me' })
      ).toBeInTheDocument()
    })
  })
})

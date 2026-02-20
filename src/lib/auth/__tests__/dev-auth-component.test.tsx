import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { DevModeBanner } from '../dev-auth'
import { useMockDataStore } from '@/lib/stores/mock-data'

describe('DevModeBanner Component', () => {
  const originalEnv = process.env.NEXT_PUBLIC_DEV_AUTH

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

  afterEach(() => {
    process.env.NEXT_PUBLIC_DEV_AUTH = originalEnv
  })

  describe('when dev auth is disabled', () => {
    beforeEach(() => {
      process.env.NEXT_PUBLIC_DEV_AUTH = 'false'
    })

    it('renders nothing', () => {
      const { container } = render(<DevModeBanner />)
      expect(container.firstChild).toBeNull()
    })
  })

  describe('when dev auth is enabled', () => {
    beforeEach(() => {
      process.env.NEXT_PUBLIC_DEV_AUTH = 'true'
    })

    it('renders the dev mode banner', () => {
      render(<DevModeBanner />)
      expect(screen.getByText('Dev Mode Active')).toBeInTheDocument()
    })

    it('applies correct styling classes', () => {
      const { container } = render(<DevModeBanner />)
      const banner = container.firstChild
      expect(banner).toHaveClass('fixed', 'top-0', 'z-50')
      expect(banner).toHaveClass(
        'bg-gradient-to-r',
        'from-yellow-400',
        'to-orange-400'
      )
    })

    describe('when no user is logged in', () => {
      it('displays login buttons', () => {
        render(<DevModeBanner />)
        expect(
          screen.getByRole('button', { name: /login as donor/i })
        ).toBeInTheDocument()
        expect(
          screen.getByRole('button', { name: /login as social worker/i })
        ).toBeInTheDocument()
        expect(
          screen.getByRole('button', { name: /login as admin/i })
        ).toBeInTheDocument()
      })

      it('logs in as donor when donor button is clicked', async () => {
        const user = userEvent.setup()
        render(<DevModeBanner />)

        await user.click(
          screen.getByRole('button', { name: /login as donor/i })
        )

        const currentUser = useMockDataStore.getState().currentUser
        expect(currentUser).not.toBeNull()
        expect(currentUser?.email).toBe('dev-donor@codeheart.dev')
        expect(currentUser?.role).toBe('donor')
      })

      it('logs in as social worker when social worker button is clicked', async () => {
        const user = userEvent.setup()
        render(<DevModeBanner />)

        await user.click(
          screen.getByRole('button', { name: /login as social worker/i })
        )

        const currentUser = useMockDataStore.getState().currentUser
        expect(currentUser).not.toBeNull()
        expect(currentUser?.email).toBe('dev-socialworker@codeheart.dev')
        expect(currentUser?.role).toBe('socialWorker')
      })

      it('logs in as admin when admin button is clicked', async () => {
        const user = userEvent.setup()
        render(<DevModeBanner />)

        await user.click(
          screen.getByRole('button', { name: /login as admin/i })
        )

        const currentUser = useMockDataStore.getState().currentUser
        expect(currentUser).not.toBeNull()
        expect(currentUser?.email).toBe('dev-admin@codeheart.dev')
        expect(currentUser?.role).toBe('admin')
      })
    })

    describe('when a user is logged in', () => {
      beforeEach(() => {
        useMockDataStore.getState().login('test@example.com', 'donor')
      })

      it('displays current user information', () => {
        render(<DevModeBanner />)
        expect(screen.getByText(/logged in as:/i)).toBeInTheDocument()
        expect(screen.getByText(/donor/i)).toBeInTheDocument()
      })

      it('displays logout button', () => {
        render(<DevModeBanner />)
        expect(
          screen.getByRole('button', { name: /logout/i })
        ).toBeInTheDocument()
      })

      it('does not display login buttons', () => {
        render(<DevModeBanner />)
        expect(
          screen.queryByRole('button', { name: /login as donor/i })
        ).not.toBeInTheDocument()
        expect(
          screen.queryByRole('button', { name: /login as social worker/i })
        ).not.toBeInTheDocument()
        expect(
          screen.queryByRole('button', { name: /login as admin/i })
        ).not.toBeInTheDocument()
      })

      it('logs out when logout button is clicked', async () => {
        const user = userEvent.setup()
        render(<DevModeBanner />)

        expect(useMockDataStore.getState().currentUser).not.toBeNull()

        await user.click(screen.getByRole('button', { name: /logout/i }))

        expect(useMockDataStore.getState().currentUser).toBeNull()
      })
    })

    describe('visual elements', () => {
      it('displays warning icon', () => {
        render(<DevModeBanner />)
        const icon = screen.getByText('!')
        expect(icon).toBeInTheDocument()
        expect(icon.closest('span')).toHaveClass(
          'bg-black',
          'text-yellow-400',
          'rounded-full'
        )
      })

      it('uses correct button styling', () => {
        render(<DevModeBanner />)
        const button = screen.getByRole('button', { name: /login as donor/i })
        expect(button).toHaveClass('bg-black', 'text-yellow-400', 'rounded')
      })
    })
  })
})

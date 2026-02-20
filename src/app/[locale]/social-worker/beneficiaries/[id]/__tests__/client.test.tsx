import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import BeneficiaryFormClient from '../client'

// Mock dependencies
const mockUseParams = vi.fn()
const mockPush = vi.fn()

vi.mock('next/navigation', () => ({
  useParams: () => mockUseParams(),
}))

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}))

const mockUseMockDataStore = vi.fn()

vi.mock('@/lib/stores/mock-data', () => ({
  useMockDataStore: () => mockUseMockDataStore(),
}))

vi.mock('@/components/navbar', () => ({
  Navbar: () => <div data-testid="navbar">Navbar</div>,
}))

vi.mock('@/components/auth-guard', () => ({
  AuthGuard: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

vi.mock('@/i18n/routing', () => ({
  Link: ({
    children,
    href,
    className,
  }: {
    children: React.ReactNode
    href: string
    className?: string
  }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
  useRouter: () => ({
    push: mockPush,
  }),
}))

describe('BeneficiaryFormClient', () => {
  const mockAddBeneficiary = vi.fn()
  const mockUpdateBeneficiary = vi.fn()

  const mockCurrentUser = {
    id: 'user123',
    email: 'socialworker@test.com',
    role: 'socialWorker' as const,
    name: 'Test Social Worker',
    createdAt: new Date(),
  }

  const mockBeneficiary = {
    id: 'ben123',
    name: 'Test Beneficiary',
    story: 'Test story about the beneficiary',
    needs: ['Lebensmittel', 'Unterkunft'],
    location: 'Hamburg',
    targetFunds: 1000,
    currentFunds: 0,
    verified: false,
    socialWorkerId: 'user123',
    codeword: 'TestCode123',
    photoUrl: 'https://example.com/photo.jpg',
    createdAt: new Date(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockPush.mockClear()

    mockUseMockDataStore.mockReturnValue({
      currentUser: mockCurrentUser,
      beneficiaries: [mockBeneficiary],
      addBeneficiary: mockAddBeneficiary,
      updateBeneficiary: mockUpdateBeneficiary,
    })
  })

  describe('New Beneficiary Form', () => {
    beforeEach(() => {
      mockUseParams.mockReturnValue({ id: 'new' })
    })

    it('renders empty form for new beneficiary', () => {
      render(<BeneficiaryFormClient />)

      expect(screen.getByLabelText(/name/i)).toHaveValue('')
      expect(screen.getByLabelText(/story/i)).toHaveValue('')
      expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument()
      expect(
        screen.getByRole('button', { name: /cancel/i })
      ).toBeInTheDocument()
    })

    it('displays all 5 form fields with proper labels', () => {
      render(<BeneficiaryFormClient />)

      // Check all required fields
      expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/story/i)).toBeInTheDocument()
      expect(screen.getAllByText(/needs/i).length).toBeGreaterThan(0)
      expect(screen.getByLabelText(/location/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/targetAmount/i)).toBeInTheDocument()
    })

    it('shows validation errors for empty required fields', async () => {
      render(<BeneficiaryFormClient />)

      const saveButton = screen.getByRole('button', { name: /save/i })
      fireEvent.click(saveButton)

      await waitFor(() => {
        expect(screen.getByText('nameRequired')).toBeInTheDocument()
        expect(screen.getByText('storyRequired')).toBeInTheDocument()
        expect(screen.getByText('needsRequired')).toBeInTheDocument()
        expect(screen.getByText('locationRequired')).toBeInTheDocument()
      })
    })

    it('allows selecting multiple needs', () => {
      render(<BeneficiaryFormClient />)

      const foodBadge = screen.getByText('foodSupplies')
      const shelterBadge = screen.getByText('shelter')

      fireEvent.click(foodBadge)
      fireEvent.click(shelterBadge)

      // Badges should have 'default' variant when selected
      expect(foodBadge.closest('[class*="cursor-pointer"]')).toBeInTheDocument()
      expect(
        shelterBadge.closest('[class*="cursor-pointer"]')
      ).toBeInTheDocument()
    })

    it('submits form with correct data via addBeneficiary', async () => {
      const newBeneficiary = {
        ...mockBeneficiary,
        id: 'new123',
        codeword: 'NewCode456',
      }
      mockAddBeneficiary.mockReturnValue(newBeneficiary)

      render(<BeneficiaryFormClient />)

      // Fill form
      fireEvent.change(screen.getByLabelText(/name/i), {
        target: { value: 'New Beneficiary' },
      })
      fireEvent.change(screen.getByLabelText(/story/i), {
        target: { value: 'A compelling story' },
      })
      fireEvent.click(screen.getByText('foodSupplies'))
      fireEvent.change(screen.getByLabelText(/location/i), {
        target: { value: 'Berlin' },
      })
      fireEvent.change(screen.getByLabelText(/targetAmount/i), {
        target: { value: '500' },
      })

      // Submit
      fireEvent.click(screen.getByRole('button', { name: /save/i }))

      await waitFor(() => {
        expect(mockAddBeneficiary).toHaveBeenCalledWith({
          name: 'New Beneficiary',
          story: 'A compelling story',
          needs: ['Lebensmittel'],
          location: 'Berlin',
          targetFunds: 500,
          socialWorkerId: mockCurrentUser.id,
          verified: false,
        })
      })
    })

    it('displays auto-generated codeword after successful add', async () => {
      const newBeneficiary = {
        ...mockBeneficiary,
        codeword: 'AutoGen789',
      }
      mockAddBeneficiary.mockReturnValue(newBeneficiary)

      render(<BeneficiaryFormClient />)

      // Fill and submit form
      fireEvent.change(screen.getByLabelText(/name/i), {
        target: { value: 'Test' },
      })
      fireEvent.change(screen.getByLabelText(/story/i), {
        target: { value: 'Story' },
      })
      fireEvent.click(screen.getByText('foodSupplies'))
      fireEvent.change(screen.getByLabelText(/location/i), {
        target: { value: 'Hamburg' },
      })
      fireEvent.change(screen.getByLabelText(/targetAmount/i), {
        target: { value: '100' },
      })
      fireEvent.click(screen.getByRole('button', { name: /save/i }))

      await waitFor(() => {
        expect(screen.getByText('AutoGen789')).toBeInTheDocument()
        expect(screen.getByText('beneficiaryAdded')).toBeInTheDocument()
      })
    })

    it('navigates back to list on cancel', () => {
      render(<BeneficiaryFormClient />)

      const cancelButton = screen.getByRole('button', { name: /cancel/i })
      fireEvent.click(cancelButton)

      expect(mockPush).toHaveBeenCalledWith('/social-worker/beneficiaries')
    })

    it('validates that target amount is required', async () => {
      render(<BeneficiaryFormClient />)

      // Fill all fields except target amount
      fireEvent.change(screen.getByLabelText(/name/i), {
        target: { value: 'Test Name' },
      })
      fireEvent.change(screen.getByLabelText(/story/i), {
        target: { value: 'Test Story' },
      })
      fireEvent.click(screen.getByText('foodSupplies'))
      fireEvent.change(screen.getByLabelText(/location/i), {
        target: { value: 'Berlin' },
      })

      // Leave target amount empty and submit
      const saveButton = screen.getByRole('button', { name: /save/i })
      fireEvent.click(saveButton)

      // Should show validation error for empty target
      await waitFor(() => {
        expect(screen.getByText('targetMinimum')).toBeInTheDocument()
      })

      // Form should NOT have been submitted
      expect(mockAddBeneficiary).not.toHaveBeenCalled()
    })
  })

  describe('Edit Beneficiary Form', () => {
    beforeEach(() => {
      mockUseParams.mockReturnValue({ id: 'ben123' })
    })

    it('loads and pre-populates form with existing beneficiary data', async () => {
      render(<BeneficiaryFormClient />)

      await waitFor(() => {
        expect(screen.getByLabelText(/name/i)).toHaveValue('Test Beneficiary')
        expect(screen.getByLabelText(/story/i)).toHaveValue(
          'Test story about the beneficiary'
        )
        expect(screen.getByLabelText(/location/i)).toHaveValue('Hamburg')
        expect(screen.getByLabelText(/targetAmount/i)).toHaveValue(1000)
      })
    })

    it('submits updates via updateBeneficiary', async () => {
      render(<BeneficiaryFormClient />)

      await waitFor(() => {
        expect(screen.getByLabelText(/name/i)).toHaveValue('Test Beneficiary')
      })

      // Update name
      fireEvent.change(screen.getByLabelText(/name/i), {
        target: { value: 'Updated Name' },
      })

      // Submit
      fireEvent.click(screen.getByRole('button', { name: /save/i }))

      await waitFor(() => {
        expect(mockUpdateBeneficiary).toHaveBeenCalledWith('ben123', {
          name: 'Updated Name',
          story: 'Test story about the beneficiary',
          needs: ['Lebensmittel', 'Unterkunft'],
          location: 'Hamburg',
          targetFunds: 1000,
        })
      })
    })

    it('navigates back to list after successful update', async () => {
      render(<BeneficiaryFormClient />)

      await waitFor(() => {
        expect(screen.getByLabelText(/name/i)).toHaveValue('Test Beneficiary')
      })

      fireEvent.click(screen.getByRole('button', { name: /save/i }))

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/social-worker/beneficiaries')
      })
    })
  })

  describe('Form Validation', () => {
    beforeEach(() => {
      mockUseParams.mockReturnValue({ id: 'new' })
    })

    it('shows all validation errors when submitting empty form', async () => {
      render(<BeneficiaryFormClient />)

      // Trigger validation by submitting empty form
      fireEvent.click(screen.getByRole('button', { name: /save/i }))

      await waitFor(() => {
        expect(screen.getByText('nameRequired')).toBeInTheDocument()
        expect(screen.getByText('storyRequired')).toBeInTheDocument()
        expect(screen.getByText('needsRequired')).toBeInTheDocument()
        expect(screen.getByText('locationRequired')).toBeInTheDocument()
      })
    })

    it('requires at least one need to be selected', async () => {
      render(<BeneficiaryFormClient />)

      // Fill all fields except needs
      fireEvent.change(screen.getByLabelText(/name/i), {
        target: { value: 'Test' },
      })
      fireEvent.change(screen.getByLabelText(/story/i), {
        target: { value: 'Story' },
      })
      fireEvent.change(screen.getByLabelText(/location/i), {
        target: { value: 'Hamburg' },
      })
      fireEvent.change(screen.getByLabelText(/targetAmount/i), {
        target: { value: '100' },
      })

      // Submit without selecting needs
      fireEvent.click(screen.getByRole('button', { name: /save/i }))

      await waitFor(() => {
        expect(screen.getByText('needsRequired')).toBeInTheDocument()
      })
    })
  })

  describe('Accessibility', () => {
    beforeEach(() => {
      mockUseParams.mockReturnValue({ id: 'new' })
    })

    it('has proper labels for all form inputs', () => {
      render(<BeneficiaryFormClient />)

      expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/story/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/location/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/targetAmount/i)).toBeInTheDocument()
    })

    it('shows required field indicators', () => {
      render(<BeneficiaryFormClient />)

      const requiredIndicators = screen.getAllByText('*')
      expect(requiredIndicators.length).toBeGreaterThan(0)
    })
  })
})

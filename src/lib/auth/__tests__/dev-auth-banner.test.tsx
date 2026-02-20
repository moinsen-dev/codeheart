import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { DevModeBanner } from '../dev-auth'

describe('DevModeBanner', () => {
  const originalEnv = process.env.NEXT_PUBLIC_DEV_AUTH

  afterEach(() => {
    process.env.NEXT_PUBLIC_DEV_AUTH = originalEnv
  })

  describe('when dev auth is enabled', () => {
    beforeEach(() => {
      process.env.NEXT_PUBLIC_DEV_AUTH = 'true'
    })

    it('renders the banner', () => {
      render(<DevModeBanner />)
      expect(screen.getByText('Dev Mode Active')).toBeInTheDocument()
    })

    it('has warning icon', () => {
      render(<DevModeBanner />)
      const warningIcon = screen.getByText('!')
      expect(warningIcon).toBeInTheDocument()
    })

    it('has correct styling classes', () => {
      const { container } = render(<DevModeBanner />)
      const banner = container.firstChild as HTMLElement
      expect(banner).toHaveClass('fixed', 'top-0', 'left-0', 'right-0')
      expect(banner).toHaveClass(
        'bg-gradient-to-r',
        'from-yellow-400',
        'to-orange-400'
      )
      expect(banner).toHaveClass('z-50')
    })

    it('is positioned at the top of the screen', () => {
      const { container } = render(<DevModeBanner />)
      const banner = container.firstChild as HTMLElement
      expect(banner).toHaveClass('fixed', 'top-0')
    })

    it('has high z-index for visibility', () => {
      const { container } = render(<DevModeBanner />)
      const banner = container.firstChild as HTMLElement
      expect(banner).toHaveClass('z-50')
    })
  })

  describe('when dev auth is disabled', () => {
    beforeEach(() => {
      process.env.NEXT_PUBLIC_DEV_AUTH = 'false'
    })

    it('does not render the banner', () => {
      const { container } = render(<DevModeBanner />)
      expect(container.firstChild).toBeNull()
    })

    it('does not render "Dev Mode Active" text', () => {
      render(<DevModeBanner />)
      expect(screen.queryByText('Dev Mode Active')).not.toBeInTheDocument()
    })
  })

  describe('when NEXT_PUBLIC_DEV_AUTH is undefined', () => {
    beforeEach(() => {
      process.env.NEXT_PUBLIC_DEV_AUTH = undefined
    })

    it('does not render the banner', () => {
      const { container } = render(<DevModeBanner />)
      expect(container.firstChild).toBeNull()
    })
  })

  describe('banner visibility', () => {
    it('renders null when dev auth is any value other than "true"', () => {
      const testValues = ['false', 'yes', '1', 'TRUE', 'True', '']

      testValues.forEach((value) => {
        process.env.NEXT_PUBLIC_DEV_AUTH = value
        const { container } = render(<DevModeBanner />)
        expect(container.firstChild).toBeNull()
      })
    })

    it('only renders when exactly "true"', () => {
      process.env.NEXT_PUBLIC_DEV_AUTH = 'true'
      const { container } = render(<DevModeBanner />)
      expect(container.firstChild).not.toBeNull()
    })
  })
})

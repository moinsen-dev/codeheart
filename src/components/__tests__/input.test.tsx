import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Input } from '../ui/input'

describe('Input', () => {
  it('renders with placeholder', () => {
    render(<Input placeholder="Enter your email" />)
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument()
  })

  it('handles value changes', async () => {
    const handleChange = vi.fn()
    render(<Input onChange={handleChange} />)

    await userEvent.type(screen.getByRole('textbox'), 'test')
    expect(handleChange).toHaveBeenCalled()
  })

  it('applies type correctly', () => {
    render(<Input type="email" placeholder="Email" />)
    expect(screen.getByPlaceholderText('Email')).toHaveAttribute(
      'type',
      'email'
    )
  })

  it('is disabled when disabled prop is true', () => {
    render(<Input disabled placeholder="Disabled" />)
    expect(screen.getByPlaceholderText('Disabled')).toBeDisabled()
  })

  it('applies custom className', () => {
    render(<Input className="custom-class" placeholder="Test" />)
    expect(screen.getByPlaceholderText('Test')).toHaveClass('custom-class')
  })

  it('forwards ref correctly', () => {
    const ref = { current: null as HTMLInputElement | null }
    render(<Input ref={ref} placeholder="Ref test" />)
    expect(ref.current).toBeInstanceOf(HTMLInputElement)
  })
})

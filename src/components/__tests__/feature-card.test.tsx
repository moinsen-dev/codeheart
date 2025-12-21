import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Heart } from 'lucide-react'
import { FeatureCard } from '../feature-card'

describe('FeatureCard', () => {
  it('renders title correctly', () => {
    render(
      <FeatureCard
        icon={<Heart data-testid="icon" />}
        title="Test Title"
        description="Test description"
      />
    )
    expect(screen.getByText('Test Title')).toBeInTheDocument()
  })

  it('renders description correctly', () => {
    render(
      <FeatureCard
        icon={<Heart data-testid="icon" />}
        title="Test Title"
        description="Test description text here"
      />
    )
    expect(screen.getByText('Test description text here')).toBeInTheDocument()
  })

  it('renders icon', () => {
    render(
      <FeatureCard
        icon={<Heart data-testid="heart-icon" />}
        title="Test Title"
        description="Test description"
      />
    )
    expect(screen.getByTestId('heart-icon')).toBeInTheDocument()
  })

  it('applies correct styling classes', () => {
    const { container } = render(
      <FeatureCard
        icon={<Heart />}
        title="Styled Card"
        description="Description"
      />
    )
    const card = container.firstChild as HTMLElement
    expect(card).toHaveClass('flex', 'flex-col', 'items-center', 'rounded-lg')
  })
})

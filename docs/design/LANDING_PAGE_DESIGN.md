# CodeHeart Landing Page Design

## 🎨 Design Philosophy

Our landing page embodies trust, dignity, and hope. It must appeal to multiple stakeholders while maintaining a cohesive, accessible experience.

## Color Palette

### Primary Colors

```css
--primary-blue: #1e40af; /* Trust, stability */
--sage-green: #22c55e; /* Growth, hope */
--warm-orange: #f97316; /* Action, urgency */
```

### Neutral Colors

```css
--gray-50: #f9fafb;
--gray-900: #111827;
--white: #ffffff;
```

## Typography

### Font Stack

```css
--font-heading: 'Inter', system-ui, sans-serif;
--font-body: 'Inter', system-ui, sans-serif;
```

### Type Scale

- Headings: 3rem (48px) → 1.5rem (24px)
- Body: 1rem (16px)
- Small: 0.875rem (14px)

## Page Sections

### 1. Hero Section

**Purpose**: Immediate emotional connection and clear value proposition

```typescript
interface HeroSection {
  headline: {
    de: 'Würdevoll spenden, direkt helfen'
    en: 'Donate with dignity, help directly'
  }
  subheading: {
    de: 'CodeHeart verbindet Sie sicher mit Menschen in Not'
    en: 'CodeHeart connects you safely with people in need'
  }
  cta: {
    primary: 'Join Waitlist'
    secondary: 'Learn More'
  }
  backgroundImage: 'gradient-overlay-with-abstract-pattern'
  trustBadges: ['SSL', 'GDPR', 'Verified']
}
```

**Visual Design**:

- Full viewport height
- Animated gradient background
- Floating trust badges
- Smooth scroll indicator

### 2. How It Works

**Purpose**: Simple explanation of the codeword system

**Layout**: 3-column grid

1. **See** - Spot a codeword
2. **Search** - Find in app
3. **Support** - Make donation

**Animation**: Cards reveal on scroll with stagger effect

### 3. Multi-Stakeholder CTAs

**Purpose**: Direct different user types to appropriate actions

```typescript
interface StakeholderCTA {
  donor: {
    icon: 'Heart'
    title: 'Start Helping'
    description: 'Join thousands making a difference'
    action: 'Join as Donor'
    color: 'primary-blue'
  }
  socialWorker: {
    icon: 'Users'
    title: 'Register Beneficiaries'
    description: 'Help your clients receive support'
    action: 'Apply as Social Worker'
    color: 'sage-green'
  }
  investor: {
    icon: 'TrendingUp'
    title: 'Invest in Impact'
    description: 'Support scalable social innovation'
    action: 'View Investment Deck'
    color: 'warm-orange'
  }
  beneficiary: {
    icon: 'Shield'
    title: 'Get Support'
    description: 'Receive help with dignity'
    action: 'Learn More'
    color: 'purple'
  }
}
```

**Design**:

- Card-based layout
- Hover animations
- Icon animations on hover
- Mobile: Vertical stack with accordion

### 4. Trust & Social Proof

**Purpose**: Build credibility and trust

**Components**:

- Impact counter (animated numbers)
- Partner logos (grayscale, color on hover)
- Testimonial carousel
- Security certifications

```typescript
interface ImpactMetrics {
  donationsProcessed: '€125,000+'
  beneficiariesHelped: '1,200+'
  partnerOrganizations: '45+'
  citiesActive: '5'
}
```

### 5. Waitlist Form

**Purpose**: Capture interested stakeholders

**Fields**:

- Email (required)
- Role selection (required)
- Organization (optional)
- Message (optional)
- Language preference
- Privacy consent

**Design Features**:

- Progressive disclosure
- Real-time validation
- Success animation
- GDPR-compliant consent

## Responsive Design

### Breakpoints

```css
--mobile: 640px;
--tablet: 768px;
--desktop: 1024px;
--wide: 1280px;
```

### Mobile Optimizations

- Touch-friendly tap targets (44px min)
- Simplified navigation
- Stacked layouts
- Reduced animations
- Optimized images

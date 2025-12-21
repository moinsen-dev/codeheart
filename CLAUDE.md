# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CodeHeart is a Next.js 14 TypeScript application for a digital donation platform that connects donors with homeless individuals through a codeword system. Currently in **prototype phase** with mock data using Zustand for state management.

## Development Commands

```bash
# Development
npm run dev          # Start dev server at http://localhost:3000
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint

# Setup
cp .env.example .env.local  # Initialize environment variables
```

## Architecture & Key Patterns

### Internationalization (i18n)

- **Framework**: next-intl with locale-based routing
- **Supported locales**: `de` (default), `en`
- **Routing pattern**: `[locale]` dynamic segment (e.g., `/de/page`, `/en/page`)
- **Configuration**:
  - `src/i18n/routing.ts` - defines locales and navigation utilities
  - `src/middleware.ts` - handles locale matching and routing
  - `messages/de.json` and `messages/en.json` - translation files
- **Usage**: Import navigation utilities from `@/i18n/routing`, not `next/navigation`
  ```typescript
  import { Link, redirect, usePathname, useRouter } from '@/i18n/routing'
  ```

### State Management (Prototype)

- **Framework**: Zustand with persistence middleware
- **Location**: `src/lib/stores/mock-data.ts`
- **Mock Data**: Uses `@faker-js/faker` for generating realistic test data
- **Key entities**: `Beneficiary`, `Donation`, `User`
- **Store actions**: `generateMockData()`, `login()`, `logout()`, `makeDonation()`, `getBeneficiaryByCodeword()`
- **Persistence**: Stored in localStorage under key `codeheart-mock-data`

### Component Architecture

- **UI Components**: shadcn/ui components in `src/components/ui/`
- **Styling**: Tailwind CSS with `class-variance-authority` for variants
- **Theme**: Light/Dark mode via `next-themes` (`ThemeProvider` in layout)
- **Utilities**: `src/lib/utils.ts` contains `cn()` for className merging

### Path Aliases

- `@/*` maps to `src/*` (configured in tsconfig.json)

### Image Domains

External image sources allowed in `next.config.mjs`:

- `images.unsplash.com`
- `api.dicebear.com` (used for avatar generation)

## Code Standards

### TypeScript

- Strict mode enabled
- Use functional React components
- Prefer TypeScript interfaces for data models

### Styling

- Tailwind CSS utility-first approach
- Mobile-first responsive design
- Support both light and dark themes
- WCAG 2.1 AA accessibility compliance

### Branch Naming Convention

```
type/description
Examples: feature/add-donation-analytics, fix/codeword-validation, docs/update-api-guide
```

## Key Stakeholder Roles

The application serves multiple user types:

- **Donors**: Make donations via codewords
- **Beneficiaries**: Receive donations (homeless individuals)
- **Social Workers**: Verify and support beneficiaries
- **Investors/Sponsors**: Provide funding
- **Admins**: Platform management

## Future Migration Notes

- State management will migrate from Zustand to Supabase
- Payment processing via Stripe (not yet implemented)
- GDPR/DSGVO compliance required for production
- Currently all data is mock/prototype - no real backend

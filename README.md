# CodeHeart

> Dignified donations through a simple codeword system

CodeHeart is a digital donation platform connecting donors with homeless individuals through unique codewords (e.g., "Maria47"). Donors can support specific individuals without direct interaction, preserving dignity for all.

## Current Status: Prototype

The prototype is fully functional with mock data, demonstrating the complete user experience.

### What's Working

- Landing page with features, stats, and waitlist
- User registration and login (mock auth)
- Donor dashboard with donation history
- Codeword search and donation flow
- Beneficiaries listing with filters (location, needs)
- German/English translations
- Light/Dark theme
- 25 automated tests

## Tech Stack

| Layer     | Technology                    |
| --------- | ----------------------------- |
| Framework | Next.js 14                    |
| Language  | TypeScript                    |
| Styling   | Tailwind CSS, shadcn/ui       |
| State     | Zustand + localStorage        |
| i18n      | next-intl                     |
| Testing   | Vitest, React Testing Library |
| CI/CD     | GitHub Actions                |

## Getting Started

```bash
# Clone
git clone https://github.com/moinsen-dev/codeheart.git
cd codeheart

# Install
npm install

# Development
npm run dev
```

Open http://localhost:3000

## Available Scripts

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run test         # Run tests in watch mode
npm run test:run     # Run tests once
npm run lint         # ESLint
npm run format       # Prettier
```

## Project Structure

```
src/
├── app/[locale]/           # Pages with locale routing
│   ├── page.tsx            # Landing page
│   ├── login/              # Authentication
│   ├── register/
│   ├── dashboard/          # Donor dashboard
│   ├── donate/             # Codeword search
│   │   └── [codeword]/     # Donation form
│   └── beneficiaries/      # Listing with filters
├── components/
│   ├── ui/                 # shadcn components
│   └── __tests__/          # Component tests
├── lib/
│   └── stores/             # Zustand store
└── i18n/                   # Locale configuration
```

## Roadmap

### Phase 1: Prototype (Current)

- [x] Landing page
- [x] Theme and language switching
- [x] Mock authentication
- [x] Donor dashboard
- [x] Codeword donation flow
- [x] Beneficiaries listing
- [x] Testing infrastructure
- [ ] Social worker portal
- [ ] Admin interface

### Phase 2: MVP

- [ ] Supabase integration
- [ ] Real authentication
- [ ] Stripe payments
- [ ] GDPR compliance
- [ ] Security audit

### Phase 3: Launch

- [ ] Pilot in Hamburg
- [ ] Partner onboarding
- [ ] Expand to 5 German cities

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## Documentation

- [Product Requirements](docs/PRD.md)
- [Database Architecture](docs/architecture/DATABASE_ARCHITECTURE.md)
- [GDPR Compliance](docs/compliance/GDPR_DSGVO_COMPLIANCE.md)
- [Development Plan](docs/setup/prototype_first_development_plan.md)

## License

MIT

---

Made with care for those in need

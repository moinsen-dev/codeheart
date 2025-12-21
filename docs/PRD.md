# Product Requirements Document (PRD)

## CodeHeart - Digital Donation Platform

**Version**: 1.0
**Last Updated**: December 2025
**Status**: Prototype Phase
**Document Owner**: CodeHeart Team

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Problem Statement](#2-problem-statement)
3. [Vision & Goals](#3-vision--goals)
4. [User Personas](#4-user-personas)
5. [User Stories](#5-user-stories)
6. [Features & Requirements](#6-features--requirements)
7. [Technical Requirements](#7-technical-requirements)
8. [Non-Functional Requirements](#8-non-functional-requirements)
9. [Success Metrics](#9-success-metrics)
10. [Risks & Mitigations](#10-risks--mitigations)
11. [Roadmap & Phases](#11-roadmap--phases)
12. [Appendix](#appendix)

---

## 1. Executive Summary

### 1.1 Product Overview

CodeHeart is a digital donation platform that connects donors with homeless individuals through an innovative **codeword system**. Instead of direct cash exchanges on the street, homeless individuals display memorable codewords (e.g., "Maria47"), and donors can later search for these codewords in the app to make secure, dignified donations.

### 1.2 Core Value Proposition

- **For Donors**: Donate safely and conveniently without carrying cash; know your donation reaches verified recipients
- **For Beneficiaries**: Receive donations with dignity; no direct solicitation required
- **For Society**: Transparent, accountable donation system that reduces street-level cash transactions

### 1.3 Current State

The project is in **prototype phase** with:

- Functional landing page (German/English)
- Mock data system with 20 generated beneficiaries
- Theme and language switching
- Zustand-based state management for rapid iteration

---

## 2. Problem Statement

### 2.1 The Challenge

Homeless individuals face significant barriers when seeking financial help:

1. **Dignity Concerns**: Direct solicitation can be uncomfortable for both parties
2. **Safety Risks**: Carrying cash puts homeless individuals at risk
3. **Trust Gap**: Donors uncertain if their money reaches intended recipients
4. **No Accountability**: Traditional street donations lack transparency
5. **Limited Payment Options**: Many people no longer carry cash

### 2.2 Target Market

- **Primary Market**: Urban areas in Germany with significant homeless populations
- **Initial Launch Cities**: Hamburg, Berlin, Munich, Cologne, Frankfurt
- **Potential Donors**: Tech-savvy individuals (18-55) comfortable with mobile payments
- **Potential Beneficiaries**: Homeless individuals connected to social services

### 2.3 Competitive Landscape

| Solution            | Limitations                                              |
| ------------------- | -------------------------------------------------------- |
| Direct cash giving  | Safety concerns, no accountability, declining cash usage |
| Charity donations   | Impersonal, donor doesn't know specific recipient        |
| Other donation apps | Not designed for street-level, person-to-person giving   |

**CodeHeart's Differentiator**: Bridges personal connection (seeing someone on the street) with digital convenience and verified accountability.

---

## 3. Vision & Goals

### 3.1 Product Vision

_"Enable dignified, secure, and transparent donations that connect donors directly with verified homeless individuals through a simple codeword system."_

### 3.2 Mission Statement

To transform how society supports homeless individuals by creating a bridge between human connection and digital convenience, ensuring every donation is accountable, safe, and preserves the dignity of the recipient.

### 3.3 Strategic Goals

| Goal                       | Target                   | Timeline             |
| -------------------------- | ------------------------ | -------------------- |
| Launch MVP in Hamburg      | 100 active beneficiaries | Phase 2              |
| Expand to 5 German cities  | 500+ beneficiaries       | Phase 3              |
| Achieve donation volume    | €50,000/month            | 6 months post-launch |
| Social worker partnerships | 20 partner organizations | Phase 3              |
| Donor retention rate       | 40% monthly active users | Ongoing              |

### 3.4 Success Criteria

1. Beneficiaries receive funds safely within 24-48 hours
2. 80%+ of donors complete their first donation
3. Zero security incidents involving beneficiary funds
4. GDPR/DSGVO full compliance
5. 4.5+ app store rating

---

## 4. User Personas

### 4.1 Donor Personas

#### Persona A: "Tech-Savvy Professional" - Anna, 32

**Background**: Marketing manager in Hamburg, uses mobile payments daily

**Behaviors**:

- Sees homeless individuals during commute
- Rarely carries cash
- Wants to help but feels awkward about direct interaction

**Goals**:

- Make a meaningful impact
- Donate conveniently on her own time
- Know the money reaches the right person

**Pain Points**:

- No cash available when encountering someone in need
- Uncertainty about how traditional donations are used
- Feels guilty when unable to help

**Quote**: _"I want to help, but I never have cash. If I could donate later from my phone, I would do it regularly."_

---

#### Persona B: "Compassionate Retiree" - Heinrich, 67

**Background**: Retired teacher, volunteers at local food bank

**Behaviors**:

- Regular supporter of charitable causes
- Prefers knowing individual stories
- Values transparency and accountability

**Goals**:

- Make personal connections through giving
- See the impact of donations
- Support specific individuals, not just organizations

**Pain Points**:

- Distrust of large charity overhead costs
- Wants more personal, direct giving
- Concerned about fraud

**Quote**: _"I want to see where my money goes and know it's actually helping someone specific."_

---

### 4.2 Beneficiary Persona

#### Persona C: "Seeking Support" - Thomas, 45

**Background**: Became homeless after job loss and divorce; connected to social services

**Behaviors**:

- Has a social worker helping with reintegration
- Uses public library for internet access
- Wants to maintain dignity while seeking help

**Goals**:

- Receive support without begging
- Maintain self-respect
- Work toward stable housing

**Pain Points**:

- Direct solicitation feels degrading
- Fear of theft if carrying cash
- Difficulty accessing traditional banking

**Quote**: _"I don't want to beg. Having a codeword lets people help me without either of us feeling uncomfortable."_

---

### 4.3 Social Worker Persona

#### Persona D: "Community Advocate" - Sabine, 38

**Background**: Social worker at Hamburg homeless shelter for 10 years

**Behaviors**:

- Manages 30+ beneficiary cases
- Coordinates with local businesses and city services
- Advocates for dignity-focused solutions

**Goals**:

- Track donations to her clients
- Ensure funds are used appropriately
- Reduce cash-related safety incidents

**Pain Points**:

- No visibility into informal donations
- Difficulty proving clients' needs for other support
- Administrative burden of manual tracking

**Quote**: _"A system that gives me visibility into donations would help me better support my clients and prove impact to funders."_

---

### 4.4 Admin/Platform Operator Persona

#### Persona E: "Platform Manager" - Markus, 42

**Background**: Non-profit technology director

**Goals**:

- Ensure platform security and compliance
- Generate reports for stakeholders
- Manage user disputes and edge cases

---

## 5. User Stories

### 5.1 Donor User Stories

| ID  | As a... | I want to...                               | So that...                           | Priority |
| --- | ------- | ------------------------------------------ | ------------------------------------ | -------- |
| D1  | Donor   | Search for a codeword I saw on the street  | I can donate to that specific person | P0       |
| D2  | Donor   | View a beneficiary's verified profile      | I can make an informed decision      | P0       |
| D3  | Donor   | Make a secure donation via credit card     | My payment is processed safely       | P0       |
| D4  | Donor   | See my donation history                    | I can track my giving                | P1       |
| D5  | Donor   | Receive updates about my donations' impact | I feel connected to my giving        | P1       |
| D6  | Donor   | Browse verified beneficiaries by location  | I can find people near me            | P1       |
| D7  | Donor   | Set up recurring donations                 | I can give regularly without effort  | P2       |
| D8  | Donor   | Share my donation on social media          | I can encourage others to give       | P2       |

### 5.2 Beneficiary User Stories

| ID  | As a...     | I want to...                        | So that...                            | Priority |
| --- | ----------- | ----------------------------------- | ------------------------------------- | -------- |
| B1  | Beneficiary | Have a unique, memorable codeword   | Donors can easily find me             | P0       |
| B2  | Beneficiary | Share my story and photo            | Donors can connect with me personally | P0       |
| B3  | Beneficiary | Receive notifications of donations  | I know when help is coming            | P1       |
| B4  | Beneficiary | Withdraw funds at partner locations | I can access my money safely          | P1       |
| B5  | Beneficiary | Update my needs and goals           | My profile stays current              | P2       |
| B6  | Beneficiary | See messages from donors            | I feel appreciated                    | P2       |

### 5.3 Social Worker User Stories

| ID  | As a...       | I want to...                          | So that...                            | Priority |
| --- | ------------- | ------------------------------------- | ------------------------------------- | -------- |
| S1  | Social Worker | Register new beneficiaries            | They can start receiving donations    | P0       |
| S2  | Social Worker | Verify beneficiary identities         | The platform maintains trust          | P0       |
| S3  | Social Worker | Monitor donations to my clients       | I can track support they're receiving | P1       |
| S4  | Social Worker | Generate reports on donation activity | I can report to my organization       | P1       |
| S5  | Social Worker | Moderate beneficiary profiles         | Content remains appropriate           | P1       |
| S6  | Social Worker | Coordinate payouts to beneficiaries   | Funds are distributed properly        | P1       |

### 5.4 Admin User Stories

| ID  | As a... | I want to...                   | So that...                      | Priority |
| --- | ------- | ------------------------------ | ------------------------------- | -------- |
| A1  | Admin   | View platform-wide analytics   | I can monitor platform health   | P1       |
| A2  | Admin   | Manage user accounts and roles | Access control is maintained    | P1       |
| A3  | Admin   | Handle disputes and complaints | Issues are resolved fairly      | P1       |
| A4  | Admin   | Configure platform settings    | The platform operates correctly | P2       |
| A5  | Admin   | Export data for compliance     | We meet regulatory requirements | P1       |

---

## 6. Features & Requirements

### 6.1 Core Features (MVP - Phase 2)

#### 6.1.1 Codeword System

**Description**: Unique, memorable codeword for each beneficiary (e.g., "Maria47")

**Requirements**:

- FR-001: Generate codewords as FirstName + 2-digit number
- FR-002: Ensure codeword uniqueness across platform
- FR-003: Allow case-insensitive search
- FR-004: Support partial matching with suggestions
- FR-005: Prevent inappropriate words via blocklist

**Acceptance Criteria**:

- [ ] User can search by exact codeword
- [ ] User can search with typos (fuzzy matching)
- [ ] Codewords are verified as unique before assignment
- [ ] System prevents offensive word combinations

---

#### 6.1.2 Beneficiary Profiles

**Description**: Verified profiles with photos, stories, and needs

**Requirements**:

- FR-010: Display verified profile with photo, story, needs
- FR-011: Show donation progress toward goal
- FR-012: Display verification badge from social worker
- FR-013: Show city/location (not precise address)
- FR-014: Allow profile updates with moderation

**Acceptance Criteria**:

- [ ] Profile shows all required information
- [ ] Verification status is clearly visible
- [ ] Location is anonymized to city level
- [ ] Updates require social worker approval

---

#### 6.1.3 Donation Flow

**Description**: Secure payment processing for donations

**Requirements**:

- FR-020: Accept credit/debit card payments
- FR-021: Process payments via Stripe
- FR-022: Send email confirmation to donor
- FR-023: Update beneficiary's fund balance
- FR-024: Allow optional message with donation
- FR-025: Support donations from €1 to €500

**Acceptance Criteria**:

- [ ] Payment completes within 3 seconds
- [ ] Donor receives confirmation email
- [ ] Beneficiary balance updates in real-time
- [ ] Failed payments show clear error messages

---

#### 6.1.4 User Authentication

**Description**: Secure login for all user types

**Requirements**:

- FR-030: Email/password authentication
- FR-031: Email verification for new accounts
- FR-032: Password reset via email
- FR-033: Role-based access (donor, social worker, admin)
- FR-034: Session management with secure tokens

**Acceptance Criteria**:

- [ ] Users can register and log in
- [ ] Passwords meet security requirements
- [ ] Sessions expire after inactivity
- [ ] Role permissions are enforced

---

### 6.2 Enhanced Features (Phase 2+)

#### 6.2.1 Donor Dashboard

**Requirements**:

- FR-040: View donation history with details
- FR-041: See total amount donated
- FR-042: Track impact updates from beneficiaries
- FR-043: Manage account settings
- FR-044: Download donation receipts (for tax purposes)

---

#### 6.2.2 Social Worker Portal

**Requirements**:

- FR-050: Register and manage beneficiaries
- FR-051: Verify identities and stories
- FR-052: Monitor donation activity
- FR-053: Coordinate fund withdrawals
- FR-054: Generate impact reports

---

#### 6.2.3 Admin Dashboard

**Requirements**:

- FR-060: Platform analytics and metrics
- FR-061: User management (CRUD operations)
- FR-062: Content moderation tools
- FR-063: Financial reporting
- FR-064: System configuration

---

### 6.3 Future Features (Phase 3+)

| Feature               | Description                                | Priority |
| --------------------- | ------------------------------------------ | -------- |
| Recurring Donations   | Monthly automatic donations                | P2       |
| Corporate Matching    | Employer donation matching programs        | P3       |
| Social Sharing        | Share donations on social platforms        | P2       |
| Push Notifications    | Mobile alerts for donors and beneficiaries | P2       |
| Partner Network       | Integration with shops for fund access     | P2       |
| Impact Stories        | Beneficiary success story showcases        | P3       |
| Fundraising Campaigns | Time-limited campaigns for specific needs  | P3       |

---

## 7. Technical Requirements

### 7.1 Technology Stack

| Layer              | Technology               | Rationale                             |
| ------------------ | ------------------------ | ------------------------------------- |
| Frontend           | Next.js 14 (TypeScript)  | SSR, React ecosystem, performance     |
| Styling            | Tailwind CSS + shadcn/ui | Rapid development, consistency        |
| State (Prototype)  | Zustand                  | Simple, lightweight for mock data     |
| State (Production) | Supabase                 | Real-time, PostgreSQL, auth built-in  |
| Payments           | Stripe                   | Industry standard, secure, compliant  |
| Email              | Resend                   | Developer-friendly, reliable delivery |
| i18n               | next-intl                | Locale routing, TypeScript support    |
| Hosting            | Vercel                   | Optimal for Next.js, edge functions   |

### 7.2 Database Schema (Supabase - Phase 2)

```
Users
├── id (UUID, PK)
├── email (unique)
├── role (enum: donor, social_worker, admin)
├── name
├── created_at
└── updated_at

Beneficiaries
├── id (UUID, PK)
├── codeword (unique)
├── name
├── story (text)
├── needs (array)
├── location (city)
├── verified (boolean)
├── social_worker_id (FK → Users)
├── photo_url
├── current_funds (decimal)
├── target_funds (decimal)
├── created_at
└── updated_at

Donations
├── id (UUID, PK)
├── donor_id (FK → Users)
├── beneficiary_id (FK → Beneficiaries)
├── amount (decimal)
├── status (enum: pending, completed, failed)
├── message (optional)
├── stripe_payment_id
├── created_at
└── processed_at

Withdrawals
├── id (UUID, PK)
├── beneficiary_id (FK → Beneficiaries)
├── amount (decimal)
├── status (enum: pending, approved, completed)
├── approved_by (FK → Users)
├── created_at
└── completed_at
```

### 7.3 API Endpoints (Planned)

| Method | Endpoint                     | Description                  |
| ------ | ---------------------------- | ---------------------------- |
| GET    | /api/beneficiaries           | List verified beneficiaries  |
| GET    | /api/beneficiaries/:codeword | Get beneficiary by codeword  |
| POST   | /api/donations               | Create new donation          |
| GET    | /api/donations/my            | Get current user's donations |
| POST   | /api/auth/register           | Register new user            |
| POST   | /api/auth/login              | Authenticate user            |
| GET    | /api/users/me                | Get current user profile     |

### 7.4 External Integrations

| Service  | Purpose             | Phase             |
| -------- | ------------------- | ----------------- |
| Stripe   | Payment processing  | Phase 2           |
| Supabase | Database + Auth     | Phase 2           |
| Resend   | Transactional email | Phase 2           |
| DiceBear | Avatar generation   | Phase 1 (current) |
| Vercel   | Hosting + Edge      | Phase 2           |

---

## 8. Non-Functional Requirements

### 8.1 Performance

| Metric             | Requirement | Measurement      |
| ------------------ | ----------- | ---------------- |
| Page Load          | < 2 seconds | Lighthouse score |
| Search Response    | < 500ms     | API latency      |
| Payment Processing | < 3 seconds | Stripe webhook   |
| Uptime             | 99.9%       | Monthly SLA      |

### 8.2 Security

- **Authentication**: Secure session management with JWT
- **Encryption**: TLS 1.3 for all communications
- **Data Protection**: AES-256 for sensitive data at rest
- **Payment Security**: PCI-DSS compliant (via Stripe)
- **Access Control**: Role-based permissions
- **Audit Logging**: All sensitive actions logged

### 8.3 Privacy & Compliance (GDPR/DSGVO)

- **Data Minimization**: Collect only necessary data
- **Consent Management**: Explicit opt-in for data processing
- **Right to Erasure**: User data deletion on request
- **Data Portability**: Export user data in standard format
- **Privacy by Design**: No direct personal data exchange between donors and beneficiaries
- **Cookie Consent**: Compliant cookie banner
- **DPO Contact**: Designated data protection officer

### 8.4 Accessibility

- **WCAG 2.1 AA Compliance**: All public-facing pages
- **Screen Reader Support**: Semantic HTML, ARIA labels
- **Keyboard Navigation**: Full functionality without mouse
- **Color Contrast**: Minimum 4.5:1 ratio
- **Focus Indicators**: Visible focus states
- **Responsive Design**: Mobile-first, 320px to 4K

### 8.5 Localization

- **Languages**: German (default), English
- **Date/Time**: Locale-aware formatting
- **Currency**: Euro (€) with proper formatting
- **Number Formatting**: German decimal/thousand separators

---

## 9. Success Metrics

### 9.1 Key Performance Indicators (KPIs)

| Category         | Metric                  | Target    | Measurement             |
| ---------------- | ----------------------- | --------- | ----------------------- |
| **Acquisition**  | Monthly new donors      | 500+      | Registrations           |
| **Activation**   | First donation rate     | 80%       | Within 7 days of signup |
| **Retention**    | Monthly active donors   | 40%       | Returning donors        |
| **Revenue**      | Monthly donation volume | €50,000   | Total processed         |
| **Engagement**   | Avg donations per donor | 2.5/month | Donation count          |
| **Satisfaction** | NPS Score               | 50+       | Quarterly survey        |
| **Trust**        | Verification rate       | 100%      | Verified beneficiaries  |

### 9.2 Product Health Metrics

| Metric               | Target  | Alert Threshold |
| -------------------- | ------- | --------------- |
| Uptime               | 99.9%   | < 99.5%         |
| Error Rate           | < 1%    | > 2%            |
| Page Load Time       | < 2s    | > 3s            |
| Payment Success Rate | > 98%   | < 95%           |
| Support Tickets      | < 5/day | > 15/day        |

### 9.3 Social Impact Metrics

| Metric                  | Description                              |
| ----------------------- | ---------------------------------------- |
| Total Funds Distributed | Amount received by beneficiaries         |
| Beneficiaries Helped    | Unique beneficiaries receiving donations |
| Avg Donation Size       | Trends in giving behavior                |
| Success Stories         | Beneficiaries who achieved goals         |
| Partner Organizations   | Social work organizations onboarded      |

---

## 10. Risks & Mitigations

### 10.1 Technical Risks

| Risk               | Impact   | Probability | Mitigation                                       |
| ------------------ | -------- | ----------- | ------------------------------------------------ |
| Payment fraud      | High     | Medium      | Stripe fraud protection, transaction limits      |
| Data breach        | Critical | Low         | Encryption, security audits, penetration testing |
| System downtime    | High     | Low         | Multi-region hosting, automatic failover         |
| Scalability issues | Medium   | Medium      | Load testing, horizontal scaling                 |

### 10.2 Business Risks

| Risk               | Impact | Probability | Mitigation                                |
| ------------------ | ------ | ----------- | ----------------------------------------- |
| Low adoption       | High   | Medium      | Marketing, social worker partnerships, PR |
| Regulatory changes | Medium | Low         | Legal counsel, flexible architecture      |
| Negative PR        | High   | Low         | Strict verification, transparency reports |
| Competitor entry   | Medium | Medium      | First-mover advantage, network effects    |

### 10.3 Operational Risks

| Risk                  | Impact | Probability | Mitigation                               |
| --------------------- | ------ | ----------- | ---------------------------------------- |
| Social worker burnout | High   | Medium      | Efficient tools, reasonable caseloads    |
| Beneficiary fraud     | High   | Low         | Verification process, ongoing monitoring |
| Fund misuse           | Medium | Medium      | Time-delayed payouts, spending guidance  |
| Partner disputes      | Medium | Low         | Clear contracts, mediation process       |

---

## 11. Roadmap & Phases

### Phase 1: Prototype (Current)

**Duration**: 4-6 weeks
**Status**: In Progress

**Deliverables**:

- [x] Project setup (Next.js, TypeScript, Tailwind)
- [x] Landing page (responsive, bilingual)
- [x] Theme switching (light/dark)
- [x] Language switching (DE/EN)
- [x] Mock data system (Zustand + Faker.js)
- [ ] Mock authentication flows
- [ ] Donor dashboard (with mock data)
- [ ] Beneficiary profile pages
- [ ] Social worker portal (basic)
- [ ] Codeword search functionality

**Goal**: Demonstrate concept to stakeholders and investors with realistic mock data.

---

### Phase 2: MVP

**Duration**: 8-12 weeks
**Status**: Planned

**Deliverables**:

- [ ] Supabase integration (database + auth)
- [ ] Real authentication (email/password)
- [ ] Stripe payment processing
- [ ] Email notifications (Resend)
- [ ] Complete donation flow
- [ ] Social worker registration workflow
- [ ] Basic admin dashboard
- [ ] GDPR/DSGVO compliance features
- [ ] Security audit

**Goal**: Launch functional platform in Hamburg with 50-100 beneficiaries.

---

### Phase 3: Growth

**Duration**: 12-16 weeks
**Status**: Future

**Deliverables**:

- [ ] Mobile app (React Native or PWA)
- [ ] Expand to 5 German cities
- [ ] Partner network for withdrawals
- [ ] Recurring donations
- [ ] Impact reporting
- [ ] Corporate sponsorship features
- [ ] Advanced analytics

**Goal**: Scale to 500+ beneficiaries, €50,000/month in donations.

---

### Phase 4: Scale

**Duration**: Ongoing
**Status**: Future

**Deliverables**:

- [ ] European expansion
- [ ] Multi-currency support
- [ ] API for partner integrations
- [ ] Machine learning for fraud detection
- [ ] Advanced matching algorithms

**Goal**: Become the leading platform for dignified street-level donations.

---

## Appendix

### A. Glossary

| Term          | Definition                                            |
| ------------- | ----------------------------------------------------- |
| Codeword      | Unique identifier for a beneficiary (e.g., "Maria47") |
| Beneficiary   | Homeless individual receiving donations               |
| Donor         | User making donations                                 |
| Social Worker | Verified professional managing beneficiaries          |
| Verification  | Process of confirming beneficiary identity and story  |
| Payout        | Transfer of funds to beneficiary                      |

### B. Related Documents

| Document              | Location                                         |
| --------------------- | ------------------------------------------------ |
| Database Architecture | `docs/architecture/DATABASE_ARCHITECTURE.md`     |
| GDPR Compliance       | `docs/compliance/GDPR_DSGVO_COMPLIANCE.md`       |
| Landing Page Design   | `docs/design/LANDING_PAGE_DESIGN.md`             |
| Development Plan      | `docs/setup/prototype_first_development_plan.md` |
| System Analysis       | `docs/digital_donation_system_analysis.md`       |

### C. Wireframes & Mockups

_To be added: Links to Figma or design files_

### D. Revision History

| Version | Date          | Author         | Changes              |
| ------- | ------------- | -------------- | -------------------- |
| 1.0     | December 2025 | CodeHeart Team | Initial PRD creation |

---

_This document is a living artifact and will be updated as the product evolves._

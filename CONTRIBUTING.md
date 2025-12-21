# Contributing to CodeHeart 💙

Thank you for your interest in contributing to CodeHeart! We're building a platform that helps homeless individuals with dignity, and every contribution makes a real difference.

## 🤝 Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct. We are committed to providing a welcoming and inclusive environment for all contributors.

## 🌟 Ways to Contribute

### For Developers

- **Code Contributions**: Fix bugs, add features, improve performance
- **Documentation**: Improve guides, add examples, fix typos
- **Testing**: Write tests, report bugs, test accessibility
- **Translations**: Help translate the platform to new languages

### For Non-Developers

- **User Research**: Interview stakeholders, gather feedback
- **Design**: Create mockups, improve UX, design assets
- **Content**: Write help articles, create tutorials
- **Community**: Moderate discussions, welcome newcomers

### For Domain Experts

- **Social Workers**: Provide insights on beneficiary needs
- **Security Experts**: Review our privacy practices
- **Legal Experts**: Help with compliance requirements
- **Accessibility Experts**: Ensure inclusive design

## 🚀 Getting Started

### Prerequisites

- Node.js 20.x or higher
- Git
- A GitHub account

### Setup

```bash
# Fork and clone the repository
git clone https://github.com/YOUR_USERNAME/codeheart.git
cd codeheart

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

## 📝 Development Process

### 1. Find or Create an Issue

- Check existing issues for something you'd like to work on
- If creating a new issue, use our templates
- Comment on the issue to let others know you're working on it

### 2. Create a Branch

```bash
# Branch naming convention
git checkout -b type/description

# Examples:
# feature/add-donation-analytics
# fix/codeword-validation
# docs/update-api-guide
```

### 3. Make Your Changes

- Follow our coding standards (see below)
- Write tests for new features
- Update documentation as needed
- Ensure all tests pass

### 4. Submit a Pull Request

- Use our PR template
- Link to the related issue
- Provide clear description of changes
- Include screenshots for UI changes

## 💻 Coding Standards

### TypeScript/JavaScript

- Use TypeScript for all new code
- Follow ESLint configuration
- Use functional components for React
- Implement proper error handling

### Styling

- Use Tailwind CSS utility classes
- Follow mobile-first design
- Ensure WCAG 2.1 AA compliance
- Support both light and dark themes

### Testing

- Write unit tests for utilities
- Add integration tests for API routes
- Include accessibility tests
- Aim for >80% code coverage

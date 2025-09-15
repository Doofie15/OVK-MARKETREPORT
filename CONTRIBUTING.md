# Contributing to OVK Wool Market Report Platform

Thank you for your interest in contributing to the OVK Wool Market Report Platform! This document provides guidelines and information for contributors.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Coding Standards](#coding-standards)
- [Mobile Development](#mobile-development)
- [Testing Guidelines](#testing-guidelines)
- [Pull Request Process](#pull-request-process)
- [Issue Reporting](#issue-reporting)

## 🤝 Code of Conduct

This project follows the OVK Code of Conduct. By participating, you agree to uphold this code.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git
- Code editor (VS Code recommended)

### Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/your-username/wool-market-report.git
   cd wool-market-report
   ```

2. **Install Dependencies**
   ```bash
   # Frontend dependencies
   npm install
   
   # Backend dependencies
   cd server
   npm install
   cd ..
   ```

3. **Environment Setup**
   ```bash
   # Create environment files
   cp .env.example .env.local
   cp server/.env.example server/.env
   ```

4. **Start Development Servers**
   ```bash
   # Terminal 1: Backend
   cd server && npm start
   
   # Terminal 2: Frontend
   npm run dev
   ```

## 🎨 Coding Standards

### TypeScript
- Use TypeScript for all new code
- Define proper interfaces for all data structures
- Use strict type checking
- Avoid `any` type unless absolutely necessary

### React Components
- Use functional components with hooks
- Follow the existing component structure
- Use proper prop types and interfaces
- Implement proper error boundaries

### File Organization
```
components/
├── admin/           # Admin-specific components
├── mobile/          # Mobile-optimized components
├── shared/          # Shared components
└── [feature]/       # Feature-specific components
```

### Naming Conventions
- **Components**: PascalCase (`UserProfile.tsx`)
- **Files**: PascalCase for components, camelCase for utilities
- **Variables**: camelCase (`userName`)
- **Constants**: UPPER_SNAKE_CASE (`API_BASE_URL`)

## 📱 Mobile Development

### Mobile-First Approach
- Always consider mobile experience first
- Use the existing mobile component library
- Test on multiple device sizes
- Implement touch-friendly interactions

### Mobile Components
When creating new features, consider:
1. **Desktop Component**: Full-featured version
2. **Mobile Component**: Mobile-optimized version
3. **Responsive Layout**: Use `MobileLayout` for automatic switching

### Example Mobile Component Structure
```typescript
// Desktop component
export const FeatureComponent: React.FC<Props> = ({ data }) => {
  return (
    <MobileLayout
      mobileComponent={<MobileFeatureComponent data={data} />}
    >
      <DesktopFeatureComponent data={data} />
    </MobileLayout>
  );
};

// Mobile component
export const MobileFeatureComponent: React.FC<Props> = ({ data }) => {
  return (
    <MobileCard title="Feature Title">
      {/* Mobile-optimized content */}
    </MobileCard>
  );
};
```

### Mobile Testing
- Test on actual devices when possible
- Use browser dev tools for responsive testing
- Verify touch interactions work properly
- Check performance on mobile networks

## 🧪 Testing Guidelines

### Unit Tests
- Write tests for all new functionality
- Use Jest and React Testing Library
- Aim for >80% code coverage
- Test both desktop and mobile components

### Integration Tests
- Test component interactions
- Test API integrations
- Test responsive behavior

### Manual Testing
- Test on multiple browsers
- Test on different screen sizes
- Test with different data sets
- Test admin functionality

## 📝 Pull Request Process

### Before Submitting
1. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes**
   - Follow coding standards
   - Add tests for new functionality
   - Update documentation if needed

3. **Test Your Changes**
   ```bash
   npm run test
   npm run build
   npm run lint
   ```

4. **Commit Changes**
   ```bash
   git add .
   git commit -m "feat: add new feature description"
   ```

### Pull Request Guidelines
- Use the provided PR template
- Provide clear description of changes
- Include screenshots for UI changes
- Link related issues
- Ensure all checks pass

### Commit Message Format
```
type(scope): description

feat(mobile): add mobile chart component
fix(admin): resolve form validation issue
docs(readme): update installation instructions
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

## 🐛 Issue Reporting

### Bug Reports
- Use the bug report template
- Provide detailed reproduction steps
- Include device/browser information
- Add screenshots if applicable

### Feature Requests
- Use the feature request template
- Explain the use case and motivation
- Consider mobile implications
- Provide mockups if applicable

## 🔧 Development Tools

### Recommended VS Code Extensions
- ES7+ React/Redux/React-Native snippets
- TypeScript Importer
- Prettier - Code formatter
- ESLint
- Auto Rename Tag
- Bracket Pair Colorizer

### Useful Commands
```bash
# Development
npm run dev              # Start frontend dev server
cd server && npm start   # Start backend server

# Building
npm run build           # Build for production
npm run preview         # Preview production build

# Testing
npm run test            # Run tests
npm run test:watch      # Run tests in watch mode
npm run test:coverage   # Run tests with coverage

# Linting
npm run lint            # Run ESLint
npm run lint:fix        # Fix linting issues
```

## 📚 Resources

- [React Documentation](https://reactjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Material-UI Documentation](https://mui.com/)
- [ApexCharts Documentation](https://apexcharts.com/docs/)
- [Vite Documentation](https://vitejs.dev/guide/)

## 🤔 Questions?

If you have questions about contributing:
- Check existing issues and discussions
- Create a new issue with the "question" label
- Contact the development team

Thank you for contributing to the OVK Wool Market Report Platform! 🐑📊

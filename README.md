# Playwright TypeScript Automation Framework

A comprehensive test automation framework built with **Playwright** and **TypeScript** for testing the [Automation Exercise](https://automationexercise.com/) e-commerce demo site. This framework provides robust UI and API testing capabilities following industry best practices and design patterns.

## 🎯 Project Overview

**Target Application:** [Automation Exercise](https://automationexercise.com/)  
A full-featured e-commerce demo site with complete UI and backend API, specifically designed for automation testing practice. The site includes user registration, product catalog, shopping cart, checkout process, and various interactive elements.

**Framework Features:**

- ✅ **UI Testing** - Complete page object model with component-based architecture
- ✅ **API Testing** - Service layer pattern with base client abstraction
- ✅ **Cross-Browser Support** - Chromium, Firefox, and WebKit
- ✅ **TypeScript** - Type-safe test development with full IntelliSense
- ✅ **Design Patterns** - POM, Component Pattern, Service Pattern, Factory Pattern
- ✅ **Code Quality** - ESLint, Prettier, Husky pre-commit hooks
- ✅ **Reporting** - HTML reports, Allure integration, screenshots on failure
- ✅ **CI/CD Ready** - GitHub Actions workflow included

## 🏗️ Architecture & Design Patterns

This framework follows established automation testing patterns and principles:

### Page Object Model (POM)

- **BasePage** - Abstract base class for all page objects
- **Feature Pages** - Specific page implementations (e.g., `HomePage`, `ProductPage`)
- **No Direct Playwright Calls** - All interactions through page objects

### Component Pattern

- **BaseComponent** - Abstract base class for reusable UI components
- **Feature Components** - Modular UI fragments (e.g., `NavigationComponent`, `CartComponent`)
- **Common Components** - Shared components following Singleton pattern

### Service Pattern (API)

- **BaseApiClient** - Abstract HTTP client with common methods
- **Feature Services** - API endpoint abstractions (e.g., `UserService`, `ProductService`)
- **No Direct API Calls** - All interactions through service layer

### Key Principles

- **DRY (Don't Repeat Yourself)** - Centralized selectors, data, and logic
- **KISS (Keep It Simple, Stupid)** - Simple, maintainable solutions
- **SOLID** - Single responsibility, dependency injection via fixtures

## 📁 Project Structure

```
src/
├── ui/                          # UI Testing Layer
│   ├── po/                      # Page Objects
│   │   ├── base/               # Base Classes
│   │   │   ├── basePage.page.ts           # Base page abstraction
│   │   │   └── baseComponent.component.ts # Base component abstraction
│   │   ├── components/         # Reusable UI Components
│   │   │   └── common/        # Shared components (Navbar, Footer, etc.)
│   │   └── <feature>/         # Feature-specific page objects
│   ├── tests/                  # UI Test Specifications
│   │   └── <feature>/         # Feature-grouped test files
│   ├── fixtures/              # Playwright fixtures for DI
│   ├── utils/                 # UI testing utilities
│   └── data/                  # UI test data and builders
├── api/                        # API Testing Layer
│   ├── base/                  # Base Classes
│   │   └── baseApiClient.service.ts  # Base API client
│   ├── services/              # API Service Layer
│   │   └── <feature>.service.ts      # Feature-specific API clients
│   ├── tests/                 # API Test Specifications
│   │   └── <feature>/        # Feature-grouped API tests
│   ├── fixtures/             # API fixtures and context setup
│   ├── utils/                # API testing utilities
│   └── data/                 # API test data and builders
├── shared/                    # Shared Resources
│   ├── config/               # Environment configurations
│   ├── fixtures/            # Cross-domain fixtures
│   └── utils/               # Shared utilities (logging, env resolution)
└── reports/                  # Test Reports & Artifacts
```

## 🚀 Setup & Installation

### Prerequisites

- **Node.js** 18+ (LTS recommended)
- **npm** 8+ or **yarn** 1.22+
- **Git** 2.30+

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd playwright-typescript-automation-framework

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install

# Verify installation
npm run lint
npm run format
```

## 📋 Available Scripts

| Script            | Description                    | Usage                     |
| ----------------- | ------------------------------ | ------------------------- |
| `test`            | Run all tests (UI + API)       | `npm test`                |
| `test:ui`         | Run UI tests only              | `npm run test:ui`         |
| `test:api`        | Run API tests only             | `npm run test:api`        |
| `test:headed`     | Run tests in headed mode       | `npm run test:headed`     |
| `test:debug`      | Run tests in debug mode        | `npm run test:debug`      |
| `test:smoke`      | Run smoke tests only           | `npm run test:smoke`      |
| `test:regression` | Run regression tests only      | `npm run test:regression` |
| `lint`            | Run ESLint code analysis       | `npm run lint`            |
| `lint:fix`        | Fix auto-fixable ESLint issues | `npm run lint:fix`        |
| `format`          | Format code with Prettier      | `npm run format`          |
| `format:check`    | Check code formatting          | `npm run format:check`    |
| `report`          | Open HTML test report          | `npm run report`          |
| `allure:generate` | Generate Allure report         | `npm run allure:generate` |
| `allure:open`     | Open Allure report             | `npm run allure:open`     |

## 🛠️ Configuration

### Environment Configuration

Configure test environments in `src/shared/config/environments.ts`:

```typescript
export const environments = {
  production: {
    baseUrl: 'https://automationexercise.com/',
    apiBaseUrl: 'https://automationexercise.com/api',
  },
  staging: {
    baseUrl: 'https://staging.automationexercise.com/',
    apiBaseUrl: 'https://staging.automationexercise.com/api',
  },
};
```

### Playwright Configuration

Browser and test configurations in `playwright.config.ts`:

- Cross-browser testing (Chromium, Firefox, WebKit)
- Parallel execution
- Screenshot and video on failure
- HTML and Allure reporting

### ESLint Configuration

Automation testing optimized rules in `eslint.config.mjs`:

- TypeScript best practices
- Automation-specific patterns
- Magic number exceptions for timeouts and HTTP codes
- Console debugging allowed in Page Objects

## 🧪 Test Development Guidelines

### Writing UI Tests

```typescript
import { test, expect } from '../fixtures/page-fixtures';

test.describe('Feature Name', () => {
  test('should perform user action successfully', async ({ featurePage }) => {
    // Use TestHelpers for step logging
    TestHelpers.logStep('Navigating to feature page');
    await featurePage.navigateTo('/feature');

    // Interact through page objects only
    await featurePage.performAction();

    // Assert expected outcomes
    await expect(featurePage.resultElement).toBeVisible();
  });
});
```

### Writing API Tests

```typescript
import { test, expect } from '@playwright/test';
import { FeatureService } from '../services/feature.service';

test.describe('Feature API', () => {
  test('should return expected data', async ({ request }) => {
    const featureService = new FeatureService(request);

    const response = await featureService.getData();
    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data).toHaveProperty('expectedField');
  });
});
```

### Locator Strategy

Follow the locator hierarchy as defined in the instructions:

1. **Playwright Built-in Locators** (getByRole, getByLabel, getByText)
2. **Custom Attributes** (data-testid, aria-label)
3. **Text Selectors** (for static, unique text)
4. **CSS Selectors** (only as last resort)

### Assertion Guidelines

- Use **hard assertions** for test pass/fail criteria
- Use **soft assertions** for intermediate checks only
- Follow with final hard assertion before test completion
- No false positives - assertions must accurately reflect expected state

## 🔧 Code Quality & Standards

### Pre-commit Hooks (Husky)

- **ESLint validation** - Code quality checks
- **Prettier formatting** - Code style consistency
- **TypeScript compilation** - Type safety validation

### Naming Conventions

- **Page Objects**: `FeaturePage` in `feature.page.ts`
- **Components**: `FeatureComponent` in `feature.component.ts`
- **Services**: `FeatureService` in `feature.service.ts`
- **Tests**: Descriptive names starting with "should"

### File Organization

- **Centralized selectors** - No inline selectors in tests
- **Data-driven tests** - Use factories and builders
- **Environment configs** - No hardcoded URLs or endpoints
- **Dependency injection** - Use Playwright fixtures

## 📊 Reporting & CI/CD

### Test Reports

- **HTML Report** - Built-in Playwright reporting
- **Allure Report** - Advanced reporting with history and analytics
- **Screenshots** - Automatic capture on test failures
- **Videos** - Recording of test execution (configurable)

### Continuous Integration

GitHub Actions workflow included for:

- Multi-browser test execution
- Parallel test runs
- Report generation and archiving
- Quality gate enforcement

## 🤝 Contributing

1. **Follow the instruction guides** in `.github/instructions/`
2. **Run quality checks** before committing
3. **Write descriptive commit messages**
4. **Ensure all tests pass** before pull request
5. **Update documentation** for new features

### Development Workflow

```bash
# Create feature branch
git checkout -b feature/new-functionality

# Implement changes following patterns
# Run quality checks
npm run lint
npm run format
npm test

# Commit changes (triggers Husky hooks)
git commit -m "descriptive message"

# Push and create pull request
git push origin feature/new-functionality
```

## 📚 References

- **Playwright Documentation**: https://playwright.dev/docs/intro
- **TypeScript Handbook**: https://www.typescriptlang.org/docs/
- **Automation Exercise Site**: https://automationexercise.com/
- **Allure Reporting**: https://github.com/allure-framework/allure-js

---

**Built with ❤️ for automation testing excellence**

## 🏗️ Project Structure

```
src/
  ui/
    po/
      base/                  # BasePage and shared navigation behaviours
      components/            # Reusable UI components (CookieConsent, etc.)
      home/                  # Feature-specific page objects
        HomePage.po.ts
      base/NavigationPage.ts # Navigation page object (shared elements)
    tests/
      homepage/              # UI specs grouped by feature
        homepage.spec.ts
    fixtures/
      pageFixtures.ts        # Playwright fixtures for DI
    utils/                   # UI helpers, selector factories
    data/                    # UI-focused datasets
shared/
  config/                    # Environment configs, endpoints, credentials
  fixtures/                  # Cross-domain fixtures (if needed)
  utils/                     # Shared utilities (env resolution, logging)
reports/                     # Built-in HTML report artifacts
```

## ✨ Design Patterns Applied

### Page Object Model (POM)

- **BasePage**: Abstract base with common page behaviours
- **NavigationPage**: Shared header/menu/nav elements and actions
- **Feature Pages**: `HomePage` in `src/ui/po/home/`
- **Components**: Reusable UI pieces (e.g., `CookieConsent.component.ts`)

### Dependency Injection

- **Fixtures**: Page objects injected via `src/ui/fixtures/pageFixtures.ts`
- **Constructor Injection**: Components passed into page object constructors

### Factory/Builder Patterns

- **Data**: Centralized datasets under `src/ui/data/`
- **Helpers**: Small, composable utilities under `src/ui/utils/`

### Builder Pattern

- **Test Helpers**: Fluent interface for test setup and execution
- **Configuration**: Environment-specific configuration building

## 🚀 Features Implemented

### Cookie Consent Handling

- **Minimal, robust locators**: Focused selectors for banner/container/button
- **Cross-frame support**: Detects consent UI in iframes
- **Acceptance flow**: Click strategies to reliably accept
- **Post-validation**: Ensures banner is hidden after consent

### Test Architecture

- **Layered Structure**: Clean separation between tests, page objects, and utilities
- **Fixture-Based DI**: Page objects provided through dependency injection
- **Comprehensive Logging**: Structured test step logging with success/failure indicators
- **Error Handling**: Graceful handling of missing elements and timeouts

## 📋 Test Scenarios Covered

### Homepage & Navigation (`homepage.spec.ts`)

- **Smoke**: Page loads, header/nav visible, cookie consent handled
- **Critical**: Consent acceptance, banner hides, core interactions work
- **Navigation**: Basic navigation element visibility checks
- **Regression**: Stable flows validated over time

## 🛠️ Usage

### Running Tests

Use the provided npm scripts for tag-based runs and reporting:

```powershell
# Install browsers (first run or after updates)
npx playwright install

# Run all tests
npm run test

# Run by tag
npm run test:smoke
npm run test:critical
npm run test:regression
npm run test:navigation

# Run a specific project
npm run test:chromium
npm run test:firefox
npm run test:webkit

# List discovered tests
npm run test:list
```

### Test Reports

```powershell
# View Playwright HTML report
npx playwright show-report
```

## 🔧 Configuration

### Environment Variables

- `BASE_URL`: Target application URL (default: https://automationexercise.com)
- `HEADLESS`: Headless mode (default: true)
- `TIMEOUT`: Global timeout in ms (default: 30000)

### Playwright Configuration

- **Projects**: Chromium, Firefox, WebKit
- **Reporters**: Built-in HTML reporting
- **Retry**: Configurable retry logic for CI/CD

## 📁 Key Components

### BasePage (`src/ui/base/BasePage.ts`)

Abstract base class providing:

- Navigation utilities
- Element interaction methods
- Wait strategies
- Screenshot capabilities

### CookieConsentComponent (`src/ui/po/components/CookieConsent.component.ts`)

Purpose:

- Detect visible consent banner/container
- Accept cookies via robust button locator(s)
- Validate banner hidden post-acceptance

### HomePage (`src/ui/po/home/HomePage.po.ts`)

Features:

- Navigate to homepage and handle consent
- Verify page loaded and core elements visible
- Delegate consent handling to component

### Test Fixtures (`src/ui/fixtures/pageFixtures.ts`)

Dependency injection:

- Provides `homePage` for tests
- Centralizes page object lifecycle

## 🎯 Quality Standards

### Code Organization

- **Strict Layering**: Tests → Page Objects/Components → Utilities/Data
- **Single Responsibility**: Each class has one clear purpose
- **DRY**: Reusable components and utilities
- **Type Safety**: Strong TypeScript typing

### Test Practices

- **Descriptive Naming**: Clear test and method names
- **Lean Specs**: Logic lives in POs/components
- **Robust Selectors**: Minimal, readable, stable locators
- **Observability**: Built-in HTML reports; optional logs

### Maintenance

- **Centralized Data**: All test data in dedicated files
- **Configuration**: Environment-specific settings
- **Documentation**: Inline comments and README maintenance
- **Consistency**: Unified patterns across all components

## 🔄 CI/CD Integration

The framework is CI-ready:

- **Parallel Execution**: Tests run in parallel workers
- **Retry Logic**: Automatic retry for flaky tests
- **Reports**: Playwright HTML report
- **Husky/ESLint/Prettier**: Lint and format checks

## 🧪 Extending the Framework

### Adding New Page Objects

1. Create a feature folder under `src/ui/po/`
2. Implement page object extending `BasePage`
3. Inject via fixtures if needed
4. Add specs under `src/ui/tests/<feature>/`

### Adding New Components

1. Create component in `src/ui/po/components/`
2. Inject into relevant page objects
3. Cover via feature specs

### Adding Test Data

1. Add data under `src/ui/data/`
2. Use strong typing and `as const` when applicable
3. Import into POs/components/tests

## Notes

- Legacy files like `cookieBanner.spec.ts` and the old `pages/` directory have been removed in favor of the new layered structure and tag-based execution.
- Use the npm scripts for common runs and `npx playwright show-report` for viewing results.

This framework provides a solid foundation for scalable, maintainable UI automation with Playwright and TypeScript.

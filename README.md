# 🎭 Playwright TypeScript Automation Framework

[![Playwright Tests](https://github.com/DobrosiGergo/playwright-typescript-automation-framework/actions/workflows/playwright.yml/badge.svg?branch=gergo_test_branch)](https://github.com/DobrosiGergo/playwright-typescript-automation-framework/actions)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6.3-blue.svg)](https://www.typescriptlang.org/)
[![Playwright](https://img.shields.io/badge/Playwright-1.57.0-green.svg)](https://playwright.dev/)
[![License](https://img.shields.io/badge/license-ISC-blue.svg)](LICENSE)

Enterprise-grade test automation framework built with **Playwright** and **TypeScript**, featuring **dual API testing strategies** (standalone + UI validation), centralized configuration management, and comprehensive CI/CD integration.

## 📊 Quick Links

| Resource                    | Link                                                                                                                        | Description                           |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------- | ------------------------------------- |
| 📈 **Live Test Report**     | [Allure Report](https://dobrosigergo.github.io/playwright-typescript-automation-framework/gergo_test_branch-allure-report/) | Interactive test results with history |
| 🔄 **CI/CD Pipeline**       | [GitHub Actions](https://github.com/DobrosiGergo/playwright-typescript-automation-framework/actions)                        | Automated test execution              |
| 🎯 **UI Test Application**  | [Automation Exercise](https://automationexercise.com/)                                                                      | Demo e-commerce platform              |
| 🔌 **API Test Application** | [Restful Booker](https://restful-booker.herokuapp.com/)                                                                     | RESTful API testing platform          |

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [Technical Stack](#-technical-stack)
- [Getting Started](#-getting-started)
- [Running Tests](#-running-tests)
- [Configuration](#-configuration)
- [Reporting](#-reporting)
- [CI/CD Pipeline](#-cicd-pipeline)
- [Development Guidelines](#-development-guidelines)

---

## 🎯 Overview

### Framework Capabilities

This framework provides enterprise-level test automation with:

**✅ Dual API Testing Strategy**

- **Standalone API Testing** (`src/api/standalone/`): Pure API tests against restful-booker
  - Authentication token management
  - Booking CRUD operations
  - Unauthorized access validation
- **Backend API Validation** (`src/api/backend/`): API calls to validate UI actions
  - User account verification
  - Cart state validation
  - Order confirmation checks

**✅ Three-Layer Testing Architecture**

- **UI Testing Layer**: Page Object Model with component-based design
- **Standalone API Layer**: Independent API endpoint testing
- **Backend API Layer**: UI action validation through API calls
- **Separate Project Configs**: Independent timeout and execution settings for each domain

**✅ Advanced Configuration Management**

- Centralized HTTP status codes (`httpStatus.ts`)
- Environment-specific configurations for multiple APIs
- BaseURL management through Playwright config
- No hardcoded values in test code

**✅ Quality Assurance Tools**

- **ESLint 9.39**: Strict TypeScript linting rules
- **Prettier 3.7**: Automated code formatting with best practices
- **Husky 9.1**: Pre-commit hooks for quality gates
- **TypeScript 5.6**: Full type safety and IntelliSense

**✅ Production-Ready CI/CD**

- GitHub Actions workflow with matrix execution
- Allure report generation with historical data
- Branch-specific report deployment to GitHub Pages
- Automatic artifact retention and cleanup

### Test Coverage

| Category                 | Tests  | Description                              |
| ------------------------ | ------ | ---------------------------------------- |
| **Standalone API Tests** | 13     | Auth tokens, booking CRUD, unauthorized  |
| **Backend API Tests**    | 5      | User management for UI validation        |
| **UI Tests**             | 16     | Authentication, Cart, Checkout, Products |
| **Total**                | **34** | Full coverage across all domains         |

**Test Execution Time**: ~10-12 minutes (full suite with all projects)

## 🏗️ Architecture

### Design Principles

The framework follows **SOLID principles** and industry-standard design patterns:

```
┌─────────────────────────────────────────────────────────────┐
│                     Test Layer (Specs)                      │
│  • UI Tests (authentication, cart, checkout, products)      │
│  • Standalone API Tests (restful-booker CRUD)               │
│  • Backend API Tests (automationexercise validation)        │
└────────────────┬────────────────────────────────────────────┘
                 │
    ┌────────────┴──────────────────────┐
    │                                   │
┌───▼─────────────┐  ┌─────────────────▼──────────────────┐
│   UI Layer      │  │         API Layer                  │
│                 │  │                                    │
│ • Page Objects  │  │ • Standalone Services (restful-   │
│ • Components    │  │   booker: auth, booking)          │
│ • BasePage      │  │ • Backend Services (automation    │
│                 │  │   exercise: user, product)        │
│                 │  │ • Base API Clients (2 domains)    │
└───┬─────────────┘  └────────┬───────────────────────────┘
    │                         │
    └────────────┬────────────┘
                 │
        ┌────────▼─────────┐
        │  Shared Layer    │
        │                  │
        │ • Fixtures       │
        │ • Config         │
        │ • Utilities      │
        │ • Status Codes   │
        └──────────────────┘
```

### Key Patterns Implemented

#### 1. **Page Object Model (POM)**

```typescript
// Base abstraction
export abstract class BasePage {
  protected readonly page: Page;
  constructor(page: Page) {
    this.page = page;
  }

  async navigateTo(path: string): Promise<void> {
    await this.page.goto(path);
  }
}

// Feature implementation
export class AuthenticationPage extends BasePage {
  readonly loginButton: Locator;

  constructor(page: Page) {
    super(page);
    this.loginButton = page.getByRole('button', { name: 'Login' });
  }

  async login(email: string, password: string): Promise<void> {
    // Implementation
  }
}
```

#### 2. **Component Pattern**

```typescript
export class CookieConsentComponent extends BaseComponent {
  readonly acceptAllButton: Locator;

  async handleCookieConsent(): Promise<void> {
    // Reusable component logic
  }
}
```

#### 3. **Service Layer Pattern (API)**

```typescript
export class UserService extends BaseApiClient {
  async createUser(userData: UserData): Promise<APIResponse> {
    return await this.post('/createAccount', { data: userData });
  }

  async verifyLogin(email: string, password: string): Promise<APIResponse> {
    return await this.post('/verifyLogin', {
      data: { email, password },
    });
  }
}
```

#### 4. **Factory Pattern**

```typescript
export class UserDataFactory {
  static generateUniqueUserData(): UserData {
    const timestamp = Date.now();
    return {
      name: `TestUser${timestamp}`,
      email: `testuser_${timestamp}@automation.test`,
      password: `SecurePass${timestamp}!`,
      // ...
    };
  }
}
```

#### 5. **Dependency Injection (Fixtures)**

```typescript
export const uiFixtures = test.extend<{
  authenticationPage: AuthenticationPage;
  uniqueUserData: UserData;
}>({
  authenticationPage: async ({ page }, use) => {
    await use(new AuthenticationPage(page));
  },
  uniqueUserData: async ({}, use) => {
    await use(UserDataFactory.generateUniqueUserData());
  },
});
```

---

## 📁 Project Structure

```
playwright-typescript-automation-framework/
│
├── .github/
│   ├── workflows/
│   │   └── playwright.yml              # CI/CD pipeline configuration
│   ├── instructions/                   # Development guidelines and patterns
│   └── agents/                         # AI agent configurations
│
├── src/
│   ├── api/                           # API Testing Layer
│   │   ├── standalone/                # Standalone API Testing (restful-booker)
│   │   │   ├── base/
│   │   │   │   └── baseApiClient.service.ts   # HTTP client for standalone APIs
│   │   │   ├── services/
│   │   │   │   ├── auth.service.ts            # Authentication service
│   │   │   │   └── booking.service.ts         # Booking CRUD service
│   │   │   ├── tests/
│   │   │   │   ├── auth/
│   │   │   │   │   └── auth.spec.ts           # Auth tests (4 tests)
│   │   │   │   └── booking/
│   │   │   │       └── booking.spec.ts        # Booking tests (9 tests)
│   │   │   ├── fixtures/
│   │   │   │   └── apiFixtures.ts             # Standalone API fixtures
│   │   │   ├── utils/
│   │   │   │   └── bookingDataFactory.ts      # Booking data generator
│   │   │   └── data/
│   │   │       └── types.ts                   # Booking type definitions
│   │   │
│   │   ├── backend/                   # Backend API (automationexercise.com)
│   │   │   ├── base/
│   │   │   │   └── baseApiClient.service.ts   # HTTP client with CSRF handling
│   │   │   ├── services/
│   │   │   │   ├── user.service.ts            # User API endpoints
│   │   │   │   └── product.service.ts         # Product API endpoints
│   │   │   ├── tests/
│   │   │   │   └── user/
│   │   │   │       └── user.spec.ts           # User API tests (5 tests)
│   │   │   ├── fixtures/
│   │   │   │   └── backendFixtures.ts         # Backend API fixtures
│   │   │   ├── utils/                         # Backend-specific utilities
│   │   │   └── data/                          # Backend test data builders
│   │   │
│   │   └── base/                      # Shared API utilities
│   │       └── httpStatus.ts          # Centralized status codes (HttpStatus, ResponseCode)
│   │
│   ├── ui/                            # UI Testing Layer
│   │   ├── po/                        # Page Objects
│   │   │   ├── base/
│   │   │   │   ├── basePage.page.ts       # Abstract base page
│   │   │   │   └── baseComponent.component.ts  # Abstract base component
│   │   │   ├── components/
│   │   │   │   ├── common/
│   │   │   │   │   └── navbar.component.ts     # Navbar (singleton)
│   │   │   │   └── cookieConsent.component.ts  # Cookie consent handler
│   │   │   ├── authentication/
│   │   │   │   └── authentication.page.ts      # Login/signup page
│   │   │   ├── cart/
│   │   │   │   └── cart.page.ts               # Shopping cart page
│   │   │   ├── checkout/
│   │   │   │   └── checkout.page.ts           # Checkout page
│   │   │   └── products/
│   │   │       └── products.page.ts           # Product listing page
│   │   ├── tests/
│   │   │   ├── authentication/
│   │   │   │   └── authentication.spec.ts     # Auth tests (9 tests)
│   │   │   ├── cart/
│   │   │   │   └── cartManagement.spec.ts     # Cart tests (3 tests)
│   │   │   ├── checkout/
│   │   │   │   └── orderCompletion.spec.ts    # Checkout tests (3 tests)
│   │   │   └── products/
│   │   │       └── products.spec.ts           # Product tests (1 test)
│   │   ├── fixtures/
│   │   │   └── uiFixtures.ts          # UI test fixtures
│   │   ├── utils/                     # UI-specific utilities
│   │   └── data/
│   │       └── testData.ts            # UI test data and constants
│   │
│   └── shared/                        # Shared Resources
│       ├── config/
│       │   ├── environment.ts         # Environment configuration
│       │   └── environments.ts        # Multi-environment settings
│       ├── utils/
│       │   ├── userDataFactory.ts     # User data generator
│       │   ├── paymentDataFactory.ts  # Payment data generator
│       │   └── testDataCleanup.util.ts # Test data cleanup utilities
│       └── data/
│           └── types.ts               # Shared type definitions
│
├── playwright.config.ts               # Playwright configuration (3 projects: api-standalone, api-backend, ui)
├── tsconfig.json                      # TypeScript compiler configuration
├── package.json                       # Dependencies and scripts
├── eslint.config.mjs                  # ESLint configuration
├── .prettierrc                        # Prettier configuration (TypeScript best practices)
├── .prettierignore                    # Prettier ignore patterns
└── README.md                          # This file
```

### File Count Summary

| Category                   | Count | Description            |
| -------------------------- | ----- | ---------------------- |
| **Total TypeScript Files** | 28    | All `.ts` files        |
| **Test Spec Files**        | 5     | `*.spec.ts` files      |
| **Page Objects**           | 5     | Feature-specific pages |
| **Components**             | 2     | Reusable UI components |
| **Services**               | 2     | API service classes    |
| **Fixtures**               | 2     | UI & API fixtures      |

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

| Script                | Description                                 | Usage                         |
| --------------------- | ------------------------------------------- | ----------------------------- |
| `test`                | Run all tests (UI + API)                    | `npm test`                    |
| `test:ui`             | Run UI tests only                           | `npm run test:ui`             |
| `test:api`            | Run all API tests (standalone + backend)    | `npm run test:api`            |
| `test:api:standalone` | Run standalone API tests (restful-booker)   | `npm run test:api:standalone` |
| `test:api:backend`    | Run backend API tests (automation exercise) | `npm run test:api:backend`    |
| `test:headed`         | Run tests in headed mode                    | `npm run test:headed`         |
| `test:debug`          | Run tests in debug mode                     | `npm run test:debug`          |
| `test:smoke`          | Run smoke tests only                        | `npm run test:smoke`          |
| `test:regression`     | Run regression tests only                   | `npm run test:regression`     |
| `lint`                | Run ESLint code analysis                    | `npm run lint`                |
| `lint:fix`            | Fix auto-fixable ESLint issues              | `npm run lint:fix`            |
| `format`              | Format code with Prettier                   | `npm run format`              |
| `format:check`        | Check code formatting                       | `npm run format:check`        |
| `report`              | Open HTML test report                       | `npm run report`              |
| `allure:generate`     | Generate Allure report                      | `npm run allure:generate`     |
| `allure:open`         | Open Allure report                          | `npm run allure:open`         |

---

## 🛠️ Technical Stack

### Core Framework

| Technology     | Version | Purpose                            |
| -------------- | ------- | ---------------------------------- |
| **Playwright** | 1.57.0  | Browser automation and API testing |
| **TypeScript** | 5.6.3   | Type-safe development              |
| **Node.js**    | 18+ LTS | Runtime environment                |

### Quality Assurance Tools

| Tool                  | Version | Purpose                            |
| --------------------- | ------- | ---------------------------------- |
| **ESLint**            | 9.39.1  | Code linting and style enforcement |
| **Prettier**          | 3.7.4   | Code formatting                    |
| **Husky**             | 9.1.7   | Git hooks (pre-commit)             |
| **TypeScript ESLint** | 8.13.0  | TypeScript-specific linting rules  |

### Reporting & CI/CD

| Tool               | Version  | Purpose                              |
| ------------------ | -------- | ------------------------------------ |
| **Allure**         | 3.4.3    | Advanced test reporting with history |
| **GitHub Actions** | -        | CI/CD pipeline execution             |
| **JUnit Reporter** | Built-in | Test result publishing               |

### Key Dependencies

```json
{
  "@playwright/test": "^1.57.0",
  "@playwright/mcp": "^0.0.49",
  "allure-playwright": "^3.4.3",
  "typescript": "^5.6.3",
  "eslint": "^9.39.1",
  "prettier": "^3.7.4",
  "husky": "^9.1.7"
}
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:

- **Node.js** 18.x or higher ([Download](https://nodejs.org/))
- **npm** 8.x or higher (comes with Node.js)
- **Git** 2.30+ ([Download](https://git-scm.com/))

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/DobrosiGergo/playwright-typescript-automation-framework.git
cd playwright-typescript-automation-framework

# 2. Install dependencies
npm ci

# 3. Install Playwright browsers
npx playwright install --with-deps

# 4. Verify installation
npm run test:list
```

### Environment Setup

The framework uses `baseURL` configuration from `playwright.config.ts`:

```typescript
const config = {
  api: {
    baseUrl: process.env.API_BASE_URL || 'https://automationexercise.com/api',
  },
  ui: {
    baseUrl: process.env.UI_BASE_URL || 'https://automationexercise.com',
  },
  timeouts: {
    apiTest: 60000, // 60 seconds for API tests
    e2eTest: 90000, // 90 seconds for UI tests
  },
};
```

**Optional**: Create `.env` file for custom configuration:

```bash
API_BASE_URL=https://your-api-endpoint.com/api
UI_BASE_URL=https://your-ui-endpoint.com
```

---

## 🧪 Running Tests

### Quick Start

```bash
# Run all tests (API + UI)
npm test

# Run with headed browser
npm run test:headed

# Run in debug mode
npm run test:debug
```

### Project-Specific Execution

```bash
# API tests only (60s timeout)
npm run test:api

# UI tests only (90s timeout)
npm run test:ui
```

### Tag-Based Execution

```bash
# Critical tests only (all projects)
npm run test:critical

# API critical tests
npm run test:api:critical

# UI smoke tests
npm run test:ui:smoke

# UI critical tests
npm run test:ui:critical

# Regression tests
npm run test:regression
```

### Test Listing

```bash
# List all tests
npm run test:list

# List smoke tests
npm run test:list:smoke

# List critical tests
npm run test:list:critical
```

### Viewing Reports

```bash
# Open Playwright HTML report
npm run report

# Generate Allure report
npm run allure:generate

# Open Allure report (after generation)
npm run allure:open

# Serve Allure report (generate + open)
npm run allure:serve
```

---

## ⚙️ Configuration

### Playwright Configuration

The framework uses **two separate projects** for API and UI testing:

```typescript
// playwright.config.ts
export default defineConfig({
  projects: [
    {
      name: 'api',
      testDir: './src/api/tests',
      testMatch: '**/*.spec.ts',
      timeout: 60000, // 60 seconds
      fullyParallel: true, // Parallel execution
      use: {
        baseURL: config.api.baseUrl,
      },
    },
    {
      name: 'ui',
      testDir: './src/ui/tests',
      testMatch: '**/*.spec.ts',
      timeout: 90000, // 90 seconds
      fullyParallel: false, // Sequential execution
      use: {
        ...devices['Desktop Chrome'],
        baseURL: config.ui.baseUrl,
        actionTimeout: 30000,
        navigationTimeout: 30000,
      },
    },
  ],
});
```

### ESLint Configuration

```javascript
// eslint.config.mjs
export default [
  {
    files: ['**/*.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
        },
      ],
      'no-console': 'off', // Allowed in test automation
    },
  },
];
```

### Prettier Configuration

```json
{
  "semi": true,
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "trailingComma": "all",
  "bracketSpacing": true,
  "arrowParens": "always",
  "endOfLine": "auto"
}
```

### TypeScript Configuration

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "types": ["node", "@playwright/test"]
  },
  "include": ["src/**/*", "playwright.config.ts"],
  "exclude": ["node_modules", "test-results", "playwright-report"]
}
```

---

## 📊 Reporting

### Built-in Playwright Report

Automatically generated after test execution:

```bash
npm run report
```

Features:

- Test execution timeline
- Screenshots on failure
- Video recordings (on failure)
- Trace files for debugging
- Filterable by status/browser

### Allure Report

Advanced reporting with historical data:

```bash
# Generate report
npm run allure:generate

# Open report in browser
npm run allure:open
```

Features:

- **Test History & Trends**: Track test stability over time
- **Flaky Test Detection**: Identify unstable tests
- **Execution Timeline**: Visual execution flow
- **Categories**: Group tests by behavior
- **Attachments**: Screenshots, traces, logs
- **Retries**: Track test retry attempts

### CI/CD Reports

GitHub Actions automatically:

1. Runs all tests on push to `gergo_test_branch`
2. Generates Allure report with history
3. Deploys to GitHub Pages (branch-specific)
4. Publishes JUnit test results

**Live Report**: [View Latest Allure Report](https://dobrosigergo.github.io/playwright-typescript-automation-framework/gergo_test_branch-allure-report/)

---

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow

Located at `.github/workflows/playwright.yml`

#### Trigger Events

```yaml
on:
  push:
    branches: [main, master, gergo_test_branch]
  pull_request:
    branches: [main, master]
  schedule:
    - cron: '0 3 * * 0' # Weekly cleanup on Sundays
```

#### Pipeline Stages

```
┌─────────────────┐
│  1. Setup       │  Checkout, Node.js, Install deps, Playwright browsers
└────────┬────────┘
         │
┌────────▼────────┐
│  2. History     │  Restore Allure history from gh-pages
└────────┬────────┘
         │
┌────────▼────────┐
│  3. Test        │  Run Playwright tests (continue-on-error)
└────────┬────────┘
         │
┌────────▼────────┐
│  4. Report      │  Generate Allure report with history
└────────┬────────┘
         │
┌────────▼────────┐
│  5. Artifacts   │  Upload Playwright & Allure reports
└────────┬────────┘
         │
┌────────▼────────┐
│  6. Deploy      │  Deploy to GitHub Pages (branch-specific)
└─────────────────┘
```

#### Key Features

- **Branch-Specific Deployments**: Each branch gets its own report URL
- **History Persistence**: Test history saved in `gh-pages` branch
- **Artifact Retention**: 30 days for reports, 1 day for deployment packages
- **Parallel Execution**: API tests run in parallel
- **Automatic Cleanup**: Weekly history cleanup on Sundays

#### Environment URLs

Each branch deploys to:

```
https://dobrosigergo.github.io/playwright-typescript-automation-framework/{branch-name}-allure-report/
```

Example:

```
https://dobrosigergo.github.io/playwright-typescript-automation-framework/gergo_test_branch-allure-report/
```

---

## 👨‍💻 Development Guidelines

### Code Quality Standards

All code must pass these checks before commit:

```bash
# Lint check
npm run lint

# Format check
npm run format

# Run all checks
npm run lint && npm run format && npm test
```

**Husky** automatically runs these on `pre-commit`.

### Writing Tests

#### UI Test Example

```typescript
import { test, expect } from '../../fixtures/uiFixtures';

test.describe('Feature @smoke @critical', () => {
  test('should perform action successfully', async ({ featurePage, uniqueUserData }) => {
    await test.step('Navigate to feature page', async () => {
      await featurePage.navigateTo('/feature');
    });

    await test.step('Perform action', async () => {
      await featurePage.performAction(uniqueUserData);
      await expect(featurePage.successMessage).toBeVisible();
    });
  });
});
```

#### API Test Example

```typescript
import { test, expect } from '../../fixtures/apiFixtures';
import { HttpStatus, ResponseCode } from '../../base/httpStatus';

test.describe('API Endpoint @api @critical', () => {
  test('should return expected response', async ({ userService, uniqueUserData }) => {
    await test.step('Call API endpoint', async () => {
      const response = await userService.createUser(uniqueUserData);

      expect(response.status()).toBe(HttpStatus.OK);

      const body = await response.json();
      expect(body.responseCode).toBe(ResponseCode.CREATED);
    });
  });
});
```

### Best Practices

1. **Never use explicit timeouts** - Rely on Playwright's auto-wait
2. **Centralize selectors** - Always use page objects or components
3. **Use fixtures for DI** - Inject dependencies, don't instantiate in tests
4. **Tag your tests** - Use `@smoke`, `@critical`, `@regression` tags
5. **Test steps** - Wrap logical steps with `test.step()`
6. **Status codes** - Use `HttpStatus` and `ResponseCode` constants
7. **Data factories** - Generate unique test data with factories
8. **Cleanup** - Always clean up test data in `afterEach` or `afterAll`

### Common Patterns

#### Using Centralized Status Codes

```typescript
// ✅ Good
expect(response.status()).toBe(HttpStatus.OK);
expect(body.responseCode).toBe(ResponseCode.CREATED);

// ❌ Bad
expect(response.status()).toBe(200);
expect(body.responseCode).toBe(201);
```

#### Using BaseURL

```typescript
// ✅ Good
await page.goto('/login');
await authPage.navigateTo('/signup');

// ❌ Bad
await page.goto('https://automationexercise.com/login');
```

#### Component Reusability

```typescript
// Navbar component used across multiple pages
export class HomePage extends BasePage {
  constructor(page: Page) {
    super(page);
    this.navbar = new NavbarComponent(page);
  }

  async navigateToProducts(): Promise<void> {
    await this.navbar.goToProducts();
  }
}
```

---

## 📦 Available NPM Scripts

| Script                    | Description                         |
| ------------------------- | ----------------------------------- |
| `npm test`                | Run all tests (API + UI)            |
| `npm run test:api`        | Run API tests only                  |
| `npm run test:ui`         | Run UI tests only                   |
| `npm run test:critical`   | Run critical tagged tests           |
| `npm run test:smoke`      | Run smoke tagged tests              |
| `npm run test:regression` | Run regression tagged tests         |
| `npm run test:headed`     | Run tests with visible browser      |
| `npm run test:debug`      | Run tests in debug mode             |
| `npm run report`          | Open Playwright HTML report         |
| `npm run allure:generate` | Generate Allure report              |
| `npm run allure:open`     | Open Allure report                  |
| `npm run allure:serve`    | Generate and serve Allure report    |
| `npm run lint`            | Check code with ESLint              |
| `npm run lint:fix`        | Fix ESLint issues automatically     |
| `npm run format`          | Check code formatting with Prettier |
| `npm run format:fix`      | Fix formatting issues automatically |
| `npm run test:list`       | List all tests without running      |

---

## 📚 Additional Resources

- **Playwright Documentation**: https://playwright.dev/docs/intro
- **TypeScript Handbook**: https://www.typescriptlang.org/docs/
- **Allure Framework**: https://docs.qameta.io/allure/
- **Target Application**: https://automationexercise.com/
- **GitHub Repository**: https://github.com/DobrosiGergo/playwright-typescript-automation-framework

---

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Follow development guidelines and coding standards
4. Run quality checks: `npm run lint && npm run format && npm test`
5. Commit changes (`git commit -m 'Add amazing feature'`)
6. Push to branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

---

**Built with ❤️ using Playwright + TypeScript**
},
staging: {
baseUrl: 'https://staging.automationexercise.com/',
apiBaseUrl: 'https://staging.automationexercise.com/api',

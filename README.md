# 🎭 Playwright TypeScript Automation Framework

[![Playwright Tests](https://github.com/DobrosiGergo/playwright-typescript-automation-framework/actions/workflows/playwright.yml/badge.svg?branch=gergo_test_branch)](https://github.com/DobrosiGergo/playwright-typescript-automation-framework/actions)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6.3-blue.svg)](https://www.typescriptlang.org/)
[![Playwright](https://img.shields.io/badge/Playwright-1.57.0-green.svg)](https://playwright.dev/)
[![License](https://img.shields.io/badge/license-ISC-blue.svg)](LICENSE)

Enterprise-grade test automation framework built with **Playwright** and **TypeScript**, featuring **dual API testing strategies** (standalone + backend validation), centralized configuration management via `.env`, comprehensive CI/CD integration, and Allure reporting.

---

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
- [NPM Scripts](#-npm-scripts)
- [License](#-license)

---

## 🎯 Overview

### Framework Capabilities

**✅ Dual API Testing Strategy**

- **Standalone API Testing**: Pure API tests against restful-booker.herokuapp.com
  - Authentication token management
  - Booking CRUD operations
  - Unauthorized access validation
- **Backend API Validation**: API calls to validate UI actions on automationexercise.com
  - User account verification
  - Product data validation

**✅ Three-Layer Testing Architecture**

- **UI Testing Layer**: Page Object Model with component-based design
- **Standalone API Layer**: Independent API endpoint testing (restful-booker)
- **Backend API Layer**: UI action validation through API calls (automationexercise backend)
- **Separate Project Configs**: Three distinct Playwright projects (api-standalone, api-backend, ui) with independent timeout and execution settings

**✅ Advanced Configuration Management**

- **`.env` File Configuration**: All environment-specific values (URLs, timeouts, flags) managed via `.env`
- **Centralized HTTP Status Codes**: `httpStatus.ts` constants for status codes and response codes
- **BaseURL Management**: Through Playwright config loaded from environment variables
- **No Hardcoded Values**: All configurations externalized and documented

**✅ Quality Assurance Tools**

- **ESLint 9.39**: Strict TypeScript linting rules
- **Prettier 3.7**: Automated code formatting with TypeScript best practices
- **Husky 9.1**: Pre-commit hooks for quality gates
- **TypeScript 5.6**: Full type safety and IntelliSense
- **lint-staged**: Automatic linting and formatting on commit

**✅ Production-Ready CI/CD**

- GitHub Actions workflow with branch-based execution
- Allure report generation with historical data persistence
- Branch-specific report deployment to GitHub Pages
- Automatic artifact retention (30 days) and cleanup

---

### Test Coverage

| Category                 | Tests  | Description                              |
| ------------------------ | ------ | ---------------------------------------- |
| **Standalone API Tests** | 13     | Auth tokens, booking CRUD, unauthorized  |
| **Backend API Tests**    | 5      | User management for UI validation        |
| **UI Tests**             | 16     | Authentication, Cart, Checkout, Products |
| **Total**                | **34** | Full coverage across all domains         |

**Test Execution Time**: ~10-12 minutes (full suite with all projects)

---

## 🏗️ Architecture

### Design Principles

The framework follows **SOLID principles** and industry-standard design patterns:

```
┌──────────────────────────────────────────────────────────────┐
│                      Test Layer (Specs)                      │
│  • UI Tests: authentication, cart, checkout, products        │
│  • Standalone API: restful-booker CRUD operations            │
│  • Backend API: automationexercise.com validation            │
└────────────────┬─────────────────────────────────────────────┘
                 │
    ┌────────────┴─────────────────┐
    │                              │
┌───▼──────────────┐  ┌────────────▼─────────────────────────┐
│   UI Layer       │  │         API Layer                    │
│                  │  │                                      │
│ • Page Objects   │  │ • Standalone Services (restful-     │
│ • Components     │  │   booker: auth, booking)            │
│ • BasePage       │  │ • Backend Services (automation      │
│ • BaseComponent  │  │   exercise: user, product)          │
│                  │  │ • Base API Clients (2 domains)      │
└───┬──────────────┘  └────────┬─────────────────────────────┘
    │                          │
    └────────────┬─────────────┘
                 │
        ┌────────▼──────────┐
        │   Shared Layer    │
        │                   │
        │ • Fixtures        │
        │ • Data Factories  │
        │ • Utilities       │
        │ • Type Definitions│
        └───────────────────┘
```

### Key Patterns Implemented

#### 1. **Page Object Model (POM)** - UI Layer

Encapsulates page structure and interactions in reusable classes.

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
  readonly loginForm: LoginFormComponent;

  constructor(page: Page) {
    super(page);
    this.loginForm = new LoginFormComponent(page);
  }

  async login(email: string, password: string): Promise<void> {
    await this.loginForm.fillAndSubmit(email, password);
  }
}
```

#### 2. **Component Pattern** - UI Layer

Reusable UI fragments shared across multiple pages.

```typescript
export class NavbarComponent extends BaseComponent {
  readonly productsLink: Locator;
  readonly cartLink: Locator;

  async goToProducts(): Promise<void> {
    await this.productsLink.click();
  }
}
```

#### 3. **Service Layer Pattern** - API Layer

Encapsulates API endpoints and business logic in service classes.

```typescript
export class BookingService extends BaseApiClient {
  async createBooking(bookingData: BookingData): Promise<APIResponse> {
    return await this.post('/booking', { data: bookingData });
  }

  async getBooking(id: number): Promise<APIResponse> {
    return await this.get(`/booking/${id}`);
  }
}
```

#### 4. **Factory Pattern** - Test Data

Generates dynamic, unique test data to prevent collisions.

```typescript
export class UserDataFactory {
  static generateUniqueUserData(): UserData {
    const timestamp = Date.now();
    return {
      name: `TestUser${timestamp}`,
      email: `testuser_${timestamp}@automation.test`,
      password: `SecurePass${timestamp}!`,
      // ... additional fields
    };
  }
}
```

#### 5. **Dependency Injection via Fixtures**

Centralized setup and teardown with clean dependency management.

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
│   │   └── playwright.yml                    # CI/CD pipeline configuration
│   ├── instructions/                         # Development guidelines
│   │   ├── allure_reporting_guide.instructions.md
│   │   ├── api_guide.instructions.md
│   │   ├── assertion_guide.instructions.md
│   │   ├── ci_cd_guide.instructions.md
│   │   ├── debugging_guide.instructions.md
│   │   ├── environment_management.instructions.md
│   │   ├── locator_strategy.instructions.md
│   │   ├── patterns_guide.instructions.md
│   │   └── test_data_management.instructions.md
│   └── copilot-instructions.md               # AI Copilot general playbook
│
├── docs/
│   ├── MCP_USAGE.md                          # Playwright MCP usage guide
│   ├── PROMPTS.md                            # AI prompt examples
│   └── TEST_HEALING.md                       # Test healing documentation
│
├── tests/
│   ├── api/                                  # API Testing Layer
│   │   ├── clients/                          # API service classes
│   │   │   ├── baseApiClient.service.ts      # Base HTTP client
│   │   │   ├── auth.service.ts               # Authentication service (standalone)
│   │   │   ├── booking.service.ts            # Booking service (standalone)
│   │   │   ├── user.service.ts               # User service (backend)
│   │   │   └── product.service.ts            # Product service (backend)
│   │   ├── data/                             # Test data and factories
│   │   │   ├── bookingDataFactory.ts         # Booking data generator
│   │   │   └── types.ts                      # Type definitions
│   │   ├── specs/                            # API test specs
│   │   │   ├── standalone/                   # Restful-booker tests
│   │   │   │   ├── auth.spec.ts              # Auth tests (4 tests)
│   │   │   │   └── booking/
│   │   │   │       └── booking.spec.ts       # Booking tests (9 tests)
│   │   │   └── backend/                      # Automationexercise tests
│   │   │       └── user.spec.ts              # User tests (5 tests)
│   │   ├── apiFixtures.ts                    # Standalone API fixtures
│   │   └── backendFixtures.ts                # Backend API fixtures
│   │
│   ├── ui/                                   # UI Testing Layer
│   │   ├── po/                               # Page Objects
│   │   │   ├── base/
│   │   │   │   ├── basePage.page.ts          # Base page abstraction
│   │   │   │   └── baseComponent.component.ts # Base component abstraction
│   │   │   ├── components/                   # Reusable UI components
│   │   │   │   ├── common/
│   │   │   │   │   └── navbar.component.ts   # Navbar (singleton)
│   │   │   │   └── authentication/
│   │   │   │       ├── loginForm.component.ts
│   │   │   │       ├── signupForm.component.ts
│   │   │   │       ├── accountInfo.component.ts
│   │   │   │       ├── addressInfo.component.ts
│   │   │   │       ├── personalInfo.component.ts
│   │   │   │       └── registrationForm.component.ts
│   │   │   ├── authentication/
│   │   │   │   └── authentication.page.ts    # Login/signup page
│   │   │   ├── cart/
│   │   │   │   └── cart.page.ts              # Shopping cart page
│   │   │   ├── checkout/
│   │   │   │   └── checkout.page.ts          # Checkout page
│   │   │   └── products/
│   │   │       └── products.page.ts          # Product listing page
│   │   ├── specs/                            # UI test specs
│   │   │   ├── authentication/
│   │   │   │   └── authentication.spec.ts    # Auth tests (9 tests)
│   │   │   ├── cart/
│   │   │   │   └── cartManagement.spec.ts    # Cart tests (3 tests)
│   │   │   ├── checkout/
│   │   │   │   └── orderCompletion.spec.ts   # Checkout tests (3 tests)
│   │   │   └── products/
│   │   │       └── products.spec.ts          # Product tests (1 test)
│   │   ├── uiFixtures.ts                     # UI test fixtures
│   │   └── data/                             # UI test data
│   │
│   └── common/                               # Shared Resources
│       ├── data/
│       │   └── types.ts                      # Shared type definitions
│       └── utils/
│           ├── logger.util.ts                # Centralized logging utility
│           ├── userDataFactory.ts            # User data generator
│           └── paymentDataFactory.ts         # Payment data generator
│
├── playwright.config.ts                      # Playwright configuration (3 projects)
├── tsconfig.json                             # TypeScript compiler configuration
├── package.json                              # Dependencies and npm scripts
├── eslint.config.mjs                         # ESLint configuration
├── .prettierrc                               # Prettier configuration
├── .prettierignore                           # Prettier ignore patterns
├── .env.example                              # Environment variables template
└── README.md                                 # This file
```

---

## 🛠️ Technical Stack

### Core Framework

| Technology     | Version | Purpose                            |
| -------------- | ------- | ---------------------------------- |
| **Playwright** | 1.57.0  | Browser automation and API testing |
| **TypeScript** | 5.6.3   | Type-safe development              |
| **Node.js**    | 18+ LTS | Runtime environment                |

### Quality Assurance

| Tool                  | Version | Purpose                            |
| --------------------- | ------- | ---------------------------------- |
| **ESLint**            | 9.39.1  | Code linting and style enforcement |
| **Prettier**          | 3.7.4   | Code formatting                    |
| **Husky**             | 9.1.7   | Git hooks (pre-commit)             |
| **TypeScript ESLint** | 8.13.0  | TypeScript-specific linting rules  |
| **lint-staged**       | 16.2.7  | Run linters on staged files        |

### Reporting & CI/CD

| Tool               | Version  | Purpose                              |
| ------------------ | -------- | ------------------------------------ |
| **Allure**         | 3.4.3    | Advanced test reporting with history |
| **GitHub Actions** | -        | CI/CD pipeline execution             |
| **JUnit Reporter** | Built-in | Test result publishing               |

### Utilities

| Package               | Version | Purpose                         |
| --------------------- | ------- | ------------------------------- |
| **dotenv**            | 17.2.3  | Environment variable management |
| **@faker-js/faker**   | 10.2.0  | Test data generation            |
| **http-status-codes** | 2.3.0   | HTTP status code constants      |
| **rimraf**            | 6.0.1   | Cross-platform file deletion    |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ (LTS recommended) - [Download](https://nodejs.org/)
- **npm** 8+ (comes with Node.js)
- **Git** 2.30+ - [Download](https://git-scm.com/)

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
npm run lint && npm run format && npm run test:list
```

### Environment Configuration

The framework uses **`.env` file** for environment-specific configuration (best practice).

#### 1. Create your .env file

```bash
# Windows (PowerShell)
Copy-Item .env.example .env

# macOS/Linux
cp .env.example .env
```

#### 2. Configure settings

Edit `.env` to customize your environment:

```bash
# UI Testing
BASE_URL=https://automationexercise.com

# Backend API (for UI validation)
BACKEND_API_BASE_URL=https://automationexercise.com/api

# Standalone API (restful-booker)
RESTFUL_BOOKER_BASE_URL=https://restful-booker.herokuapp.com

# General Settings
TIMEOUT=30000
HEADLESS=true
BROWSER=chromium

# Test Configuration
SCREENSHOT_MODE=only-on-failure
VIDEO_MODE=retain-on-failure

# Logging
DEBUG_LOGGING=false
```

**Important Notes:**

- `.env` is git-ignored and contains your local configuration
- `.env.example` is committed as a template with empty values
- The framework loads `.env` automatically via `dotenv` in `playwright.config.ts`
- All environment variables are accessed via `process.env['VARIABLE_NAME']`
- Set `DEBUG_LOGGING=true` for verbose logging (info, debug, warnings)

---

## 🧪 Running Tests

### Quick Start

```bash
# Run all tests (API + UI)
npm test

# Run tests with headed browser
npm run test:headed

# Run in debug mode with Playwright Inspector
npm run test:debug
```

### Project-Specific Execution

```bash
# All API tests (standalone + backend)
npm run test:api

# Standalone API tests only (restful-booker)
npm run test:api:standalone

# Backend API tests only (automationexercise)
npm run test:api:backend

# UI tests only
npm run test:ui
```

### Tag-Based Execution

```bash
# Run smoke tests across all projects
npm run test:smoke

# Run critical tests across all projects
npm run test:critical

# Run regression tests
npm run test:regression

# Run navigation tests
npm run test:navigation

# UI smoke tests only
npm run test:ui:smoke

# UI critical tests only
npm run test:ui:critical

# API critical tests only
npm run test:api:critical
```

### Test Listing

```bash
# List all tests without running
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

# Generate and serve Allure report
npm run allure:serve
```

---

## ⚙️ Configuration

### Playwright Configuration

The framework uses **three separate projects** for granular control:

```typescript
// playwright.config.ts
export default defineConfig({
  projects: [
    {
      name: 'api-standalone',
      testDir: './tests/api/specs',
      testMatch: '**/standalone/**/*.spec.ts',
      timeout: 60000, // 60 seconds
      fullyParallel: true,
      use: {
        baseURL: process.env['RESTFUL_BOOKER_BASE_URL'],
      },
    },
    {
      name: 'api-backend',
      testDir: './tests/api/specs',
      testMatch: '**/backend/**/*.spec.ts',
      timeout: 60000, // 60 seconds
      fullyParallel: true,
      use: {
        baseURL: process.env['BACKEND_API_BASE_URL'],
      },
    },
    {
      name: 'ui',
      testDir: './tests/ui/specs',
      testMatch: '**/*.spec.ts',
      timeout: 60000, // 60 seconds (optimized)
      fullyParallel: false,
      use: {
        ...devices['Desktop Chrome'],
        baseURL: process.env['UI_BASE_URL'],
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
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
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
  "include": ["tests/**/*", "playwright.config.ts"],
  "exclude": ["node_modules", "test-results", "playwright-report"]
}
```

---

## 📊 Reporting

### Playwright HTML Report

Automatically generated after test execution with rich details.

```bash
npm run report
```

**Features:**

- Test execution timeline
- Screenshots on failure
- Video recordings (on failure)
- Trace files for debugging
- Filterable by status/browser/project

### Allure Report

Advanced reporting with historical trends and analytics.

```bash
# Generate report from test results
npm run allure:generate

# Open report in browser
npm run allure:open

# Generate and serve in one command
npm run allure:serve
```

**Features:**

- **Test History & Trends**: Track test stability over time
- **Flaky Test Detection**: Identify unstable tests
- **Execution Timeline**: Visual execution flow
- **Test Categories**: Group tests by behavior/tags
- **Attachments**: Screenshots, traces, logs, API responses
- **Retries Tracking**: Monitor test retry attempts
- **Suite Summary**: Pass/fail rates, duration trends

### CI/CD Reports

GitHub Actions automatically:

1. Executes all tests on push to monitored branches
2. Generates Allure report with historical data
3. Deploys to GitHub Pages (branch-specific URLs)
4. Publishes JUnit test results to workflow summary

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
┌──────────────────┐
│  1. Setup        │  Checkout code, setup Node.js, install dependencies
└────────┬─────────┘
         │
┌────────▼─────────┐
│  2. Browsers     │  Install Playwright browsers with dependencies
└────────┬─────────┘
         │
┌────────▼─────────┐
│  3. History      │  Restore Allure history from gh-pages branch
└────────┬─────────┘
         │
┌────────▼─────────┐
│  4. Tests        │  Execute Playwright tests (continue-on-error)
└────────┬─────────┘
         │
┌────────▼─────────┐
│  5. Reports      │  Generate Allure report with historical data
└────────┬─────────┘
         │
┌────────▼─────────┐
│  6. Artifacts    │  Upload Playwright HTML and Allure reports
└────────┬─────────┘
         │
┌────────▼─────────┐
│  7. Deploy       │  Deploy reports to GitHub Pages (branch-specific)
└──────────────────┘
```

#### Key Features

- **Branch-Specific Deployments**: Each branch gets its own report URL
- **History Persistence**: Test history retained across runs in gh-pages branch
- **Artifact Retention**: 30 days for reports, 1 day for deployment packages
- **Parallel Execution**: API tests run in parallel for speed
- **Automatic Cleanup**: Weekly history cleanup on Sundays at 3 AM UTC

#### Report URLs

Each branch deploys to:

```
https://dobrosigergo.github.io/playwright-typescript-automation-framework/{branch-name}-allure-report/
```

**Example**:

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

# Run all quality checks
npm run lint && npm run format && npm test
```

**Husky** automatically runs lint-staged on `pre-commit` to enforce quality gates.

### Writing Tests

#### UI Test Example

```typescript
import { test, expect } from '../../uiFixtures';

test.describe('User Authentication @smoke @critical', () => {
  test('should register new user successfully', async ({ authenticationPage, uniqueUserData }) => {
    await test.step('Navigate to signup page', async () => {
      await authenticationPage.navigateTo('/login');
    });

    await test.step('Register new user', async () => {
      await authenticationPage.signup(uniqueUserData);
      await expect(authenticationPage.accountCreatedMessage).toBeVisible();
    });
  });
});
```

#### API Test Example

```typescript
import { test, expect } from '../../apiFixtures';
import { HttpStatus, ResponseCode } from '../../../common/data/types';

test.describe('Booking API @api @critical', () => {
  test('should create booking successfully', async ({ bookingService, authToken }) => {
    await test.step('Create new booking', async () => {
      const bookingData = BookingDataFactory.generate();
      const response = await bookingService.createBooking(bookingData);

      expect(response.status()).toBe(HttpStatus.OK);
      const body = await response.json();
      expect(body).toHaveProperty('bookingid');
    });
  });
});
```

### Best Practices

1. **Never use manual waits** - Rely on Playwright's auto-wait mechanisms
2. **Centralize selectors** - Always use page objects or components, never direct selectors in specs
3. **Use fixtures for DI** - Inject dependencies cleanly, don't instantiate in test specs
4. **Tag tests appropriately** - Use `@smoke`, `@critical`, `@regression`, `@navigation`
5. **Wrap steps** - Use `test.step()` for logical grouping and better reporting
6. **Centralize status codes** - Use `HttpStatus` constants, never hardcode status codes
7. **Generate unique data** - Use data factories to prevent test data collisions
8. **Clean up resources** - Remove test data in `afterEach` or `afterAll` hooks when possible

### Common Patterns

#### Using Centralized Status Codes

```typescript
// ✅ Good - Uses constants
expect(response.status()).toBe(HttpStatus.OK);
expect(body.responseCode).toBe(ResponseCode.CREATED);

// ❌ Bad - Hardcoded values
expect(response.status()).toBe(200);
expect(body.responseCode).toBe(201);
```

#### Using BaseURL from Config

```typescript
// ✅ Good - Relative paths with baseURL
await page.goto('/login');
await authPage.navigateTo('/signup');

// ❌ Bad - Hardcoded full URLs
await page.goto('https://automationexercise.com/login');
```

#### Component Reusability

```typescript
// Navbar component reused across multiple pages
export class HomePage extends BasePage {
  readonly navbar: NavbarComponent;

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

## 📦 NPM Scripts

| Script                        | Description                                       |
| ----------------------------- | ------------------------------------------------- |
| `npm test`                    | Run all tests (API + UI)                          |
| `npm run test:ui`             | Run UI tests only                                 |
| `npm run test:api`            | Run all API tests (standalone + backend)          |
| `npm run test:api:standalone` | Run standalone API tests (restful-booker)         |
| `npm run test:api:backend`    | Run backend API tests (automationexercise)        |
| `npm run test:smoke`          | Run smoke tests across all projects               |
| `npm run test:critical`       | Run critical tests across all projects            |
| `npm run test:regression`     | Run regression tests                              |
| `npm run test:navigation`     | Run navigation tests                              |
| `npm run test:ui:smoke`       | Run UI smoke tests                                |
| `npm run test:ui:critical`    | Run UI critical tests                             |
| `npm run test:api:critical`   | Run API critical tests                            |
| `npm run test:headed`         | Run tests with visible browser                    |
| `npm run test:debug`          | Run tests in debug mode with Playwright Inspector |
| `npm run test:list`           | List all tests without running                    |
| `npm run test:list:smoke`     | List smoke tests                                  |
| `npm run test:list:critical`  | List critical tests                               |
| `npm run report`              | Open Playwright HTML report                       |
| `npm run allure:generate`     | Generate Allure report from results               |
| `npm run allure:open`         | Open Allure report in browser                     |
| `npm run allure:serve`        | Generate and serve Allure report                  |
| `npm run lint`                | Run ESLint code analysis                          |
| `npm run lint:fix`            | Fix auto-fixable ESLint issues                    |
| `npm run format`              | Check code formatting with Prettier               |
| `npm run format:fix`          | Fix formatting issues with Prettier               |
| `npm run setup`               | Install Playwright browsers                       |
| `npm run prepare`             | Install Husky git hooks (automatic post-install)  |

---

## 📚 Additional Resources

- **Playwright Documentation**: [https://playwright.dev/docs/intro](https://playwright.dev/docs/intro)
- **TypeScript Handbook**: [https://www.typescriptlang.org/docs/](https://www.typescriptlang.org/docs/)
- **Allure Framework**: [https://docs.qameta.io/allure/](https://docs.qameta.io/allure/)
- **UI Target Application**: [https://automationexercise.com/](https://automationexercise.com/)
- **API Target Application**: [https://restful-booker.herokuapp.com/](https://restful-booker.herokuapp.com/)
- **GitHub Repository**: [https://github.com/DobrosiGergo/playwright-typescript-automation-framework](https://github.com/DobrosiGergo/playwright-typescript-automation-framework)

---

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Follow development guidelines and coding standards
4. Run quality checks: `npm run lint && npm run format && npm test`
5. Commit changes: `git commit -m 'Add amazing feature'`
6. Push to branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

---

**Built with ❤️ using Playwright + TypeScript**
};
}
}

````

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
````

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

The framework uses a `.env` file for configuration management (best practice).

#### 1. Create your .env file

Copy the example file and customize as needed:

```bash
# Windows (PowerShell)
Copy-Item .env.example .env

# macOS/Linux
cp .env.example .env
```

#### 2. Configure your environment

Edit `.env` to customize settings:

```bash
# UI Testing
BASE_URL=https://automationexercise.com

# Backend API (for UI validation)
BACKEND_API_BASE_URL=https://automationexercise.com/api

# Standalone API (restful-booker)
RESTFUL_BOOKER_BASE_URL=https://restful-booker.herokuapp.com

# General Settings
TIMEOUT=30000
HEADLESS=true
BROWSER=chromium

# Test Configuration
SCREENSHOT_MODE=only-on-failure
VIDEO_MODE=retain-on-failure

# Logging
DEBUG_LOGGING=false
```

**Important**:

- `.env` is git-ignored and contains your local configuration
- `.env.example` is committed as a template (with empty values)
- The framework loads `.env` automatically via `dotenv` package in `playwright.config.ts`
- All environment variables are accessed directly via `process.env`

**Debug Logging**:
Set `DEBUG_LOGGING=true` in `.env` to enable verbose logging:

- Info messages
- Debug messages
- Warning messages
- Test step logging

Error messages are always logged regardless of the debug setting.

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

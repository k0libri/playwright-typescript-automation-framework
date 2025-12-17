# Playwright TypeScript Automation Framework

## 🚀 Complete E2E Testing Solution for AutomationExercise.com

This repository contains a comprehensive Playwright-based TypeScript automation framework designed for end-to-end testing of the [AutomationExercise.com](https://automationexercise.com/) website. It implements industry best practices with proper layered architecture, design patterns, and comprehensive test coverage.

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Features](#features)
- [User Stories Covered](#user-stories-covered)
- [Installation](#installation)
- [Usage](#usage)
- [Test Suites](#test-suites)
- [Design Patterns](#design-patterns)
- [API Endpoints](#api-endpoints)
- [Reporting](#reporting)
- [CI/CD Pipeline](#cicd-pipeline)
- [Project Structure](#project-structure)
- [Contributing](#contributing)

## 🎯 Overview

This framework provides:

- **144 comprehensive tests** across 7 test files
- **Cross-browser testing** (Chromium, Firefox, WebKit)
- **UI + API integration testing**
- **Layered architecture** with proper separation of concerns
- **Design patterns** implementation (Page Object Model, Factory, Builder, Dependency Injection)
- **Allure and HTML reporting**
- **CI/CD integration** with GitHub Actions
- **Code quality** enforcement (ESLint, Prettier, TypeScript)

## 🏗️ Architecture

```
src/
├── tests/
│   ├── ui/              # UI test specs
│   ├── api/             # API test specs
│   └── fixtures/        # Custom fixtures
├── pages/               # Page Object Model classes
├── services/            # API service classes
├── utils/               # Utility classes (Factory, Builder)
└── config/              # Configuration constants
```

### Layered Design

1. **Test Layer**: Test specifications using Playwright Test API
2. **Page Layer**: Page Object Model for UI interactions
3. **Service Layer**: API service classes with dependency injection
4. **Utility Layer**: Data factories and builders
5. **Configuration Layer**: Centralized constants and settings

## ✨ Features

### 🎨 Design Patterns Implemented

- **Page Object Model (POM)**: All UI interactions abstracted
- **Factory Pattern**: Test data generation
- **Builder Pattern**: Complex object construction
- **Dependency Injection**: Service layer decoupling
- **Fixture Pattern**: Cookie popup handling

### 🔒 Code Quality

- **TypeScript**: Strict typing with comprehensive interfaces
- **ESLint**: Code linting with custom rules
- **Prettier**: Consistent code formatting
- **Husky**: Pre-commit hooks

### 📊 Comprehensive Testing

- **UI Tests**: 15 user interface test cases
- **API Tests**: 20 backend API test cases
- **Integration Tests**: 8 UI+API integration scenarios
- **Negative Scenarios**: Security and edge case testing

## 📝 User Stories Covered

### ✅ Story 1: User Registration & Verification

- Register new user via UI
- Verify user creation via API
- Handle existing email scenarios
- Cookie consent management

### ✅ Story 2: Login & Cart Management

- User authentication via UI
- Add products to cart
- Verify cart contents via API
- Cart persistence across sessions

### ✅ Story 3: Complete Purchase Flow

- End-to-end checkout process
- Order confirmation
- Address verification
- Invoice download

### ✅ Story 4: Negative Scenarios

- Invalid login attempts
- SQL injection protection
- XSS prevention
- Empty cart handling
- Invalid payment details

### ✅ Story 5: Allure Report Generation

- Automated report generation
- CI/CD integration
- Artifact upload

### ✅ Story 6: Pipeline Quality Gates

- Linting enforcement
- Test execution
- Report artifact management

## ⚡ Installation

### Prerequisites

- Node.js (LTS version)
- npm or yarn

### Setup

```bash
# Clone repository
git clone https://github.com/k0libri/playwright-typescript-automation-framework.git
cd playwright-typescript-automation-framework

# Install dependencies
npm ci

# Install Playwright browsers
npm run install:browsers
```

## 🚀 Usage

### Running Tests

```bash
# Run all tests
npm test

# Run UI tests only
npm run test:ui

# Run API tests only
npm run test:api

# Run tests in headed mode
npm run test:headed

# Debug tests
npm run test:debug
```

### Code Quality

```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format:fix

# Check formatting
npm run format
```

### Reporting

```bash
# Generate and serve Allure report
npm run allure:serve

# Generate Allure report
npm run allure:generate

# View HTML report
npm run test:report
```

## 🧪 Test Suites

### UI Tests (`tests/ui/`)

#### Registration Tests (`registration.spec.ts`)

- **TC001**: Register new user successfully
- **TC002**: Handle existing email error
- **TC003**: Cookie consent popup handling

#### Login & Cart Tests (`login-and-cart.spec.ts`)

- **TC004**: Successful login with valid credentials
- **TC005**: Add products to cart and verify contents
- **TC006**: Update product quantity in cart
- **TC007**: Remove products from cart
- **TC008**: Cart persistence after login

#### Purchase Flow Tests (`purchase-flow.spec.ts`)

- **TC009**: Complete purchase flow - Register during checkout
- **TC010**: Complete purchase flow - Login before checkout
- **TC011**: Verify address details in checkout
- **TC012**: Order confirmation and invoice download

#### Negative Scenarios (`negative-scenarios.spec.ts`)

- **TC013-TC020**: Invalid inputs, security testing, error handling

### API Tests (`tests/api/`)

#### User API Tests (`user-api.spec.ts`)

- **API-001 to API-010**: User CRUD operations, authentication, validation

#### Product API Tests (`product-api.spec.ts`)

- **API-011 to API-020**: Product listing, search, categorization, data validation

#### Integration Tests (`integration.spec.ts`)

- **INT-001 to INT-008**: UI+API workflow combinations

## 🎨 Design Patterns

### Page Object Model

```typescript
export class HomePage {
  readonly page: Page;
  readonly productsLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productsLink = page.getByRole('link', { name: 'Products' });
  }

  async navigateToProducts() {
    await this.productsLink.click();
  }
}
```

### Factory Pattern

```typescript
export class UserFactory {
  static createRandomUser(): User {
    const timestamp = Date.now();
    return {
      name: `User${Math.random()}`,
      email: `testuser${timestamp}@test.com`,
      password: 'password123',
    };
  }
}
```

### Builder Pattern

```typescript
const address = new AddressBuilder()
  .withFirstName('John')
  .withLastName('Doe')
  .withCity('New York')
  .build();
```

### Dependency Injection

```typescript
export class UserService {
  constructor(private request: APIRequestContext) {}

  async createUser(user: User): Promise<any> {
    // Service implementation
  }
}
```

## 🔌 API Endpoints

### User Management

- `POST /api/createAccount`: Create new user
- `POST /api/verifyLogin`: Verify user credentials
- `DELETE /api/deleteAccount`: Delete user account
- `PUT /api/updateAccount`: Update user information
- `GET /api/getUserDetailByEmail`: Get user by email

### Product Management

- `GET /api/productsList`: Get all products
- `POST /api/searchProduct`: Search products
- `GET /api/brandsList`: Get all brands

## 📊 Reporting

### Allure Reports

Comprehensive test reporting with:

- Test execution results
- Step-by-step breakdowns
- Screenshots on failures
- Environment information
- Historical trends

### HTML Reports

Built-in Playwright HTML reports with:

- Test results overview
- Detailed test traces
- Screenshots and videos
- Performance metrics

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow

Automated pipeline that:

1. **Installs dependencies** and browsers
2. **Lints code** for quality standards
3. **Checks formatting** with Prettier
4. **Runs tests** across all browsers
5. **Generates reports** (Allure + HTML)
6. **Uploads artifacts** for review
7. **Fails on quality issues** (linting/test failures)

### Quality Gates

- ✅ ESLint passing
- ✅ Prettier formatting
- ✅ All tests passing
- ✅ TypeScript compilation

## 📁 Project Structure

```
playwright-typescript-automation-framework/
├── .github/
│   └── workflows/
│       └── playwright.yml          # CI/CD pipeline
├── config/
│   └── constants.ts                # Configuration constants
├── pages/
│   ├── HomePage.ts                 # Home page interactions
│   ├── LoginPage.ts                # Login/signup functionality
│   ├── ProductPage.ts              # Product details page
│   ├── CartPage.ts                 # Shopping cart management
│   └── CheckoutPage.ts             # Checkout process
├── services/
│   ├── UserService.ts              # User API operations
│   └── ProductService.ts           # Product API operations
├── tests/
│   ├── api/
│   │   ├── user-api.spec.ts        # User API tests
│   │   ├── product-api.spec.ts     # Product API tests
│   │   └── integration.spec.ts     # UI+API integration
│   ├── ui/
│   │   ├── registration.spec.ts    # User registration tests
│   │   ├── login-and-cart.spec.ts  # Login and cart tests
│   │   ├── purchase-flow.spec.ts   # Purchase workflow tests
│   │   └── negative-scenarios.spec.ts # Edge cases and security
│   └── fixtures/
│       ├── index.ts                # Custom test fixtures
│       └── cookieFixture.ts        # Cookie popup handling
├── utils/
│   ├── UserFactory.ts              # User data factory
│   └── AddressBuilder.ts           # Address builder pattern
├── playwright.config.ts            # Playwright configuration
├── tsconfig.json                   # TypeScript configuration
├── eslint.config.mjs               # ESLint configuration
├── package.json                    # Dependencies and scripts
└── README.md                       # This documentation
```

## 📈 Test Coverage Statistics

- **Total Tests**: 144 (across 3 browsers)
- **Unique Test Cases**: 48
- **UI Tests**: 15 test cases
- **API Tests**: 25 test cases
- **Integration Tests**: 8 test cases
- **Browser Coverage**: Chromium, Firefox, WebKit

### Test Categories

| Category        | Test Count | Description                      |
| --------------- | ---------- | -------------------------------- |
| Registration    | 3          | User signup and account creation |
| Authentication  | 5          | Login/logout functionality       |
| Cart Management | 8          | Shopping cart operations         |
| Purchase Flow   | 4          | End-to-end checkout process      |
| User API        | 10         | Backend user operations          |
| Product API     | 10         | Backend product operations       |
| Integration     | 8          | UI+API combined workflows        |

## 🛠️ Development

### Adding New Tests

1. **UI Tests**: Create in `tests/ui/` using page objects
2. **API Tests**: Create in `tests/api/` using service classes
3. **Integration**: Create in `tests/api/integration.spec.ts`

### Adding New Pages

1. Create page class in `pages/`
2. Implement page object pattern
3. Use proper locators and methods

### Adding New Services

1. Create service class in `services/`
2. Implement dependency injection
3. Define proper interfaces

## 🤝 Contributing

### Code Standards

- Follow TypeScript strict mode
- Use ESLint and Prettier
- Write comprehensive tests
- Document new features
- Follow existing patterns

### Pull Request Process

1. Fork the repository
2. Create feature branch
3. Implement changes
4. Run quality checks: `npm run lint && npm run format && npm test`
5. Submit pull request

## 📞 Support

For questions or issues:

- Create GitHub issue
- Review existing test cases
- Check CI/CD pipeline logs
- Review Allure reports

## 📄 License

ISC License - see LICENSE file for details.

---

**Built with** ❤️ **using Playwright, TypeScript, and modern testing practices**

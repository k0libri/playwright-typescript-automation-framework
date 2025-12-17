# Copilot Instructions for AI Agents

## Project Overview

This repository contains Playwright-based TypeScript automation frameworks for UI+API end-to-end testing. It supports layered architecture, design patterns, code quality tooling, and CI/CD integration for robust, maintainable test automation.

## Architecture & Key Files

- **Layered Structure**:
  - `tests/`: Test specs (API, UI, or combined)
    - `tests/fixtures/`: Custom Playwright fixtures extending page objects and base test context
    - `tests/fixtureHelpers/`: Reusable helper functions for fixtures (e.g., cookie handling)
    - `tests/test-data/`: Test data factories and builders (UserFactory, AddressBuilder, etc.)
  - `services/` or `api/`: Service layer for API calls (e.g., booking, auth)
  - `pages/`: Page Object Model for UI automation (HomePage, LoginPage, CartPage, etc.)
  - `utils/`: Utility functions (data builders, factories, helpers)
  - `config/`: Centralized configuration (endpoints, credentials, test data)
- **`playwright.config.ts`**: Main Playwright config (testDir, projects, retries, reporting, env vars)
- **`.github/workflows/playwright.yml`**: CI pipeline (test, lint, report upload)
- **Allure reporting**: Integrate via Playwright reporter config and CI artifact upload
- **ESLint, Prettier, Husky**: For linting, formatting, and pre-commit checks

## Developer Workflows

- **Install dependencies**: `npm ci`
- **Run tests locally**: `npx playwright test`
- **Run API tests**: Place specs in `tests/api/`, use service layer for requests
- **Run UI+API tests**: Place specs in `tests/ui/`, use page objects and API services
- **Install browsers**: `npx playwright install --with-deps`
- **Lint code**: `npx eslint .`
- **Format code**: `npx prettier --check .`
- **View Allure report**: `npx allure serve allure-results` (after test run)
- **View HTML report**: Open `playwright-report/index.html`
- **CI/CD**: On push/PR, pipeline runs tests, lints, and uploads Allure/HTML reports as artifacts. Pipeline fails on lint/test errors.

## Project-Specific Patterns

- **Layered Architecture**: Separate test, service/api, page object, utils, and config layers for maintainability and reuse.
- **Design Patterns**: Use Dependency Inversion for service/page layers, Builder/Factory for test data, Page Object Model for UI, Fixture pattern for test setup.
- **Custom Fixtures**: Extend Playwright's base test with custom fixtures in `tests/fixtures/index.ts`:
  - Page object fixtures (homePage, loginPage, cartPage, productPage, checkoutPage) auto-instantiated per test
  - Cookie consent handling automatically applied on first navigation via page fixture override
  - Import tests using `import { test, expect } from '../fixtures';` instead of `@playwright/test`
- **Test Structure**: Use custom `test` from fixtures. For API, use service classes; for UI, use injected page object fixtures and `test.step()` for logical grouping.
- **Cookie Handling**: Cookie consent popups handled automatically via `cookieHelper.ts` in `tests/fixtureHelpers/`
- **Test Data**: Use Factory and Builder patterns (UserFactory, AddressBuilder) in `tests/test-data/` for dynamic test data generation
- **Authentication**: Use `/auth` endpoint for token-based API tests. Store/reuse token in service layer.
- **Reporting**: Allure and HTML reporters enabled. Allure results uploaded in CI.
- **Code Quality**: ESLint, Prettier, Husky required. Pre-commit hooks block bad code.
- **CI Pipeline**: Runs tests, lints, uploads reports. Fails on any error.

## Integration Points

- **Playwright**: For browser and API automation
- **Allure**: For advanced reporting (`allure-playwright`)
- **ESLint, Prettier, Husky**: For code quality and git hooks
- **GitHub Actions**: For CI/CD, report upload, and pipeline enforcement

## Examples & User Stories

- **Booking API**:
  - Authenticate via `/auth` and use token for requests
  - Create, update, delete, and verify bookings
  - Validate unauthorized requests and error codes
- **E-commerce UI+API**:
  - Register user via UI, verify via API
  - Login, add products to cart, verify via API
  - Complete purchase, confirm order history
  - Test negative scenarios (invalid login, out-of-stock)

## Conventions

- Place API tests in `tests/api/`, UI tests in `tests/ui/`
- Import from custom fixtures: `import { test, expect } from '../fixtures';`
- Use injected page object fixtures in test signatures: `async ({ page, homePage, loginPage }) => {}`
- Use service classes for API, page object fixtures for UI
- Use factories/builders for test data (UserFactory.createRandomUser(), UserFactory.createValidUser())
- Group test steps with `test.step()` for clarity and better reporting
- Place reusable helpers in `tests/fixtureHelpers/` (e.g., cookie handling, authentication)
- Allure results must be generated and uploaded in CI
- Code must pass linting and formatting before commit/merge
- Update config, service/page layers, and fixtures for new endpoints/features

---

For more details, see [Playwright documentation](https://playwright.dev/docs/intro), [Allure Playwright](https://github.com/allure-framework/allure-js), and comments in `playwright.config.ts`.

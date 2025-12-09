# Playwright TypeScript Automation Framework

A structured, maintainable Playwright + TypeScript automation platform covering UI and API journeys, built with strict Page Object Model layering, fixtures, and tag-based execution.

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

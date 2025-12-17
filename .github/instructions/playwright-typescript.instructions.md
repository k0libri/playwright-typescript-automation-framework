---
description: 'Playwright test generation instructions'
applyTo: '**'
---

## Test Writing Guidelines

### Custom Fixtures and Helpers

- **Page Object Fixtures**: Page objects are automatically instantiated and injected via custom fixtures
  - Define fixtures in `tests/fixtures/index.ts`
  - Import via `import { test, expect } from '../fixtures';`
  - Access page objects in test signature: `async ({ homePage, loginPage, cartPage }) => {}`
- **Fixture Helpers**: Reusable functions for common test setup tasks
  - Place in `tests/fixtureHelpers/` directory
  - Example: `cookieHelper.ts` handles cookie consent popups automatically
  - Called automatically by fixture setup (e.g., page fixture override)
- **Test Data Factories**: Generate test data using Factory and Builder patterns
  - `UserFactory.createRandomUser()`: Generate unique user with random data
  - `UserFactory.createValidUser()`: Generate user with valid test credentials
  - `AddressBuilder`: Build address objects with fluent API
- **Cookie Consent**: Automatically handled on first page navigation via custom page fixture
  - No manual cookie handling needed in tests
  - Implementation in `tests/fixtureHelpers/cookieHelper.ts`

### Code Quality Standards

- **Locators**: Prioritize user-facing, role-based locators (`getByRole`, `getByLabel`, `getByText`, etc.) for resilience and accessibility. Use `test.step()` to group interactions and improve test readability and reporting.
- **Assertions**: Use auto-retrying web-first assertions. These assertions start with the `await` keyword (e.g., `await expect(locator).toHaveText()`). Avoid `expect(locator).toBeVisible()` unless specifically testing for visibility changes.
- **Timeouts**: Rely on Playwright's built-in auto-waiting mechanisms. Avoid hard-coded waits or increased default timeouts.
- **Clarity**: Use descriptive test and step titles that clearly state the intent. Add comments only to explain complex logic or non-obvious interactions.

### Test Structure

- **Imports**: Import from custom fixtures instead of Playwright directly:
  - `import { test, expect } from '../fixtures';` (for UI tests)
  - `import { test, expect } from '@playwright/test';` (for API-only tests)
- **Page Object Fixtures**: Use injected page objects in test signatures:
  - Available fixtures: `homePage`, `loginPage`, `cartPage`, `productPage`, `checkoutPage`
  - Example: `async ({ page, homePage, loginPage }) => {}`
- **Organization**: Group related tests for a feature under a `test.describe()` block.
- **Hooks**: Use `beforeEach` for setup actions common to all tests in a `describe` block (e.g., navigating to a page).
- **Test Steps**: Use `test.step()` to group logical actions and improve readability.
- **Titles**: Follow a clear naming convention, such as `TC###: Feature - Specific action or scenario`.

### File Organization

- **Location**: Store all test files in the `tests/` directory.
- **Naming**: Use the convention `<feature-or-page>.spec.ts` (e.g., `login.spec.ts`, `search.spec.ts`).
- **Scope**: Aim for one test file per major application feature or page.

### Assertion Best Practices

- **UI Structure**: Use `toMatchAriaSnapshot` to verify the accessibility tree structure of a component. This provides a comprehensive and accessible snapshot.
- **Element Counts**: Use `toHaveCount` to assert the number of elements found by a locator.
- **Text Content**: Use `toHaveText` for exact text matches and `toContainText` for partial matches.
- **Navigation**: Use `toHaveURL` to verify the page URL after an action.

## Example Test Structure

### Example 1: UI Test with Custom Fixtures

```typescript
import { test, expect } from '../fixtures';
import { UserFactory } from '../test-data/UserFactory';
import { BASE_URL } from '../../config/constants';

test.describe('User Registration Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
  });

  test('TC001: Should register a new user successfully', async ({ page, homePage, loginPage }) => {
    const newUser = UserFactory.createRandomUser();

    await test.step('Navigate to signup/login page', async () => {
      await homePage.navigateToSignupLogin();
      await expect(page).toHaveURL(/.*\/login/);
    });

    await test.step('Enter signup details', async () => {
      await loginPage.signup(newUser.name, newUser.email);
      await expect(page).toHaveURL(/.*\/signup/);
    });

    await test.step('Fill account information and create account', async () => {
      await loginPage.fillSignupForm(newUser);
      await expect(page.getByText('Account Created!')).toBeVisible();
    });

    await test.step('Continue and verify user is logged in', async () => {
      await page.getByRole('link', { name: 'Continue' }).click();
      await expect(homePage.logoutLink).toBeVisible();
    });

    await test.step('Cleanup: Delete created user', async () => {
      await homePage.deleteAccount();
    });
  });
});
```

### Example 2: API-Only Test

```typescript
import { test, expect } from '@playwright/test';

test.describe('Movie Search API', () => {
  test('Search for a movie by title', async ({ request }) => {
    const response = await request.get('/api/search?q=Garfield');
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.results).toHaveLength(1);
  });
});
```

## Test Execution Strategy

1. **Initial Run**: Execute tests with `npx playwright test --project=chromium`
2. **Debug Failures**: Analyze test failures and identify root causes
3. **Iterate**: Refine locators, assertions, or test logic as needed
4. **Validate**: Ensure tests pass consistently and cover the intended functionality
5. **Report**: Provide feedback on test results and any issues discovered

## Quality Checklist

Before finalizing tests, ensure:

- [ ] All locators are accessible and specific and avoid strict mode violations
- [ ] Tests are grouped logically and follow a clear structure
- [ ] Assertions are meaningful and reflect user expectations
- [ ] Tests follow consistent naming conventions
- [ ] Code is properly formatted and commented

## Pre-commit Validation

Before pushing code, ensure linting and formatting checks pass without errors:

- **Lint code**: `npx eslint .` — Verify no linting violations
- **Format code**: `npx prettier --check .` — Verify code formatting compliance
- **Auto-fix**: `npx prettier --write .` — Automatically fix formatting issues
- **Git hooks**: Husky pre-commit hooks enforce these checks and block commits with violations

Resolve all linting and formatting errors before submitting a pull request.

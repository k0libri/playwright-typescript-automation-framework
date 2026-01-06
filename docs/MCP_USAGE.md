# MCP (Model Context Protocol) Usage Guide

## Purpose

This document provides guidance on using Playwright's Model Context Protocol (MCP) capabilities for debugging, test development, and maintenance.

---

## What is MCP?

**Model Context Protocol (MCP)** is Playwright's debugging and development interface that allows AI assistants to:

- Navigate websites like a user
- Take page snapshots for analysis
- Identify optimal selectors
- Diagnose test failures
- Suggest improvements

---

## Current Status

**MCP Integration:** Manual exploration recommended

While this framework doesn't currently have automated MCP integration in the CI/CD pipeline, developers are encouraged to use Playwright's built-in tools for similar capabilities.

---

## Manual Alternatives to MCP

### 1. Playwright Codegen

Playwright's code generator provides interactive selector identification:

```powershell
# Launch codegen for selector exploration
npx playwright codegen https://automationexercise.com

# Launch codegen with specific browser
npx playwright codegen --browser=chromium https://automationexercise.com

# Launch codegen with custom viewport
npx playwright codegen --viewport-size=1280,720 https://automationexercise.com
```

**Use Cases:**

- Identify stable selectors before writing tests
- Explore dynamic elements and their attributes
- Validate selector uniqueness across page states
- Generate initial page object code

---

### 2. Playwright Inspector

Debug existing tests with step-through execution:

```powershell
# Run tests with inspector
$env:PWDEBUG=1; npx playwright test

# Run specific test with inspector
$env:PWDEBUG=1; npx playwright test tests/ui/specs/cart/cartManagement.spec.ts
```

**Features:**

- Step through test execution
- Inspect page state at each step
- Evaluate selectors in real-time
- View network requests and console logs

---

### 3. Playwright Trace Viewer

Analyze test execution traces after failures:

```powershell
# Generate trace (already enabled on failure in playwright.config.ts)
npx playwright test --trace=on

# View trace file
npx playwright show-trace test-results/<test-name>/trace.zip
```

**Capabilities:**

- Timeline view of test execution
- DOM snapshots at each step
- Network activity analysis
- Console logs and errors
- Action/assertion details

---

## Best Practices for Test Development

### Before Writing Tests

1. **Explore the Website**

   ```powershell
   # Use codegen to navigate and identify patterns
   npx playwright codegen https://automationexercise.com
   ```

2. **Identify Key Elements**
   - Use built-in locators (`getByRole`, `getByLabel`, `getByText`)
   - Avoid brittle selectors (auto-generated classes, nth-child)
   - Verify selector stability across page states

3. **Document Findings**
   - Note dynamic elements requiring parameterized selectors
   - Identify reusable components
   - Map user flows visually

### During Test Development

1. **Use Inspector for Debugging**

   ```powershell
   $env:PWDEBUG=1; npx playwright test <test-file>
   ```

2. **Validate Selectors**
   - Check selector uniqueness
   - Verify auto-wait behavior
   - Test across different viewport sizes

3. **Capture Traces on Failure**
   - Already configured: `trace: 'retain-on-failure'`
   - Review traces to diagnose issues

### After Test Failures

1. **Review Trace Files**

   ```powershell
   npx playwright show-trace test-results/<test-name>/trace.zip
   ```

2. **Analyze Failure Patterns**
   - Check for timing issues (race conditions)
   - Verify element visibility/state
   - Review network requests for API dependencies

3. **Update Selectors/Logic**
   - Use codegen to find updated selectors
   - Implement wait strategies if needed
   - Document changes in git commits

---

## Integration with AI-Assisted Development

### Current Workflow

1. **Manual Exploration**
   - Developer uses codegen/inspector to explore features
   - Documents findings in comments or notes

2. **AI-Assisted Code Generation**
   - Provide AI with:
     - Target URL
     - User flow description
     - Identified selectors (from codegen)
     - Expected outcomes

3. **Validation & Refinement**
   - Run generated tests
   - Use inspector to debug failures
   - Iterate with AI on improvements

### Example AI Prompt Pattern

```
I need to automate the cart checkout flow on https://automationexercise.com.

I've used codegen and identified these key elements:
- Product card: getByRole('link', { name: /Blue Top/ })
- Add to cart: getByRole('button', { name: 'Add to cart' })
- Proceed to checkout: getByRole('link', { name: 'Proceed To Checkout' })

Please generate a test that:
1. Navigates to products page
2. Adds "Blue Top" to cart
3. Proceeds to checkout
4. Verifies checkout page loads

Follow the Page Object Model pattern in tests/ui/po/
```

---

## Future MCP Integration Opportunities

### Potential Enhancements

1. **Automated Selector Healing**
   - Monitor selector failures in CI
   - Use MCP to suggest alternative selectors
   - Auto-generate PRs with fixes

2. **Visual Regression Integration**
   - Capture baseline screenshots via MCP
   - Automated comparison on PR
   - AI-assisted diff analysis

3. **Test Generation Pipeline**
   - Document user flows in plain English
   - MCP explores flows and generates initial tests
   - Human review and refinement

4. **Flakiness Detection**
   - Analyze trace files for timing patterns
   - MCP suggests stability improvements
   - Auto-implement wait strategies

---

## Recommended Tools Stack

| Tool             | Purpose                 | Command                                 |
| ---------------- | ----------------------- | --------------------------------------- |
| Codegen          | Selector identification | `npx playwright codegen <url>`          |
| Inspector        | Step-through debugging  | `$env:PWDEBUG=1; npx playwright test`   |
| Trace Viewer     | Post-failure analysis   | `npx playwright show-trace <trace.zip>` |
| UI Mode          | Interactive test runner | `npx playwright test --ui`              |
| VSCode Extension | Inline debugging        | Install "Playwright Test for VSCode"    |

---

## Example: Debugging a Flaky Test

### Scenario

Test `should add product to cart` fails intermittently.

### Investigation Steps

1. **Run with Inspector**

   ```powershell
   $env:PWDEBUG=1; npx playwright test tests/ui/specs/cart/cartManagement.spec.ts -g "should add product to cart"
   ```

2. **Observe Behavior**
   - Step through each action
   - Note: "Add to cart" button sometimes not visible immediately
   - Network tab shows delayed product data fetch

3. **Identify Root Cause**
   - Product card renders before data loads
   - Button becomes visible after ~200ms delay

4. **Proposed Fix**

   ```typescript
   // Before (flaky)
   await this.addToCartButton.click();

   // After (stable)
   await this.addToCartButton.waitFor({ state: 'visible' });
   await this.addToCartButton.click();
   ```

5. **Validate Fix**
   - Run test 10 times to confirm stability
   - Review trace to ensure consistent behavior

---

## Integration with Existing Framework

### Codegen Workflow

1. **Explore Feature**

   ```powershell
   npx playwright codegen https://automationexercise.com/products
   ```

2. **Export to TypeScript**
   - Codegen generates initial code
   - Extract selectors into page object
   - Extract actions into page methods
   - Extract data into factories

3. **Refactor to Pattern**

   ```typescript
   // Codegen output (raw)
   await page.getByRole('link', { name: 'Blue Top' }).click();

   // Refactored to POM
   export class ProductsPage extends BasePage {
     getProductCard(productName: string): Locator {
       return this.page.getByRole('link', { name: productName });
     }

     async selectProduct(productName: string): Promise<void> {
       await this.getProductCard(productName).click();
     }
   }
   ```

---

## Debugging Checklist

- [ ] Used codegen to validate selectors before writing tests?
- [ ] Ran tests with inspector to verify step-by-step behavior?
- [ ] Reviewed trace files for failed tests?
- [ ] Checked network tab for API dependencies?
- [ ] Verified element visibility/state at each action?
- [ ] Tested across different browsers (if applicable)?
- [ ] Ran tests multiple times to ensure stability?
- [ ] Documented any quirks or workarounds?

---

## Additional Resources

- [Playwright Codegen Docs](https://playwright.dev/docs/codegen)
- [Playwright Inspector Docs](https://playwright.dev/docs/inspector)
- [Playwright Trace Viewer Docs](https://playwright.dev/docs/trace-viewer)
- [Playwright Debugging Guide](https://playwright.dev/docs/debug)
- [VSCode Extension](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright)

---

**Last Updated:** January 6, 2026  
**Maintainer:** Project Team  
**Status:** Manual workflow established, automated MCP integration planned for future

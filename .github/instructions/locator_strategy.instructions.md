---
applyTo: '**'
---

````markdown
# Locator Strategy & Selector Patterns Guide

## Purpose

This guide defines best practices and required patterns for selecting elements in Playwright-based UI automation.  
It is referenced by Copilot and reviewers to ensure selectors are robust, maintainable, and consistent across the codebase.

**Always consult this guide before creating, updating, or reviewing locators in page objects, components, or tests.**

---

## Locator Strategy Principles

- **Centralize selectors:**  
  All selectors must be defined in page objects or components, never directly in test specs.

- **Prefer Playwright’s built-in locators:**  
  Use Playwright’s recommended locator methods (e.g., `getByRole`, `getByLabel`, `getByText`) as the primary source for selectors.  
  Only use custom attributes (e.g., `data-testid`, `aria-label`) if built-in locators are not suitable.

- **Fallback order:**  
  If no built-in locator is available, use:
  1. Custom attributes (`data-testid`, `aria-label`, etc.)
  2. [Text selectors](https://playwright.dev/docs/locators#text-selector) (for static, unique text)
  3. [CSS selectors](https://playwright.dev/docs/locators#css-selector) (only if above are not possible, and avoid brittle patterns)

- **Avoid anti-patterns:**
  - Never use auto-generated class names, IDs, or nth-child selectors.
  - Avoid long, deeply nested, or chained selectors that are hard to manage and likely to change.
  - Do not use inline selectors in test specs.

- **Parameterize dynamic selectors:**  
  For elements with dynamic content, use functions or builder methods to generate selectors.

- **Explore before writing:**  
  Before creating a selector, use Playwright MCP (codegen/inspector) to explore the website feature and DOM to identify the most stable and unique selector for the given task.

- **One locator per element:**  
  For clarity and maintainability, define only one locator per element—do not create multiple locators for the same element.

- **Follow DRY and KISS principles:**  
  Avoid duplication and keep selectors simple and readable.

---

## Selector Naming Conventions

- Use **camelCase** for selector variables in page objects/components.
- Name selectors after the element’s purpose, not its implementation.
  - Example: `submitButton`, `searchInput`, `cartItemList`
- For parameterized selectors, use descriptive function names.
  - Example: `getProductCard(productName: string)`

---

## Examples

### Good

```typescript
// In home.page.ts
import { Locator, Page } from '@playwright/test';
import { BasePage } from '../base/basePage.page';

export class HomePage extends BasePage {
  readonly searchInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    super(page);
    this.searchInput = page.getByRole('textbox', { name: 'Search' });
    this.submitButton = page.getByRole('button', { name: 'Submit' });
  }

  getProductCard(productName: string): Locator {
    return this.page.getByText(productName);
  }
}
```
````

### Bad

```typescript
// In home.spec.ts
const searchInput = page.locator('.sc-xyz-123 > input'); // ❌ Brittle, not centralized
await page.locator('button:nth-child(2)').click(); // ❌ Brittle, unclear intent
const submitBtn = page.locator('[data-testid="submit-btn"][data-role="main"][class*="random"]'); // ❌ Long, unstable selector
```

---

## Common Mistakes to Avoid

- Defining selectors directly in test specs.
- Using unstable or auto-generated attributes.
- Relying on visual position (e.g., nth-child).
- Duplicating selector definitions across files.
- Writing long, unmanageable selectors that are likely to change.

---

## Enforcement

- All selectors must be defined in page objects or components.
- Use Playwright’s built-in locator methods whenever possible.
- Review all new selectors for clarity, stability, and maintainability.
- **Before creating a locator, always use Playwright MCP/codegen/inspector to explore the DOM and select the most stable and unique attribute.**
- **Use only one locator per element for clarity and maintainability—do not define multiple locators for the same element.**
- **Centralize all selectors in page objects or components.**
- **Follow DRY and KISS principles when defining and using locators.**

---

## References

- [Playwright Locator Docs](https://playwright.dev/docs/locators)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Testing Library: Querying Elements](https://testing-library.com/docs/queries/about/)

---

**Reference this guide before every new locator implementation or review. Reliable selectors are key to stable automation!**

```

```

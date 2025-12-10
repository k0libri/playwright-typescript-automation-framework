---
applyTo: '**'
---

# Allure Reporting Guide

## Purpose

Define consistent usage of Allure reporting so that every test run produces clear, actionable artifacts.

---

## Fundamentals

- **Integration**
  - Configure the `allure-playwright` reporter in `playwright.config.ts`.
  - Ensure Allure CLI is available for generating reports (`npx allure generate`).

- **Labels & Stories**
  - Group tests with descriptive `test.describe` blocks (e.g., `test.describe('UI | Cart')`).
  - Use Allure labels when needed (`allure.label`, `allure.story`, `allure.epic`) inside test bodies or helpers.

- **Attachments**
  - UI: capture screenshots and traces on failure (`trace: 'retain-on-failure'` or `trace: 'on-first-retry'`).
  - API: attach request/response payloads (JSON) when asserts fail or during negative checks.
  - Use helper utilities (`allure.attachment`) for consistency.

- **Steps**
  - Wrap significant business actions in `allure.step` (e.g., “Add product to cart”, “Verify cart via API”).

---

## Recommended Hooks & Utilities

- Provide a helper in `shared/utils/reporting.util.ts` to standardize attachments (`attachJson`, `attachScreenshot`, `attachText`).
- In `test.afterEach`, automatically capture screenshots on failure:  
  `await test.info().attach('screenshot', { body: await page.screenshot(), contentType: 'image/png' });`

---

## CI & Artifacts

- After tests, generate the Allure report:  
  `npx allure generate --clean ./allure-results -o ./reports/allure`
- Upload `./reports/allure` as a CI artifact (alongside Playwright HTML reports if needed).
- Document report viewing in the README: `npx allure open reports/allure`.

---

## Checklist

- [ ] Are key test actions wrapped in Allure steps or labeled appropriately?
- [ ] Are failures documented with screenshots, traces, or response attachments?
- [ ] Does the CI pipeline generate and upload Allure report artifacts?
- [ ] Is the README updated with instructions for generating and viewing Allure reports?

Provide project context and coding guidelines that AI should follow when generating code, answering questions, or reviewing changes.

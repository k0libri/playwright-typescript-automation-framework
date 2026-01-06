---
applyTo: '**'
---

# Assertion & Validation Guide

## Purpose

This guide defines best practices for assertions and validations in UI and API automation.  
It is referenced by Copilot and reviewers to ensure tests are expressive, reliable, and free of false positives.

---

## Principles

- **No False Positives:**  
  All assertions must accurately reflect the intended outcome.  
  Never write tests that pass when the application is in an incorrect or unexpected state.

- **Soft Assertions Pattern:**  
  When a test step or test contains multiple assertions, all assertions except the last one MUST be soft assertions using `expect.soft()`.  
  The final assertion in each step/test must be a hard assertion to ensure the test fails if any assertion fails.  
  This pattern provides comprehensive failure reporting while preventing test continuation on critical failures.

- **Expressive & Clear:**  
  Assertions should clearly state what is being validated and why.  
  Use descriptive messages for custom assertions.

- **Consistency:**  
  Use the same assertion library and patterns throughout the project (e.g., Playwright's `expect`).

---

## Implementation Guidelines

- **Preferred Assertion Library:**  
  Use Playwright's built-in `expect` for all validations.

- **Soft Assertion Pattern (REQUIRED):**
  - **Multiple Assertions:** When a test step contains multiple `expect()` statements, convert all except the last one to `expect.soft()`.
  - **Single Assertion:** When a test step has only one assertion, use a hard assertion (`expect()`).
  - **Purpose:** Soft assertions collect all failures without stopping execution, while the final hard assertion ensures the test fails.
  - **Example:**
    `typescript
await test.step('Verify user details', async () => {
const response = await userService.getUserByEmail(email);
expect.soft(response.status()).toBe(StatusCodes.OK); // Soft - not last
const userData = await response.json();
expect.soft(userData).toHaveProperty('user'); // Soft - not last
expect.soft(userData.user.email).toBe(email); // Soft - not last
expect(userData.user.name).toBe(name); // Hard - LAST assertion
});
`

- **Hard Assertion Usage:**
  - The last assertion in each test step or test must always be a hard assertion.
  - This serves as the final validation point that determines pass/fail.

- **No Manual Waits or Try/Catch:**
  - Do not use manual waits (`waitForTimeout`) or try/catch to suppress assertion failures.
  - Rely on Playwright's auto-waiting and robust assertion mechanisms.

- **Custom Assertion Helpers:**
  - Place custom assertion helpers in shared utilities.
  - Ensure helpers provide clear error messages and do not mask failures.

---

## Common Mistakes to Avoid

- Writing assertions that can pass in an invalid state (false positives).
- Using only soft assertions without a final hard assertion.
- Using all hard assertions when multiple checks are needed (prevents seeing all failures at once).
- Suppressing assertion failures with try/catch or manual error handling.
- Inconsistent assertion patterns across tests.

---

## Checklist for Reviewers & Copilot

- [ ] In test steps with multiple assertions, are all except the last one using `expect.soft()`?
- [ ] Is the final assertion in each test step a hard assertion?
- [ ] Are single-assertion test steps using hard assertions?
- [ ] Is there no possibility of false positives in the test logic?
- [ ] Are assertion messages clear and descriptive?
- [ ] Are custom assertion helpers used consistently and placed in shared utilities?

---

## References

- [Playwright Assertions](https://playwright.dev/docs/test-assertions)
- [Soft Assertions in Playwright](https://playwright.dev/docs/test-assertions#soft-assertions)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

**Reference this guide before writing or reviewing any test validations. Reliable assertions are key to trustworthy automation!**

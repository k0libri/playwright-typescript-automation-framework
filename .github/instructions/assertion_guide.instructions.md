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

- **Soft Assertions:**  
  Use soft assertions for intermediate checks within a test, but always follow with a final hard assertion before test completion.  
  Soft assertions should not mask failures—ensure all failures are reported.

- **Expressive & Clear:**  
  Assertions should clearly state what is being validated and why.  
  Use descriptive messages for custom assertions.

- **Consistency:**  
  Use the same assertion library and patterns throughout the project (e.g., Playwright’s `expect`).

---

## Implementation Guidelines

- **Preferred Assertion Library:**  
  Use Playwright’s built-in `expect` for all validations.

- **Soft Assertion Usage:**
  - Use soft assertions for non-critical checks that do not block test flow.
  - Aggregate soft assertion results and ensure the test fails if any soft assertion fails.
  - Do not use soft assertions for critical test outcomes.

- **Hard Assertion Usage:**
  - Always end each test with a hard assertion that validates the main outcome.
  - Hard assertions must be used for pass/fail criteria.

- **No Manual Waits or Try/Catch:**
  - Do not use manual waits (`waitForTimeout`) or try/catch to suppress assertion failures.
  - Rely on Playwright’s auto-waiting and robust assertion mechanisms.

- **Custom Assertion Helpers:**
  - Place custom assertion helpers in shared utilities.
  - Ensure helpers provide clear error messages and do not mask failures.

---

## Common Mistakes to Avoid

- Writing assertions that can pass in an invalid state (false positives).
- Using only soft assertions without a final hard assertion.
- Suppressing assertion failures with try/catch or manual error handling.
- Inconsistent assertion patterns across tests.

---

## Checklist for Reviewers & Copilot

- [ ] Are all critical outcomes validated with hard assertions?
- [ ] Are soft assertions used only for intermediate, non-critical checks?
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

---
applyTo: '**'
---

```markdown
# Test Generation & Structure Guide

## Purpose

This guide defines standards for generating and structuring test cases and spec files.  
It is referenced by Copilot and reviewers to ensure tests are clear, maintainable, and reliable.

---

## Test Naming Conventions

- **Test names must start with `should` and clearly describe the expected behavior.**
  - Example: `should display the user profile after login`
  - Example: `should return 404 for invalid user ID`

---

## Test Setup & Data Cleanup

- **Always clear any dummy or test data before running tests.**
  - Use `beforeAll` hooks to perform cleanup and setup tasks.
  - Ensure the test environment is in a known state before tests execute.

- **Use `beforeAll` for:**
  - Clearing or resetting test data.
  - Setting up required test context or fixtures.

---

## Await and Timeout Usage in Tests

- **Do not use `await page.waitForTimeout` or any manual timeout/wait in tests.**
  - Rely on Playwright’s auto-waiting mechanisms and robust selectors.
  - Manual timeouts lead to flaky and unreliable tests and must be avoided.
- **Use `await` as needed for asynchronous operations inside hooks or test bodies.**
  - Do not use `await` at the top level of the test file.

---

## Linting, Formatting, and Commit Discipline

- **All generated code must pass strict ESLint and Prettier checks.**
- **Husky pre-commit hooks must be respected and not bypassed.**
- **After implementing each user story, run and fix lint/format issues before committing.**
- **No flaky tests are allowed.**
  - Run each new/modified test at least 3 times to ensure reliability.
  - If any flakiness is detected, diagnose and fix before proceeding.
- **After each user story implementation:**
  - Run the entire test suite to catch integration issues.
  - Commit changes with a clear message describing the user story.
- **After the last user story:**
  - Run the entire test suite (using `.only` or a script if needed) to ensure all tests work together.
  - Commit the final changes using CLI.

---

## Checklist for Reviewers & Copilot

- [ ] Do all test names start with `should` and describe the expected behavior?
- [ ] Is all dummy/test data cleared before tests run (using `beforeAll`)?
- [ ] Is `await page.waitForTimeout` or any manual timeout/wait avoided in all tests?
- [ ] Is `await` only used inside hooks or test bodies, not at the top level?
- [ ] Does all code pass ESLint and Prettier checks?
- [ ] Are Husky hooks respected?
- [ ] Are tests run multiple times to ensure no flakiness?
- [ ] Is the whole test suite run after each user story and before the final commit?
- [ ] Are commits made after each user story and after the final suite run?

---

## References

- [Playwright Test Structure](https://playwright.dev/docs/test-structure)
- [Playwright Test Hooks](https://playwright.dev/docs/test-fixtures#test-hooks)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [ESLint](https://eslint.org/)
- [Prettier](https://prettier.io/)
- [Husky](https://typicode.github.io/husky/)

---

**Reference this guide before generating or reviewing any new test cases or spec files. Consistent structure, reliability, and code quality are key to maintainable automation!**
```

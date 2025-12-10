---
applyTo: '**'
---

# CI/CD Pipeline Execution Guide

## Purpose

Define the standard GitHub Actions pipeline flow that enforces code quality, runs UI & API tests, and publishes reports.

---

## Required Steps

1. **Checkout & Node Setup**
   - Use `actions/checkout@v3` to fetch the repository.
   - Use `actions/setup-node@v3` with the required Node.js version (e.g., `node-version: 18`).

2. **Install Dependencies**
   - Run `npm ci` to ensure clean, repeatable installs.

3. **Static Analysis**
   - Run `npm run lint` to enforce ESLint rules.
   - Run `npm run prettier:check` (or equivalent) to verify formatting.

4. **Test Execution**
   - Execute both UI and API tests (e.g., `npm run test:ui` and `npm run test:api`, or a combined `npm run test:all`).
   - Ensure the Playwright reporter includes `line` and `allure-playwright` for CLI + Allure results.

5. **Allure Report Generation**
   - After successful tests, generate Allure artifacts:  
     `npx allure generate --clean ./allure-results -o ./reports/allure`

6. **Artifact Upload**
   - Use `actions/upload-artifact@v3` to archive `reports/allure` (and Playwright HTML reports if desired).

7. **Fail-Fast Policy**
   - Any failure in linting or tests must fail the pipeline; do not proceed to report generation or artifact upload if earlier steps fail.

8. **Optional Matrix Execution**
   - Configure matrix builds for different browsers or environments when needed.

---

## Secrets & Environment Variables

- Store credentials, base URLs, and other sensitive information in GitHub Secrets.
- Inject them via workflow `env` variables (e.g., `UI_BASE_URL`, `API_BASE_URL`, `TEST_USER`, `TEST_PASSWORD`).
- Document expected secrets in the README or a contributing guide.

---

## Sample Workflow Snippet

```yaml
jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run lint
      - run: npm run test:all
      - run: npx allure generate --clean ./allure-results -o ./reports/allure
      - uses: actions/upload-artifact@v3
        with:
          name: allure-report
          path: reports/allure
```

_(Adjust scripts and node-version as appropriate.)_

---

## Checklist

- [ ] Does the workflow install dependencies via `npm ci`?
- [ ] Are lint and format checks executed before tests?
- [ ] Are both UI and API tests run with proper reporters enabled?
- [ ] Is the Allure report generated and uploaded as an artifact?
- [ ] Are secrets/environment variables sourced from GitHub Secrets?
- [ ] Does the pipeline fail immediately on lint/test errors?

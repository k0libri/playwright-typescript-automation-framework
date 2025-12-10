---
applyTo: '**'
---

# Logging & Debugging Guide

## Purpose

Establish consistent logging and debugging practices to simplify troubleshooting, especially in CI contexts.

---

## Core Principles

- **Centralized Logging**
  - Avoid scattered `console.log` statements; use a shared logger utility (e.g., `shared/utils/logger.util.ts`).
  - Provide logging levels (`info`, `warn`, `error`, `debug`) to control verbosity.

- **Debug Mode**
  - Allow toggling verbose logging via an environment variable (e.g., `DEBUG_LOGGING=true`).
  - Default runs should remain concise to keep CI output manageable.

- **Error Context**
  - When API calls fail, log status codes and response payloads.
  - For UI failures, capture and attach screenshots, traces, and page sources.

- **Playwright Diagnostics**
  - Enable `trace: 'retain-on-failure'` (or `'on-first-retry'`) in `playwright.config.ts` for reproducible UI failures.
  - Use Playwright’s debugging tools (`PWDEBUG=1`, inspector, `pw:api` logs) when investigating locally.

---

## Implementation Recommendations

- **Logger Utility**

  ```ts
  // shared/utils/logger.util.ts
  export class Logger {
    static info(message: string, data?: unknown) {
      if (process.env.DEBUG_LOGGING === 'true') console.info('[INFO]', message, data ?? '');
    }
    static error(message: string, data?: unknown) {
      console.error('[ERROR]', message, data ?? '');
    }
    // ... additional levels
  }
  ```

- **Usage Examples**
  - UI action failure: log the step and attach a screenshot.
  - API error: `Logger.error('User creation failed', { status: response.status(), body: await response.json() });`

- **Allure Integration**
  - Attach logs, response bodies, or page sources through Allure attachments for easier review in reports.

---

## Checklist

- [ ] Are logs routed through a shared logger (no ad-hoc `console.log` in core code)?
- [ ] Is there a debug flag to control verbosity?
- [ ] Do error paths capture sufficient context (status codes, payloads, screenshots, traces)?
- [ ] Are Playwright trace and diagnostics configured for CI and local debugging?

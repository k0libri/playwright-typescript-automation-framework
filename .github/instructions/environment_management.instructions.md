---
applyTo: '**'
---

# Configuration & Environment Management Guide

## Purpose

Provide a unified strategy for managing configuration across environments (dev/stage/prod) for both UI and API testing.

---

## Core Principles

- **Centralized Configuration Layer**
  - All environment-specific values reside in `shared/config/`.
  - No hardcoded URLs, credentials, or environment-dependent values in page objects, services, or tests.

- **Environment Variables**
  - Use `.env` files locally (never commit them) and provide `.env.example` for reference.
  - In CI, source values from GitHub Secrets and pass them as environment variables.
  - Typical variables: `UI_BASE_URL`, `API_BASE_URL`, `TEST_USER_EMAIL`, `TEST_USER_PASSWORD`.

- **Playwright Configuration**
  - Reference environment variables within `playwright.config.ts` to set `use.baseURL`, timeouts, retries, and reporter options.
  - For multi-environment support, use environment variables or create dedicated config variants (e.g., `playwright.dev.config.ts`).

- **API Base URLs & Endpoints**
  - `BaseApiClient` should read `API_BASE_URL` from a shared config utility (e.g., `env.apiBaseUrl`).
  - Feature-specific services append their endpoint paths to the base URL rather than hardcoding full URLs.

- **Credential Storage**
  - Store all secrets (user credentials, tokens) only in `.env` (local) or GitHub Secrets (remote).
  - Document expected variables clearly in README or onboarding guides.

---

## Implementation Recommendations

```
shared/
  config/
    env.config.ts        # Loads and validates environment variables (dotenv + schema)
```

- `env.config.ts` (or similar) exports a typed object:
  ```ts
  export const env = {
    uiBaseUrl: process.env.UI_BASE_URL ?? '',
    apiBaseUrl: process.env.API_BASE_URL ?? '',
    user: {
      email: process.env.TEST_USER_EMAIL ?? '',
      password: process.env.TEST_USER_PASSWORD ?? '',
    },
  };
  ```
- `BasePage`/`BaseApiClient` import from this `env` object.

- Validate required variables at startup with a schema or runtime checks.

---

## Checklist

- [ ] Are all URLs, credentials, and environment-dependent values pulled from `shared/config`?
- [ ] Is there a `.env.example` documenting required variables?
- [ ] Are configuration utilities typed and validated?
- [ ] Does the Playwright config read its settings from environment variables?
- [ ] Are secrets managed via `.env` (local) or GitHub Secrets (CI) with clear documentation?

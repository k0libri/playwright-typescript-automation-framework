---
applyTo: '**'
---

# Configuration & Environment Management Guide

## Purpose

Provide a unified strategy for managing configuration across environments (dev/stage/prod) for both UI and API testing using `.env` files.

---

## Core Principles

- **Environment Variables via .env**
  - All environment-specific values are stored in `.env` file (git-ignored).
  - `.env.example` serves as a template with empty values.
  - No hardcoded URLs, credentials, or environment-dependent values in page objects, services, or tests.

- **Environment Variables**
  - Use `.env` files locally (never commit them).
  - `.env.example` documents all available variables with empty values.
  - In CI, source values from GitHub Secrets and pass them as environment variables.
  - Variables: `BASE_URL`, `BACKEND_API_BASE_URL`, `RESTFUL_BOOKER_BASE_URL`, `DEBUG_LOGGING`, etc.

- **Playwright Configuration**
  - `playwright.config.ts` loads `.env` file via `dotenv` at startup.
  - Reference environment variables using `process.env['VARIABLE_NAME']` to set `use.baseURL`, timeouts, retries, and reporter options.
  - For multi-environment support, use environment variables or create dedicated config variants (e.g., `playwright.dev.config.ts`).

- **API Base URLs & Endpoints**
  - Service classes read base URLs directly from `process.env['BACKEND_API_BASE_URL']` or `process.env['RESTFUL_BOOKER_BASE_URL']`.
  - Feature-specific services append their endpoint paths to the base URL rather than hardcoding full URLs.
  - Default values provided via nullish coalescing operator (`??`).

- **Credential Storage**
  - Store all secrets (user credentials, tokens) only in `.env` (local) or GitHub Secrets (CI).
  - Document expected variables clearly in `.env.example` and README.

---

## Implementation

### Configuration Flow

1. **playwright.config.ts** loads `.env` at startup:

   ```ts
   import dotenv from 'dotenv';
   import path from 'path';

   dotenv.config({ path: path.resolve(__dirname, '.env') });
   ```

2. **Services and utilities** access environment variables directly:

   ```ts
   export class UserService extends BaseApiClient {
     constructor(request: APIRequestContext) {
       super(request, process.env['BACKEND_API_BASE_URL'] ?? 'https://automationexercise.com/api');
     }
   }
   ```

3. **Logger** respects DEBUG_LOGGING flag:
   ```ts
   export class Logger {
     private static isDebugEnabled = process.env['DEBUG_LOGGING'] === 'true';
   }
   ```

### Environment Variables

**.env.example** (template with empty values):

```bash
# UI Testing
BASE_URL=

# Backend API (for UI validation)
BACKEND_API_BASE_URL=

# Standalone API (restful-booker)
RESTFUL_BOOKER_BASE_URL=

# General Settings
TIMEOUT=
HEADLESS=
BROWSER=

# Test Configuration
SCREENSHOT_MODE=
VIDEO_MODE=

# Logging
DEBUG_LOGGING=
```

**.env** (local configuration, git-ignored):

```bash
# UI Testing
BASE_URL=https://automationexercise.com

# Backend API (for UI validation)
BACKEND_API_BASE_URL=https://automationexercise.com/api

# Standalone API (restful-booker)
RESTFUL_BOOKER_BASE_URL=https://restful-booker.herokuapp.com

# General Settings
TIMEOUT=30000
HEADLESS=true
BROWSER=chromium

# Test Configuration
SCREENSHOT_MODE=only-on-failure
VIDEO_MODE=retain-on-failure

# Logging
DEBUG_LOGGING=false
```

---

## Checklist

- [ ] Are all URLs, credentials, and environment-dependent values read from `.env` via `process.env`?
- [ ] Is there a `.env.example` documenting all required variables (with empty values)?
- [ ] Does `playwright.config.ts` load `.env` via dotenv at startup?
- [ ] Do all services use `process.env['VARIABLE_NAME']` with default fallbacks?
- [ ] Are secrets managed via `.env` (local) or GitHub Secrets (CI) with clear documentation?
- [ ] Is `.env` listed in `.gitignore`?
- [ ] Does README document how to set up `.env` from `.env.example`?

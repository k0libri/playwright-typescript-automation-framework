---
applyTo: '**'
---

# Project Structure Guide

## Purpose

This guide defines the required directory and file structure for the Playwright + TypeScript automation platform, covering both UI and API automation.  
It is referenced by Copilot and reviewers to ensure all contributions are consistent, maintainable, and easy to onboard.

**Always consult this guide before adding, moving, or reviewing files in the repository.**

---

## Testing Strategy Overview

This framework supports **two distinct API testing approaches**:

1. **Standalone API Testing**: Pure API tests against external APIs (e.g., restful-booker)
2. **UI + API Hybrid Testing**: UI tests with backend API validation (e.g., automationexercise.com)

Both approaches coexist in the same repository, using shared infrastructure while maintaining clear separation of concerns.

---

## Top-Level Layout

```text
tests/
  ui/
    po/
      base/                      # BasePage and BaseComponent classes
        basePage.page.ts
        baseComponent.component.ts
      components/                # All reusable UI components
        common/                  # Common components (navbar, footer, etc.)
          navbar.component.ts
        authentication/          # Authentication-specific components
          accountInfo.component.ts
          loginForm.component.ts
      authentication/            # Feature-specific page objects ONLY
        authentication.page.ts
      cart/
        cart.page.ts
      checkout/
        checkout.page.ts
      products/
        products.page.ts
    specs/
      authentication/            # UI test specs grouped by feature
        authentication.spec.ts
      cart/
        cartManagement.spec.ts
      checkout/
        orderCompletion.spec.ts
      products/
        products.spec.ts
    uiFixtures.ts                # Playwright fixtures for UI DI
    data/                        # UI-only datasets (empty - shared data in common/)
  api/
    clients/                     # All API service classes
      baseApiClient.service.ts   # Base client for all services
      auth.service.ts            # Standalone - Auth service
      booking.service.ts         # Standalone - Booking service
      user.service.ts            # Backend - User service
      product.service.ts         # Backend - Product service
    specs/
      standalone/                # Standalone API tests
        auth.spec.ts
        booking/
          booking.spec.ts
      backend/                   # Backend API validation tests
        user.spec.ts
    apiFixtures.ts               # Standalone API fixtures
    backendFixtures.ts           # Backend API fixtures
    data/                        # API data
      bookingDataFactory.ts
      types.ts
  common/
    utils/                       # Shared utilities
      logger.util.ts
      userDataFactory.ts
      paymentDataFactory.ts
    data/                        # Shared data types
      types.ts
reports/                         # HTML report artifacts
allure-results/                  # Allure test results
.env                            # Local config (git-ignored)
.env.example                    # Config template (empty values)
playwright.config.ts            # Playwright config (loads .env)
```

> **All components must be placed in `tests/ui/po/components/` and imported into page objects. Never place components inside feature folders.**

---

## Directory & File Rules

### UI Structure

- **`tests/ui/po/base/`**
  - `basePage.page.ts` and `baseComponent.component.ts`
  - All page objects extend `BasePage`
  - All components extend `BaseComponent`

- **`tests/ui/po/components/`**
  - All UI components as `.component.ts` files
  - Common components in `components/common/`
  - Feature components in `components/<feature>/`
  - Class names: PascalCase ending with `Component`

- **`tests/ui/po/<feature>/`**
  - Feature page objects as `.page.ts` files
  - Class names: PascalCase ending with `Page`
  - Import components from `components/` only

- **`tests/ui/specs/<feature>/`**
  - Test specs grouped by feature
  - UI + API hybrid testing supported

- **`tests/ui/uiFixtures.ts`**
  - Playwright fixtures for dependency injection

- **`tests/ui/data/`**
  - UI-only data (currently empty, shared data in `common/`)

### API Structure

- **`tests/api/clients/`**
  - All service classes as `.service.ts` files
  - `baseApiClient.service.ts` - Base for all services
  - Standalone services: `auth.service.ts`, `booking.service.ts`
  - Backend services: `user.service.ts`, `product.service.ts`
  - Class names: PascalCase ending with `Service`
  - All extend `BaseApiClient`

- **`tests/api/specs/standalone/`**
  - Pure API tests for external APIs
  - Grouped by feature

- **`tests/api/specs/backend/`**
  - Backend API validation tests

- **`tests/api/apiFixtures.ts`**
  - Fixtures for standalone API tests

- **`tests/api/backendFixtures.ts`**
  - Fixtures for backend API tests

- **`tests/api/data/`**
  - API data factories and types

### Common (Shared)

- **`tests/common/utils/`**
  - `logger.util.ts` - Centralized logging
  - `userDataFactory.ts` - User data (UI + API)
  - `paymentDataFactory.ts` - Payment data (UI)

- **`tests/common/data/`**
  - `types.ts` - Shared type definitions

### Configuration

- **`.env`** (git-ignored) - Local environment values
- **`.env.example`** - Template with empty values
- **`playwright.config.ts`** - Loads .env via dotenv

---

## Naming Conventions

- **Filenames:**
  - Pages: `feature.page.ts` (`authentication.page.ts`)
  - Components: `feature.component.ts` (`navbar.component.ts`)
  - Services: `feature.service.ts` (`user.service.ts`)
  - Specs: `feature.spec.ts` (`authentication.spec.ts`)
  - Use camelCase for all filenames

- **Class Names:**
  - Pages: PascalCase + `Page` (`AuthenticationPage`)
  - Components: PascalCase + `Component` (`NavbarComponent`)
  - Services: PascalCase + `Service` (`UserService`)
  - Base classes: `BasePage`, `BaseComponent`, `BaseApiClient`

---

## Configuration Usage

- All page objects extend `BasePage` from `tests/ui/po/base/`
- All components extend `BaseComponent` from `tests/ui/po/base/`
- All API services extend `BaseApiClient` from `tests/api/clients/`
- Environment variables accessed via `process.env['VARIABLE_NAME']`
- No hardcoded URLs or endpoints - use .env configuration
- Default values via nullish coalescing: `process.env['VAR'] ?? 'default'`

---

## Enforcement Rules

- Do not add files outside this structure
- Never place components in feature folders under `po/`
- No hardcoded URLs, credentials, or endpoints
- Do not duplicate shared logic
- Create missing directories before adding code
- Group features under their respective folders
- Centralize shared utilities in `common/`
- Import components from `components/` directory

---

## Common Mistakes to Avoid

- Placing components inside `po/<feature>/` folders
- Hardcoding environment values instead of using `process.env`
- Duplicating data factories across UI and API
- Not extending base classes (`BasePage`, `BaseComponent`, `BaseApiClient`)
- Creating service classes outside `tests/api/clients/`
- Mixing UI and API test specs in the same folder

---

## Example: Adding a New Feature

### UI Feature with Backend Validation

1. Create page object: `tests/ui/po/<feature>/<feature>.page.ts`
2. If needed, create components: `tests/ui/po/components/<feature>/`
3. Create backend service (if needed): `tests/api/clients/<feature>.service.ts`
4. Create test spec: `tests/ui/specs/<feature>/<feature>.spec.ts`
5. Import backend service in spec for validation

### Standalone API Feature

1. Create service: `tests/api/clients/<feature>.service.ts`
2. Create spec: `tests/api/specs/standalone/<feature>.spec.ts`
3. Add data factory (if needed): `tests/api/data/<feature>DataFactory.ts`

---

**Reference this guide before every new contribution. Consistency is key!**

---
applyTo: '**'
---

# Project Structure Guide

## Purpose

This guide defines the required directory and file structure for the Playwright + TypeScript automation platform, covering both UI and API automation.  
It is referenced by Copilot and reviewers to ensure all contributions are consistent, maintainable, and easy to onboard. The code is written using windows Operating System dont use /n.

**Always consult this guide before adding, moving, or reviewing files in the repository.**

---

## Testing Strategy Overview

This framework supports **two distinct API testing approaches**:

1. **Standalone API Testing**: Pure API tests against external APIs (e.g., restful-booker) located in `src/api/standalone/`
2. **UI + API Hybrid Testing**: UI tests with backend API validation (e.g., automationexercise.com) located in `src/api/backend/`

Both approaches coexist in the same repository, using shared infrastructure while maintaining clear separation of concerns.

---

## Top-Level Layout

```text
src/
  ui/
    po/
      base/                      # BasePage and BaseComponent classes, shared navigation logic
        basePage.page.ts
        baseComponent.component.ts
      components/                # All reusable UI components (NEVER inside feature folders)
        cookieConsent.component.ts
        navbar.component.ts
      authentication/            # Feature-specific page objects ONLY
        authentication.page.ts
      cart/
        cart.page.ts
    tests/
      authentication/            # UI + API hybrid specs grouped by feature
        authentication.spec.ts
      cart/
        cartManagement.spec.ts
      checkout/
        orderCompletion.spec.ts
    fixtures/
      uiFixtures.ts              # Playwright fixtures for DI
    utils/                       # UI helpers, selector factories
    data/                        # UI-focused datasets
  api/
    standalone/                  # Standalone API testing (e.g., restful-booker)
      base/
        baseApiClient.service.ts
      services/
        auth.service.ts
        booking.service.ts
      tests/
        auth/
          auth.spec.ts
        booking/
          booking.spec.ts
      fixtures/
        apiFixtures.ts
      utils/
        bookingDataFactory.ts
      data/
        types.ts
    backend/                     # Backend API for UI validation (e.g., automationexercise)
      base/
        baseApiClient.service.ts
      services/
        user.service.ts
        product.service.ts
      fixtures/
        backendFixtures.ts
      utils/
        helpers.ts
      data/
        types.ts
    base/                        # Shared API utilities (status codes, etc.)
      httpStatus.ts
shared/
  config/                        # Environment configs, endpoints, credentials
    environment.ts
  fixtures/                      # Cross-domain fixtures (if needed)
  utils/                         # Shared utilities (env resolution, logging, data factories)
    userDataFactory.ts
    paymentDataFactory.ts
  data/                          # Shared data types
    types.ts
reports/                         # Built-in HTML report artifacts
allure-results/                  # Allure test results
```

> **All components must be placed in `src/ui/po/components/` and imported into page objects as needed. Do not place components inside feature folders.**

---

## Directory & File Rules

### UI

- **`src/ui/po/base/`**
  - Place `BasePage` (`basePage.page.ts`) and `BaseComponent` (`baseComponent.component.ts`) here.
  - All page objects must extend `BasePage`.
  - All components must extend `BaseComponent`.

- **`src/ui/po/components/`**
  - All reusable UI components as `.component.ts` files (e.g., `cookieConsent.component.ts`).
  - Component class names: PascalCase, end with `Component` (e.g., `NavbarComponent`).
  - **No components in feature folders.**

- **`src/ui/po/<feature>/`**
  - Feature-specific page objects as `.page.ts` files (e.g., `authentication.page.ts`).
  - Page class names: PascalCase, end with `Page` (e.g., `AuthenticationPage`).
  - **No components here—import from `components/` as needed.**

- **`src/ui/tests/<feature>/`**
  - UI + API hybrid test specs grouped by feature (e.g., `authentication.spec.ts`).
  - These tests verify UI behavior and validate backend state via API calls.

- **`src/ui/fixtures/`**
  - Playwright fixtures for dependency injection and context setup.

- **`src/ui/utils/`**
  - UI-specific helpers, selector factories, and utility functions.

- **`src/ui/data/`**
  - Datasets and data builders for UI tests.

### API - Standalone Testing

- **`src/api/standalone/base/`**
  - Place `BaseApiClient` for standalone API testing (e.g., restful-booker).
  - All standalone service classes must extend this base client.

- **`src/api/standalone/services/`**
  - Standalone API service classes as `.service.ts` files (e.g., `auth.service.ts`, `booking.service.ts`).
  - Service class names: PascalCase, end with `Service` (e.g., `AuthService`, `BookingService`).

- **`src/api/standalone/tests/<feature>/`**
  - Pure API test specs grouped by feature (e.g., `auth.spec.ts`, `booking.spec.ts`).
  - These tests validate API endpoints independently without UI interaction.

- **`src/api/standalone/fixtures/`**
  - Playwright fixtures for dependency injection and context setup for standalone API tests.

- **`src/api/standalone/utils/`**
  - API-specific helpers, factories, and builder functions for standalone tests.

- **`src/api/standalone/data/`**
  - Datasets, schemas, and data builders for standalone API tests.

### API - Backend Validation (UI Support)

- **`src/api/backend/base/`**
  - Place `BaseApiClient` for backend API validation (e.g., automationexercise.com API).
  - All backend service classes must extend this base client.

- **`src/api/backend/services/`**
  - Backend API service classes as `.service.ts` files (e.g., `user.service.ts`, `product.service.ts`).
  - Service class names: PascalCase, end with `Service` (e.g., `UserService`).
  - These services are used by UI tests for backend validation.

- **`src/api/backend/fixtures/`**
  - Playwright fixtures for dependency injection specific to backend API validation.

- **`src/api/backend/utils/`**
  - Helpers and utilities for backend API validation.

- **`src/api/backend/data/`**
  - Datasets and types for backend API validation.

### API - Shared

- **`src/api/base/`**
  - Shared API utilities used by both standalone and backend APIs (e.g., `httpStatus.ts`).
  - Common enums, constants, and types.

### Shared & Reports

- **`shared/config/`**
  - Environment configs, endpoints, and credentials for all testing domains.
- **`shared/fixtures/`**
  - Cross-domain fixtures (used by UI, standalone API, and backend API).
- **`shared/utils/`**
  - Shared utilities (e.g., environment resolution, logging, data factories).
- **`shared/data/`**
  - Shared data types and interfaces.
- **`reports/`**
  - Artifacts from built-in HTML reports and other reporting tools.
- **`allure-results/`**
  - Allure test result artifacts.

---

## Naming Conventions

- **Filenames:**
  - Page objects: `feature.page.ts` (e.g., `authentication.page.ts`)
  - Components: `feature.component.ts` (e.g., `navbar.component.ts`)
  - API services (standalone): `feature.service.ts` (e.g., `auth.service.ts`, `booking.service.ts`)
  - API services (backend): `feature.service.ts` (e.g., `user.service.ts`, `product.service.ts`)
  - Use camelCase for all filenames.

- **Class Names:**
  - Page objects: PascalCase, end with `Page` (e.g., `AuthenticationPage`)
  - Components: PascalCase, end with `Component` (e.g., `NavbarComponent`)
  - Base classes: `BasePage`, `BaseComponent`, `BaseApiClient`
  - API services: PascalCase, end with `Service` (e.g., `AuthService`, `BookingService`, `UserService`)

---

## Inheritance & Configuration

- All page objects must extend `BasePage`.
- All components must extend `BaseComponent`.
- Standalone API service classes must extend `BaseApiClient` from `src/api/standalone/base/`.
- Backend API service classes must extend `BaseApiClient` from `src/api/backend/base/`.
- Place shared navigation, utility, and request logic in base classes.
- **Do not hardcode URLs or endpoints**—configure via Playwright config or environment variables.

---

## Enforcement

- **Do not add files or folders outside this structure.**
- **If a required directory is missing, create it before adding new code.**
- **Group all new features and specs under their respective feature folders.**
- **Centralize shared logic in `shared/` to avoid duplication.**
- **Never place components inside feature folders.**
- **Keep standalone API tests separate from backend API validation code.**

---

## Common Mistakes to Avoid

- Placing components inside feature folders.
- Mixing standalone API tests with backend API validation code.
- Placing service classes in the wrong API domain (standalone vs backend).
- Storing base clients outside their respective `base/` folders.
- Duplicating utility functions across domains.
- Hardcoding data, URLs, or endpoints in specs or services.
- Using backend API services in standalone API tests or vice versa.

---

## Example: Adding a New Feature

### For UI + API Hybrid Testing:

1. Create a new folder under `src/ui/po/<feature>/` for page objects only.
2. Add the corresponding page object as `<feature>.page.ts` and class as `<Feature>Page`.
3. Add reusable UI widgets in `src/ui/po/components/` as `<feature>.component.ts` and class as `<Feature>Component`.
4. For backend API validation, add a service class in `src/api/backend/services/` as `<feature>.service.ts`.
5. Add the UI + API hybrid spec under `src/ui/tests/<feature>/` as `<feature>.spec.ts`.
6. Import backend API services into the spec for validation.

### For Standalone API Testing:

1. Add a new service class in `src/api/standalone/services/` as `<feature>.service.ts`.
2. Add the corresponding API spec under `src/api/standalone/tests/<feature>/` as `<feature>.spec.ts`.
3. Add data factories/builders to `src/api/standalone/utils/` as needed.
4. Add type definitions to `src/api/standalone/data/` as needed.

---

**Reference this guide before every new contribution or review. Consistency is key!**

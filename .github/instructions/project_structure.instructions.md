---
applyTo: '**'
---

# Project Structure Guide

## Purpose

This guide defines the required directory and file structure for the Playwright + TypeScript automation platform, covering both UI and API automation.  
It is referenced by Copilot and reviewers to ensure all contributions are consistent, maintainable, and easy to onboard. The code is written using windows Operating System dont use /n.

**Always consult this guide before adding, moving, or reviewing files in the repository.**

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
        roomDivider.component.ts
      home/                      # Feature-specific page objects ONLY
        home.page.ts
    tests/
      home/                      # UI specs grouped by feature
        home.spec.ts
    fixtures/
      pageFixtures.ts            # Playwright fixtures for DI
    utils/                       # UI helpers, selector factories
    data/                        # UI-focused datasets
  api/
    base/                        # Base API client classes and shared logic
      baseApiClient.service.ts
    services/                    # Feature-specific API service classes
      user.service.ts
      room.service.ts
    tests/
      user/                      # API specs grouped by feature
        user.spec.ts
      room/
        room.spec.ts
    fixtures/
      apiFixtures.ts             # Playwright fixtures for DI and context setup
    utils/                       # API helpers, factories, builders
    data/                        # API-focused datasets
shared/
  config/                        # Environment configs, endpoints, credentials
  fixtures/                      # Cross-domain fixtures (if needed)
  utils/                         # Shared utilities (env resolution, logging)
reports/                         # Built-in HTML report artifacts
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
  - Component class names: PascalCase, end with `Component` (e.g., `RoomDividerComponent`).
  - **No components in feature folders.**

- **`src/ui/po/<feature>/`**
  - Feature-specific page objects as `.page.ts` files (e.g., `home.page.ts`).
  - Page class names: PascalCase, end with `Page` (e.g., `HomePage`).
  - **No components here—import from `components/` as needed.**

- **`src/ui/tests/<feature>/`**
  - UI test specs grouped by feature (e.g., `home.spec.ts`).

- **`src/ui/fixtures/`**
  - Playwright fixtures for dependency injection and context setup.

- **`src/ui/utils/`**
  - UI-specific helpers, selector factories, and utility functions.

- **`src/ui/data/`**
  - Datasets and data builders for UI tests.

### API

- **`src/api/base/`**
  - Place `BaseApiClient` (`baseApiClient.service.ts`) and any shared API logic here.
  - All service classes must extend `BaseApiClient`.

- **`src/api/services/`**
  - Feature-specific API service classes as `.service.ts` files (e.g., `user.service.ts`).
  - Service class names: PascalCase, end with `Service` (e.g., `UserService`).

- **`src/api/tests/<feature>/`**
  - API test specs grouped by feature (e.g., `user.spec.ts`, `room.spec.ts`).

- **`src/api/fixtures/`**
  - Playwright fixtures for dependency injection and context setup.

- **`src/api/utils/`**
  - API-specific helpers, factories, and builder functions.

- **`src/api/data/`**
  - Datasets and data builders for API tests.

### Shared & Reports

- **`shared/config/`**
  - Environment configs, endpoints, and credentials.
- **`shared/fixtures/`**
  - Cross-domain fixtures (used by both UI and API, if needed).
- **`shared/utils/`**
  - Shared utilities (e.g., environment resolution, logging).
- **`reports/`**
  - Artifacts from built-in HTML reports and other reporting tools.

---

## Naming Conventions

- **Filenames:**
  - Page objects: `feature.page.ts` (e.g., `room.page.ts`)
  - Components: `feature.component.ts` (e.g., `roomDivider.component.ts`)
  - API services: `feature.service.ts` (e.g., `user.service.ts`)
  - Use camelCase for all filenames.

- **Class Names:**
  - Page objects: PascalCase, end with `Page` (e.g., `RoomPage`)
  - Components: PascalCase, end with `Component` (e.g., `RoomDividerComponent`)
  - Base classes: `BasePage`, `BaseComponent`, `BaseApiClient`
  - API services: PascalCase, end with `Service` (e.g., `UserService`)

---

## Inheritance & Configuration

- All page objects must extend `BasePage`.
- All components must extend `BaseComponent`.
- All API service classes must extend `BaseApiClient`.
- Place shared navigation, utility, and request logic in base classes.
- **Do not hardcode URLs or endpoints**—configure via Playwright config or environment variables.

---

## Enforcement

- **Do not add files or folders outside this structure.**
- **If a required directory is missing, create it before adding new code.**
- **Group all new features and specs under their respective feature folders.**
- **Centralize shared logic in `shared/` to avoid duplication.**
- **Never place components inside feature folders.**

---

## Common Mistakes to Avoid

- Placing components inside feature folders.
- Placing page objects, service classes, or specs directly under `ui/` or `api/` instead of their feature folders.
- Storing base pages, components, or API clients outside their respective `base/` folders.
- Duplicating utility functions across `ui/utils/`, `api/utils/`, and `shared/utils/`.
- Hardcoding data, URLs, or endpoints in specs or services.
- Mixing UI and API assets—keep them separated by domain.

---

## Example: Adding a New Feature

1. Create a new folder under `src/ui/po/<feature>/` for page objects only.
2. Add the corresponding page object as `<feature>.page.ts` and class as `<Feature>Page`.
3. Add reusable UI widgets in `src/ui/po/components/` as `<feature>.component.ts` and class as `<Feature>Component`.
4. For API, add a new service class in `src/api/services/` as `<feature>.service.ts` and class as `<Feature>Service`.
5. Add the corresponding API spec under `src/api/tests/<feature>/` as `<feature>.spec.ts`.
6. Update or extend base behaviour under `src/ui/po/base/` or `src/api/base/` if the feature requires shared functionality.
7. Add helpers to `src/ui/utils/`, `src/api/utils/`, and datasets to `src/ui/data/`, `src/api/data/` as needed.
8. Reference page URLs and API endpoints from configuration, not as string literals.

---

**Reference this guide before every new contribution or review. Consistency is key!**

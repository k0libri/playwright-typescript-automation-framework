---
applyTo: '**'
---

# Patterns & Abstractions Guide

## Purpose

This guide defines the required design patterns and abstractions for all UI and API automation code.  
It is referenced by Copilot and reviewers to ensure code is modular, maintainable, and consistent.

**Always consult this guide before creating, updating, or reviewing page objects, components, services, data, or fixtures.**

---

## 1. Page Object Model (POM) – UI

- Encapsulate UI structure and actions in page object classes.
- Place feature-specific page objects in `src/ui/po/<feature>/` as `<feature>.page.ts` (e.g., `room.page.ts`).
- Page object class names must use PascalCase and end with `Page` (e.g., `RoomPage`).
- All page objects must extend `BasePage` from `src/ui/po/base/basePage.page.ts`.
- Compose page objects from reusable components imported from `src/ui/po/components/`.
- **Never** use direct Playwright calls or locators in test specs; always interact through page objects or components.

---

## 2. Component Pattern – UI

- Encapsulate reusable UI fragments (headers, modals, widgets, etc.) as components.
- Place all components in `src/ui/po/components/` as `<feature>.component.ts` (e.g., `roomDivider.component.ts`).
- **Common components** (used across multiple features, e.g., Navbar, Footer, Sidebar) must be placed in `src/ui/po/components/common/` (e.g., `navbar.component.ts`).
  - This supports the Singleton pattern and DRY methodology—ensuring only one implementation is reused everywhere.
- Component class names must use PascalCase and end with `Component` (e.g., `NavbarComponent`).
- All components must extend `BaseComponent` from `src/ui/po/base/baseComponent.component.ts`.
- **Do not** place components inside feature folders; always import from `components/` into page objects as needed.

---

## 3. Service Pattern – API

- Encapsulate API endpoints and business logic in service classes.
- Place base/abstract clients in `src/api/base/` as `baseApiClient.service.ts`.
- Place feature-specific services in `src/api/services/` as `<feature>.service.ts` (e.g., `user.service.ts`).
- Service class names must use PascalCase and end with `Service` (e.g., `UserService`).
- All service classes must extend `BaseApiClient`.
- **Never** use direct API calls in test specs; always interact through service classes.

---

## 4. Factory & Builder Patterns – UI & API

- Generate test data and objects using factories or builders.
- Place these utilities in `src/ui/utils/`, `src/api/utils/`, `src/ui/data/`, or `src/api/data/`.
- Avoid hardcoded data in specs; always use factories/builders for data setup.

---

## 5. Dependency Injection (DI) – UI & API

- Inject page objects, components, services, or data into tests using Playwright fixtures.
- Define fixtures in `src/ui/fixtures/`, `src/api/fixtures/`, or `shared/fixtures/`.
- Pass dependencies via constructor or fixture context, not as globals.

---

## 6. Fixture Pattern – UI & API

- Centralize setup/teardown and recurring flows (e.g., login, token setup) in fixtures.
- Place fixtures in the appropriate `fixtures/` directory.
- Use fixtures for context setup, authentication, or shared state.

---

## 7. Configuration & Environment

- **Do not** hardcode URLs, endpoints, or credentials in page objects or services.
- Configure all URLs and endpoints via Playwright config or environment variables.
- Access configuration in abstractions through environment or config utilities.

---

## 8. Anti-Patterns to Avoid

- Direct Playwright or API calls in test specs (always use abstractions).
- Duplicating logic across specs and page objects/services/components.
- Monolithic page objects/services/components (too large, not composed).
- Hardcoded data, selectors, URLs, or endpoints in specs or abstractions.
- Global state or side effects in fixtures.
- Placing components inside feature folders.
- Duplicating common components across features (always use the singleton in `components/common/`).

---

## 9. Checklist for Reviewers & Copilot

- [ ] Are all UI actions and selectors encapsulated in page objects/components?
- [ ] Are all API calls encapsulated in service classes?
- [ ] Is test data generated via factories/builders, not hardcoded?
- [ ] Are fixtures used for setup/teardown and DI?
- [ ] Are patterns applied consistently across new and updated code?
- [ ] Are anti-patterns avoided?
- [ ] Are all components separated from feature folders and imported as needed?
- [ ] Are all abstractions inheriting from their respective base classes?
- [ ] Are URLs and endpoints configured, not hardcoded?
- [ ] Are common components (e.g., Navbar, Footer) placed in `components/common/` and reused via singleton pattern?

---

## References

- [Playwright POM Docs](https://playwright.dev/docs/pom)
- [Playwright Fixtures](https://playwright.dev/docs/test-fixtures)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Design Patterns in Test Automation](https://martinfowler.com/bliki/PageObject.html)

---

**Reference this guide before every new abstraction or review. Consistent patterns are key to a maintainable codebase!**

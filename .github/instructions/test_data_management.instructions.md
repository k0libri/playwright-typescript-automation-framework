---
applyTo: '**'
---

# Test Data Management & Factory Guide

## Purpose

Define consistent practices for generating, randomizing, and cleaning up test data in both UI and API layers.

---

## Principles

- **Factory Pattern**
  - Generate dynamic test data via factory/builder utilities.
  - UI-specific factories live under `src/ui/utils/`.
  - API-specific factories live under `src/api/utils/`.

- **Randomization**
  - Avoid data collisions by appending unique suffixes (timestamps, GUIDs) or using libraries like `@faker-js/faker`.
  - Provide reusable helpers (e.g., `generateUniqueEmail()`) within data factory modules.

- **Data Cleanup**
  - Use `beforeAll`/`afterAll` hooks for creating and cleaning test data as appropriate.
  - If the backend lacks deletion endpoints, use unique prefixes so leftover data can be differentiated (and document this behavior).

- **Configuration Awareness**
  - Never hardcode URLs, credentials, or environment-dependent values; retrieve them from shared configuration utilities.

---

## Implementation Guidelines

- **Factory Files**
  - UI example: `src/ui/utils/userDataFactory.ts`
  - API example: `src/api/utils/userPayloadFactory.ts`
  - For feature-specific needs, create dedicated builders (e.g., `user.factory.ts`) in the relevant domain directory.

- **Type Definitions**
  - Define TypeScript interfaces for all generated payloads (e.g., `UserPayload`) in `src/ui/data/`, `src/api/data/`, or shared data folders.

- **Seeding / Deterministic Runs**
  - When reproducibility is required, allow seeding (e.g., `faker.seed(...)`) via config or environment variables.

---

## Checklist

- [ ] Are all mutable data inputs generated via factories/builders?
- [ ] Is cleanup logic implemented (where possible) to remove created data?
- [ ] Are unique identifiers in place to avoid conflicts?
- [ ] Are sensitive or environment-specific values sourced from configuration rather than hardcoded?

Provide project context and coding guidelines that AI should follow when generating code, answering questions, or reviewing changes.

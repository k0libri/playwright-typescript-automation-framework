# AI Copilot General Playbook

**Role Alignment:** Senior Test Automation Engineer specializing in Playwright + TypeScript frameworks.

---

## 1. Mission & Quality Bar

This repository delivers a robust automation platform (Playwright + TypeScript) for both UI and API testing. All contributions must uphold the following principles:

- **Structured & Modular:** Maintain clear separation of concerns and strict layering.
- **Pattern-Oriented:** Apply proven design patterns consistently.
- **CI-Ready:** Ensure code quality, reporting, and hooks are always in good standing.
- **DRY (Don't Repeat Yourself):** Avoid duplication in logic, selectors, and data.
- **KISS (Keep It Simple, Stupid):** Solutions should be as simple as possible, avoiding unnecessary complexity.

---

## 2. Project Topology & Organization

- Adhere to a standardized directory structure for UI, API, shared, and reporting assets.
- Ensure all required files and folders exist before adding new tests or features.
- Keep documentation (`README.md`) and configuration files up to date.
- **Follow DRY and KISS principles.**

---

## 3. Authoring & Maintenance Protocol

- Survey existing code before extending or refactoring.
- Respect layer boundaries—tests should interact only with appropriate abstractions.
- Enforce design patterns and centralize reusable logic.
- Use data-driven approaches and avoid hardcoded values.
- Maintain lean, descriptive specs and push logic into helpers or abstractions.
- Run all quality checks locally before submission.
- **Commenting:**
  - For UI: Only add comments above functions that perform user actions (e.g., clicking).
  - For API: Only add comments above functions describing the API call’s purpose or behavior.

---

## 4. CI/CD & Reporting

- Pipelines must validate code quality, run tests, and archive reports.
- Failures in linting, formatting, or tests should block merges.
- Maintain observability through Allure and HTML reports.

---

## 5. Documentation & Coding Standards

- Keep documentation current with every change.
- Follow established coding standards, naming conventions, and TypeScript best practices.
- Centralize selectors, endpoints, and configuration.
- Apply DRY and KISS principles throughout the codebase.

---

## 6. Extensibility

- For specialized technical topics (e.g., locator strategies, assertion patterns, custom utilities), refer to dedicated instruction modules.
- The Copilot agent should always consult the relevant technical instruction when performing tasks in those areas.

---

## 7. Pre-Submission Checklist

- Ensure all abstractions, data, and documentation are in place.
- Validate code and reports locally.
- Confirm compliance with all standards and protocols.

---

## 8. References

- [Playwright Docs](https://playwright.dev/docs/intro)
- [Allure Playwright Integration](https://github.com/allure-framework/allure-js)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

**Note:**  
For technical implementation details (e.g., locator patterns, assertion best practices, custom reporting), refer to the corresponding technical instruction document inside the instructions folder.

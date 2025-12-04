# Playwright TypeScript Automation Framework

A base test automation framework for API and UI tests using Playwright with TypeScript.

## Project Structure

```
src/
├── tests/
│   ├── api/          # API test files
│   └── ui/           # UI test files
├── pages/            # Page Object Model classes
├── helpers/          # Helper classes (API, etc.)
├── fixtures/         # Custom test fixtures
├── utils/            # Utility functions
└── data/             # Test data

```

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env` file from `.env.example`:
   ```bash
   cp .env.example .env
   ```

## Running Tests

- Run all tests:
  ```bash
  npm test
  ```

- Run API tests only:
  ```bash
  npm run test:api
  ```

- Run UI tests only:
  ```bash
  npm run test:ui
  ```

- Run tests in headed mode:
  ```bash
  npm run test:headed
  ```

## Structure Overview

- **pages/**: Page Object Model for UI tests
- **helpers/**: API and other helper classes
- **fixtures/**: Custom Playwright test fixtures
- **utils/**: Utility functions like logger
- **data/**: Test data and constants

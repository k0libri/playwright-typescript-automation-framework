import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * Centralized configuration for test execution
 */
const config = {
  api: {
    backend: {
      baseUrl: process.env['BACKEND_API_BASE_URL'] ?? 'https://automationexercise.com/api',
    },
    standalone: {
      baseUrl: process.env['RESTFUL_BOOKER_BASE_URL'] ?? 'https://restful-booker.herokuapp.com',
    },
  },
  ui: {
    baseUrl: process.env['UI_BASE_URL'] ?? 'https://automationexercise.com',
  },
  timeouts: {
    apiTest: 60000, // 60 seconds for API tests
    e2eTest: 60000, // 60 seconds for E2E tests (optimized)
    action: 30000, // 30 seconds for actions
    navigation: 30000, // 30 seconds for navigation
  },
  storageStatePath: '.auth/state.json',
};

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env['CI'],
  /* Retry on CI only */
  retries: process.env['CI'] ? 2 : 0,
  /* Use parallel execution for faster test runs */
  workers: process.env['CI'] ? 2 : 4,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    [
      'allure-playwright',
      {
        outputFolder: 'allure-results',
        suiteTitle: 'Playwright Automation Exercise Tests',
      },
    ],
    ['github'], // GitHub Actions reporter - auto summary
    ['list'],
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Collect trace when retrying the failed test. */
    trace: 'retain-on-failure',
    /* Take screenshot only on failures */
    screenshot: 'only-on-failure',
    /* Record video on first retry */
    video: 'retain-on-failure',
  },
  /* Configure projects for API and UI tests */
  projects: [
    {
      name: 'api-standalone',
      testDir: './tests/api/specs',
      testMatch: '**/standalone/**/*.spec.ts',
      timeout: config.timeouts.apiTest,
      fullyParallel: true,
      use: {
        baseURL: config.api.standalone.baseUrl,
      },
    },
    {
      name: 'api-backend',
      testDir: './tests/api/specs',
      testMatch: '**/backend/**/*.spec.ts',
      timeout: config.timeouts.apiTest,
      fullyParallel: true,
      use: {
        baseURL: config.api.backend.baseUrl,
      },
    },
    {
      name: 'ui',
      testDir: './tests/ui/specs',
      testMatch: '**/*.spec.ts',
      timeout: config.timeouts.e2eTest,
      fullyParallel: false,
      use: {
        ...devices['Desktop Chrome'],
        baseURL: config.ui.baseUrl,
        actionTimeout: config.timeouts.action,
        navigationTimeout: config.timeouts.navigation,
      },
    },
  ],
});

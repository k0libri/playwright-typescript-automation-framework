import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: 1,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [['html'], ['allure-playwright']],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    // baseURL: 'http://localhost:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  /* Test timeout increased to handle slower page loads */
  timeout: 60000,

  /* Configure projects for major browsers */
  projects: [
    // Setup project - run once to capture cookie consent state
    {
      name: 'setup',
      testDir: './tests/auth',
      testMatch: '**/cookieConsent.setup.ts',
      use: {
        baseURL: 'https://automationexercise.com',
      },
    },
    {
      name: 'api',
      testDir: './tests/api',
      timeout: 30000,
      use: {
        baseURL: 'https://restful-booker.herokuapp.com',
      },
    },
    {
      name: 'e2e',
      testDir: './tests/ui',
      timeout: 90000,
      fullyParallel: false,
      dependencies: ['setup'], // Run setup first
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'https://automationexercise.com',
        actionTimeout: 15000,
        navigationTimeout: 30000,
        // Use saved storage state to avoid cookie consent modal
        storageState: '.auth/cookie-consent-state.json',
      },
    },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});

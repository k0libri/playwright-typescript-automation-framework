import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: false,
  /* Retry on CI only */
  retries: 0,
  /* Opt out of parallel tests on CI. */
  workers: undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html'],
    ['allure-playwright']
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  /* Default shared settings */
  use: {
    trace: 'on-first-retry',
  },

  /* Configure separate projects for API and UI */
  projects: [
    {
      name: 'API',
      testMatch: /.*api\/.+\.spec\.ts$/,
      use: {
        baseURL: 'https://restful-booker.herokuapp.com',
        ...devices['Desktop Chrome'],
      },
    },
    {
      name: 'UI',
      testMatch: /.*ui\/.+\.spec\.ts$/,
      use: {
        baseURL: 'https://automationexercise.com',
        ...devices['Desktop Chrome'],
      },
    },
    // You can add more browser projects as needed
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});

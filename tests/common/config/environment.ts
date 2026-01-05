/**
 * Environment Configuration
 * Centralized environment settings and URLs for UI and API testing
 */

export const Environment = {
  // UI Testing
  BASE_URL: process.env['BASE_URL'] ?? 'https://automationexercise.com',

  // Backend API (for UI validation)
  API_BASE_URL: process.env['BACKEND_API_BASE_URL'] ?? 'https://automationexercise.com/api',

  // Standalone API (restful-booker)
  RESTFUL_BOOKER_BASE_URL:
    process.env['RESTFUL_BOOKER_BASE_URL'] ?? 'https://restful-booker.herokuapp.com',

  // General Settings
  TIMEOUT: parseInt(process.env['TIMEOUT'] ?? '30000'),
  HEADLESS: process.env['HEADLESS'] !== 'false',
  BROWSER: process.env['BROWSER'] ?? 'chromium',
} as const;

export const TestConfig = {
  RETRY_COUNT: process.env['CI'] ? 2 : 0,
  WORKERS: process.env['CI'] ? 1 : undefined,
  SCREENSHOT_MODE: process.env['SCREENSHOT_MODE'] ?? 'only-on-failure',
  VIDEO_MODE: process.env['VIDEO_MODE'] ?? 'retain-on-failure',
} as const;

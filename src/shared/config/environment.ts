/**
 * Environment Configuration
 * Centralized environment settings and URLs
 */

export const Environment = {
  BASE_URL: process.env.BASE_URL ?? 'https://automationexercise.com',
  API_BASE_URL: process.env.API_BASE_URL ?? 'https://automationexercise.com/api',
  TIMEOUT: parseInt(process.env.TIMEOUT ?? '30000'),
  HEADLESS: process.env.HEADLESS !== 'false',
  BROWSER: process.env.BROWSER ?? 'chromium'
} as const;

export const TestConfig = {
  RETRY_COUNT: process.env.CI ? 2 : 0,
  WORKERS: process.env.CI ? 1 : undefined,
  SCREENSHOT_MODE: process.env.SCREENSHOT_MODE ?? 'only-on-failure',
  VIDEO_MODE: process.env.VIDEO_MODE ?? 'retain-on-failure'
} as const;

/**
 * Test Data for UI Tests
 * Centralized test data to avoid hardcoding in specs
 * Note: baseURL is configured in playwright.config.ts
 */

export const URLs = {
  HOME: '/',
  LOGIN: '/login',
  PRODUCTS: '/products',
  CONTACT: '/contact_us',
  TEST_CASES: '/test_cases',
} as const;

export const ExpectedTexts = {
  PAGE_TITLE: 'Automation Exercise',
  COOKIE_CONSENT_TEXTS: [
    'This site uses cookies',
    'We use cookies',
    'Accept cookies',
    'Cookie policy',
    'Privacy policy',
  ],
  ACCEPT_BUTTON_TEXTS: ['Accept', 'Accept all', 'I Accept', 'I Agree', 'Allow all', 'OK', 'Got it'],
} as const;

export const TestUsers = {
  NEWSLETTER_EMAIL: 'test@example.com',
  VALID_EMAIL: 'testuser@automation.com',
  INVALID_EMAIL: 'invalid-email',
} as const;

export const ScreenshotPaths = {
  COOKIE_DEBUG: 'test-results/cookie-debug.png',
  COOKIE_CLICK_FAILED: 'test-results/cookie-click-failed.png',
  NO_COOKIE_BANNER: 'test-results/no-cookie-banner.png',
  TEST_FAILURE: 'test-results/test-failure.png',
} as const;

// Re-export HTTP status codes from the central location
export { HttpStatus, ResponseCode } from '../../api/base/httpStatus';

export interface ApiErrorResponse {
  responseCode: number;
  message: string;
}

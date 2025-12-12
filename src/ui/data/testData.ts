/**
 * Test Data for UI Tests
 * Centralized test data to avoid hardcoding in specs
 */

export const URLs = {
  BASE_URL: 'https://automationexercise.com/',
  LOGIN_URL: 'https://automationexercise.com/login',
  PRODUCTS_URL: 'https://automationexercise.com/products',
  CONTACT_URL: 'https://automationexercise.com/contact_us',
  TEST_CASES_URL: 'https://automationexercise.com/test_cases',
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

export const Timeouts = {
  SHORT: 5000,
  MEDIUM: 10000,
  LONG: 30000,
  COOKIE_CONSENT_WAIT: 3000,
  BANNER_DISAPPEAR_WAIT: 2000,
} as const;

export const ScreenshotPaths = {
  COOKIE_DEBUG: 'test-results/cookie-debug.png',
  COOKIE_CLICK_FAILED: 'test-results/cookie-click-failed.png',
  NO_COOKIE_BANNER: 'test-results/no-cookie-banner.png',
  TEST_FAILURE: 'test-results/test-failure.png',
} as const;

export const HttpStatus = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
} as const;

export const ApiResponseCodes = {
  NOT_FOUND: 404,
  OK: 200,
  CREATED: 201,
} as const;

export interface ApiErrorResponse {
  responseCode: number;
  message: string;
}

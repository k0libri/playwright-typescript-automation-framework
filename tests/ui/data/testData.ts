/**
 * Test Data for UI Tests
 * Centralized test data to avoid hardcoding in specs
 * Note: baseURL is configured in playwright.config.ts
 */

// Re-export HTTP status codes from the http-status-codes package
export { StatusCodes } from 'http-status-codes';

/**
 * Custom Response Codes
 * Application-specific response codes returned in JSON body
 */
export const ResponseCode = {
  SUCCESS: 200,
  CREATED: 201,
  NOT_FOUND: 404,
  CONFLICT: 409,
} as const;

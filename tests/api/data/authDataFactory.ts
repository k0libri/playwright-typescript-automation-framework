import { faker } from '@faker-js/faker';
import type { AuthCredentials } from './types';

/**
 * Auth API error messages
 */
export const AUTH_ERROR_MESSAGES = {
  BAD_CREDENTIALS: 'Bad credentials',
} as const;

/**
 * Auth response validation constants
 */
export const AUTH_VALIDATION = {
  TOKEN_TYPE: 'string',
  MIN_TOKEN_LENGTH: 0,
} as const;

/**
 * Generate invalid auth credentials for negative testing
 * @returns AuthCredentials - Object with random invalid username and password
 */
export function generateInvalidCredentials(): AuthCredentials {
  return {
    username: faker.internet.displayName(),
    password: faker.internet.password(),
  };
}

/**
 * Generate credentials with missing username
 * @returns AuthCredentials - Object with empty username and random password
 */
export function generateMissingUsernameCredentials(): AuthCredentials {
  return {
    username: '',
    password: faker.internet.password(),
  };
}

/**
 * Generate credentials with missing password
 * @returns AuthCredentials - Object with random username and empty password
 */
export function generateMissingPasswordCredentials(): AuthCredentials {
  return {
    username: faker.internet.displayName(),
    password: '',
  };
}

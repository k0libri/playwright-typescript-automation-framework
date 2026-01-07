import { test, expect } from '../../fixtures/apiFixtures';
import { StatusCodes } from 'http-status-codes';
import {
  AUTH_ERROR_MESSAGES,
  AUTH_VALIDATION,
  generateInvalidCredentials,
  generateMissingPasswordCredentials,
  generateMissingUsernameCredentials,
} from '../../data/authDataFactory';

/**
 * Authentication API Tests
 * Tests authentication endpoints for token generation and validation
 */
test.describe('Authentication API @api @standalone @critical', () => {
  test('should successfully authenticate with valid credentials', async ({
    authService,
    defaultCredentials,
  }) => {
    const response = await authService.createToken(defaultCredentials);

    expect.soft(response.status()).toBe(StatusCodes.OK);

    const responseBody = await response.json();
    expect.soft(responseBody.token).toBeTruthy();
    expect.soft(typeof responseBody.token).toBe(AUTH_VALIDATION.TOKEN_TYPE);
    expect(responseBody.token.length).toBeGreaterThan(AUTH_VALIDATION.MIN_TOKEN_LENGTH);
  });

  test('should fail authentication with invalid credentials', async ({ authService }) => {
    const invalidCredentials = generateInvalidCredentials();

    const response = await authService.createToken(invalidCredentials);

    expect.soft(response.status()).toBe(StatusCodes.OK);

    const responseBody = await response.json();
    expect(responseBody.reason).toBe(AUTH_ERROR_MESSAGES.BAD_CREDENTIALS);
  });

  test('should fail authentication with missing username', async ({ authService }) => {
    const incompleteCredentials = generateMissingUsernameCredentials();

    const response = await authService.createToken(incompleteCredentials);

    expect.soft(response.status()).toBe(StatusCodes.OK);

    const responseBody = await response.json();
    expect(responseBody.reason).toBe(AUTH_ERROR_MESSAGES.BAD_CREDENTIALS);
  });

  test('should fail authentication with missing password', async ({ authService }) => {
    const incompleteCredentials = generateMissingPasswordCredentials();

    const response = await authService.createToken(incompleteCredentials);

    expect.soft(response.status()).toBe(StatusCodes.OK);

    const responseBody = await response.json();
    expect(responseBody.reason).toBe(AUTH_ERROR_MESSAGES.BAD_CREDENTIALS);
  });
});

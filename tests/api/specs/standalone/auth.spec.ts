import { test, expect } from '../../apiFixtures';
import { faker } from '@faker-js/faker';
import { StatusCodes } from 'http-status-codes';

/**
 * Authentication API Tests
 * User Story: As a tester, I want to authenticate using the /auth endpoint
 * so that I can obtain a token for subsequent requests
 */
test.describe('Authentication API @api @standalone @critical', () => {
  test('should successfully authenticate with valid credentials', async ({
    authService,
    defaultCredentials,
  }) => {
    const response = await authService.createToken(defaultCredentials);

    expect.soft(response.status()).toBe(StatusCodes.OK);

    const responseBody = await response.json();
    expect.soft(responseBody).toHaveProperty('token');
    expect.soft(responseBody.token).toBeTruthy();
    expect.soft(typeof responseBody.token).toBe('string');
    expect(responseBody.token.length).toBeGreaterThan(0);
  });

  test('should fail authentication with invalid credentials', async ({ authService }) => {
    const invalidCredentials = {
      username: faker.internet.displayName(),
      password: faker.internet.password(),
    };

    const response = await authService.createToken(invalidCredentials);

    expect.soft(response.status()).toBe(StatusCodes.OK);

    const responseBody = await response.json();
    expect.soft(responseBody).toHaveProperty('reason');
    expect(responseBody.reason).toBe('Bad credentials');
  });

  test('should fail authentication with missing username', async ({ authService }) => {
    const incompleteCredentials = {
      username: '',
      password: faker.internet.password(),
    };

    const response = await authService.createToken(incompleteCredentials);

    expect.soft(response.status()).toBe(StatusCodes.OK);

    const responseBody = await response.json();
    expect.soft(responseBody).toHaveProperty('reason');
    expect(responseBody.reason).toBe('Bad credentials');
  });

  test('should fail authentication with missing password', async ({ authService }) => {
    const incompleteCredentials = {
      username: 'admin',
      password: '',
    };

    const response = await authService.createToken(incompleteCredentials);

    expect.soft(response.status()).toBe(StatusCodes.OK);

    const responseBody = await response.json();
    expect.soft(responseBody).toHaveProperty('reason');
    expect(responseBody.reason).toBe('Bad credentials');
  });
});

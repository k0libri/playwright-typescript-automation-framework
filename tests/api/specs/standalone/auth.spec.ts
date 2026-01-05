import { test, expect } from '../../apiFixtures';
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
    await test.step('Send authentication request with valid credentials', async () => {
      const response = await authService.createToken(defaultCredentials);

      expect(response.status()).toBe(StatusCodes.OK);

      const responseBody = await response.json();
      expect(responseBody).toHaveProperty('token');
      expect(responseBody.token).toBeTruthy();
      expect(typeof responseBody.token).toBe('string');
      expect(responseBody.token.length).toBeGreaterThan(0);
    });
  });

  test('should fail authentication with invalid credentials', async ({ authService }) => {
    await test.step('Send authentication request with invalid credentials', async () => {
      const invalidCredentials = {
        username: 'invalid_user',
        password: 'wrong_password',
      };

      const response = await authService.createToken(invalidCredentials);

      expect(response.status()).toBe(StatusCodes.OK);

      const responseBody = await response.json();
      expect(responseBody).toHaveProperty('reason');
      expect(responseBody.reason).toBe('Bad credentials');
    });
  });

  test('should fail authentication with missing username', async ({ authService }) => {
    await test.step('Send authentication request without username', async () => {
      const incompleteCredentials = {
        username: '',
        password: 'password123',
      };

      const response = await authService.createToken(incompleteCredentials);

      expect(response.status()).toBe(StatusCodes.OK);

      const responseBody = await response.json();
      expect(responseBody).toHaveProperty('reason');
      expect(responseBody.reason).toBe('Bad credentials');
    });
  });

  test('should fail authentication with missing password', async ({ authService }) => {
    await test.step('Send authentication request without password', async () => {
      const incompleteCredentials = {
        username: 'admin',
        password: '',
      };

      const response = await authService.createToken(incompleteCredentials);

      expect(response.status()).toBe(StatusCodes.OK);

      const responseBody = await response.json();
      expect(responseBody).toHaveProperty('reason');
      expect(responseBody.reason).toBe('Bad credentials');
    });
  });
});

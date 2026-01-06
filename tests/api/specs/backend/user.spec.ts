import { test, expect } from '../../backendFixtures';
import { StatusCodes } from 'http-status-codes';

/**
 * User API Tests - Backend API validation for UI testing
 * Tests user-related API endpoints for automationexercise.com
 */
test.describe('User Backend API @api @backend @critical', () => {
  test('should create user account via API', async ({ userService, uniqueUserData }) => {
    const response = await userService.createUser(uniqueUserData);

    expect.soft(response.status()).toBe(StatusCodes.OK);

    const responseJson = await response.json();
    expect.soft(responseJson.responseCode).toBe(StatusCodes.CREATED);
    expect(responseJson.message).toContain('User created!');

    const getUserResponse = await userService.getUserByEmail(uniqueUserData.email);
    expect.soft(getUserResponse.status()).toBe(StatusCodes.OK);

    const userData = await getUserResponse.json();
    expect.soft(userData).toHaveProperty('user');
    expect.soft(userData.user.email).toBe(uniqueUserData.email);
    expect(userData.user.name).toBe(uniqueUserData.name);

    await userService.cleanupUser(uniqueUserData.email, uniqueUserData.password);
  });

  test('should verify login with valid credentials', async ({ userService, uniqueUserData }) => {
    const response = await userService.createUser(uniqueUserData);
    expect.soft(response.status()).toBe(StatusCodes.OK);
    const responseJson = await response.json();
    expect(responseJson.responseCode).toBe(StatusCodes.CREATED);

    const loginResponse = await userService.verifyLogin(
      uniqueUserData.email,
      uniqueUserData.password,
    );
    expect.soft(loginResponse.status()).toBe(StatusCodes.OK);

    const loginResponseJson = await loginResponse.json();
    expect.soft(loginResponseJson.responseCode).toBe(StatusCodes.OK);
    expect(loginResponseJson.message).toContain('User exists!');

    await userService.cleanupUser(uniqueUserData.email, uniqueUserData.password);
  });

  test('should return error for invalid login credentials', async ({ userService }) => {
    const loginResponse = await userService.verifyLogin('invalid@email.com', 'wrongpassword');
    expect.soft(loginResponse.status()).toBe(StatusCodes.OK);

    const responseJson = await loginResponse.json();
    expect.soft(responseJson.responseCode).toBe(StatusCodes.NOT_FOUND);
    expect(responseJson.message).toContain('User not found!');
  });

  test('should get user details by email', async ({ userService, uniqueUserData }) => {
    const response = await userService.createUser(uniqueUserData);
    expect.soft(response.status()).toBe(StatusCodes.OK);
    const responseJson = await response.json();
    expect(responseJson.responseCode).toBe(StatusCodes.CREATED);

    const getUserResponse = await userService.getUserByEmail(uniqueUserData.email);
    expect.soft(getUserResponse.status()).toBe(StatusCodes.OK);

    const userData = await getUserResponse.json();
    expect.soft(userData).toHaveProperty('user');
    expect.soft(userData.user.email).toBe(uniqueUserData.email);
    expect.soft(userData.user.name).toBe(uniqueUserData.name);
    expect.soft(userData.user.first_name).toBe(uniqueUserData.firstname);
    expect(userData.user.last_name).toBe(uniqueUserData.lastname);

    await userService.cleanupUser(uniqueUserData.email, uniqueUserData.password);
  });

  test('should return error for non-existent user email', async ({ userService }) => {
    const getUserResponse = await userService.getUserByEmail('nonexistent@test.com');
    expect.soft(getUserResponse.status()).toBe(StatusCodes.OK);

    const responseJson = await getUserResponse.json();
    expect.soft(responseJson.responseCode).toBe(StatusCodes.NOT_FOUND);
    expect(responseJson.message).toContain('Account not found');
  });
});

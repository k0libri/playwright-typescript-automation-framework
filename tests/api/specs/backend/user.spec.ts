import { test, expect } from '../../fixtures/backendFixtures';
import { StatusCodes } from 'http-status-codes';
import { faker } from '@faker-js/faker';
import { ServiceFactory } from '../../factories/serviceFactory';
import { UserDataFactory } from '../../../common/utils/userDataFactory';

/**
 * User API Tests - Backend API validation for UI testing
 * Tests user-related API endpoints for automationexercise.com
 */
test.describe('User Backend API @api @backend @critical', () => {
  test.describe('Positive Test Cases @smoke', () => {
    let testUser: ReturnType<typeof UserDataFactory.generateUserData>;
    let createdUserResponse: { status: number; responseCode: number; message: string };

    test.beforeAll(async () => {
      testUser = UserDataFactory.generateUserData();
      const response = await ServiceFactory.user.createUser(testUser);
      const responseJson = await response.json();
      createdUserResponse = {
        status: response.status,
        responseCode: responseJson.responseCode,
        message: responseJson.message,
      };
    });

    test.afterAll(async () => {
      await ServiceFactory.user.deleteUser(testUser.email, testUser.password);
    });

    test('should create user account via API', async () => {
      expect.soft(createdUserResponse.status).toBe(StatusCodes.OK);
      expect.soft(createdUserResponse.responseCode).toBe(StatusCodes.CREATED);
      expect(createdUserResponse.message).toContain('User created!');
    });

    test('should verify login with valid credentials', async ({ userService }) => {
      const loginResponse = await userService.verifyLogin(testUser.email, testUser.password);
      expect.soft(loginResponse.status()).toBe(StatusCodes.OK);

      const loginResponseJson = await loginResponse.json();
      expect.soft(loginResponseJson.responseCode).toBe(StatusCodes.OK);
      expect(loginResponseJson.message).toContain('User exists!');
    });

    test('should get user details by email', async ({ userService }) => {
      const getUserResponse = await userService.getUserByEmail(testUser.email);
      expect.soft(getUserResponse.status()).toBe(StatusCodes.OK);

      const userData = await getUserResponse.json();
      expect.soft(userData.user.email).toBe(testUser.email);
      expect.soft(userData.user.name).toBe(testUser.name);
      expect.soft(userData.user.first_name).toBe(testUser.firstname);
      expect(userData.user.last_name).toBe(testUser.lastname);
    });
  });

  test.describe('Negative Test Cases @negative', () => {
    test('should return error for invalid login credentials', async ({ userService }) => {
      const loginResponse = await userService.verifyLogin(
        faker.internet.email(),
        faker.internet.password(),
      );
      expect.soft(loginResponse.status()).toBe(StatusCodes.OK);

      const responseJson = await loginResponse.json();
      expect.soft(responseJson.responseCode).toBe(StatusCodes.NOT_FOUND);
      expect(responseJson.message).toContain('User not found!');
    });

    test('should return error for non-existent user email', async ({ userService }) => {
      const getUserResponse = await userService.getUserByEmail(faker.internet.email());
      expect.soft(getUserResponse.status()).toBe(StatusCodes.OK);

      const responseJson = await getUserResponse.json();
      expect.soft(responseJson.responseCode).toBe(StatusCodes.NOT_FOUND);
      expect(responseJson.message).toContain('Account not found');
    });
  });
});

import { test, expect } from '../../fixtures/apiFixtures';
import { HttpStatus, ResponseCode } from '../../base/httpStatus';

/**
 * User API Tests - Direct API validation
 * Tests user-related API endpoints independently
 */
test.describe('User API @api @critical', () => {
  test('should create user account via API', async ({ userService, uniqueUserData }) => {
    await test.step('Create user account via API', async () => {
      const response = await userService.createUser(uniqueUserData);

      expect(response.status()).toBe(HttpStatus.OK);

      const responseJson = await response.json();
      expect(responseJson.responseCode).toBe(ResponseCode.CREATED);
      expect(responseJson.message).toContain('User created!');
    });

    await test.step('Verify user creation by fetching user details', async () => {
      const getUserResponse = await userService.getUserByEmail(uniqueUserData.email);
      expect(getUserResponse.status()).toBe(HttpStatus.OK);

      const userData = await getUserResponse.json();
      expect(userData).toHaveProperty('user');
      expect(userData.user.email).toBe(uniqueUserData.email);
      expect(userData.user.name).toBe(uniqueUserData.name);
    });

    await test.step('Cleanup: Delete test user', async () => {
      try {
        await userService.deleteUser(uniqueUserData.email, uniqueUserData.password);
      } catch (error) {
        console.log('Cleanup failed:', error);
      }
    });
  });

  test('should verify login with valid credentials', async ({ userService, uniqueUserData }) => {
    await test.step('Create user for login test', async () => {
      const response = await userService.createUser(uniqueUserData);
      expect(response.status()).toBe(HttpStatus.OK);
      const responseJson = await response.json();
      expect(responseJson.responseCode).toBe(ResponseCode.CREATED);
      console.log('Test user created:', uniqueUserData.email);
    });

    await test.step('Verify login with valid credentials', async () => {
      const loginResponse = await userService.verifyLogin(
        uniqueUserData.email,
        uniqueUserData.password
      );
      expect(loginResponse.status()).toBe(HttpStatus.OK);

      const responseJson = await loginResponse.json();
      expect(responseJson.responseCode).toBe(ResponseCode.SUCCESS);
      expect(responseJson.message).toContain('User exists!');
    });

    await test.step('Cleanup: Delete test user', async () => {
      try {
        await userService.deleteUser(uniqueUserData.email, uniqueUserData.password);
      } catch (error) {
        console.log('Cleanup failed:', error);
      }
    });
  });

  test('should return error for invalid login credentials', async ({ userService }) => {
    await test.step('Attempt login with invalid credentials', async () => {
      const loginResponse = await userService.verifyLogin('invalid@email.com', 'wrongpassword');
      expect(loginResponse.status()).toBe(HttpStatus.OK);

      const responseJson = await loginResponse.json();
      expect(responseJson.responseCode).toBe(ResponseCode.NOT_FOUND);
      expect(responseJson.message).toContain('User not found!');
    });
  });

  test('should get user details by email', async ({ userService, uniqueUserData }) => {
    await test.step('Create user for details test', async () => {
      const response = await userService.createUser(uniqueUserData);
      expect(response.status()).toBe(HttpStatus.OK);
      const responseJson = await response.json();
      expect(responseJson.responseCode).toBe(ResponseCode.CREATED);
      console.log('Test user created:', uniqueUserData.email);
    });

    await test.step('Get user details by email', async () => {
      const getUserResponse = await userService.getUserByEmail(uniqueUserData.email);
      expect(getUserResponse.status()).toBe(HttpStatus.OK);

      const userData = await getUserResponse.json();
      expect(userData).toHaveProperty('user');
      expect(userData.user.email).toBe(uniqueUserData.email);
      expect(userData.user.name).toBe(uniqueUserData.name);
      expect(userData.user.first_name).toBe(uniqueUserData.firstname);
      expect(userData.user.last_name).toBe(uniqueUserData.lastname);
    });

    await test.step('Cleanup: Delete test user', async () => {
      try {
        await userService.deleteUser(uniqueUserData.email, uniqueUserData.password);
      } catch (error) {
        console.log('Cleanup failed:', error);
      }
    });
  });

  test('should return error for non-existent user email', async ({ userService }) => {
    await test.step('Get details for non-existent user', async () => {
      const getUserResponse = await userService.getUserByEmail('nonexistent@test.com');
      expect(getUserResponse.status()).toBe(HttpStatus.OK);

      const responseJson = await getUserResponse.json();
      expect(responseJson.responseCode).toBe(ResponseCode.NOT_FOUND);
      expect(responseJson.message).toContain('Account not found');
    });
  });
});

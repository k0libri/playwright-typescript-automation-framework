import { test, expect } from '../../fixtures/apiFixtures';

/**
 * User API Tests - Direct API validation
 * Tests user-related API endpoints independently
 */
test.describe('User API @api @critical', () => {
  test.beforeAll(async () => {
    console.log('Starting User API test suite');
  });

  test.skip('should create user account via API', async ({ userService, uniqueUserData }) => {
    // Skipping due to CSRF protection on automation exercise API
    await test.step('Create user account via API', async () => {
      const response = await userService.createUser(uniqueUserData);

      expect(response.status()).toBe(200); // API returns 200 with JSON responseCode

      const responseJson = await response.json();
      expect(responseJson.responseCode).toBe(201);
      expect(responseJson.message).toContain('User created!');
    }); // Verify user was created
    await test.step('Verify user creation by fetching user details', async () => {
      const getUserResponse = await userService.getUserByEmail(uniqueUserData.email);
      expect(getUserResponse.status()).toBe(200);

      const userData = await getUserResponse.json();
      expect(userData).toHaveProperty('user');
      expect(userData.user.email).toBe(uniqueUserData.email);
      expect(userData.user.name).toBe(uniqueUserData.name);
    });

    // Cleanup
    await test.step('Cleanup: Delete test user', async () => {
      try {
        await userService.deleteUser(uniqueUserData.email, uniqueUserData.password);
      } catch (error) {
        console.log('Cleanup failed:', error);
      }
    });
  });

  test.skip('should verify login with valid credentials', async ({
    userService,
    uniqueUserData,
  }) => {
    // Skipping due to CSRF protection on automation exercise API
    // First create a user
    await test.step('Create user for login test', async () => {
      const response = await userService.createUser(uniqueUserData);
      expect(response.status()).toBe(200);
      const responseJson = await response.json();
      expect(responseJson.responseCode).toBe(201);
    });

    // Verify login
    await test.step('Verify login with valid credentials', async () => {
      const loginResponse = await userService.verifyLogin(
        uniqueUserData.email,
        uniqueUserData.password,
      );
      expect(loginResponse.status()).toBe(200);

      const responseJson = await loginResponse.json();
      expect(responseJson.responseCode).toBe(200);
      expect(responseJson.message).toContain('User exists!');
    });

    // Cleanup
    await test.step('Cleanup: Delete test user', async () => {
      try {
        await userService.deleteUser(uniqueUserData.email, uniqueUserData.password);
      } catch (error) {
        console.log('Cleanup failed:', error);
      }
    });
  });

  test.skip('should return error for invalid login credentials', async ({ userService }) => {
    // Skipping due to CSRF protection on automation exercise API
    await test.step('Attempt login with invalid credentials', async () => {
      const loginResponse = await userService.verifyLogin('invalid@email.com', 'wrongpassword');
      expect(loginResponse.status()).toBe(200);

      const responseJson = await loginResponse.json();
      expect(responseJson.responseCode).toBe(404);
      expect(responseJson.message).toContain('User not found!');
    });
  });

  test.skip('should get user details by email', async ({ userService, uniqueUserData }) => {
    // Skipping due to CSRF protection on automation exercise API
    // First create a user
    await test.step('Create user for details test', async () => {
      const response = await userService.createUser(uniqueUserData);
      expect(response.status()).toBe(200);
      const responseJson = await response.json();
      expect(responseJson.responseCode).toBe(201);
    });

    // Get user details
    await test.step('Get user details by email', async () => {
      const getUserResponse = await userService.getUserByEmail(uniqueUserData.email);
      expect(getUserResponse.status()).toBe(200);

      const userData = await getUserResponse.json();
      expect(userData).toHaveProperty('user');
      expect(userData.user.email).toBe(uniqueUserData.email);
      expect(userData.user.name).toBe(uniqueUserData.name);
      expect(userData.user.first_name).toBe(uniqueUserData.firstname);
      expect(userData.user.last_name).toBe(uniqueUserData.lastname);
    });

    // Cleanup
    await test.step('Cleanup: Delete test user', async () => {
      try {
        await userService.deleteUser(uniqueUserData.email, uniqueUserData.password);
      } catch (error) {
        console.log('Cleanup failed:', error);
      }
    });
  });

  test.skip('should return error for non-existent user email', async ({ userService }) => {
    // Skipping due to CSRF protection on automation exercise API
    await test.step('Get details for non-existent user', async () => {
      const getUserResponse = await userService.getUserByEmail('nonexistent@email.com');
      expect(getUserResponse.status()).toBe(200);

      const responseJson = await getUserResponse.json();
      expect(responseJson.responseCode).toBe(404);
      expect(responseJson.message).toContain('User not found!');
    });
  });
});

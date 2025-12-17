import { test, expect } from '../fixtures';
import { UserService } from '../../services/UserService';
import { UserFactory } from '../test-data/UserFactory';
import { TEST_DATA } from '../test-data/testData';

test.describe('User API Tests', () => {
  let userService: UserService;

  test.beforeEach(({ request }) => {
    userService = new UserService(request);
  });

  test('API-001: Should create a new user account via API', async () => {
    await test.step('Create user with valid data', async () => {
      const newUser = UserFactory.createRandomUser();
      const response = await userService.createUser(newUser);

      // Verify response
      expect(response).toHaveProperty('responseCode');
      expect(response.responseCode).toBe(201);
      expect(response).toHaveProperty('message');
      expect(response.message).toContain('User created!');
    });
  });

  test('API-002: Should verify user login with valid credentials', async () => {
    await test.step('Create user and verify login with valid credentials', async () => {
      const newUser = UserFactory.createRandomUser();
      await userService.createUser(newUser);

      // Verify login
      const loginResponse = await userService.verifyLogin(newUser.email, newUser.password!);

      expect(loginResponse).toHaveProperty('responseCode');
      expect(loginResponse.responseCode).toBe(200);
      expect(loginResponse).toHaveProperty('message');
      expect(loginResponse.message).toContain('User exists!');
    });
  });

  test('API-003: Should reject login with invalid credentials', async () => {
    await test.step('Attempt login with non-existent user', async () => {
      const invalidUser = UserFactory.createRandomUser();
      const response = await userService.verifyLogin(
        invalidUser.email,
        TEST_DATA.AUTH.INVALID_PASSWORD,
      );

      expect(response).toHaveProperty('responseCode');
      expect(response.responseCode).toBe(404);
      expect(response).toHaveProperty('message');
      expect(response.message).toContain('User not found!');
    });
  });

  test('API-004: Should get user details by email', async () => {
    await test.step('Create user and retrieve details', async () => {
      const newUser = UserFactory.createRandomUser();
      await userService.createUser(newUser);

      // Get user details
      const response = await userService.getUserByEmail(newUser.email);

      expect(response).toHaveProperty('responseCode');
      expect(response.responseCode).toBe(200);
      expect(response).toHaveProperty('user');
      expect(response.user).toHaveProperty('email', newUser.email);
      expect(response.user).toHaveProperty('name', newUser.name);
    });
  });

  test('API-005: Should update user account information', async () => {
    await test.step('Create user and update information', async () => {
      const newUser = UserFactory.createRandomUser();
      await userService.createUser(newUser);

      // Update user information
      const updatedUser = {
        ...newUser,
        name: TEST_DATA.USER_UPDATES.NAME,
        company: TEST_DATA.USER_UPDATES.COMPANY,
      };

      const response = await userService.updateUser(updatedUser);

      expect(response).toHaveProperty('responseCode');
      expect(response.responseCode).toBe(200);
      expect(response).toHaveProperty('message');
      expect(response.message).toContain('User updated!');
    });
  });

  test('API-006: Should delete user account', async () => {
    await test.step('Create user and delete account', async () => {
      const newUser = UserFactory.createRandomUser();
      await userService.createUser(newUser);

      // Delete user
      const response = await userService.deleteUser(newUser.email, newUser.password!);

      expect(response).toHaveProperty('responseCode');
      expect(response.responseCode).toBe(200);
      expect(response).toHaveProperty('message');
      expect(response.message).toContain('Account deleted!');
    });
  });

  test('API-007: Should reject user creation with missing required fields', async () => {
    await test.step('Attempt to create user with missing required fields', async () => {
      const invalidUser = UserFactory.createInvalidUser();

      const response = await userService.createUser(invalidUser);

      expect(response).toHaveProperty('responseCode');
      expect(response.responseCode).toBe(400);
    });
  });

  test('API-008: Should prevent duplicate user creation', async () => {
    await test.step('Create user twice with same email', async () => {
      const timestamp = Date.now();
      const user = UserFactory.createUserWithEmail(`duplicate-${timestamp}@test.com`);

      // Create user first time
      const firstResponse = await userService.createUser(user);
      expect(firstResponse.responseCode).toBe(201);

      // Attempt to create same user again
      const duplicateResponse = await userService.createUser(user);
      expect(duplicateResponse.responseCode).toBe(400);
      expect(duplicateResponse.message).toContain('Email already exists!');
    });
  });

  test('API-009: Should verify login fails without email parameter', async () => {
    await test.step('Attempt login without email', async () => {
      // This test verifies API validation
      const response = await userService.verifyLogin(
        TEST_DATA.AUTH.EMPTY_EMAIL,
        TEST_DATA.VALID_USER.PASSWORD,
      );

      expect(response).toHaveProperty('responseCode');
      expect(response.responseCode).toBe(404);
      expect(response).toHaveProperty('message');
    });
  });

  test('API-010: Should verify delete fails with incorrect password', async () => {
    await test.step('Create user and attempt delete with wrong password', async () => {
      const newUser = UserFactory.createRandomUser();
      await userService.createUser(newUser);

      // Attempt delete with wrong password
      const response = await userService.deleteUser(newUser.email, TEST_DATA.AUTH.INVALID_PASSWORD);

      expect(response).toHaveProperty('responseCode');
      expect(response.responseCode).toBe(404);
      expect(response).toHaveProperty('message');
      expect(response.message).toContain('Account not found');
    });
  });
});

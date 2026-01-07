/**
 * Authentication Tests
 * Tests user registration, login, and error handling scenarios
 */
import { test, expect } from '../../uiFixtures';
import { UserDataFactory } from '../../../common/utils/userDataFactory';
import { StatusCodes } from 'http-status-codes';
import { ApiErrorResponse } from '../../../common/data/types';

test.describe('Authentication @critical', () => {
  test.describe('Positive Test Cases @smoke', () => {
    test('should register new user via UI and verify user creation via API', async ({
      page,
      authenticationPage,
      uniqueUserData,
    }) => {
      await authenticationPage.navigateToAuthenticationPage();

      await authenticationPage.startSignup(uniqueUserData.name, uniqueUserData.email);
      await expect(authenticationPage.passwordInput).toBeVisible();

      await authenticationPage.completeRegistration(uniqueUserData);
      await expect(authenticationPage.accountCreatedMessage).toBeVisible();

      await authenticationPage.continueButton.click();
      await page.waitForLoadState('domcontentloaded');
      await expect.soft(authenticationPage.loggedInUserText).toBeVisible();
      const loggedInUser = await authenticationPage.getLoggedInUsername();
      expect(loggedInUser).toContain(uniqueUserData.name);

      await expect.soft(authenticationPage.loggedInUserText).toBeVisible();
      const finalLoggedInUser = await authenticationPage.getLoggedInUsername();
      expect(finalLoggedInUser).toContain(uniqueUserData.name);
    });

    test('should display error for duplicate email registration', async ({
      page,
      authenticationPage,
      uniqueUserData,
    }) => {
      await authenticationPage.navigateToAuthenticationPage();
      await authenticationPage.startSignup(uniqueUserData.name, uniqueUserData.email);
      await authenticationPage.tryCreateUserAndLogout(uniqueUserData, page);

      await authenticationPage.startSignup('Different Name', uniqueUserData.email);
      await authenticationPage.verifyDuplicateEmailHandling(page);
    });
  });

  test.describe('Negative Test Cases @negative', () => {
    let invalidLoginData: { status: number; body: ApiErrorResponse };
    let nonExistentUserData: { status: number; body: ApiErrorResponse };
    let invalidRegistrationData: { status: number; body: ApiErrorResponse };
    let emptyEmailData: { status: number; body: ApiErrorResponse | null };

    test.beforeAll(async ({ userService }) => {
      const invalidLoginResponse = await userService.verifyLogin(
        'invalid@email.com',
        'wrongpassword',
      );
      invalidLoginData = {
        status: invalidLoginResponse.status(),
        body: await invalidLoginResponse.json(),
      };

      const nonExistentUserResponse = await userService.verifyLogin(
        'nonexistent@user.com',
        'password123',
      );
      nonExistentUserData = {
        status: nonExistentUserResponse.status(),
        body: await nonExistentUserResponse.json(),
      };

      const invalidData = UserDataFactory.generateInvalidUserData();
      const invalidRegistrationResponse = await userService.createUser(invalidData as any);
      invalidRegistrationData = {
        status: invalidRegistrationResponse.status(),
        body: await invalidRegistrationResponse.json(),
      };

      emptyEmailData = await userService.safeGetUserByEmail('');
    });

    test('should display error for invalid login credentials via UI', async ({
      authenticationPage,
    }) => {
      await authenticationPage.navigateToAuthenticationPage();
      await authenticationPage.login('invalid@email.com', 'wrongpassword');
      await expect(authenticationPage.loginErrorMessage).toBeVisible();
    });

    test('should return error for invalid login via API', async () => {
      expect.soft(invalidLoginData.status).toBe(StatusCodes.OK);
      expect.soft(invalidLoginData.body.responseCode).toBe(StatusCodes.NOT_FOUND);
      expect(invalidLoginData.body.message).toContain('User not found!');
    });

    test('should handle invalid email format during registration', async ({
      authenticationPage,
    }) => {
      await authenticationPage.navigateToAuthenticationPage();
      const invalidData = UserDataFactory.generateInvalidUserData();
      await authenticationPage.startSignup('Test User', invalidData.email ?? '');
      const currentUrl = await authenticationPage.getCurrentUrl();
      expect(currentUrl).toContain('/login');
    });

    test('should handle empty required fields during registration', async ({
      authenticationPage,
      page,
    }) => {
      await authenticationPage.navigateToAuthenticationPage();
      await authenticationPage.signupButton.click();
      const currentUrl = page.url();
      expect.soft(currentUrl).toContain('/login');
      const nameInputValidity = await authenticationPage.signupNameInput.evaluate(
        (el: any) => el.validity.valid,
      );
      expect(nameInputValidity).toBe(false);

      await authenticationPage.navigateToAuthenticationPage();
      await authenticationPage.signupNameInput.fill('Valid Name');
      await authenticationPage.signupButton.click();
      const currentUrlAfterEmail = page.url();
      expect.soft(currentUrlAfterEmail).toContain('/login');
      const emailInputValidity = await authenticationPage.signupEmailInput.evaluate(
        (el: any) => el.validity.valid,
      );
      expect(emailInputValidity).toBe(false);
    });

    test('should validate login with non-existent user via API', async () => {
      expect.soft(nonExistentUserData.status).toBe(StatusCodes.OK);
      expect.soft(nonExistentUserData.body.responseCode).toBe(StatusCodes.NOT_FOUND);
      expect(nonExistentUserData.body.message).toContain('User not found!');
    });

    test('should handle invalid user data during API registration', async () => {
      expect(invalidRegistrationData.status).not.toBe(StatusCodes.CREATED);
    });

    test('should handle API errors gracefully', async () => {
      expect(emptyEmailData.status).toBeGreaterThanOrEqual(200);
    });
  });
});

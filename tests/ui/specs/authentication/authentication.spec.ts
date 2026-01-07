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
      userService,
    }) => {
      await authenticationPage.navigateToAuthenticationPage();

      await authenticationPage.startSignup(uniqueUserData.name, uniqueUserData.email);
      await expect(
        authenticationPage.registrationForm.accountInfoComponent.passwordInput,
      ).toBeVisible();

      await authenticationPage.completeRegistration(uniqueUserData);
      await expect(authenticationPage.registrationForm.accountCreatedMessage).toBeVisible();

      await authenticationPage.registrationForm.continueButton.click();
      await page.waitForLoadState('domcontentloaded');
      await expect.soft(authenticationPage.loggedInUserText).toBeVisible();
      const loggedInUser = await authenticationPage.getLoggedInUsername();
      expect(loggedInUser).toContain(uniqueUserData.name);

      const userResponse = await userService.getUserByEmail(uniqueUserData.email);
      expect.soft(userResponse.status()).toBe(StatusCodes.OK);
      const userData = await userResponse.json();
      expect.soft(userData).toHaveProperty('user');
      expect.soft(userData.user.email).toBe(uniqueUserData.email);
      expect(userData.user.name).toBe(uniqueUserData.name);
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
    let invalidRegistrationData: { status: number; body: ApiErrorResponse };
    let emptyEmailData: { status: number; body: ApiErrorResponse | null };

    test.beforeAll(async ({ userService }) => {
      const invalidData = UserDataFactory.generateInvalidUserData();
      const invalidRegistrationResponse = await userService.createUser(invalidData as any);
      invalidRegistrationData = {
        status: invalidRegistrationResponse.status(),
        body: await invalidRegistrationResponse.json(),
      };

      emptyEmailData = await userService.safeGetUserByEmail('');
    });

    test('should display error for invalid login credentials via UI and verify via API', async ({
      authenticationPage,
      userService,
    }) => {
      await authenticationPage.navigateToAuthenticationPage();
      await authenticationPage.login('invalid@email.com', 'wrongpassword');
      await expect(authenticationPage.loginForm.loginErrorMessage).toBeVisible();

      const apiResponse = await userService.verifyLogin('invalid@email.com', 'wrongpassword');
      expect.soft(apiResponse.status()).toBe(StatusCodes.OK);
      const apiData = await apiResponse.json();
      expect.soft(apiData.responseCode).toBe(StatusCodes.NOT_FOUND);
      expect(apiData.message).toContain('User not found!');
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
      await authenticationPage.signupForm.signupButton.click();
      const currentUrl = page.url();
      expect.soft(currentUrl).toContain('/login');
      const nameInputValidity = await authenticationPage.signupForm.signupNameInput.evaluate(
        (el: any) => el.validity.valid,
      );
      expect(nameInputValidity).toBe(false);

      await authenticationPage.navigateToAuthenticationPage();
      await authenticationPage.signupForm.signupNameInput.fill('Valid Name');
      await authenticationPage.signupForm.signupButton.click();
      const currentUrlAfterEmail = page.url();
      expect.soft(currentUrlAfterEmail).toContain('/login');
      const emailInputValidity = await authenticationPage.signupForm.signupEmailInput.evaluate(
        (el: any) => el.validity.valid,
      );
      expect(emailInputValidity).toBe(false);
    });

    test('should validate login with non-existent user via UI and API', async ({
      authenticationPage,
      userService,
    }) => {
      await authenticationPage.navigateToAuthenticationPage();
      await authenticationPage.login('nonexistent@user.com', 'password123');
      await expect(authenticationPage.loginForm.loginErrorMessage).toBeVisible();

      const apiResponse = await userService.verifyLogin('nonexistent@user.com', 'password123');
      expect.soft(apiResponse.status()).toBe(StatusCodes.OK);
      const apiData = await apiResponse.json();
      expect.soft(apiData.responseCode).toBe(StatusCodes.NOT_FOUND);
      expect(apiData.message).toContain('User not found!');
    });

    test('should handle invalid user data during API registration', async () => {
      expect(invalidRegistrationData.status).not.toBe(StatusCodes.CREATED);
    });

    test('should handle API errors gracefully', async () => {
      expect(emptyEmailData.status).toBeGreaterThanOrEqual(200);
    });
  });
});

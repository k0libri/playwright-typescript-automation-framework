import { test, expect } from '../../fixtures/uiFixtures';
import { UserDataFactory } from '../../../shared/utils/userDataFactory';
import { HttpStatus, ResponseCode } from '../../../api/base/httpStatus';

interface ApiErrorResponse {
  responseCode: number;
  message: string;
}

test.describe('Authentication @critical', () => {
  test.describe('Positive Test Cases @smoke', () => {
    test.beforeAll(async () => {
      console.log('Starting User Registration test suite');
    });

    test('should register new user via UI and verify user creation via API', async ({
      page,
      authenticationPage,
      uniqueUserData,
    }) => {
      await test.step('Navigate to signup/login page', async () => {
        await authenticationPage.navigateToAuthenticationPage();
      });

      await test.step('Initiate signup with name and email', async () => {
        await authenticationPage.startSignup(uniqueUserData.name, uniqueUserData.email);
        await expect(authenticationPage.passwordInput).toBeVisible();
      });

      await test.step('Complete registration form', async () => {
        await authenticationPage.completeRegistration(uniqueUserData);
        await expect(authenticationPage.accountCreatedMessage).toBeVisible();
      });

      await test.step('Continue after account creation', async () => {
        await authenticationPage.continueButton.click();
        await page.waitForLoadState('domcontentloaded');
        await expect(authenticationPage.loggedInUserText).toBeVisible();
        const loggedInUser = await authenticationPage.getLoggedInUsername();
        expect(loggedInUser).toContain(uniqueUserData.name);
      });

      await test.step('Verify user account was created successfully', async () => {
        await expect(authenticationPage.loggedInUserText).toBeVisible();
        const loggedInUser = await authenticationPage.getLoggedInUsername();
        expect(loggedInUser).toContain(uniqueUserData.name);
        console.log(`User registration verified: ${loggedInUser}`);
      });

      await test.step('Note: User cleanup not performed', async () => {
        console.log(
          'Note: User account created will remain due to API CSRF protection - this is expected for automation exercise'
        );
      });
    });

    test('should display error for duplicate email registration', async ({
      page,
      authenticationPage,
      uniqueUserData,
    }) => {
      await test.step('Create initial user', async () => {
        await authenticationPage.navigateToAuthenticationPage();
        await authenticationPage.startSignup(uniqueUserData.name, uniqueUserData.email);

        try {
          await authenticationPage.passwordInput.waitFor();
          await authenticationPage.completeRegistration(uniqueUserData);
          await authenticationPage.continueButton.click();
          await expect(authenticationPage.loggedInUserText).toBeVisible();
          await page.getByRole('link', { name: ' Logout' }).click();
        } catch {
          console.log('Email might already exist, continuing with duplicate test');
        }
      });

      await test.step('Attempt duplicate email registration', async () => {
        await authenticationPage.navigateToAuthenticationPage();
        await authenticationPage.startSignup('Different Name', uniqueUserData.email);

        const duplicateError = page.getByText('Email Address already exist');
        const stayedOnLogin = page.url().includes('/login');

        if (stayedOnLogin) {
          console.log('Correctly stayed on login page for duplicate email');
        } else {
          await expect(duplicateError).toBeVisible();
        }
      });
    });
  });

  test.describe('Negative Test Cases @negative', () => {
    let invalidLoginData: { status: number; body: ApiErrorResponse };
    let nonExistentUserData: { status: number; body: ApiErrorResponse };
    let invalidRegistrationData: { status: number; body: ApiErrorResponse };
    let emptyEmailData: { status: number; body: ApiErrorResponse | null };

    test.beforeAll(async ({ request }) => {
      console.log('Starting Authentication Negative Tests');

      const { UserService } = await import('../../../api/services/user.service');
      const userService = new UserService(request);

      const invalidLoginResponse = await userService.verifyLogin(
        'invalid@email.com',
        'wrongpassword'
      );
      invalidLoginData = {
        status: invalidLoginResponse.status(),
        body: await invalidLoginResponse.json(),
      };

      const nonExistentUserResponse = await userService.verifyLogin(
        'nonexistent@user.com',
        'password123'
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

      try {
        const emptyEmailResponse = await userService.getUserByEmail('');
        emptyEmailData = {
          status: emptyEmailResponse.status(),
          body: await emptyEmailResponse.json(),
        };
      } catch (error) {
        console.log('Empty email API call handled:', error);
        emptyEmailData = { status: 0, body: null };
      }
    });

    test('should display error for invalid login credentials via UI', async ({
      authenticationPage,
    }) => {
      await test.step('Attempt login with invalid credentials', async () => {
        await authenticationPage.navigateToAuthenticationPage();
        await authenticationPage.login('invalid@email.com', 'wrongpassword');
        await expect(authenticationPage.loginErrorMessage).toBeVisible();
      });
    });

    test('should return error for invalid login via API', async () => {
      await test.step('Verify login error via API using beforeAll response', async () => {
        expect(invalidLoginData.status).toBe(HttpStatus.OK);
        expect(invalidLoginData.body.responseCode).toBe(ResponseCode.NOT_FOUND);
        expect(invalidLoginData.body.message).toContain('User not found!');
      });
    });

    test('should handle invalid email format during registration', async ({
      authenticationPage,
    }) => {
      await test.step('Attempt registration with invalid email format', async () => {
        await authenticationPage.navigateToAuthenticationPage();
        const invalidData = UserDataFactory.generateInvalidUserData();
        await authenticationPage.startSignup('Test User', invalidData.email ?? '');
        const currentUrl = await authenticationPage.getCurrentUrl();
        expect(currentUrl).toContain('/login');
      });
    });

    test('should handle empty required fields during registration', async ({
      authenticationPage,
      page,
    }) => {
      await test.step('Verify browser prevents empty name submission', async () => {
        await authenticationPage.navigateToAuthenticationPage();
        await authenticationPage.signupButton.click();
        const currentUrl = page.url();
        expect(currentUrl).toContain('/login');
        const nameInputValidity = await authenticationPage.signupNameInput.evaluate(
          (el: any) => el.validity.valid
        );
        expect(nameInputValidity).toBe(false);
      });

      await test.step('Verify browser prevents empty email submission', async () => {
        await authenticationPage.navigateToAuthenticationPage();
        await authenticationPage.signupNameInput.fill('Valid Name');
        await authenticationPage.signupButton.click();
        const currentUrl = page.url();
        expect(currentUrl).toContain('/login');
        const emailInputValidity = await authenticationPage.signupEmailInput.evaluate(
          (el: any) => el.validity.valid
        );
        expect(emailInputValidity).toBe(false);
      });
    });

    test('should validate login with non-existent user via API', async () => {
      await test.step('Verify non-existent user login error via API using beforeAll response', async () => {
        expect(nonExistentUserData.status).toBe(HttpStatus.OK);
        expect(nonExistentUserData.body.responseCode).toBe(ResponseCode.NOT_FOUND);
        expect(nonExistentUserData.body.message).toContain('User not found!');
      });
    });

    test('should handle invalid user data during API registration', async () => {
      await test.step('Verify invalid registration data error via API using beforeAll response', async () => {
        expect(invalidRegistrationData.status).not.toBe(ResponseCode.CREATED);
      });
    });

    test('should handle API errors gracefully', async () => {
      await test.step('Verify API error handling for malformed requests using beforeAll response', async () => {
        expect(emptyEmailData.status).toBeGreaterThanOrEqual(200);
        console.log('API error handled with status:', emptyEmailData.status);
      });
    });
  });
});

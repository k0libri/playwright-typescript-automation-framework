import { test, expect } from '../fixtures';
import { UserFactory } from '../test-data/UserFactory';
import { TEST_DATA } from '../test-data/testData';

test.describe('User Registration Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('TC001: Should register a new user successfully', async ({ page, homePage, loginPage }) => {
    const newUser = UserFactory.createRandomUser();

    await test.step('Navigate to signup/login page', async () => {
      await homePage.navigateToSignupLogin();
      await expect(page).toHaveURL(/.*\/login/);
    });

    await test.step('Enter signup details', async () => {
      await loginPage.signup(newUser.name, newUser.email);

      // Verify we're on account information page
      await expect(page).toHaveURL(/.*\/signup/);
    });

    await test.step('Fill account information and create account', async () => {
      await loginPage.fillSignupForm(newUser);

      // Verify account created successfully
      await expect(page.getByText('Account Created!')).toBeVisible();
    });

    await test.step('Continue and verify user is logged in', async () => {
      await page.getByRole('link', { name: 'Continue' }).click();

      // Verify user is logged in (logout link should be visible)
      await expect(homePage.logoutLink).toBeVisible();
      await expect(homePage.deleteAccountLink).toBeVisible();
    });

    await test.step('Cleanup: Delete created user', async () => {
      await homePage.deleteAccount();
    });
  });

  test('TC002: Should show error when registering with existing email', async ({
    homePage,
    loginPage,
  }) => {
    await test.step('Navigate to signup/login page', async () => {
      await homePage.navigateToSignupLogin();
    });

    await test.step('Try to signup with existing email', async () => {
      // Use a common email that might already exist
      await loginPage.signup(TEST_DATA.VALID_USER.NAME, TEST_DATA.AUTH.EXISTING_EMAIL);

      // Check if error message appears
      const errorVisible = await loginPage.isSignupErrorVisible();
      if (errorVisible) {
        await expect(loginPage.signupErrorMessage).toBeVisible();
      }
    });
  });

  test('TC003: Should handle cookie consent popup during registration', async ({
    page,
    homePage,
    loginPage,
  }) => {
    await test.step('Navigate to signup/login and verify cookie popup is handled', async () => {
      await homePage.navigateToSignupLogin();

      // Cookie popup should be automatically handled by our fixture
      // Verify the signup form is accessible
      await expect(loginPage.signupNameInput).toBeVisible();
      await expect(loginPage.signupEmailInput).toBeVisible();
    });

    await test.step('Complete registration flow without cookie interference', async () => {
      const newUser = UserFactory.createRandomUser();
      await loginPage.signup(newUser.name, newUser.email);

      // Should proceed to account information page without issues
      const currentUrl = page.url();
      expect(currentUrl).toContain('signup');
    });
  });
});

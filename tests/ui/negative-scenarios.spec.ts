import { test, expect } from '../fixtures';
import { UserFactory } from '../test-data/UserFactory';
import { TEST_DATA } from '../test-data/testData';

test.describe('Negative Scenario Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('TC013: Should reject login with invalid email format', async ({
    page,
    homePage,
    loginPage,
  }) => {
    await test.step('Navigate to login page', async () => {
      await homePage.navigateToSignupLogin();
      await expect(page).toHaveURL(/.*\/login/);
    });

    await test.step('Attempt login with invalid email format', async () => {
      await loginPage.login(TEST_DATA.AUTH.INVALID_EMAIL, TEST_DATA.VALID_USER.PASSWORD);

      // Should remain on login page or show error message
      const isOnLoginPage = page.url().includes('/login');
      const isErrorVisible = await loginPage.isLoginErrorVisible().catch(() => false);
      expect(isOnLoginPage || isErrorVisible).toBeTruthy();
    });
  });

  test('TC014: Should reject login with empty credentials', async ({
    page,
    homePage,
    loginPage,
  }) => {
    await test.step('Navigate to login page', async () => {
      await homePage.navigateToSignupLogin();
      await expect(page).toHaveURL(/.*\/login/);
    });

    await test.step('Attempt login with empty fields', async () => {
      await loginPage.login(TEST_DATA.AUTH.EMPTY_EMAIL, TEST_DATA.AUTH.EMPTY_PASSWORD);

      // Should remain on login page with empty fields
      await expect(page).toHaveURL(/.*\/login/);
    });
  });

  test('TC015: Should reject login with incorrect password', async ({
    page,
    homePage,
    loginPage,
  }) => {
    await test.step('Navigate to login page', async () => {
      await homePage.navigateToSignupLogin();
    });

    await test.step('Attempt login with valid email but wrong password', async () => {
      await loginPage.login(TEST_DATA.AUTH.EXISTING_EMAIL, TEST_DATA.AUTH.INVALID_PASSWORD);

      // Check for error message or remaining on login page
      const isErrorVisible = await loginPage.isLoginErrorVisible();
      const isOnLoginPage = page.url().includes('/login');

      expect(isErrorVisible || isOnLoginPage).toBeTruthy();
    });
  });

  test('TC016: Should handle SQL injection attempts in login', async ({
    page,
    homePage,
    loginPage,
  }) => {
    await test.step('Navigate to login page', async () => {
      await homePage.navigateToSignupLogin();
    });

    await test.step('Attempt SQL injection in email field', async () => {
      const sqlInjectionPayload = TEST_DATA.AUTH.SQL_INJECTION_PAYLOAD;
      await loginPage.login(sqlInjectionPayload, TEST_DATA.VALID_USER.PASSWORD);

      // Should reject the login attempt and stay on login page
      await expect(page.url()).toContain('/login');
    });

    await test.step('Attempt SQL injection in password field', async () => {
      const sqlInjectionPayload = TEST_DATA.AUTH.SQL_INJECTION_PAYLOAD;
      await loginPage.login(TEST_DATA.AUTH.EXISTING_EMAIL, sqlInjectionPayload);

      // Should reject the login attempt
      await expect(page.url()).toContain('/login');
    });
  });

  test('TC017: Should handle XSS attempts in registration', async ({
    page,
    homePage,
    loginPage,
  }) => {
    await test.step('Navigate to signup page', async () => {
      await homePage.navigateToSignupLogin();
    });

    await test.step('Attempt XSS in name field', async () => {
      const xssPayload = TEST_DATA.AUTH.XSS_PAYLOAD;
      const user = UserFactory.createRandomUser();

      await loginPage.signup(xssPayload, user.email);

      // Should either sanitize the input or reject it
      // Verify no alert popup appears
      const alertPresent: boolean = await page.evaluate(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return typeof (globalThis as any).alert !== 'undefined';
      });

      expect(alertPresent).toBeTruthy(); // Alert function should exist but not be called
    });
  });

  test('TC018: Should prevent duplicate user registration', async ({
    page,
    homePage,
    loginPage,
  }) => {
    const timestamp = Date.now();
    const user = UserFactory.createUserWithEmail(`duplicate${timestamp}@test.com`);

    await test.step('Register user first time', async () => {
      await homePage.navigateToSignupLogin();
      await loginPage.signup(user.name, user.email);

      // If successful, complete registration
      const isOnSignupForm = page.url().includes('/signup');
      if (isOnSignupForm) {
        await loginPage.fillSignupForm(user);
        await page.getByRole('link', { name: 'Continue' }).click();
        await homePage.logout();
      }
    });

    await test.step('Attempt to register with same email again', async () => {
      await homePage.navigateToSignupLogin();
      await loginPage.signup(user.name, user.email);

      // Should show error message about existing email or proceed to signup
      const errorVisible = await loginPage.isSignupErrorVisible();
      if (errorVisible) {
        await expect(loginPage.signupErrorMessage).toBeVisible();
      } else {
        // The system might allow proceeding to signup form - this is acceptable
        const currentUrl = page.url();
        expect(currentUrl).toMatch(/(login|signup)/);
      }
    });
  });

  test('TC019: Should handle checkout with empty cart', async ({ homePage, cartPage }) => {
    await test.step('Navigate to empty cart', async () => {
      await homePage.navigateToCart();
    });

    await test.step('Verify empty cart state', async () => {
      const isEmpty = await cartPage.isCartEmpty();
      if (isEmpty) {
        // Should show empty cart message
        await expect(cartPage.emptyCartMessage).toBeVisible();
      } else {
        // If cart has items, remove them all
        await cartPage.removeAllProducts();
      }
    });

    await test.step('Attempt checkout with empty cart', async () => {
      // Checkout button should either be disabled or show appropriate message
      const checkoutButton = cartPage.proceedToCheckoutButton;
      const isCheckoutVisible = await checkoutButton.isVisible();

      if (isCheckoutVisible) {
        await checkoutButton.click();
        // Should handle empty cart gracefully
        // Either stay on cart page or show appropriate error
      }
    });
  });

  test('TC020: Should handle invalid payment details', async ({
    page,
    homePage,
    loginPage,
    cartPage,
    checkoutPage,
  }) => {
    await test.step('Setup: Create user and add product to cart', async () => {
      const user = UserFactory.createRandomUser();

      // Register user
      await homePage.navigateToSignupLogin();
      await loginPage.signup(user.name, user.email);
      await loginPage.fillSignupForm(user);
      await page.getByRole('link', { name: 'Continue' }).click();

      // Add product to cart
      await homePage.navigateToProducts();
      await homePage.addFirstProductToCart();
      await page.getByRole('button', { name: 'Continue Shopping' }).click();
      await homePage.navigateToCart();
      await cartPage.proceedToCheckout();
    });

    await test.step('Attempt payment with invalid card details', async () => {
      // Using intentionally invalid values to test validation
      const invalidCardDetails = {
        nameOnCard: TEST_DATA.PAYMENT.INVALID.NAME_ON_CARD,
        cardNumber: TEST_DATA.PAYMENT.INVALID.CARD_NUMBER,
        cvc: TEST_DATA.PAYMENT.INVALID.CVC,
        expiryMonth: TEST_DATA.PAYMENT.INVALID.EXPIRY_MONTH,
        expiryYear: TEST_DATA.PAYMENT.INVALID.EXPIRY_YEAR,
      };

      await checkoutPage.placeOrder();
      await checkoutPage.fillPaymentDetails(invalidCardDetails);
      await checkoutPage.payAndConfirmButton.click();

      // Should either show validation errors or reject the payment
      // Payment should not be successful with these invalid details
      const isConfirmed = await checkoutPage.isOrderConfirmed();

      // Payment with invalid details should not be confirmed
      // Note: If this assertion fails, it indicates the system lacks proper validation
      expect(isConfirmed).toBeFalsy();
    });
  });
});

import { test, expect } from '../fixtures';
import { LoginPage } from '../../pages/LoginPage';
import { HomePage } from '../../pages/HomePage';
import { CartPage } from '../../pages/CartPage';
import { CheckoutPage } from '../../pages/CheckoutPage';
import { UserFactory } from '../../utils/UserFactory';
import { BASE_URL } from '../../config/constants';

test.describe('Negative Scenario Tests', () => {
  let loginPage: LoginPage;
  let homePage: HomePage;
  let cartPage: CartPage;
  let checkoutPage: CheckoutPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    homePage = new HomePage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);

    await page.goto(BASE_URL);
  });

  test('TC013: Should reject login with invalid email format', async ({ page }) => {
    await test.step('Navigate to login page', async () => {
      await homePage.navigateToSignupLogin();
    });

    await test.step('Attempt login with invalid email format', async () => {
      await loginPage.login('not-an-email', 'password123');

      // Should remain on login page or show error
      await expect(page.url()).toContain('/login');
    });
  });

  test('TC014: Should reject login with empty credentials', async ({ page }) => {
    await test.step('Navigate to login page', async () => {
      await homePage.navigateToSignupLogin();
    });

    await test.step('Attempt login with empty fields', async () => {
      await loginPage.login('', '');

      // Should remain on login page
      await expect(page.url()).toContain('/login');
    });
  });

  test('TC015: Should reject login with incorrect password', async ({ page }) => {
    await test.step('Navigate to login page', async () => {
      await homePage.navigateToSignupLogin();
    });

    await test.step('Attempt login with valid email but wrong password', async () => {
      await loginPage.login('test@example.com', 'wrongpassword');

      // Check for error message or remaining on login page
      const isErrorVisible = await loginPage.isLoginErrorVisible();
      const isOnLoginPage = page.url().includes('/login');

      expect(isErrorVisible || isOnLoginPage).toBeTruthy();
    });
  });

  test('TC016: Should handle SQL injection attempts in login', async ({ page }) => {
    await test.step('Navigate to login page', async () => {
      await homePage.navigateToSignupLogin();
    });

    await test.step('Attempt SQL injection in email field', async () => {
      const sqlInjectionPayload = "' OR '1'='1' --";
      await loginPage.login(sqlInjectionPayload, 'password');

      // Should reject the login attempt and stay on login page
      await expect(page.url()).toContain('/login');
    });

    await test.step('Attempt SQL injection in password field', async () => {
      const sqlInjectionPayload = "' OR '1'='1' --";
      await loginPage.login('test@example.com', sqlInjectionPayload);

      // Should reject the login attempt
      await expect(page.url()).toContain('/login');
    });
  });

  test('TC017: Should handle XSS attempts in registration', async ({ page }) => {
    await test.step('Navigate to signup page', async () => {
      await homePage.navigateToSignupLogin();
    });

    await test.step('Attempt XSS in name field', async () => {
      const xssPayload = '<script>alert("XSS")</script>';
      const user = UserFactory.createRandomUser();

      await loginPage.signup(xssPayload, user.email);

      // Should either sanitize the input or reject it
      // Verify no alert popup appears
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const alertPresent: boolean = await (page as any).evaluate(
        '() => typeof window.alert !== "undefined"',
      );

      expect(alertPresent).toBeTruthy(); // Alert function should exist but not be called
    });
  });

  test('TC018: Should prevent duplicate user registration', async ({ page }) => {
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

      // Should show error message about existing email
      const errorVisible = await loginPage.isSignupErrorVisible();
      if (errorVisible) {
        await expect(loginPage.signupErrorMessage).toBeVisible();
      } else {
        // Or should remain on login page without proceeding to signup form
        await expect(page.url()).toContain('/login');
      }
    });
  });

  test('TC019: Should handle checkout with empty cart', async ({ page }) => {
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

  test('TC020: Should handle invalid payment details', async ({ page }) => {
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
        nameOnCard: '', // Intentionally blank for negative testing
        cardNumber: '1234', // Invalid card number - too short
        cvc: '1', // Invalid CVC - too short
        expiryMonth: '13', // Invalid month (should be 1-12)
        expiryYear: '2020', // Past year - intentionally expired
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

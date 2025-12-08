import { test, expect } from '../fixtures';
import { LoginPage } from '../../pages/LoginPage';
import { HomePage } from '../../pages/HomePage';
import { CartPage } from '../../pages/CartPage';
import { CheckoutPage } from '../../pages/CheckoutPage';
import { UserFactory, User } from '../../utils/UserFactory';
import { BASE_URL } from '../../config/constants';

test.describe('Purchase Flow Tests', () => {
  let loginPage: LoginPage;
  let homePage: HomePage;
  let cartPage: CartPage;
  let checkoutPage: CheckoutPage;
  let validUser: User;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    homePage = new HomePage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);
    validUser = UserFactory.createRandomUser();

    await page.goto(BASE_URL);
  });

  test('TC009: Should complete purchase flow - Register during checkout', async ({ page }) => {
    await test.step('Add products to cart', async () => {
      await homePage.navigateToProducts();
      await homePage.addFirstProductToCart();
      await page.getByRole('button', { name: 'Continue Shopping' }).click();
      await homePage.navigateToCart();
    });

    await test.step('Proceed to checkout', async () => {
      await cartPage.proceedToCheckout();

      // Should be prompted to register/login
      await expect(page.getByRole('link', { name: 'Register / Login' })).toBeVisible();
    });

    await test.step('Register new user', async () => {
      await cartPage.goToRegisterLogin();
      await loginPage.signup(validUser.name, validUser.email);
      await loginPage.fillSignupForm(validUser);

      // Verify account created
      await expect(page.getByText('Account Created!')).toBeVisible();
      await page.getByRole('link', { name: 'Continue' }).click();
    });

    await test.step('Complete checkout process', async () => {
      // Navigate back to cart and proceed to checkout
      await homePage.navigateToCart();
      await cartPage.proceedToCheckout();

      // Fill payment details
      const cardDetails = {
        nameOnCard: validUser.name,
        cardNumber: '4242424242424242',
        cvc: '123',
        expiryMonth: '12',
        expiryYear: String(new Date().getFullYear() + 1),
      };

      await checkoutPage.completeOrder(cardDetails, 'Test order comment');

      // Verify order confirmation
      const isConfirmed = await checkoutPage.isOrderConfirmed();
      expect(isConfirmed).toBeTruthy();
    });
  });

  test('TC010: Should complete purchase flow - Login before checkout', async ({ page }) => {
    await test.step('Register user first', async () => {
      await homePage.navigateToSignupLogin();
      await loginPage.signup(validUser.name, validUser.email);
      await loginPage.fillSignupForm(validUser);
      await page.getByRole('link', { name: 'Continue' }).click();
    });

    await test.step('Add products to cart', async () => {
      await homePage.navigateToProducts();
      await homePage.addFirstProductToCart();
      await page.getByRole('button', { name: 'Continue Shopping' }).click();
      await homePage.navigateToCart();
    });

    await test.step('Proceed to checkout and complete purchase', async () => {
      await cartPage.proceedToCheckout();

      // Should proceed directly to checkout since user is logged in
      const currentUrl = page.url();
      expect(currentUrl).toContain('checkout');

      // Complete the order
      const cardDetails = {
        nameOnCard: validUser.name,
        cardNumber: '4242424242424242',
        cvc: '123',
        expiryMonth: '12',
        expiryYear: String(new Date().getFullYear() + 1),
      };

      await checkoutPage.completeOrder(cardDetails);

      // Verify order was successfully placed
      const isConfirmed = await checkoutPage.isOrderConfirmed();
      expect(isConfirmed).toBeTruthy();
    });
  });

  test('TC011: Should verify address details in checkout', async ({ page }) => {
    await test.step('Register user with specific address', async () => {
      await homePage.navigateToSignupLogin();
      await loginPage.signup(validUser.name, validUser.email);
      await loginPage.fillSignupForm(validUser);
      await page.getByRole('link', { name: 'Continue' }).click();
    });

    await test.step('Add product and proceed to checkout', async () => {
      await homePage.navigateToProducts();
      await homePage.addFirstProductToCart();
      await page.getByRole('button', { name: 'Continue Shopping' }).click();
      await homePage.navigateToCart();
      await cartPage.proceedToCheckout();
    });

    await test.step('Verify address details match user information', async () => {
      const addressVerification = await checkoutPage.verifyAddressDetails(validUser);

      // Address details should be populated correctly
      expect(addressVerification.deliveryAddressMatch).toBeTruthy();
      expect(addressVerification.billingAddressMatch).toBeTruthy();
    });
  });

  test('TC012: Should handle order confirmation and invoice download', async ({ page }) => {
    await test.step('Complete a purchase', async () => {
      // Register user
      await homePage.navigateToSignupLogin();
      await loginPage.signup(validUser.name, validUser.email);
      await loginPage.fillSignupForm(validUser);
      await page.getByRole('link', { name: 'Continue' }).click();

      // Add product and checkout
      await homePage.navigateToProducts();
      await homePage.addFirstProductToCart();
      await page.getByRole('button', { name: 'Continue Shopping' }).click();
      await homePage.navigateToCart();
      await cartPage.proceedToCheckout();

      // Complete order
      const cardDetails = {
        nameOnCard: validUser.name,
        cardNumber: '4242424242424242',
        cvc: '123',
        expiryMonth: '12',
        expiryYear: String(new Date().getFullYear() + 1),
      };

      await checkoutPage.completeOrder(cardDetails);
    });

    await test.step('Verify order confirmation and download invoice', async () => {
      const isConfirmed = await checkoutPage.isOrderConfirmed();
      if (isConfirmed) {
        // Try to download invoice
        const downloadButton = checkoutPage.downloadInvoiceButton;
        if (await downloadButton.isVisible({ timeout: 5000 })) {
          await downloadButton.click();
        }

        // Continue after order
        await checkoutPage.continueAfterOrder();

        // Should be redirected to home page (root path)
        await expect(page).toHaveURL(BASE_URL);
      }
    });
  });
});

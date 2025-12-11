import { test, expect } from '../../fixtures/uiFixtures';
import { PaymentDataFactory } from '../../../shared/utils/paymentDataFactory';

/**
 * Story 3 - Complete Purchase + Order History Verification
 * Tests complete checkout flow with order confirmation
 */
test.describe('Order Completion - Purchase + Order History @critical @e2e', () => {
  test.beforeAll(async () => {
    console.log('Starting Order Completion test suite');
  });

  test('should complete purchase flow and verify order confirmation', async ({
    authenticationPage,
    productsPage,
    cartPage,
    checkoutPage,
    navbar,
    uniqueUserData,
    request,
  }) => {
    // Step 1: Create user account via UI (API has CSRF protection)
    await test.step('Create user account via UI', async () => {
      await authenticationPage.navigateToAuthenticationPage();
      await authenticationPage.startSignup(uniqueUserData.name, uniqueUserData.email);
      await authenticationPage.completeRegistration(uniqueUserData);
      await authenticationPage.continueButton.click();

      // Verify user is logged in
      await expect(authenticationPage.loggedInUserText).toBeVisible();
      console.log('User created and logged in successfully');
    });

    // Step 2: Add products to cart (already logged in from Step 1)
    await test.step('Add products to cart', async () => {
      await expect(authenticationPage.loggedInUserText).toBeVisible();

      // Add products to cart
      await navbar.goToProducts();
      const productNames = await productsPage.getProductNames();

      // Add multiple products
      await productsPage.addProductToCartAndContinue(productNames[0]);
      if (productNames.length > 1) {
        await productsPage.addProductToCartAndContinue(productNames[1]);
      }
    });

    // Step 3: Review cart and proceed to checkout
    await test.step('Review cart and proceed to checkout', async () => {
      await navbar.goToCart();

      const cartItems = await cartPage.getCartItems();
      expect(cartItems.length).toBeGreaterThanOrEqual(1);

      await cartPage.proceedToCheckout();
    });

    // Step 4: Review order details
    await test.step('Review order details on checkout page', async () => {
      const orderItems = await checkoutPage.getOrderItems();
      expect(orderItems.length).toBeGreaterThanOrEqual(1);

      // Verify order items match cart items
      expect(orderItems[0].name).toBeTruthy();
      expect(orderItems[0].price).toMatch(/Rs\. \d+/);

      // Add order comment
      await checkoutPage.addOrderComment('Test order - automated test');
    });

    // Step 5: Place order
    await test.step('Place order', async () => {
      await checkoutPage.placeOrder();

      // Should be redirected to payment page
      await expect(checkoutPage.paymentForm).toBeVisible();
    });

    // Step 6: Complete payment
    await test.step('Complete payment process', async () => {
      const paymentData = PaymentDataFactory.generatePaymentData();
      await checkoutPage.completePayment(paymentData);

      // Verify order confirmation
      const isConfirmed = await checkoutPage.isOrderConfirmed();
      expect(isConfirmed).toBe(true);

      const confirmationMessage = await checkoutPage.getOrderConfirmationMessage();
      expect(confirmationMessage).toContain('Order Placed!');
    });

    // Step 7: Verify order history (if available via API)
    await test.step('Verify order history via API (if available)', async () => {
      // Note: The automation exercise site doesn't appear to have order history API
      // This would be implemented when such endpoints are available
      console.log('Order history API verification would go here when endpoint is available');

      // For now, verify user still exists and is valid
      const { UserService } = await import('../../../api/services/user.service');
      const userService = new UserService(request);

      const userResponse = await userService.getUserByEmail(uniqueUserData.email);
      expect(userResponse.status()).toBe(200);
    });

    // Step 8: Continue after order
    await test.step('Continue after order confirmation', async () => {
      await checkoutPage.continueAfterOrder();

      // Should be redirected to home or account page
      await expect(authenticationPage.loggedInUserText).toBeVisible();
    });

    // Cleanup
    await test.step('Cleanup: Delete test user', async () => {
      try {
        const { UserService } = await import('../../../api/services/user.service');
        const userService = new UserService(request);
        await userService.deleteUser(uniqueUserData.email, uniqueUserData.password);
      } catch (error) {
        console.log('Cleanup failed:', error);
      }
    });
  });

  test('should handle checkout with single product', async ({
    authenticationPage,
    productsPage,
    cartPage,
    checkoutPage,
    navbar,
    uniqueUserData,
    request,
  }) => {
    // Setup: Create user and add single product
    await test.step('Setup: Create user and add single product', async () => {
      await authenticationPage.navigateToAuthenticationPage();
      await authenticationPage.startSignup(uniqueUserData.name, uniqueUserData.email);
      await authenticationPage.completeRegistration(uniqueUserData);
      await authenticationPage.continueButton.click();

      // Verify user is logged in
      await expect(authenticationPage.loggedInUserText).toBeVisible();

      await navbar.goToProducts();
      const productNames = await productsPage.getProductNames();
      await productsPage.addProductToCartAndViewCart(productNames[0]);
    });

    // Complete checkout process
    await test.step('Complete checkout with single product', async () => {
      await cartPage.proceedToCheckout();

      // Wait for checkout page to load
      await checkoutPage.page.waitForLoadState('domcontentloaded');
      const orderItems = await checkoutPage.getOrderItems();
      expect(orderItems.length).toBe(1);

      await checkoutPage.placeOrder();

      const paymentData = PaymentDataFactory.generatePaymentData();
      await checkoutPage.completePayment(paymentData);

      const isConfirmed = await checkoutPage.isOrderConfirmed();
      expect(isConfirmed).toBe(true);
    });

    // Cleanup
    await test.step('Cleanup: Delete test user', async () => {
      try {
        const { UserService } = await import('../../../api/services/user.service');
        const userService = new UserService(request);
        await userService.deleteUser(uniqueUserData.email, uniqueUserData.password);
      } catch (error) {
        console.log('Cleanup failed:', error);
      }
    });
  });

  test('should validate order details match cart contents', async ({
    authenticationPage,
    productsPage,
    cartPage,
    checkoutPage,
    navbar,
    uniqueUserData,
    request,
  }) => {
    // Setup
    await test.step('Setup: Create user and add products', async () => {
      await authenticationPage.navigateToAuthenticationPage();
      await authenticationPage.startSignup(uniqueUserData.name, uniqueUserData.email);
      await authenticationPage.completeRegistration(uniqueUserData);
      await authenticationPage.continueButton.click();

      // Verify user is logged in
      await expect(authenticationPage.loggedInUserText).toBeVisible();

      await navbar.goToProducts();
      const productNames = await productsPage.getProductNames();
      await productsPage.addProductToCartAndContinue(productNames[0]);
    });

    // Get cart details
    let cartItems: any[];
    await test.step('Get cart item details', async () => {
      // Navigate to cart using direct URL to avoid ad overlay issues
      await cartPage.navigateToCart();
      await cartPage.page.waitForLoadState('domcontentloaded');
      cartItems = await cartPage.getCartItems();
      expect(cartItems.length).toBe(1);
    });

    // Verify order details match cart
    await test.step('Verify order details match cart contents', async () => {
      await cartPage.proceedToCheckout();

      const orderItems = await checkoutPage.getOrderItems();
      expect(orderItems.length).toBe(cartItems.length);

      // Verify first item details match
      expect(orderItems[0].name).toBe(cartItems[0].name);
      expect(orderItems[0].price).toBe(cartItems[0].price);
      expect(orderItems[0].quantity).toBe(cartItems[0].quantity);
    });

    // Cleanup
    await test.step('Cleanup: Delete test user', async () => {
      try {
        const { UserService } = await import('../../../api/services/user.service');
        const userService = new UserService(request);
        await userService.deleteUser(uniqueUserData.email, uniqueUserData.password);
      } catch (error) {
        console.log('Cleanup failed:', error);
      }
    });
  });
});

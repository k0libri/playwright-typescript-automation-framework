import { test, expect } from '../../fixtures/uiFixtures';
import { PaymentDataFactory } from '../../../shared/utils/paymentDataFactory';
import { UserService } from '../../../api/services/user.service';
import { HttpStatus } from '../../../api/base/httpStatus';

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
    test.setTimeout(90000);

    await test.step('Create user account via UI', async () => {
      await authenticationPage.navigateToAuthenticationPage();
      await authenticationPage.startSignup(uniqueUserData.name, uniqueUserData.email);
      await authenticationPage.completeRegistration(uniqueUserData);
      await authenticationPage.continueButton.click();

      // Verify user is logged in
      await expect(authenticationPage.loggedInUserText).toBeVisible();
      console.log('User created and logged in successfully');
    });

    await test.step('Add products to cart', async () => {
      await expect(authenticationPage.loggedInUserText).toBeVisible();

      await navbar.goToProducts();
      const productNames = await productsPage.getProductNames();

      if (productNames[0]) {
        await productsPage.addProductToCartAndContinue(productNames[0]);
      }
      if (productNames.length > 1 && productNames[1]) {
        await productsPage.addProductToCartAndContinue(productNames[1]);
      }
    });

    await test.step('Review cart and proceed to checkout', async () => {
      await navbar.goToCart();

      const cartItems = await cartPage.getCartItems();
      expect(cartItems.length).toBeGreaterThanOrEqual(1);

      await cartPage.proceedToCheckout();
    });

    await test.step('Review order details on checkout page', async () => {
      const orderItems = await checkoutPage.getOrderItems();
      expect(orderItems.length).toBeGreaterThanOrEqual(1);

      if (orderItems[0]) {
        expect(orderItems[0].name).toBeTruthy();
        expect(orderItems[0].price).toMatch(/Rs\. \d+/);
      }

      await checkoutPage.addOrderComment('Test order - automated test');
    });

    await test.step('Place order', async () => {
      await checkoutPage.placeOrder();

      await expect(checkoutPage.payAndConfirmButton).toBeVisible();
    });

    await test.step('Complete payment process', async () => {
      const paymentData = PaymentDataFactory.generatePaymentData();
      await checkoutPage.completePayment(paymentData);

      const isConfirmed = await checkoutPage.isOrderConfirmed();
      expect(isConfirmed).toBe(true);

      const confirmationMessage = await checkoutPage.getOrderConfirmationMessage();
      expect(confirmationMessage).toContain('Order Placed!');
    });

    await test.step('Verify order history via API (if available)', async () => {
      console.log('Order history API verification would go here when endpoint is available');

      const userService = new UserService(request);

      const userResponse = await userService.getUserByEmail(uniqueUserData.email);
      expect(userResponse.status()).toBe(HttpStatus.OK);
    });

    await test.step('Continue after order confirmation', async () => {
      await checkoutPage.continueAfterOrder();

      await expect(authenticationPage.loggedInUserText).toBeVisible();
    });

    // Cleanup
    await test.step('Cleanup: Delete test user', async () => {
      try {
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
    await test.step('Setup: Create user and add single product', async () => {
      await authenticationPage.navigateToAuthenticationPage();
      await authenticationPage.startSignup(uniqueUserData.name, uniqueUserData.email);
      await authenticationPage.completeRegistration(uniqueUserData);
      await authenticationPage.continueButton.click();

      // Verify user is logged in
      await expect(authenticationPage.loggedInUserText).toBeVisible();

      await navbar.goToProducts();
      const productNames = await productsPage.getProductNames();
      if (productNames[0]) {
        await productsPage.addProductToCartAndViewCart(productNames[0]);
      }
    });

    await test.step('Complete checkout with single product', async () => {
      await cartPage.proceedToCheckout();

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
    test.setTimeout(90000);

    await test.step('Setup: Create user and add products', async () => {
      await authenticationPage.navigateToAuthenticationPage();
      await authenticationPage.startSignup(uniqueUserData.name, uniqueUserData.email);
      await authenticationPage.completeRegistration(uniqueUserData);
      await authenticationPage.continueButton.click();

      // Verify user is logged in
      await expect(authenticationPage.loggedInUserText).toBeVisible();

      await navbar.goToProducts();
      const productNames = await productsPage.getProductNames();
      if (productNames[0]) {
        await productsPage.addProductToCartAndContinue(productNames[0]);
      }
    });

    let cartItems: any[];
    await test.step('Get cart item details', async () => {
      await cartPage.navigateToCart();
      cartItems = await cartPage.getCartItems();
      expect(cartItems.length).toBe(1);
    });

    await test.step('Verify order details match cart contents', async () => {
      await cartPage.proceedToCheckout();

      const orderItems = await checkoutPage.getOrderItems();
      expect(orderItems.length).toBe(cartItems.length);

      if (orderItems[0] && cartItems[0]) {
        expect(orderItems[0].name).toBe(cartItems[0].name);
        expect(orderItems[0].price).toBe(cartItems[0].price);
        expect(orderItems[0].quantity).toBe(cartItems[0].quantity);
      }
    });

    // Cleanup
    await test.step('Cleanup: Delete test user', async () => {
      try {
        const userService = new UserService(request);
        await userService.deleteUser(uniqueUserData.email, uniqueUserData.password);
      } catch (error) {
        console.log('Cleanup failed:', error);
      }
    });
  });
});

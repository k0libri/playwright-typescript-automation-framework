/**
 * Order Completion Tests
 * Tests end-to-end purchase flow and order verification
 */
import { test, expect } from '../../uiFixtures';
import { PaymentDataFactory } from '../../../common/utils/paymentDataFactory';
import { StatusCodes } from 'http-status-codes';

test.describe('Order Completion - Purchase + Order History @critical @e2e', () => {
  test('should complete purchase flow and verify order confirmation and user via API', async ({
    authenticationPage,
    productsPage,
    cartPage,
    checkoutPage,
    navbar,
    uniqueUserData,
    userService,
  }) => {
    test.setTimeout(90000);

    await authenticationPage.navigateToAuthenticationPage();
    await authenticationPage.startSignup(uniqueUserData.name, uniqueUserData.email);
    await authenticationPage.completeRegistration(uniqueUserData);
    await authenticationPage.registrationForm.continueButton.click();

    await expect(authenticationPage.loggedInUserText).toBeVisible();

    await navbar.goToProducts();
    const productNames = await productsPage.getProductNames();

    if (productNames[0]) {
      await productsPage.addProductToCartAndContinue(productNames[0]);
    }
    if (productNames.length > 1 && productNames[1]) {
      await productsPage.addProductToCartAndContinue(productNames[1]);
    }

    await navbar.goToCart();

    const cartItems = await cartPage.getCartItems();
    expect(cartItems.length).toBeGreaterThanOrEqual(1);

    await cartPage.proceedToCheckout();

    const orderItems = await checkoutPage.getOrderItems();
    expect(orderItems.length).toBeGreaterThanOrEqual(1);

    if (orderItems[0]) {
      expect.soft(orderItems[0].name).toBeTruthy();
      expect(orderItems[0].price).toMatch(/Rs\. \d+/);
    }

    await checkoutPage.addOrderComment('Test order - automated test');

    await checkoutPage.placeOrder();

    await expect(checkoutPage.payAndConfirmButton).toBeVisible();

    const paymentData = PaymentDataFactory.generatePaymentData();
    await checkoutPage.completePayment(paymentData);

    const isConfirmed = await checkoutPage.isOrderConfirmed();
    expect.soft(isConfirmed).toBe(true);

    const confirmationMessage = await checkoutPage.getOrderConfirmationMessage();
    expect.soft(confirmationMessage).toContain('Order Placed!');

    const userResponse = await userService.getUserByEmail(uniqueUserData.email);
    expect.soft(userResponse.status()).toBe(StatusCodes.OK);
    const userData = await userResponse.json();
    expect.soft(userData).toHaveProperty('user');
    expect.soft(userData.user.email).toBe(uniqueUserData.email);
    expect(userData.user.name).toBe(uniqueUserData.name);

    await checkoutPage.continueAfterOrder();

    await expect(authenticationPage.loggedInUserText).toBeVisible();

    await userService.cleanupUser(uniqueUserData.email, uniqueUserData.password);
  });

  test('should handle checkout with single product', async ({
    authenticationPage,
    productsPage,
    cartPage,
    checkoutPage,
    navbar,
    uniqueUserData,
    userService,
  }) => {
    await authenticationPage.navigateToAuthenticationPage();
    await authenticationPage.startSignup(uniqueUserData.name, uniqueUserData.email);
    await authenticationPage.completeRegistration(uniqueUserData);
    await authenticationPage.registrationForm.continueButton.click();

    await expect(authenticationPage.loggedInUserText).toBeVisible();

    await navbar.goToProducts();
    const productNames = await productsPage.getProductNames();
    if (productNames[0]) {
      await productsPage.addProductToCartAndViewCart(productNames[0]);
    }

    await cartPage.proceedToCheckout();

    const orderItems = await checkoutPage.getOrderItems();
    expect(orderItems.length).toBe(1);

    await checkoutPage.placeOrder();

    const paymentData = PaymentDataFactory.generatePaymentData();
    await checkoutPage.completePayment(paymentData);

    const isConfirmed = await checkoutPage.isOrderConfirmed();
    expect(isConfirmed).toBe(true);

    await userService.cleanupUser(uniqueUserData.email, uniqueUserData.password);
  });

  test('should validate order details match cart contents', async ({
    authenticationPage,
    productsPage,
    cartPage,
    checkoutPage,
    navbar,
    uniqueUserData,
    userService,
  }) => {
    test.setTimeout(90000);

    await authenticationPage.navigateToAuthenticationPage();
    await authenticationPage.startSignup(uniqueUserData.name, uniqueUserData.email);
    await authenticationPage.completeRegistration(uniqueUserData);
    await authenticationPage.registrationForm.continueButton.click();

    await expect(authenticationPage.loggedInUserText).toBeVisible();

    await navbar.goToProducts();
    const productNames = await productsPage.getProductNames();
    if (productNames[0]) {
      await productsPage.addProductToCartAndContinue(productNames[0]);
    }

    await cartPage.navigateToCart();
    const cartItems = await cartPage.getCartItems();
    expect(cartItems.length).toBe(1);

    await cartPage.proceedToCheckout();

    const orderItems = await checkoutPage.getOrderItems();
    expect(orderItems.length).toBe(cartItems.length);

    if (orderItems[0] && cartItems[0]) {
      expect(orderItems[0].name).toBe(cartItems[0].name);
      expect(orderItems[0].price).toBe(cartItems[0].price);
      expect(orderItems[0].quantity).toBe(cartItems[0].quantity);
    }

    await userService.cleanupUser(uniqueUserData.email, uniqueUserData.password);
  });
});

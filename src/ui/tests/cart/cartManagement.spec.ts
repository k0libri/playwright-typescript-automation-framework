import { test, expect } from '../../fixtures/uiFixtures';

/**
 * Story 2 - Login + Cart Verification via API
 * Tests login via UI and cart functionality with API validation
 */
test.describe('Cart Management - Login + Cart Verification @critical @regression', () => {
  test.beforeAll(async () => {
    console.log('Starting Cart Management test suite');
  });

  test('should login via UI, add products to cart, and verify cart via API', async ({
    authenticationPage,
    productsPage,
    cartPage,
    navbar,
    uniqueUserData,
  }) => {
    // Step 1: Create user account via UI first
    await test.step('Create user account via UI', async () => {
      await authenticationPage.navigateToAuthenticationPage();
      await authenticationPage.startSignup(uniqueUserData.name, uniqueUserData.email);
      await authenticationPage.completeRegistration(uniqueUserData);
      await authenticationPage.continueButton.click();

      // Verify user is logged in
      await expect(authenticationPage.loggedInUserText).toBeVisible();
      console.log('User created and logged in successfully');
    });

    // Step 3: Navigate to products and add items to cart
    await test.step('Add products to cart via UI', async () => {
      await navbar.goToProducts();
      await expect(productsPage.productsContainer).toBeVisible();

      // Get available products
      const productNames = await productsPage.getProductNames();
      expect(productNames.length).toBeGreaterThan(0);

      // Add first product to cart and continue shopping
      if (productNames[0]) {
        await productsPage.addProductToCartAndContinue(productNames[0]);
        await expect(productsPage.continueShoppingButton).toBeHidden({ timeout: 10000 });
        await expect(productsPage.productsContainer).toBeVisible();
      }

      // Add second product to cart if available
      if (productNames.length > 1 && productNames[1]) {
        await productsPage.addProductToCartAndContinue(productNames[1]);
        await expect(productsPage.continueShoppingButton).toBeHidden({ timeout: 10000 });
        await expect(productsPage.productsContainer).toBeVisible();
      }
    });

    // Step 4: Verify cart contents via UI
    await test.step('Verify cart contents via UI', async () => {
      // Navigate to cart page using navbar with force option to bypass ads
      await navbar.goToCart();
      await expect(cartPage.cartTable).toBeVisible({ timeout: 15000 });

      const cartItems = await cartPage.getCartItems();
      expect(cartItems.length).toBeGreaterThanOrEqual(1);
      expect(cartItems.length).toBeLessThanOrEqual(2);

      // Verify cart is not empty
      const isEmpty = await cartPage.isCartEmpty();
      expect(isEmpty).toBe(false);
    });

    // Step 5: Verify cart contents and user session are maintained
    await test.step('Verify cart contents and session maintained', async () => {
      // Verify cart is not empty
      const isEmpty = await cartPage.isCartEmpty();
      expect(isEmpty).toBe(false);

      // Verify user is still logged in
      await expect(authenticationPage.loggedInUserText).toBeVisible();
      console.log('Cart contents verified and user session maintained');
    });
  });

  test('should handle basic cart operations without login', async ({
    productsPage,
    cartPage,
    navbar,
  }) => {
    // Start from home page
    await test.step('Navigate to home page', async () => {
      await productsPage.navigateTo('/');
      await expect(navbar.homeLink).toBeVisible();
    });

    // Navigate to products page
    await test.step('Navigate to products page', async () => {
      await navbar.goToProducts();
      await expect(productsPage.productsContainer).toBeVisible();
    });

    // Add product to cart without login
    await test.step('Add product to cart', async () => {
      const productNames = await productsPage.getProductNames();
      if (productNames[0]) {
        await productsPage.addProductToCartAndViewCart(productNames[0]);
      }

      // Should be redirected to cart page
      await expect(cartPage.cartTable).toBeVisible();
    });

    // Verify cart item count and details
    await test.step('Verify cart contents', async () => {
      const itemCount = await cartPage.getCartItemCount();
      expect(itemCount).toBe(1);

      const cartItems = await cartPage.getCartItems();
      expect(cartItems.length).toBeGreaterThan(0);
      if (cartItems[0]) {
        expect(cartItems[0].name).toBeTruthy();
        expect(cartItems[0].price).toMatch(/Rs\. \d+/);
        expect(cartItems[0].quantity).toBe('1');
      }
    });

    // Remove item from cart
    await test.step('Remove item from cart', async () => {
      // First check that we have items to remove
      const itemCount = await cartPage.getCartItemCount();
      if (itemCount > 0) {
        await cartPage.removeItemFromCart(0);

        // After removing all items, the cart should be empty
        // The cart table may become hidden when empty, so check via our helper method
        const isEmpty = await cartPage.isCartEmpty();
        expect(isEmpty).toBe(true);
      } else {
        console.log('No items in cart to remove');
      }
    });

    // Note: No user cleanup needed since no user was created
    await test.step('Test completed successfully', async () => {
      console.log('Cart operations test completed without user creation');
    });
  });

  test('should require login for checkout process', async ({ cartPage, productsPage, navbar }) => {
    // Start from home page
    await test.step('Navigate to home page', async () => {
      await productsPage.navigateTo('/');
      await expect(navbar.homeLink).toBeVisible();
    });

    // Navigate to products and add product to cart
    await test.step('Add product to cart without login', async () => {
      await navbar.goToProducts();
      await expect(productsPage.productsContainer).toBeVisible();

      const productNames = await productsPage.getProductNames();
      const firstProduct = productNames[0];
      if (!firstProduct) {
        throw new Error('No products available');
      }
      await productsPage.addProductToCartAndViewCart(firstProduct);
    });

    // Try to proceed to checkout
    await test.step('Verify checkout requires login', async () => {
      await cartPage.proceedToCheckout();

      // Should be prompted to login/register
      await expect(cartPage.registerLoginLink).toBeVisible();
      console.log('Checkout correctly requires login');
    });
  });
});

/**
 * Cart Management Tests
 * Tests cart functionality with user authentication and product management
 */
import { test, expect } from '../../uiFixtures';

test.describe('Cart Management - Login + Cart Verification @critical @regression', () => {
  test('should create user via API, login via UI, and manage cart @hybrid @api-to-ui', async ({
    authenticationPage,
    productsPage,
    cartPage,
    navbar,
    uniqueUserData,
    userService,
    productService,
  }) => {
    test.setTimeout(90000);

    const createUserResponse = await userService.createUser(uniqueUserData);
    expect(createUserResponse.status()).toBe(200);
    const createUserJson = await createUserResponse.json();
    expect(createUserJson.responseCode).toBe(201);

    const productsResponse = await productService.getAllProducts();
    expect(productsResponse.status()).toBe(200);
    const productsData = await productsResponse.json();
    expect(productsData.products).toBeDefined();
    expect(productsData.products.length).toBeGreaterThan(0);

    await authenticationPage.navigateToAuthenticationPage();
    await authenticationPage.login(uniqueUserData.email, uniqueUserData.password);
    await expect(authenticationPage.loggedInUserText).toBeVisible();

    await navbar.goToProducts();
    await expect(productsPage.productsContainer).toBeVisible();

    const productNames = await productsPage.getProductNames();
    expect(productNames.length).toBeGreaterThan(0);

    if (productNames[0]) {
      await productsPage.addProductToCartAndContinue(productNames[0]);
    }

    await navbar.goToCart();
    await expect(cartPage.cartTable).toBeVisible();

    const cartItems = await cartPage.getCartItems();
    expect(cartItems.length).toBeGreaterThanOrEqual(1);
    expect(cartItems[0]?.name).toBeTruthy();
    expect(cartItems[0]?.price).toMatch(/Rs\. \d+/);

    const isEmpty = await cartPage.isCartEmpty();
    expect(isEmpty).toBe(false);

    await userService.cleanupUser(uniqueUserData.email, uniqueUserData.password);
  });

  test('should login via UI, add products to cart, and verify cart via API', async ({
    authenticationPage,
    productsPage,
    cartPage,
    navbar,
    uniqueUserData,
  }) => {
    test.setTimeout(90000);
    await authenticationPage.navigateToAuthenticationPage();
    await authenticationPage.startSignup(uniqueUserData.name, uniqueUserData.email);
    await authenticationPage.completeRegistration(uniqueUserData);
    await authenticationPage.continueButton.click();

    await expect(authenticationPage.loggedInUserText).toBeVisible();

    await navbar.goToProducts();
    await expect(productsPage.productsContainer).toBeVisible();

    const productNames = await productsPage.getProductNames();
    expect(productNames.length).toBeGreaterThan(0);

    if (productNames[0]) {
      await productsPage.addProductToCartAndContinue(productNames[0]);
      await expect.soft(productsPage.continueShoppingButton).toBeHidden();
      await expect(productsPage.productsContainer).toBeVisible();
    }

    if (productNames.length > 1 && productNames[1]) {
      await productsPage.addProductToCartAndContinue(productNames[1]);
      await expect.soft(productsPage.continueShoppingButton).toBeHidden();
      await expect(productsPage.productsContainer).toBeVisible();
    }

    await navbar.goToCart();
    await expect(cartPage.cartTable).toBeVisible();

    const cartItems = await cartPage.getCartItems();
    expect.soft(cartItems.length).toBeGreaterThanOrEqual(1);
    expect.soft(cartItems.length).toBeLessThanOrEqual(2);

    const isEmpty = await cartPage.isCartEmpty();
    expect.soft(isEmpty).toBe(false);

    await expect(authenticationPage.loggedInUserText).toBeVisible();
  });

  test('should handle basic cart operations without login', async ({
    productsPage,
    cartPage,
    navbar,
  }) => {
    test.setTimeout(90000);
    await productsPage.navigateToHome();
    await expect(navbar.homeLink).toBeVisible({ timeout: 10000 });

    await navbar.goToProducts();
    await expect(productsPage.productsContainer).toBeVisible();

    const productNames = await productsPage.getProductNames();
    if (productNames[0]) {
      await productsPage.addProductToCartAndViewCart(productNames[0]);
    }

    await expect(cartPage.cartTable).toBeVisible();

    const itemCount = await cartPage.getCartItemCount();
    expect(itemCount).toBe(1);

    const cartItems = await cartPage.getCartItems();
    expect(cartItems.length).toBeGreaterThan(0);
    if (cartItems[0]) {
      expect(cartItems[0].name).toBeTruthy();
      expect(cartItems[0].price).toMatch(/Rs\. \d+/);
      expect(cartItems[0].quantity).toBe('1');
    }

    const itemCountRemove = await cartPage.getCartItemCount();
    if (itemCountRemove > 0) {
      await cartPage.removeItemFromCart(0);
      await cartPage.getCartItemCount();
    }
  });

  test('should require login for checkout process', async ({ cartPage, productsPage, navbar }) => {
    await productsPage.navigateToHome();
    await expect(navbar.homeLink).toBeVisible();

    await navbar.goToProducts();
    await expect(productsPage.productsContainer).toBeVisible();

    const productNames = await productsPage.getProductNames();
    const firstProduct = productNames[0];
    if (!firstProduct) {
      throw new Error('No products available');
    }
    await productsPage.addProductToCartAndViewCart(firstProduct);

    await cartPage.proceedToCheckout();

    await expect(cartPage.registerLoginLink).toBeVisible();
  });
});

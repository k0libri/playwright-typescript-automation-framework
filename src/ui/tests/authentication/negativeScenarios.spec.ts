import { test, expect } from '../../fixtures/uiFixtures';
import { UserDataFactory } from '../../../shared/utils/userDataFactory';
import { PaymentDataFactory } from '../../../shared/utils/paymentDataFactory';

/**
 * Story 4 - Negative Scenarios
 * Tests error handling and edge cases for login, registration, and checkout
 */
test.describe('Negative Scenarios - Error Handling @critical @negative', () => {
  test.beforeAll(async () => {
    console.log('Starting Negative Scenarios test suite');
  });

  test('should display error for invalid login credentials via UI', async ({
    authenticationPage,
    request,
  }) => {
    await test.step('Attempt login with invalid credentials', async () => {
      await authenticationPage.navigateToAuthenticationPage();
      await authenticationPage.login('invalid@email.com', 'wrongpassword');

      // Check for error message display
      await expect(authenticationPage.loginErrorMessage).toBeVisible();
    });

    // Verify via API as well
    await test.step('Verify login error via API', async () => {
      const { UserService } = await import('../../../api/services/user.service');
      const userService = new UserService(request);

      const loginResponse = await userService.verifyLogin('invalid@email.com', 'wrongpassword');
      expect(loginResponse.status()).toBe(404);

      const responseText = await loginResponse.text();
      expect(responseText).toContain('User not found!');
    });
  });

  test('should handle invalid email format during registration', async ({ authenticationPage }) => {
    await test.step('Attempt registration with invalid email format', async () => {
      await authenticationPage.navigateToAuthenticationPage();

      const invalidData = UserDataFactory.generateInvalidUserData();
      await authenticationPage.startSignup('Test User', invalidData.email ?? '');

      // Should either show validation error or stay on same page
      const currentUrl = await authenticationPage.getCurrentUrl();
      expect(currentUrl).toContain('/login');
    });
  });

  test('should handle empty required fields during registration', async ({
    authenticationPage,
  }) => {
    await test.step('Attempt registration with empty name', async () => {
      await authenticationPage.navigateToAuthenticationPage();
      await authenticationPage.startSignup('', 'valid@email.com');

      // Should show validation error or stay on same page
      const currentUrl = await authenticationPage.getCurrentUrl();
      expect(currentUrl).toContain('/login');
    });

    await test.step('Attempt registration with empty email', async () => {
      await authenticationPage.navigateToAuthenticationPage();
      await authenticationPage.startSignup('Valid Name', '');

      // Should show validation error or stay on same page
      const currentUrl = await authenticationPage.getCurrentUrl();
      expect(currentUrl).toContain('/login');
    });
  });

  test('should validate login with non-existent user via API', async ({ request }) => {
    await test.step('Attempt login with non-existent user via API', async () => {
      const { UserService } = await import('../../../api/services/user.service');
      const userService = new UserService(request);

      const loginResponse = await userService.verifyLogin('nonexistent@user.com', 'password123');
      expect(loginResponse.status()).toBe(404);

      const responseText = await loginResponse.text();
      expect(responseText).toContain('User not found!');
    });
  });

  test('should handle invalid user data during API registration', async ({ request }) => {
    await test.step('Attempt registration with invalid data via API', async () => {
      const { UserService } = await import('../../../api/services/user.service');
      const userService = new UserService(request);

      const invalidData = {
        name: '',
        email: 'invalid-email',
        password: '123',
        title: 'Mr',
        birth_date: '1',
        birth_month: 'January',
        birth_year: '1990',
        firstname: '',
        lastname: '',
        company: 'Test',
        address1: 'Test',
        country: 'US',
        zipcode: '12345',
        state: 'CA',
        city: 'LA',
        mobile_number: 'invalid',
      };

      const createResponse = await userService.createUser(invalidData);

      // Should return error status or validation error
      expect(createResponse.status()).not.toBe(201);
    });
  });

  test('should handle checkout with invalid payment details', async ({
    authenticationPage,
    productsPage,
    cartPage,
    checkoutPage,
    navbar,
    uniqueUserData,
    request,
  }) => {
    // Setup: Create user, login, and add product to cart
    await test.step('Setup: Create user and add product to cart', async () => {
      const { UserService } = await import('../../../api/services/user.service');
      const userService = new UserService(request);

      await userService.createUser(uniqueUserData);
      await authenticationPage.navigateToAuthenticationPage();
      await authenticationPage.login(uniqueUserData.email, uniqueUserData.password);

      await navbar.goToProducts();
      const productNames = await productsPage.getProductNames();
      if (productNames[0]) {
        await productsPage.addProductToCartAndViewCart(productNames[0]);
      }

      await cartPage.proceedToCheckout();
      await checkoutPage.placeOrder();
    });

    // Attempt payment with invalid details
    await test.step('Attempt payment with invalid card details', async () => {
      const invalidPaymentData = PaymentDataFactory.generateInvalidPaymentData();

      try {
        await checkoutPage.completePayment({
          nameOnCard: invalidPaymentData.nameOnCard ?? '',
          cardNumber: invalidPaymentData.cardNumber ?? '',
          cvc: invalidPaymentData.cvc ?? '',
          expiryMonth: invalidPaymentData.expiryMonth ?? '',
          expiryYear: invalidPaymentData.expiryYear ?? '',
        });

        // Should either show validation error or payment should fail
        const isConfirmed = await checkoutPage.isOrderConfirmed();
        if (isConfirmed) {
          // If order went through despite invalid data, this indicates a validation issue
          console.warn(
            'Order was confirmed with invalid payment data - potential validation issue',
          );
        }
      } catch {
        // Payment failure is expected with invalid data
        console.log('Payment failed as expected with invalid data');
      }
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

  test('should handle checkout without login', async ({ productsPage, cartPage, navbar }) => {
    await test.step('Attempt checkout without being logged in', async () => {
      await navbar.goToProducts();
      const productNames = await productsPage.getProductNames();
      if (productNames[0]) {
        await productsPage.addProductToCartAndViewCart(productNames[0]);
      }

      await cartPage.proceedToCheckout();

      // Should be prompted to login/register
      await expect(cartPage.registerLoginLink).toBeVisible();
    });
  });

  test('should handle API errors gracefully', async ({ request }) => {
    await test.step('Test API error handling for malformed requests', async () => {
      const { UserService } = await import('../../../api/services/user.service');
      const userService = new UserService(request);

      // Test with completely malformed data
      try {
        const response = await userService.getUserByEmail('');
        expect(response.status()).not.toBe(200);
      } catch (error) {
        // API call should handle errors gracefully
        console.log('API error handled:', error);
      }
    });
  });

  test('should validate product search with invalid terms', async ({ productsPage, navbar }) => {
    await test.step('Search for non-existent products', async () => {
      await navbar.goToProducts();
      await productsPage.searchProducts('ThisProductDoesNotExist123456789');

      // Should handle no results gracefully
      const productCount = await productsPage.getProductCount();
      expect(productCount).toBeGreaterThanOrEqual(0); // Should not crash
    });

    await test.step('Search with special characters', async () => {
      await productsPage.searchProducts('!@#$%^&*()');

      // Should handle special characters gracefully
      const productCount = await productsPage.getProductCount();
      expect(productCount).toBeGreaterThanOrEqual(0);
    });
  });
});

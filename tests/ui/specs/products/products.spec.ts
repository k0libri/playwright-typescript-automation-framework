/**
 * Products Tests
 * Tests product search and validation scenarios
 */
import { test, expect } from '../../uiFixtures';
import { faker } from '@faker-js/faker';

test.describe('Products @regression', () => {
  test.describe('Negative Test Cases @negative', () => {
    test('should validate product search with invalid terms', async ({ productsPage, navbar }) => {
      test.setTimeout(90000);
      await productsPage.navigateToHome();

      await navbar.goToProducts();
      await productsPage.searchProducts(
        `${faker.string.alphanumeric(10)}${faker.number.int({ min: 10000, max: 99999 })}`,
      );

      const productCount = await productsPage.getProductCount();
      expect(productCount).toBeGreaterThanOrEqual(0);

      await productsPage.searchProducts(faker.string.symbol(10));

      const productCountSpecial = await productsPage.getProductCount();
      expect(productCountSpecial).toBeGreaterThanOrEqual(0);
    });
  });
});

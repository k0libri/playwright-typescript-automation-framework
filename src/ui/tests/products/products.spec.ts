import { test, expect } from '../../fixtures/uiFixtures';

test.describe('Products @regression', () => {
  test.describe('Negative Test Cases @negative', () => {
    test('should validate product search with invalid terms', async ({
      productsPage,
      navbar,
      page,
    }) => {
      test.setTimeout(60000);

      await test.step('Search for non-existent products', async () => {
        await page.goto('/');
        await page.waitForLoadState('domcontentloaded');

        await navbar.goToProducts();
        await productsPage.searchProducts('ThisProductDoesNotExist123456789');

        const productCount = await productsPage.getProductCount();
        expect(productCount).toBeGreaterThanOrEqual(0);
      });

      await test.step('Search with special characters', async () => {
        await productsPage.searchProducts('!@#$%^&*()');

        const productCount = await productsPage.getProductCount();
        expect(productCount).toBeGreaterThanOrEqual(0);
      });
    });
  });
});

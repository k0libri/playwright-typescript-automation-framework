import type { Locator, Page } from '@playwright/test';
import { BasePage } from '../base/basePage.page';
import { Logger } from '../../../common/utils/logger.util';

/**
 * ProductsPage - Handles product listing and product interactions
 * Extends BasePage for common page behaviors
 */
export class ProductsPage extends BasePage {
  protected readonly pageUrl = '/products';

  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly productsContainer: Locator;
  readonly continueShoppingButton: Locator;
  readonly viewCartLink: Locator;
  readonly addToCartButtons: Locator;
  readonly productCards: Locator;

  constructor(page: Page) {
    super(page);

    this.searchInput = page.getByRole('textbox', { name: 'Search Product' });
    this.searchButton = page.locator('button[id="submit_search"]');
    this.productsContainer = page.locator('.features_items');
    this.continueShoppingButton = page.getByRole('button', { name: 'Continue Shopping' });
    this.viewCartLink = page.getByRole('link', { name: 'View Cart' });
    this.addToCartButtons = page.locator('[data-product-id]');
    this.productCards = page.locator('.product-image-wrapper');
  }

  /**
   * Navigate to products page
   */
  async navigateToProducts(): Promise<void> {
    Logger.info('Navigating to products page');
    await this.navigate();
  }

  /**
   * Search for products
   */
  async searchProducts(searchTerm: string): Promise<void> {
    Logger.info(`Searching for products: "${searchTerm}"`);
    await this.searchInput.fill(searchTerm);
    await this.searchButton.click();
    // Wait for search results to load - DOM content loaded is sufficient
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Add product to cart by index
   */
  async addProductToCart(productIndex: number): Promise<void> {
    Logger.info(`Adding product at index ${productIndex} to cart`);
    const addToCartButton = this.addToCartButtons.nth(productIndex);
    await addToCartButton.click();
  }

  /**
   * Add product to cart by name and continue shopping
   */
  async addProductToCartAndContinue(productName: string): Promise<void> {
    Logger.info(`Adding "${productName}" to cart and continuing`);
    const productCard = this.page
      .locator('.product-image-wrapper')
      .filter({ hasText: productName });
    const addToCartButton = productCard.locator('[data-product-id]').first();

    // Force click to bypass advertisement overlays that intercept pointer events
    await addToCartButton.click({ force: true });

    // Wait for modal to appear and click continue shopping
    await this.continueShoppingButton.waitFor({ state: 'visible' });
    await this.continueShoppingButton.click();
  }

  /**
   * Add product to cart by name and view cart
   */
  async addProductToCartAndViewCart(productName: string): Promise<void> {
    Logger.info(`Adding "${productName}" to cart and viewing cart`);
    const productCard = this.page
      .locator('.product-image-wrapper')
      .filter({ hasText: productName });
    const addToCartButton = productCard.locator('[data-product-id]').first();

    // Force click to bypass advertisement overlays that intercept pointer events
    await addToCartButton.click({ force: true });

    // Wait for modal to appear and click view cart
    await this.viewCartLink.waitFor({ state: 'visible' });
    await this.viewCartLink.click();
  }

  /**
   * Get product names from current page
   */
  async getProductNames(): Promise<string[]> {
    await this.productCards.first().waitFor({ state: 'visible' });
    const productElements = await this.productCards.locator('p').all();
    const productNames: string[] = [];

    for (const element of productElements) {
      const text = await element.textContent();
      if (text?.trim()) {
        productNames.push(text.trim());
      }
    }

    return productNames;
  }

  /**
   * Get number of visible products
   */
  async getProductCount(): Promise<number> {
    try {
      await this.productCards.first().waitFor({ state: 'visible' });
      return await this.productCards.count();
    } catch {
      // No products found (e.g., search returned no results)
      return 0;
    }
  }
}

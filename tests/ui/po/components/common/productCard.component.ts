import type { Locator, Page } from '@playwright/test';
import { BaseComponent } from '../../base/baseComponent.component';
import { Logger } from '../../../../common/utils/logger.util';

/**
 * ProductCardComponent - Handles individual product card interactions
 * Extends BaseComponent for reusable product card functionality
 */
export class ProductCardComponent extends BaseComponent {
  readonly container: Locator;
  readonly productImage: Locator;
  readonly productPrice: Locator;
  readonly productName: Locator;
  readonly addToCartButton: Locator;
  readonly viewProductLink: Locator;

  constructor(page: Page, container: Locator) {
    super(page);
    this.container = container;

    this.productImage = container.locator('img').first();
    this.productPrice = container.locator('h2');
    this.productName = container.locator('p');
    this.addToCartButton = container.locator('[data-product-id]').first();
    this.viewProductLink = container.getByRole('link', { name: 'View Product' });
  }

  /**
   * Add product to cart
   * @returns Promise<void>
   */
  async addToCart(): Promise<void> {
    Logger.info('Adding product to cart from product card');
    await this.addToCartButton.click({ force: true });
  }

  /**
   * View product details page
   * @returns Promise<void>
   */
  async viewProduct(): Promise<void> {
    Logger.info('Viewing product details');
    await this.viewProductLink.click();
  }

  /**
   * Get product name
   * @returns Promise<string> - The product name text
   */
  async getProductName(): Promise<string> {
    return (await this.productName.textContent()) ?? '';
  }

  /**
   * Get product price
   * @returns Promise<string> - The product price text
   */
  async getProductPrice(): Promise<string> {
    return (await this.productPrice.textContent()) ?? '';
  }

  override async isVisible(): Promise<boolean> {
    return await super.isVisible(this.container);
  }
}

/**
 * ProductCardsListComponent - Handles list of product cards
 * Provides utilities to interact with multiple product cards
 */
export class ProductCardsListComponent extends BaseComponent {
  readonly productsContainer: Locator;
  readonly productCards: Locator;

  constructor(page: Page) {
    super(page);

    this.productsContainer = page.locator('.features_items');
    this.productCards = page.locator('.product-image-wrapper');
  }

  /**
   * Get product card by index position
   * @param index - Zero-based index of the product card
   * @returns ProductCardComponent - Instance of ProductCardComponent for the specified index
   */
  getProductCardByIndex(index: number): ProductCardComponent {
    const cardLocator = this.productCards.nth(index);
    return new ProductCardComponent(this.page, cardLocator);
  }

  /**
   * Get product card by product name
   * @param productName - The name of the product to find
   * @returns ProductCardComponent - Instance of ProductCardComponent for the specified product
   */
  getProductCardByName(productName: string): ProductCardComponent {
    const cardLocator = this.productCards.filter({ hasText: productName });
    return new ProductCardComponent(this.page, cardLocator);
  }

  /**
   * Get total number of product cards
   * @returns Promise<number> - Count of visible product cards
   */
  async getProductCount(): Promise<number> {
    return await this.productCards.count();
  }

  /**
   * Get all product names from visible product cards
   * @returns Promise<string[]> - Array of all product names
   */
  async getAllProductNames(): Promise<string[]> {
    await this.productCards.first().waitFor({ state: 'visible' });
    const productElements = await this.productCards.locator('p').all();
    const productNames: string[] = [];

    for (const element of productElements) {
      const text = await element.textContent();
      if (text) {
        productNames.push(text.trim());
      }
    }

    return productNames;
  }
}

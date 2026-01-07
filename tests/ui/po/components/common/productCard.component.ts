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

  async addToCart(): Promise<void> {
    Logger.info('Adding product to cart from product card');
    await this.addToCartButton.click({ force: true });
  }

  async viewProduct(): Promise<void> {
    Logger.info('Viewing product details');
    await this.viewProductLink.click();
  }

  async getProductName(): Promise<string> {
    return (await this.productName.textContent()) ?? '';
  }

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

  getProductCardByIndex(index: number): ProductCardComponent {
    const cardLocator = this.productCards.nth(index);
    return new ProductCardComponent(this.page, cardLocator);
  }

  getProductCardByName(productName: string): ProductCardComponent {
    const cardLocator = this.productCards.filter({ hasText: productName });
    return new ProductCardComponent(this.page, cardLocator);
  }

  async getProductCount(): Promise<number> {
    return await this.productCards.count();
  }

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

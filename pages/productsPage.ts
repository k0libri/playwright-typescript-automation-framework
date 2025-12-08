// Page Object Model for Products UI
import { Page } from '@playwright/test';

export class ProductsPage {
  private productCard = '.features_items .single-products';
  private addToCartButton = '.features_items .single-products .add-to-cart';
  private outOfStockAddToCartButton = '.product-card.out-of-stock button.add-to-cart';

  constructor(private page: Page) {}
  async goto() { await this.page.goto('/products'); }
  async addFirstProductToCart() {
    const firstCard = this.page.locator(this.productCard).first();
    await firstCard.scrollIntoViewIfNeeded();
    await firstCard.hover();
    await this.page.locator(this.addToCartButton).first().click();
  }
  async addOutOfStockProductToCart() {
    await this.page.click(this.outOfStockAddToCartButton);
  }
}

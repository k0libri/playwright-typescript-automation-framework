import { Page, Locator } from '@playwright/test';

export class ProductPage {
  readonly page: Page;
  readonly productName: Locator;
  readonly productPrice: Locator;
  readonly productCategory: Locator;
  readonly productAvailability: Locator;
  readonly productCondition: Locator;
  readonly productBrand: Locator;
  readonly quantityInput: Locator;
  readonly addToCartButton: Locator;
  readonly reviewSection: Locator;
  readonly reviewNameInput: Locator;
  readonly reviewEmailInput: Locator;
  readonly reviewTextArea: Locator;
  readonly reviewSubmitButton: Locator;
  readonly continueShoppingButton: Locator;
  readonly viewCartButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productName = page.locator('.product-information h2');
    this.productPrice = page.locator('.product-information span span');
    this.productCategory = page.locator('.product-information p').filter({ hasText: 'Category:' });
    this.productAvailability = page
      .locator('.product-information p')
      .filter({ hasText: 'Availability:' });
    this.productCondition = page
      .locator('.product-information p')
      .filter({ hasText: 'Condition:' });
    this.productBrand = page.locator('.product-information p').filter({ hasText: 'Brand:' });
    this.quantityInput = page.locator('#quantity');
    this.addToCartButton = page.locator('.btn.btn-default.cart');
    this.reviewSection = page.locator('.category-tab');
    this.reviewNameInput = page.locator('#name');
    this.reviewEmailInput = page.locator('#email');
    this.reviewTextArea = page.locator('#review');
    this.reviewSubmitButton = page.locator('#button-review');
    this.continueShoppingButton = page.getByRole('button', { name: 'Continue Shopping' });
    this.viewCartButton = page.getByRole('link', { name: 'View Cart' });
  }

  async getProductName(): Promise<string | null> {
    return await this.productName.textContent();
  }

  async getProductPrice(): Promise<string | null> {
    return await this.productPrice.textContent();
  }

  async getProductCategory(): Promise<string | null> {
    return await this.productCategory.textContent();
  }

  async getProductAvailability(): Promise<string | null> {
    return await this.productAvailability.textContent();
  }

  async getProductCondition(): Promise<string | null> {
    return await this.productCondition.textContent();
  }

  async getProductBrand(): Promise<string | null> {
    return await this.productBrand.textContent();
  }

  async setQuantity(quantity: number): Promise<void> {
    await this.quantityInput.clear();
    await this.quantityInput.fill(quantity.toString());
  }

  async addToCart(): Promise<void> {
    await this.addToCartButton.click();
  }

  async addToCartWithQuantity(quantity: number): Promise<void> {
    await this.setQuantity(quantity);
    await this.addToCart();
  }

  async addReview(name: string, email: string, reviewText: string): Promise<void> {
    await this.reviewNameInput.fill(name);
    await this.reviewEmailInput.fill(email);
    await this.reviewTextArea.fill(reviewText);
    await this.reviewSubmitButton.click();
  }

  async continueShopping(): Promise<void> {
    await this.continueShoppingButton.click();
  }

  async viewCart(): Promise<void> {
    await this.viewCartButton.click();
  }

  async isAddedToCartModalVisible(): Promise<boolean> {
    return await this.continueShoppingButton.isVisible({ timeout: 5000 });
  }
}

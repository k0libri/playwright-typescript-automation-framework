import { Page, Locator } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly cartItems: Locator;
  readonly cartProductNames: Locator;
  readonly cartProductPrices: Locator;
  readonly cartProductQuantities: Locator;
  readonly cartProductTotals: Locator;
  readonly quantityButtons: Locator;
  readonly removeButtons: Locator;
  readonly proceedToCheckoutButton: Locator;
  readonly registerLoginLink: Locator;
  readonly subscriptionInput: Locator;
  readonly subscriptionButton: Locator;
  readonly emptyCartMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartItems = page.locator('#cart_info tbody tr');
    this.cartProductNames = page.locator('.cart_description h4 a');
    this.cartProductPrices = page.locator('.cart_price p');
    this.cartProductQuantities = page.locator('.cart_quantity button');
    this.cartProductTotals = page.locator('.cart_total_price');
    this.quantityButtons = page.locator('.cart_quantity .disabled');
    this.removeButtons = page.locator('.cart_quantity_delete');
    this.proceedToCheckoutButton = page.locator('.check_out');
    this.registerLoginLink = page.getByRole('link', { name: 'Register / Login' });
    this.subscriptionInput = page.locator('#susbscribe_email');
    this.subscriptionButton = page.locator('#subscribe');
    this.emptyCartMessage = page.locator('text=Cart is empty!');
  }

  async goto(): Promise<void> {
    await this.page.goto('/view_cart');
  }

  async getCartItemsCount(): Promise<number> {
    try {
      return await this.cartItems.count();
    } catch {
      return 0;
    }
  }

  async getCartProductNames(): Promise<string[]> {
    const productNames: string[] = [];
    const count = await this.cartProductNames.count();

    for (let i = 0; i < count; i++) {
      const itemName = await this.cartProductNames.nth(i).textContent();
      if (itemName !== null) {
        productNames.push(itemName.trim());
      }
    }

    return productNames;
  }

  async getCartProductPrices(): Promise<string[]> {
    const prices: string[] = [];
    const count = await this.cartProductPrices.count();

    for (let i = 0; i < count; i++) {
      const price = await this.cartProductPrices.nth(i).textContent();
      if (price !== null) {
        prices.push(price.trim());
      }
    }

    return prices;
  }

  async getCartProductQuantities(): Promise<number[]> {
    const quantities: number[] = [];
    const count = await this.cartProductQuantities.count();

    for (let i = 0; i < count; i++) {
      const quantity = await this.cartProductQuantities.nth(i).textContent();
      if (quantity !== null) {
        quantities.push(parseInt(quantity.trim(), 10));
      }
    }

    return quantities;
  }

  async removeProduct(index: number = 0): Promise<void> {
    await this.removeButtons.nth(index).click();
  }

  async removeAllProducts(): Promise<void> {
    const count = await this.removeButtons.count();
    for (let i = count - 1; i >= 0; i--) {
      await this.removeButtons.nth(i).click();
      await this.cartItems.nth(i).waitFor({ state: 'detached' });
    }
  }

  async proceedToCheckout(): Promise<void> {
    await this.proceedToCheckoutButton.click();
  }

  async goToRegisterLogin(): Promise<void> {
    await this.registerLoginLink.click();
  }

  async subscribeToNewsletter(email: string): Promise<void> {
    await this.subscriptionInput.fill(email);
    await this.subscriptionButton.click();
  }

  async isCartEmpty(): Promise<boolean> {
    try {
      return await this.emptyCartMessage.isVisible({ timeout: 5000 });
    } catch {
      const itemCount = await this.getCartItemsCount();
      return itemCount === 0;
    }
  }

  async getTotalAmount(): Promise<string | null> {
    const totalElements = await this.cartProductTotals.count();
    if (totalElements > 0) {
      return await this.cartProductTotals.last().textContent();
    }
    return null;
  }
}

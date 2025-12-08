// Page Object Model for Cart UI
import { Page, Locator } from '@playwright/test';

export class CartPage {
  private cartItemSelector = 'td.cart_product';
  private checkoutButton = 'button.checkout';

  constructor(private page: Page) {}
  async goto() { await this.page.goto('/view_cart'); }
  cartItems(): Locator { return this.page.locator(this.cartItemSelector); }
  async checkout() { await this.page.click(this.checkoutButton); }
}

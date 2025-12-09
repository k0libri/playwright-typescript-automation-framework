// Page Object Model for Cart UI
import { Page, Locator } from '@playwright/test';
import { closeConsentModal } from '../utils/helpers';

export class CartPage {
  public cartItemSelector: string;
  public checkoutButton: string;
  constructor(private page: Page) {
    this.cartItemSelector = 'td.cart_product';
    this.checkoutButton = 'button.checkout';
  }
  async goto() {
    await this.page.goto('/view_cart');
    await closeConsentModal(this.page);
  }
  cartItems(): Locator { return this.page.locator(this.cartItemSelector); }
  async checkout() { await this.page.click(this.checkoutButton); }
}

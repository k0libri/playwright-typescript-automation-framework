import type { Locator, Page } from '@playwright/test';
import { BasePage } from '../base/basePage.page';

/**
 * CartPage - Handles shopping cart functionality
 * Extends BasePage for common page behaviors
 */
export class CartPage extends BasePage {
  readonly cartTable: Locator;
  readonly cartItems: Locator;
  readonly proceedToCheckoutButton: Locator;
  readonly emptyCartMessage: Locator;
  readonly cartTotal: Locator;
  readonly removeItemButtons: Locator;
  readonly quantityInputs: Locator;
  readonly registerLoginLink: Locator;

  constructor(page: Page) {
    super(page);

    this.cartTable = page.locator('#cart_info_table');
    this.cartItems = page.locator('#cart_info tbody tr');
    this.proceedToCheckoutButton = page.getByText('Proceed To Checkout');
    this.emptyCartMessage = page.getByText('Cart is empty!');
    this.cartTotal = page.locator('.cart_total_price');
    this.removeItemButtons = page.locator('.cart_quantity_delete');
    this.quantityInputs = page.locator('.cart_quantity_input');
    this.registerLoginLink = page.getByRole('link', { name: 'Register / Login' });
  }

  /**
   * Navigate to cart page
   */
  async navigateToCart(): Promise<void> {
    await this.navigateTo('/view_cart');
  }

  /**
   * Check if cart is empty
   */
  async isCartEmpty(): Promise<boolean> {
    try {
      // First check if there are any cart items
      const itemCount = await this.cartItems.count();
      if (itemCount === 0) {
        return true;
      }

      // Check for empty cart message
      try {
        const emptyMessage = this.page.getByText('Cart is empty!');
        await emptyMessage.waitFor();
        return true;
      } catch {
        // No empty message found
      }

      // Check if cart table is not visible
      try {
        const isTableVisible = await this.cartTable.isVisible();
        return !isTableVisible;
      } catch {
        // If we can't determine table visibility, assume not empty
        return false;
      }
    } catch {
      // If there's any error, assume cart is not empty
      return false;
    }
  }

  /**
   * Get cart items details
   */
  async getCartItems(): Promise<
    Array<{
      name: string;
      price: string;
      quantity: string;
      total: string;
    }>
  > {
    const items = [];
    const itemCount = await this.cartItems.count();

    for (let i = 0; i < itemCount; i++) {
      const item = this.cartItems.nth(i);
      const name = (await item.locator('.cart_description h4').textContent()) ?? '';
      const price = (await item.locator('.cart_price p').textContent()) ?? '';
      const quantity = (await item.locator('.cart_quantity button').textContent()) ?? '';
      const total = (await item.locator('.cart_total p').textContent()) ?? '';

      items.push({
        name: name.trim(),
        price: price.trim(),
        quantity: quantity.trim(),
        total: total.trim(),
      });
    }

    return items;
  }

  /**
   * Get total cart value
   */
  async getCartTotal(): Promise<string> {
    return (await this.cartTotal.textContent()) ?? '';
  }

  /**
   * Remove item from cart by index
   */
  async removeItemFromCart(itemIndex: number): Promise<void> {
    await this.handleCookieConsentIfPresent();
    await this.removeItemButtons.nth(itemIndex).click({ force: true });
    await this.page.waitForLoadState('domcontentloaded');
    await this.waitForPageReady();
  }

  /**
   * Proceed to checkout
   */
  async proceedToCheckout(): Promise<void> {
    await this.proceedToCheckoutButton.click();
  }

  /**
   * Click register/login when checkout requires authentication
   */
  async goToRegisterLogin(): Promise<void> {
    await this.registerLoginLink.click();
  }

  /**
   * Get number of items in cart
   */
  async getCartItemCount(): Promise<number> {
    try {
      if (await this.isCartEmpty()) {
        return 0;
      }
      return await this.cartItems.count();
    } catch (error) {
      if (error.message.includes('Target page, context or browser has been closed')) {
        throw new Error('Browser context was closed unexpectedly during cart operation');
      }
      console.warn('Error getting cart item count:', error.message);
      return 0;
    }
  }
}

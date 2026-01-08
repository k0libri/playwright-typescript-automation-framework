import type { Locator, Page } from '@playwright/test';
import { BasePage } from '../base/basePage.page';
import { Logger } from '../../../common/utils/logger.util';

/**
 * CartPage - Handles shopping cart functionality
 * Extends BasePage for common page behaviors
 */
export class CartPage extends BasePage {
  protected readonly pageUrl = '/view_cart';

  readonly cartTable: Locator;
  readonly cartItems: Locator;
  readonly proceedToCheckoutButton: Locator;
  readonly removeItemButtons: Locator;
  readonly registerLoginLink: Locator;

  constructor(page: Page) {
    super(page);

    this.cartTable = page.locator('#cart_info_table');
    this.cartItems = page.locator('#cart_info tbody tr');
    this.proceedToCheckoutButton = page.getByText('Proceed To Checkout');
    this.removeItemButtons = page.locator('.cart_quantity_delete');
    this.registerLoginLink = page.getByRole('link', { name: 'Register / Login' });
  }

  /**
   * Navigate to cart page
   * @returns Promise<void>
   */
  async navigateToCart(): Promise<void> {
    Logger.info('Navigating to cart page');
    await this.navigate();
  }

  /**
   * Check if cart is empty
   * @returns Promise<boolean> - True if cart contains no items, false otherwise
   */
  async isCartEmpty(): Promise<boolean> {
    return (await this.cartItems.count()) === 0;
  }

  /**
   * Get cart items details
   * @returns Promise<Array<{name: string, price: string, quantity: string, total: string}>> - Array of cart items with details
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
    const rows = await this.cartItems.all();

    for (const row of rows) {
      const name = (await row.locator('.cart_description h4').textContent())?.trim() ?? '';
      const price = (await row.locator('.cart_price p').textContent())?.trim() ?? '';
      const quantity = (await row.locator('.cart_quantity button').textContent())?.trim() ?? '';
      const total = (await row.locator('.cart_total p').textContent())?.trim() ?? '';

      items.push({ name, price, quantity, total });
    }

    return items;
  }

  /**
   * Remove item from cart by index
   * @param itemIndex - Zero-based index of the item to remove
   * @returns Promise<void>
   */
  async removeItemFromCart(itemIndex: number): Promise<void> {
    Logger.info(`Removing item at index ${itemIndex} from cart`);
    await this.removeItemButtons.nth(itemIndex).click({ force: true });
    await this.page.waitForLoadState('domcontentloaded');
    await this.waitForPageReady();
  }

  /**
   * Proceed to checkout
   * @returns Promise<void>
   */
  async proceedToCheckout(): Promise<void> {
    Logger.info('Proceeding to checkout');
    await this.proceedToCheckoutButton.click();
  }

  /**
   * Get number of items in cart
   * @returns Promise<number> - Total count of items in the cart
   */
  async getCartItemCount(): Promise<number> {
    return await this.cartItems.count();
  }
}

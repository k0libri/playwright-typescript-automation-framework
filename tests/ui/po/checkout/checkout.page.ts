import type { Locator, Page } from '@playwright/test';
import { BasePage } from '../base/basePage.page';
import { Logger } from '../../../common/utils/logger.util';

/**
 * CheckoutPage - Handles checkout process
 * Extends BasePage for common page behaviors
 */
export class CheckoutPage extends BasePage {
  protected readonly pageUrl = '/checkout';

  readonly reviewOrderSection: Locator;
  readonly addressDetails: Locator;
  readonly orderItems: Locator;
  readonly commentTextArea: Locator;
  readonly placeOrderButton: Locator;
  readonly paymentForm: Locator;
  readonly nameOnCardInput: Locator;
  readonly cardNumberInput: Locator;
  readonly cvcInput: Locator;
  readonly expiryMonthInput: Locator;
  readonly expiryYearInput: Locator;
  readonly payAndConfirmButton: Locator;
  readonly orderConfirmationMessage: Locator;
  readonly continueButton: Locator;

  constructor(page: Page) {
    super(page);

    this.reviewOrderSection = page.locator('#cart_info');
    this.addressDetails = page.locator('#address_details');
    this.orderItems = page.locator('#cart_info tbody tr');
    this.commentTextArea = page.locator('[name="message"]');
    this.placeOrderButton = page.getByText('Place Order');
    this.paymentForm = page.locator('#payment-form');
    this.nameOnCardInput = page.locator('[name="name_on_card"]');
    this.cardNumberInput = page.locator('[name="card_number"]');
    this.cvcInput = page.locator('[name="cvc"]');
    this.expiryMonthInput = page.locator('[name="expiry_month"]');
    this.expiryYearInput = page.locator('[name="expiry_year"]');
    this.payAndConfirmButton = page.locator('[data-qa="pay-button"]');
    this.orderConfirmationMessage = page.getByText('Order Placed!');
    this.continueButton = page.getByRole('link', { name: 'Continue' });
  }

  /**
   * Review order details
   * @returns Promise<Array<{name: string, price: string, quantity: string, total: string}>> - Array of order items with details
   */
  async getOrderItems(): Promise<
    Array<{
      name: string;
      price: string;
      quantity: string;
      total: string;
    }>
  > {
    const items = [];
    const rows = await this.orderItems.all();

    for (const row of rows) {
      const hasProductInfo = (await row.locator('.cart_description').count()) > 0;
      if (!hasProductInfo) {
        continue;
      }

      const name = (await row.locator('.cart_description h4 a').textContent())?.trim() ?? '';
      const price = (await row.locator('.cart_price p').textContent())?.trim() ?? '';
      const quantity = (await row.locator('.cart_quantity button').textContent())?.trim() ?? '';
      const total = (await row.locator('.cart_total p').textContent())?.trim() ?? '';

      if (!name) {
        continue;
      }

      items.push({ name, price, quantity, total });
    }

    return items;
  }

  /**
   * Add order comment
   * @param comment - The comment text to include with the order
   * @returns Promise<void>
   */
  async addOrderComment(comment: string): Promise<void> {
    await this.commentTextArea.fill(comment);
  }

  /**
   * Place order
   * @returns Promise<void>
   */
  async placeOrder(): Promise<void> {
    Logger.info('Placing order');
    await this.placeOrderButton.click();
    await this.page.waitForURL('**/payment');
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Fill payment details and confirm order
   * @param paymentData - Payment information object containing card details
   * @param paymentData.nameOnCard - Cardholder name
   * @param paymentData.cardNumber - Card number
   * @param paymentData.cvc - Card CVV/CVC security code
   * @param paymentData.expiryMonth - Card expiry month
   * @param paymentData.expiryYear - Card expiry year
   * @returns Promise<void>
   */
  async completePayment(paymentData: {
    nameOnCard: string;
    cardNumber: string;
    cvc: string;
    expiryMonth: string;
    expiryYear: string;
  }): Promise<void> {
    Logger.info('Completing payment');
    await this.nameOnCardInput.fill(paymentData.nameOnCard);
    await this.cardNumberInput.fill(paymentData.cardNumber);
    await this.cvcInput.fill(paymentData.cvc);
    await this.expiryMonthInput.fill(paymentData.expiryMonth);
    await this.expiryYearInput.fill(paymentData.expiryYear);

    await this.payAndConfirmButton.click();
  }

  /**
   * Check if order is confirmed
   * @returns Promise<boolean> - True if order confirmation message is visible, false otherwise
   */
  async isOrderConfirmed(): Promise<boolean> {
    try {
      await this.orderConfirmationMessage.waitFor();
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get order confirmation details
   * @returns Promise<string> - The order confirmation message text
   */
  async getOrderConfirmationMessage(): Promise<string> {
    return (await this.orderConfirmationMessage.textContent()) ?? '';
  }

  /**
   * Continue after order confirmation
   * @returns Promise<void>
   */
  async continueAfterOrder(): Promise<void> {
    await this.continueButton.click();
  }

  /**
   * Facade: Complete entire checkout flow (place order + payment)
   * @param paymentData - Payment information object containing card details
   * @param comment - Optional order comment to include (default: undefined)
   * @returns Promise<void>
   */
  async completeCheckout(
    paymentData: {
      nameOnCard: string;
      cardNumber: string;
      cvc: string;
      expiryMonth: string;
      expiryYear: string;
    },
    comment?: string,
  ): Promise<void> {
    Logger.info('Completing entire checkout flow');

    if (comment) {
      await this.addOrderComment(comment);
    }

    await this.placeOrder();
    await this.completePayment(paymentData);
  }
}

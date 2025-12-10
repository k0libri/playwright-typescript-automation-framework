import type { Locator, Page } from '@playwright/test';
import { BasePage } from '../base/basePage.page';

/**
 * CheckoutPage - Handles checkout process
 * Extends BasePage for common page behaviors
 */
export class CheckoutPage extends BasePage {
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
  readonly orderNumber: Locator;
  readonly downloadInvoiceButton: Locator;
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
    this.orderNumber = page.locator('.order-confirmation');
    this.downloadInvoiceButton = page.getByText('Download Invoice');
    this.continueButton = page.getByRole('link', { name: 'Continue' });
  }

  /**
   * Review order details
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
    const itemCount = await this.orderItems.count();

    for (let i = 0; i < itemCount; i++) {
      const item = this.orderItems.nth(i);
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
   * Add order comment
   */
  async addOrderComment(comment: string): Promise<void> {
    await this.commentTextArea.fill(comment);
  }

  /**
   * Place order
   */
  async placeOrder(): Promise<void> {
    await this.placeOrderButton.click();
  }

  /**
   * Fill payment details and confirm order
   */
  async completePayment(paymentData: {
    nameOnCard: string;
    cardNumber: string;
    cvc: string;
    expiryMonth: string;
    expiryYear: string;
  }): Promise<void> {
    await this.nameOnCardInput.fill(paymentData.nameOnCard);
    await this.cardNumberInput.fill(paymentData.cardNumber);
    await this.cvcInput.fill(paymentData.cvc);
    await this.expiryMonthInput.fill(paymentData.expiryMonth);
    await this.expiryYearInput.fill(paymentData.expiryYear);

    await this.payAndConfirmButton.click();
  }

  /**
   * Check if order is confirmed
   */
  async isOrderConfirmed(): Promise<boolean> {
    try {
      await this.orderConfirmationMessage.waitFor({ timeout: 10000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get order confirmation details
   */
  async getOrderConfirmationMessage(): Promise<string> {
    return (await this.orderConfirmationMessage.textContent()) ?? '';
  }

  /**
   * Continue after order confirmation
   */
  async continueAfterOrder(): Promise<void> {
    await this.continueButton.click();
  }
}

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
      try {
        await item.waitFor({ state: 'visible' });
      } catch {
        continue; // Skip rows that aren't visible (e.g., header rows)
      }

      // Try multiple selector patterns for product name
      let name = '';
      try {
        name = (await item.locator('h4 a').textContent()) ?? '';
      } catch {
        try {
          name = (await item.locator('h4').textContent()) ?? '';
        } catch {
          try {
            name = (await item.locator('.cart_description h4').textContent()) ?? '';
          } catch {
            // Last resort: get all text from the description cell
            const cells = await item.locator('td').all();
            if (cells.length > 1) {
              name = (await cells[1].textContent()) ?? '';
            }
          }
        }
      }

      // Skip if name is empty or is the "Total Amount" row
      const trimmedName = name.trim();
      if (
        !trimmedName ||
        trimmedName === '' ||
        trimmedName.toLowerCase().includes('total amount')
      ) {
        continue;
      }

      let price = '';
      let quantity = '';
      let total = '';

      try {
        price = (await item.locator('.cart_price p').textContent()) ?? '';
      } catch {
        // Try alternative selector without class prefix
        try {
          const cells = await item.locator('td').all();
          if (cells.length > 2) {
            price = (await cells[2].textContent()) ?? '';
          }
        } catch {
          // Skip this field if not found
        }
      }

      try {
        quantity = (await item.locator('.cart_quantity button').textContent()) ?? '';
      } catch {
        // Try alternative selector
        try {
          const cells = await item.locator('td').all();
          if (cells.length > 3) {
            quantity = (await cells[3].textContent()) ?? '';
          }
        } catch {
          // Skip this field if not found
        }
      }

      try {
        total = (await item.locator('.cart_total p').textContent()) ?? '';
      } catch {
        // Try alternative selector
        try {
          const cells = await item.locator('td').all();
          if (cells.length > 4) {
            total = (await cells[4].textContent()) ?? '';
          }
        } catch {
          // Skip this field if not found
        }
      }

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
    // Wait for navigation to payment page
    await this.page.waitForURL('**/payment');
    await this.page.waitForLoadState('domcontentloaded');
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
      await this.orderConfirmationMessage.waitFor();
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

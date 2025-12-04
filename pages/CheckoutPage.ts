import { Page, Locator } from '@playwright/test';
import { User } from '../utils/UserFactory';

export class CheckoutPage {
  readonly page: Page;
  readonly orderItems: Locator;
  readonly deliveryAddress: Locator;
  readonly billingAddress: Locator;
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
  readonly downloadInvoiceButton: Locator;
  readonly continueButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.orderItems = page.locator('.cart_info');
    this.deliveryAddress = page.locator('#address_delivery');
    this.billingAddress = page.locator('#address_invoice');
    this.commentTextArea = page.locator('[name="message"]');
    this.placeOrderButton = page.getByRole('link', { name: 'Place Order' });
    this.paymentForm = page.locator('.payment-form');
    this.nameOnCardInput = page.locator('[data-qa="name-on-card"]');
    this.cardNumberInput = page.locator('[data-qa="card-number"]');
    this.cvcInput = page.locator('[data-qa="cvc"]');
    this.expiryMonthInput = page.locator('[data-qa="expiry-month"]');
    this.expiryYearInput = page.locator('[data-qa="expiry-year"]');
    this.payAndConfirmButton = page.locator('[data-qa="pay-button"]');
    this.orderConfirmationMessage = page.locator('text=Your order has been placed successfully!');
    this.downloadInvoiceButton = page.getByRole('link', { name: 'Download Invoice' });
    this.continueButton = page.getByRole('link', { name: 'Continue' });
  }

  async reviewOrderItems(): Promise<string[]> {
    const items: string[] = [];
    const itemElements = this.orderItems.locator('.cart_description h4');
    const count = await itemElements.count();

    for (let i = 0; i < count; i++) {
      const itemName = await itemElements.nth(i).textContent();
      if (itemName) {
        items.push(itemName.trim());
      }
    }

    return items;
  }

  async getDeliveryAddress(): Promise<string | null> {
    return await this.deliveryAddress.textContent();
  }

  async getBillingAddress(): Promise<string | null> {
    return await this.billingAddress.textContent();
  }

  async addOrderComment(comment: string) {
    await this.commentTextArea.fill(comment);
  }

  async placeOrder() {
    await this.placeOrderButton.click();
  }

  async fillPaymentDetails(cardDetails: {
    nameOnCard: string;
    cardNumber: string;
    cvc: string;
    expiryMonth: string;
    expiryYear: string;
  }) {
    await this.nameOnCardInput.fill(cardDetails.nameOnCard);
    await this.cardNumberInput.fill(cardDetails.cardNumber);
    await this.cvcInput.fill(cardDetails.cvc);
    await this.expiryMonthInput.fill(cardDetails.expiryMonth);
    await this.expiryYearInput.fill(cardDetails.expiryYear);
  }

  async payAndConfirmOrder() {
    await this.payAndConfirmButton.click();
  }

  async completeOrder(
    cardDetails: {
      nameOnCard: string;
      cardNumber: string;
      cvc: string;
      expiryMonth: string;
      expiryYear: string;
    },
    comment?: string,
  ) {
    if (comment) {
      await this.addOrderComment(comment);
    }

    await this.placeOrder();
    await this.fillPaymentDetails(cardDetails);
    await this.payAndConfirmOrder();
  }

  async isOrderConfirmed(): Promise<boolean> {
    return await this.orderConfirmationMessage.isVisible({ timeout: 10000 });
  }

  async getOrderConfirmationMessage(): Promise<string | null> {
    if (await this.isOrderConfirmed()) {
      return await this.orderConfirmationMessage.textContent();
    }
    return null;
  }

  async downloadInvoice() {
    await this.downloadInvoiceButton.click();
  }

  async continueAfterOrder() {
    await this.continueButton.click();
  }

  async verifyAddressDetails(user: User): Promise<{
    deliveryAddressMatch: boolean;
    billingAddressMatch: boolean;
  }> {
    const deliveryText = await this.getDeliveryAddress();
    const billingText = await this.getBillingAddress();

    const deliveryMatch = deliveryText
      ? deliveryText.includes(user.firstname || '') &&
        deliveryText.includes(user.lastname || '') &&
        deliveryText.includes(user.address1 || '')
      : false;

    const billingMatch = billingText
      ? billingText.includes(user.firstname || '') &&
        billingText.includes(user.lastname || '') &&
        billingText.includes(user.address1 || '')
      : false;

    return {
      deliveryAddressMatch: deliveryMatch,
      billingAddressMatch: billingMatch,
    };
  }
}

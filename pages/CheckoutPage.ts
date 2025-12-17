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
    this.orderConfirmationMessage = page.locator('text=Order Placed!');
    this.downloadInvoiceButton = page.getByRole('link', { name: 'Download Invoice' });
    this.continueButton = page.getByRole('link', { name: 'Continue' });
  }

  async reviewOrderItems(): Promise<string[]> {
    const items: string[] = [];
    const itemElements = this.orderItems.locator('.cart_description h4');
    const count = await itemElements.count();

    for (let i = 0; i < count; i++) {
      const itemName = await itemElements.nth(i).textContent();
      if (itemName !== null) {
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

  async addOrderComment(comment: string): Promise<void> {
    await this.commentTextArea.fill(comment);
  }

  async placeOrder(): Promise<void> {
    await this.placeOrderButton.click();
  }

  async fillPaymentDetails(cardDetails: {
    nameOnCard: string;
    cardNumber: string;
    cvc: string;
    expiryMonth: string;
    expiryYear: string;
  }): Promise<void> {
    await this.nameOnCardInput.fill(cardDetails.nameOnCard);
    await this.cardNumberInput.fill(cardDetails.cardNumber);
    await this.cvcInput.fill(cardDetails.cvc);
    await this.expiryMonthInput.fill(cardDetails.expiryMonth);
    await this.expiryYearInput.fill(cardDetails.expiryYear);
  }

  async payAndConfirmOrder(): Promise<void> {
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
  ): Promise<void> {
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

  async downloadInvoice(): Promise<void> {
    await this.downloadInvoiceButton.click();
  }

  async continueAfterOrder(): Promise<void> {
    await this.continueButton.click();
  }

  async verifyAddressDetails(user: User): Promise<{
    deliveryAddressMatch: boolean;
    billingAddressMatch: boolean;
  }> {
    const deliveryText = await this.getDeliveryAddress();
    const billingText = await this.getBillingAddress();

    const firstname = user.firstname ?? '';
    const lastname = user.lastname ?? '';
    const address1 = user.address1 ?? '';

    const deliveryMatch =
      deliveryText !== null &&
      deliveryText.includes(firstname) &&
      deliveryText.includes(lastname) &&
      deliveryText.includes(address1);

    const billingMatch =
      billingText !== null &&
      billingText.includes(firstname) &&
      billingText.includes(lastname) &&
      billingText.includes(address1);

    return {
      deliveryAddressMatch: deliveryMatch,
      billingAddressMatch: billingMatch,
    };
  }
}

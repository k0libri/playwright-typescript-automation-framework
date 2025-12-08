// Page Object Model for Orders UI
import { Page, Locator } from '@playwright/test';

export class OrdersPage {
  private orderHistorySelector = '.order-history .order';

  constructor(private page: Page) {}
  async goto() { await this.page.goto('/orders'); }
  orderHistory(): Locator { return this.page.locator(this.orderHistorySelector); }
}

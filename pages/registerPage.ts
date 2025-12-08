// Page Object Model for Registration UI
import { Page, Locator } from '@playwright/test';

export class RegisterPage {
  private nameInput = 'input[data-qa="signup-name"]';
  private emailInput = 'input[data-qa="signup-email"]';
  private signupButton = 'button[data-qa="signup-button"]';
  private successMessageSelector = '.success-message';

  constructor(private page: Page) {}
  async goto() { await this.page.goto('/register'); }
  async register(name: string, email: string) {
    await this.page.fill(this.nameInput, name);
    await this.page.fill(this.emailInput, email);
    await this.page.click(this.signupButton);
  }
  successMessage(): Locator { return this.page.locator(this.successMessageSelector); }
}

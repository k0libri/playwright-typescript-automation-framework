// Page Object Model for Login UI
import { Page } from '@playwright/test';

export class LoginPage {
  private usernameInput = 'input[data-qa="login-email"]';
  private passwordInput = 'input[data-qa="login-password"]';
  private submitButton = 'button[data-qa="login-button"]';
  private consentButton = 'button:has-text("Consent")';

  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/login');
  }

  async closeConsentModal() {
    await this.page.click(this.consentButton);
  }

  async login(username: string, password: string) {
    await this.page.fill(this.usernameInput, username);
    await this.page.fill(this.passwordInput, password);
    await this.page.click(this.submitButton);
  }
}

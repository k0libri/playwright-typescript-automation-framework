// Page Object Model for Login UI
import { Page } from '@playwright/test';
import { closeConsentModal } from '../utils/helpers';

export class LoginPage {
  public usernameInput = 'input[data-qa="login-email"]';
  public passwordInput = 'input[data-qa="login-password"]';
  public submitButton = 'button[data-qa="login-button"]';
  public consentButton = 'button:has-text("Consent")';

  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/login');
  }

  async login(username: string, password: string) {
    await this.page.fill(this.usernameInput, username);
    await this.page.fill(this.passwordInput, password);
    await this.page.click(this.submitButton);
  }
}

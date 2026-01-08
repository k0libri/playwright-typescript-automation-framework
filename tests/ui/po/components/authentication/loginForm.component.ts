import type { Locator, Page } from '@playwright/test';
import { BaseComponent } from '../../base/baseComponent.component';
import { Logger } from '../../../../common/utils/logger.util';

/**
 * LoginFormComponent - Handles login form functionality
 * Extends BaseComponent for common component behaviors
 */
export class LoginFormComponent extends BaseComponent {
  readonly loginEmailInput: Locator;
  readonly loginPasswordInput: Locator;
  readonly loginButton: Locator;
  readonly loginErrorMessage: Locator;

  constructor(page: Page, container: Locator) {
    super(page);

    this.loginEmailInput = container.getByRole('textbox', { name: /email address/i });
    this.loginPasswordInput = container.getByPlaceholder('Password');
    this.loginButton = container.getByRole('button', { name: /login/i });
    this.loginErrorMessage = page.getByText('Your email or password is incorrect!');
  }

  /**
   * Perform user login
   * @param email - User's email address
   * @param password - User's password
   * @returns Promise<void>
   */
  async login(email: string, password: string): Promise<void> {
    Logger.info('Filling login credentials');
    await this.loginEmailInput.fill(email);
    await this.loginPasswordInput.fill(password);
    await this.loginButton.click();
  }

  /**
   * Check if login error message is visible
   * @returns Promise<boolean> - True if login error message is displayed, false otherwise
   */
  async isLoginErrorVisible(): Promise<boolean> {
    return await this.isVisible(this.loginErrorMessage);
  }
}

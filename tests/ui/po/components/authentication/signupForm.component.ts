import type { Locator, Page } from '@playwright/test';
import { BaseComponent } from '../../base/baseComponent.component';
import { Logger } from '../../../../common/utils/logger.util';

/**
 * SignupFormComponent - Handles initial signup form functionality
 * Extends BaseComponent for common component behaviors
 */
export class SignupFormComponent extends BaseComponent {
  readonly signupNameInput: Locator;
  readonly signupEmailInput: Locator;
  readonly signupButton: Locator;

  constructor(page: Page, container: Locator) {
    super(page);

    this.signupNameInput = container.getByPlaceholder('Name');
    this.signupEmailInput = container.getByRole('textbox', { name: /email address/i });
    this.signupButton = container.getByRole('button', { name: /signup/i });
  }

  /**
   * Start signup process with name and email
   * @param name - User's full name
   * @param email - User's email address
   * @returns Promise<void>
   */
  async startSignup(name: string, email: string): Promise<void> {
    Logger.info('Filling signup form');
    await this.signupNameInput.fill(name);
    await this.signupEmailInput.fill(email);
    await this.signupButton.click();
  }
}

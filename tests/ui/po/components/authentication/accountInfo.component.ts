import type { Locator, Page } from '@playwright/test';
import { BaseComponent } from '../../base/baseComponent.component';

/**
 * AccountInfoComponent - Handles account setup information
 * Covers title, password, and date of birth
 */
export class AccountInfoComponent extends BaseComponent {
  readonly titleMrRadio: Locator;
  readonly titleMrsRadio: Locator;
  readonly passwordInput: Locator;
  readonly daySelect: Locator;
  readonly monthSelect: Locator;
  readonly yearSelect: Locator;

  constructor(page: Page, container: Locator) {
    super(page);

    this.titleMrRadio = container.getByRole('radio', { name: 'Mr.' });
    this.titleMrsRadio = container.getByRole('radio', { name: 'Mrs.' });
    this.passwordInput = container.locator('#password');
    this.daySelect = container.locator('#days');
    this.monthSelect = container.locator('#months');
    this.yearSelect = container.locator('#years');
  }

  /**
   * Fill account information
   */
  async fillAccountInfo(accountData: {
    title: string;
    password: string;
    birth_date: string;
    birth_month: string;
    birth_year: string;
  }): Promise<void> {
    // Select title
    if (accountData.title === 'Mr') {
      await this.titleMrRadio.check();
    } else {
      await this.titleMrsRadio.check();
    }

    // Fill password
    await this.passwordInput.fill(accountData.password);

    // Select birth date
    await this.daySelect.selectOption(accountData.birth_date);
    await this.monthSelect.selectOption(accountData.birth_month);
    await this.yearSelect.selectOption(accountData.birth_year);
  }
}

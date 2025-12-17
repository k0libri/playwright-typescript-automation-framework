import type { Locator, Page } from '@playwright/test';
import { BaseComponent } from '../../base/baseComponent.component';

/**
 * RegistrationFormComponent - Handles registration form functionality
 * Extends BaseComponent for common component behaviors
 */
export class RegistrationFormComponent extends BaseComponent {
  readonly titleMrRadio: Locator;
  readonly titleMrsRadio: Locator;
  readonly passwordInput: Locator;
  readonly daySelect: Locator;
  readonly monthSelect: Locator;
  readonly yearSelect: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly companyInput: Locator;
  readonly address1Input: Locator;
  readonly address2Input: Locator;
  readonly countrySelect: Locator;
  readonly stateInput: Locator;
  readonly cityInput: Locator;
  readonly zipcodeInput: Locator;
  readonly mobileNumberInput: Locator;
  readonly createAccountButton: Locator;
  readonly accountCreatedMessage: Locator;
  readonly continueButton: Locator;

  constructor(page: Page, container: Locator) {
    super(page);

    // Registration form locators - scoped to container
    this.titleMrRadio = container.getByRole('radio', { name: 'Mr.' });
    this.titleMrsRadio = container.getByRole('radio', { name: 'Mrs.' });
    this.passwordInput = container.locator('#password');
    this.daySelect = container.locator('#days');
    this.monthSelect = container.locator('#months');
    this.yearSelect = container.locator('#years');
    this.firstNameInput = container.locator('#first_name');
    this.lastNameInput = container.locator('#last_name');
    this.companyInput = container.locator('#company');
    this.address1Input = container.locator('#address1');
    this.address2Input = container.locator('#address2');
    this.countrySelect = container.locator('#country');
    this.stateInput = container.locator('#state');
    this.cityInput = container.locator('#city');
    this.zipcodeInput = container.locator('#zipcode');
    this.mobileNumberInput = container.locator('#mobile_number');
    this.createAccountButton = container.getByRole('button', { name: 'Create Account' });
    this.accountCreatedMessage = page.getByText('Account Created!');
    this.continueButton = page.getByRole('link', { name: 'Continue' });
  }

  /**
   * Complete registration form
   */
  async completeRegistration(userData: {
    title: string;
    password: string;
    birth_date: string;
    birth_month: string;
    birth_year: string;
    firstname: string;
    lastname: string;
    company: string;
    address1: string;
    address2?: string;
    country: string;
    state: string;
    city: string;
    zipcode: string;
    mobile_number: string;
  }): Promise<void> {
    // Select title
    if (userData.title === 'Mr') {
      await this.titleMrRadio.check();
    } else {
      await this.titleMrsRadio.check();
    }

    // Fill password
    await this.passwordInput.fill(userData.password);

    // Select birth date
    await this.daySelect.selectOption(userData.birth_date);
    await this.monthSelect.selectOption(userData.birth_month);
    await this.yearSelect.selectOption(userData.birth_year);

    // Fill personal information
    await this.firstNameInput.fill(userData.firstname);
    await this.lastNameInput.fill(userData.lastname);
    await this.companyInput.fill(userData.company);

    // Fill address information
    await this.address1Input.fill(userData.address1);
    if (userData.address2) {
      await this.address2Input.fill(userData.address2);
    }
    await this.countrySelect.selectOption(userData.country);
    await this.stateInput.fill(userData.state);
    await this.cityInput.fill(userData.city);
    await this.zipcodeInput.fill(userData.zipcode);
    await this.mobileNumberInput.fill(userData.mobile_number);

    // Submit form
    await this.createAccountButton.click();
  }

  /**
   * Check if account created message is visible
   */
  async isAccountCreatedMessageVisible(): Promise<boolean> {
    return await this.isVisible(this.accountCreatedMessage);
  }

  /**
   * Click continue button after account creation
   */
  async clickContinue(): Promise<void> {
    await this.continueButton.click();
  }
}

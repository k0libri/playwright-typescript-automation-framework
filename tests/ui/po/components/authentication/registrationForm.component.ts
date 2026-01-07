import type { Locator, Page } from '@playwright/test';
import { BaseComponent } from '../../base/baseComponent.component';
import { AccountInfoComponent } from './accountInfo.component';
import { PersonalInfoComponent } from './personalInfo.component';
import { AddressInfoComponent } from './addressInfo.component';
import { Logger } from '../../../../common/utils/logger.util';

/**
 * RegistrationFormComponent - Orchestrates registration form functionality
 * Composes sub-components for account, personal, and address information
 * Extends BaseComponent for common component behaviors
 */
export class RegistrationFormComponent extends BaseComponent {
  readonly accountInfoComponent: AccountInfoComponent;
  readonly personalInfoComponent: PersonalInfoComponent;
  readonly addressInfoComponent: AddressInfoComponent;
  readonly createAccountButton: Locator;
  readonly accountCreatedMessage: Locator;
  readonly continueButton: Locator;

  constructor(page: Page, container: Locator) {
    super(page);

    this.accountInfoComponent = new AccountInfoComponent(page, container);
    this.personalInfoComponent = new PersonalInfoComponent(page, container);
    this.addressInfoComponent = new AddressInfoComponent(page, container);

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
    Logger.info('Completing registration form');
    await this.accountInfoComponent.fillAccountInfo({
      title: userData.title,
      password: userData.password,
      birth_date: userData.birth_date,
      birth_month: userData.birth_month,
      birth_year: userData.birth_year,
    });

    await this.personalInfoComponent.fillPersonalInfo({
      firstname: userData.firstname,
      lastname: userData.lastname,
      company: userData.company,
      mobile_number: userData.mobile_number,
    });

    await this.addressInfoComponent.fillAddressInfo({
      address1: userData.address1,
      ...(userData.address2 && { address2: userData.address2 }),
      country: userData.country,
      state: userData.state,
      city: userData.city,
      zipcode: userData.zipcode,
    });

    Logger.info('Submitting registration form');
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

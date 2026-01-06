import type { Locator, Page } from '@playwright/test';
import { BaseComponent } from '../../base/baseComponent.component';

/**
 * PersonalInfoComponent - Handles personal information
 * Covers first name, last name, company, and mobile number
 */
export class PersonalInfoComponent extends BaseComponent {
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly companyInput: Locator;
  readonly mobileNumberInput: Locator;

  constructor(page: Page, container: Locator) {
    super(page);

    this.firstNameInput = container.locator('#first_name');
    this.lastNameInput = container.locator('#last_name');
    this.companyInput = container.locator('#company');
    this.mobileNumberInput = container.locator('#mobile_number');
  }

  /**
   * Fill personal information
   */
  async fillPersonalInfo(personalData: {
    firstname: string;
    lastname: string;
    company: string;
    mobile_number: string;
  }): Promise<void> {
    await this.firstNameInput.fill(personalData.firstname);
    await this.lastNameInput.fill(personalData.lastname);
    await this.companyInput.fill(personalData.company);
    await this.mobileNumberInput.fill(personalData.mobile_number);
  }
}

// Page Object Model for Registration UI
import { Page, Locator } from '@playwright/test';
import { closeConsentModal } from '../utils/helpers';

export class RegisterPage {
  public nameInput: string;
  public emailInput: string;
  public signupButton: string;
  public passwordInput: string;
  public successMessageSelector: string;
  public firstNameInput: string;
  public lastNameInput: string;
  public address1Input: string;
  public countrySelect: string;
  public stateInput: string;
  public cityInput: string;
  public zipcodeInput: string;
  public mobileNumberInput: string;
  public createAccountButton: string;

  constructor(private page: Page) {
    this.nameInput = 'input[data-qa="signup-name"]';
    this.emailInput = 'input[data-qa="signup-email"]';
    this.signupButton = 'button[data-qa="signup-button"]';
    this.passwordInput = 'input[data-qa="password"]';
    this.successMessageSelector = '.success-message';
    this.firstNameInput = 'input[data-qa="first_name"]';
    this.lastNameInput = 'input[data-qa="last_name"]';
    this.address1Input = 'input[data-qa="address"]';
    this.countrySelect = 'select[data-qa="country"]';
    this.stateInput = 'input[data-qa="state"]';
    this.cityInput = 'input[data-qa="city"]';
    this.zipcodeInput = 'input[data-qa="zipcode"]';
    this.mobileNumberInput = 'input[data-qa="mobile_number"]';
    this.createAccountButton = 'button[data-qa="create-account"]';
  }
  async goto() {
    await this.page.goto('/login');
    await closeConsentModal(this.page);
  }
  async register(name: string, email: string, password: string) {
    await this.page.locator(this.nameInput).waitFor({ state: 'visible' });
    await this.page.fill(this.nameInput, name);
    await this.page.fill(this.emailInput, email);
    // If password field is present on the same page, fill it as mandatory
    const passwordField = this.page.locator(this.passwordInput);
    if (await passwordField.count()) {
      await passwordField.fill(password);
    }
    await this.page.click(this.signupButton);
    // After clicking signup, complete mandatory fields on the signup page
    await this.completeMandatorySignup(password);
  }
  private async completeMandatorySignup(password: string) {
    // Wait for extended signup form to appear (password field present)
    await this.page.locator(this.passwordInput).waitFor({ state: 'visible' });
    await this.page.fill(this.passwordInput, password);
    // Fill mandatory personal and address details
    await this.page.fill(this.firstNameInput, 'TestFirst');
    await this.page.fill(this.lastNameInput, 'TestLast');
    await this.page.fill(this.address1Input, '123 Test Street');
    // Country is a select; choose a valid option
    const country = this.page.locator(this.countrySelect);
    if (await country.count()) {
      await country.selectOption({ label: 'United States' }).catch(async () => {
        // fallback to first option
        const options = await country.locator('option').allTextContents();
        if (options.length > 0) await country.selectOption({ label: options[0] });
      });
    }
    await this.page.fill(this.stateInput, 'TestState');
    await this.page.fill(this.cityInput, 'TestCity');
    await this.page.fill(this.zipcodeInput, '12345');
    await this.page.fill(this.mobileNumberInput, '1234567890');
    // Submit account creation if button exists
    const createBtn = this.page.locator(this.createAccountButton);
    if (await createBtn.count()) {
      await createBtn.click();
    }
  }
  successMessage(): Locator { return this.page.locator(this.successMessageSelector); }
}

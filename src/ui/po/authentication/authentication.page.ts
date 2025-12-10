import type { Locator, Page } from '@playwright/test';
import { BasePage } from '../base/basePage.page';

/**
 * AuthenticationPage - Handles login and signup functionality
 * Extends BasePage for common page behaviors
 */
export class AuthenticationPage extends BasePage {
  // Login form elements
  readonly loginEmailInput: Locator;
  readonly loginPasswordInput: Locator;
  readonly loginButton: Locator;

  // Signup form elements
  readonly signupNameInput: Locator;
  readonly signupEmailInput: Locator;
  readonly signupButton: Locator;

  // Registration form elements (after signup)
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

  // Success/error messages
  readonly accountCreatedMessage: Locator;
  readonly loginErrorMessage: Locator;
  readonly loggedInUserText: Locator;
  readonly continueButton: Locator;

  constructor(page: Page) {
    super(page);

    // Login form locators - using position based approach
    this.loginEmailInput = page.locator('input[placeholder="Email Address"]').first();
    this.loginPasswordInput = page.locator('input[placeholder="Password"]');
    this.loginButton = page.locator('button:has-text("Login")');

    // Signup form locators - using position based approach
    this.signupNameInput = page.locator('input[placeholder="Name"]');
    this.signupEmailInput = page.locator('input[placeholder="Email Address"]').last();
    this.signupButton = page.locator('button:has-text("Signup")');

    // Registration form locators
    this.titleMrRadio = page.getByRole('radio', { name: 'Mr.' });
    this.titleMrsRadio = page.getByRole('radio', { name: 'Mrs.' });
    this.passwordInput = page.locator('#password');
    this.daySelect = page.locator('#days');
    this.monthSelect = page.locator('#months');
    this.yearSelect = page.locator('#years');
    this.firstNameInput = page.locator('#first_name');
    this.lastNameInput = page.locator('#last_name');
    this.companyInput = page.locator('#company');
    this.address1Input = page.locator('#address1');
    this.address2Input = page.locator('#address2');
    this.countrySelect = page.locator('#country');
    this.stateInput = page.locator('#state');
    this.cityInput = page.locator('#city');
    this.zipcodeInput = page.locator('#zipcode');
    this.mobileNumberInput = page.locator('#mobile_number');
    this.createAccountButton = page.getByRole('button', { name: 'Create Account' });

    // Success/error messages
    this.accountCreatedMessage = page.getByText('Account Created!');
    this.loginErrorMessage = page.getByText('Your email or password is incorrect!');
    this.loggedInUserText = page.getByText('Logged in as');
    this.continueButton = page.getByRole('link', { name: 'Continue' });
  }

  /**
   * Navigate to authentication page
   */
  async navigateToAuthenticationPage(): Promise<void> {
    await this.navigateTo('/login');
  }

  /**
   * Perform user login
   */
  async login(email: string, password: string): Promise<void> {
    await this.handleCookieConsentIfPresent();
    await this.loginEmailInput.fill(email);
    await this.loginPasswordInput.fill(password);
    await this.handleCookieConsentIfPresent(); // Handle again before click
    await this.loginButton.click();
  }

  /**
   * Start signup process with name and email
   */
  async startSignup(name: string, email: string): Promise<void> {
    await this.handleCookieConsentIfPresent();
    await this.signupNameInput.fill(name);
    await this.signupEmailInput.fill(email);
    await this.handleCookieConsentIfPresent(); // Handle again before click
    await this.signupButton.click();
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
   * Check if user is logged in
   */
  async isUserLoggedIn(): Promise<boolean> {
    try {
      await this.loggedInUserText.waitFor({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get logged in username
   */
  async getLoggedInUsername(): Promise<string> {
    const fullText = await this.loggedInUserText.textContent();
    return fullText?.replace('Logged in as ', '') ?? '';
  }
}

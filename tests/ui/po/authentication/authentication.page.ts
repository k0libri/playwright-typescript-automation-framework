import type { Locator, Page } from '@playwright/test';
import { BasePage } from '../base/basePage.page';
import { LoginFormComponent } from '../components/authentication/loginForm.component';
import { SignupFormComponent } from '../components/authentication/signupForm.component';
import { RegistrationFormComponent } from '../components/authentication/registrationForm.component';
import { Logger } from '../../../common/utils/logger.util';

/**
 * AuthenticationPage - Handles login and signup functionality
 * Extends BasePage for common page behaviors
 */
export class AuthenticationPage extends BasePage {
  protected readonly pageUrl = '/login';

  readonly loginForm: LoginFormComponent;
  readonly signupForm: SignupFormComponent;
  readonly registrationForm: RegistrationFormComponent;

  readonly loggedInUserText: Locator;

  constructor(page: Page) {
    super(page);

    const loginFormContainer = page
      .locator('form')
      .filter({ has: page.locator('input[data-qa="login-email"]') });
    const signupFormContainer = page
      .locator('form')
      .filter({ has: page.locator('input[data-qa="signup-name"]') });
    const registrationFormContainer = page
      .locator('form')
      .filter({ has: page.locator('input[name="password"]') });

    this.loginForm = new LoginFormComponent(page, loginFormContainer);
    this.signupForm = new SignupFormComponent(page, signupFormContainer);
    this.registrationForm = new RegistrationFormComponent(page, registrationFormContainer);

    this.loggedInUserText = page.getByText('Logged in as');
  }

  /**
   * Navigate to authentication page
   */
  async navigateToAuthenticationPage(): Promise<void> {
    Logger.info('Navigating to authentication page');
    await this.navigate();
  }

  /**
   * Perform user login
   */
  async login(email: string, password: string): Promise<void> {
    Logger.info(`Logging in user: ${email}`);
    await this.loginForm.login(email, password);
  }

  /**
   * Start signup process with name and email
   */
  async startSignup(name: string, email: string): Promise<void> {
    Logger.info(`Starting signup for: ${email}`);
    await this.signupForm.startSignup(name, email);
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
    await this.registrationForm.completeRegistration(userData);
  }

  /**
   * Get logged in username
   */
  async getLoggedInUsername(): Promise<string> {
    const fullText = await this.loggedInUserText.textContent();
    return fullText?.replace('Logged in as ', '') ?? '';
  }

  /**
   * Attempt to create user and logout, handling case where user might already exist
   * Returns true if user was created, false if user already exists
   */
  async tryCreateUserAndLogout(
    userData: {
      name: string;
      email: string;
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
    },
    page: Page,
  ): Promise<boolean> {
    try {
      await this.registrationForm.accountInfoComponent.passwordInput.waitFor({ timeout: 5000 });
      await this.completeRegistration(userData);
      await this.registrationForm.continueButton.click();
      await this.loggedInUserText.waitFor({ state: 'visible' });
      await page.getByRole('link', { name: ' Logout' }).click();
      await page.waitForLoadState('domcontentloaded');
      return true;
    } catch {
      Logger.info('Email might already exist, continuing with duplicate test');
      return false;
    }
  }

  /**
   * Verify duplicate email error is displayed or user stays on login page
   */
  async verifyDuplicateEmailHandling(page: Page): Promise<void> {
    const duplicateError = page.getByText('Email Address already exist');

    try {
      await duplicateError.waitFor({ state: 'visible', timeout: 5000 });
      Logger.info('Duplicate email error message displayed');
    } catch {
      const currentUrl = page.url();
      if (!currentUrl.includes('/login')) {
        throw new Error('Expected to stay on login page for duplicate email');
      }
      Logger.info('Correctly stayed on login page for duplicate email');
    }
  }
}

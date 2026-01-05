import type { Locator, Page } from '@playwright/test';
import { BasePage } from '../base/basePage.page';
import { LoginFormComponent } from '../components/authentication/loginForm.component';
import { SignupFormComponent } from '../components/authentication/signupForm.component';
import { RegistrationFormComponent } from '../components/authentication/registrationForm.component';

/**
 * AuthenticationPage - Handles login and signup functionality
 * Extends BasePage for common page behaviors
 */
export class AuthenticationPage extends BasePage {
  readonly loginForm: LoginFormComponent;
  readonly signupForm: SignupFormComponent;
  readonly registrationForm: RegistrationFormComponent;

  // Exposed locators for backward compatibility with tests
  readonly passwordInput: Locator;
  readonly loginErrorMessage: Locator;
  readonly signupButton: Locator;
  readonly signupNameInput: Locator;
  readonly signupEmailInput: Locator;
  readonly continueButton: Locator;
  readonly accountCreatedMessage: Locator;

  // Success/error messages
  readonly loggedInUserText: Locator;

  constructor(page: Page) {
    super(page);

    // Find form containers - using more flexible selectors that work with the actual page structure
    const loginFormContainer = page
      .locator('form')
      .filter({ has: page.locator('input[data-qa="login-email"]') });
    const signupFormContainer = page
      .locator('form')
      .filter({ has: page.locator('input[data-qa="signup-name"]') });
    const registrationFormContainer = page
      .locator('form')
      .filter({ has: page.locator('input[name="password"]') });

    // Initialize components with their containers
    this.loginForm = new LoginFormComponent(page, loginFormContainer);
    this.signupForm = new SignupFormComponent(page, signupFormContainer);
    this.registrationForm = new RegistrationFormComponent(page, registrationFormContainer);

    // Expose component locators for backward compatibility
    this.passwordInput = this.registrationForm.passwordInput;
    this.loginErrorMessage = this.loginForm.loginErrorMessage;
    this.signupButton = this.signupForm.signupButton;
    this.signupNameInput = this.signupForm.signupNameInput;
    this.signupEmailInput = this.signupForm.signupEmailInput;
    this.continueButton = this.registrationForm.continueButton;
    this.accountCreatedMessage = this.registrationForm.accountCreatedMessage;

    // Page-level locators
    this.loggedInUserText = page.getByText('Logged in as');
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
    await this.loginForm.login(email, password);
  }

  /**
   * Start signup process with name and email
   */
  async startSignup(name: string, email: string): Promise<void> {
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
   * Check if user is logged in
   */
  async isUserLoggedIn(): Promise<boolean> {
    try {
      await this.loggedInUserText.waitFor();
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

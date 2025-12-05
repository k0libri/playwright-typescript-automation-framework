import { Page, Locator } from '@playwright/test';
import { User } from '../utils/UserFactory';

export class LoginPage {
  readonly page: Page;
  readonly loginSection: Locator;
  readonly loginEmailInput: Locator;
  readonly loginPasswordInput: Locator;
  readonly loginButton: Locator;
  readonly signupSection: Locator;
  readonly signupNameInput: Locator;
  readonly signupEmailInput: Locator;
  readonly signupButton: Locator;
  readonly loginErrorMessage: Locator;
  readonly signupErrorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.loginSection = page.locator('.login-form');
    this.loginEmailInput = page.locator('[data-qa="login-email"]');
    this.loginPasswordInput = page.locator('[data-qa="login-password"]');
    this.loginButton = page.locator('[data-qa="login-button"]');
    this.signupSection = page.locator('.signup-form');
    this.signupNameInput = page.locator('[data-qa="signup-name"]');
    this.signupEmailInput = page.locator('[data-qa="signup-email"]');
    this.signupButton = page.locator('[data-qa="signup-button"]');
    this.loginErrorMessage = page.locator('text=Your email or password is incorrect!');
    this.signupErrorMessage = page.locator('text=Email Address already exist!');
  }

  async goto() {
    await this.page.goto('/login');
  }

  async login(email: string, password: string) {
    await this.loginEmailInput.fill(email);
    await this.loginPasswordInput.fill(password);
    await this.loginButton.click();
  }

  async signup(name: string, email: string) {
    await this.signupNameInput.fill(name);
    await this.signupEmailInput.fill(email);
    await this.signupButton.click();
  }

  async fillSignupForm(user: User) {
    // This assumes we're on the signup form page after clicking signup
    if (user.title) {
      const genderInput = this.page.locator(`#id_gender${user.title === 'Mr' ? '1' : '2'}`);
      // Wait for the element to be available
      await genderInput.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
      await genderInput.check({ force: true });
    }

    if (user.password) {
      await this.page.locator('[data-qa="password"]').fill(user.password);
    }

    if (user.birth_date) {
      await this.page.locator('[data-qa="days"]').selectOption(user.birth_date);
    }

    if (user.birth_month) {
      await this.page.locator('[data-qa="months"]').selectOption(user.birth_month);
    }

    if (user.birth_year) {
      await this.page.locator('[data-qa="years"]').selectOption(user.birth_year);
    }

    // Newsletter and special offers checkboxes
    await this.page.locator('#newsletter').check();
    await this.page.locator('#optin').check();

    // Address information
    if (user.firstname) {
      await this.page.locator('[data-qa="first_name"]').fill(user.firstname);
    }

    if (user.lastname) {
      await this.page.locator('[data-qa="last_name"]').fill(user.lastname);
    }

    if (user.company) {
      await this.page.locator('[data-qa="company"]').fill(user.company);
    }

    if (user.address1) {
      await this.page.locator('[data-qa="address"]').fill(user.address1);
    }

    if (user.address2) {
      await this.page.locator('[data-qa="address2"]').fill(user.address2);
    }

    if (user.country) {
      await this.page.locator('[data-qa="country"]').selectOption(user.country);
    }

    if (user.state) {
      await this.page.locator('[data-qa="state"]').fill(user.state);
    }

    if (user.city) {
      await this.page.locator('[data-qa="city"]').fill(user.city);
    }

    if (user.zipcode) {
      await this.page.locator('[data-qa="zipcode"]').fill(user.zipcode);
    }

    if (user.mobile_number) {
      await this.page.locator('[data-qa="mobile_number"]').fill(user.mobile_number);
    }

    // Submit the form
    await this.page.locator('[data-qa="create-account"]').click();
  }

  async isLoginErrorVisible(): Promise<boolean> {
    return await this.loginErrorMessage.isVisible();
  }

  async isSignupErrorVisible(): Promise<boolean> {
    return await this.signupErrorMessage.isVisible();
  }

  async getLoginErrorText(): Promise<string | null> {
    if (await this.isLoginErrorVisible()) {
      return await this.loginErrorMessage.textContent();
    }
    return null;
  }

  async getSignupErrorText(): Promise<string | null> {
    if (await this.isSignupErrorVisible()) {
      return await this.signupErrorMessage.textContent();
    }
    return null;
  }
}

import type { Locator, Page } from '@playwright/test';
import { BaseComponent } from '../../base/baseComponent.component';
import { CookieConsentComponent } from '../cookieConsent.component';

/**
 * NavbarComponent - Handles navigation bar functionality
 * Common component used across all pages
 */
export class NavbarComponent extends BaseComponent {
  readonly homeLink: Locator;
  readonly productsLink: Locator;
  readonly cartLink: Locator;
  readonly signupLoginLink: Locator;
  readonly testCasesLink: Locator;
  readonly apiTestingLink: Locator;
  readonly videoTutorialsLink: Locator;
  readonly contactUsLink: Locator;
  readonly logoutLink: Locator;
  private readonly cookieConsent: CookieConsentComponent;

  constructor(page: Page) {
    super(page);
    this.cookieConsent = new CookieConsentComponent(page);

    this.homeLink = page.getByRole('link', { name: ' Home' });
    this.productsLink = page.getByRole('link', { name: ' Products' });
    this.cartLink = page.getByRole('link', { name: ' Cart' });
    this.signupLoginLink = page.getByRole('link', { name: ' Signup / Login' });
    this.testCasesLink = page.getByRole('link', { name: ' Test Cases' });
    this.apiTestingLink = page.getByRole('link', { name: ' API Testing' });
    this.videoTutorialsLink = page.getByRole('link', { name: ' Video Tutorials' });
    this.contactUsLink = page.getByRole('link', { name: ' Contact us' });
    this.logoutLink = page.getByRole('link', { name: ' Logout' });
  }

  /**
   * Navigate to home page
   */
  async goToHome(): Promise<void> {
    await this.cookieConsent.handleCookieConsent();
    await this.clickElement(this.homeLink);
  }

  /**
   * Navigate to products page
   */
  async goToProducts(): Promise<void> {
    await this.cookieConsent.handleCookieConsent();
    await this.clickElement(this.productsLink);
  }

  /**
   * Navigate to cart page
   */
  async goToCart(): Promise<void> {
    await this.cookieConsent.handleCookieConsent();
    await this.clickElement(this.cartLink);
  }

  /**
   * Navigate to signup/login page
   */
  async goToSignupLogin(): Promise<void> {
    await this.cookieConsent.handleCookieConsent();
    await this.clickElement(this.signupLoginLink);
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    await this.cookieConsent.handleCookieConsent();
    await this.clickElement(this.logoutLink);
  }

  /**
   * Check if user is logged in (logout link is visible)
   */
  async isUserLoggedIn(): Promise<boolean> {
    return await this.isVisible(this.logoutLink);
  }
}

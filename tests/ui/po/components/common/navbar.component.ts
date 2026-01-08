import type { Locator, Page } from '@playwright/test';
import { BaseComponent } from '../../base/baseComponent.component';
import { Logger } from '../../../../common/utils/logger.util';

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

  constructor(page: Page) {
    super(page);

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
   * @returns Promise<void>
   */
  async goToHome(): Promise<void> {
    Logger.info('Navigating to home via navbar');
    await this.clickElement(this.homeLink);
  }

  /**
   * Navigate to products page
   * @returns Promise<void>
   */
  async goToProducts(): Promise<void> {
    Logger.info('Navigating to products via navbar');
    await this.clickElement(this.productsLink);
  }

  /**
   * Navigate to cart page
   * @returns Promise<void>
   */
  async goToCart(): Promise<void> {
    Logger.info('Navigating to cart via navbar');
    await this.clickElement(this.cartLink);
  }

  /**
   * Navigate to signup/login page
   * @returns Promise<void>
   */
  async goToSignupLogin(): Promise<void> {
    Logger.info('Navigating to signup/login via navbar');
    await this.clickElement(this.signupLoginLink);
  }

  /**
   * Logout user
   * @returns Promise<void>
   */
  async logout(): Promise<void> {
    Logger.info('Logging out user');
    await this.clickElement(this.logoutLink);
  }

  /**
   * Check if user is logged in (logout link is visible)
   * @returns Promise<boolean> - True if logout link is visible (user logged in), false otherwise
   */
  async isUserLoggedIn(): Promise<boolean> {
    return await this.isVisible(this.logoutLink);
  }
}

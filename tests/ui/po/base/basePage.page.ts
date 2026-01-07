import type { Locator, Page } from '@playwright/test';
import { NavbarComponent } from '../components/common/navbar.component';

/**
 * BasePage - Shared page behaviors and navigation helpers
 * Encapsulates common page functionality across the application
 */
export abstract class BasePage {
  protected readonly page: Page;
  readonly navbar: NavbarComponent;

  constructor(page: Page) {
    this.page = page;
    this.navbar = new NavbarComponent(page);
  }

  /**
   * Navigate to the page's default URL
   */
  public async navigate(): Promise<void> {
    const url = (this as any).pageUrl;
    if (!url) {
      throw new Error(`pageUrl is not defined for ${this.constructor.name}`);
    }
    await this.navigateTo(url);
  }

  /**
   * Navigate to home page
   */
  public async navigateToHome(): Promise<void> {
    await this.navigateTo('/');
  }

  /**
   * Navigate to a specific URL
   */
  public async navigateTo(url: string): Promise<void> {
    await this.page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await this.waitForPageReady();
  }

  /**
   * Wait for page to be ready for interaction
   */
  public async waitForPageReady(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Get current page URL
   */
  public getCurrentUrl(): string {
    return this.page.url();
  }

  /**
   * Get page title
   */
  public async getPageTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Take screenshot for debugging
   */
  public async captureScreenshot(path: string): Promise<void> {
    await this.page.screenshot({ path, fullPage: true });
  }

  /**
   * Scroll to element
   */
  protected async scrollToElement(locator: Locator): Promise<void> {
    await locator.scrollIntoViewIfNeeded();
  }

  /**
   * Wait for element to be visible
   */
  protected async waitForVisible(locator: Locator, timeout = 30000): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout });
  }

  /**
   * Check if element is visible
   */
  protected async isVisible(locator: Locator): Promise<boolean> {
    try {
      return await locator.isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Get text content from element
   */
  protected async getTextContent(locator: Locator): Promise<string> {
    return (await locator.textContent()) ?? '';
  }

  /**
   * Click element with error handling
   */
  protected async clickElement(locator: Locator): Promise<void> {
    await this.waitForVisible(locator);
    await locator.click();
  }

  /**
   * Type text into element
   */
  protected async typeIntoElement(locator: Locator, text: string): Promise<void> {
    await this.waitForVisible(locator);
    await locator.fill(text);
  }
}

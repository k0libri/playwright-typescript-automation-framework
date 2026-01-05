import type { Locator, Page } from '@playwright/test';
import { CookieConsentComponent } from '../components/cookieConsent.component';

/**
 * BasePage - Shared page behaviors and navigation helpers
 * Encapsulates common page functionality across the application
 */
export abstract class BasePage {
  protected readonly page: Page;
  protected readonly cookieConsent: CookieConsentComponent;

  constructor(page: Page) {
    this.page = page;
    this.cookieConsent = new CookieConsentComponent(page);
  }

  /**
   * Navigate to a specific URL
   */
  public async navigateTo(url: string): Promise<void> {
    try {
      await this.page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
      await this.waitForPageReady();
      await this.handleCookieConsentIfPresent();
    } catch (error) {
      console.error(`Navigation to ${url} failed:`, error);
      // Retry once after a short delay using Node.js timeout (not page.waitForTimeout)
      console.log('Retrying navigation after 3 seconds...');
      await new Promise((resolve) => setTimeout(resolve, 3000));
      try {
        await this.page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
        await this.waitForPageReady();
        await this.handleCookieConsentIfPresent();
      } catch (retryError) {
        console.error(`Retry navigation to ${url} also failed:`, retryError);
        throw retryError;
      }
    }
  }

  /**
   * Wait for page to be ready for interaction
   */
  public async waitForPageReady(): Promise<void> {
    try {
      await this.page.waitForLoadState('domcontentloaded');
      // Use a shorter timeout for networkidle to avoid hanging
      await this.page.waitForLoadState('networkidle', { timeout: 5000 });
    } catch {
      // If networkidle times out, just ensure dom is loaded
      console.log('Network idle timeout, continuing with DOM ready state');
      await this.page.waitForLoadState('domcontentloaded');
    }
  }

  /**
   * Handle cookie consent if present
   */
  public async handleCookieConsentIfPresent(): Promise<void> {
    await this.cookieConsent.handleCookieConsent();
    await this.cookieConsent.waitForConsentDialogToBeDismissed();
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

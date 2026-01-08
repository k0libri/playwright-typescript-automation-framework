import type { Locator, Page } from '@playwright/test';

/**
 * BaseComponent - Shared component behaviors and utilities
 * Base class for all reusable UI components
 */
export abstract class BaseComponent {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Check if element is visible
   * @param locator - The Playwright locator to check
   * @returns Promise<boolean> - True if element is visible within 5s timeout, false otherwise
   */
  protected async isVisible(locator: Locator): Promise<boolean> {
    try {
      await locator.waitFor({ state: 'visible', timeout: 5000 });
      return await locator.isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Check if element is hidden
   * @param locator - The Playwright locator to check
   * @returns Promise<boolean> - True if element is hidden within 5s timeout, false otherwise
   */
  protected async isHidden(locator: Locator): Promise<boolean> {
    try {
      await locator.waitFor({ state: 'hidden', timeout: 5000 });
      return await locator.isHidden();
    } catch {
      return true;
    }
  }

  /**
   * Wait for element to be present
   * @param locator - The Playwright locator to wait for
   * @param timeout - Maximum wait time in milliseconds (default: 10000)
   * @returns Promise<void>
   */
  protected async waitForElement(locator: Locator, timeout = 10000): Promise<void> {
    try {
      await locator.waitFor({ timeout });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes('Target page, context or browser has been closed')
      ) {
        throw new Error('Browser context was closed unexpectedly');
      }
      throw error;
    }
  }

  /**
   * Get element text content
   * @param locator - The Playwright locator to extract text from
   * @returns Promise<string> - The element's text content
   */
  protected async getTextContent(locator: Locator): Promise<string> {
    await this.waitForElement(locator);
    return (await locator.textContent()) ?? '';
  }

  /**
   * Click element with wait
   * @param locator - The Playwright locator to click
   * @returns Promise<void>
   */
  protected async clickElement(locator: Locator): Promise<void> {
    await this.waitForElement(locator);
    await locator.click();
  }

  /**
   * Fill input field
   * @param locator - The Playwright locator of the input field
   * @param text - The text to fill into the input
   * @returns Promise<void>
   */
  protected async fillInput(locator: Locator, text: string): Promise<void> {
    await this.waitForElement(locator);
    await locator.fill(text);
  }
}

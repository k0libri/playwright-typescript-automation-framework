import { expect, Page } from '@playwright/test';

/**
 * Softly asserts that an item is visible in the cart within a timeout.
 * Returns true if visible, false otherwise. Does not throw.
 * @param page Playwright Page object
 * @param selector Selector for the cart item
 * @param timeout Timeout in ms (default: 5000)
 */
export async function softAssertItemVisible(page: Page, selector: string, timeout = 5000): Promise<boolean> {
  try {
    await expect(page.locator(selector)).toBeVisible({ timeout });
    return true;
  } catch {
    return false;
  }
}

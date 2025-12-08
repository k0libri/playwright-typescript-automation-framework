import { Page, expect } from '@playwright/test';

/**
 * Asserts that a cart item becomes visible using Playwright's expect.poll.
 * Throws if not visible within timeout.
 * @param page Playwright Page object
 * @param timeoutMs Total timeout in ms (default: 5000)
 */
export async function pollForCartItemVisible(
  page: Page,
  timeoutMs = 5000
): Promise<void> {
  // Hardcoded selector for cart item (should match CartPage)
  const cartItemSelector = 'td.cart_product';
  await expect.poll(async () => {
    await page.goto('/view_cart');
    return await page.locator(cartItemSelector).isVisible();
  }, { timeout: timeoutMs }).toBe(true);
}

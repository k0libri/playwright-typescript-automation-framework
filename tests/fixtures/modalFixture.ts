/**
 * Modal Fixture - Automatic Cookie Consent Modal Handling
 * Provides automatic modal handling for all tests via Playwright fixtures
 * Automatically closes modals on page load and during test execution
 */

import { test as base, Page } from '@playwright/test';
import { ModalHandler } from '../../utils/ModalHandler';

/**
 * Extended fixture with automatic modal handling
 */
export type ModalFixtures = {
  pageWithModalHandling: Page;
  modalHandler: ModalHandler;
};

/**
 * Create test fixture with automatic modal handling
 */
export const test = base.extend<ModalFixtures>({
  /**
   * Page with automatic modal interception and handling
   */
  pageWithModalHandling: async ({ page }, use) => {
    // Create modal handler instance
    const modalHandler = new ModalHandler(page);

    // Listen for new pages (popups, etc.)
    page.on('popup', async (popup) => {
      const popupModalHandler = new ModalHandler(popup);
      await popupModalHandler.handleModalIfPresent();
    });

    // Handle modals on navigation
    page.on('load', async () => {
      await new Promise((r) => setTimeout(r, 500)); // Wait for modal to appear
      await modalHandler.handleModalIfPresent();
    });

    // Use the page with automatic modal handling
    await use(page);
  },

  /**
   * Provide modal handler instance for manual control if needed
   */
  modalHandler: async ({ page }, use) => {
    const modalHandler = new ModalHandler(page);
    await use(modalHandler);
  },
});

/**
 * Convenience export for expect
 */
export { expect } from '@playwright/test';

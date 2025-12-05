/**
 * Modal Fixture - Aggressive Cookie Consent Modal Handling
 * Provides automatic modal handling for all tests via Playwright fixtures
 * Automatically closes modals on page load, navigation, and periodically during test
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
 * Create test fixture with aggressive modal handling
 */
export const test = base.extend<ModalFixtures>({
  /**
   * Page with automatic modal interception and handling
   */
  pageWithModalHandling: async ({ page }, use) => {
    // Create modal handler instance
    const modalHandler = new ModalHandler(page);

    // Handle modals on page load
    page.on('load', async () => {
      await new Promise((r) => setTimeout(r, 300)); // Wait for modal to appear
      await modalHandler.handleModalIfPresent();
      await new Promise((r) => setTimeout(r, 300)); // Verify it's closed
      await modalHandler.handleModalIfPresent();
    });

    // Handle modals on every frame navigation
    page.on('framenavigated', async () => {
      await new Promise((r) => setTimeout(r, 200));
      await modalHandler.handleModalIfPresent();
    });

    // Listen for new pages (popups, etc.)
    page.on('popup', async (popup) => {
      const popupModalHandler = new ModalHandler(popup);
      await new Promise((r) => setTimeout(r, 300));
      await popupModalHandler.handleModalIfPresent();
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

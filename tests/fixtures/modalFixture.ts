/**
 * Modal Fixture - Simple Cookie Consent Modal Handling
 * Provides automatic modal handling for all tests via Playwright fixtures
 * Closes modals on page load to prevent blocking interactions
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
 * Create test fixture with simple modal handling
 */
export const test = base.extend<ModalFixtures>({
  /**
   * Page with automatic modal handling on page load only
   * This prevents the framenavigated listener from firing constantly
   */
  pageWithModalHandling: async ({ page }, use) => {
    // Track if we're already handling a modal to prevent double-handling
    let isHandlingModal = false;

    // Handle modals on page load - simple, single check
    page.on('load', async () => {
      await new Promise((r) => setTimeout(r, 300)); // Wait for modal to appear

      if (!isHandlingModal) {
        isHandlingModal = true;
        try {
          const modalHandler = new ModalHandler(page);
          await modalHandler.handleModalIfPresent();
        } catch (error) {
          console.log('Modal handling on page load failed (expected if no modal):', error);
        } finally {
          isHandlingModal = false;
        }
      }
    });

    // Listen for new pages (popups, etc.)
    page.on('popup', async (popup) => {
      try {
        const popupModalHandler = new ModalHandler(popup);
        await new Promise((r) => setTimeout(r, 300));
        await popupModalHandler.handleModalIfPresent();
      } catch (error) {
        console.log('Popup modal handling failed:', error);
      }
    });

    // Use the page with automatic modal handling
    await use(page);

    // Cleanup listeners
    page.removeAllListeners('load');
    page.removeAllListeners('popup');
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

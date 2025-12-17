import { Locator, Page } from '@playwright/test';
import { BaseComponent } from '../base/baseComponent.component';

/**
 * Cookie Consent Component
 * Handles the cookie consent popup that appears on the website
 */
export class CookieConsentComponent extends BaseComponent {
  readonly acceptAllButton: Locator;
  readonly consentDialog: Locator;

  constructor(page: Page) {
    super(page);
    this.consentDialog = page.locator('.fc-consent-root');
    this.acceptAllButton = page.locator(
      'button[aria-label="Consent"], .fc-button[data-role="all"], .fc-cta-consent',
    );
  }

  /**
   * Handle cookie consent dialog if present
   * @param timeout - Maximum time to wait for consent dialog
   */
  async handleCookieConsent(timeout = 5000): Promise<void> {
    try {
      // Wait for the consent dialog to appear
      await this.consentDialog.waitFor({ timeout });

      // Try different accept button selectors
      const acceptButtons = [
        this.page.getByRole('button', { name: /accept|agree|consent/i }),
        this.page.locator('button[data-role="all"]'),
        this.page.locator('.fc-cta-consent'),
        this.page.locator('.fc-button-label:has-text("OK")'),
        this.page.locator('button:has-text("Accept")'),
      ];

      for (const button of acceptButtons) {
        try {
          if (await button.isVisible()) {
            await button.click();
            console.log('Cookie consent accepted successfully');
            return;
          }
        } catch {
          // Continue to try next button
        }
      }

      // If no button works, try to dismiss the dialog by clicking outside
      await this.page.keyboard.press('Escape');
      console.log('Cookie consent dismissed with Escape key');
    } catch {
      // Cookie consent dialog might not be present, which is fine
      console.log('No cookie consent dialog detected or already handled');
    }
  }

  /**
   * Check if cookie consent dialog is visible
   */
  async isConsentDialogVisible(): Promise<boolean> {
    try {
      return await this.consentDialog.isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Wait for consent dialog to be dismissed
   */
  async waitForConsentDialogToBeDismissed(timeout = 10000): Promise<void> {
    try {
      await this.consentDialog.waitFor({ state: 'hidden', timeout });
    } catch {
      // Dialog might already be gone or never appeared
    }
  }
}

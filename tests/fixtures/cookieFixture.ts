import { Page } from '@playwright/test';

export async function handleCookiePopup(page: Page): Promise<void> {
  try {
    // Wait for the consent dialog to appear and handle it
    const consentButton = page.locator('p.fc-button-label:has-text("Consent")');

    // Wait for the button to be present
    await consentButton.waitFor({ state: 'attached', timeout: 5000 }).catch(() => {});

    // Check if it's visible and click it
    const isVisible = await consentButton.isVisible().catch(() => false);

    if (isVisible) {
      // Use force click to bypass the overlay
      await consentButton.click({ force: true });
      // Wait for the dialog to disappear
      await page
        .locator('.fc-consent-root')
        .waitFor({ state: 'detached', timeout: 3000 })
        .catch(() => {});
    }
  } catch {
    console.log('Cookie popup not found or already dismissed');
  }
}

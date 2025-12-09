import type { Page } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';

export async function closeConsentModal(page: Page): Promise<void> {
  const loginPage = new LoginPage(page);;
  const consentBtn = await page.$(loginPage.consentButton);
  if (consentBtn) {
    await consentBtn.click();
  }
}

export function buildBookingData(overrides: Partial<{
  firstname: string;
  lastname: string;
  totalprice: number;
  depositpaid: boolean;
  bookingdates: { checkin: string; checkout: string };
  additionalneeds?: string;
}> = {}) {
  return {
    firstname: 'John',
    lastname: 'Doe',
    totalprice: 100,
    depositpaid: true,
    bookingdates: {
      checkin: '2025-01-01',
      checkout: '2025-01-05',
    },
    additionalneeds: 'Breakfast',
    ...overrides,
  };
}

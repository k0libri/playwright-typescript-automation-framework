import { test as base } from '@playwright/test';
import { handleCookiePopup } from './cookieFixture';

export const test = base.extend<{}>({
  page: async ({ page }, use) => {
    // Intercept the first navigation to handle cookie popup
    const originalGoto = page.goto.bind(page);
    page.goto = async (...args) => {
      const result = await originalGoto(...args);
      await handleCookiePopup(page);
      return result;
    };

    await use(page);
  },
});

export { expect } from '@playwright/test';

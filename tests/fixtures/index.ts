import { test as base } from '@playwright/test';
import { handleCookiePopup } from '../fixtureHelpers/cookieHelper';
import { HomePage } from '../../pages/HomePage';
import { LoginPage } from '../../pages/LoginPage';
import { CartPage } from '../../pages/CartPage';
import { ProductPage } from '../../pages/ProductPage';
import { CheckoutPage } from '../../pages/CheckoutPage';

// Define fixture types
type PageFixtures = {
  homePage: HomePage;
  loginPage: LoginPage;
  cartPage: CartPage;
  productPage: ProductPage;
  checkoutPage: CheckoutPage;
};

export const test = base.extend<PageFixtures>({
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

  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await use(homePage);
  },

  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  cartPage: async ({ page }, use) => {
    const cartPage = new CartPage(page);
    await use(cartPage);
  },

  productPage: async ({ page }, use) => {
    const productPage = new ProductPage(page);
    await use(productPage);
  },

  checkoutPage: async ({ page }, use) => {
    const checkoutPage = new CheckoutPage(page);
    await use(checkoutPage);
  },
});

export { expect } from '@playwright/test';

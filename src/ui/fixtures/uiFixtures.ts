import { test as baseTest } from '@playwright/test';
import { AuthenticationPage } from '../po/authentication/authentication.page';
import { ProductsPage } from '../po/products/products.page';
import { CartPage } from '../po/cart/cart.page';
import { CheckoutPage } from '../po/checkout/checkout.page';
import { NavbarComponent } from '../po/components/common/navbar.component';
import { UserService } from '../../api/services/user.service';
import { UserDataFactory } from '../../shared/utils/userDataFactory';
import type { UserData } from '../../shared/data/types';

/**
 * UI Test Fixtures - Provides page objects and components via dependency injection
 * Centralizes page object lifecycle and provides type-safe access
 */
export interface UIFixtures {
  authenticationPage: AuthenticationPage;
  productsPage: ProductsPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  navbar: NavbarComponent;
  userService: UserService;
  uniqueUserData: UserData;
}

export const test = baseTest.extend<UIFixtures>({
  authenticationPage: async ({ page }, use) => {
    await use(new AuthenticationPage(page));
  },

  productsPage: async ({ page }, use) => {
    await use(new ProductsPage(page));
  },

  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },

  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },

  navbar: async ({ page }, use) => {
    await use(new NavbarComponent(page));
  },

  userService: async ({ request }, use) => {
    await use(new UserService(request));
  },

  uniqueUserData: async ({ page: _page }: { page?: unknown }, use) => {
    await use(UserDataFactory.generateUserData());
  },
});

export { expect } from '@playwright/test';

import { test as baseTest } from '@playwright/test';
import { AuthenticationPage } from './po/authentication/authentication.page';
import { ProductsPage } from './po/products/products.page';
import { CartPage } from './po/cart/cart.page';
import { CheckoutPage } from './po/checkout/checkout.page';
import { NavbarComponent } from './po/components/common/navbar.component';
import { UserService } from '../api/clients/user.service';
import { ProductService } from '../api/clients/product.service';
import { UserDataFactory } from '../common/utils/userDataFactory';
import type { UserData } from '../common/data/types';

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
  productService: ProductService;
  uniqueUserData: UserData;
}

export const test = baseTest.extend<UIFixtures>({
  context: async ({ context }, use) => {
    // Handle cookie consent by removing the dialog element before any page loads
    await context.addInitScript(() => {
      // Remove consent dialog immediately when detected
      const removeConsentDialog = () => {
        const consentRoot = document.querySelector('.fc-consent-root');
        if (consentRoot) {
          consentRoot.remove();
        }
      };

      // Set up mutation observer to remove dialog if it gets added
      const observer = new MutationObserver(() => {
        removeConsentDialog();
      });

      // Start observing when body is available
      const startObserving = () => {
        if (document.body) {
          observer.observe(document.body, { childList: true, subtree: false });
        } else {
          setTimeout(startObserving, 10);
        }
      };

      startObserving();

      // Also remove on DOM ready
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', removeConsentDialog);
      } else {
        removeConsentDialog();
      }
    });

    await use(context);
  },

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

  productService: async ({ request }, use) => {
    await use(new ProductService(request));
  },

  uniqueUserData: async ({ page: _page }: { page?: unknown }, use) => {
    await use(UserDataFactory.generateUserData());
  },
});

export { expect } from '@playwright/test';

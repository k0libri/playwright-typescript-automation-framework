import { test as baseTest } from '@playwright/test';
import { UserService } from './clients/user.service';
import { ProductService } from './clients/product.service';
import { UserDataFactory } from '../common/utils/userDataFactory';
import type { UserData } from '../common/data/types';

/**
 * Backend API Test Fixtures - Provides service classes via dependency injection
 * Used for UI + API hybrid testing to validate backend state
 */
export interface BackendAPIFixtures {
  userService: UserService;
  productService: ProductService;
  uniqueUserData: UserData;
}

export const test = baseTest.extend<BackendAPIFixtures>({
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

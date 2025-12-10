import { test as baseTest } from '@playwright/test';
import { UserService } from '../services/user.service';
import { ProductService } from '../services/product.service';
import { UserDataFactory, type UserData } from '../../shared/utils/userDataFactory';

/**
 * API Test Fixtures - Provides service classes via dependency injection
 * Centralizes API client lifecycle and provides type-safe access
 */
export interface APIFixtures {
  userService: UserService;
  productService: ProductService;
  uniqueUserData: UserData;
}

export const test = baseTest.extend<APIFixtures>({
  userService: async ({ request }, use) => {
    await use(new UserService(request));
  },

  productService: async ({ request }, use) => {
    await use(new ProductService(request));
  },

  uniqueUserData: async (_, use) => {
    await use(UserDataFactory.generateUserData());
  },
});

export { expect } from '@playwright/test';

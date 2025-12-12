import type { APIRequestContext } from '@playwright/test';
import { UserService } from '../../api/services/user.service';

/**
 * Test Data Cleanup Utility
 * Manages cleanup of test users created during test execution
 */

interface TestUser {
  email: string;
  password: string;
}

export class TestDataCleanup {
  private static createdUsers: Map<string, TestUser[]> = new Map();

  /**
   * Track a created user for cleanup
   * @param category - Category/prefix of the test (e.g., 'cart', 'checkout')
   * @param email - User email
   * @param password - User password
   */
  static trackUser(category: string, email: string, password: string): void {
    if (!this.createdUsers.has(category)) {
      this.createdUsers.set(category, []);
    }
    this.createdUsers.get(category)!.push({ email, password });
  }

  /**
   * Clean up all users in a specific category
   * @param category - Category/prefix to clean up
   * @param request - Playwright API request context
   */
  static async cleanupCategory(category: string, request: APIRequestContext): Promise<void> {
    const users = this.createdUsers.get(category) || [];
    const userService = new UserService(request);

    for (const user of users) {
      try {
        const response = await userService.deleteUser(user.email, user.password);
        const result = await response.json();
        console.log(Deleted user :, result.message || 'Success');
      } catch (error) {
        console.warn(Failed to delete user :, error);
      }
    }

    // Clear tracked users for this category
    this.createdUsers.delete(category);
  }

  /**
   * Clean up all tracked users
   * @param request - Playwright API request context
   */
  static async cleanupAll(request: APIRequestContext): Promise<void> {
    const categories = Array.from(this.createdUsers.keys());
    for (const category of categories) {
      await this.cleanupCategory(category, request);
    }
  }

  /**
   * Clear all tracked users without deleting (for test isolation)
   */
  static clearTracking(): void {
    this.createdUsers.clear();
  }
}

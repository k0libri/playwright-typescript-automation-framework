import type { APIRequestContext, APIResponse } from '@playwright/test';
import { BaseApiClient } from './baseApiClient.service';
import { Logger } from '../../common/utils/logger.util';

const BACKEND_API_BASE_URL =
  process.env['BACKEND_API_BASE_URL'] ?? 'https://automationexercise.com/api';

/**
 * UserService - Handles user-related API operations
 * Extends BaseApiClient for consistent HTTP methods
 *
 * Instance methods: Use with fixtures (requires APIRequestContext)
 * Static methods: Use in beforeAll hooks (uses native fetch)
 */
export class UserService extends BaseApiClient {
  constructor(request: APIRequestContext) {
    super(request, BACKEND_API_BASE_URL);
  }

  // ========== Instance Methods (Fixture-based) ==========

  /**
   * Create a new user account via API
   * @param userData - Object containing all required user registration fields (name, email, password, addresses, etc.)
   * @returns Promise<APIResponse> - Playwright API Response with user creation result
   */
  async createUser(userData: {
    name: string;
    email: string;
    password: string;
    title: string;
    birth_date: string;
    birth_month: string;
    birth_year: string;
    firstname: string;
    lastname: string;
    company: string;
    address1: string;
    address2?: string;
    country: string;
    zipcode: string;
    state: string;
    city: string;
    mobile_number: string;
  }): Promise<APIResponse> {
    Logger.info(`API: Creating user account for ${userData.email}`);
    // Convert to URL-encoded form data
    const formData = new URLSearchParams();
    Object.entries(userData).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, value);
      }
    });

    return await this.post('/createAccount', {
      data: formData.toString(),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
  }

  /**
   * Get user details by email address
   * @param email - The email address of the user to retrieve
   * @returns Promise<APIResponse> - Playwright API Response containing user details
   */
  async getUserByEmail(email: string): Promise<APIResponse> {
    Logger.info(`API: Fetching user details for ${email}`);
    return await this.get('/getUserDetailByEmail', {
      params: { email },
    });
  }

  /**
   * Verify login credentials for a user
   * @param email - The user's email address
   * @param password - The user's password
   * @returns Promise<APIResponse> - Playwright API Response with login verification result
   */
  async verifyLogin(email: string, password: string): Promise<APIResponse> {
    Logger.info(`API: Verifying login for ${email}`);
    const formData = new URLSearchParams();
    formData.append('email', email);
    formData.append('password', password);

    return await this.post('/verifyLogin', {
      data: formData.toString(),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
  }

  /**
   * Delete user account
   * @param email - The user's email address
   * @param password - The user's password for authentication
   * @returns Promise<APIResponse> - Playwright API Response with deletion result
   */
  async deleteUser(email: string, password: string): Promise<APIResponse> {
    Logger.info(`API: Deleting user account for ${email}`);
    const formData = new URLSearchParams();
    formData.append('email', email);
    formData.append('password', password);

    return await this.delete('/deleteAccount', {
      data: formData.toString(),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
  }

  /**
   * Cleanup: Delete user account with error handling (safe to call even if deletion fails)
   * @param email - The user's email address
   * @param password - The user's password
   * @returns Promise<void> - Resolves when cleanup attempt completes (doesn't throw on failure)
   */
  async cleanupUser(email: string, password: string): Promise<void> {
    try {
      await this.deleteUser(email, password);
      Logger.info(`API: Successfully cleaned up user ${email}`);
    } catch (error) {
      Logger.warn(`API: Cleanup failed for ${email}`, error);
    }
  }

  /**
   * Safely get user details with error handling (returns null body if request fails)
   * @param email - The user's email address
   * @returns Promise<{status: number, body: any | null}> - Object with HTTP status and response body (null if error)
   */
  async safeGetUserByEmail(email: string): Promise<{ status: number; body: any | null }> {
    try {
      const response = await this.getUserByEmail(email);
      return {
        status: response.status(),
        body: await response.json(),
      };
    } catch (error) {
      Logger.debug(`API: getUserByEmail failed for '${email}'`, error);
      return { status: 0, body: null };
    }
  }

  // ========== Static Methods (for beforeAll/beforeEach without fixtures) ==========

  /**
   * Create user using native fetch (no fixture required)
   * Use in beforeAll hooks
   */
  static async createUserStatic(userData: {
    name: string;
    email: string;
    password: string;
    title: string;
    birth_date: string;
    birth_month: string;
    birth_year: string;
    firstname: string;
    lastname: string;
    company: string;
    address1: string;
    address2?: string;
    country: string;
    zipcode: string;
    state: string;
    city: string;
    mobile_number: string;
  }): Promise<Response> {
    Logger.info(`API Static: Creating user account for ${userData.email}`);
    const formData = new FormData();
    Object.entries(userData).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, value);
      }
    });

    return fetch(`${BACKEND_API_BASE_URL}/createAccount`, {
      method: 'POST',
      body: formData,
    });
  }

  /**
   * Get user by email using native fetch (no fixture required)
   * Use in beforeAll hooks
   */
  static async getUserByEmailStatic(email: string): Promise<Response> {
    Logger.info(`API Static: Fetching user details for ${email}`);
    return fetch(`${BACKEND_API_BASE_URL}/getUserDetailByEmail?email=${encodeURIComponent(email)}`);
  }

  /**
   * Verify login using native fetch (no fixture required)
   * Use in beforeAll hooks
   */
  static async verifyLoginStatic(email: string, password: string): Promise<Response> {
    Logger.info(`API Static: Verifying login for ${email}`);
    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);

    return fetch(`${BACKEND_API_BASE_URL}/verifyLogin`, {
      method: 'POST',
      body: formData,
    });
  }

  /**
   * Delete user using native fetch (no fixture required)
   * Use in beforeAll hooks
   */
  static async deleteUserStatic(email: string, password: string): Promise<Response> {
    Logger.info(`API Static: Deleting user account for ${email}`);
    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);

    return fetch(`${BACKEND_API_BASE_URL}/deleteAccount`, {
      method: 'DELETE',
      body: formData,
    });
  }

  /**
   * Safe get user with error handling using native fetch
   * Use in beforeAll hooks
   */
  static async safeGetUserByEmailStatic(
    email: string,
  ): Promise<{ status: number; body: any | null }> {
    try {
      const response = await UserService.getUserByEmailStatic(email);
      return {
        status: response.status,
        body: await response.json(),
      };
    } catch (error) {
      Logger.debug(`API Static: getUserByEmail failed for '${email}'`, error);
      return { status: 0, body: null };
    }
  }
}

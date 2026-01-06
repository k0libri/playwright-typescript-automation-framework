import type { APIRequestContext, APIResponse } from '@playwright/test';
import { BaseApiClient } from './baseApiClient.service';
import { Logger } from '../../common/utils/logger.util';

/**
 * UserService - Handles user-related API operations
 * Extends BaseApiClient for consistent HTTP methods
 */
export class UserService extends BaseApiClient {
  constructor(request: APIRequestContext) {
    super(request, process.env['BACKEND_API_BASE_URL'] ?? 'https://automationexercise.com/api');
  }

  /**
   * Create a new user account via API
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
   * Get user details by email
   */
  async getUserByEmail(email: string): Promise<APIResponse> {
    Logger.info(`API: Fetching user details for ${email}`);
    return await this.get('/getUserDetailByEmail', {
      params: { email },
    });
  }

  /**
   * Verify login with email and password
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
   * Cleanup: Delete user account with error handling
   * Safe to call even if deletion fails
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
   * Safely get user details by email with error handling
   * Returns null if the request fails (e.g., empty email)
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
}

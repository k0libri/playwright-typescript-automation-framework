import type { APIRequestContext, APIResponse } from '@playwright/test';
import { BaseApiClient } from '../base/baseApiClient.service';
import { Environment } from '../../shared/config/environment';

/**
 * UserService - Handles user-related API operations
 * Extends BaseApiClient for consistent HTTP methods
 */
export class UserService extends BaseApiClient {
  constructor(request: APIRequestContext) {
    super(request, Environment.API_BASE_URL);
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
    return await this.get('/getUserDetailByEmail', {
      params: { email },
    });
  }

  /**
   * Verify login with email and password
   */
  async verifyLogin(email: string, password: string): Promise<APIResponse> {
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
    const formData = new URLSearchParams();
    formData.append('email', email);
    formData.append('password', password);

    return await this.delete('/deleteAccount', {
      data: formData.toString(),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
  }
}

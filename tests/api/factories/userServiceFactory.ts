import type { UserData } from '../../common/data/types';
import {
  buildCreateUserPayload,
  buildLoginPayload,
  buildDeleteUserPayload,
} from '../data/userPayloads';

const BACKEND_API_BASE_URL =
  process.env['BACKEND_API_BASE_URL'] ?? 'https://automationexercise.com/api';

/**
 * User Service Factory - Standalone user API operations
 * Uses native fetch with object-based data, no fixture dependencies
 */
export const UserServiceFactory = {
  /**
   * Create a new user account
   */
  async createUser(userData: UserData): Promise<Response> {
    const formData = new FormData();
    const payload = buildCreateUserPayload(userData);

    Object.entries(payload).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, value);
      }
    });

    return fetch(`${BACKEND_API_BASE_URL}/createAccount`, {
      method: 'POST',
      body: formData,
    });
  },

  /**
   * Get user details by email
   */
  async getUserByEmail(email: string): Promise<Response> {
    return fetch(`${BACKEND_API_BASE_URL}/getUserDetailByEmail?email=${encodeURIComponent(email)}`);
  },

  /**
   * Verify login with email and password
   */
  async verifyLogin(email: string, password: string): Promise<Response> {
    const formData = new FormData();
    const payload = buildLoginPayload(email, password);

    Object.entries(payload).forEach(([key, value]) => {
      formData.append(key, value);
    });

    return fetch(`${BACKEND_API_BASE_URL}/verifyLogin`, {
      method: 'POST',
      body: formData,
    });
  },

  /**
   * Delete user account
   */
  async deleteUser(email: string, password: string): Promise<Response> {
    const formData = new FormData();
    const payload = buildDeleteUserPayload(email, password);

    Object.entries(payload).forEach(([key, value]) => {
      formData.append(key, value);
    });

    return fetch(`${BACKEND_API_BASE_URL}/deleteAccount`, {
      method: 'DELETE',
      body: formData,
    });
  },

  /**
   * Safely get user details with error handling
   */
  async safeGetUserByEmail(email: string): Promise<{ status: number; body: any | null }> {
    try {
      const response = await this.getUserByEmail(email);
      return {
        status: response.status,
        body: await response.json(),
      };
    } catch {
      return { status: 0, body: null };
    }
  },
};

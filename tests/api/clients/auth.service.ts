import type { APIRequestContext, APIResponse } from '@playwright/test';
import { BaseApiClient } from './baseApiClient.service';
import type { AuthCredentials, AuthResponse } from '../data/types';

/**
 * AuthService - Handles authentication operations for restful-booker API
 */
export class AuthService extends BaseApiClient {
  constructor(request: APIRequestContext, baseUrl: string) {
    super(request, baseUrl);
  }

  /**
   * Authenticate and obtain access token
   */
  async createToken(credentials: AuthCredentials): Promise<APIResponse> {
    return await this.post('/auth', {
      data: credentials as unknown as Record<string, unknown>,
    });
  }

  /**
   * Extract token from authentication response
   */
  async getTokenFromResponse(response: APIResponse): Promise<string> {
    const data = await this.parseJson<AuthResponse>(response);
    return data.token;
  }
}

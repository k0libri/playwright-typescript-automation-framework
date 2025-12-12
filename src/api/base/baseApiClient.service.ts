import type { APIRequestContext, APIResponse } from '@playwright/test';

/**
 * BaseApiClient - Base class for all API service classes
 * Provides common HTTP methods and utilities for API testing
 * Handles Django CSRF token protection for automationexercise.com APIs
 */
export abstract class BaseApiClient {
  protected readonly request: APIRequestContext;
  protected readonly baseUrl: string;
  private csrfToken: string | null = null;

  constructor(request: APIRequestContext, baseUrl: string) {
    this.request = request;
    this.baseUrl = baseUrl;
  }

  /**
   * Fetch CSRF token from the server
   * Django sends csrftoken cookie which must be included in subsequent requests
   */
  private async fetchCsrfToken(): Promise<string> {
    if (this.csrfToken) {
      return this.csrfToken;
    }

    // Make a GET request to the login page to obtain CSRF cookie
    // Note: baseUrl is https://automationexercise.com/api, so we need to go up to root
    const rootUrl = this.baseUrl.replace('/api', '');
    const response = await this.request.get(`${rootUrl}/login`);

    // Extract csrftoken from Set-Cookie response headers
    const headers = response.headers();
    const setCookieHeader = headers['set-cookie'];

    if (setCookieHeader) {
      const csrfMatch = setCookieHeader.match(/csrftoken=([^;]+)/);
      if (csrfMatch) {
        this.csrfToken = csrfMatch[1];
        return this.csrfToken;
      }
    }

    throw new Error('Failed to obtain CSRF token from server');
  }

  /**
   * Perform GET request
   */
  protected async get(
    endpoint: string,
    options?: {
      headers?: Record<string, string>;
      params?: Record<string, string>;
    }
  ): Promise<APIResponse> {
    const url = this.buildUrl(endpoint, options?.params);
    const defaultHeaders = {
      Referer: 'https://automationexercise.com/',
      Origin: 'https://automationexercise.com',
    };
    return await this.request.get(url, {
      headers: { ...defaultHeaders, ...options?.headers },
    });
  }

  /**
   * Perform POST request with CSRF protection
   */
  protected async post(
    endpoint: string,
    options?: {
      data?: Record<string, unknown> | string;
      headers?: Record<string, string>;
      params?: Record<string, string>;
    }
  ): Promise<APIResponse> {
    const url = this.buildUrl(endpoint, options?.params);
    const csrfToken = await this.fetchCsrfToken();

    const defaultHeaders = {
      Referer: 'https://automationexercise.com/',
      Origin: 'https://automationexercise.com',
      'X-CSRFToken': csrfToken,
      Cookie: `csrftoken=${csrfToken}`,
    };

    return await this.request.post(url, {
      ...(options?.data && { data: options.data }),
      headers: { ...defaultHeaders, ...options?.headers },
    });
  }

  /**
   * Perform PUT request with CSRF protection
   */
  protected async put(
    endpoint: string,
    options?: {
      data?: Record<string, unknown> | string;
      headers?: Record<string, string>;
      params?: Record<string, string>;
    }
  ): Promise<APIResponse> {
    const url = this.buildUrl(endpoint, options?.params);
    const csrfToken = await this.fetchCsrfToken();

    const defaultHeaders = {
      Referer: 'https://automationexercise.com/',
      Origin: 'https://automationexercise.com',
      'X-CSRFToken': csrfToken,
      Cookie: `csrftoken=${csrfToken}`,
    };

    return await this.request.put(url, {
      ...(options?.data && { data: options.data }),
      headers: { ...defaultHeaders, ...options?.headers },
    });
  }

  /**
   * Perform DELETE request with CSRF protection
   */
  protected async delete(
    endpoint: string,
    options?: {
      data?: Record<string, unknown> | string;
      headers?: Record<string, string>;
      params?: Record<string, string>;
    }
  ): Promise<APIResponse> {
    const url = this.buildUrl(endpoint, options?.params);
    const csrfToken = await this.fetchCsrfToken();

    const defaultHeaders = {
      Referer: 'https://automationexercise.com/',
      Origin: 'https://automationexercise.com',
      'X-CSRFToken': csrfToken,
      Cookie: `csrftoken=${csrfToken}`,
    };

    return await this.request.delete(url, {
      ...(options?.data && { data: options.data }),
      headers: { ...defaultHeaders, ...options?.headers },
    });
  }

  /**
   * Build full URL from endpoint and base URL
   */
  private buildUrl(endpoint: string, params?: Record<string, string>): string {
    // Ensure baseUrl ends with / for proper URL construction
    const base = this.baseUrl.endsWith('/') ? this.baseUrl : `${this.baseUrl}/`;
    // Remove leading slash from endpoint if present
    const path = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    const url = new URL(path, base);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }
    return url.toString();
  }

  /**
   * Validate response status
   */
  protected validateStatus(response: APIResponse, expectedStatus: number): void {
    if (response.status() !== expectedStatus) {
      throw new Error(`Expected status ${expectedStatus}, but got ${response.status()}`);
    }
  }

  /**
   * Get response JSON data
   */
  protected async getResponseJson<T>(response: APIResponse): Promise<T> {
    return await response.json();
  }
}

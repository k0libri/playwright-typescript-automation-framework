import type { APIRequestContext, APIResponse } from '@playwright/test';

/**
 * BaseApiClient - Base class for standalone API service classes
 * Provides common HTTP methods for RESTful API testing
 * Used for testing external APIs like restful-booker
 */
export abstract class BaseApiClient {
  protected readonly request: APIRequestContext;
  protected readonly baseUrl: string;

  constructor(request: APIRequestContext, baseUrl: string) {
    this.request = request;
    this.baseUrl = baseUrl;
  }

  /**
   * Perform GET request
   */
  protected async get(
    endpoint: string,
    options?: {
      headers?: Record<string, string>;
      params?: Record<string, string | number | boolean>;
    },
  ): Promise<APIResponse> {
    const url = this.buildUrl(endpoint, options?.params);
    return await this.request.get(url, {
      ...(options?.headers && { headers: options.headers }),
    });
  }

  /**
   * Perform POST request
   */
  protected async post(
    endpoint: string,
    options?: {
      data?: Record<string, unknown> | string;
      headers?: Record<string, string>;
      params?: Record<string, string | number | boolean>;
    },
  ): Promise<APIResponse> {
    const url = this.buildUrl(endpoint, options?.params);
    return await this.request.post(url, {
      ...(options?.data && { data: options.data }),
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });
  }

  /**
   * Perform PUT request
   */
  protected async put(
    endpoint: string,
    options?: {
      data?: Record<string, unknown> | string;
      headers?: Record<string, string>;
      params?: Record<string, string | number | boolean>;
    },
  ): Promise<APIResponse> {
    const url = this.buildUrl(endpoint, options?.params);
    return await this.request.put(url, {
      ...(options?.data && { data: options.data }),
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });
  }

  /**
   * Perform PATCH request
   */
  protected async patch(
    endpoint: string,
    options?: {
      data?: Record<string, unknown> | string;
      headers?: Record<string, string>;
      params?: Record<string, string | number | boolean>;
    },
  ): Promise<APIResponse> {
    const url = this.buildUrl(endpoint, options?.params);
    return await this.request.patch(url, {
      ...(options?.data && { data: options.data }),
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });
  }

  /**
   * Perform DELETE request
   */
  protected async delete(
    endpoint: string,
    options?: {
      headers?: Record<string, string>;
      params?: Record<string, string | number | boolean>;
    },
  ): Promise<APIResponse> {
    const url = this.buildUrl(endpoint, options?.params);
    return await this.request.delete(url, {
      ...(options?.headers && { headers: options.headers }),
    });
  }

  /**
   * Build full URL with query parameters
   */
  private buildUrl(endpoint: string, params?: Record<string, string | number | boolean>): string {
    const url = new URL(`${this.baseUrl}${endpoint}`);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });
    }

    return url.toString();
  }

  /**
   * Parse JSON response safely
   */
  protected async parseJson<T = unknown>(response: APIResponse): Promise<T> {
    try {
      return (await response.json()) as T;
    } catch (error) {
      throw new Error(
        `Failed to parse JSON response: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }
}

import type { APIRequestContext, APIResponse } from '@playwright/test';

/**
 * BaseApiClient - Base class for all API service classes
 * Provides common HTTP methods and utilities for API testing
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
      params?: Record<string, string>;
    },
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
   * Perform POST request
   */
  protected async post(
    endpoint: string,
    options?: {
      data?: Record<string, unknown> | string;
      headers?: Record<string, string>;
      params?: Record<string, string>;
    },
  ): Promise<APIResponse> {
    const url = this.buildUrl(endpoint, options?.params);
    const defaultHeaders = {
      Referer: 'https://automationexercise.com/',
      Origin: 'https://automationexercise.com',
    };
    return await this.request.post(url, {
      ...(options?.data && { data: options.data }),
      headers: { ...defaultHeaders, ...options?.headers },
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
      params?: Record<string, string>;
    },
  ): Promise<APIResponse> {
    const url = this.buildUrl(endpoint, options?.params);
    const defaultHeaders = {
      Referer: 'https://automationexercise.com/',
      Origin: 'https://automationexercise.com',
    };
    return await this.request.put(url, {
      ...(options?.data && { data: options.data }),
      headers: { ...defaultHeaders, ...options?.headers },
    });
  }

  /**
   * Perform DELETE request
   */
  protected async delete(
    endpoint: string,
    options?: {
      data?: Record<string, unknown> | string;
      headers?: Record<string, string>;
      params?: Record<string, string>;
    },
  ): Promise<APIResponse> {
    const url = this.buildUrl(endpoint, options?.params);
    const defaultHeaders = {
      Referer: 'https://automationexercise.com/',
      Origin: 'https://automationexercise.com',
    };
    return await this.request.delete(url, {
      ...(options?.data && { data: options.data }),
      headers: { ...defaultHeaders, ...options?.headers },
    });
  }

  /**
   * Build full URL with query parameters
   */
  private buildUrl(endpoint: string, params?: Record<string, string>): string {
    const url = new URL(endpoint, this.baseUrl);
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

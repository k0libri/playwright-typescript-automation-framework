import type { APIRequestContext, APIResponse } from '@playwright/test';
import { Logger } from '../../common/utils/logger.util';

type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';

interface RequestOptions<TData = string> {
  data?: TData;
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean>;
}

/**
 * BaseApiClient - Base class for API service classes
 * Provides common HTTP methods with centralized request handling and logging
 */
export abstract class BaseApiClient {
  protected readonly request: APIRequestContext;
  protected readonly baseUrl: string;

  constructor(request: APIRequestContext, baseUrl: string) {
    this.request = request;
    this.baseUrl = baseUrl;
  }

  /**
   * Centralized request handler with error logging
   */
  private async executeRequest<TData = string>(
    method: HttpMethod,
    endpoint: string,
    options?: RequestOptions<TData>,
  ): Promise<APIResponse> {
    const url = this.buildUrl(endpoint, options?.params);
    const requestOptions = this.buildRequestOptions(options);

    const response = await this.request[method](url, requestOptions);

    if (!response.ok()) {
      await this.logErrorResponse(method, url, response, options);
    }

    return response;
  }

  /**
   * Perform GET request
   */
  protected async get(endpoint: string, options?: RequestOptions): Promise<APIResponse> {
    return await this.executeRequest('get', endpoint, options);
  }

  /**
   * Perform POST request
   */
  protected async post<TData = string>(
    endpoint: string,
    options?: RequestOptions<TData>,
  ): Promise<APIResponse> {
    return await this.executeRequest('post', endpoint, options);
  }

  /**
   * Perform PUT request
   */
  protected async put<TData = string>(
    endpoint: string,
    options?: RequestOptions<TData>,
  ): Promise<APIResponse> {
    return await this.executeRequest('put', endpoint, options);
  }

  /**
   * Perform PATCH request
   */
  protected async patch<TData = string>(
    endpoint: string,
    options?: RequestOptions<TData>,
  ): Promise<APIResponse> {
    return await this.executeRequest('patch', endpoint, options);
  }

  /**
   * Perform DELETE request
   */
  protected async delete<TData = string>(
    endpoint: string,
    options?: RequestOptions<TData>,
  ): Promise<APIResponse> {
    return await this.executeRequest('delete', endpoint, options);
  }

  /**
   * Build request options with default headers
   */
  private buildRequestOptions<TData = string>(
    options?: RequestOptions<TData>,
  ): { data?: TData; headers?: Record<string, string> } {
    const requestOptions: { data?: TData; headers?: Record<string, string> } = {};

    if (options?.data !== undefined) {
      requestOptions.data = options.data;
    }

    if (options?.headers) {
      requestOptions.headers = {
        'Content-Type': 'application/json',
        ...options.headers,
      };
    } else if (options?.data !== undefined) {
      requestOptions.headers = { 'Content-Type': 'application/json' };
    }

    return requestOptions;
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
   * Log error response with masked sensitive data
   */
  private async logErrorResponse<TData = string>(
    method: HttpMethod,
    url: string,
    response: APIResponse,
    options?: RequestOptions<TData>,
  ): Promise<void> {
    const maskedUrl = this.maskSensitiveUrlData(url);
    const maskedHeaders = this.maskSensitiveHeaders(options?.headers);
    const status = response.status();
    const responseBody = (await response.body()).toString();

    Logger.warn(
      `\nA ${method.toUpperCase()} request to "${maskedUrl}" returned status: ${status}` +
        `\nDetails:` +
        `\nRequest: ${method.toUpperCase()} ${maskedUrl}` +
        `\nRequest body: ${JSON.stringify(options?.data, null, 2)}` +
        `\nRequest headers: ${JSON.stringify(maskedHeaders, null, 2)}` +
        `\nResponse status: ${status}` +
        `\nResponse body: ${JSON.stringify(responseBody, null, 2)}`,
    );
  }

  /**
   * Mask sensitive data in URL (e.g., API keys, tokens)
   */
  private maskSensitiveUrlData(urlString: string): string {
    const url = new URL(urlString);
    const sensitiveParams = ['apiKey', 'token', 'key', 'secret'];

    sensitiveParams.forEach((param) => {
      const value = url.searchParams.get(param);
      if (value) {
        url.searchParams.set(param, `${value.slice(0, 10)}...`);
      }
    });

    return url.toString();
  }

  /**
   * Mask sensitive data in headers
   */
  private maskSensitiveHeaders(
    headers?: Record<string, string>,
  ): Record<string, string> | undefined {
    if (!headers) {
      return undefined;
    }

    const masked = { ...headers };
    const sensitiveKeys = ['authorization', 'cookie', 'x-api-key', 'x-service-account-key'];

    Object.keys(masked).forEach((key) => {
      if (sensitiveKeys.includes(key.toLowerCase())) {
        const value = masked[key];
        masked[key] = value && value.length > 10 ? `${value.slice(0, 10)}...` : '***';
      }
    });

    return masked;
  }

  /**
   * Parse JSON response safely
   */
  protected async parseJson<T>(response: APIResponse): Promise<T> {
    try {
      return (await response.json()) as T;
    } catch (error) {
      throw new Error(
        `Failed to parse JSON response: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }
}

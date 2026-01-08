import type { APIRequestContext, APIResponse } from '@playwright/test';
import { BaseApiClient } from './baseApiClient.service';

/**
 * ProductService - Handles product-related API operations
 * Extends BaseApiClient for consistent HTTP methods
 */
export class ProductService extends BaseApiClient {
  constructor(request: APIRequestContext) {
    super(request, process.env['BACKEND_API_BASE_URL'] ?? 'https://automationexercise.com/api');
  }

  /**
   * Get all products list
   * @returns Promise<APIResponse> - Playwright API Response containing array of all products
   */
  async getAllProducts(): Promise<APIResponse> {
    return await this.get('/productsList');
  }

  /**
   * Search for products by term
   * @param searchTerm - The search query string to filter products
   * @returns Promise<APIResponse> - Playwright API Response containing matching products
   */
  async searchProduct(searchTerm: string): Promise<APIResponse> {
    return await this.post('/searchProduct', {
      data: { search_product: searchTerm },
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
  }

  /**
   * Get all brands list
   * @returns Promise<APIResponse> - Playwright API Response containing array of all brands
   */
  async getAllBrands(): Promise<APIResponse> {
    return await this.get('/brandsList');
  }
}

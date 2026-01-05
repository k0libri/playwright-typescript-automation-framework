import type { APIRequestContext, APIResponse } from '@playwright/test';
import { BaseApiClient } from './baseApiClient.service';
import { Environment } from '../../common/config/environment';

/**
 * ProductService - Handles product-related API operations
 * Extends BaseApiClient for consistent HTTP methods
 */
export class ProductService extends BaseApiClient {
  constructor(request: APIRequestContext) {
    super(request, Environment.API_BASE_URL);
  }

  /**
   * Get all products list
   */
  async getAllProducts(): Promise<APIResponse> {
    return await this.get('/productsList');
  }

  /**
   * Search for products
   */
  async searchProduct(searchTerm: string): Promise<APIResponse> {
    return await this.post('/searchProduct', {
      data: { search_product: searchTerm },
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
  }

  /**
   * Get all brands list
   */
  async getAllBrands(): Promise<APIResponse> {
    return await this.get('/brandsList');
  }
}

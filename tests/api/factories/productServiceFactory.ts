import { buildSearchProductPayload } from '../data/productPayloads';

const BACKEND_API_BASE_URL =
  process.env['BACKEND_API_BASE_URL'] ?? 'https://automationexercise.com/api';

/**
 * Product Service Factory - Standalone product API operations
 * Uses native fetch with object-based data, no fixture dependencies
 */
export const ProductServiceFactory = {
  /**
   * Get all products
   */
  async getAllProducts(): Promise<Response> {
    return fetch(`${BACKEND_API_BASE_URL}/productsList`);
  },

  /**
   * Search products by search term
   */
  async searchProducts(searchTerm: string): Promise<Response> {
    const formData = new FormData();
    const payload = buildSearchProductPayload(searchTerm);

    Object.entries(payload).forEach(([key, value]) => {
      formData.append(key, value);
    });

    return fetch(`${BACKEND_API_BASE_URL}/searchProduct`, {
      method: 'POST',
      body: formData,
    });
  },
};

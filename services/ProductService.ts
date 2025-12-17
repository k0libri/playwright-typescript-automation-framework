import { APIRequestContext } from '@playwright/test';
import { ProductResponse, BrandResponse, SearchProductResponse } from './ApiResponse';
import { API_ENDPOINTS } from '../config/constants';

export interface Product {
  id: number;
  name: string;
  price: string;
  brand: string;
  category: {
    usertype: {
      usertype: string;
    };
    category: string;
  };
}

export interface Brand {
  id: number;
  brand: string;
}

export class ProductService {
  private request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async getAllProducts(): Promise<ProductResponse> {
    const response = await this.request.get(API_ENDPOINTS.GET_ALL_PRODUCTS);
    return response.json();
  }

  async searchProduct(searchTerm: string): Promise<SearchProductResponse> {
    const response = await this.request.post(API_ENDPOINTS.SEARCH_PRODUCT, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: `search_product=${encodeURIComponent(searchTerm)}`,
    });

    return response.json();
  }

  async getAllBrands(): Promise<BrandResponse> {
    const response = await this.request.get(API_ENDPOINTS.GET_ALL_BRANDS);
    return response.json();
  }

  async getProductById(id: number): Promise<Product | null> {
    const productsResponse = await this.getAllProducts();
    if (productsResponse.responseCode === 200 && productsResponse.products) {
      return productsResponse.products.find((product: Product) => product.id === id) || null;
    }
    return null;
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    const productsResponse = await this.getAllProducts();
    if (productsResponse.responseCode === 200 && productsResponse.products) {
      return productsResponse.products.filter((product: Product) =>
        product.category.category.toLowerCase().includes(category.toLowerCase()),
      );
    }
    return [];
  }

  async getProductsByBrand(brand: string): Promise<Product[]> {
    const productsResponse = await this.getAllProducts();
    if (productsResponse.responseCode === 200 && productsResponse.products) {
      return productsResponse.products.filter((product: Product) =>
        product.brand.toLowerCase().includes(brand.toLowerCase()),
      );
    }
    return [];
  }
}

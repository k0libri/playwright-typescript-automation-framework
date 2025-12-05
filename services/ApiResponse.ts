/**
 * Base API Response interface for all API endpoints
 */
export interface ApiResponse {
  responseCode: number;
  message?: string;
}

/**
 * User-related API responses
 */
export interface UserResponse extends ApiResponse {
  user?: {
    id: number;
    name: string;
    email: string;
    title?: string;
    birth_date?: string;
    birth_month?: string;
    birth_year?: string;
    firstname?: string;
    lastname?: string;
    company?: string;
    address1?: string;
    address2?: string;
    country?: string;
    zipcode?: string;
    state?: string;
    city?: string;
    mobile_number?: string;
  };
}

export interface LoginResponse extends ApiResponse {
  user?: {
    id: number;
    name: string;
    email: string;
  };
}

/**
 * Product-related API responses
 */
export interface ProductResponse extends ApiResponse {
  products?: Array<{
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
  }>;
}

export interface BrandResponse extends ApiResponse {
  brands?: Array<{
    id: number;
    brand: string;
  }>;
}

export interface SearchProductResponse extends ApiResponse {
  products?: Array<{
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
  }>;
}

import { test, expect } from '../fixtures';
import { ProductService, Product } from '../../services/ProductService';

test.describe('Product API Tests', () => {
  let productService: ProductService;

  test.beforeEach(({ request }) => {
    productService = new ProductService(request);
  });

  test('API-011: Should retrieve all products list', async () => {
    await test.step('Get all products', async () => {
      const response = await productService.getAllProducts();

      expect(response).toHaveProperty('responseCode');
      expect(response.responseCode).toBe(200);
      expect(response).toHaveProperty('products');
      expect(response.products).toBeDefined();
      if (!Array.isArray(response.products)) return;
      expect(response.products.length).toBeGreaterThan(0);

      // Verify product structure
      const firstProduct = response.products[0];
      expect(firstProduct).toHaveProperty('id');
      expect(firstProduct).toHaveProperty('name');
      expect(firstProduct).toHaveProperty('price');
      expect(firstProduct).toHaveProperty('brand');
      expect(firstProduct).toHaveProperty('category');
    });
  });

  test('API-012: Should search products by name', async () => {
    await test.step('Search for specific product', async () => {
      const searchTerm = 'blue';
      const response = await productService.searchProduct(searchTerm);

      expect(response).toHaveProperty('responseCode');
      expect(response.responseCode).toBe(200);
      expect(response).toHaveProperty('products');
      expect(response.products).toBeDefined();
      expect(Array.isArray(response.products)).toBeTruthy();
      if (!Array.isArray(response.products)) return;

      // Verify search results contain the search term
      if (response.products.length > 0) {
        const firstProduct = response.products[0];
        expect(firstProduct.name.toLowerCase()).toContain(searchTerm.toLowerCase());
      }
    });
  });

  test('API-013: Should handle search with no results', async () => {
    await test.step('Search for non-existent product', async () => {
      const searchTerm = 'nonexistentproduct12345';
      const response = await productService.searchProduct(searchTerm);

      expect(response).toHaveProperty('responseCode');
      expect(response.responseCode).toBe(200);
      expect(response).toHaveProperty('products');
      expect(response.products).toBeDefined();
      expect(Array.isArray(response.products)).toBeTruthy();
      if (!Array.isArray(response.products)) return;
      expect(response.products.length).toBe(0);
    });
  });

  test('API-014: Should retrieve all brands list', async () => {
    await test.step('Get all brands', async () => {
      const response = await productService.getAllBrands();

      expect(response).toHaveProperty('responseCode');
      expect(response.responseCode).toBe(200);
      expect(response).toHaveProperty('brands');
      expect(response.brands).toBeDefined();
      expect(Array.isArray(response.brands)).toBeTruthy();
      if (!Array.isArray(response.brands)) return;
      expect(response.brands.length).toBeGreaterThan(0);

      // Verify brand structure
      const firstBrand = response.brands[0];
      expect(firstBrand).toHaveProperty('id');
      expect(firstBrand).toHaveProperty('brand');
    });
  });

  test('API-015: Should get product by ID', async () => {
    await test.step('Get specific product by ID', async () => {
      const productId = 1; // Blue Top
      const product = await productService.getProductById(productId);

      expect(product).not.toBeNull();
      expect(product!.id).toBe(productId);
      expect(product!.name).toBeDefined();
      expect(product!.price).toBeDefined();
    });
  });

  test('API-016: Should get products by category', async () => {
    await test.step('Get products by category', async () => {
      const category = 'women';
      const products = await productService.getProductsByCategory(category);

      expect(Array.isArray(products)).toBeTruthy();

      if (products.length > 0) {
        // Verify all products belong to the specified category
        products.forEach((product) => {
          expect(product.category.category.toLowerCase()).toContain(category);
        });
      }
    });
  });

  test('API-017: Should get products by brand', async () => {
    await test.step('Get products by brand', async () => {
      const brand = 'polo';
      const products = await productService.getProductsByBrand(brand);

      expect(Array.isArray(products)).toBeTruthy();

      if (products.length > 0) {
        // Verify all products belong to the specified brand
        products.forEach((product) => {
          expect(product.brand.toLowerCase()).toContain(brand);
        });
      }
    });
  });

  test('API-018: Should validate product data structure', async () => {
    await test.step('Validate complete product data structure', async () => {
      const response = await productService.getAllProducts();
      const products = response.products;

      expect(products).toBeDefined();
      // Take a sample product and validate its complete structure
      const sampleProduct = products![0];

      // Required fields
      expect(sampleProduct).toHaveProperty('id');
      expect(sampleProduct).toHaveProperty('name');
      expect(sampleProduct).toHaveProperty('price');
      expect(sampleProduct).toHaveProperty('brand');
      expect(sampleProduct).toHaveProperty('category');

      // Category structure
      expect(sampleProduct.category).toHaveProperty('usertype');
      expect(sampleProduct.category).toHaveProperty('category');
      expect(sampleProduct.category.usertype).toHaveProperty('usertype');

      // Data types
      expect(typeof sampleProduct.id).toBe('number');
      expect(typeof sampleProduct.name).toBe('string');
      expect(typeof sampleProduct.price).toBe('string');
      expect(typeof sampleProduct.brand).toBe('string');
    });
  });

  test('API-019: Should handle invalid search parameters', async () => {
    await test.step('Search with empty search term', async () => {
      const response = await productService.searchProduct('');

      // Should either return all products or handle empty search gracefully
      expect(response).toHaveProperty('responseCode');
      expect(response.responseCode).toBe(200);
      expect(response).toHaveProperty('products');
      expect(Array.isArray(response.products)).toBeTruthy();
    });
  });

  test('API-020: Should verify product price format', async () => {
    await test.step('Validate price format across products', async () => {
      const response = await productService.getAllProducts();
      const products = response.products;

      expect(products).toBeDefined();
      // Verify price format (should start with 'Rs.')
      products!.forEach((product: Product) => {
        expect(product.price).toMatch(/^Rs\. \d+$/);
      });
    });
  });
});

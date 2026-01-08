import type { Locator, Page } from '@playwright/test';
import { BasePage } from '../base/basePage.page';
import { SearchComponent } from '../components/common/search.component';
import { ProductCardsListComponent } from '../components/common/productCard.component';
import { Logger } from '../../../common/utils/logger.util';

/**
 * ProductsPage - Handles product listing and product interactions
 * Extends BasePage for common page behaviors
 */
export class ProductsPage extends BasePage {
  protected readonly pageUrl = '/products';

  readonly searchComponent: SearchComponent;
  readonly productCardsList: ProductCardsListComponent;

  readonly productsContainer: Locator;
  readonly continueShoppingButton: Locator;
  readonly viewCartLink: Locator;

  constructor(page: Page) {
    super(page);

    this.searchComponent = new SearchComponent(page);
    this.productCardsList = new ProductCardsListComponent(page);

    this.productsContainer = page.locator('.features_items');
    this.continueShoppingButton = page.getByRole('button', { name: 'Continue Shopping' });
    this.viewCartLink = page.getByRole('link', { name: 'View Cart' });
  }

  async searchProducts(searchTerm: string): Promise<void> {
    await this.searchComponent.search(searchTerm);
  }

  /**
   * Facade: Add product to cart with post-action (continue shopping or view cart)
   * @param productName - The name of the product to add to cart
   * @param action - Post-addition action: 'continue' for continue shopping or 'viewCart' to view cart (default: 'continue')
   * @returns Promise<void>
   */
  async addProductToCart(
    productName: string,
    action: 'continue' | 'viewCart' = 'continue',
  ): Promise<void> {
    Logger.info(`Adding "${productName}" to cart with action: ${action}`);
    const productCard = this.productCardsList.getProductCardByName(productName);
    await productCard.addToCart();

    if (action === 'continue') {
      await this.continueShoppingButton.waitFor({ state: 'visible' });
      await this.continueShoppingButton.click();
    } else {
      await this.viewCartLink.waitFor({ state: 'visible' });
      await this.viewCartLink.click();
    }
  }

  /**
   * Add product to cart and continue shopping
   * @param productName - The name of the product to add
   * @returns Promise<void>
   */
  async addProductToCartAndContinue(productName: string): Promise<void> {
    await this.addProductToCart(productName, 'continue');
  }

  /**
   * Add product to cart and view cart page
   * @param productName - The name of the product to add
   * @returns Promise<void>
   */
  async addProductToCartAndViewCart(productName: string): Promise<void> {
    await this.addProductToCart(productName, 'viewCart');
  }

  async getProductNames(): Promise<string[]> {
    return await this.productCardsList.getAllProductNames();
  }

  async getProductCount(): Promise<number> {
    try {
      return await this.productCardsList.getProductCount();
    } catch {
      return 0;
    }
  }
}

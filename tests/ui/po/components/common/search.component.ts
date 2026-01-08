import type { Locator, Page } from '@playwright/test';
import { BaseComponent } from '../../base/baseComponent.component';
import { Logger } from '../../../../common/utils/logger.util';

/**
 * SearchComponent - Handles product search functionality
 * Extends BaseComponent for reusable search functionality
 */
export class SearchComponent extends BaseComponent {
  readonly searchInput: Locator;
  readonly searchButton: Locator;

  constructor(page: Page) {
    super(page);

    this.searchInput = page.getByRole('textbox', { name: 'Search Product' });
    this.searchButton = page.locator('button[id="submit_search"]');
  }

  /**
   * Perform product search
   * @param searchTerm - The search query to filter products
   * @returns Promise<void>
   */
  async search(searchTerm: string): Promise<void> {
    Logger.info(`Searching for products: "${searchTerm}"`);
    await this.searchInput.fill(searchTerm);
    await this.searchButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Clear search input field
   * @returns Promise<void>
   */
  async clearSearch(): Promise<void> {
    Logger.info('Clearing search input');
    await this.searchInput.clear();
  }

  /**
   * Get current search input value
   * @returns Promise<string> - The current value in the search input field
   */
  async getSearchValue(): Promise<string> {
    return (await this.searchInput.inputValue()) ?? '';
  }

  /**
   * Check if search input is visible
   * @returns Promise<boolean> - True if search input is visible, false otherwise
   */
  async isSearchInputVisible(): Promise<boolean> {
    return await this.isVisible(this.searchInput);
  }
}

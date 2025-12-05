import { Page, Locator } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly homeLink: Locator;
  readonly productsLink: Locator;
  readonly cartLink: Locator;
  readonly signupLoginLink: Locator;
  readonly testCasesLink: Locator;
  readonly apiTestingLink: Locator;
  readonly contactUsLink: Locator;
  readonly logoutLink: Locator;
  readonly deleteAccountLink: Locator;
  readonly featuredItems: Locator;
  readonly addToCartButtons: Locator;
  readonly viewProductLinks: Locator;
  readonly subscriptionSection: Locator;
  readonly subscriptionInput: Locator;
  readonly subscriptionButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.homeLink = page.getByRole('link', { name: 'Home' });
    this.productsLink = page.getByRole('link', { name: 'Products' });
    this.cartLink = page.getByRole('link', { name: 'Cart' });
    this.signupLoginLink = page.getByRole('link', { name: 'Signup / Login' });
    this.testCasesLink = page.getByRole('link', { name: 'Test Cases' });
    this.apiTestingLink = page.getByRole('link', { name: 'API Testing' });
    this.contactUsLink = page.getByRole('link', { name: 'Contact us' });
    this.logoutLink = page.getByRole('link', { name: 'Logout' });
    this.deleteAccountLink = page.getByRole('link', { name: 'Delete Account' });
    this.featuredItems = page.locator('.features_items .productinfo');
    this.addToCartButtons = page.locator('.add-to-cart');
    this.viewProductLinks = page.getByRole('link', { name: 'View Product' });
    this.subscriptionSection = page.locator('#subscribe');
    // Note: The ID 'susbscribe_email' matches the actual element ID on the website (typo in the source)
    this.subscriptionInput = page.locator('#susbscribe_email');
    this.subscriptionButton = page.locator('#subscribe');
  }

  async goto() {
    await this.page.goto('/');
  }

  async navigateToProducts() {
    await this.productsLink.click();
  }

  async navigateToCart() {
    await this.cartLink.click();
  }

  async navigateToSignupLogin() {
    await this.signupLoginLink.click();
  }

  async logout() {
    await this.logoutLink.click();
  }

  async deleteAccount() {
    await this.deleteAccountLink.click();
  }

  async addFirstProductToCart() {
    await this.addToCartButtons.first().click();
  }

  async viewFirstProduct() {
    await this.viewProductLinks.first().click();
  }

  async getProductCount(): Promise<number> {
    return await this.featuredItems.count();
  }

  async getProductNames(): Promise<string[]> {
    const productNames: string[] = [];
    const count = await this.featuredItems.count();

    for (let i = 0; i < count; i++) {
      const productName = await this.featuredItems.nth(i).locator('p').textContent();
      if (productName) {
        productNames.push(productName);
      }
    }

    return productNames;
  }

  async subscribeToNewsletter(email: string) {
    await this.subscriptionInput.fill(email);
    await this.subscriptionButton.click();
  }

  async isLoggedIn(): Promise<boolean> {
    return await this.logoutLink.isVisible();
  }

  async getLoggedInUsername(): Promise<string | null> {
    try {
      const usernameElement = this.page.locator('text=Logged in as');
      if (await usernameElement.isVisible()) {
        return await usernameElement.textContent();
      }
    } catch (error) {
      // User not logged in or element not found - intentionally ignored
      if (process.env.DEBUG) {
        console.log('getLoggedInUsername: User not logged in or element not found', error);
      }
    }
    return null;
  }
}

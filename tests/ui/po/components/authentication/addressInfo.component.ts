import type { Locator, Page } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { BaseComponent } from '../../base/baseComponent.component';

/**
 * AddressInfoComponent - Handles address information
 * Covers address, country, state, city, and zipcode
 */
export class AddressInfoComponent extends BaseComponent {
  readonly address1Input: Locator;
  readonly address2Input: Locator;
  readonly countrySelect: Locator;
  readonly stateInput: Locator;
  readonly cityInput: Locator;
  readonly zipcodeInput: Locator;

  constructor(page: Page, container: Locator) {
    super(page);

    this.address1Input = container.locator('#address1');
    this.address2Input = container.locator('#address2');
    this.countrySelect = container.locator('#country');
    this.stateInput = container.locator('#state');
    this.cityInput = container.locator('#city');
    this.zipcodeInput = container.locator('#zipcode');
  }

  /**
   * Fill address information
   * Selects random country from available dropdown options
   */
  async fillAddressInfo(addressData: {
    address1: string;
    address2?: string;
    country?: string;
    state: string;
    city: string;
    zipcode: string;
  }): Promise<void> {
    await this.address1Input.fill(addressData.address1);
    if (addressData.address2) {
      await this.address2Input.fill(addressData.address2);
    }

    const countryOptions = await this.countrySelect.locator('option').all();
    if (countryOptions.length > 0) {
      const randomIndex = faker.number.int({ min: 0, max: countryOptions.length - 1 });
      const selectedCountry = await countryOptions[randomIndex]?.getAttribute('value');
      if (selectedCountry) {
        await this.countrySelect.selectOption(selectedCountry);
      }
    }

    await this.stateInput.fill(addressData.state);
    await this.cityInput.fill(addressData.city);
    await this.zipcodeInput.fill(addressData.zipcode);
  }
}

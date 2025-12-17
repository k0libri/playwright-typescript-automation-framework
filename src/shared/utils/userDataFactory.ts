import { UserData } from '../data/types';

/**
 * User Data Factory - Generates unique test user data
 * Provides factory methods for creating realistic user data with unique identifiers
 */
export class UserDataFactory {
  /**
   * Generate unique email address with timestamp
   */
  static generateUniqueEmail(): string {
    const timestamp = Date.now();
    const randomSuffix = Math.floor(Math.random() * 1000);
    return `testuser_${timestamp}_${randomSuffix}@automation.test`;
  }

  /**
   * Generate complete user data with unique identifiers
   */
  static generateUserData(): UserData {
    const randomNum = Math.floor(Math.random() * 1000);
    const firstName = `TestFirst${randomNum}`;
    const lastName = `TestLast${randomNum}`;

    return {
      name: `${firstName} ${lastName}`,
      email: this.generateUniqueEmail(),
      password: 'TestPassword123!',
      title: 'Mr',
      birth_date: '15',
      birth_month: 'January',
      birth_year: '1990',
      firstname: firstName,
      lastname: lastName,
      company: `TestCompany${randomNum}`,
      address1: `${randomNum} Test Street`,
      address2: `Apartment ${randomNum}`,
      country: 'United States',
      zipcode: '12345',
      state: 'California',
      city: 'Los Angeles',
      mobile_number: `555${String(randomNum).padStart(7, '0')}`,
    };
  }

  /**
   * Generate invalid user data for negative testing
   */
  static generateInvalidUserData(): Partial<UserData> {
    return {
      email: 'invalid-email-format',
      password: '123',
      name: '',
      mobile_number: 'invalid-phone',
    };
  }

  static generateCompleteInvalidUserData(): UserData {
    return {
      name: '',
      email: 'invalid-email',
      password: '123',
      title: 'Mr',
      birth_date: '1',
      birth_month: 'January',
      birth_year: '1990',
      firstname: '',
      lastname: '',
      company: 'Test',
      address1: 'Test',
      country: 'US',
      zipcode: '12345',
      state: 'CA',
      city: 'LA',
      mobile_number: 'invalid',
    };
  }
}

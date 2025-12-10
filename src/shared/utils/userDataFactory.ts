/**
 * User Data Factory - Generates unique test user data
 * Provides factory methods for creating realistic user data with unique identifiers
 */

export interface UserData {
  name: string;
  email: string;
  password: string;
  title: string;
  birth_date: string;
  birth_month: string;
  birth_year: string;
  firstname: string;
  lastname: string;
  company: string;
  address1: string;
  address2?: string;
  country: string;
  zipcode: string;
  state: string;
  city: string;
  mobile_number: string;
}

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
      password: '123', // Too short
      name: '', // Empty name
      mobile_number: 'invalid-phone',
    };
  }
}

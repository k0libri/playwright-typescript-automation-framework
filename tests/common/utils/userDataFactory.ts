import { faker } from '@faker-js/faker';
import { UserData } from '../data/types';

/**
 * User Data Factory - Generates unique test user data
 * Provides factory methods for creating realistic user data with unique identifiers
 */
export class UserDataFactory {
  /**
   * Generate unique email address with UUID
   */
  static generateUniqueEmail(): string {
    const uniqueId = faker.string.uuid();
    const username = faker.internet.displayName().toLowerCase();
    return `${username}_${uniqueId}@automation.test`;
  }

  /**
   * Generate complete user data with unique identifiers
   */
  static generateUserData(): UserData {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const birthDate = faker.date.birthdate({ min: 18, max: 65, mode: 'age' });

    return {
      name: `${firstName} ${lastName}`,
      email: this.generateUniqueEmail(),
      password: faker.internet.password({
        length: 12,
        memorable: false,
        pattern: /[A-Za-z0-9!@#$]/,
      }),
      title: faker.helpers.arrayElement(['Mr', 'Mrs']),
      birth_date: birthDate.getDate().toString(),
      birth_month: birthDate.toLocaleString('en-US', { month: 'long' }),
      birth_year: birthDate.getFullYear().toString(),
      firstname: firstName,
      lastname: lastName,
      company: faker.company.name(),
      address1: faker.location.streetAddress(),
      address2: faker.location.secondaryAddress(),
      country: 'India',
      zipcode: faker.location.zipCode(),
      state: faker.location.state(),
      city: faker.location.city(),
      mobile_number: faker.phone.number(),
    };
  }

  /**
   * Generate invalid user data for negative testing
   */
  static generateInvalidUserData(): Partial<UserData> {
    return {
      email: faker.lorem.word(),
      password: faker.string.alphanumeric(3),
      name: '',
      mobile_number: faker.lorem.word(),
    };
  }

  static generateCompleteInvalidUserData(): UserData {
    return {
      name: '',
      email: faker.lorem.word(),
      password: faker.string.alphanumeric(3),
      title: 'Mr',
      birth_date: '1',
      birth_month: 'January',
      birth_year: '1990',
      firstname: '',
      lastname: '',
      company: faker.lorem.word(),
      address1: faker.lorem.word(),
      country: faker.location.countryCode(),
      zipcode: faker.location.zipCode(),
      state: faker.location.state({ abbreviated: true }),
      city: faker.location.city(),
      mobile_number: faker.lorem.word(),
    };
  }
}

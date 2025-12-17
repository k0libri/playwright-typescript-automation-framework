export interface User {
  id?: number;
  name: string;
  email: string;
  password?: string;
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
}

export class UserFactory {
  static createValidUser(email?: string): User {
    const timestamp = Date.now();
    return {
      name: 'John Doe',
      email: email || `user${timestamp}@example.com`,
      password: 'password123',
      title: 'Mr',
      birth_date: '15',
      birth_month: 'January',
      birth_year: '1990',
      firstname: 'John',
      lastname: 'Doe',
      company: 'Test Company',
      address1: '123 Test Street',
      address2: 'Apartment 1',
      country: 'United States',
      zipcode: '12345',
      state: 'California',
      city: 'Los Angeles',
      mobile_number: '1234567890',
    };
  }

  static createRandomUser(): User {
    const timestamp = Date.now();
    const randomId = Math.floor(Math.random() * 1000);

    return {
      name: `User${randomId}`,
      email: `testuser${timestamp}@test${randomId}.com`,
      password: 'password123',
      title: 'Mr',
      birth_date: '15',
      birth_month: 'January',
      birth_year: '1990',
      firstname: `FirstName${randomId}`,
      lastname: `LastName${randomId}`,
      company: `Company${randomId}`,
      address1: `${randomId} Test Street`,
      address2: 'Suite 100',
      country: 'United States',
      zipcode: '12345',
      state: 'California',
      city: 'San Francisco',
      mobile_number: `123456${randomId.toString().padStart(4, '0')}`,
    };
  }

  static createUserWithEmail(email: string): User {
    const baseUser = this.createValidUser();
    return {
      ...baseUser,
      email: email,
    };
  }

  static createInvalidUser(): User {
    return {
      name: '',
      email: 'invalid-email',
      password: '',
    };
  }
}

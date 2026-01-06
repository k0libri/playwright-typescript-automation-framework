import { faker } from '@faker-js/faker';
import { PaymentData } from '../data/types';

/**
 * Payment Data Factory - Generates test payment data
 * Provides factory methods for creating valid payment information for testing
 */
export class PaymentDataFactory {
  /**
   * Generate valid test payment data
   */
  static generatePaymentData(): PaymentData {
    const currentYear = new Date().getFullYear();

    return {
      nameOnCard: faker.person.fullName(),
      cardNumber: '4111111111111111', // Visa test card number
      cvc: faker.finance.creditCardCVV(),
      expiryMonth: faker.number.int({ min: 1, max: 12 }).toString().padStart(2, '0'),
      expiryYear: (currentYear + faker.number.int({ min: 1, max: 5 })).toString(),
    };
  }

  /**
   * Generate invalid payment data for negative testing
   */
  static generateInvalidPaymentData(): Partial<PaymentData> {
    return {
      nameOnCard: '',
      cardNumber: faker.string.numeric(4),
      cvc: faker.string.numeric(2),
      expiryMonth: '13',
      expiryYear: faker.date.past({ years: 5 }).getFullYear().toString(),
    };
  }
}

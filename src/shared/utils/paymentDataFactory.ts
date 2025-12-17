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
      nameOnCard: 'Test User',
      cardNumber: '4111111111111111', // Visa test card number
      cvc: '123',
      expiryMonth: '12',
      expiryYear: (currentYear + 2).toString(),
    };
  }

  /**
   * Generate invalid payment data for negative testing
   */
  static generateInvalidPaymentData(): Partial<PaymentData> {
    return {
      nameOnCard: '',
      cardNumber: '1234', // Too short
      cvc: '12', // Too short
      expiryMonth: '13', // Invalid month
      expiryYear: '2020', // Past year
    };
  }
}

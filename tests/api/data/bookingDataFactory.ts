import type { Booking, BookingDates } from '../data/types';

/**
 * BookingDataFactory - Generates test data for booking API tests
 * Provides random, unique booking data to avoid conflicts
 */
export class BookingDataFactory {
  /**
   * Generate random booking dates (checkin today, checkout in 7 days)
   */
  static generateBookingDates(): BookingDates {
    const today = new Date();
    const checkin = today.toISOString().split('T')[0] ?? '';

    const checkout = new Date(today);
    checkout.setDate(today.getDate() + 7);
    const checkoutDate = checkout.toISOString().split('T')[0] ?? '';

    return {
      checkin,
      checkout: checkoutDate,
    };
  }

  /**
   * Generate complete booking data with randomized values
   */
  static generateBooking(overrides?: Partial<Booking>): Booking {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);

    return {
      firstname: `Test${timestamp}`,
      lastname: `User${random}`,
      totalprice: Math.floor(Math.random() * 500) + 100,
      depositpaid: true,
      bookingdates: this.generateBookingDates(),
      additionalneeds: 'Breakfast',
      ...overrides,
    };
  }

  /**
   * Generate booking data for update scenarios
   */
  static generateUpdatedBooking(original: Booking): Booking {
    const PRICE_INCREASE = 50;
    return {
      ...original,
      totalprice: original.totalprice + PRICE_INCREASE,
      additionalneeds: 'Breakfast and Lunch',
    };
  }
}

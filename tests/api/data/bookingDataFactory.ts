import { faker } from '@faker-js/faker';
import type { Booking, BookingDates } from '../data/types';

/**
 * Booking validation constants
 */
export const BOOKING_VALIDATION = {
  MIN_BOOKING_IDS_COUNT: 0,
} as const;

/**
 * BookingDataFactory - Generates test data for booking API tests
 * Provides random, unique booking data to avoid conflicts
 */
export class BookingDataFactory {
  /**
   * Generate random booking dates (checkin today, checkout in 7 days)
   * @returns BookingDates - Object with checkin and checkout dates in YYYY-MM-DD format
   */
  static generateBookingDates(): BookingDates {
    const checkin = faker.date.soon({ days: 1 }).toISOString().split('T')[0] ?? '';
    const checkout =
      faker.date.soon({ days: 8, refDate: checkin }).toISOString().split('T')[0] ?? '';

    return {
      checkin,
      checkout,
    };
  }

  /**
   * Generate complete booking data with randomized values
   * @param overrides - Optional partial booking data to override default generated values
   * @returns Booking - Complete booking object with random guest information and dates
   */
  static generateBooking(overrides?: Partial<Booking>): Booking {
    return {
      firstname: faker.person.firstName(),
      lastname: faker.person.lastName(),
      totalprice: faker.number.int({ min: 100, max: 600 }),
      depositpaid: faker.datatype.boolean(),
      bookingdates: this.generateBookingDates(),
      additionalneeds: faker.helpers.arrayElement([
        'Breakfast',
        'Lunch',
        'Parking',
        'Late Checkout',
        'Extra Bed',
      ]),
      ...overrides,
    };
  }

  /**
   * Generate booking data for update scenarios
   * @param original - The original booking object to base updates on
   * @returns Booking - Updated booking with increased price and changed additional needs
   */
  static generateUpdatedBooking(original: Booking): Booking {
    const PRICE_INCREASE = 50;
    return {
      ...original,
      totalprice: original.totalprice + PRICE_INCREASE,
      additionalneeds: faker.helpers.arrayElement([
        'Breakfast and Lunch',
        'Dinner and Breakfast',
        'All Meals Included',
      ]),
    };
  }

  /**
   * Generate partial booking update (only firstname and lastname)
   * @returns Partial<Booking> - Partial booking object containing only updated first and last names
   */
  static generatePartialUpdate(): Partial<Booking> {
    return {
      firstname: faker.person.firstName(),
      lastname: faker.person.lastName(),
    };
  }

  /**
   * Generate a non-existent booking ID for negative testing
   * @returns number - Random booking ID in range 900000000-999999999 (unlikely to exist)
   */
  static generateNonExistentBookingId(): number {
    return faker.number.int({ min: 900000000, max: 999999999 });
  }
}

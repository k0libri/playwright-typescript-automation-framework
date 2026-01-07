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
   */
  static generatePartialUpdate(): Partial<Booking> {
    return {
      firstname: faker.person.firstName(),
      lastname: faker.person.lastName(),
    };
  }

  /**
   * Generate a non-existent booking ID for negative testing
   */
  static generateNonExistentBookingId(): number {
    return faker.number.int({ min: 900000000, max: 999999999 });
  }
}

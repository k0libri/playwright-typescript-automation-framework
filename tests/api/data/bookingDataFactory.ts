import { faker } from '@faker-js/faker';
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
      additionalneeds: 'Breakfast and Lunch',
    };
  }
}

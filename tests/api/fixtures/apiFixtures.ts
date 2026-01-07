import { test as baseTest } from '@playwright/test';
import { AuthService } from '../clients/auth.service';
import { BookingService } from '../clients/booking.service';
import type { Booking, AuthCredentials } from '../data/types';
import { BookingDataFactory } from '../data/bookingDataFactory';

const RESTFUL_BOOKER_BASE_URL =
  process.env['RESTFUL_BOOKER_BASE_URL'] ?? 'https://restful-booker.herokuapp.com';

/**
 * Standalone API Test Fixtures
 * Provides service classes and test data for restful-booker API testing
 */
export interface StandaloneAPIFixtures {
  authService: AuthService;
  bookingService: BookingService;
  authToken: string;
  defaultCredentials: AuthCredentials;
  uniqueBooking: Booking;
}

export const test = baseTest.extend<StandaloneAPIFixtures>({
  authService: async ({ request }, use) => {
    await use(new AuthService(request, RESTFUL_BOOKER_BASE_URL));
  },

  bookingService: async ({ request }, use) => {
    await use(new BookingService(request, RESTFUL_BOOKER_BASE_URL));
  },

  defaultCredentials: async ({ request: _request }, use) => {
    await use({
      username: 'admin',
      password: 'password123',
    });
  },

  authToken: async ({ authService, defaultCredentials }, use) => {
    const response = await authService.createToken(defaultCredentials);
    const token = await authService.getTokenFromResponse(response);
    await use(token);
  },

  uniqueBooking: async ({ request: _request }, use) => {
    await use(BookingDataFactory.generateBooking());
  },
});

export { expect } from '@playwright/test';

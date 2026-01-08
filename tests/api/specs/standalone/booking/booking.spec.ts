import { test, expect } from '../../../fixtures/apiFixtures';
import { StatusCodes } from 'http-status-codes';
import { BookingDataFactory, BOOKING_VALIDATION } from '../../../data/bookingDataFactory';
import { ServiceFactory } from '../../../factories/serviceFactory';

/**
 * Booking API Tests - CRUD operations
 * Covers all user stories for booking management
 */
test.describe('Booking API @api @standalone @critical', () => {
  test.describe('Positive Test Cases @smoke', () => {
    let sharedBooking: ReturnType<typeof BookingDataFactory.generateBooking>;
    let sharedBookingId: number;
    let authToken: string;

    test.beforeAll(async ({ authService, defaultCredentials }) => {
      sharedBooking = BookingDataFactory.generateBooking();

      const createResponse = await ServiceFactory.booking.createBooking(sharedBooking);
      const createBody = await createResponse.json();
      sharedBookingId = createBody.bookingid;

      const authResponse = await authService.createToken(defaultCredentials);
      const authBody = await authResponse.json();
      authToken = authBody.token;
    });

    test.afterAll(async () => {
      if (sharedBookingId && authToken) {
        await ServiceFactory.booking.deleteBooking(sharedBookingId, authToken);
      }
    });

    test('should create a new booking and verify details', async ({
      bookingService,
      uniqueBooking,
    }) => {
      const response = await bookingService.createBooking(uniqueBooking);

      expect.soft(response.status()).toBe(StatusCodes.OK);

      const responseBody = await response.json();
      const createdBookingId = responseBody.bookingid;

      expect.soft(responseBody.booking.firstname).toBe(uniqueBooking.firstname);
      expect.soft(responseBody.booking.lastname).toBe(uniqueBooking.lastname);
      expect.soft(responseBody.booking.totalprice).toBe(uniqueBooking.totalprice);
      expect.soft(responseBody.booking.depositpaid).toBe(uniqueBooking.depositpaid);
      expect
        .soft(responseBody.booking.bookingdates.checkin)
        .toBe(uniqueBooking.bookingdates.checkin);
      expect(responseBody.booking.bookingdates.checkout).toBe(uniqueBooking.bookingdates.checkout);

      const getResponse = await bookingService.getBookingById(createdBookingId);

      expect.soft(getResponse.status()).toBe(StatusCodes.OK);

      const bookingData = await getResponse.json();
      expect.soft(bookingData.firstname).toBe(uniqueBooking.firstname);
      expect.soft(bookingData.lastname).toBe(uniqueBooking.lastname);
      expect(bookingData.totalprice).toBe(uniqueBooking.totalprice);
    });

    test('should retrieve all booking IDs', async ({ bookingService }) => {
      const response = await bookingService.getAllBookingIds();

      expect.soft(response.status()).toBe(StatusCodes.OK);

      const bookingIds = await response.json();
      expect.soft(Array.isArray(bookingIds)).toBe(true);
      expect(bookingIds.length).toBeGreaterThan(BOOKING_VALIDATION.MIN_BOOKING_IDS_COUNT);
    });

    test('should filter bookings by name using shared booking', async ({ bookingService }) => {
      const response = await bookingService.getAllBookingIds({
        firstname: sharedBooking.firstname,
      });

      expect.soft(response.status()).toBe(StatusCodes.OK);

      const bookingIds = await response.json();
      expect.soft(Array.isArray(bookingIds)).toBe(true);

      const foundBooking = bookingIds.find(
        (b: { bookingid: number }) => b.bookingid === sharedBookingId,
      );
      expect(foundBooking).toBeDefined();
    });

    test('should update an existing booking', async ({
      bookingService,
      uniqueBooking,
      authToken,
    }) => {
      const createResponse = await bookingService.createBooking(uniqueBooking);
      const createBody = await createResponse.json();
      const createdBookingId = createBody.bookingid;

      const updatedBooking = BookingDataFactory.generateUpdatedBooking(uniqueBooking);

      const response = await bookingService.updateBooking(
        createdBookingId,
        updatedBooking,
        authToken,
      );

      expect.soft(response.status()).toBe(StatusCodes.OK);

      const updatedData = await response.json();
      expect.soft(updatedData.totalprice).toBe(updatedBooking.totalprice);
      expect(updatedData.additionalneeds).toBe(updatedBooking.additionalneeds);

      const getResponse = await bookingService.getBookingById(createdBookingId);
      const bookingData = await getResponse.json();

      expect.soft(bookingData.totalprice).toBe(updatedBooking.totalprice);
      expect(bookingData.additionalneeds).toBe(updatedBooking.additionalneeds);
    });

    test('should partially update a booking', async ({
      bookingService,
      uniqueBooking,
      authToken,
    }) => {
      const createResponse = await bookingService.createBooking(uniqueBooking);
      const createBody = await createResponse.json();
      const createdBookingId = createBody.bookingid;

      const partialUpdate = BookingDataFactory.generatePartialUpdate();

      const response = await bookingService.partialUpdateBooking(
        createdBookingId,
        partialUpdate,
        authToken,
      );

      expect.soft(response.status()).toBe(StatusCodes.OK);

      const updatedData = await response.json();
      expect.soft(updatedData.firstname).toBe(partialUpdate.firstname);
      expect.soft(updatedData.lastname).toBe(partialUpdate.lastname);
      expect(updatedData.totalprice).toBe(uniqueBooking.totalprice);
    });

    test('should delete a booking and verify deletion', async ({
      bookingService,
      uniqueBooking,
      authToken,
    }) => {
      const createResponse = await bookingService.createBooking(uniqueBooking);
      expect.soft(createResponse.status()).toBe(StatusCodes.OK);

      const createBody = await createResponse.json();
      expect.soft(createBody.bookingid).toBeDefined();
      const createdBookingId = createBody.bookingid;

      const response = await bookingService.deleteBooking(createdBookingId, authToken);

      expect.soft(response.status()).toBe(StatusCodes.CREATED);

      const getResponse = await bookingService.getBookingById(createdBookingId);

      expect(getResponse.status()).toBe(StatusCodes.NOT_FOUND);
    });
  });

  test.describe('Negative Test Cases @negative', () => {
    test('should reject update without authentication token', async ({
      bookingService,
      uniqueBooking,
    }) => {
      const createResponse = await bookingService.createBooking(uniqueBooking);
      const createBody = await createResponse.json();
      const createdBookingId = createBody.bookingid;

      const updatedBooking = BookingDataFactory.generateUpdatedBooking(uniqueBooking);

      const response = await bookingService.updateBooking(createdBookingId, updatedBooking);

      expect(response.status()).toBe(StatusCodes.FORBIDDEN);
    });

    test('should reject delete without authentication token', async ({
      bookingService,
      uniqueBooking,
    }) => {
      const createResponse = await bookingService.createBooking(uniqueBooking);
      const createBody = await createResponse.json();
      const createdBookingId = createBody.bookingid;

      const response = await bookingService.deleteBooking(createdBookingId);

      expect(response.status()).toBe(StatusCodes.FORBIDDEN);
    });

    test('should return 404 for non-existent booking', async ({ bookingService }) => {
      const nonExistentId = BookingDataFactory.generateNonExistentBookingId();
      const response = await bookingService.getBookingById(nonExistentId);

      expect(response.status()).toBe(StatusCodes.NOT_FOUND);
    });
  });
});

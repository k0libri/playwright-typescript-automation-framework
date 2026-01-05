import { test, expect } from '../../../apiFixtures';
import { StatusCodes } from 'http-status-codes';
import { BookingDataFactory } from '../../../data/bookingDataFactory';

/**
 * Booking API Tests - CRUD operations
 * Covers all user stories for booking management
 */
test.describe('Booking API @api @standalone @critical', () => {
  let createdBookingId: number;

  test.beforeAll(async () => {
    console.log('Starting Booking API test suite');
  });

  /**
   * User Story: As a tester, I want to create a new booking
   * and verify the booking details via GET requests
   */
  test('should create a new booking and verify details', async ({
    bookingService,
    uniqueBooking,
  }) => {
    await test.step('Create a new booking', async () => {
      const response = await bookingService.createBooking(uniqueBooking);

      expect(response.status()).toBe(StatusCodes.OK);

      const responseBody = await response.json();
      expect(responseBody).toHaveProperty('bookingid');
      expect(responseBody).toHaveProperty('booking');

      createdBookingId = responseBody.bookingid;

      expect(responseBody.booking.firstname).toBe(uniqueBooking.firstname);
      expect(responseBody.booking.lastname).toBe(uniqueBooking.lastname);
      expect(responseBody.booking.totalprice).toBe(uniqueBooking.totalprice);
      expect(responseBody.booking.depositpaid).toBe(uniqueBooking.depositpaid);
      expect(responseBody.booking.bookingdates.checkin).toBe(uniqueBooking.bookingdates.checkin);
      expect(responseBody.booking.bookingdates.checkout).toBe(uniqueBooking.bookingdates.checkout);
    });

    await test.step('Verify booking details via GET request', async () => {
      const response = await bookingService.getBookingById(createdBookingId);

      expect(response.status()).toBe(StatusCodes.OK);

      const bookingData = await response.json();
      expect(bookingData.firstname).toBe(uniqueBooking.firstname);
      expect(bookingData.lastname).toBe(uniqueBooking.lastname);
      expect(bookingData.totalprice).toBe(uniqueBooking.totalprice);
    });
  });

  test('should retrieve all booking IDs', async ({ bookingService }) => {
    await test.step('Get all booking IDs', async () => {
      const response = await bookingService.getAllBookingIds();

      expect(response.status()).toBe(StatusCodes.OK);

      const bookingIds = await response.json();
      expect(Array.isArray(bookingIds)).toBe(true);
      expect(bookingIds.length).toBeGreaterThan(0);
      expect(bookingIds[0]).toHaveProperty('bookingid');
    });
  });

  test('should filter bookings by name', async ({ bookingService, uniqueBooking }) => {
    await test.step('Create a booking with unique name', async () => {
      const createResponse = await bookingService.createBooking(uniqueBooking);
      const createBody = await createResponse.json();
      createdBookingId = createBody.bookingid;
    });

    await test.step('Filter bookings by firstname', async () => {
      const response = await bookingService.getAllBookingIds({
        firstname: uniqueBooking.firstname,
      });

      expect(response.status()).toBe(StatusCodes.OK);

      const bookingIds = await response.json();
      expect(Array.isArray(bookingIds)).toBe(true);

      const foundBooking = bookingIds.find(
        (b: { bookingid: number }) => b.bookingid === createdBookingId,
      );
      expect(foundBooking).toBeDefined();
    });
  });

  /**
   * User Story: As a tester, I want to update an existing booking
   * and validate the changes
   */
  test('should update an existing booking', async ({
    bookingService,
    uniqueBooking,
    authToken,
  }) => {
    await test.step('Create a booking to update', async () => {
      const createResponse = await bookingService.createBooking(uniqueBooking);
      const createBody = await createResponse.json();
      createdBookingId = createBody.bookingid;
    });

    await test.step('Update the booking', async () => {
      const updatedBooking = BookingDataFactory.generateUpdatedBooking(uniqueBooking);

      const response = await bookingService.updateBooking(
        createdBookingId,
        updatedBooking,
        authToken,
      );

      expect(response.status()).toBe(StatusCodes.OK);

      const updatedData = await response.json();
      expect(updatedData.totalprice).toBe(updatedBooking.totalprice);
      expect(updatedData.additionalneeds).toBe(updatedBooking.additionalneeds);
    });

    await test.step('Verify the booking was updated', async () => {
      const getResponse = await bookingService.getBookingById(createdBookingId);
      const bookingData = await getResponse.json();

      expect(bookingData.totalprice).toBe(uniqueBooking.totalprice + 50);
      expect(bookingData.additionalneeds).toBe('Breakfast and Lunch');
    });
  });

  test('should partially update a booking', async ({
    bookingService,
    uniqueBooking,
    authToken,
  }) => {
    await test.step('Create a booking to partially update', async () => {
      const createResponse = await bookingService.createBooking(uniqueBooking);
      const createBody = await createResponse.json();
      createdBookingId = createBody.bookingid;
    });

    await test.step('Partially update the booking', async () => {
      const partialUpdate = {
        firstname: 'UpdatedFirstName',
        lastname: 'UpdatedLastName',
      };

      const response = await bookingService.partialUpdateBooking(
        createdBookingId,
        partialUpdate,
        authToken,
      );

      expect(response.status()).toBe(StatusCodes.OK);

      const updatedData = await response.json();
      expect(updatedData.firstname).toBe('UpdatedFirstName');
      expect(updatedData.lastname).toBe('UpdatedLastName');
      expect(updatedData.totalprice).toBe(uniqueBooking.totalprice);
    });
  });

  /**
   * User Story: As a tester, I want to delete a booking
   * and confirm it is no longer retrievable
   */
  test('should delete a booking and verify deletion', async ({
    bookingService,
    uniqueBooking,
    authToken,
  }) => {
    await test.step('Create a booking to delete', async () => {
      const createResponse = await bookingService.createBooking(uniqueBooking);
      const createBody = await createResponse.json();
      createdBookingId = createBody.bookingid;
    });

    await test.step('Delete the booking', async () => {
      const response = await bookingService.deleteBooking(createdBookingId, authToken);

      expect(response.status()).toBe(StatusCodes.CREATED);
    });

    await test.step('Verify the booking was deleted', async () => {
      const getResponse = await bookingService.getBookingById(createdBookingId);

      expect(getResponse.status()).toBe(StatusCodes.NOT_FOUND);
    });
  });

  /**
   * User Story: As a tester, I want to verify that unauthorized requests
   * are rejected with appropriate error codes
   */
  test('should reject update without authentication token', async ({
    bookingService,
    uniqueBooking,
  }) => {
    await test.step('Create a booking', async () => {
      const createResponse = await bookingService.createBooking(uniqueBooking);
      const createBody = await createResponse.json();
      createdBookingId = createBody.bookingid;
    });

    await test.step('Attempt to update without token', async () => {
      const updatedBooking = BookingDataFactory.generateUpdatedBooking(uniqueBooking);

      const response = await bookingService.updateBooking(createdBookingId, updatedBooking, '');

      expect(response.status()).toBe(StatusCodes.FORBIDDEN);
    });
  });

  test('should reject delete without authentication token', async ({
    bookingService,
    uniqueBooking,
  }) => {
    await test.step('Create a booking', async () => {
      const createResponse = await bookingService.createBooking(uniqueBooking);
      const createBody = await createResponse.json();
      createdBookingId = createBody.bookingid;
    });

    await test.step('Attempt to delete without token', async () => {
      const response = await bookingService.deleteBooking(createdBookingId, '');

      expect(response.status()).toBe(StatusCodes.FORBIDDEN);
    });
  });

  test('should return 404 for non-existent booking', async ({ bookingService }) => {
    await test.step('Request non-existent booking', async () => {
      const nonExistentId = 999999999;
      const response = await bookingService.getBookingById(nonExistentId);

      expect(response.status()).toBe(StatusCodes.NOT_FOUND);
    });
  });
});

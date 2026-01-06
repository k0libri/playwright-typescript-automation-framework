import { test, expect } from '../../../apiFixtures';
import { StatusCodes } from 'http-status-codes';
import { BookingDataFactory } from '../../../data/bookingDataFactory';

/**
 * Booking API Tests - CRUD operations
 * Covers all user stories for booking management
 */
test.describe('Booking API @api @standalone @critical', () => {
  let createdBookingId: number;

  /**
   * User Story: As a tester, I want to create a new booking
   * and verify the booking details via GET requests
   */
  test('should create a new booking and verify details', async ({
    bookingService,
    uniqueBooking,
  }) => {
    const response = await bookingService.createBooking(uniqueBooking);

    expect.soft(response.status()).toBe(StatusCodes.OK);

    const responseBody = await response.json();
    expect.soft(responseBody).toHaveProperty('bookingid');
    expect.soft(responseBody).toHaveProperty('booking');

    createdBookingId = responseBody.bookingid;

    expect.soft(responseBody.booking.firstname).toBe(uniqueBooking.firstname);
    expect.soft(responseBody.booking.lastname).toBe(uniqueBooking.lastname);
    expect.soft(responseBody.booking.totalprice).toBe(uniqueBooking.totalprice);
    expect.soft(responseBody.booking.depositpaid).toBe(uniqueBooking.depositpaid);
    expect.soft(responseBody.booking.bookingdates.checkin).toBe(uniqueBooking.bookingdates.checkin);
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
    expect.soft(bookingIds.length).toBeGreaterThan(0);
    expect(bookingIds[0]).toHaveProperty('bookingid');
  });

  test('should filter bookings by name', async ({ bookingService, uniqueBooking }) => {
    const createResponse = await bookingService.createBooking(uniqueBooking);
    const createBody = await createResponse.json();
    createdBookingId = createBody.bookingid;

    const response = await bookingService.getAllBookingIds({
      firstname: uniqueBooking.firstname,
    });

    expect.soft(response.status()).toBe(StatusCodes.OK);

    const bookingIds = await response.json();
    expect.soft(Array.isArray(bookingIds)).toBe(true);

    const foundBooking = bookingIds.find(
      (b: { bookingid: number }) => b.bookingid === createdBookingId,
    );
    expect(foundBooking).toBeDefined();
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
    const createResponse = await bookingService.createBooking(uniqueBooking);
    const createBody = await createResponse.json();
    createdBookingId = createBody.bookingid;

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

    expect.soft(bookingData.totalprice).toBe(uniqueBooking.totalprice + 50);
    expect(bookingData.additionalneeds).toBe('Breakfast and Lunch');
  });

  test('should partially update a booking', async ({
    bookingService,
    uniqueBooking,
    authToken,
  }) => {
    const createResponse = await bookingService.createBooking(uniqueBooking);
    const createBody = await createResponse.json();
    createdBookingId = createBody.bookingid;

    const partialUpdate = {
      firstname: 'UpdatedFirstName',
      lastname: 'UpdatedLastName',
    };

    const response = await bookingService.partialUpdateBooking(
      createdBookingId,
      partialUpdate,
      authToken,
    );

    expect.soft(response.status()).toBe(StatusCodes.OK);

    const updatedData = await response.json();
    expect.soft(updatedData.firstname).toBe('UpdatedFirstName');
    expect.soft(updatedData.lastname).toBe('UpdatedLastName');
    expect(updatedData.totalprice).toBe(uniqueBooking.totalprice);
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
    const createResponse = await bookingService.createBooking(uniqueBooking);
    const createBody = await createResponse.json();
    createdBookingId = createBody.bookingid;

    const response = await bookingService.deleteBooking(createdBookingId, authToken);

    expect(response.status()).toBe(StatusCodes.CREATED);

    const getResponse = await bookingService.getBookingById(createdBookingId);

    expect(getResponse.status()).toBe(StatusCodes.NOT_FOUND);
  });

  /**
   * User Story: As a tester, I want to verify that unauthorized requests
   * are rejected with appropriate error codes
   */
  test('should reject update without authentication token', async ({
    bookingService,
    uniqueBooking,
  }) => {
    const createResponse = await bookingService.createBooking(uniqueBooking);
    const createBody = await createResponse.json();
    createdBookingId = createBody.bookingid;

    const updatedBooking = BookingDataFactory.generateUpdatedBooking(uniqueBooking);

    const response = await bookingService.updateBooking(createdBookingId, updatedBooking, '');

    expect(response.status()).toBe(StatusCodes.FORBIDDEN);
  });

  test('should reject delete without authentication token', async ({
    bookingService,
    uniqueBooking,
  }) => {
    const createResponse = await bookingService.createBooking(uniqueBooking);
    const createBody = await createResponse.json();
    createdBookingId = createBody.bookingid;

    const response = await bookingService.deleteBooking(createdBookingId, '');

    expect(response.status()).toBe(StatusCodes.FORBIDDEN);
  });

  test('should return 404 for non-existent booking', async ({ bookingService }) => {
    const nonExistentId = 999999999;
    const response = await bookingService.getBookingById(nonExistentId);

    expect(response.status()).toBe(StatusCodes.NOT_FOUND);
  });
});

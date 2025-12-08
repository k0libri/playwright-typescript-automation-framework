import { test, expect, request } from '@playwright/test';
import { TestInfo } from '@playwright/test';
import { BookingService } from '../../services/bookingService';
import { buildBookingData } from '../../utils/dataBuilder';
import { testUser, apiEndpoints } from '../../config/test-data';


let token: string;
let bookingService: BookingService;

test.afterEach(async ({}, testInfo: TestInfo) => {
  if (testInfo.status === 'passed') {
    console.log(`✅ Test passed: ${testInfo.title}`);
  }
});

test.beforeAll(async ({ playwright }) => {
  const apiRequest = await playwright.request.newContext();
  const response = await apiRequest.post(apiEndpoints.auth, {
    data: { username: testUser.username, password: testUser.password },
  });
  token = (await response.json()).token;
  bookingService = new BookingService(apiRequest, token);
});

test('should create a booking', async () => {
  const bookingData = buildBookingData();
  const response = await bookingService.createBooking(bookingData);
  expect(response.ok()).toBeTruthy();
  const body = await response.json();
  expect(body).toHaveProperty('bookingid');
});

test('should get a booking by id', async () => {
  const bookingData = buildBookingData();
  const createRes = await bookingService.createBooking(bookingData);
  const bookingId = (await createRes.json()).bookingid;
  const getRes = await bookingService.getBooking(bookingId);
  expect(getRes.ok()).toBeTruthy();
  const booking = await getRes.json();
  expect(booking.firstName).toBe(bookingData.firstName);
});

test('should fail unauthorized booking creation', async ({ playwright }) => {
  const apiRequest = await playwright.request.newContext();
  const bookingServiceNoAuth = new BookingService(apiRequest, '');
  const bookingData = buildBookingData();
  const response = await bookingServiceNoAuth.createBooking(bookingData);
  expect(response.status()).toBe(401);

test('should update a booking', async () => {
  // Create a booking first
  const bookingData = buildBookingData();
  const createRes = await bookingService.createBooking(bookingData);
  const bookingId = (await createRes.json()).bookingid;

  // Prepare updated data
  const updatedData = buildBookingData({
    firstName: 'Jane',
    lastName: 'Smith',
    totalPrice: 150,
    depositPaid: false,
    additionalNeeds: 'Lunch',
  });

  // Update the booking
  const updateRes = await bookingService.updateBooking(bookingId, updatedData);
  expect(updateRes.ok()).toBeTruthy();

  // Verify the update
  const getRes = await bookingService.getBooking(bookingId);
  const booking = await getRes.json();
  expect(booking.firstName).toBe('Jane');
  expect(booking.lastName).toBe('Smith');
  expect(booking.totalPrice).toBe(150);
  expect(booking.depositPaid).toBe(false);
  expect(booking.additionalNeeds).toBe('Lunch');
});
});

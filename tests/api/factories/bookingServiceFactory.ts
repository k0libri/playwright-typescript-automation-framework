import type { Booking } from '../data/types';
import {
  buildCreateBookingPayload,
  buildUpdateBookingPayload,
  buildPartialUpdatePayload,
  buildBookingFilterParams,
} from '../data/bookingPayloads';

const API_BASE_URL =
  process.env['RESTFUL_BOOKER_BASE_URL'] ?? 'https://restful-booker.herokuapp.com';

/**
 * BookingServiceFactory - Native fetch-based booking service for use in beforeAll/afterAll hooks
 */
export const BookingServiceFactory = {
  /**
   * Create a new booking
   * @param bookingData - Booking object containing guest details, dates, and pricing information
   * @returns Promise<Response> - Fetch Response object with created booking details and ID
   */
  async createBooking(bookingData: Booking): Promise<Response> {
    const payload = buildCreateBookingPayload(bookingData);

    return fetch(`${API_BASE_URL}/booking`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  },

  /**
   * Get booking details by ID
   * @param bookingId - The unique identifier of the booking to retrieve
   * @returns Promise<Response> - Fetch Response object containing booking details
   */
  async getBookingById(bookingId: number): Promise<Response> {
    return fetch(`${API_BASE_URL}/booking/${bookingId}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });
  },

  /**
   * Get all booking IDs with optional filtering
   * @param params - Optional filter parameters (firstname, lastname, checkin, checkout dates)
   * @returns Promise<Response> - Fetch Response object with array of booking IDs
   */
  async getAllBookingIds(params?: {
    firstname?: string;
    lastname?: string;
    checkin?: string;
    checkout?: string;
  }): Promise<Response> {
    const queryParams = params ? buildBookingFilterParams(params) : {};
    const queryString = new URLSearchParams(
      Object.entries(queryParams).reduce(
        (acc, [key, value]) => {
          if (value !== undefined) {
            acc[key] = String(value);
          }
          return acc;
        },
        {} as Record<string, string>,
      ),
    ).toString();

    const url = queryString ? `${API_BASE_URL}/booking?${queryString}` : `${API_BASE_URL}/booking`;

    return fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });
  },

  /**
   * Update an existing booking (full update)
   * @param bookingId - The unique identifier of the booking to update
   * @param bookingData - Complete booking data object with all fields
   * @param token - Authentication token for authorization
   * @returns Promise<Response> - Fetch Response object with updated booking details
   */
  async updateBooking(bookingId: number, bookingData: Booking, token: string): Promise<Response> {
    const payload = buildUpdateBookingPayload(bookingData);

    return fetch(`${API_BASE_URL}/booking/${bookingId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Cookie: `token=${token}`,
      },
      body: JSON.stringify(payload),
    });
  },

  /**
   * Partially update a booking (PATCH)
   * @param bookingId - The unique identifier of the booking to update
   * @param partialBooking - Partial booking object containing only fields to update
   * @param token - Authentication token for authorization
   * @returns Promise<Response> - Fetch Response object with updated booking details
   */
  async partialUpdateBooking(
    bookingId: number,
    partialBooking: Partial<Booking>,
    token: string,
  ): Promise<Response> {
    const payload = buildPartialUpdatePayload(partialBooking);

    return fetch(`${API_BASE_URL}/booking/${bookingId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Cookie: `token=${token}`,
      },
      body: JSON.stringify(payload),
    });
  },

  /**
   * Delete a booking
   * @param bookingId - The unique identifier of the booking to delete
   * @param token - Authentication token for authorization
   * @returns Promise<Response> - Fetch Response object with deletion result
   */
  async deleteBooking(bookingId: number, token: string): Promise<Response> {
    return fetch(`${API_BASE_URL}/booking/${bookingId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `token=${token}`,
      },
    });
  },
};

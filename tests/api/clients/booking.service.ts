import type { APIRequestContext, APIResponse } from '@playwright/test';
import { BaseApiClient } from './baseApiClient.service';
import type { Booking, BookingResponse } from '../data/types';

/**
 * BookingService - Handles booking CRUD operations for restful-booker API
 */
export class BookingService extends BaseApiClient {
  constructor(request: APIRequestContext, baseUrl: string) {
    super(request, baseUrl);
  }

  /**
   * Get all booking IDs with optional filtering
   * @param params - Optional filter object (firstname, lastname, checkin, checkout dates)
   * @returns Promise<APIResponse> - Playwright API Response containing array of booking IDs
   */
  async getAllBookingIds(params?: {
    firstname?: string;
    lastname?: string;
    checkin?: string;
    checkout?: string;
  }): Promise<APIResponse> {
    return await this.get('/booking', params ? { params } : undefined);
  }

  /**
   * Get booking details by ID
   * @param bookingId - The unique identifier of the booking
   * @returns Promise<APIResponse> - Playwright API Response containing booking details
   */
  async getBookingById(bookingId: number): Promise<APIResponse> {
    return await this.get(`/booking/${bookingId}`);
  }

  /**
   * Create a new booking
   * @param bookingData - Complete booking object with guest details, dates, and pricing
   * @returns Promise<APIResponse> - Playwright API Response with created booking and ID
   */
  async createBooking(bookingData: Booking): Promise<APIResponse> {
    return await this.post<Booking>('/booking', {
      data: bookingData,
    });
  }

  /**
   * Update an existing booking (full update, requires authentication)
   * @param bookingId - The unique identifier of the booking to update
   * @param bookingData - Complete booking data with all fields
   * @param token - Optional authentication token (required for authorization)
   * @returns Promise<APIResponse> - Playwright API Response with updated booking
   */
  async updateBooking(
    bookingId: number,
    bookingData: Booking,
    token?: string,
  ): Promise<APIResponse> {
    return await this.put<Booking>(`/booking/${bookingId}`, {
      data: bookingData,
      ...(token && {
        headers: {
          Cookie: `token=${token}`,
        },
      }),
    });
  }

  /**
   * Partially update a booking (PATCH, requires authentication)
   * @param bookingId - The unique identifier of the booking to update
   * @param bookingData - Partial booking object with only fields to update
   * @param token - Optional authentication token (required for authorization)
   * @returns Promise<APIResponse> - Playwright API Response with updated booking
   */
  async partialUpdateBooking(
    bookingId: number,
    bookingData: Partial<Booking>,
    token?: string,
  ): Promise<APIResponse> {
    return await this.patch<Partial<Booking>>(`/booking/${bookingId}`, {
      data: bookingData,
      ...(token && {
        headers: {
          Cookie: `token=${token}`,
        },
      }),
    });
  }

  /**
   * Delete a booking (requires authentication)
   * @param bookingId - The unique identifier of the booking to delete
   * @param token - Optional authentication token (required for authorization)
   * @returns Promise<APIResponse> - Playwright API Response with deletion result
   */
  async deleteBooking(bookingId: number, token?: string): Promise<APIResponse> {
    return await this.delete(`/booking/${bookingId}`, {
      ...(token && {
        headers: {
          Cookie: `token=${token}`,
        },
      }),
    });
  }

  /**
   * Extract booking ID from create booking response
   * @param response - The API response from createBooking
   * @returns Promise<number> - The booking ID number
   */
  async getBookingIdFromResponse(response: APIResponse): Promise<number> {
    const data = await this.parseJson<BookingResponse>(response);
    return data.bookingid;
  }

  /**
   * Extract booking data from API response
   * @param response - The API response containing booking data
   * @returns Promise<Booking> - The booking object
   */
  async getBookingDataFromResponse(response: APIResponse): Promise<Booking> {
    return await this.parseJson<Booking>(response);
  }
}

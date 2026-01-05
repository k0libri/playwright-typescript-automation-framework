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
   * Get all booking IDs
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
   * Get booking by ID
   */
  async getBookingById(bookingId: number): Promise<APIResponse> {
    return await this.get(`/booking/${bookingId}`);
  }

  /**
   * Create a new booking
   */
  async createBooking(bookingData: Booking): Promise<APIResponse> {
    return await this.post('/booking', {
      data: bookingData as unknown as Record<string, unknown>,
    });
  }

  /**
   * Update an existing booking (requires authentication token)
   */
  async updateBooking(
    bookingId: number,
    bookingData: Booking,
    token: string,
  ): Promise<APIResponse> {
    return await this.put(`/booking/${bookingId}`, {
      data: bookingData as unknown as Record<string, unknown>,
      headers: {
        Cookie: `token=${token}`,
      },
    });
  }

  /**
   * Partially update a booking (requires authentication token)
   */
  async partialUpdateBooking(
    bookingId: number,
    bookingData: Partial<Booking>,
    token: string,
  ): Promise<APIResponse> {
    return await this.patch(`/booking/${bookingId}`, {
      data: bookingData as unknown as Record<string, unknown>,
      headers: {
        Cookie: `token=${token}`,
      },
    });
  }

  /**
   * Delete a booking (requires authentication token)
   */
  async deleteBooking(bookingId: number, token: string): Promise<APIResponse> {
    return await this.delete(`/booking/${bookingId}`, {
      headers: {
        Cookie: `token=${token}`,
      },
    });
  }

  /**
   * Extract booking ID from create response
   */
  async getBookingIdFromResponse(response: APIResponse): Promise<number> {
    const data = await this.parseJson<BookingResponse>(response);
    return data.bookingid;
  }

  /**
   * Extract booking data from response
   */
  async getBookingDataFromResponse(response: APIResponse): Promise<Booking> {
    return await this.parseJson<Booking>(response);
  }
}

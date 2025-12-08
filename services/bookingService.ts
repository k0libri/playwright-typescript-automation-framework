// Service layer for Booking API
import { apiEndpoints, apiBaseUrl } from '../config/test-data';
import { APIRequestContext } from '@playwright/test';

export class BookingService {
  constructor(private apiRequest: APIRequestContext, private token: string) {}

  async createBooking(data: any) {
    return this.apiRequest.post(apiEndpoints.booking, {
      data,
      headers: { Authorization: `Bearer ${this.token}` },
    });
  }

  async getBooking(id: string) {
    return this.apiRequest.get(`${apiEndpoints.booking}/${id}`, {
      headers: { Authorization: `Bearer ${this.token}` },
    });
  }

  async updateBooking(id: string, data: any) {
    return this.apiRequest.put(`${apiEndpoints.booking}/${id}`, {
      data,
      headers: {
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      },
    });
  }
  // ...delete, etc.
}

import type { Booking } from './types';

/**
 * Booking payload builders for API requests
 */

/**
 * Build create booking payload from booking data
 * @param booking - Booking object containing guest info, dates, and pricing
 * @returns Formatted Booking payload for API request
 */
export function buildCreateBookingPayload(booking: Booking): Booking {
  return {
    firstname: booking.firstname,
    lastname: booking.lastname,
    totalprice: booking.totalprice,
    depositpaid: booking.depositpaid,
    bookingdates: {
      checkin: booking.bookingdates.checkin,
      checkout: booking.bookingdates.checkout,
    },
    ...(booking.additionalneeds && { additionalneeds: booking.additionalneeds }),
  };
}

/**
 * Build update booking payload (uses same structure as create)
 * @param booking - Complete booking object with all fields
 * @returns Formatted Booking payload for update API request
 */
export function buildUpdateBookingPayload(booking: Booking): Booking {
  return buildCreateBookingPayload(booking);
}

/**
 * Build partial update booking payload
 * @param partialBooking - Partial booking object containing only fields to update
 * @returns Formatted partial Booking payload for PATCH API request
 */
export function buildPartialUpdatePayload(partialBooking: Partial<Booking>): Partial<Booking> {
  return { ...partialBooking };
}

/**
 * Build booking filter parameters for search
 * @param params - Object with optional filter fields (firstname, lastname, checkin, checkout)
 * @returns Filter parameters object for query string
 */
export function buildBookingFilterParams(params: {
  firstname?: string;
  lastname?: string;
  checkin?: string;
  checkout?: string;
}) {
  return params;
}

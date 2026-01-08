import type { Booking } from './types';

/**
 * Booking payload builders for API requests
 */

/**
 * Build create booking payload
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
 * Build update booking payload
 */
export function buildUpdateBookingPayload(booking: Booking): Booking {
  return buildCreateBookingPayload(booking);
}

/**
 * Build partial update booking payload
 */
export function buildPartialUpdatePayload(partialBooking: Partial<Booking>): Partial<Booking> {
  return { ...partialBooking };
}

/**
 * Build booking filter parameters
 */
export function buildBookingFilterParams(params: {
  firstname?: string;
  lastname?: string;
  checkin?: string;
  checkout?: string;
}) {
  return params;
}

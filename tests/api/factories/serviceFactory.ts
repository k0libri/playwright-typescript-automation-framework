import { UserServiceFactory } from './userServiceFactory';
import { ProductServiceFactory } from './productServiceFactory';
import { BookingServiceFactory } from './bookingServiceFactory';

/**
 * Service Factory - Central export for all API service factories
 * Can be used in beforeAll hooks without fixture dependencies
 *
 * Usage:
 *   test.beforeAll(async () => {
 *     const response = await ServiceFactory.user.createUser(userData);
 *     const products = await ServiceFactory.product.getAllProducts();
 *     const booking = await ServiceFactory.booking.createBooking(bookingData);
 *   });
 */
export const ServiceFactory = {
  user: UserServiceFactory,
  product: ProductServiceFactory,
  booking: BookingServiceFactory,
};

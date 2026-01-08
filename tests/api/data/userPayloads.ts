import type { UserData } from '../../common/data/types';

/**
 * User API Payloads - Data structure builders for user operations
 */

/**
 * Build create user payload object
 */
export function buildCreateUserPayload(userData: UserData) {
  return {
    name: userData.name,
    email: userData.email,
    password: userData.password,
    title: userData.title,
    birth_date: userData.birth_date,
    birth_month: userData.birth_month,
    birth_year: userData.birth_year,
    firstname: userData.firstname,
    lastname: userData.lastname,
    company: userData.company,
    address1: userData.address1,
    address2: userData.address2,
    country: userData.country,
    zipcode: userData.zipcode,
    state: userData.state,
    city: userData.city,
    mobile_number: userData.mobile_number,
  };
}

/**
 * Build login payload object
 */
export function buildLoginPayload(email: string, password: string) {
  return {
    email,
    password,
  };
}

/**
 * Build delete user payload object
 */
export function buildDeleteUserPayload(email: string, password: string) {
  return {
    email,
    password,
  };
}

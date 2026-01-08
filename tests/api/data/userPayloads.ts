import type { UserData } from '../../common/data/types';

/**
 * User API Payloads - Data structure builders for user operations
 */

/**
 * Build create user payload object from UserData
 * @param userData - User data object containing all registration fields
 * @returns Payload object formatted for user creation API request
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
 * @param email - The user's email address
 * @param password - The user's password
 * @returns Payload object formatted for login verification API request
 */
export function buildLoginPayload(email: string, password: string) {
  return {
    email,
    password,
  };
}

/**
 * Build delete user payload object
 * @param email - The user's email address
 * @param password - The user's password for authentication
 * @returns Payload object formatted for user deletion API request
 */
export function buildDeleteUserPayload(email: string, password: string) {
  return {
    email,
    password,
  };
}

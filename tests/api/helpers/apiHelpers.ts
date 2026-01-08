import type { UserData } from '../../common/data/types';

const BACKEND_API_BASE_URL =
  process.env['BACKEND_API_BASE_URL'] ?? 'https://automationexercise.com/api';

/**
 * Standalone API Helper Functions
 * Pure functions that can be called anywhere without fixture dependencies
 */

// User API Helpers
export async function createUser(userData: UserData): Promise<Response> {
  const formData = new FormData();
  formData.append('name', userData.name);
  formData.append('email', userData.email);
  formData.append('password', userData.password);
  formData.append('title', userData.title);
  formData.append('birth_date', userData.birth_date);
  formData.append('birth_month', userData.birth_month);
  formData.append('birth_year', userData.birth_year);
  formData.append('firstname', userData.firstname);
  formData.append('lastname', userData.lastname);
  formData.append('company', userData.company);
  formData.append('address1', userData.address1);
  if (userData.address2) {
    formData.append('address2', userData.address2);
  }
  formData.append('country', userData.country);
  formData.append('zipcode', userData.zipcode);
  formData.append('state', userData.state);
  formData.append('city', userData.city);
  formData.append('mobile_number', userData.mobile_number);

  return fetch(`${BACKEND_API_BASE_URL}/createAccount`, {
    method: 'POST',
    body: formData,
  });
}

export async function getUserByEmail(email: string): Promise<Response> {
  return fetch(`${BACKEND_API_BASE_URL}/getUserDetailByEmail?email=${encodeURIComponent(email)}`);
}

export async function verifyLogin(email: string, password: string): Promise<Response> {
  const formData = new FormData();
  formData.append('email', email);
  formData.append('password', password);

  return fetch(`${BACKEND_API_BASE_URL}/verifyLogin`, {
    method: 'POST',
    body: formData,
  });
}

export async function deleteUser(email: string, password: string): Promise<Response> {
  const formData = new FormData();
  formData.append('email', email);
  formData.append('password', password);

  return fetch(`${BACKEND_API_BASE_URL}/deleteAccount`, {
    method: 'DELETE',
    body: formData,
  });
}

// Product API Helpers
export async function getAllProducts(): Promise<Response> {
  return fetch(`${BACKEND_API_BASE_URL}/productsList`);
}

export async function searchProducts(searchTerm: string): Promise<Response> {
  const formData = new FormData();
  formData.append('search_product', searchTerm);

  return fetch(`${BACKEND_API_BASE_URL}/searchProduct`, {
    method: 'POST',
    body: formData,
  });
}

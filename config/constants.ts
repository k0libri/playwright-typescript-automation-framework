const API_PATH = '/api';

export const API_ENDPOINTS = {
  // User endpoints
  CREATE_ACCOUNT: `${API_PATH}/createAccount`,
  VERIFY_LOGIN: `${API_PATH}/verifyLogin`,
  DELETE_ACCOUNT: `${API_PATH}/deleteAccount`,
  UPDATE_ACCOUNT: `${API_PATH}/updateAccount`,
  GET_USER_BY_EMAIL: `${API_PATH}/getUserDetailByEmail`,

  // Product endpoints
  GET_ALL_PRODUCTS: `${API_PATH}/productsList`,
  SEARCH_PRODUCT: `${API_PATH}/searchProduct`,

  // Brand endpoints
  GET_ALL_BRANDS: `${API_PATH}/brandsList`,
};

export const TIMEOUT = {
  SHORT: 5000,
  MEDIUM: 10000,
  LONG: 30000,
};

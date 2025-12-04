export const API_BASE_URL = 'https://automationexercise.com/api';
export const BASE_URL = 'https://automationexercise.com';

export const API_ENDPOINTS = {
  // User endpoints
  CREATE_ACCOUNT: '/createAccount',
  VERIFY_LOGIN: '/verifyLogin',
  DELETE_ACCOUNT: '/deleteAccount',
  UPDATE_ACCOUNT: '/updateAccount',
  GET_USER_BY_EMAIL: '/getUserDetailByEmail',

  // Product endpoints
  GET_ALL_PRODUCTS: '/productsList',
  SEARCH_PRODUCT: '/searchProduct',

  // Brand endpoints
  GET_ALL_BRANDS: '/brandsList',
};

export const TEST_DATA = {
  VALID_USER: {
    NAME: 'Test User',
    EMAIL: 'testuser@example.com',
    PASSWORD: 'password123',
  },
  PRODUCTS: {
    BLUE_TOP: {
      ID: 1,
      NAME: 'Blue Top',
      PRICE: 'Rs. 500',
    },
    MEN_TSHIRT: {
      ID: 2,
      NAME: 'Men Tshirt',
      PRICE: 'Rs. 400',
    },
  },
};

export const TIMEOUT = {
  SHORT: 5000,
  MEDIUM: 10000,
  LONG: 30000,
};

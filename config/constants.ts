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

export const TIMEOUT = {
  SHORT: 5000,
  MEDIUM: 10000,
  LONG: 30000,
};

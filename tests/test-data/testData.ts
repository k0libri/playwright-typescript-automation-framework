export const TEST_DATA = {
  VALID_USER: {
    NAME: 'Test User',
    EMAIL: 'testuser@example.com',
    PASSWORD: 'password123',
  },
  USER_UPDATES: {
    NAME: 'Updated Name',
    COMPANY: 'Updated Company',
  },
  AUTH: {
    EXISTING_EMAIL: 'test@example.com',
    INVALID_EMAIL: 'not-an-email',
    INVALID_PASSWORD: 'wrongpassword',
    EMPTY_EMAIL: '',
    EMPTY_PASSWORD: '',
    SQL_INJECTION_PAYLOAD: "' OR '1'='1' --",
    XSS_PAYLOAD: '<script>alert("XSS")</script>',
  },
  PAYMENT: {
    VALID: {
      CARD_NUMBER: '4242424242424242',
      CVC: '123',
      EXPIRY_MONTH: '12',
      EXPIRY_YEAR: '2030',
    },
    INVALID: {
      NAME_ON_CARD: '',
      CARD_NUMBER: '1234',
      CVC: '1',
      EXPIRY_MONTH: '13',
      EXPIRY_YEAR: '2020',
    },
  },
  SEARCH_TERMS: {
    BLUE: 'blue',
    NON_EXISTENT: 'nonexistentproduct12345',
  },
  CATEGORIES: {
    WOMEN: 'women',
  },
  BRANDS: {
    POLO: 'polo',
  },
  ORDER: {
    DEFAULT_COMMENT: 'Test order comment',
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

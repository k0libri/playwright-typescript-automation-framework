import { test, expect } from '@playwright/test';

test.describe('API Tests', () => {
  test('sample api test', async ({ request }) => {
    // Example API test structure
    const response = await request.get('https://api.example.com/users');
    expect(response.status()).toBe(200);
  });
});

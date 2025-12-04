import { APIRequestContext } from '@playwright/test';

export class ApiHelper {
  constructor(private request: APIRequestContext) {}

  async get(url: string, options?: any) {
    return this.request.get(url, options);
  }

  async post(url: string, options?: any) {
    return this.request.post(url, options);
  }

  async put(url: string, options?: any) {
    return this.request.put(url, options);
  }

  async delete(url: string, options?: any) {
    return this.request.delete(url, options);
  }
}

import { APIRequestContext } from '@playwright/test';
import { User } from '../utils/UserFactory';
import { UserResponse, LoginResponse } from './ApiResponse';
import { API_BASE_URL, API_ENDPOINTS } from '../config/constants';

export class UserService {
  private request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  private buildFormData(data: Record<string, string | undefined>): string {
    const params = new URLSearchParams();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value);
      }
    });
    return params.toString();
  }

  async createUser(user: User): Promise<UserResponse> {
    const data = this.buildFormData({
      name: user.name,
      email: user.email,
      password: user.password ?? '',
      title: user.title,
      birth_date: user.birth_date,
      birth_month: user.birth_month,
      birth_year: user.birth_year,
      firstname: user.firstname,
      lastname: user.lastname,
      company: user.company,
      address1: user.address1,
      address2: user.address2,
      country: user.country,
      zipcode: user.zipcode,
      state: user.state,
      city: user.city,
      mobile_number: user.mobile_number,
    });

    const response = await this.request.post(`${API_BASE_URL}${API_ENDPOINTS.CREATE_ACCOUNT}`, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data,
    });

    return response.json() as Promise<UserResponse>;
  }

  async verifyLogin(email: string, password: string): Promise<LoginResponse> {
    const data = this.buildFormData({ email, password });

    const response = await this.request.post(`${API_BASE_URL}${API_ENDPOINTS.VERIFY_LOGIN}`, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data,
    });

    return response.json() as Promise<LoginResponse>;
  }

  async deleteUser(email: string, password: string): Promise<UserResponse> {
    const data = this.buildFormData({ email, password });

    const response = await this.request.delete(`${API_BASE_URL}${API_ENDPOINTS.DELETE_ACCOUNT}`, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data,
    });

    return response.json() as Promise<UserResponse>;
  }

  async getUserByEmail(email: string): Promise<UserResponse> {
    const response = await this.request.get(`${API_BASE_URL}${API_ENDPOINTS.GET_USER_BY_EMAIL}`, {
      params: { email },
    });

    return response.json() as Promise<UserResponse>;
  }

  async updateUser(user: User): Promise<UserResponse> {
    const data = this.buildFormData({
      name: user.name,
      email: user.email,
      password: user.password ?? '',
      title: user.title,
      birth_date: user.birth_date,
      birth_month: user.birth_month,
      birth_year: user.birth_year,
      firstname: user.firstname,
      lastname: user.lastname,
      company: user.company,
      address1: user.address1,
      address2: user.address2,
      country: user.country,
      zipcode: user.zipcode,
      state: user.state,
      city: user.city,
      mobile_number: user.mobile_number,
    });

    const response = await this.request.put(`${API_BASE_URL}${API_ENDPOINTS.UPDATE_ACCOUNT}`, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data,
    });

    return response.json() as Promise<UserResponse>;
  }
}

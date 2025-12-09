/**
 * Environment configuration
 * Centralizes URLs and endpoints to avoid hardcoding
 */
export interface EnvironmentConfig {
  baseUrl: string;
  apiBaseUrl: string;
  timeout: number;
  retries: number;
}

export const environments: Record<string, EnvironmentConfig> = {
  production: {
    baseUrl: 'https://automationexercise.com/',
    apiBaseUrl: 'https://automationexercise.com/api',
    timeout: 30000,
    retries: 2
  },
  staging: {
    baseUrl: 'https://staging.automationexercise.com/',
    apiBaseUrl: 'https://staging.automationexercise.com/api',
    timeout: 30000,
    retries: 3
  },
  development: {
    baseUrl: 'http://localhost:3000/',
    apiBaseUrl: 'http://localhost:3000/api',
    timeout: 15000,
    retries: 1
  }
};

export function getEnvironment(): EnvironmentConfig {
  const env = process.env.NODE_ENV ?? 'production';
  return environments[env] ?? environments.production;
}

export function getBaseUrl(): string {
  return getEnvironment().baseUrl;
}

export function getApiBaseUrl(): string {
  return getEnvironment().apiBaseUrl;
}

---
applyTo: '**'
---

# API Assertion & Response Validation Guide

## Purpose

Define consistent practices for validating API responses, handling authentication, and covering both positive and negative scenarios.  
All API-focused tests and services must follow this guide.

---

## Testing Strategy Overview

This framework supports **two distinct API testing approaches**:

1. **Standalone API Testing** (`src/api/standalone/`):
   - Pure API tests against external APIs (e.g., restful-booker)
   - Tests API endpoints independently without UI interaction
   - Focus on API functionality, authentication, CRUD operations, and error handling

2. **Backend API Validation** (`src/api/backend/`):
   - API services used to validate backend state during UI testing
   - Part of UI + API hybrid testing (e.g., automationexercise.com)
   - Verifies that UI actions correctly update backend data

Both approaches share common principles but serve different purposes.

---

## Principles

- **Fail-Fast & No False Positives**
  - Every critical assertion must be a hard assertion (`expect`).
  - Tests must fail as soon as the response (status, schema, or payload) is incorrect.

- **Schema Validation First**
  - Validate the response schema before asserting business logic.
  - Use TypeScript interfaces plus a runtime validator (e.g., Zod, Ajv) to ensure response shape and types.

- **Positive Scenarios**
  - Cover successful flows where the backend returns valid data.
  - Assert:
    - The correct status code using shared constants/enums (e.g., `HttpStatus.OK`).
    - Schema validity (run the validator and expect no errors).
    - Business fields (IDs, totals, etc.) via typed property checks.
    - Use status codes from shared enums/constants, not hardcoded numbers.

- **Negative Scenarios**
  - Intentionally trigger errors (invalid inputs, unauthorized access, out-of-stock, etc.).
  - Assert:
    - Correct error status (e.g., `HttpStatus.BAD_REQUEST`, `HttpStatus.UNAUTHORIZED`).
    - Schema/body of the error response (message codes, fields).
    - Clear failure messages if the expected error is not returned.

- **Authentication Handling**
  - Resolve tokens/credentials through fixtures (login flow, token endpoint, secret manager).
  - Never hardcode tokens; tests must fail gracefully if authentication cannot be obtained.

- **Idempotency & Clean State**
  - Ensure tests can run repeatedly:
    - Use factories for unique data.
    - Clean up created resources where the API supports deletion.
    - Reset or isolate state in fixtures.

---

## Reusable API Call Abstraction (Service Layer Pattern)

To keep API logic maintainable and DRY, implement a reusable “base API request” function that encapsulates shared HTTP behavior. Feature-specific functions (e.g., `getTeams`) call this base function, supplying only endpoint-specific details. This follows the **Service Layer / API Client abstraction** pattern.

### Base Request (shared utility)

```ts
// src/api/base/baseApiRequest.ts
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface ApiRequestOptions<TBody = unknown> {
  path: string;
  method?: HttpMethod;
  headers?: Record<string, string>;
  query?: Record<string, string | number | boolean>;
  body?: TBody;
}

const API_BASE_URL = process.env.API_BASE_URL ?? 'https://api.example.com';

export async function baseApiRequest<TResponse, TBody = unknown>({
  path,
  method = 'GET',
  headers = {},
  query,
  body,
}: ApiRequestOptions<TBody>): Promise<TResponse> {
  const url = new URL(`${API_BASE_URL}${path}`);

  if (query) {
    Object.entries(query).forEach(([key, value]) => url.searchParams.set(key, String(value)));
  }

  const response = await fetch(url.toString(), {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  return (await response.json()) as TResponse;
}
```

### Feature Function Example

```ts
// src/api/services/team.service.ts
import { baseApiRequest } from '../base/baseApiRequest';
import { teamsResponseSchema, TeamsResponse } from '../data/team.schema';

interface GetTeamsParams {
  slug: string;
  authToken: string;
}

export async function getTeams({ slug, authToken }: GetTeamsParams): Promise<TeamsResponse> {
  const data = await baseApiRequest<TeamsResponse>({
    path: `/teams/${slug}`,
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  // Schema validation before returning
  return teamsResponseSchema.parse(data);
}
```

- `baseApiRequest` centralizes base URL handling, query parameters, headers, JSON parsing, and error handling.
- Feature functions (like `getTeams`) provide only endpoint-specific details and perform schema validation.
- Additional endpoints (e.g., `createOrder`, `getUser`) follow the same pattern.

---

## Implementation Guidelines

- **Centralize API Calls**
  - Each feature service file exports functions built on the shared base request.
  - Tests call service functions, never raw `fetch` or duplicated logic.

- **Use TypeScript for Maintainability**
  - Define request/response types and schemas in `src/api/data/` or `shared/data/`.
  - Pair generics (`baseApiRequest<TResponse>`) with schema validators to ensure type safety.

- **Fixtures for Auth and Dependencies**
  - Use Playwright fixtures to inject service functions and auth tokens.
  - Example:
    ```ts
    export const apiTest = test.extend<{
      authToken: string;
      teamService: typeof getTeams;
    }>({
      authToken: async ({ request }, use) => {
        const token = await resolveAuthToken(request);
        await use(token);
      },
      teamService: async ({ authToken }, use) => {
        await use((params) => getTeams({ ...params, authToken }));
      },
    });
    ```

- **Logging & Allure**
  - Attach request/response payloads to Allure when tests fail.
  - Use shared logging utilities for diagnostics.

---

## Recommended Test Structure

1. **Setup**
   - Resolve authentication.
   - Generate data via factories.

2. **Schema Validation**
   - Validate response schema immediately after the call returns.

3. **Positive Cases**
   - Assert status code via shared constants/enums (when using Playwright request context).
   - Assert business fields.

4. **Negative Cases**
   - Trigger expected errors.
   - Assert error status and payload.

5. **Cleanup**
   - Remove or reset created resources.

---

## Example Test

```ts
import { apiTest } from '../../fixtures/apiFixtures';
import { getTeams } from '../../services/team.service';
import { teamsResponseSchema } from '../../data/team.schema';

apiTest.describe('API | Teams', () => {
  apiTest('should return teams for a valid slug', async ({ authToken }) => {
    const teams = await getTeams({ authToken, slug: 'qa-department' });
    const parsed = teamsResponseSchema.parse(teams);
    expect(parsed[0].slug).toBe('qa-department');
  });

  apiTest('should fail for missing auth token', async () => {
    await expect(getTeams({ authToken: '', slug: 'qa-department' })).rejects.toThrow(/401/);
  });
});
```

---

## Common Mistakes

- Validating only status codes without checking response schemas.
- Skipping schema validation and relying solely on TypeScript structural typing.
- Hardcoding status codes instead of using shared constants/enums.
- Duplicating HTTP request logic instead of using the base API request helper.
- Hardcoding authentication tokens rather than resolving them dynamically.
- Failing to clean up state, causing subsequent runs to fail.

---

## Checklist

- [ ] Does the test validate the response schema before business assertions?
- [ ] Are status codes asserted via shared constants/enums (when checking raw responses)?
- [ ] Do positive scenarios verify all required fields?
- [ ] Do negative scenarios confirm error status/payload?
- [ ] Do service functions reuse the shared `baseApiRequest` helper?
- [ ] Is authentication resolved dynamically (no hardcoded tokens)?
- [ ] Can tests run repeatedly without polluting state?
- [ ] Are failures logged and attached to Allure?

---

## References

- [Martin Fowler – Service Layer Pattern](https://martinfowler.com/eaaCatalog/serviceLayer.html)
- [TypeScript Handbook – Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html)
- [Zod Documentation – Runtime Schema Validation](https://zod.dev/)
- [MDN – Fetch API](https://developer.mozilla.org/docs/Web/API/Fetch_API)
- [Playwright Test – API Testing](https://playwright.dev/docs/test-api-testing)

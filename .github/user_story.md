# Automation Exercise – Enhanced User Stories

## Story 1 – UI Registration + API Verification

- **As a** tester
- **I want** to register a new user via the UI
- **So that** I can verify via the backend API that the user record is created correctly

### Business Value

- Confirms end-to-end integration between the publicly available UI and backend.
- Validates the registration flow and reduces regression risk.

### Preconditions

- Test environment is reachable (`UI_BASE_URL`, `API_BASE_URL` configured).
- No existing user with the generated email address.
- API credentials or auth mechanism (if required) are available.

### Acceptance Criteria

1. **Given** a unique user dataset generated via factory  
   **When** the user completes the registration flow through the UI  
   **Then** the UI must display a successful registration confirmation.
2. **Given** the same user dataset  
   **When** the backend API (e.g., `GET /users/{email}`) is queried  
   **Then** the response must contain the newly created user with accurate attributes (name, email, address, etc.).
3. If a delete/remove endpoint is available, the test must clean up the created user after execution to prevent collisions.

### Test Coverage

- **UI:** Filling out the registration form and verifying the confirmation.
- **API:** Retrieving and validating the user record by email, including response schema and essential fields.

### Automation Notes

- Use a data factory to generate unique email addresses.
- Drive UI actions through page objects and fixtures.
- Use `UserService` (or equivalent) for API retrieval.
- Allure steps: “Register user via UI” and “Verify user via API”.
- Implement cleanup (user deletion) if the backend exposes it.

---

## Story 2 – Login + Cart Verification via API

- **As a** tester
- **I want** to log in through the UI and add products to the cart
- **So that** I can verify via the backend API that cart contents are persisted correctly

### Business Value

- Validates that cart state synchronizes between frontend and backend.

### Preconditions

- A valid test user exists (either pre-created or created as part of Story 1).
- Products are available in the catalog.
- The backend provides a cart retrieval endpoint (e.g., `GET /cart/{userId}`).

### Acceptance Criteria

1. **Given** a valid user account  
   **When** the user logs in via the UI  
   **Then** the UI must display a logged-in state (dashboard/account area).
2. **When** the user adds multiple products to the cart via the UI  
   **Then** the UI (cart badge or page) must show the accurate product list and quantity.
3. **When** the cart is fetched using the API  
   **Then** the response must match the UI selection (product IDs, quantities, totals).
4. Any unexpected state (e.g., product unavailable) must produce a clear test failure with diagnostic attachments.

### Test Coverage

- **UI:** Login flow, product selection/cart actions, cart UI verification.
- **API:** Cart retrieval for the logged-in user, verifying required fields and totals.

### Automation Notes

- Provide a login fixture to avoid redundant logins.
- Page objects handle product selection, cart updates, and assertions.
- Use `CartService` (or equivalent) to validate the cart via API.
- Allure steps: “Login via UI”, “Add products via UI”, “Verify cart via API”.
- API or UI-based cart cleanup after the test if endpoints are available.

---

## Story 3 – Complete Purchase + Order History Verification

- **As a** tester
- **I want** to complete a purchase via the UI
- **So that** I can verify the order appears in the user’s order history using the backend API

### Business Value

- Confirms that the checkout process and order persistence work seamlessly.

### Preconditions

- User must be logged in with items already in the cart (carry-over from Story 2).
- Valid address/payment data available (mock/dummy data).
- Backend provides an order history endpoint (e.g., `GET /orders?userId=`).

### Acceptance Criteria

1. **Given** a logged-in user with a filled cart  
   **When** the checkout process is completed via the UI  
   **Then** the UI must display order confirmation (order number and summary).
2. **When** the order history is retrieved via the API  
   **Then** the latest order must match the purchase details (items, quantities, price) and reflect the correct status (e.g., “Completed”).
3. **Optional but recommended:** verify the order history via the UI as well; capture evidence if available.

### Test Coverage

- **UI:** Checkout (address, payment, confirmation), verifying the confirmation screen.
- **API:** Retrieve order history and check fields (orderId, total, items, status).

### Automation Notes

- Use factories/builders to provide address and payment details.
- `OrderService` (or similar) handles API order verification.
- Allure steps: “Checkout via UI”, “Verify order via API”.
- Cleanup typically not required for completed orders, but document behavior if applicable.

---

## Story 4 – Negative Scenarios (Invalid Login, Out-of-Stock Purchase, etc.)

- **As a** tester
- **I want** to cover negative scenarios via UI and confirm backend error handling via API
- **So that** the system’s robustness and error messaging are validated end-to-end

### Business Value

- Ensures the application communicates errors consistently across the UI and backend.

### Preconditions

- Valid and invalid user accounts exist (or can be generated).
- Products can simulate out-of-stock or invalid states (mock or real data).
- Backend exposes error codes and messages (e.g., 401 for invalid login, 409/422 for out-of-stock).

### Acceptance Criteria

1. **Invalid Login via UI**
   - UI displays a clear error message (e.g., “Invalid email or password”).
   - API login (if available) returns the expected error status (401) with a descriptive error body.
2. **Out-of-Stock / Invalid Purchase**
   - UI prevents checkout and shows an appropriate error when an item is unavailable.
   - API (e.g., `POST /orders`) returns an error status (409/422) with a relevant error payload.
3. All tests attach diagnostic artifacts (screenshots, response bodies, logs) to Allure.
4. Tests must fail if the expected error is not observed (no false positives).

### Test Coverage

- **UI:** Invalid login attempt, out-of-stock checkout attempt, other negative flows as needed.
- **API:** Validating error responses (status code + body) for login/order endpoints.

### Automation Notes

- Use factories to generate invalid credential or stock scenarios.
- Combine UI and API fixtures to share state and assertions.
- Allure steps include “Attempt invalid login”, “Verify login error via API”, “Attempt out-of-stock purchase”, “Validate backend error”.
- No cleanup needed (negative state), but ensure thorough logging.

---

## Story 5 – Allure Reporting for All Test Runs

- **As a** tester
- **I want** every test run (local and CI) to generate an Allure report
- **So that** test evidence remains centralized, shareable, and traceable

### Business Value

- Ensures consistent diagnostics for both successful and failing tests.
- Accelerates triage and collaboration.

### Preconditions

- `allure-playwright` reporter is configured.
- Allure CLI is available locally and in CI.

### Acceptance Criteria

1. Every test run produces `allure-results`.
2. The CI pipeline generates the Allure report (`npx allure generate`) and uploads it as an artifact.
3. README documents how to open the report locally (`npx allure open reports/allure`).
4. Failures capture relevant attachments (screenshots, traces, response bodies).

### Test Coverage

- Applies across all stories; no additional test case.

### Automation Notes

- `afterEach` captures screenshots for UI failures.
  - API failures attach JSON responses.
- CI pipeline script must include Allure report generation and artifact upload.

---

## Story 6 – CI Pipeline Enforcement & Artifacts

- **As a** tester/devops engineer
- **I want** the CI pipeline to lint, run tests, fail on errors, and upload Allure artifacts
- **So that** code quality and test evidence are enforced automatically

### Business Value

- Prevents the integration of poor-quality code.
- Guarantees visibility into test results for the entire team.

### Preconditions

- GitHub Actions workflow configured (`.github/workflows/ci.yml`).
- Lint/test scripts defined in `package.json`.

### Acceptance Criteria

1. Pipeline executes:
   - `npm ci`
   - `npm run lint`
   - UI + API tests (`npm run test:ui` / `npm run test:api` or combined script)
   - `npx allure generate --clean ./allure-results -o ./reports/allure`
   - `actions/upload-artifact@v3` to archive the Allure report
2. If lint or tests fail, the workflow exits with failure and skips artifact generation.
3. Reports (Allure + Playwright HTML) can be downloaded post-run.
4. README documents pipeline usage, expected environment variables/secrets, and how to view reports.

### Automation Notes

- Optionally run a matrix across browsers or environments.
- Manage secrets in GitHub (e.g., `UI_BASE_URL`, `API_BASE_URL`, credential secrets).
- Pipeline logs should clearly show each step and any errors.

---

## Dependencies & Cross-Story Considerations

- Story 2 and Story 3 can reuse the user created in Story 1 (or create their own via fixtures).
- Story 4 builds on components from Stories 1–3 to exercise failure paths.
- Stories 5 and 6 apply across all other stories, ensuring consistent reporting and CI enforcement.
- Configuration, factory usage, fixtures, API services, locator and assertion guidelines underpin every story.

---

## Automation Coverage Summary

| Story | UI Coverage                                 | API Coverage         | Reporting                          | CI Impact                                 |
| ----- | ------------------------------------------- | -------------------- | ---------------------------------- | ----------------------------------------- |
| 1     | Registration flow                           | User verification    | Allure steps & failure attachments | Ensures user registration is tested in CI |
| 2     | Login & cart interaction                    | Cart verification    | Allure steps                       | Piggybacks on pipeline for UI success     |
| 3     | Checkout flow                               | Order history check  | Allure steps & attachments         | Pipeline executes complete flow           |
| 4     | Negative flows (invalid login/out-of-stock) | Error handling       | Detailed error attachments         | Negative cases enforced in CI             |
| 5     | Applies to all                              | Applies to all       | Allure generation + attachments    | Pipeline artifact requirement             |
| 6     | Pipeline enforcement                        | Pipeline enforcement | Allure artifact                    | Pipeline governance                       |

---

## References

- [Automation Exercise](https://automationexercise.com/)
- Project instruction set:
  - Assertion & Validation Guide
  - Locator Strategy & Selector Patterns Guide
  - Patterns & Abstractions Guide
  - Project Structure Guide
  - Test Generation & Structure Guide
  - API Assertion & Response Validation Guide
  - Test Data Management & Factory Guide
  - Allure Reporting Guide
  - CI/CD Pipeline Execution Guide
  - Configuration & Environment Management Guide
  - Logging & Debugging Guide
  - Fixtures & Dependency Injection Guide

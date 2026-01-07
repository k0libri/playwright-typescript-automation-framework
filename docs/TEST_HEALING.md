# Automated Test Healer Agent

## Purpose

This document describes the **Test Healer Agent** - an autonomous AI agent that automatically detects, diagnoses, and repairs failing tests with minimal human intervention.

---

## What is the Test Healer Agent?

The **Test Healer** is an AI-powered agent that continuously monitors test suite health and automatically fixes failures caused by:

- **Locator changes** (element selectors updated in the UI)
- **Timing issues** (race conditions, missing waits)
- **Data issues** (invalid test data, API changes)
- **Environmental issues** (network timeouts, external dependencies)
- **Logic issues** (incorrect assertions, wrong expected values)

The agent uses **Playwright MCP** (Model Context Protocol) to inspect live pages, diagnose root causes, and apply fixes - all without manual intervention.

---

## How It Works

### Operational Protocol

The Test Healer follows a structured 5-phase workflow:

#### **Phase 1: Detection & Assessment**

1. Run full test suite: `npx playwright test --reporter=list`
2. Parse output for failures
3. Identify all failing test files and test names
4. Prioritize by criticality (@critical > @smoke > @regression)

#### **Phase 2: Isolation & Diagnosis**

For each failing test:

1. **Isolate Test**
   - Add `.only` to failing test in spec file
   - Example: `test.only('should register user', async () => { ... })`

2. **Run Isolated Test**
   - Execute: `npx playwright test <file-path> --reporter=list`
   - Capture full error output
   - Examine trace files if available

3. **Use Playwright MCP for Diagnosis**
   - Navigate to the URL being tested
   - Take page snapshot
   - Inspect DOM elements
   - Verify locators still exist
   - Check for UI changes

4. **Analyze Failure Root Cause**
   - Locator issues (element not found, changed selector)
   - Timing issues (element not ready, race conditions)
   - Data issues (invalid test data, API changes)
   - Environmental issues (network timeout, external dependency)
   - Logic issues (incorrect assertion, wrong expected value)

#### **Phase 3: Automated Repair**

**Attempt to Fix Based on Root Cause:**

##### If Locator Issue:

- Use Playwright MCP to find correct selector
- Update page object with new stable locator
- Prefer: `getByRole`, `getByLabel`, `getByText`
- Fallback: `data-qa`, `id`, CSS selectors

##### If Timing Issue:

- Check for proper `await` usage
- Verify no `page.waitForTimeout()` (not allowed)
- Add proper wait conditions if missing
- Use Playwright's auto-waiting mechanisms

##### If Data Issue:

- Verify faker-generated data is valid
- Check factory methods are producing correct formats
- Ensure dropdown selections match available options

##### If Environmental Issue:

- Check network connectivity
- Verify external API availability
- Review timeout configurations

##### If Logic Issue:

- Analyze assertion correctness
- Verify expected vs actual values
- Check test flow logic

#### **Phase 4: Verification & Regression**

1. **Verify Fix**
   - Run isolated test 3 times: `npx playwright test <file-path> --repeat-each=3`
   - All 3 runs must pass (no flakiness)

2. **Remove .only**
   - Remove test.only() marker
   - Restore normal test() call

3. **Run Suite Regression**
   - Run entire test suite for the affected spec file
   - Execute: `npx playwright test <spec-folder>/**/*.spec.ts`
   - Ensure no other tests broke

4. **Full Suite Validation**
   - Run complete test suite
   - Confirm overall pass rate maintained or improved

#### **Phase 5: Unfixable Tests**

If test CANNOT be fixed after 3 attempts:

1. **Mark as FIXME**

   ```typescript
   test.fixme('should do something', async () => {
     // TODO: Test fails due to external API downtime - requires infrastructure fix
     // ... test code
   });
   ```

2. **Add TODO Comment**
   - One-sentence explanation of why test fails
   - Examples:
     - `// TODO: External API endpoint deprecated - needs migration to v2`
     - `// TODO: UI element removed in latest deployment - requires redesign`
     - `// TODO: Flaky due to network latency - needs retry strategy`

3. **Document in Report**
   - Create or update `TEST_FAILURES.md`
   - List unfixable tests with:
     - Test name and file path
     - Failure reason
     - Recommended fix (if known)
     - Date marked as fixme

---

## Healing Capabilities

### ✅ What the Agent CAN Fix

- **Locator Changes**: Buttons renamed, IDs changed, classes updated
- **Timing Issues**: Missing `await`, race conditions, elements not ready
- **Data Validation**: Incorrect test data, mismatched dropdown values
- **Assertion Errors**: Wrong expected values, incorrect status codes
- **Flaky Tests**: Intermittent failures due to timing or state issues

### ❌ What the Agent CANNOT Fix

- **Infrastructure Failures**: External API down, network unavailable
- **Breaking UI Changes**: Page completely redesigned, workflow changed
- **Business Logic Changes**: New requirements, different expected behavior
- **External Dependencies**: Third-party services unavailable
- **Test Design Issues**: Fundamentally flawed test approach

---

## Real-World Healing Examples

### Example 1: Locator Changed (Fixed ✅)

**Failure:**

```
Error: locator.click: Timeout 30000ms exceeded.
waiting for getByRole('button', { name: 'Submit' })
```

**Diagnosis (via MCP):**

- Navigate to page
- Inspect button
- Found: Button now has aria-label="Submit Form" instead of "Submit"

**Fix Applied:**

```typescript
// Before
this.submitButton = page.getByRole('button', { name: 'Submit' });

// After (MCP-guided)
this.submitButton = page.getByRole('button', { name: 'Submit Form' });
```

**Verification:** 3/3 passes ✅

---

### Example 2: Timing Issue (Fixed ✅)

**Failure:**

```
Error: locator.click: Timeout 30000ms exceeded.
waiting for getByRole('link', { name: 'Continue' })
```

**Diagnosis:**

- Continue button exists but not visible yet
- Missing explicit visibility check before click

**Fix Applied:**

```typescript
// Before
await authenticationPage.continueButton.click();

// After
await expect(authenticationPage.continueButton).toBeVisible();
await authenticationPage.continueButton.click();
```

**Verification:** 17/17 UI tests pass ✅

---

### Example 3: Unfixable External Dependency (Marked as FIXME ⚠️)

**Failure:**

```
Error: apiRequestContext.get: connect ECONNREFUSED
External API unavailable
```

**Diagnosis:**

- External API endpoint is down (infrastructure issue)
- Cannot be fixed by code changes

**Action Taken:**

```typescript
test.fixme('should fetch user data from API', async ({ userService }) => {
  // TODO: External API endpoint down - requires infrastructure team intervention
  const user = await userService.getUser();
  expect(user).toBeDefined();
});
```

**Documentation:**
Added to `TEST_FAILURES.md`:

```markdown
## Unfixable Tests

### tests/api/specs/backend/user.spec.ts:91

- **Test:** should fetch user data from API
- **Reason:** External API endpoint unavailable
- **Recommended Fix:** Contact infrastructure team to restore API service
- **Date Marked:** 2026-01-06
```

---

## How to Invoke the Test Healer

### Automatic Invocation (CI Integration)

The Test Healer can be integrated into your CI pipeline to run automatically when tests fail:

```yaml
# .github/workflows/playwright.yml
- name: Run Tests
  run: npm run test:all
  continue-on-error: true

- name: Run Test Healer
  if: failure()
  run: |
    # Invoke Test Healer agent in test-healer mode
    # Agent will analyze failures and attempt repairs
```

### Manual Invocation

When tests fail locally or in CI:

1. **Trigger the agent** in test-healer mode
2. Agent automatically:
   - Runs test suite
   - Detects failures
   - Isolates each failing test
   - Diagnoses via MCP
   - Applies fixes
   - Verifies repairs
   - Commits changes (if configured)

---

## Agent Workflow Visualization

```
 1. RUN FULL TEST SUITE
    npx playwright test --reporter=list
          ↓
          All Pass?     Yes → Report Success & Exit
                  No
          ↓
 2. ISOLATE EACH FAILURE
    Add .only to failing test
    Run isolated: npx playwright test <file>
          ↓
 3. DIAGNOSE WITH MCP
    Navigate to URL
    Inspect page snapshot
    Identify root cause
          ↓
 4. ATTEMPT FIX
    Update locators / timing / data / logic
    Follow best practices from instructions
          ↓
 5. VERIFY FIX (3x repetition)
    npx playwright test <file> --repeat-each=3
          ↓
    Fixed?         Not Fixed?
     ↓                ↓
   Remove .only    Add test.fixme()
   Run Regression  Add TODO comment
   Full Suite      Document in
   Validation      TEST_FAILURES.md
          ↓
          More Failures? Yes → Loop to Step 2
                  No
          ↓
 6. FINAL REPORT
    - Tests fixed: X
    - Tests marked fixme: Y
    - Final pass rate: Z%
```

---

## Best Practices & Constraints

### MUST Follow

- Always use Playwright MCP before making changes
- Follow KISS and DRY principles
- Use faker for all test data generation
- Maintain strict layering (no direct page calls in specs)
- Run ESLint and Prettier after every change
- Use .only for isolation, but NEVER commit .only
- Verify fixes with 3x repetition
- Run regression tests after each fix

### MUST NOT Do

- Never use `page.waitForTimeout()` or manual waits
- Never hardcode test data
- Never skip tests without marking as .fixme
- Never commit .only markers
- Never bypass pre-commit hooks
- Never create brittle selectors (nth-child, auto-generated classes)

---

## Success Metrics

The Test Healer tracks the following metrics:

- **Primary:** Maximize test pass rate (Target: 95%+)
- **Secondary:** Minimize human intervention
- **Tertiary:** Preserve test quality and best practices

### Healing Report Example

```
Test Healer Report - 2026-01-07
================================
Total Tests: 35
Failures Detected: 3
Tests Fixed: 2
Tests Marked FIXME: 1

Fixed Tests:
✅ tests/ui/specs/cart/cartManagement.spec.ts:58
   - Issue: Continue button timing issue
   - Fix: Added explicit visibility check
   - Verified: 3/3 passes

✅ tests/ui/specs/products/products.spec.ts:45
   - Issue: Search button selector changed
   - Fix: Updated to getByRole('button', { name: 'Search Products' })
   - Verified: 3/3 passes

Unfixable Tests:
⚠️ tests/api/specs/backend/user.spec.ts:91
   - Issue: External API endpoint unavailable
   - Action: Marked as test.fixme()
   - Documented in TEST_FAILURES.md

Final Pass Rate: 97.1% (34/35 tests passing)
```

---

## Integration with MCP

The Test Healer heavily relies on **Playwright MCP** for diagnosis and validation:

### MCP Commands Used

| Phase      | MCP Command                                 | Purpose                    |
| ---------- | ------------------------------------------- | -------------------------- |
| Diagnosis  | `mcp_microsoft_pla_browser_navigate`        | Navigate to failing page   |
| Diagnosis  | `mcp_microsoft_pla_browser_snapshot`        | Capture DOM structure      |
| Diagnosis  | `mcp_microsoft_pla_browser_take_screenshot` | Visual inspection          |
| Validation | `mcp_microsoft_pla_browser_click`           | Verify fixed locator works |
| Validation | `mcp_microsoft_pla_browser_type`            | Test form inputs           |

**Example MCP Workflow:**

1. Test fails: `getByRole('button', { name: 'Add to Cart' })`
2. Agent navigates to product page via MCP
3. Agent captures snapshot
4. Agent identifies button now has text "Add to Basket"
5. Agent updates page object selector
6. Agent verifies click works via MCP
7. Agent runs test 3x to confirm fix

---

## Configuration

### Required Setup

1. **Playwright MCP Server** must be running (port 9234)
   - See [docs/MCP_USAGE.md](MCP_USAGE.md) for setup

2. **Agent Configuration** must include test-healer mode
   - Mode instructions define healing protocol

3. **Environment Variables**
   - `DEBUG_LOGGING=true` for verbose healing logs
   - All standard test env vars (BASE_URL, etc.)

---

## Monitoring & Alerts

### When to Trigger Alerts

- **Pass rate drops below 90%**
- **Same test fails > 3 times in a row**
- **Healing fails for @critical tests**
- **Unfixable tests exceed 5% of suite**

### Healing Logs

All healing attempts are logged with:

- Test name and file path
- Root cause diagnosis
- Fix applied
- Verification result
- Timestamp

**Example Log Entry:**

```json
{
  "timestamp": "2026-01-07T13:45:22Z",
  "test": "tests/ui/specs/cart/cartManagement.spec.ts:58",
  "failure": "Timeout waiting for Continue button",
  "rootCause": "Missing visibility check before click",
  "fixApplied": "Added await expect(continueButton).toBeVisible()",
  "verificationResult": "3/3 passes",
  "status": "HEALED"
}
```

---

## Roadmap

### Current Status (Q1 2026)

- ✅ Test Healer agent implemented and operational
- ✅ MCP integration for diagnosis
- ✅ Automatic fix application for common issues
- ✅ Verification with 3x repetition
- ✅ FIXME marking for unfixable tests

### Future Enhancements (Q2 2026)

- [ ] Healing metrics dashboard
- [ ] Automatic PR creation for fixes
- [ ] Slack/email notifications for healing events
- [ ] Advanced AI suggestions for complex failures
- [ ] Historical healing trend analysis

---

## Checklist for Using Test Healer

- [x] Playwright MCP server configured and running
- [x] Test suite has consistent locator strategy
- [x] Trace capture enabled on failure
- [x] Agent has access to all instruction files
- [x] Environment variables configured
- [ ] CI integration for automatic healing (planned)
- [ ] Team training on reviewing healed tests

---

## Additional Resources

- [MCP Usage Guide](MCP_USAGE.md) - Setup and usage of Playwright MCP
- [Locator Strategy Guide](../.github/instructions/locator_strategy.instructions.md) - Best practices for selectors
- [Assertion Guide](../.github/instructions/assertion_guide.instructions.md) - Proper assertion patterns
- [Playwright Auto-Waiting](https://playwright.dev/docs/actionability)
- [Playwright Trace Viewer](https://playwright.dev/docs/trace-viewer)

---

**Last Updated:** January 7, 2026  
**Status:** Active - Test Healer agent operational and healing tests autonomously  
**Maintainer:** AI Agent (with human oversight)

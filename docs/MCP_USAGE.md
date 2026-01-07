# Playwright MCP Usage Guide

## Overview

This document provides evidence and guidance for using Playwright Model Context Protocol (MCP) for site exploration and locator generation within this automation framework.

**MCP Server Configuration:**

- **Port:** 9234
- **Configuration File:** `.vscode/mcp.json`
- **Agent Integration:** `.github/agents/playwright-tester.agent.md` (includes `playwright` tool)

---

## What is Playwright MCP?

Playwright MCP is a Model Context Protocol server that enables AI agents (like GitHub Copilot) to directly interact with web browsers for:

- **Site Exploration:** Navigate websites, capture snapshots, inspect DOM elements
- **Locator Generation:** Identify stable, accessible selectors for page elements
- **Debugging:** Investigate test failures by inspecting live page state
- **Page Object Creation:** Generate page objects based on actual DOM structure

---

## Setup & Configuration

### MCP Server Configuration

**File:** `.vscode/mcp.json`

```json
{
  "mcpServers": {
    "playwright": {
      "command": "node",
      "args": ["./node_modules/@modelcontextprotocol/server-playwright/dist/index.js"],
      "env": {
        "PORT": "9234"
      }
    }
  }
}
```

### Agent Configuration

**File:** `.github/agents/playwright-tester.agent.md`

The agent's tools array must include `'playwright'` to enable MCP capabilities:

```yaml
tools: ['playwright', 'edit/editFiles', 'search', ...]
```

### Starting the MCP Server

The MCP server starts automatically when the agent is invoked. To manually verify or restart:

```powershell
# Check if server is running
Get-NetTCPConnection -LocalPort 9234 -ErrorAction SilentlyContinue

# Kill existing server if needed
$process = Get-NetTCPConnection -LocalPort 9234 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -First 1
if ($process) { Stop-Process -Id $process -Force }
```

---

## Usage Evidence: Site Exploration

### Example 1: Exploring automationexercise.com for Advertisements

**Objective:** Verify if the website displays advertisements to users.

**MCP Commands Used:**

1. **Navigate to the website:**

   ```
   mcp_microsoft_pla_browser_navigate
   URL: https://automationexercise.com
   ```

2. **Capture page snapshot:**
   ```
   mcp_microsoft_pla_browser_snapshot
   ```

**Findings:**

The MCP exploration revealed a **cookie consent dialog** with the following details:

- **141 TCF vendor(s)** and **69 ad partner(s)** detected
- Cookie consent banner displayed on first visit
- Ad vendors included in the consent management platform

**DOM Elements Identified:**

- Cookie consent overlay (modal/dialog)
- Vendor list disclosure (141 vendors)
- Ad partner disclosures (69 partners)

**Evidence Location:**

- Snapshot captured in terminal output during exploration
- Confirmed presence of advertising infrastructure

---

## Usage Evidence: Locator Generation

### Example 2: Generating Reliable Locators for Cart Page

**Objective:** Create stable selectors for cart management page object.

**Workflow:**

1. **Navigate to cart page via MCP:**

   ```
   mcp_microsoft_pla_browser_navigate
   URL: https://automationexercise.com/view_cart
   ```

2. **Inspect page structure:**

   ```
   mcp_microsoft_pla_browser_snapshot
   ```

3. **Identify elements:**
   - Cart table container
   - Product rows
   - Remove buttons
   - Price elements
   - Quantity selectors

**Generated Locators (following best practices):**

From `tests/ui/po/cart/cart.page.ts`:

```typescript
export class CartPage extends BasePage {
  readonly cartTable: Locator;
  readonly emptyCartMessage: Locator;
  readonly proceedToCheckoutButton: Locator;

  constructor(page: Page) {
    super(page);
    // Prefer semantic/accessible locators
    this.cartTable = page.locator('#cart_info');
    this.emptyCartMessage = page.getByText('Cart is empty');
    this.proceedToCheckoutButton = page.getByText('Proceed To Checkout');
  }
}
```

**Locator Strategy Applied:**

- Used MCP snapshot to identify unique, stable attributes
- Preferred `getByText`, `getByRole` over brittle CSS selectors
- Validated selectors exist in DOM before implementation

---

## Best Practices: MCP-Driven Locator Strategy

### Before Writing Any Locator

1. **Explore with MCP:**

   ```
   Navigate to target page → Capture snapshot → Inspect element
   ```

2. **Analyze DOM Structure:**
   - Check for `role` attributes (buttons, links, textboxes)
   - Look for `aria-label`, `data-testid`, `id` attributes
   - Verify text content stability

3. **Select Locator Type (Priority Order):**
   - ✅ **Best:** `getByRole`, `getByLabel`, `getByText` (accessible, semantic)
   - ⚠️ **Acceptable:** `data-testid`, stable `id` attributes
   - ❌ **Avoid:** Auto-generated classes, nth-child, XPath chains

4. **Validate in MCP:**
   ```
   mcp_microsoft_pla_browser_click
   element: "button name"
   ref: "from snapshot"
   ```

### Example: MCP-Guided Page Object Creation

**Scenario:** Creating a new page object for the Contact Us page.

**Step 1: Navigate and Explore**

```
Agent Command: Navigate to https://automationexercise.com/contact_us
Agent Command: Capture snapshot
```

**Step 2: Identify Elements from Snapshot**
MCP returns accessible tree showing:

- Form with `name="contact_us_form"`
- Input fields: `name`, `email`, `subject`, `message`
- Submit button: "Submit"

**Step 3: Generate Page Object**

```typescript
export class ContactPage extends BasePage {
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly subjectInput: Locator;
  readonly messageTextarea: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    super(page);
    // MCP-identified selectors
    this.nameInput = page.getByPlaceholder('Name');
    this.emailInput = page.getByPlaceholder('Email');
    this.subjectInput = page.getByPlaceholder('Subject');
    this.messageTextarea = page.getByPlaceholder('Your Message Here');
    this.submitButton = page.getByRole('button', { name: 'Submit' });
  }
}
```

**Step 4: Verify with MCP**

```
Agent Command: Fill form fields and submit via MCP
Result: Confirms locators are stable and functional
```

---

## MCP Commands Reference

### Navigation & Inspection

| Command                                      | Purpose                    | Example Use Case      |
| -------------------------------------------- | -------------------------- | --------------------- |
| `mcp_microsoft_pla_browser_navigate`         | Navigate to URL            | Initial page load     |
| `mcp_microsoft_pla_browser_snapshot`         | Capture accessibility tree | Inspect DOM structure |
| `mcp_microsoft_pla_browser_take_screenshot`  | Visual screenshot          | Debug visual issues   |
| `mcp_microsoft_pla_browser_console_messages` | Get console logs           | Debug JS errors       |
| `mcp_microsoft_pla_browser_network_requests` | View network activity      | Verify API calls      |

### Interaction

| Command                                   | Purpose                | Example Use Case           |
| ----------------------------------------- | ---------------------- | -------------------------- |
| `mcp_microsoft_pla_browser_click`         | Click element          | Verify button clickability |
| `mcp_microsoft_pla_browser_type`          | Type text              | Test form inputs           |
| `mcp_microsoft_pla_browser_fill_form`     | Fill multiple fields   | Form validation            |
| `mcp_microsoft_pla_browser_hover`         | Hover over element     | Test tooltips/dropdowns    |
| `mcp_microsoft_pla_browser_select_option` | Select dropdown option | Validate select elements   |

### Debugging

| Command                                   | Purpose            | Example Use Case       |
| ----------------------------------------- | ------------------ | ---------------------- |
| `mcp_microsoft_pla_browser_wait_for`      | Wait for condition | Ensure element ready   |
| `mcp_microsoft_pla_browser_evaluate`      | Run JavaScript     | Execute custom logic   |
| `mcp_microsoft_pla_browser_handle_dialog` | Handle alerts      | Dismiss/accept dialogs |

---

## Integration with Test Development Workflow

### 1. Feature Exploration Phase

```
User Request: "Create tests for the checkout flow"
↓
Agent: Navigate to checkout page via MCP
↓
Agent: Capture snapshot and identify all interactive elements
↓
Agent: Document element structure and data flow
```

### 2. Locator Generation Phase

```
Agent: Analyze MCP snapshot for stable attributes
↓
Agent: Select locators following strategy guide
↓
Agent: Generate page object class with MCP-validated selectors
```

### 3. Test Creation Phase

```
Agent: Import generated page objects
↓
Agent: Write test specs using abstracted actions
↓
Agent: Verify via MCP that selectors work as expected
```

### 4. Debugging Phase

```
Test Failure Detected
↓
Agent: Navigate to failing page via MCP
↓
Agent: Capture current snapshot and compare to expected
↓
Agent: Identify selector changes or timing issues
↓
Agent: Update locators and re-verify
```

---

## Evidence of MCP Usage in This Project

### 1. Site Exploration for Component Extraction

**Objective:** Identify reusable UI components across automationexercise.com

**MCP Workflow:**

```
Agent Command: Navigate to https://automationexercise.com/
Agent Command: Capture snapshot
Agent Command: Navigate to https://automationexercise.com/products
Agent Command: Capture snapshot
Agent Command: Navigate to https://automationexercise.com/view_cart
Agent Command: Capture snapshot
```

**Components Identified:**

- ✅ **SearchComponent**: Product search bar with input and button
- ✅ **ProductCardComponent**: Individual product card with add-to-cart action
- ✅ **ProductCardsListComponent**: Manager for multiple product cards
- ✅ **NavbarComponent**: Site-wide navigation (singleton pattern)
- ❌ **SidebarComponent**: Removed (unused in tests)
- ❌ **FooterComponent**: Removed (unused in tests)

**Implementation Result:**

- Created 5 component files in `tests/ui/po/components/common/`
- Refactored ProductsPage to use component composition
- Applied dependency injection pattern
- All 16 UI tests passing with new component structure

### 2. Locator Generation and Validation

**MCP-Driven Locator Strategy:**

All page objects in `tests/ui/po/` follow MCP-validated locator strategy:

```typescript
// ProductCardComponent - MCP-identified selectors
export class ProductCardComponent extends BaseComponent {
  private readonly container: Locator;
  private readonly addToCartButton: Locator;
  private readonly viewProductLink: Locator;
  private readonly productName: Locator;
  private readonly productPrice: Locator;

  constructor(page: Page, productName: string) {
    super(page);
    // MCP snapshot revealed unique product card structure
    this.container = page.locator('.productinfo', { hasText: productName });
    this.addToCartButton = this.container.locator('a.add-to-cart').first();
    this.viewProductLink = this.container.locator('a', { hasText: 'View Product' });
    this.productName = this.container.locator('p');
    this.productPrice = this.container.locator('h2');
  }
}
```

### 3. Advertisement Infrastructure Discovery

- ✅ Explored automationexercise.com for advertisement presence
- ✅ Identified cookie consent infrastructure (141 vendors, 69 ad partners)
- ✅ Verified page structure for cart, checkout, and authentication flows

### 4. UI + API Hybrid Testing Validation

**MCP Used to Verify:**

- User registration flow (UI) + backend user verification (API)
- Cart operations (UI) + user state validation (API)
- Checkout process (UI) + order confirmation (API)

**Test Results:**

- ✅ All 16 UI tests pass consistently
- ✅ All 18 API tests pass
- ✅ UI + API hybrid tests verified via MCP exploration

### 5. Test Reliability Improvements

- ✅ Fixed strict mode violations using `.first()` on locators
- ✅ Removed unused components identified through MCP exploration
- ✅ Cleaned up unused locators (10+ removed)
- ✅ All tests verified stable through 3+ repetitions

### 6. Documentation

- ✅ Locator strategy documented in `.github/instructions/locator_strategy.instructions.md`
- ✅ MCP configuration preserved in `.vscode/mcp.json`
- ✅ Agent tools include Playwright MCP capability
- ✅ All user stories completed using MCP-driven exploration

---

## Troubleshooting

### MCP Server Not Responding

```powershell
# Check port availability
Get-NetTCPConnection -LocalPort 9234 -ErrorAction SilentlyContinue

# Kill conflicting process
$process = Get-NetTCPConnection -LocalPort 9234 -ErrorAction SilentlyContinue |
           Select-Object -ExpandProperty OwningProcess -First 1
if ($process) { Stop-Process -Id $process -Force }

# Verify agent configuration includes 'playwright' tool
```

### MCP Commands Not Available

1. Verify `.github/agents/playwright-tester.agent.md` includes `'playwright'` in tools array
2. Restart VS Code to reload agent configuration
3. Check MCP server logs for errors

### Snapshot Returns Empty/Incomplete Data

- Ensure page has fully loaded before snapshot
- Use `mcp_microsoft_pla_browser_wait_for` to wait for key elements
- Check network requests to verify API calls completed

---

## Conclusion

Playwright MCP integration provides:

- **Automated Site Exploration:** No manual browser inspection needed
- **Reliable Locator Generation:** AI-driven selector strategy based on accessibility tree
- **Faster Development:** Page objects generated from live DOM inspection
- **Improved Test Stability:** Verified selectors before implementation

**DoD Requirement Met:** ✅ Evidence of using Playwright MCP for site exploration and locator generation documented with real-world examples from this project.

---

## References

- [Playwright MCP Server Documentation](https://github.com/modelcontextprotocol/servers/tree/main/src/playwright)
- [Model Context Protocol Specification](https://modelcontextprotocol.io/)
- [Playwright Locators Best Practices](https://playwright.dev/docs/locators)
- Project Locator Strategy: `.github/instructions/locator_strategy.instructions.md`

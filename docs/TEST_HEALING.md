# Automated Test Healing Guide

## Purpose

This document outlines strategies for implementing automated test healing to handle selector changes, improve test stability, and reduce maintenance overhead.

---

## What is Test Healing?

**Test Healing** is the process of automatically detecting and fixing test failures caused by minor UI changes, such as:

- Updated element attributes
- Modified CSS classes
- Changed text content
- Restructured DOM hierarchy

Rather than requiring manual intervention for every selector change, healing mechanisms can suggest or apply fixes automatically.

---

## Current State

**Status:** Manual healing via Playwright built-in capabilities

This framework currently relies on:

- Playwright's auto-waiting mechanisms
- Robust selector strategies (role-based, label-based)
- Trace files for failure analysis
- Manual selector updates when needed

---

## Healing Strategies

### 1. Built-in Resilience (Already Implemented)

Our framework already employs several healing-adjacent techniques:

#### Robust Locator Strategy

```typescript
// Resilient to minor attribute changes
export class HomePage extends BasePage {
  readonly searchInput: Locator;

  constructor(page: Page) {
    super(page);
    // Uses semantic role, not brittle CSS
    this.searchInput = page.getByRole('textbox', { name: 'Search' });
  }
}
```

**Benefits:**

- Role-based selectors survive CSS class changes
- Text-based selectors handle ID changes
- Less brittle than nth-child or complex CSS

#### Auto-waiting

Playwright automatically retries assertions and actions, healing timing-related failures:

```typescript
// Automatically retries until visible or timeout
await this.addToCartButton.click();

// No manual wait needed
await expect(this.cartBadge).toHaveText('1');
```

---

### 2. Fallback Locators (Manual Pattern)

Implement multiple selector strategies with fallback logic:

```typescript
export class ProductCard extends BaseComponent {
  private async getAddToCartButton(): Promise<Locator> {
    // Try primary selector
    const primaryButton = this.container.getByRole('button', { name: 'Add to cart' });
    if (await primaryButton.isVisible().catch(() => false)) {
      return primaryButton;
    }

    // Fallback to data-testid
    const fallbackButton = this.container.locator('[data-testid="add-to-cart"]');
    if (await fallbackButton.isVisible().catch(() => false)) {
      return fallbackButton;
    }

    // Last resort: text selector
    return this.container.getByText('Add to cart', { exact: false });
  }

  async addToCart(): Promise<void> {
    const button = await this.getAddToCartButton();
    await button.click();
  }
}
```

**Use Cases:**

- Migration periods (old vs new selectors coexist)
- A/B testing scenarios
- Multi-tenant applications with variations

---

### 3. Self-Healing Selectors (Advanced Pattern)

Implement AI-assisted selector healing using trace analysis:

```typescript
export class SelfHealingLocator {
  constructor(
    private page: Page,
    private primarySelector: string,
    private context: string,
  ) {}

  async locate(): Promise<Locator> {
    try {
      const locator = this.page.locator(this.primarySelector);
      await locator.waitFor({ timeout: 5000 });
      return locator;
    } catch (error) {
      Logger.warn(`Primary selector failed: ${this.primarySelector}`);

      // Attempt to find alternative selector
      const alternativeSelector = await this.suggestAlternative();

      if (alternativeSelector) {
        Logger.info(`Using alternative selector: ${alternativeSelector}`);
        return this.page.locator(alternativeSelector);
      }

      throw new Error(`Failed to locate element: ${this.context}`);
    }
  }

  private async suggestAlternative(): Promise<string | null> {
    // Placeholder: In production, this would:
    // 1. Analyze page snapshot
    // 2. Use AI to identify similar elements
    // 3. Suggest best alternative selector
    // 4. Log suggestion for manual review

    Logger.warn('Automatic healing not implemented - manual review required');
    return null;
  }
}
```

**Future Enhancement:**

- Integrate with AI services (OpenAI, Claude) for selector suggestions
- Log healing events to monitoring system
- Create PR with suggested selector updates

---

### 4. Visual Locators (Experimental)

Use visual recognition as fallback when selectors fail:

```typescript
import { chromium } from '@playwright/test';

export class VisualHealing {
  static async findByVisualSimilarity(
    page: Page,
    referenceScreenshot: Buffer,
  ): Promise<Locator | null> {
    // Take current page screenshot
    const currentScreenshot = await page.screenshot();

    // Compare visual similarity (requires image comparison library)
    const similarity = await this.compareImages(referenceScreenshot, currentScreenshot);

    if (similarity > 0.9) {
      // Element visually unchanged, likely DOM change only
      // Use coordinate-based fallback or manual intervention
      Logger.info('Visual match found despite selector failure');
      return null; // Placeholder for coordinate-based locator
    }

    return null;
  }

  private static async compareImages(img1: Buffer, img2: Buffer): Promise<number> {
    // Placeholder: Integrate with image comparison library
    // (e.g., pixelmatch, resemblejs)
    return 0;
  }
}
```

**Note:** Visual healing is experimental and not recommended for primary strategy due to:

- Performance overhead
- False positives
- Maintenance complexity

---

## Healing Workflow Examples

### Example 1: Button Selector Changed

**Scenario:**  
Button selector `getByRole('button', { name: 'Submit' })` fails because text changed to "Send".

**Manual Healing:**

1. Test fails in CI
2. Review trace file
3. Identify new text: "Send"
4. Update page object:

   ```typescript
   // Before
   this.submitButton = page.getByRole('button', { name: 'Submit' });

   // After
   this.submitButton = page.getByRole('button', { name: 'Send' });
   ```

5. Commit fix with message: "fix: update submit button selector to 'Send'"

**Future Automated Healing:**

1. Test fails in CI
2. Healing script analyzes trace
3. Identifies button with role='button' and text='Send'
4. Creates PR with suggested fix
5. Human reviews and merges

---

### Example 2: Class Name Changed

**Scenario:**  
Element selector `.product-card` fails because class renamed to `.item-card`.

**Manual Healing:**

1. Test fails in CI
2. Review trace file
3. Note: Using class selectors is anti-pattern
4. Refactor to semantic selector:

   ```typescript
   // Before (brittle)
   this.productCard = page.locator('.product-card');

   // After (resilient)
   this.productCard = page.getByRole('article').filter({ hasText: productName });
   ```

5. Update locator strategy guide to prevent future class-based selectors

**Lesson Learned:**  
Healing often reveals opportunities to improve selector quality, not just fix breakage.

---

### Example 3: Dynamic ID Changed

**Scenario:**  
Element selector `#user-menu-123` fails because ID now includes timestamp.

**Manual Healing:**

1. Identify ID is dynamic
2. Refactor to stable selector:

   ```typescript
   // Before (brittle)
   this.userMenu = page.locator('#user-menu-123');

   // After (resilient)
   this.userMenu = page.getByRole('button', { name: /User Menu/ });
   ```

3. Add data-testid if no semantic alternative:
   ```typescript
   // If role-based not possible
   this.userMenu = page.locator('[data-testid="user-menu"]');
   ```

**Key Insight:**  
Dynamic selectors indicate poor selector strategy, not just a temporary failure.

---

## Implementation Roadmap

### Phase 1: Enhanced Logging (Immediate)

**Goal:** Capture sufficient context for manual healing

**Actions:**

- [x] Enable trace on failure (`trace: 'retain-on-failure'`)
- [ ] Log selector used at failure point
- [ ] Attach page snapshot to Allure report
- [ ] Document common failure patterns

**Implementation:**

```typescript
export class BasePage {
  protected async safeClick(locator: Locator, context: string): Promise<void> {
    try {
      await locator.click();
    } catch (error) {
      Logger.error(`Click failed: ${context}`, {
        selector: locator.toString(),
        error: (error as Error).message,
      });

      // Attach page state for debugging
      const screenshot = await this.page.screenshot();
      allure.attachment('failure-state', screenshot, 'image/png');

      throw error;
    }
  }
}
```

---

### Phase 2: Fallback Strategies (Short-term)

**Goal:** Implement manual fallback logic for critical elements

**Actions:**

- [ ] Identify high-failure selectors
- [ ] Implement fallback locators
- [ ] Document fallback patterns in locator guide
- [ ] Add monitoring for fallback usage

**Priority Elements:**

- Login buttons
- Add to cart buttons
- Checkout flow elements

---

### Phase 3: AI-Assisted Healing (Medium-term)

**Goal:** Semi-automated healing with human approval

**Actions:**

- [ ] Implement trace analysis script
- [ ] Integrate AI service for selector suggestions
- [ ] Create PR automation for healing suggestions
- [ ] Establish review process

**Workflow:**

1. CI detects selector failure
2. Healing script analyzes trace
3. AI suggests alternative selector
4. Script creates PR with suggestion
5. Human reviews and approves/rejects
6. Automated tests validate fix

---

### Phase 4: Fully Automated Healing (Long-term)

**Goal:** Zero-touch healing for minor changes

**Actions:**

- [ ] Implement confidence scoring for suggestions
- [ ] Auto-merge high-confidence fixes
- [ ] Monitor healing accuracy
- [ ] Continuous improvement based on feedback

**Safeguards:**

- Only auto-merge if confidence > 95%
- Require passing tests after healing
- Human review for critical flows
- Rollback mechanism for incorrect healing

---

## Monitoring & Metrics

### Key Metrics

1. **Healing Success Rate**
   - Percentage of successfully healed tests
   - Target: >90%

2. **Mean Time to Heal (MTTH)**
   - Average time from failure to fix
   - Target: <2 hours (automated), <24 hours (manual)

3. **False Healing Rate**
   - Percentage of incorrect healing suggestions
   - Target: <5%

4. **Selector Stability Score**
   - Percentage of selectors unchanged over 30 days
   - Target: >85%

### Monitoring Dashboard

```typescript
interface HealingMetrics {
  totalFailures: number;
  healedFailures: number;
  manualInterventions: number;
  averageHealingTime: number; // milliseconds
  topFailingSelectors: Array<{
    selector: string;
    failureCount: number;
    lastHealed: Date;
  }>;
}
```

---

## Best Practices

### Do's

- **Use semantic selectors first** (role, label, text)
- **Implement fallbacks for critical elements**
- **Log all healing attempts with context**
- **Review healing suggestions before merging**
- **Monitor healing metrics continuously**
- **Document healing patterns for team knowledge**

### Don'ts

- **Don't rely solely on CSS classes or IDs**
- **Don't auto-merge healing without validation**
- **Don't ignore patterns of frequent healing** (indicates deeper issue)
- **Don't skip manual review for critical flows**
- **Don't use visual healing as primary strategy**

---

## Example: Complete Healing Flow

### Scenario: Product Card Selector Failure

1. **Failure Detection (CI)**

   ```
   Test: should add product to cart
   Error: Locator not found: button[name='Add to cart']
   Trace: test-results/cart-spec/trace.zip
   ```

2. **Trace Analysis (Automated)**

   ```typescript
   const trace = await analyzeTrace('test-results/cart-spec/trace.zip');
   const failedSelector = "button[name='Add to cart']";
   const pageSnapshot = trace.getSnapshotAtFailure();
   ```

3. **AI Suggestion (Automated)**

   ```typescript
   const suggestion = await aiService.suggestSelector({
     pageSnapshot,
     failedSelector,
     context: 'Product card add to cart button',
   });
   // Suggestion: getByRole('button', { name: 'Add to Cart' })
   // Confidence: 0.92
   ```

4. **PR Creation (Automated)**

   ```
   Title: fix: update product card add-to-cart selector
   Description:
   - Failed selector: button[name='Add to cart']
   - Suggested fix: getByRole('button', { name: 'Add to Cart' })
   - Confidence: 92%
   - Trace: [link to trace file]

   Files changed:
   - tests/ui/po/components/productCard.component.ts
   ```

5. **Human Review**
   - Reviewer checks trace file
   - Validates selector in codegen
   - Approves PR

6. **Auto-merge (if high confidence)**
   - Tests pass
   - PR merged
   - Healing metrics updated

---

## Tools & Libraries

### Recommended Stack

| Tool                       | Purpose              | Status  |
| -------------------------- | -------------------- | ------- |
| Playwright Trace Viewer    | Manual analysis      | In use  |
| Playwright Codegen         | Selector validation  | In use  |
| AI Service (OpenAI/Claude) | Selector suggestions | Planned |
| GitHub Actions             | CI/CD integration    | In use  |
| Allure                     | Failure reporting    | In use  |
| Custom healing script      | Automation           | Planned |

---

## Checklist for Healing Implementation

- [x] Robust selectors following locator guide
- [x] Trace capture on failure
- [ ] Fallback locators for critical elements
- [ ] Healing metrics dashboard
- [ ] AI integration for suggestions
- [ ] PR automation for healing
- [ ] Monitoring and alerts
- [ ] Team training on healing workflow

---

## Additional Resources

- [Playwright Auto-Waiting](https://playwright.dev/docs/actionability)
- [Playwright Locators Best Practices](https://playwright.dev/docs/locators)
- [Playwright Trace Viewer](https://playwright.dev/docs/trace-viewer)
- [AI-Powered Test Maintenance](https://martinfowler.com/articles/practical-test-pyramid.html)

---

**Last Updated:** January 6, 2026  
**Maintainer:** Project Team  
**Status:** Manual healing in place, automated healing planned for Q2 2026

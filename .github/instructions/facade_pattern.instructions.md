---
applyTo: '**'
---

# Facade Pattern for Page Objects Guide

## Purpose

This guide defines best practices for implementing the Facade pattern in page objects to simplify complex workflows and merge similar operations.  
It is referenced by Copilot and reviewers to ensure page objects provide clean, high-level interfaces while reducing code duplication.

**Always consult this guide when creating or refactoring page object methods that have similar behavior or complex multi-step workflows.**

---

## What is the Facade Pattern?

The Facade pattern is a structural design pattern that provides a simplified interface to a complex subsystem. In the context of Page Object Model:

- **Merges similar operations** with slight variations into a single parameterized method
- **Combines multi-step workflows** into high-level methods that represent complete user journeys
- **Reduces duplication** and makes tests more readable and maintainable
- **Provides sensible defaults** while allowing customization when needed

---

## When to Apply the Facade Pattern

### 1. Merging Similar Methods

When you have multiple methods that perform almost the same actions with only minor variations:

**Before (Anti-pattern):**

```typescript
async addProductToCartAndContinue(productName: string): Promise<void> {
  const productCard = this.getProductCard(productName);
  await productCard.addToCart();
  await this.continueShoppingButton.click();
}

async addProductToCartAndViewCart(productName: string): Promise<void> {
  const productCard = this.getProductCard(productName);
  await productCard.addToCart();
  await this.viewCartLink.click();
}
```

**After (Facade pattern):**

```typescript
/**
 * Facade: Add product to cart with post-action (continue shopping or view cart)
 */
async addProductToCart(productName: string, action: 'continue' | 'viewCart' = 'continue'): Promise<void> {
  Logger.info(`Adding "${productName}" to cart with action: ${action}`);
  const productCard = this.getProductCard(productName);
  await productCard.addToCart();

  if (action === 'continue') {
    await this.continueShoppingButton.click();
  } else {
    await this.viewCartLink.click();
  }
}

// Keep original methods for backward compatibility if needed
async addProductToCartAndContinue(productName: string): Promise<void> {
  await this.addProductToCart(productName, 'continue');
}

async addProductToCartAndViewCart(productName: string): Promise<void> {
  await this.addProductToCart(productName, 'viewCart');
}
```

### 2. Combining Multi-Step Workflows

When a common user journey requires multiple page object methods in sequence:

**Before (Tests duplicate the workflow):**

```typescript
// In test file
await checkoutPage.addOrderComment('Please deliver before 5 PM');
await checkoutPage.placeOrder();
await checkoutPage.completePayment(paymentData);
```

**After (Facade in page object):**

```typescript
/**
 * Facade: Complete entire checkout flow (place order + payment)
 */
async completeCheckout(
  paymentData: PaymentData,
  comment?: string,
): Promise<void> {
  Logger.info('Completing entire checkout flow');

  if (comment) {
    await this.addOrderComment(comment);
  }

  await this.placeOrder();
  await this.completePayment(paymentData);
}

// In test file
await checkoutPage.completeCheckout(paymentData, 'Please deliver before 5 PM');
```

### 3. Registration/Authentication Flows

**Before:**

```typescript
// In test file
await authPage.startSignup(name, email);
await authPage.completeRegistration(userData);
await authPage.registrationForm.continueButton.click();
await authPage.loggedInUserText.waitFor();
if (shouldLogout) {
  await page.getByRole('link', { name: ' Logout' }).click();
}
```

**After (Facade):**

```typescript
/**
 * Facade: Complete user registration (signup + registration form + verification)
 */
async registerUser(userData: UserData, shouldLogout: boolean = false): Promise<void> {
  Logger.info(`Registering user: ${userData.email}`);

  await this.startSignup(userData.name, userData.email);
  await this.completeRegistration(userData);
  await this.registrationForm.continueButton.click();
  await this.loggedInUserText.waitFor({ state: 'visible' });

  if (shouldLogout) {
    await this.page.getByRole('link', { name: ' Logout' }).click();
    await this.page.waitForLoadState('domcontentloaded');
  }
}

// In test file
await authPage.registerUser(userData, true);
```

---

## Implementation Guidelines

### 1. Naming Conventions

- **Facade methods should be named after the business action**, not implementation details
  - Good: `completeCheckout()`, `registerUser()`, `addProductToCart()`
  - Bad: `clickButtonsAndFillForm()`, `doMultipleSteps()`

- **Use clear parameter names** that describe variations
  - Good: `action: 'continue' | 'viewCart'`
  - Bad: `flag: boolean`, `type: number`

### 2. Documentation

- **Always add a comment** indicating the method is a Facade:
  ```typescript
  /**
   * Facade: Complete entire checkout flow (place order + payment)
   */
  ```

### 3. Provide Sensible Defaults

- Use default parameters for common use cases:
  ```typescript
  async addProductToCart(productName: string, action: 'continue' | 'viewCart' = 'continue'): Promise<void>
  async registerUser(userData: UserData, shouldLogout: boolean = false): Promise<void>
  ```

### 4. Keep Atomic Methods

- **Do not remove** the original atomic methods
- Facade methods should **call** existing atomic methods, not duplicate their logic
- This maintains flexibility for tests that need fine-grained control

### 5. Logging

- Add meaningful log messages in Facade methods:
  ```typescript
  Logger.info(`Completing entire checkout flow`);
  Logger.info(`Registering user: ${userData.email}`);
  ```

---

## Common Patterns for Facade Implementation

### Pattern 1: Action Variation

```typescript
async performAction(item: string, followUp: 'continue' | 'exit' | 'verify'): Promise<void> {
  await this.doMainAction(item);

  switch (followUp) {
    case 'continue':
      await this.continueButton.click();
      break;
    case 'exit':
      await this.exitButton.click();
      break;
    case 'verify':
      await this.verificationElement.waitFor();
      break;
  }
}
```

### Pattern 2: Optional Steps

```typescript
async completeFlow(requiredData: Data, optionalStep?: string): Promise<void> {
  await this.step1(requiredData);

  if (optionalStep) {
    await this.step2(optionalStep);
  }

  await this.step3();
}
```

### Pattern 3: Workflow Composition

```typescript
async completeUserJourney(userData: UserData): Promise<void> {
  await this.navigate();
  await this.fillForm(userData);
  await this.submitForm();
  await this.verifySuccess();
}
```

---

## Anti-Patterns to Avoid

### ❌ Over-Engineering

```typescript
// Too generic, unclear purpose
async doEverything(data: any, options: any): Promise<void>
```

### ❌ God Methods

```typescript
// Too many responsibilities
async completeEntireApplication(user, products, payment, shipping, preferences): Promise<void>
```

### ❌ Duplicating Logic

```typescript
// Facade should call existing methods, not duplicate
async completeCheckout(paymentData): Promise<void> {
  // ❌ Bad: duplicating logic from completePayment()
  await this.cardNumberInput.fill(paymentData.cardNumber);
  await this.cvcInput.fill(paymentData.cvc);

  // ✅ Good: reuse existing method
  await this.completePayment(paymentData);
}
```

### ❌ Breaking Abstraction

```typescript
// ❌ Facade exposing internal page structure
async completeCheckout(page: Page): Promise<void> {
  await page.locator('.some-selector').click();
}

// ✅ Use this.page or component methods
async completeCheckout(): Promise<void> {
  await this.placeOrderButton.click();
}
```

---

## Benefits of Facade Pattern

1. **Reduced Test Code**: Tests become shorter and more readable
2. **DRY Principle**: Eliminate duplication across test files
3. **Maintainability**: Changes to workflows update in one place
4. **Readability**: High-level methods match business language
5. **Flexibility**: Keep atomic methods for edge cases

---

## Checklist for Reviewers & Copilot

- [ ] Are similar methods merged into a parameterized facade?
- [ ] Do facade methods have clear, descriptive names?
- [ ] Are default parameters provided for common use cases?
- [ ] Is the facade method documented with a `Facade:` comment?
- [ ] Does the facade call existing atomic methods (no logic duplication)?
- [ ] Are atomic methods retained for flexibility?
- [ ] Is appropriate logging added?
- [ ] Are anti-patterns (god methods, over-engineering) avoided?

---

## References

- [Refactoring Guru - Facade Pattern](https://refactoring.guru/design-patterns/facade)
- [Martin Fowler - Page Object](https://martinfowler.com/bliki/PageObject.html)
- [DRY Principle](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)

---

**Reference this guide when creating or refactoring page objects with similar or multi-step operations. Clean facades lead to maintainable tests!**

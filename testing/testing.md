### 🔍 Choosing the Right Testing Strategy

- **`shallow()`** – Use for **unit testing** a component in isolation (no children, minimal rendering).
- **`mount()`** – Use for **integration testing** when child components or lifecycle methods are important.

---

### 📐 The FIRST Testing Principles

| Principle | Meaning                               |
|----------|----------------------------------------|
| **F**     | Fast – Tests should execute quickly     |
| **I**     | Isolated – Tests should not depend on each other |
| **R**     | Repeatable – Same result every time    |
| **S**     | Self-Validating – Clear pass/fail outcome |
| **T**     | Timely – Write tests early, with your code |

---

### 🧪 Testing Pyramid

```
       ▲
       │  E2E (Playwright)
       │  – Critical user journeys
       │
       │  Integration Tests
       │  – Components & services working together
       │
       │  Unit Tests
       │  – Logic, pure functions, isolated components
       └──────────────────────────────
```

---

### 🧰 E2E Test Example (Playwright)

```js
// Arrange
const page = await browser.newPage();

// Act
await page.goto("https://example.com");
await page.click("text=Login");

// Assert
await expect(page).toHaveURL(/dashboard/);
```

---

### 🧼 Keep Tests Maintainable

- Use **clear test names** and `data-testid` for targeting elements.
- Group related tests using `describe()` blocks.
- Avoid complex logic within tests.

---

### ⚠️ E2E Testing Tips

- **Minimize mocks** – Only mock external services if they’re unavailable or costly.
- Focus on **real user flows** – Keep it close to how users interact with the app.

For critical flows (e.g., login, checkout, onboarding), test:

- ✅ **Happy path** (ideal behavior)
- ❌ **Validation errors**
- ❗ **Network failures** (simulate via Playwright intercepts)

# Project Design System & Styling Governance

## 🏛️ Architecture Overview
This project uses a **Token-Driven Architecture**. All styling must be derived from the centralized design tokens to ensure maintainability, scalability, and seamless dark-mode support.

**Source of Truth:** [design-tokens.ts](file:///Users/divalsehgal/Documents/dpjs/machine-coding/react-projects/src/styles/design-tokens.ts)
**Consumption Layer:** [index.css](file:///Users/divalsehgal/Documents/dpjs/machine-coding/react-projects/src/index.css) (via `@theme`)

---

## 📜 Mandatory Rules (Zero Tolerance)

### 1. No Arbitrary Values
❌ **Incorrect:** `className="mt-[13px] text-[#ff0000]"`
✅ **Correct:** `className="mt-4 text-error"`

> **Reason:** Arbitrary values create "Magic Numbers" that are impossible to update globally.

### 2. No Inline Styles for Visuals
❌ **Incorrect:** `style={{ color: '#123456' }}`
✅ **Correct:** Use a Tailwind class or a semantic variable.

> **Reason:** Inline styles bypass the Tailwind engine and dark-mode logic.

### 3. Use Semantic Tokens over Primitives
❌ **Incorrect:** `className="text-slate-900"` (Will stay black in dark mode)
✅ **Correct:** `className="text-text-main"` (Will automatically turn white in dark mode)

---

## 🎨 Token Reference

| Type | Tailwind Class / Token | Usage |
| :--- | :--- | :--- |
| **Surface** | `bg-canvas` | Main app background |
| **Surface** | `bg-surface` | Card / Modal background |
| **Text** | `text-text-main` | Primary reading text |
| **Text** | `text-text-muted` | Labels, side-notes |
| **Brand** | `text-brand-500` | Branding / Emphasis |
| **Status** | `text-success` | Success messages |

---

## 🛠️ Enforcement
This project uses **ESLint** to block violations.
- **`tailwindcss/no-arbitrary-value`**: Set to `error`.
- Build will fail if magic numbers are detected.

---

## 🌓 Dark Mode
Dark mode is implemented via CSS Variable overrides. Simply add the `.dark` class to any parent container (usually `html` or `body`) to toggle the entire system.

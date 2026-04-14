# React Accessibility (a11y) Cheat Sheet

## 1. Forms: Linking Labels (`htmlFor` ↔ `id`)

It connects a text label to an input. When standard users click the label, the input gets automatically focused. For screen readers, it announces the input's name properly.

`htmlFor` on a `<label>` must match the `id` on the `<input>`, `<select>`, or `<textarea>`.

```tsx
// React (JSX)
<label htmlFor="username-input">Username:</label>
<input type="text" id="username-input" />
```

---

## 2. Relationships via IDs (`aria-controls`, `aria-labelledby`, `aria-describedby`)

Assistive technologies can't "see" the visual layout of your app. ARIA attributes use IDs to explicitly declare relationships between different components.

### A. `aria-controls` ↔ `id`

`aria-constrols` should match with `id` of the element that it controls.

Tells the screen reader that interacting with the current element will affect or control *another* element.

Tabs controlling Panels, Accordion Buttons controlling Accordion Bodys, Menus controlling Dropdown Lists.

```tsx
// Accordion Example
<button aria-controls="accordion-content-1" aria-expanded={isOpen}>
  Toggle Details
</button>
<div id="accordion-content-1" hidden={!isOpen}>
  Here are the hidden details...
</div>
```

### B. `aria-labelledby` ↔ `id`

Replaces the element's accessible name with the text content of another element.
Modals/Dialogs taking their title from an internal heading, or Tab Panels getting their names from the Tab buttons.

```tsx
// Modal Example
<div role="dialog" aria-labelledby="dialog-title">
  <h2 id="dialog-title">Confirm Deletion</h2>
  <p>Are you sure you want to delete this?</p>
</div>
```

### C. `aria-describedby` ↔ `id`

Provides supplementary descriptive text (like hints or validation errors) to a primary element.

Input hint texts, form validation error messages.

```tsx
<input type="password" aria-describedby="pwd-hint" />
<p id="pwd-hint">Password must be at least 8 characters long.</p>
```

---

## 3. Common ARIA Roles (The "What is this?" attribute)

Roles tell the screen reader what kind of element they are looking at, dictating how the user should interact with it.

If semantic HTML already exists (e.g., `<button>`, `<nav>`, `<input>`), use it! Do NOT use a `<div>` with `role="button"` unless absolutely necessary. Semantic HTML gives you keyboard support (Tab, Enter, Space) out of the box!

### Document Structure Roles

*Use these when you can't use semantic tags like `<main>` or `<nav>`.*

- `role="main"`: The primary content of the page.
- `role="navigation"`: A navigation block (usually a menu).
- `role="search"`: A search form container.
- `role="banner"`: The site's main header/logo area.

### Actionable Widget Roles

*Use these when standard interactive elements aren't visually customizable enough.*

- `role="button"`: An element you click to trigger an action (Requires you to manually add `tabIndex={0}` and an `onKeyDown` handler for 'Enter'/'Space').
- `role="link"`: An element that navigates the user to a new location.
- `role="checkbox"` / `role="switch"`: A toggleable custom component. Needs `aria-checked="true/false"`.

### Complex Composite Roles (Like Tabs)


- `role="tablist"`: Contains a set of tabs.
- `role="tab"`: The clickable tab header itself.
- `role="tabpanel"`: The content that is shown/hidden when a tab is selected.

In a `tablist`, you must manually manage keyboard focus using arrow keys! (Left/Right to move between tabs).

### Live Regions (Feedback / Status)

*Use these to force the screen reader to actively announce changes on the screen, even if the user isn't currently focused on that area.*

- `role="alert"`: Highly important, time-sensitive text (like a "Form Submission Failed" banner). It interrupts whatever the screen reader is currently saying.

  ```tsx
  <div role="alert" className="error-banner">
    Invalid email address provided!
  </div>
  ```

- `role="status"`: Advising information (like "Changes Saved"). The screen reader will announce it gracefully when it's done reading its current text.

  ```tsx
  <div role="status" className="toast-message">
    Your profile has been updated successfully.
  </div>
  ```

---

## Example: Connecting it all together (Tabs)

```tsx
<div className="tabs" role="tablist">
  {/* The Tab Button */}
  <button 
    role="tab" 
    id="tab-1" 
    aria-controls="panel-1"  // Connects tab action to the panel
    aria-selected="true"     // State
  >
    Profile
  </button>
</div>

{/* The Content Panel */}
<div 
  role="tabpanel" 
  id="panel-1"              // Connects to aria-controls above
  aria-labelledby="tab-1"   // Connects to the Tab's text (reads "Profile Panel")
>
  User profile details...
</div>
```

---

## 4. More Essential A11y Concepts & Attributes

### A. Managing Focus (`tabIndex`)

Keyboard navigation is fundamental to accessibility.

- **`tabIndex="0"`**: Adds an element to the natural keyboard tab sequence (useful for a custom `<div role="button">`).
- **`tabIndex="-1"`**: Removes an element from the natural tab flow, BUT allows it to receive *programmatic focus* via JavaScript (`ref.current.focus()`). Heavily used in managing focus for Modals/Dialogs so users don't accidentally tab outside the modal.

### B. Hiding Elements (`aria-hidden` vs. Screen-Reader Only)

Sometimes you want sighted users to see things screen readers shouldn't, or vice-versa.

- **`aria-hidden="true"`**: Hides the element from screen readers, but it remains visually visible on screen. Perfect for decorative icons (`<svg>`) that sit next to clear text labels.
- **Screen Reader Only (CSS `.sr-only`)**: Hides the element visually, but keeps it strictly readable by screen readers. Used to provide context that visually capable users intuitively infer from the UI.

  ```css
  /* The universally standard sr-only CSS class */
  .sr-only {
    position: absolute; width: 1px; height: 1px; padding: 0;
    margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0;
  }
  ```

### C. Dropdowns & Collapse Menus (`aria-expanded` and `aria-haspopup`)

Critical for components that reveal hidden content.

- **`aria-expanded="true/false"`**: Read dynamically to screen readers. Tells them if the target content (accordion, dropdown) is currently visible or collapsed.
- **`aria-haspopup="true/menu/listbox"`**: Indicates that the element triggers a popup (a menu, dialog, or listbox).

  ```tsx
  <button aria-haspopup="menu" aria-expanded={isOpen} aria-controls="dropdown-menu">
    Actions
  </button>
  ```

### D. Dynamic Content (`aria-live`)

Used to announce content changes that happen dynamically *without* a page reload or context shift (like Toast Notifications or Loading states).

- **`aria-live="polite"`**: The screen reader will finish reading its current text before it gracefully announces the new change. Best for standard notifications or completed loads.
- **`aria-live="assertive"`**: The screen reader will immediately interrupt itself to violently read the change. Use sparingly, reserved for critical errors.

```tsx
{/* Screen readers will automatically announce when text inside here changes */}
<div aria-live="polite" className="toast-container">
  {notificationText} 
</div>
```

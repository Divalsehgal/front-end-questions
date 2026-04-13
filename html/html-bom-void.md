# HTML Core Concepts

## 1. DOM vs BOM

While they are often confused, they serve entirely different purposes in the browser.

### DOM (Document Object Model)
* **What it is:** The programmatic interface for the HTML document itself. It translates the raw HTML code into a tree of objects.
* **Scope:** Everything inside the webpage (the `document` object).
* **Usage:** Used to read/write HTML elements, change CSS styles dynamically, and attach event listeners to buttons/divs.
* **Examples:** `document.getElementById()`, `document.createElement()`, `document.body`

### BOM (Browser Object Model)
* **What it is:** The programmatic interface for the **Browser Window** itself. 
* **Scope:** Everything outside the website content. The DOM (`document`) is actually just one property inside the BOM.
* **Usage:** Used to communicate with the browser, read screen resolution, redirect URLs, view navigation history, or trigger alerts.
* **Examples:**
  * `window.location` (URL details)
  * `window.history` (Back/Forward buttons)
  * `window.navigator` (User's browser specs, OS, Geolocation)
  * `window.alert()`, `window.setTimeout()`

> **Summary:** The **DOM** is about the Website Content. The **BOM** is about the Browser Application hosting the website.

---

## 2. Void Elements

As you correctly noted, a **void element** is an element in HTML that cannot have any child nodes, nesting, or inner text. 

Because they cannot contain anything, they do not require (and are not allowed to have) a closing tag in HTML5.

### Common Void Elements:
* `<img>` - Visual content defined purely by its `src` attribute.
* `<input>` - Forms accept data via attributes, not nested text.
* `<br>` - Line break.
* `<hr>` - Horizontal rule (line).
* `<meta>` - Metadata strictly uses attributes like `name` and `content`.
* `<link>` - Linking CSS stylesheets.

### ❌ Incorrect usage:
```html
<img src="cat.jpg">This is a cat</img> <!-- Invalid! -->
<input type="text">Default text</input> <!-- Invalid! -->
```

### ✅ Correct usage:
```html
<img src="cat.jpg" alt="This is a cat" /> <!-- Self-closing/Void -->
<input type="text" value="Default text" />
```
*(Note: The trailing slash `/` is optional in HTML5, but required in React/JSX due to XML strictness).*

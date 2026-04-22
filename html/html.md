# HTML Concepts & Trivia

This document details important semantic HTML tags and miscellaneous web concepts.

## 1. Important Semantic Tags

Semantic tags provide meaning to the web page rather than just presentation. Using them correctly improves accessibility and SEO.

### `<cite>`

Used to define the title of a creative work (such as a book, movie, song, painting, etc.) within a block of text.

```html
<p>My favorite book is <cite>The Hitchhiker's Guide to the Galaxy</cite>.</p>
```

### `<bdi>` (Bidirectional Isolation)

Used to isolate a span of text that might be formatted in a different direction from its surrounding text. This is crucial when dynamically inserting user-generated content where you don't know the text direction in advance (e.g., an English site rendering an Arabic username).

```html
<ul>
  <li>User <bdi>John</bdi>: 5 points</li>
  <li>User <bdi>إبراهيم</bdi>: 8 points</li>
</ul>
```

### `<bdo>` (Bidirectional Override)

Defines the direction of text display, either right-to-left (`rtl`) or left-to-right (`ltr`). This explicitly overrides the default behavior and direction of the document.

```html
<bdo dir="rtl">This text will go right to left.</bdo>
```

### `<track>`

Used in conjunction with the `<audio>` and `<video>` elements to specify external text track files (like subtitles, captions, or descriptions) for media elements.

```html
<video src="video.mp4">
  <!-- Adds English subtitles -->
  <track kind="subtitles" src="subtitles_en.vtt" srclang="en" label="English">
</video>
```

### `<dfn>` and `<dl>`

* **`<dfn>`:** Defines the defining instance of a term. Use this tag the first time you define a term in a paragraph.
* **`<dl>`:** Defines a description list. Usually used alongside `<dt>` (description term) and `<dd>` (description details).

```html
<!-- Example of dfn -->
<p>A <dfn id="html-def">HTML</dfn> is the standard markup language for documents designed to be displayed in a web browser.</p>

<!-- Example of dl -->
<dl>
  <dt>Coffee</dt>
  <dd>Black hot drink</dd>
  <dt>Milk</dt>
  <dd>White cold drink</dd>
</dl>
```

---

## 2. CSS/Web Trivia

### `rem` vs `em` Units

* **`rem`** (root `em`): Based purely on the font size of the root element (`<html>`). It is completely independent of the parent element's font size.
  * *Note: If the root font size is not explicitly set in the CSS, browsers typically default it to 16px. Therefore, 1rem = 16px.*
* **`em`**: Based on the font size of the immediate parent element. This can cause compounding sizing issues when elements are nested.

### `display: flex;` vs `display: inline-flex;`

* **`display: flex;`**: Creates a **block-level** flex container. It takes up the full width available and starts on a new line, similar to `display: block;`.
* **`display: inline-flex;`**: Creates an **inline-level** flex container. It only takes up as much width as it needs and sits side-by-side with other inline elements, similar to `display: inline-block;`.

---

## 3. Practical Project Takeaways

This section curates essential "valuable knowledge" extracted from the 13 machine coding / certification problems.

### Accessibility & Document Setup

* **`lang` attribute (e.g., `lang="ar"`)**: Aids screen readers in correctly pronouncing content for users of that language. It enhances overall accessibility and helps search engines correctly index your content.
* **`<meta charset="UTF-8">`**: Specifies the universal character encoding standard covering virtually all characters/symbols from all writing systems in the world.
* **`<meta name="viewport" content="width=device-width, initial-scale=1.0">`**: Essential for responsive design. It ensures the device's correct width is made available to the CSS.
* **Canonical Links (`<link rel="canonical" href="...">`)**: Tells search engines which version of a webpage is the "primary" or preferred URL. Useful when multiple URLs might point to the exact same content.

### Screen-Reader Only Elements (`sr-only`)

When you want to hide text from sighted users but still heavily instruct a screen reader, do **not** use `display: none` (which removes it entirely). Instead, use the standard `sr-only` utility pattern:

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

### Forms & Validation

* **`<fieldset>` and `<legend>`**: Used to group related form controls. The `<legend>` acts as the title/caption specifically for the parent `<fieldset>`.
* **Implicit Linking of Labels**: A label can be implicitly linked to an input by nesting the input inside the label: `<label>Name: <input></label>`. Explicitly, you bind them by matching the `<label for="id">` to the `<input id="id">`.
* **Radio Groups**: Radio buttons (`type="radio"`) will only allow a single selection if they all share the exact same `name` attribute.
* **HTML5 Built-In Validation & Behaviours**:
  * `autocomplete="on"`: Allows the browser to fill out predictable values.
  * `spellcheck="true"`: Enables the browser's native spell checker (great for `<textarea>`).
  * `pattern="[a-z0-5]{8,}"`: Enforces a Regex pattern before the form can be submitted.
  * `min` and `max`: Used on `<input type="number">` or `date` to strictly constrain numeric bounds.

### Semantics & Useful Properties

* **`<figure>` and `<figcaption>`**: Ideal semantic wrapper for any image (or media) and its direct caption.
* **`<caption>`**: Semantic tag for the title of a `<table>`. Must be inserted immediately after the `<table>` tag.
* **Accessibility Prefixes (`aria-labelledby`)**: Used to tie a `<section>` or non-text element to an `id` describing it, providing excellent context for screen readers.
* **Smooth Scrolling Preference**:

```css
/* Only apply smooth scrolling if the user hasn't explicitly requested reduced motion in their OS settings */
@media (prefers-reduced-motion: no-preference) {
  * {
    scroll-behavior: smooth;
  }
}
```

---

## 4. DOM vs BOM

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

## 5. Void Elements

As you correctly noted, a **void element** is an element in HTML that cannot have any child nodes, nesting, or inner text.

Because they cannot contain anything, they do not require (and are not allowed to have) a closing tag in HTML5.

### Common Void Elements

* `<img>` - Visual content defined purely by its `src` attribute.
* `<input>` - Forms accept data via attributes, not nested text.
* `<br>` - Line break.
* `<hr>` - Horizontal rule (line).
* `<meta>` - Metadata strictly uses attributes like `name` and `content`.
* `<link>` - Linking CSS stylesheets.

### ❌ Incorrect usage

```html
<img src="cat.jpg">This is a cat</img> <!-- Invalid! -->
<input type="text">Default text</input> <!-- Invalid! -->
```

### ✅ Correct usage

```html
<img src="cat.jpg" alt="This is a cat" /> <!-- Self-closing/Void -->
<input type="text" value="Default text" />
```

*(Note: The trailing slash `/` is optional in HTML5, but required in React/JSX due to XML strictness).*

---

# Semantic HTML

Semantic HTML is crucial for structuring web documents effectively. By utilizing semantic elements and following established patterns, we enhance accessibility, SEO, and maintainability of our code.

## Basic Structure

For headings and paragraphs, we commonly use the appropriate header tags (`<h1>` to `<h6>`) and the `<p>` tag, ensuring correct semantics.

### Sections

Instead of generic `<div>` elements, utilize `<section>` to encapsulate distinct parts of the document, especially for SEO-friendly markup.

### Images with Captions

When including images with captions, employ the `<figure>` and `<figcaption>` tags. This not only aids in captioning but also ensures semantic correctness.

```html
<figure>
  <img src="image.jpg" alt="Description" />
  <figcaption>Caption</figcaption>
</figure>
```

### Forms

For forms, nest `<input>` elements within `<label>` for better accessibility and usability.

```html
<label for="username">Username:
  <input type="text" id="username" name="username">
</label>
```

### Select Dropdowns

Associate `<label>` with `<select>` elements for accessibility.

**Trivia & Best Practices:**

* **Placeholder Pattern**: Use an empty `value=""` for the first option. To make it a non-selectable prompt, add `disabled hidden selected`.

* **Validation**: If `required` is present on the `<select>`, a value of `""` (empty string) is considered invalid by the browser's native validation.
* **React (Controlled)**: Unlike HTML where you use the `selected` attribute on an `<option>`, React expects a `value` prop on the `<select>` itself.
* **React Placeholder**: Initialize your state to `""` to match your placeholder option's value.

```html
<label for="referrer">How did you hear about us?</label>
<select id="referrer" name="referrer" required>
  <option value="" disabled selected hidden>(select one)</option>
  <option value="1">Option 1</option>
  <option value="2">Option 2</option>
</select>
```

### Articles within Sections

To create subsections within a section, use the `<article>` tag.

```html
<section>
  <h2>Section Title</h2>
  <article>
    <p>Content</p>
  </article>
</section>
```

### Accessibility Enhancements

Enhance accessibility using `role="region"` and `aria-labelledby` attributes to label sections.

```html
<section role="region" aria-labelledby="section-title">
  <h2 id="section-title">Section Title</h2>
  <!-- Content -->
</section>
```

## Window, DOM, and BOM in JavaScript

Understanding the Window Object, DOM, and BOM is fundamental for web development.

### Window Object

Represents the browser window and serves as the global context for JavaScript execution.

### Document Object Model (DOM)

Provides a structured representation of HTML documents, facilitating dynamic access and manipulation of document content.

### Browser Object Model (BOM)

Consists of browser-provided objects enabling interaction with the browser environment.

#### Key Components

* **Navigator**: Offers details about the browser.
* **Location**: Represents the URL of the current page.

```html
<!-- Example of a meta refresh: -->
<meta http-equiv="refresh" content="5">

<!-- Example of a form reload: -->
<form method="GET">
  <button type="submit">Reload</button>
</form>

<!-- Example of an anchor reload loop: -->
<a href="/">Reload</a>
```

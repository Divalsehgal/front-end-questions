```markdown
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

Similarly, associate `<label>` with `<select>` elements to enhance form accessibility.

```html
<label for="referrer">How did you hear about us?</label>
<select id="referrer" name="referrer">
  <option value="">(select one)</option>
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

#### Key Components:

- **Navigator**: Offers details about the browser.
- **Location**: Represents the URL of the current page.

```

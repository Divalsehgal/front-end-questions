# CSS Architecture Patterns

## Patterns for Writing CSS

As CSS grows in a large project, it can easily become a chaotic mess of specificities (`!important`) and unintended overrides. To fix this, the industry uses structured naming patterns.

### A. BEM (Block, Element, Modifier) 

BEM forces you to write flat, highly readable CSS with zero nesting specificity issues.

* **Block:** The standalone component (e.g., `card`)
* **Element:** A piece of the block (`__` prefix) (e.g., `card__title`)
* **Modifier:** A variation of a block or element (`--` prefix) (e.g., `card--active`)

**Example:**

```html

<div class="product-card product-card--featured">
  <h2 class="product-card__title">Shoes</h2>
  <button class="product-card__button">Buy</button>
</div>
```

### B. OOCSS (Object-Oriented CSS)

Focuses on separating the **Structure** from the **Skin**. You create reusable layout "objects" and attach purely visual "skins" to them.

* **Structure:** `.btn { padding: 10px; display: inline-block; }`
* **Skin:** `.btn-primary { background: blue; color: white; }`
* **Usage:** `<button class="btn btn-primary">`

### C. SMACSS (Scalable and Modular Architecture for CSS)

Categorizes CSS rules into 5 distinct buckets to keep them organized:

1. **Base:** Default HTML tags (`body`, `a`, `h1`)
2. **Layout:** Major layout sections (`.header`, `.footer`)
3. **Module:** Reusable UI components (`.card`, `.accordion`)
4. **State:** Dynamic changes (`.is-active`, `.is-hidden`)
5. **Theme:** Visual skins

### D. Utility-First (e.g., Tailwind CSS)

Instead of writing custom CSS classes, you use composition. Every CSS property gets its own single-purpose class.

* **Usage:** `<div class="p-4 bg-red-500 flex items-center">`

---

> See also: [`visual-effects.md`](./visual-effects.md) for masking, `clip-path`, and transform/GPU-compositing notes.

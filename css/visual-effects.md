# CSS Visual Effects & Performance

> See also: [`architecture.md`](./architecture.md) for CSS organization patterns (BEM, OOCSS, SMACSS, Utility-First).

## Masking in CSS (`mask-image`)

Masking allows you to hide parts of an element visually based on an image or gradient, exactly like an alpha-channel mask in Photoshop.

Wherever the mask is **transparent**, the element underneath becomes invisible. Wherever the mask is **opaque/black**, the element is visible.

### Example A: Image Masking (Silhouette)

If you have a solid blue `div`, but you want it shaped like a star icon.

```css

.star-shape {
  width: 200px;
  height: 200px;
  background-color: blue; /* The actual color shown */
  
  /* Applies the cut-out */
  -webkit-mask-image: url('star-icon.svg');
  mask-image: url('star-icon.svg');
  
  mask-size: contain;
  mask-repeat: no-repeat;
}
```

### Example B: Gradient Masking (Fade Out)

If you have a long scrolling piece of text, and you want the bottom of the text to slowly fade out into nothingness.

```css

.fade-out-text {
  /* Creates a mask that is solid at the top, but 100% transparent at the bottom */
  -webkit-mask-image: linear-gradient(to bottom, black 50%, transparent 100%);
  mask-image: linear-gradient(to bottom, black 50%, transparent 100%);
}
```

> **Note:** Masking is different from `clip-path`. `clip-path` creates hard vector-based geometric cuts. `mask-image` supports pixels, opacity fades, and alpha-channels.

> See also: [`html/web/shapes-lab`](../html/web/shapes-lab) is an interactive playground for building `clip-path` shapes (square, circle, star, hexagon, etc.) — a hands-on complement to the note above.

---

## CSS animation - Why transform attribute is preferred?

Transform is preferred because over other properties such as top left right bottom because when browser see a transform property used it will create a(off loading of resources)composite layer and it delegates
And that rendering will be done from GPU side Which will help in reducing the reflows and computation for CPU

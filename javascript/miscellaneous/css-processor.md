# CSS Preprocessors vs. Postprocessors

## Preprocessors (Enhance CSS before compiling)

### Examples:
- Sass
- LESS
- Stylus

### Features:
- Variables
- Nesting
- Mixins
- Functions

### Example (SCSS → Compiled CSS):
```scss
$color: #3498db;
button {
  background: $color;
}
```
⬇ Compiles to:
```css
button {
  background: #3498db;
}
```

---

## Postprocessors (Modify CSS after compilation)

### Examples:
- Autoprefixer
- PostCSS
- CSSNano

### Features:
- Vendor prefixes
- Minification
- Optimization

### Example (Autoprefixer Output):
```css
button {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
}
```

---

## Key Differences

| Feature         | Preprocessors         | Postprocessors       |
|----------------|----------------------|----------------------|
| **When**       | Before CSS compilation | After CSS generation |
| **Purpose**    | Improves writing      | Optimizes output     |
| **Use Cases**  | Nesting, mixins       | Autoprefixing, minifying |

🚀 **Preprocessors = Write better CSS**  
⚡ **Postprocessors = Optimize final CSS**


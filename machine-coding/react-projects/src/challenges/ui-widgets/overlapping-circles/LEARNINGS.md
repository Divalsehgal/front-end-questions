# Learning Gist: Overlapping Circles Logic

### 🧠 The Core Logic
Geometry-based detection in the browser to determine if two 2D elements are colliding.

### 🛠️ Implementation Strategy
1. **Coordinates**: Track each circle's center `(x, y)` and `radius`.
2. **Distance Formula**: Calculate the distance between two centers using the Pythagorean theorem: `dist = sqrt((x2-x1)^2 + (y2-y1)^2)`.
3. **Collision Detection**: If `distance < (radius1 + radius2)`, the circles are overlapping.
4. **State**: An array of circle objects, updating on every click or move.

### 🚀 FAANG Interview Tips
- **Performance**: Discussion on **Spatial Partitioning** or **Quadtrees** if handling thousands of circles to avoid O(N^2) checks.
- **SVG vs Canvas**: When to use each for rendering many circles (Canvas is better for high numbers/animations).

```javascript
const dist = Math.sqrt(Math.pow(c2.x - c1.x, 2) + Math.pow(c2.y - c1.y, 2));
const isOverlapping = dist < (c1.radius + c2.radius);
```

# Learning Gist: Google Calendar Clone

### 🧠 The Core Logic
Implementing a time-blocked grid and managing event overlaps. Tests complex layout calculations and date arithmetic.

### 🛠️ Implementation Strategy
1. **Time Mapping**: Map 24 hours to a vertical pixel height (e.g., 60px per hour).
2. **Event Positioning**: Use `top` based on `startTime` and `height` based on `duration` (end - start).
3. **Collision Detection**: If events overlap in time, they need to share the horizontal width.
4. **Logic**: Track columns of overlapping events. If 3 events overlap at a time, each gets 33.3% width.

### 🚀 FAANG Interview Tips
- **Advanced Logic**: The "Overlapping Events" problem (meeting rooms/calendars) is a classic algorithmic challenge. Use an interval-matching algorithm.
- **Library vs Vanilla**: Discuss why using a library like `date-fns` simplifies date math.

```javascript
const height = (endTime - startTime) * pixelsPerHour;
const top = (startTime - dayStart) * pixelsPerHour;
```

function findFarthestSeat(layout) {
  let farthestSeatIndex = -1;
  let maxDistance = -1;
  let prevOccupiedIndex = -1;

  for (let i = 0; i < layout.length; i++) {
    if (layout[i] === 1) {
      prevOccupiedIndex = i;
    } else if (i === layout.length - 1) {
      const distance = i - prevOccupiedIndex;

      if (distance > maxDistance) {
        maxDistance = distance;
        farthestSeatIndex = i;
      }
    } else if (prevOccupiedIndex === -1) {
      const distance = layout.length - i;

      if (distance > maxDistance) {
        maxDistance = distance;
        farthestSeatIndex = i;
      }
    }
  }

  return farthestSeatIndex;
}

const bestSeatIndex = findFarthestSeat([1, 0, 0, 0, 0, 0, 0, 0, 1, 0]);
console.log(bestSeatIndex);

// !----------------------------------------------------------------Iterator with Generator function----------------------------------------------------------------




function iterator(rangeStart, rangeEnd) {
  if (rangeStart == 0 && rangeEnd == 0) {
    return null;
  }

  var iterate = function* (start = 0, end = 5, step = 1) {
    let iterationCount = 0;
    for (let i = start; i <= end; i += step) {
      yield i;
      iterationCount = i;
    }
    return iterationCount;
  };

  var values = iterate(rangeStart, rangeEnd);
  var tmp = [];

  while (values.next().value != undefined) {
    tmp.push(values.next().value);
  }
  return tmp.join("");
}



console.log(iterator(0, 7));
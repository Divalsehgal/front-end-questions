// Symmteric Diffrence

function sym(...args) {

  // two diff functions
    
  const diff = (a, b) => {
    function includeFunc(a, b) {
      const temp = [];
      b.forEach((f) => !a.includes(f) && temp.push(f));
      return temp;
    }
    return includeFunc(a, b).concat(includeFunc(b, a));
  };

  const diff1 = (a, b) => {
    function filterFunc(a, b) {
      return b.filter((f) => a.indexOf(f) === -1);
    }
    return filterFunc(a, b).concat(filterFunc(b, a));
  };

  return [...new Set(args.reduce(diff1, []))];
}

sym([1, 2, 5], [2, 3, 5], [3, 4, 5]);
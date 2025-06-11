function tuples(k, max) {
    const res = [];
    const buf = Array(k);          // work buffer of length k

    function dfs(pos) {
        if (pos === k) {             // full tuple ready
            res.push(buf.slice());     // store a copy
            return;
        }
        for (let v = 1; v <= max; v++) {
            buf[pos] = v;
            dfs(pos + 1);              // fill next slot
        }
    }

    dfs(0);                        // start filling from position 0
    return res;
}

console.log(tuples(2,5))
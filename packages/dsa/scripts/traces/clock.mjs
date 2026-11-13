// ---------- virtual clock so timer questions trace deterministically ----------
export function makeClock() {
  let time = 0;
  let nextId = 0;
  const timers = [];
  return {
    get time() {
      return time;
    },
    setTimeout(fn, ms) {
      const id = ++nextId;
      timers.push({ id, at: time + ms, fn });
      return id;
    },
    clearTimeout(id) {
      const i = timers.findIndex((x) => x.id === id);
      if (i >= 0) timers.splice(i, 1);
    },
    advance(ms) {
      const end = time + ms;
      for (;;) {
        timers.sort((a, b) => a.at - b.at || a.id - b.id);
        const next = timers[0];
        if (!next || next.at > end) break;
        timers.shift();
        time = next.at;
        next.fn();
      }
      time = end;
    },
  };
}

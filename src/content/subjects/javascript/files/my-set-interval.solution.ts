export function mySetInterval(fn: () => void, interval: number): () => void {
  let active = true;
  let timer: ReturnType<typeof setTimeout>;

  function run() {
    if (!active) return;
    fn();
    if (active) {
      timer = setTimeout(run, interval); // fn may have stopped us
    }
  }

  timer = setTimeout(run, interval);
  return () => {
    active = false;
    clearTimeout(timer);
  };
}

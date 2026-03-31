/*

Memory leaks in web applications happen when
 unused memory is not released, often due to 
 uncleaned side effects like subscriptions, timers, 
 event listeners, or pending async operations. Over time, 
 this increases heap memory usage, leading to performance 
 issues and UI unresponsiveness.

 Something still holds a reference to memory, 
 so garbage collector can’t clean it
*/

useEffect(() => {
    const controller = new AbortController();

    fetch("/api", { signal: controller.signal })
        .then(res => res.json())
        .then(data => setData(data));

    return () => controller.abort();
}, []);

useEffect(() => {
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
}, []);

useEffect(() => {
    const id = setInterval(() => {
        console.log("running");
    }, 1000);

    return () => clearInterval(id);
}, []);
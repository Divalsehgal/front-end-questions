async function get() {
  const res = await fetch("https://dummyjson.com/products"); // if await is not there then second line will execute and res will might be undefined because it is a async API call.

  const json = await res.json(); // and in this line i wont add await as its a async function i need to think how further it will effect my code in executing.

  console.log(json); // and this line wll eventually have to wait
}

get();

function get1() {
  fetch("https://dummyjson.com/products")
    .then((res) => res.json()) // but bere it will take this as a callaback res.json function then on resolve it will invoke
    .then((res1) => {
      console.log(res1);
    });
}

get1();

async function get() {
  const res = await fetch("https://dummyjson.com/products"); // if await is not there then second line will execute and res will might be undefined because it is a async API call.

  const json = await res.json(); // and in this line i wont add await as its a async function i need to think how further it will effect my code in executing.

  console.log(json); // and this line wll eventually have to wait
}
// If the response body is JSON, you must call.json() to parse it into a JavaScript object.
// If the response is text, HTML, or binary data, you’ll need to use.text(), .blob(), 
// or other methods depending on the content type.
// Some libraries or frameworks like axios
// may handle the parsing for you, so you don’t need to manually call.json().

get();

function get1() {
  fetch("https://dummyjson.com/products")
    .then((res) => res.json()) // but bere it will take this as a callaback res.json function then on resolve it will invoke
    .then((res1) => {
      console.log(res1);
    });
}

get1();

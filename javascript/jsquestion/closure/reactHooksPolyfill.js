/**
 * A simplified "Polyfill" of React Hooks to understand how Closures power React.
 * 
 * Notice how the `React` module uses closures to hide the `hooks` array 
 * and `currentHook` index from the global scope.
 */

const React = (function () {
  let hooks = []; // Array to store state values and effect dependencies
  let currentHook = 0; // Tracks which hook we are currently on during a render

  return {
    render(Component) {
      const Comp = Component(); // Run the component
      currentHook = 0; // Reset the hook index after rendering so the next render starts at 0
      return Comp;
    },

    useState(initialValue) {
      // Capture the current hook index inside this specific closure call
      const hookIndex = currentHook;

      // Initialize the state if it doesn't exist yet
      if (hooks[hookIndex] === undefined) {
        hooks[hookIndex] = initialValue;
      }

      // The setter function CLOSES OVER the `hookIndex` variable.
      // Even though useState finishes executing, setState remembers `hookIndex`.
      const setState = (newValue) => {
        hooks[hookIndex] = newValue;
      };

      currentHook++; // Move to the next hook for any subsequent useState/useEffect calls
      
      return [hooks[hookIndex], setState];
    },

    useEffect(callback, dependencyArray) {
      const hasNoDependencies = !dependencyArray;
      const dependencies = hooks[currentHook]; // The old dependencies stored from the last render
      
      // Check if any dependency has changed (or if no dependencies were provided)
      const hasChangedDependencies = dependencies 
        ? !dependencyArray.every((el, i) => el === dependencies[i])
        : true;

      if (hasNoDependencies || hasChangedDependencies) {
        callback();
        hooks[currentHook] = dependencyArray; // Store the new dependencies for the next render
      }
      
      currentHook++; // Move to the next hook
    }
  };
})();

// ==========================================
// Let's use our React Polyfill!
// ==========================================

function Counter() {
  const [count, setCount] = React.useState(0);
  const [text, setText] = React.useState("apple");

  React.useEffect(() => {
    console.log(`EFFECT RAN: Count is now ${count}`);
  }, [count]);

  return {
    click: () => setCount(count + 1),
    type: (newText) => setText(newText),
    render: () => console.log(`UI: Current count is ${count}, text is ${text}`)
  };
}

// SIMULATING A REACT APP
console.log("--- Initial Render ---");
let App = React.render(Counter);
App.render(); 
// UI: Current count is 0, text is apple
// EFFECT RAN: Count is now 0

console.log("\n--- Simulating Button Click ---");
App.click(); // Update state inside the closure

console.log("\n--- Second Render ---");
App = React.render(Counter); // Re-run the component
App.render();
// UI: Current count is 1, text is apple
// EFFECT RAN: Count is now 1

console.log("\n--- Simulating Typing ---");
App.type("banana");

console.log("\n--- Third Render ---");
App = React.render(Counter);
App.render();
// UI: Current count is 1, text is banana
// Notice: Effect does NOT run here, because `count` didn't change!

const value = { number: 10 };

const multiply = (x = { ...value }) => {
    console.log((x.number *= 2));
};

multiply();
multiply();
multiply(value);
multiply(value);
multiply({...value});
multiply({ ...value });


// Execution Breakdown
// Call	x Value(Before Call)	Modified Value(x.number *= 2)	Console Output
// multiply()	{ number: 10 } (new copy)	{ number: 20 } 20
// multiply()	{ number: 10 } (new copy)	{ number: 20 } 20
// multiply(value)	{ number: 10 } (original)	{ number: 20 }	20
// multiply(value)	{ number: 20 } (modified original) { number: 40 } 40
// multiply({ ...value })	{ number: 10 } (new copy)	{ number: 20 } 20
// multiply({ ...value })	{ number: 10 } (new copy)	{ number: 20 } 20
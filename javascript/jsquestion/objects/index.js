const obj = { a: 'one', b: 'two', a: 'three' };
console.log(obj);

// { a: 'three', b: 'two'}
// order will remain same but it will update it next vaue



const a = {};
const b = { key: 'b' };
const c = { key: 'c' };

a[b] = 123;
a[c] = 456;

console.log(a[b]);


// Object keys are automatically converted into strings.
// We are trying to set an object as a key to object a, with the value of 123.
// However, when we stringify an object, it becomes "[object Object]".


// function getInfo(member, year) {
//     member.name = 'Lydia';
//     year = '1998';
// }

// const person = { name: 'Sarah' };
// const birthYear = '1997';

// getInfo(person, birthYear);

// console.log(person, birthYear);

//Arguments are passed by value,
//unless their value is an object, then they're passed by reference.




// const person = { name: 'Lydia' };

// Object.defineProperty(person, 'age', { value: 21 });

// console.log(person);
// console.log(Object.keys(person));



// With the defineProperty method, we can add new properties to an object, or modify existing ones.When we add a property to an object using the defineProperty method, they are by default not enumerable.The Object.keys method returns all enumerable property names from an object, in this case only "name".

// Properties added using the defineProperty method are immutable by default




// const settings = {
//     username: 'lydiahallie',
//     level: 19,
//     health: 90,
// };

// const data = JSON.stringify(settings, ['level', 'health']);
// console.log(data);

/*
The second argument of JSON.stringify is the replacer. The replacer can either be a function or an array, and lets you control what and how the values should be stringified.

If the replacer is an array, only the property names included in the array will be added to the JSON string. In this case, only the properties with the names "level" and "health" are included, "username" is excluded. data is now equal to "{"level":19, "health":90}".

If the replacer is a function, this function gets called on every property in the object you're stringifying. The value returned from this function will be the value of the property when it's added to the JSON string. If the value is undefined, this property is excluded from the JSON string.



*/



function Employee(id, name) {
    this.empId = id;
    this.empName = name;
}
function Manager(id, name, department) {
    Employee.call(this, id, name);
    this.dept = department;
}
var newManager = new Manager(34, "Alex Smith", "Sales");
console.log(newManager.empId); //



var status = '😎';

setTimeout(() => {
    const status = '😍';

    const data = {
        status: '🥑',
        getStatus() {
            return this.status;
        },
    };

    console.log(data.getStatus());
    console.log(data.getStatus.call(this));
}, 0);





let du = {
    price: 199,
    get: function () {
        return this.price;
    },
};
let r = Object.create(du);
r.price = 299;
//delete r.price;
console.log(r.get(), r.__proto__.get(), r);

const o1 = {
    x: 10, y: 20
};

let o2 = o1;
o2.x = 100;
console.log(o1.x, o2.x, o1, o2)



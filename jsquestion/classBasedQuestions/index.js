class Chameleon {
    static colorChange(newColor) {
        this.newColor = newColor;
        return this.newColor;
    }

    constructor({ newColor = 'green' } = {}) {
        this.newColor = newColor;
    }
}

const freddie = new Chameleon({ newColor: 'purple' });
console.log(freddie.colorChange('orange'));

// static methos can not be called by instances





class Dog {
    constructor(name) {
        this.name = name;
    }
};

class Labrador extends Dog {
    // 1
    constructor(name, size) {
        this.size = size;
    }
    // 2
    constructor(name, size) {
        super(name);
        this.size = size;
    }
    // 3
    constructor(size) {
        super(name);
        this.size = size;
    }
    // 4
    constructor(name, size) {
        this.name = name;
        this.size = size;
    }

};




// index.js
console.log('running index.js');
import { sum } from './sum.js';
console.log(sum(1, 2));

// sum.js
console.log('running sum.js');
export const sum = (a, b) => a + b;



/*

With the import keyword, all imported modules are pre-parsed. This means that the imported modules get run first, the code in the file which imports the module gets executed after.

This is a difference between require() in CommonJS and import! With require(), you can load dependencies on demand while the code is being run. If we would have used require instead of import, running index.js, running sum.js, 3 would have been logged to the console.

*/
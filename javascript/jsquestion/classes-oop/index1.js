
class Dog {
    constructor(name, size) {
        this.name = name;
        this.size = size;
    }
};

class Labrador extends Dog {
    constructor(name, size, color) {
        super(name, size);
        this.color = color;
    }
};

const c1 = new Labrador('scooby', 'small', 'black')

console.log(c1)
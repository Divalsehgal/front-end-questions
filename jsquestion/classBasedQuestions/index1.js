
class Dog {
    constructor(name) {
        this.name = name;
    }
};

class Labrador extends Dog {

    constructor(name, size) {
        super(name);
        this.size = size;
    }
};

const c1=new Labrador('scooby','small')

console.log(c1)
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
const freddie1 = new Chameleon();

console.log(freddie.colorChange('orange'), freddie1.newColor);

// static methos can not be called by instances

